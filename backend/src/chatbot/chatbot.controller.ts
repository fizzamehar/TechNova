import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatbotController {
  constructor(private chatbotService: ChatbotService) {}

  @Post()
  sendMessage(
    @Req() req: any,
    @Body() body: { sessionId?: string; message: string },
  ) {
    return this.chatbotService.sendMessage(req.user.userId, body.sessionId || null, body.message);
  }
}
