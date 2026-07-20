import { PrismaService } from '../prisma/prisma.service';
export declare class WishlistService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): Promise<({
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
    add(userId: string, productId: string): Promise<{
        id: string;
        productId: string;
        userId: string;
    }>;
    remove(userId: string, productId: string): import(".prisma/client").Prisma.Prisma__WishlistClient<{
        id: string;
        productId: string;
        userId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
