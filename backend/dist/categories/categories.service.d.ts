import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        children: {
            name: string;
            id: string;
            slug: string;
            image: string | null;
            parentId: string | null;
        }[];
    } & {
        name: string;
        id: string;
        slug: string;
        image: string | null;
        parentId: string | null;
    })[]>;
    findOne(slug: string): Promise<{
        children: {
            name: string;
            id: string;
            slug: string;
            image: string | null;
            parentId: string | null;
        }[];
    } & {
        name: string;
        id: string;
        slug: string;
        image: string | null;
        parentId: string | null;
    }>;
    create(data: {
        name: string;
        slug: string;
        image?: string;
        parentId?: string;
    }): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        name: string;
        id: string;
        slug: string;
        image: string | null;
        parentId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: any): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        name: string;
        id: string;
        slug: string;
        image: string | null;
        parentId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        slug: string;
        image: string | null;
        parentId: string | null;
    }>;
}
