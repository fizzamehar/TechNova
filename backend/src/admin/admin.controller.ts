import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard/summary')
  summary() {
    return this.adminService.dashboardSummary();
  }

  @Get('dashboard/sales')
  sales(@Query('days') days?: string) {
    return this.adminService.salesOverTime(days ? Number(days) : 30);
  }

  @Get('dashboard/top-products')
  topProducts(@Query('limit') limit?: string) {
    return this.adminService.topSellingProducts(limit ? Number(limit) : 5);
  }

  @Get('dashboard/order-status')
  orderStatus() {
    return this.adminService.orderStatusBreakdown();
  }

  @Get('dashboard/low-stock')
  lowStock(@Query('threshold') threshold?: string) {
    return this.adminService.lowStockProducts(threshold ? Number(threshold) : 5);
  }

  @Get('users')
  listUsers() {
    return this.adminService.listUsers();
  }

  @Patch('users/:id/block')
  blockUser(@Param('id') id: string, @Body() body: { block: boolean }) {
    return this.adminService.toggleUserBlock(id, body.block);
  }
}
