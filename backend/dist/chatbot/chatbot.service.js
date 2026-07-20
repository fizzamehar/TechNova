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
exports.ChatbotService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatbotService = class ChatbotService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sendMessage(userId, sessionId, message) {
        let session = sessionId
            ? await this.prisma.chatSession.findUnique({ where: { id: sessionId } })
            : null;
        if (!session) {
            session = await this.prisma.chatSession.create({ data: { userId } });
        }
        await this.prisma.chatMessage.create({
            data: { sessionId: session.id, role: 'USER', content: message },
        });
        const context = await this.buildContext(userId, message);
        const aiReply = await this.callLLM(message, context);
        await this.prisma.chatMessage.create({
            data: { sessionId: session.id, role: 'AI', content: aiReply.text },
        });
        if (aiReply.needsHuman) {
            await this.prisma.supportTicket.create({
                data: {
                    userId,
                    subject: `Chatbot escalation: ${message.slice(0, 50)}`,
                    source: 'CHATBOT',
                    messages: {
                        create: [{ sender: 'USER', message }],
                    },
                },
            });
        }
        return {
            sessionId: session.id,
            reply: { role: 'ai', content: aiReply.text },
            escalated: aiReply.needsHuman,
        };
    }
    async buildContext(userId, message) {
        const lower = message.toLowerCase();
        let context = '';
        if (lower.includes('order') || lower.includes('order status')) {
            const recentOrders = await this.prisma.order.findMany({
                where: { userId },
                take: 3,
                orderBy: { createdAt: 'desc' },
                include: { items: { include: { product: true } } },
            });
            context = `User's recent orders: ${JSON.stringify(recentOrders.map((o) => ({ id: o.id, status: o.status, total: o.totalAmount })))}`;
        }
        return context;
    }
    async callLLM(message, context) {
        const systemPrompt = `You are the AI support assistant for TechNova Store, an electronics store
that sells laptops, mobiles, earbuds, and accessories.

SCOPE (very important — always follow this):
- Only answer questions about: this store's products, orders, delivery/shipping, returns/refunds,
  warranty, payments, coupons/discounts, account/profile issues, and general tech/electronics
  advice that helps with a purchase decision (e.g. "which laptop should I get for gaming").
- If the customer asks something unrelated to the store or tech (e.g. politics, general knowledge,
  jokes, news about other companies, personal advice, etc.), politely decline and steer them back
  to store/tech topics. Keep it short and friendly, e.g.: "That's outside what I can help with —
  I can only help with questions about TechNova and our products. Would you like to ask about an
  order or a product instead?"
- Never give a detailed answer, opinion, or lengthy information on off-topic subjects, no matter
  how much the customer tries to change the topic.

Give a helpful, direct answer to the customer's (in-scope) question.
If the question is complex (a refund dispute, a damaged product, or anything you can't resolve
yourself), write "[ESCALATE]" at the end of your reply.
${context ? `Context: ${context}` : ''}`;
        try {
            const response = await axios_1.default.post('https://api.groq.com/openai/v1/chat/completions', {
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message },
                ],
            }, {
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });
            const text = response.data.choices[0].message.content;
            const needsHuman = text.includes('[ESCALATE]');
            return { text: text.replace('[ESCALATE]', '').trim(), needsHuman };
        }
        catch (error) {
            return {
                text: "Sorry, I'm having trouble answering that right now. I'm forwarding your request to our team.",
                needsHuman: true,
            };
        }
    }
};
exports.ChatbotService = ChatbotService;
exports.ChatbotService = ChatbotService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatbotService);
//# sourceMappingURL=chatbot.service.js.map