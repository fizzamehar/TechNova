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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const where = {};
        if (query.categorySlug) {
            where.category = { slug: query.categorySlug };
        }
        if (query.brand) {
            where.brand = query.brand;
        }
        if (query.search) {
            where.name = { contains: query.search, mode: 'insensitive' };
        }
        if (query.minPrice || query.maxPrice) {
            where.price = {};
            if (query.minPrice)
                where.price.gte = Number(query.minPrice);
            if (query.maxPrice)
                where.price.lte = Number(query.maxPrice);
        }
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: { category: true, variants: true },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.product.count({ where }),
        ]);
        return { products, total, page, totalPages: Math.ceil(total / limit) };
    }
    async findOne(slug) {
        const product = await this.prisma.product.findUnique({
            where: { slug },
            include: {
                category: true,
                variants: true,
                reviews: { include: { user: { select: { name: true, avatar: true } } } },
            },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    create(dto) {
        return this.prisma.product.create({ data: dto });
    }
    async update(id, dto) {
        await this.ensureExists(id);
        return this.prisma.product.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.ensureExists(id);
        return this.prisma.product.delete({ where: { id } });
    }
    async ensureExists(id) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map