import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

/* controllers */
import { EventsController } from './events.controller';

/* services */
import { EventsService } from './events.service';

/* entities */
import { Event } from './entities/event.entity';
import { JwtService } from 'src/common/services/jwt/jwt.service';
import { Club } from '../clubs/entities/club.entity';
import { EventInvitedUser } from './entities/event-invited-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Club, EventInvitedUser]),
    ConfigModule.forRoot(),
  ],
  controllers: [EventsController],
  providers: [EventsService, JwtService],
})
export class EventsModule {}
