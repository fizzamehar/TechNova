import { PrismaService } from '../prisma/prisma.service';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    private getOrCreateCart;
    getCart(userId: string): Promise<({
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
            productId: string;
            variantId: string | null;
            quantity: number;
            cartId: string;
        })[];
    } & {
        id: string;
        userId: string;
    }) | null>;
    addItem(userId: string, productId: string, variantId: string | null, quantity: number): Promise<{
        id: string;
        productId: string;
        variantId: string | null;
        quantity: number;
        cartId: string;
    }>;
    updateItem(userId: string, itemId: string, quantity: number): Promise<{
        id: string;
        productId: string;
        variantId: string | null;
        quantity: number;
        cartId: string;
    }>;
    removeItem(userId: string, itemId: string): Promise<{
        id: string;
        productId: string;
        variantId: string | null;
        quantity: number;
        cartId: string;
    }>;
    clearCart(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
