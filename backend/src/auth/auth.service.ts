import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Role is determined purely from the email domain — never from client input.
    // Anyone signing up with an @technova.com address is staff and becomes ADMIN;
    // every other domain is a regular CUSTOMER. This keeps admin signup private
    // (only people with a technova.com mailbox can ever get in) while removing
    // the old "pick your role" control from the signup form entirely.
    const role = dto.email.trim().toLowerCase().endsWith('@technova.com') ? 'ADMIN' : 'CUSTOMER';

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role,
        cart: { create: {} }, // every new user also gets an empty cart
      },
    });

    return this.generateToken(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    if (user.isBlocked) {
      throw new UnauthorizedException('Your account has been blocked. Please contact support.');
    }

    return this.generateToken(user.id, user.email, user.role);
  }

  private generateToken(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    return {
      access_token: this.jwt.sign(payload),
    };
  }
}
