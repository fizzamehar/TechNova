import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const rows = await this.prisma.wishlist.findMany({
      where: { userId },
      include: { product: { include: { category: true, variants: true } } },
      orderBy: { id: 'desc' },
    });
    // The frontend expects a plain array of Product objects (not the wishlist
    // join rows), so unwrap here.
    return rows.map((row) => row.product);
  }

  async add(userId: string, productId: string) {
    // Schema has @@unique([userId, productId]), so this can never create a duplicate
    return this.prisma.wishlist.upsert({
      where: { userId_productId: { userId, productId } },
      update: {},
      create: { userId, productId },
    });
  }

  remove(userId: string, productId: string) {
    return this.prisma.wishlist.delete({
      where: { userId_productId: { userId, productId } },
    });
  }
}
