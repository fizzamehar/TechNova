import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    summary(): Promise<{
        totalRevenue: number;
        totalOrders: number;
        totalUsers: number;
        totalProducts: number;
        pendingTickets: number;
        lowStock: number;
    }>;
    sales(days?: string): Promise<{
        date: string;
        revenue: number;
    }[]>;
    topProducts(limit?: string): Promise<{
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
    orderStatus(): Promise<{
        status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
        count: number;
    }[]>;
    lowStock(threshold?: string): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        slug: string;
        stock: number;
    }[]>;
    listUsers(): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        email: string;
        id: string;
        phone: string | null;
        isBlocked: boolean;
        createdAt: Date;
    }[]>;
    blockUser(id: string, body: {
        block: boolean;
    }): Promise<{
        name: string;
        email: string;
        id: string;
        isBlocked: boolean;
    }>;
}
