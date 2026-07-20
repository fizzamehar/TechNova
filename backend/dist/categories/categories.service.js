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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoriesService = class CategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.category.findMany({
            where: { parentId: null },
            include: { children: true },
        });
    }
    async findOne(slug) {
        const category = await this.prisma.category.findUnique({
            where: { slug },
            include: { children: true },
        });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        return category;
    }
    create(data) {
        return this.prisma.category.create({ data });
    }
    update(id, data) {
        return this.prisma.category.update({ where: { id }, data });
    }
    async remove(id) {
        const productCount = await this.prisma.product.count({ where: { categoryId: id } });
        if (productCount > 0) {
            throw new common_1.BadRequestException(`This category is used by ${productCount} product(s) — change those products' category or delete them first.`);
        }
        return this.prisma.category.delete({ where: { id } });
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map