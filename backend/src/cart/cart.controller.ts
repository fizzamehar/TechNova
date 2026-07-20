import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCart(@Req() req: any) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post('items')
  addItem(@Req() req: any, @Body() body: { productId: string; variantId?: string; quantity: number }) {
    return this.cartService.addItem(req.user.userId, body.productId, body.variantId || null, body.quantity);
  }

  @Patch('items/:itemId')
  updateItem(@Req() req: any, @Param('itemId') itemId: string, @Body() body: { quantity: number }) {
    return this.cartService.updateItem(req.user.userId, itemId, body.quantity);
  }

  @Delete('items/:itemId')
  removeItem(@Req() req: any, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(req.user.userId, itemId);
  }

  @Delete()
  clearCart(@Req() req: any) {
    return this.cartService.clearCart(req.user.userId);
  }
}
