import { PrismaService } from '../prisma/prisma.service';
export declare class PaymentsService {
    private prisma;
    private stripe;
    constructor(prisma: PrismaService);
    initiate(userId: string, orderId: string, method: string): Promise<{
        method: string;
        status: string;
        transactionId: string;
        message: string;
        clientSecret?: undefined;
    } | {
        method: string;
        clientSecret: string | null;
        status?: undefined;
        transactionId?: undefined;
        message?: undefined;
    } | {
        method: "jazzcash" | "easypaisa";
        status: string;
        transactionId: string;
        message: string;
    } | {
        method: string;
        status: string;
        message: string;
    }>;
    private initiateCardPayment;
    private initiateLocalWallet;
    confirmByWebhook(orderId: string, transactionId: string | undefined, success: boolean): Promise<{
        orderId: string;
        status: string;
    }>;
    status(userId: string, orderId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        orderId: string;
        transactionId: string | null;
        method: string;
    }>;
    adminUpdateStatus(orderId: string, status: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        orderId: string;
        transactionId: string | null;
        method: string;
    }>;
}
