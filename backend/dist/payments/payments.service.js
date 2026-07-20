"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const stripe_1 = require("stripe");
const prisma_service_1 = require("../prisma/prisma.service");
let PaymentsService = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.stripe = process.env.STRIPE_SECRET_KEY
            ? new stripe_1.default(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' })
            : null;
    }
    async initiate(userId, orderId, method) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId }, include: { payment: true } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.userId !== userId)
            throw new common_1.ForbiddenException('This order is not yours');
        if (!order.payment)
            throw new common_1.NotFoundException('No payment record found for this order');
        const normalizedMethod = (method ?? '').toLowerCase();
        switch (normalizedMethod) {
            case 'card':
                return this.initiateCardPayment(order.id, order.totalAmount);
            case 'cod':
                await this.prisma.payment.update({
                    where: { orderId: order.id },
                    data: { method: 'cod', status: 'PENDING' },
                });
                return { method: 'cod', status: 'PENDING', message: 'Cash on Delivery selected' };
            case 'jazzcash':
            case 'easypaisa':
                return this.initiateLocalWallet(order.id, order.totalAmount, normalizedMethod);
            default:
                throw new common_1.BadRequestException('Invalid payment method');
        }
    }
    async initiateCardPayment(orderId, amount) {
        if (!this.stripe) {
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
    async initiateLocalWallet(orderId, amount, method) {
        const merchantId = method === 'jazzcash' ? process.env.JAZZCASH_MERCHANT_ID : process.env.EASYPAISA_MERCHANT_ID;
        const pseudoTransactionId = `${method.toUpperCase()}-${orderId.slice(0, 8)}-${Date.now()}`;
        if (!merchantId) {
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
    async confirmByWebhook(orderId, transactionId, success) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
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
        }
        else {
            await this.prisma.notification.create({
                data: { userId: order.userId, message: `Payment failed — please try again for order #${order.id.slice(0, 8)}` },
            });
        }
        return { orderId, status: success ? 'PAID' : 'FAILED' };
    }
    async status(userId, orderId) {
        const payment = await this.prisma.payment.findUnique({ where: { orderId } });
        if (!payment)
            throw new common_1.NotFoundException('Payment record not found');
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (order?.userId !== userId)
            throw new common_1.ForbiddenException('This order is not yours');
        return payment;
    }
    async adminUpdateStatus(orderId, status) {
        const valid = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];
        if (!valid.includes(status)) {
            throw new common_1.BadRequestException(`Invalid payment status. Must be one of: ${valid.join(', ')}`);
        }
        const payment = await this.prisma.payment.findUnique({ where: { orderId } });
        if (!payment)
            throw new common_1.NotFoundException('Payment record not found');
        const updated = await this.prisma.payment.update({
            where: { orderId },
            data: { status: status },
        });
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (order) {
            await this.prisma.notification.create({
                data: { userId: order.userId, message: `Payment for order #${order.id.slice(0, 8)} is now ${status}` },
            });
        }
        return updated;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map