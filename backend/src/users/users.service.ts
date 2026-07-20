import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, avatar: true, role: true, addresses: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  updateProfile(userId: string, data: { name?: string; phone?: string; avatar?: string }) {
    return this.prisma.user.update({ where: { id: userId }, data });
  }

  addAddress(userId: string, data: { label: string; street: string; city: string; country: string; isDefault?: boolean }) {
    return this.prisma.address.create({ data: { ...data, userId } });
  }

  getAddresses(userId: string) {
    return this.prisma.address.findMany({ where: { userId } });
  }

  removeAddress(userId: string, addressId: string) {
    return this.prisma.address.deleteMany({ where: { id: addressId, userId } });
  }
}
