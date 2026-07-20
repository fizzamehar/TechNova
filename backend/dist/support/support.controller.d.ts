import { SupportService } from './support.service';
import { UpdateTicketStatusDto, CreateManualTicketDto } from './dto/support.dto';
export declare class SupportController {
    private supportService;
    constructor(supportService: SupportService);
    create(req: any, body: {
        subject: string;
        message: string;
    }): Promise<{
        messages: {
            id: string;
            createdAt: Date;
            sender: string;
            message: string;
            ticketId: string;
        }[];
    } & {
        id: string;
        subject: string;
        status: import(".prisma/client").$Enums.TicketStatus;
        source: import(".prisma/client").$Enums.TicketSource;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    myTickets(req: any): import(".prisma/client").Prisma.PrismaPromise<({
        messages: {
            id: string;
            createdAt: Date;
            sender: string;
            message: string;
            ticketId: string;
        }[];
    } & {
        id: string;
        subject: string;
        status: import(".prisma/client").$Enums.TicketStatus;
        source: import(".prisma/client").$Enums.TicketSource;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    })[]>;
    reply(req: any, id: string, body: {
        message: string;
    }): Promise<({
        messages: {
            id: string;
            createdAt: Date;
            sender: string;
            message: string;
            ticketId: string;
        }[];
    } & {
        id: string;
        subject: string;
        status: import(".prisma/client").$Enums.TicketStatus;
        source: import(".prisma/client").$Enums.TicketSource;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }) | null>;
    findAllAdmin(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            name: string;
            email: string;
        };
        messages: {
            id: string;
            createdAt: Date;
            sender: string;
            message: string;
            ticketId: string;
        }[];
    } & {
        id: string;
        subject: string;
        status: import(".prisma/client").$Enums.TicketStatus;
        source: import(".prisma/client").$Enums.TicketSource;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    })[]>;
    createManual(body: CreateManualTicketDto): Promise<{
        messages: {
            id: string;
            createdAt: Date;
            sender: string;
            message: string;
            ticketId: string;
        }[];
    } & {
        id: string;
        subject: string;
        status: import(".prisma/client").$Enums.TicketStatus;
        source: import(".prisma/client").$Enums.TicketSource;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    updateStatus(id: string, body: UpdateTicketStatusDto): import(".prisma/client").Prisma.Prisma__SupportTicketClient<{
        id: string;
        subject: string;
        status: import(".prisma/client").$Enums.TicketStatus;
        source: import(".prisma/client").$Enums.TicketSource;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
