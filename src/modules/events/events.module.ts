import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from './../../common/services/jwt/jwt.service';

/* controllers */
import { EventsController } from './events.controller';

/* services */
import { EventsService } from './events.service';

/* entities */
import { Event } from './entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), ConfigModule.forRoot()],
  controllers: [EventsController],
  providers: [EventsService, JwtService],
})
export class EventsModule {}
