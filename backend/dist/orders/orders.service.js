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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const SHIPPING_FEE = 250;
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createFromCart(userId, addressId, paymentMethod, couponCode) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true, variant: true } } },
        });
        if (!cart || cart.items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        let total = 0;
        for (const item of cart.items) {
            const price = item.variant
                ? Number(item.variant.price)
                : Number(item.product.discountPrice ?? item.product.price);
            total += price * item.quantity;
        }
        let couponId;
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
    async createFromItems(userId, addressId, items, paymentMethod, couponCode) {
        if (!items || items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        const resolvedItems = [];
        let total = 0;
        for (const it of items) {
            const product = await this.prisma.product.findUnique({
                where: { id: it.productId },
                include: { variants: true },
            });
            if (!product)
                throw new common_1.BadRequestException('Product not found');
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
        let couponId;
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
    findAllForUser(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: true } }, payment: true, address: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(userId, orderId, isAdmin) {
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
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (!isAdmin && order.userId !== userId)
            throw new common_1.NotFoundException('Order not found');
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
    async updateStatus(orderId, status) {
        const order = await this.prisma.order.update({ where: { id: orderId }, data: { status } });
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map