import { OrdersService } from './orders.service';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    checkout(req: any, body: {
        addressId: string;
        paymentMethod: string;
        couponCode?: string;
        items: {
            productId: string;
            variantId?: string | null;
            quantity: number;
        }[];
    }): Promise<{
        payment: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            transactionId: string | null;
            method: string;
        } | null;
        items: {
            id: string;
            price: number;
            productId: string;
            orderId: string;
            variantId: string | null;
            quantity: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        addressId: string;
        totalAmount: number;
        couponId: string | null;
    }>;
    myOrders(req: any): import(".prisma/client").Prisma.PrismaPromise<({
        address: {
            id: string;
            createdAt: Date;
            userId: string;
            label: string;
            street: string;
            city: string;
            country: string;
            isDefault: boolean;
        };
        payment: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            transactionId: string | null;
            method: string;
        } | null;
        items: ({
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
            };
        } & {
            id: string;
            price: number;
            productId: string;
            orderId: string;
            variantId: string | null;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        addressId: string;
        totalAmount: number;
        couponId: string | null;
    })[]>;
    findOne(req: any, id: string): Promise<{
        user: {
            name: string;
            email: string;
            phone: string | null;
        };
        address: {
            id: string;
            createdAt: Date;
            userId: string;
            label: string;
            street: string;
            city: string;
            country: string;
            isDefault: boolean;
        };
        payment: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            transactionId: string | null;
            method: string;
        } | null;
        coupon: {
            id: string;
            createdAt: Date;
            code: string;
            discountPercent: number;
            expiryDate: Date;
            isActive: boolean;
            usageLimit: number | null;
            usedCount: number;
        } | null;
        items: ({
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
            };
            variant: {
                id: string;
                price: number;
                stock: number;
                productId: string;
                color: string | null;
                storage: string | null;
            } | null;
        } & {
            id: string;
            price: number;
            productId: string;
            orderId: string;
            variantId: string | null;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        addressId: string;
        totalAmount: number;
        couponId: string | null;
    }>;
    findAllAdmin(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            name: string;
            email: string;
            phone: string | null;
        };
        address: {
            id: string;
            createdAt: Date;
            userId: string;
            label: string;
            street: string;
            city: string;
            country: string;
            isDefault: boolean;
        };
        payment: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            transactionId: string | null;
            method: string;
        } | null;
        coupon: {
            id: string;
            createdAt: Date;
            code: string;
            discountPercent: number;
            expiryDate: Date;
            isActive: boolean;
            usageLimit: number | null;
            usedCount: number;
        } | null;
        items: ({
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
            };
            variant: {
                id: string;
                price: number;
                stock: number;
                productId: string;
                color: string | null;
                storage: string | null;
            } | null;
        } & {
            id: string;
            price: number;
            productId: string;
            orderId: string;
            variantId: string | null;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        addressId: string;
        totalAmount: number;
        couponId: string | null;
    })[]>;
    updateStatus(id: string, body: {
        status: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        addressId: string;
        totalAmount: number;
        couponId: string | null;
    }>;
}
