export declare class CreateProductDto {
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice?: number;
    stock: number;
    images: string[];
    brand: string;
    categoryId: string;
    specs?: Record<string, any>;
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    discountPrice?: number;
    stock?: number;
    images?: string[];
    brand?: string;
    categoryId?: string;
    specs?: Record<string, any>;
}
