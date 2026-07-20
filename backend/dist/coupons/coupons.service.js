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
exports.CouponsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CouponsService = class CouponsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const existing = await this.prisma.coupon.findUnique({ where: { code: dto.code } });
        if (existing)
            throw new common_1.ConflictException('This coupon code already exists');
        return this.prisma.coupon.create({
            data: {
                code: dto.code.toUpperCase(),
                discountPercent: dto.discountPercent,
                expiryDate: new Date(dto.expiryDate),
                usageLimit: dto.usageLimit,
            },
        });
    }
    findAll() {
        return this.prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    }
    async findOne(id) {
        const coupon = await this.prisma.coupon.findUnique({ where: { id } });
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found');
        return coupon;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.coupon.update({
            where: { id },
            data: {
                ...dto,
                expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.coupon.delete({ where: { id } });
    }
    async validate(code) {
        const coupon = await this.prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
        if (!coupon)
            throw new common_1.BadRequestException('Invalid coupon code');
        if (!coupon.isActive)
            throw new common_1.BadRequestException('This coupon is no longer active');
        if (coupon.expiryDate < new Date())
            throw new common_1.BadRequestException('This coupon has expired');
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            throw new common_1.BadRequestException('This coupon has reached its usage limit');
        }
        return {
            code: coupon.code,
            discountPercent: coupon.discountPercent,
            valid: true,
        };
    }
};
exports.CouponsService = CouponsService;
exports.CouponsService = CouponsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CouponsService);
//# sourceMappingURL=coupons.service.js.map