import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

/* modules */
import { AuthModule } from './modules/auth/auth.module';
import { EventsModule } from './modules/events/events.module';

/* entities */
import { User } from './modules/auth/entities/user.entity';
import { Event } from './modules/events/entities/event.entity';
import { ClubsModule } from './modules/clubs/clubs.module';
import { Club } from './modules/clubs/entities/club.entity';
import { EventInvitedUser } from './modules/events/entities/event-invited-user.entity';

const routes: Routes = [
  {
    path: '/auth',
    module: AuthModule,
  },
  {
    path: '/events',
    module: EventsModule,
  },
  {
    path: '/clubs',
    module: ClubsModule,
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
      entities: [User, Event, Club, EventInvitedUser],
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      privateKey: process.env.JWT_SECRET,
      secret: process.env.JWT_SECRET,
      publicKey: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60h' },
    }),
    AuthModule,
    EventsModule,
    ClubsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
