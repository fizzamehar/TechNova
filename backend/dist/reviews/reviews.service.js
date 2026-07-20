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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReviewsService = class ReviewsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const hasPurchased = await this.prisma.orderItem.findFirst({
            where: {
                productId: dto.productId,
                order: { userId, status: 'DELIVERED' },
            },
        });
        if (!hasPurchased) {
            throw new common_1.ForbiddenException('A review can only be left on a delivered product');
        }
        const existing = await this.prisma.review.findFirst({
            where: { userId, productId: dto.productId },
        });
        if (existing) {
            throw new common_1.BadRequestException("You've already reviewed this product");
        }
        return this.prisma.review.create({
            data: {
                userId,
                productId: dto.productId,
                rating: dto.rating,
                comment: dto.comment,
            },
        });
    }
    findForProduct(productId) {
        return this.prisma.review.findMany({
            where: { productId },
            include: { user: { select: { name: true, avatar: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async productRatingSummary(productId) {
        const agg = await this.prisma.review.aggregate({
            where: { productId },
            _avg: { rating: true },
            _count: { rating: true },
        });
        return {
            average: agg._avg.rating ?? 0,
            count: agg._count.rating,
        };
    }
    findAllAdmin() {
        return this.prisma.review.findMany({
            include: {
                user: { select: { name: true, email: true } },
                product: { select: { name: true, slug: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async remove(id, userId, isAdmin) {
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        if (!isAdmin && review.userId !== userId)
            throw new common_1.ForbiddenException('This review is not yours');
        return this.prisma.review.delete({ where: { id } });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map