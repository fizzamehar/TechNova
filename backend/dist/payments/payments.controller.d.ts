import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/payment.dto';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    initiate(req: any, dto: InitiatePaymentDto): Promise<{
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
    status(req: any, orderId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        orderId: string;
        transactionId: string | null;
        method: string;
    }>;
    adminUpdateStatus(orderId: string, body: {
        status: string;
    }): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        orderId: string;
        transactionId: string | null;
        method: string;
    }>;
    webhook(body: {
        orderId: string;
        transactionId?: string;
        success: boolean;
    }): Promise<{
        orderId: string;
        status: string;
    }>;
}
