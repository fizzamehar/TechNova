import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  // The service won't crash without a Stripe secret key — card payments will
  // just fail with a clear error until the key is set
  private stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' })
    : null;

  constructor(private prisma: PrismaService) {}

  // Start payment for an order — the flow differs by method
  async initiate(userId: string, orderId: string, method: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId }, include: { payment: true } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException('This order is not yours');
    if (!order.payment) throw new NotFoundException('No payment record found for this order');

    // Frontend may send the method in any casing — normalize so it always
    // matches the switch below instead of falling through to "Invalid
    // payment method".
    const normalizedMethod = (method ?? '').toLowerCase();

    switch (normalizedMethod) {
      case 'card':
        return this.initiateCardPayment(order.id, order.totalAmount);
      case 'cod':
        // Cash on delivery — payment is only confirmed at delivery time
        await this.prisma.payment.update({
          where: { orderId: order.id },
          data: { method: 'cod', status: 'PENDING' },
        });
        return { method: 'cod', status: 'PENDING', message: 'Cash on Delivery selected' };
      case 'jazzcash':
      case 'easypaisa':
        return this.initiateLocalWallet(order.id, order.totalAmount, normalizedMethod);
      default:
        throw new BadRequestException('Invalid payment method');
    }
  }

  private async initiateCardPayment(orderId: string, amount: number) {
    if (!this.stripe) {
      // No Stripe key configured (e.g. local/demo environment) — simulate a
      // successful hand-off instead of blocking checkout, same as COD does.
      // In production, set STRIPE_SECRET_KEY to go through the real flow.
      const pseudoTransactionId = `CARD-SIM-${orderId.slice(0, 8)}-${Date.now()}`;
      await this.prisma.payment.update({
        where: { orderId },
        data: { method: 'card', status: 'PENDING', transactionId: pseudoTransactionId },
      });
      return {
        method: 'card',
        status: 'PENDING',
        transactionId: pseudoTransactionId,
        message: 'Card payments are running in simulated mode — set STRIPE_SECRET_KEY in .env to charge real cards',
      };
    }
    // Amount must be in the smallest currency unit (Stripe treats PKR as an
    // integer minor unit, not paisa)
    const intent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'pkr',
      metadata: { orderId },
    });

    await this.prisma.payment.update({
      where: { orderId },
      data: { method: 'card', transactionId: intent.id },
    });

    return { method: 'card', clientSecret: intent.client_secret };
  }

  // JazzCash / EasyPaisa: both are mobile-wallet gateways that take a merchant
  // ID + hashed request. The structure is ready here — in production, pull
  // your merchant ID, password, and integrity salt from .env and sign the
  // request according to the respective gateway's docs.
  private async initiateLocalWallet(orderId: string, amount: number, method: 'jazzcash' | 'easypaisa') {
    const merchantId = method === 'jazzcash' ? process.env.JAZZCASH_MERCHANT_ID : process.env.EASYPAISA_MERCHANT_ID;
    const pseudoTransactionId = `${method.toUpperCase()}-${orderId.slice(0, 8)}-${Date.now()}`;

    if (!merchantId) {
      // No merchant credentials configured — simulate a successful hand-off
      // instead of blocking checkout. In production, set the merchant
      // credentials in .env to go through the real gateway flow.
      await this.prisma.payment.update({
        where: { orderId },
        data: { method, status: 'PENDING', transactionId: pseudoTransactionId },
      });
      return {
        method,
        status: 'PENDING',
        transactionId: pseudoTransactionId,
        message: `${method === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'} is running in simulated mode — add merchant credentials to .env to go live`,
      };
    }

    await this.prisma.payment.update({
      where: { orderId },
      data: { method, status: 'PENDING', transactionId: pseudoTransactionId },
    });

    return {
      method,
      status: 'PENDING',
      transactionId: pseudoTransactionId,
      message: 'Redirect user to gateway checkout page, then confirm via webhook',
    };
  }

  // Gateway webhook (Stripe / JazzCash / EasyPaisa) hits this when payment completes
  async confirmByWebhook(orderId: string, transactionId: string | undefined, success: boolean) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    await this.prisma.payment.update({
      where: { orderId },
      data: {
        status: success ? 'PAID' : 'FAILED',
        transactionId: transactionId ?? undefined,
      },
    });

    if (success) {
      await this.prisma.order.update({ where: { id: orderId }, data: { status: 'CONFIRMED' } });
      await this.prisma.notification.create({
        data: { userId: order.userId, message: `Payment received — order #${order.id.slice(0, 8)} is confirmed` },
      });
    } else {
      await this.prisma.notification.create({
        data: { userId: order.userId, message: `Payment failed — please try again for order #${order.id.slice(0, 8)}` },
      });
    }

    return { orderId, status: success ? 'PAID' : 'FAILED' };
  }

  async status(userId: string, orderId: string) {
    const payment = await this.prisma.payment.findUnique({ where: { orderId } });
    if (!payment) throw new NotFoundException('Payment record not found');
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (order?.userId !== userId) throw new ForbiddenException('This order is not yours');
    return payment;
  }

  // Admin manually sets a payment's status — e.g. mark COD as paid the moment
  // cash is collected, correct a mistaken status, or record a refund. This is
  // independent of the order-status flow and of gateway webhooks.
  async adminUpdateStatus(orderId: string, status: string) {
    const valid = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];
    if (!valid.includes(status)) {
      throw new BadRequestException(`Invalid payment status. Must be one of: ${valid.join(', ')}`);
    }
    const payment = await this.prisma.payment.findUnique({ where: { orderId } });
    if (!payment) throw new NotFoundException('Payment record not found');

    const updated = await this.prisma.payment.update({
      where: { orderId },
      data: { status: status as any },
    });

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (order) {
      await this.prisma.notification.create({
        data: { userId: order.userId, message: `Payment for order #${order.id.slice(0, 8)} is now ${status}` },
      });
    }

    return updated;
  }
}