import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SupportService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async create(userId: string, subject: string, message: string, source: 'CHATBOT' | 'MANUAL' = 'MANUAL') {
    const ticket = await this.prisma.supportTicket.create({
      data: {
        userId,
        subject,
        source,
        messages: { create: [{ sender: 'USER', message }] },
      },
      include: { messages: true },
    });

    // A MANUAL ticket opened by an admin on the customer's behalf should
    // notify them — a CHATBOT-escalated one already came from their own message.
    if (source === 'MANUAL') {
      await this.notifications.create(userId, `A support ticket was opened for you: "${subject}"`);
    }

    return ticket;
  }

  findAllForUser(userId: string) {
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

  async reply(ticketId: string, sender: 'USER' | 'ADMIN', message: string) {
    const ticket = await this.prisma.supportTicket.findUnique({ where: { id: ticketId } });
    if (!ticket) throw new NotFoundException('Ticket not found');

    await this.prisma.ticketMessage.create({ data: { ticketId, sender, message } });

    if (sender === 'ADMIN') {
      await this.prisma.supportTicket.update({ where: { id: ticketId }, data: { status: 'IN_PROGRESS' } });
      // Let the customer know support replied
      await this.notifications.create(ticket.userId, `Support replied to your ticket: "${ticket.subject}"`);
    }

    return this.prisma.supportTicket.findUnique({ where: { id: ticketId }, include: { messages: true } });
  }

  updateStatus(ticketId: string, status: any) {
    return this.prisma.supportTicket.update({ where: { id: ticketId }, data: { status } });
  }
}