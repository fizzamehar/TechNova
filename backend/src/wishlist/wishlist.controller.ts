import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.wishlistService.findAll(req.user.userId);
  }

  @Post(':productId')
  add(@Req() req: any, @Param('productId') productId: string) {
    return this.wishlistService.add(req.user.userId, productId);
  }

  @Delete(':productId')
  remove(@Req() req: any, @Param('productId') productId: string) {
    return this.wishlistService.remove(req.user.userId, productId);
  }
}
