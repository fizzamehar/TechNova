import { PrismaService } from '../prisma/prisma.service';
export declare class ChatbotService {
    private prisma;
    constructor(prisma: PrismaService);
    sendMessage(userId: string, sessionId: string | null, message: string): Promise<{
        sessionId: string;
        reply: {
            role: string;
            content: string;
        };
        escalated: boolean;
    }>;
    private buildContext;
    private callLLM;
}
