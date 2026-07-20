import { IsBoolean, IsDateString, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateCouponDto {
  @IsString()
  code: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  discountPercent: number;

  @IsDateString()
  expiryDate: string;

  @IsOptional()
  @IsInt()
  usageLimit?: number;
}

export class UpdateCouponDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  discountPercent?: number;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  usageLimit?: number;
}
