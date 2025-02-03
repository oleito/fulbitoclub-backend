import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { ConfigModule } from '@nestjs/config';
import { Event } from './entities/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from './../../common/services/jwt/jwt.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), ConfigModule.forRoot()],
  controllers: [EventsController],
  providers: [EventsService, JwtService],
})
export class EventsModule {}
