import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Customer-facing listing — with filters (category, price range, brand, search)
  async findAll(query: {
    categorySlug?: string;
    minPrice?: string;
    maxPrice?: string;
    brand?: string;
    search?: string;
    page?: string;
    limit?: string;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;

    const where: any = {};

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
      if (query.minPrice) where.price.gte = Number(query.minPrice);
      if (query.maxPrice) where.price.lte = Number(query.maxPrice);
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

  async findOne(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: true,
        reviews: { include: { user: { select: { name: true, avatar: true } } } },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // For admin — only the ADMIN role can reach this method (guarded on the controller)
  create(dto: CreateProductDto) {
    return this.prisma.product.create({ data: dto as any });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.ensureExists(id);
    return this.prisma.product.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.product.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
  }
}
