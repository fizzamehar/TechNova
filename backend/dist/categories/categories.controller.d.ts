import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
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
    create(body: any): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        name: string;
        id: string;
        slug: string;
        image: string | null;
        parentId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, body: any): import(".prisma/client").Prisma.Prisma__CategoryClient<{
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
