import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/review.dto';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateReviewDto): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        userId: string;
        rating: number;
        comment: string | null;
    }>;
    findForProduct(productId: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    })[]>;
    productRatingSummary(productId: string): Promise<{
        average: number;
        count: number;
    }>;
    findAllAdmin(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            name: string;
            email: string;
        };
        product: {
            name: string;
            slug: string;
        };
    } & {
        id: string;
        createdAt: Date;
        productId: string;
        userId: string;
        rating: number;
        comment: string | null;
    })[]>;
    remove(id: string, userId: string, isAdmin: boolean): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        userId: string;
        rating: number;
        comment: string | null;
    }>;
}
