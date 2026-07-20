import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  checkout(
    @Req() req: any,
    @Body()
    body: {
      addressId: string;
      paymentMethod: string;
      couponCode?: string;
      items: { productId: string; variantId?: string | null; quantity: number }[];
    },
  ) {
    return this.ordersService.createFromItems(
      req.user.userId,
      body.addressId,
      body.items,
      body.paymentMethod,
      body.couponCode,
    );
  }

  @Get()
  myOrders(@Req() req: any) {
    return this.ordersService.findAllForUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.ordersService.findOne(req.user.userId, id, req.user.role === 'ADMIN');
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get('admin/all')
  findAllAdmin() {
    return this.ordersService.findAllAdmin();
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.ordersService.updateStatus(id, body.status);
  }
}
