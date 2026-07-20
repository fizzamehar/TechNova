import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async dashboardSummary() {
    const [totalRevenue, totalOrders, totalUsers, totalProducts, pendingTickets, lowStock] = await Promise.all([
      this.totalPaidRevenue(),
      this.prisma.order.count(),
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
      this.prisma.product.count(),
      this.prisma.supportTicket.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
      this.prisma.product.count({ where: { stock: { lte: 5 } } }),
    ]);

    return { totalRevenue, totalOrders, totalUsers, totalProducts, pendingTickets, lowStock };
  }

  // The Payment model doesn't store an amount (order.totalAmount is the source
  // of truth), so revenue is derived by summing totalAmount across paid orders
  private async totalPaidRevenue() {
    const paidOrders = await this.prisma.order.findMany({
      where: { payment: { status: 'PAID' } },
      select: { totalAmount: true },
    });
    return paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  }

  async salesOverTime(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const orders = await this.prisma.order.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, totalAmount: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by day
    const byDay = new Map<string, number>();
    for (const order of orders) {
      const day = order.createdAt.toISOString().slice(0, 10);
      byDay.set(day, (byDay.get(day) ?? 0) + order.totalAmount);
    }
    return Array.from(byDay.entries()).map(([date, revenue]) => ({ date, revenue }));
  }

  async topSellingProducts(limit = 5) {
    const grouped = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });

    const productIds = grouped.map((g) => g.productId);
    const products = await this.prisma.product.findMany({ where: { id: { in: productIds } } });

    return grouped.map((g) => ({
      product: products.find((p) => p.id === g.productId),
      unitsSold: g._sum.quantity ?? 0,
    }));
  }

  async orderStatusBreakdown() {
    const statuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;
    const counts = await Promise.all(
      statuses.map((status) => this.prisma.order.count({ where: { status } })),
    );
    return statuses.map((status, i) => ({ status, count: counts[i] }));
  }

  lowStockProducts(threshold = 5) {
    return this.prisma.product.findMany({
      where: { stock: { lte: threshold } },
      orderBy: { stock: 'asc' },
      select: { id: true, name: true, stock: true, slug: true },
    });
  }

  async toggleUserBlock(userId: string, block: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isBlocked: block },
      select: { id: true, name: true, email: true, isBlocked: true },
    });
  }

  listUsers() {
    return this.prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: { id: true, name: true, email: true, phone: true, isBlocked: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
