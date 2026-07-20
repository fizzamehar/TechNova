import { IsString, IsNumber, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  discountPrice?: number;

  @IsNumber()
  stock: number;

  @IsArray()
  images: string[];

  @IsString()
  brand: string;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  specs?: Record<string, any>;
}

export class UpdateProductDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber() price?: number;
  @IsOptional() @IsNumber() discountPrice?: number;
  @IsOptional() @IsNumber() stock?: number;
  @IsOptional() @IsArray() images?: string[];
  @IsOptional() @IsString() brand?: string;
  @IsOptional() @IsUUID() categoryId?: string;
  @IsOptional() specs?: Record<string, any>;
}
