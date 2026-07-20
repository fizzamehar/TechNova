import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('initiate')
  initiate(@Req() req: any, @Body() dto: InitiatePaymentDto) {
    return this.paymentsService.initiate(req.user.userId, dto.orderId, dto.method);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':orderId/status')
  status(@Req() req: any, @Param('orderId') orderId: string) {
    return this.paymentsService.status(req.user.userId, orderId);
  }

  // Admin — manually correct a payment's status (e.g. mark COD as paid
  // early, fix a mistaken status, or issue a refund) without waiting for
  // the order status to change or a gateway webhook to fire.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':orderId/status')
  adminUpdateStatus(@Param('orderId') orderId: string, @Body() body: { status: string }) {
    return this.paymentsService.adminUpdateStatus(orderId, body.status);
  }

  // Public — the gateway (Stripe/JazzCash/EasyPaisa) calls this server-to-server.
  // In production you must verify the signature/HMAC before trusting this endpoint.
  @Post('webhook')
  webhook(@Body() body: { orderId: string; transactionId?: string; success: boolean }) {
    return this.paymentsService.confirmByWebhook(body.orderId, body.transactionId, body.success);
  }
}