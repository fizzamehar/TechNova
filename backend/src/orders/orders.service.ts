import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Flat standard shipping fee applied to every order (matches the frontend's
// cart/checkout display), in PKR.
const SHIPPING_FEE = 250;

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Build an order from the server-side Cart — main checkout logic
  async createFromCart(userId: string, addressId: string, paymentMethod: string, couponCode?: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true, variant: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    let total = 0;
    for (const item of cart.items) {
      const price = item.variant
        ? Number(item.variant.price)
        : Number(item.product.discountPrice ?? item.product.price);
      total += price * item.quantity;
    }

    let couponId: string | undefined;
    if (couponCode) {
      const coupon = await this.prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
      const withinLimit = !coupon?.usageLimit || coupon.usedCount < coupon.usageLimit;
      if (coupon && coupon.isActive && coupon.expiryDate > new Date() && withinLimit) {
        total = total - (total * coupon.discountPercent) / 100;
        couponId = coupon.id;
      }
    }

    total += SHIPPING_FEE;

    const order = await this.prisma.order.create({
      data: {
        userId,
        addressId,
        totalAmount: total,
        couponId,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.variant
              ? item.variant.price
              : (item.product.discountPrice ?? item.product.price),
          })),
        },
        payment: {
          create: { method: paymentMethod, status: 'PENDING' },
        },
      },
      include: { items: true, payment: true },
    });

    for (const item of cart.items) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    if (couponId) {
      await this.prisma.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    await this.prisma.notification.create({
      data: {
        userId,
        message: `Your order #${order.id.slice(0, 8)} has been confirmed. Total: Rs ${total.toFixed(0)}`,
      },
    });

    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return order;
  }

  // The frontend cart lives client-side (localStorage) and never syncs with the
  // backend Cart table, so checkout builds the order directly from the item
  // list sent by the frontend.
  async createFromItems(
    userId: string,
    addressId: string,
    items: { productId: string; variantId?: string | null; quantity: number }[],
    paymentMethod: string,
    couponCode?: string,
  ) {
    if (!items || items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const resolvedItems: { productId: string; variantId: string | null; quantity: number; price: number }[] = [];
    let total = 0;

    for (const it of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: it.productId },
        include: { variants: true },
      });
      if (!product) throw new BadRequestException('Product not found');

      const variant = it.variantId ? product.variants.find((v) => v.id === it.variantId) : null;
      const price = variant ? Number(variant.price) : Number(product.discountPrice ?? product.price);
      total += price * it.quantity;
      resolvedItems.push({
        productId: product.id,
        variantId: variant?.id ?? null,
        quantity: it.quantity,
        price,
      });
    }

    let couponId: string | undefined;
    if (couponCode) {
      const coupon = await this.prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
      const withinLimit = !coupon?.usageLimit || coupon.usedCount < coupon.usageLimit;
      if (coupon && coupon.isActive && coupon.expiryDate > new Date() && withinLimit) {
        total = total - (total * coupon.discountPercent) / 100;
        couponId = coupon.id;
      }
    }

    total += SHIPPING_FEE;

    const order = await this.prisma.order.create({
      data: {
        userId,
        addressId,
        totalAmount: total,
        couponId,
        items: { create: resolvedItems },
        payment: { create: { method: paymentMethod, status: 'PENDING' } },
      },
      include: { items: true, payment: true },
    });

    for (const item of resolvedItems) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    if (couponId) {
      await this.prisma.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    await this.prisma.notification.create({
      data: {
        userId,
        message: `Your order #${order.id.slice(0, 8)} has been confirmed. Total: Rs ${total.toFixed(0)}`,
      },
    });

    return order;
  }

  findAllForUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } }, payment: true, address: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, orderId: string, isAdmin: boolean) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true, variant: true } },
        payment: true,
        address: true,
        coupon: true,
        user: { select: { name: true, email: true, phone: true } },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (!isAdmin && order.userId !== userId) throw new NotFoundException('Order not found');
    return order;
  }

  findAllAdmin() {
    return this.prisma.order.findMany({
      include: {
        items: { include: { product: true, variant: true } },
        payment: true,
        address: true,
        coupon: true,
        user: { select: { name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(orderId: string, status: any) {
    const order = await this.prisma.order.update({ where: { id: orderId }, data: { status } });

    // Once an order is marked DELIVERED, the money has been collected
    // (COD is paid at the door; card/wallet payments are already PAID via
    // their webhook by this point) — so flip the Payment record to PAID
    // if it isn't already. Without this, delivered COD orders never count
    // toward admin dashboard revenue, since revenue is summed only from
    // orders whose payment.status === 'PAID'.
    if (status === 'DELIVERED') {
      await this.prisma.payment.updateMany({
        where: { orderId, status: { not: 'PAID' } },
        data: { status: 'PAID' },
      });
    }

    await this.prisma.notification.create({
      data: {
        userId: order.userId,
        message: `Order #${order.id.slice(0, 8)} status updated: ${status}`,
      },
    });
    return order;
  }
}