import { CartService } from './cart.service';
export declare class CartController {
    private cartService;
    constructor(cartService: CartService);
    getCart(req: any): Promise<({
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
    addItem(req: any, body: {
        productId: string;
        variantId?: string;
        quantity: number;
    }): Promise<{
        id: string;
        productId: string;
        variantId: string | null;
        quantity: number;
        cartId: string;
    }>;
    updateItem(req: any, itemId: string, body: {
        quantity: number;
    }): Promise<{
        id: string;
        productId: string;
        variantId: string | null;
        quantity: number;
        cartId: string;
    }>;
    removeItem(req: any, itemId: string): Promise<{
        id: string;
        productId: string;
        variantId: string | null;
        quantity: number;
        cartId: string;
    }>;
    clearCart(req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
