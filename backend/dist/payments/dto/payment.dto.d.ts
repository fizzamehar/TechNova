export declare class InitiatePaymentDto {
    orderId: string;
    method: string;
}
export declare class ConfirmPaymentDto {
    orderId: string;
    transactionId?: string;
}
