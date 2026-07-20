import { WishlistService } from './wishlist.service';
export declare class WishlistController {
    private wishlistService;
    constructor(wishlistService: WishlistService);
    findAll(req: any): Promise<({
        category: {
            name: string;
            id: string;
            slug: string;
            image: string | null;
            parentId: string | null;
        };
        variants: {
            id: string;
            price: number;
            stock: number;
            productId: string;
            color: string | null;
            storage: string | null;
        }[];
    } & {
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
    })[]>;
    add(req: any, productId: string): Promise<{
        id: string;
        productId: string;
        userId: string;
    }>;
    remove(req: any, productId: string): import(".prisma/client").Prisma.Prisma__WishlistClient<{
        id: string;
        productId: string;
        userId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
