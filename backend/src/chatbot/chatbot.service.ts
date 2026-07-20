import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatbotService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(userId: string, sessionId: string | null, message: string) {
    // 1. Create a new session if one doesn't exist yet
    let session = sessionId
      ? await this.prisma.chatSession.findUnique({ where: { id: sessionId } })
      : null;

    if (!session) {
      session = await this.prisma.chatSession.create({ data: { userId } });
    }

    // 2. Save the user's message
    await this.prisma.chatMessage.create({
      data: { sessionId: session.id, role: 'USER', content: message },
    });

    // 3. Pull order/product context if relevant (simple keyword check)
    const context = await this.buildContext(userId, message);

    // 4. Get a reply from the AI
    const aiReply = await this.callLLM(message, context);

    await this.prisma.chatMessage.create({
      data: { sessionId: session.id, role: 'AI', content: aiReply.text },
    });

    // 5. If the AI can't handle it on its own, open a support ticket (escalation)
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
      // The frontend renders this directly as a ChatMessage ({ role, content }),
      // so it must be returned as an object, not a bare string.
      reply: { role: 'ai', content: aiReply.text },
      escalated: aiReply.needsHuman,
    };
  }

  // Pull DB context for questions like order status
  private async buildContext(userId: string, message: string) {
    const lower = message.toLowerCase();
    let context = '';

    if (lower.includes('order') || lower.includes('order status')) {
      const recentOrders = await this.prisma.order.findMany({
        where: { userId },
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: true } } },
      });
      context = `User's recent orders: ${JSON.stringify(
        recentOrders.map((o) => ({ id: o.id, status: o.status, total: o.totalAmount })),
      )}`;
    }

    return context;
  }

  private async callLLM(message: string, context: string): Promise<{ text: string; needsHuman: boolean }> {
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
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const text: string = response.data.choices[0].message.content;
      const needsHuman = text.includes('[ESCALATE]');
      return { text: text.replace('[ESCALATE]', '').trim(), needsHuman };
    } catch (error) {
      // Even if the API call fails, the user should still get a response and a ticket should open
      return {
        text: "Sorry, I'm having trouble answering that right now. I'm forwarding your request to our team.",
        needsHuman: true,
      };
    }
  }
}
