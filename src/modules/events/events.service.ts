import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';

import { EventInvitedUser } from './entities/event-invited-user.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class EventsService {
  logger = new Logger();
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(EventInvitedUser)
    private readonly eventInvitedUserRepository: Repository<EventInvitedUser>,
  ) {}

  /**
   * * Crea un evento
   * @param createEventDto
   * @param userId
   * @returns Promise<Event>
   */
  async createEvent(createEventDto: CreateEventDto, userId: any) {
    const newEvent = this.eventRepository.create(createEventDto);
    newEvent.owner = userId;

    return await this.eventRepository.save(newEvent);
  }

  /**
   * * Busca un evento para un usuario
   * @param userId
   * @returns Promise<Event>
   */
  async findAllByUserId(userId: number) {
    return await this.eventRepository.find({
      // TODO tiene que buscar por invitados
      where: { owner: { id: userId } },
    });
  }

  /**
   * * Busca un evento por id
   * @param eventId
   * @returns Promise<Event>
   */
  async findAllById(eventId: number, userId?: number) {
    // TODO filtrar contenido por rol
    return await this.eventRepository.find({
      where: { id: eventId },
    });
  }

  /**
   * * Acepta una invitacion a un evento
   * @param eventId
   * @param userId
   * @returns Promise<Event>
   */
  async aceptInvite(eventId: number, userId: number) {
    const relationExists = await this.eventInvitedUserRepository.find({
      where: {
        user: { id: userId },
        event: { id: eventId },
      },
    });

    if (relationExists) {
      throw new BadRequestException();
    }

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    // TODO definir si siempre tendria que ser un update
    const newRelation = this.eventInvitedUserRepository.create({
      user,
      event,
    });

    return await this.eventInvitedUserRepository.save(newRelation);
  }
}
