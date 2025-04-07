import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { In, Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Club } from '../clubs/entities/club.entity';

@Injectable()
export class EventsService {
  logger = new Logger();
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Club)
    private readonly clubRepository: Repository<Club>,
  ) {}

  async createEvent(createEventDto: CreateEventDto, userId: any) {
    const clubExist = await this.clubRepository.find({
      where: {
        id: Number(createEventDto.clubId),
        user: {
          id: userId,
        },
      },
    });

    if (!clubExist || clubExist.length === 0) {
      throw new BadRequestException();
    }

    const newEvent = this.eventRepository.create(createEventDto);

    newEvent.club = clubExist[0];

    // TODO verificar el que ID del club exista y sea propio
    return await this.eventRepository.save(newEvent);
  }

  async findAllByUserId(userId: number) {
    const clubs = await this.clubRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });

    const clubsIds = clubs.map((club) => club.id);
    if (clubsIds.length === 0) {
      return [];
    }

    return await this.eventRepository.find({
      where: { club: { id: In(clubsIds) } },
      relations: ['club'],
      order: {
        club: {
          id: 'ASC',
        },
      },
    });
  }
}
