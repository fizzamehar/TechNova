import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { SupportModule } from './support/support.module';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CouponsModule } from './coupons/coupons.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // automatically loads the .env file
    PrismaModule,
    AuthModule,
    ProductsModule,
    ChatbotModule,
    CategoriesModule,
    CartModule,
    OrdersModule,
    WishlistModule,
    SupportModule,
    UsersModule,
    ReviewsModule,
    CouponsModule,
    NotificationsModule,
    PaymentsModule,
    AdminModule,
  ],
})
export class AppModule {}
