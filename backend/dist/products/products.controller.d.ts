import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    findAll(query: any): Promise<{
        products: ({
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
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(slug: string): Promise<{
        category: {
            name: string;
            id: string;
            slug: string;
            image: string | null;
            parentId: string | null;
        };
        reviews: ({
            user: {
                name: string;
                avatar: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            userId: string;
            rating: number;
            comment: string | null;
        })[];
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
    }>;
    create(dto: CreateProductDto): import(".prisma/client").Prisma.Prisma__ProductClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateProductDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
