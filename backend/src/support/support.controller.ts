import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UpdateTicketStatusDto, CreateManualTicketDto } from './dto/support.dto';

@UseGuards(JwtAuthGuard)
@Controller('support')
export class SupportController {
  constructor(private supportService: SupportService) {}

  @Post()
  create(@Req() req: any, @Body() body: { subject: string; message: string }) {
    return this.supportService.create(req.user.userId, body.subject, body.message);
  }

  @Get()
  myTickets(@Req() req: any) {
    return this.supportService.findAllForUser(req.user.userId);
  }

  @Post(':id/reply')
  reply(@Req() req: any, @Param('id') id: string, @Body() body: { message: string }) {
    const sender = req.user.role === 'ADMIN' ? 'ADMIN' : 'USER';
    return this.supportService.reply(id, sender, body.message);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get('admin/all')
  findAllAdmin() {
    return this.supportService.findAllAdmin();
  }

  // Admin manually opens a ticket on behalf of a customer.
  // (The automatic path is the chatbot escalation in ChatbotService.)
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post('admin/create')
  createManual(@Body() body: CreateManualTicketDto) {
    return this.supportService.create(body.userId, body.subject, body.message);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: UpdateTicketStatusDto) {
    return this.supportService.updateStatus(id, body.status);
  }
}