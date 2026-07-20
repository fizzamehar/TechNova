import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';
export declare class CouponsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateCouponDto): Promise<{
        id: string;
        createdAt: Date;
        code: string;
        discountPercent: number;
        expiryDate: Date;
        isActive: boolean;
        usageLimit: number | null;
        usedCount: number;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        code: string;
        discountPercent: number;
        expiryDate: Date;
        isActive: boolean;
        usageLimit: number | null;
        usedCount: number;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        code: string;
        discountPercent: number;
        expiryDate: Date;
        isActive: boolean;
        usageLimit: number | null;
        usedCount: number;
    }>;
    update(id: string, dto: UpdateCouponDto): Promise<{
        id: string;
        createdAt: Date;
        code: string;
        discountPercent: number;
        expiryDate: Date;
        isActive: boolean;
        usageLimit: number | null;
        usedCount: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        code: string;
        discountPercent: number;
        expiryDate: Date;
        isActive: boolean;
        usageLimit: number | null;
        usedCount: number;
    }>;
    validate(code: string): Promise<{
        code: string;
        discountPercent: number;
        valid: boolean;
    }>;
}
