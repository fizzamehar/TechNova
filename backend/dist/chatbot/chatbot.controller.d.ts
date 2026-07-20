import { ChatbotService } from './chatbot.service';
export declare class ChatbotController {
    private chatbotService;
    constructor(chatbotService: ChatbotService);
    sendMessage(req: any, body: {
        sessionId?: string;
        message: string;
    }): Promise<{
        sessionId: string;
        reply: {
            role: string;
            content: string;
        };
        escalated: boolean;
    }>;
}
