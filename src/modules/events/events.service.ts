import { Injectable, Logger } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EventsService {
  logger = new Logger();
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async createEvent(createEventDto: CreateEventDto, userId: any) {
    // TODO: Verificar que el userID este bien en el tipo de dato
    const newEvent = this.eventRepository.create(createEventDto);
    newEvent.user = userId;
    return await this.eventRepository.save(newEvent);
  }

  async findAllByUserId(userId: number) {
    return await this.eventRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }
}
