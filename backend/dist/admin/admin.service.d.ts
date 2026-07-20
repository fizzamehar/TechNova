import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    dashboardSummary(): Promise<{
        totalRevenue: number;
        totalOrders: number;
        totalUsers: number;
        totalProducts: number;
        pendingTickets: number;
        lowStock: number;
    }>;
    private totalPaidRevenue;
    salesOverTime(days?: number): Promise<{
        date: string;
        revenue: number;
    }[]>;
    topSellingProducts(limit?: number): Promise<{
        product: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string;
            price: number;
            discountPrice: number | null;
            stock: number;
            images: string[];
            brand: string | null;
            categoryId: string;
            specs: import("@prisma/client/runtime/library").JsonValue | null;
        } | undefined;
        unitsSold: number;
    }[]>;
    orderStatusBreakdown(): Promise<{
        status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
        count: number;
    }[]>;
    lowStockProducts(threshold?: number): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        slug: string;
        stock: number;
    }[]>;
    toggleUserBlock(userId: string, block: boolean): Promise<{
        name: string;
        email: string;
        id: string;
        isBlocked: boolean;
    }>;
    listUsers(): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        email: string;
        id: string;
        phone: string | null;
        isBlocked: boolean;
        createdAt: Date;
    }[]>;
}
