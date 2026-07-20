export declare class CreateCouponDto {
    code: string;
    discountPercent: number;
    expiryDate: string;
    usageLimit?: number;
}
export declare class UpdateCouponDto {
    discountPercent?: number;
    expiryDate?: string;
    isActive?: boolean;
    usageLimit?: number;
}
