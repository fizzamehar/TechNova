import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class SupportService {
    private prisma;
    private notifications;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    create(userId: string, subject: string, message: string, source?: 'CHATBOT' | 'MANUAL'): Promise<{
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
    findAllForUser(userId: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    reply(ticketId: string, sender: 'USER' | 'ADMIN', message: string): Promise<({
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
    updateStatus(ticketId: string, status: any): import(".prisma/client").Prisma.Prisma__SupportTicketClient<{
        id: string;
        subject: string;
        status: import(".prisma/client").$Enums.TicketStatus;
        source: import(".prisma/client").$Enums.TicketSource;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
