import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getProfile(@Req() req: any) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Patch('me')
  updateProfile(@Req() req: any, @Body() body: any) {
    return this.usersService.updateProfile(req.user.userId, body);
  }

  @Get('me/addresses')
  getAddresses(@Req() req: any) {
    return this.usersService.getAddresses(req.user.userId);
  }

  @Post('me/addresses')
  addAddress(@Req() req: any, @Body() body: any) {
    return this.usersService.addAddress(req.user.userId, body);
  }

  @Delete('me/addresses/:id')
  removeAddress(@Req() req: any, @Param('id') id: string) {
    return this.usersService.removeAddress(req.user.userId, id);
  }
}
