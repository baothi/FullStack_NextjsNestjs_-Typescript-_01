import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UsersModule } from '@/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LikesModule } from '@/likes/likes.module';
import { MenuItemOptionsModule } from '@/menu.item.options/menu.item.options.module';
import { MenuItemsModule } from '@/menu.items/menu.items.module';
import { MenusModule } from '@/menus/menus.module';
import { OrderDetailModule } from '@/order.detail/order.detail.module';
import { OrdersModule } from '@/orders/orders.module';
import { RestaurantsModule } from '@/restaurants/restaurants.module';
import { ReviewsModule } from '@/reviews/reviews.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    LikesModule,
    MenuItemOptionsModule,
    MenuItemsModule,
    MenusModule,
    OrderDetailModule,
    OrdersModule,
    RestaurantsModule,
    ReviewsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
