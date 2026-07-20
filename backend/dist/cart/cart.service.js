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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CartService = class CartService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreateCart(userId) {
        let cart = await this.prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await this.prisma.cart.create({ data: { userId } });
        }
        return cart;
    }
    async getCart(userId) {
        const cart = await this.getOrCreateCart(userId);
        return this.prisma.cart.findUnique({
            where: { id: cart.id },
            include: { items: { include: { product: true, variant: true } } },
        });
    }
    async addItem(userId, productId, variantId, quantity) {
        const cart = await this.getOrCreateCart(userId);
        const existing = await this.prisma.cartItem.findFirst({
            where: { cartId: cart.id, productId, variantId: variantId ?? null },
        });
        if (existing) {
            return this.prisma.cartItem.update({
                where: { id: existing.id },
                data: { quantity: existing.quantity + quantity },
            });
        }
        return this.prisma.cartItem.create({
            data: { cartId: cart.id, productId, variantId, quantity },
        });
    }
    async updateItem(userId, itemId, quantity) {
        const item = await this.prisma.cartItem.findUnique({ where: { id: itemId }, include: { cart: true } });
        if (!item || item.cart.userId !== userId)
            throw new common_1.NotFoundException('Cart item not found');
        return this.prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
    }
    async removeItem(userId, itemId) {
        const item = await this.prisma.cartItem.findUnique({ where: { id: itemId }, include: { cart: true } });
        if (!item || item.cart.userId !== userId)
            throw new common_1.NotFoundException('Cart item not found');
        return this.prisma.cartItem.delete({ where: { id: itemId } });
    }
    async clearCart(userId) {
        const cart = await this.getOrCreateCart(userId);
        return this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map