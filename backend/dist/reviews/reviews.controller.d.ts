import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/review.dto';
export declare class ReviewsController {
    private reviewsService;
    constructor(reviewsService: ReviewsService);
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
    summary(productId: string): Promise<{
        average: number;
        count: number;
    }>;
    create(req: any, dto: CreateReviewDto): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        userId: string;
        rating: number;
        comment: string | null;
    }>;
    remove(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        userId: string;
        rating: number;
        comment: string | null;
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
}
