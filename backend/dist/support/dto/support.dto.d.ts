export declare enum TicketStatusDto {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED"
}
export declare class UpdateTicketStatusDto {
    status: TicketStatusDto;
}
export declare class CreateManualTicketDto {
    userId: string;
    subject: string;
    message: string;
}
