import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Event } from './entities/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      privateKey: 'process.env.JWT_SECRET',
      secret: 'process.env.JWT_SECRET',
      publicKey: 'process.env.JWT_SECRET',
      signOptions: { expiresIn: '60h' },
    }),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
