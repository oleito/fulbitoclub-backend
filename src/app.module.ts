import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule, Routes } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';

import { User } from './modules/auth/entities/user.entity';
import { EventsModule } from './modules/events/events.module';
import { Event } from './modules/events/entities/event.entity';

const routes: Routes = [
  {
    path: '/auth',
    module: AuthModule,
  },
  {
    path: '/events',
    module: EventsModule,
  },
];

@Module({
  imports: [
    RouterModule.register(routes),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [User, Event],
      synchronize: true,
    }),
    AuthModule,
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
