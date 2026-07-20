"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let SupportService = class SupportService {
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    async create(userId, subject, message, source = 'MANUAL') {
        const ticket = await this.prisma.supportTicket.create({
            data: {
                userId,
                subject,
                source,
                messages: { create: [{ sender: 'USER', message }] },
            },
            include: { messages: true },
        });
        if (source === 'MANUAL') {
            await this.notifications.create(userId, `A support ticket was opened for you: "${subject}"`);
        }
        return ticket;
    }
    findAllForUser(userId) {
        return this.prisma.supportTicket.findMany({
            where: { userId },
            include: { messages: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    findAllAdmin() {
        return this.prisma.supportTicket.findMany({
            include: { messages: true, user: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async reply(ticketId, sender, message) {
        const ticket = await this.prisma.supportTicket.findUnique({ where: { id: ticketId } });
        if (!ticket)
            throw new common_1.NotFoundException('Ticket not found');
        await this.prisma.ticketMessage.create({ data: { ticketId, sender, message } });
        if (sender === 'ADMIN') {
            await this.prisma.supportTicket.update({ where: { id: ticketId }, data: { status: 'IN_PROGRESS' } });
            await this.notifications.create(ticket.userId, `Support replied to your ticket: "${ticket.subject}"`);
        }
        return this.prisma.supportTicket.findUnique({ where: { id: ticketId }, include: { messages: true } });
    }
    updateStatus(ticketId, status) {
        return this.prisma.supportTicket.update({ where: { id: ticketId }, data: { status } });
    }
};
exports.SupportService = SupportService;
exports.SupportService = SupportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], SupportService);
//# sourceMappingURL=support.service.js.map