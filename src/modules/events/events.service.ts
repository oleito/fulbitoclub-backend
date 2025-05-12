import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';

import { EventInvitedUser } from './entities/event-invited-user.entity';
import { User } from '../auth/entities/user.entity';
import { statusEnum } from './enum/status.enum';
import { customAlphabet } from 'nanoid';

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

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

    const nanoid = customAlphabet(alphabet, 8);

    newEvent.invitationCode = nanoid(8);

    return await this.eventRepository.save(newEvent);
  }

  /**
   * * Busca un evento para un usuario
   * @param userId
   * @returns Promise<Event>
   */
  async findAllByUserId(userId: number) {
    // TODO todos los eventos en los que esta inscripto el usuario, ver la tabla de relaciones
    // TODO ver como buscar los eventos creados
    return await this.eventRepository.find({
      // TODO tiene que buscar por invitados
      where: { owner: { id: userId }, isActive: true },
    });
  }

  /**
   * * Busca un evento por id
   * @param eventId
   * @returns Promise<Event>
   */
  async findOneById(eventId: number, userId?: number) {
    // TODO refactorizar la relacion (join??)
    const event = await this.eventRepository.findOne({
      where: { id: eventId, isActive: true },
      relations: ['owner', 'invitedUsers'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // verificar si el usuario ya fue invitado al evento
    const invitedUsers = await this.eventInvitedUserRepository.find({
      where: {
        event: { id: event.id },
        status: statusEnum.ACCEPTED,
      },
      relations: ['user'],
    });
    event.invitedUsers = invitedUsers;

    if (event.owner.id === userId) {
      return event;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { owner, ...filteredResponse } = event;

    return filteredResponse;
  }

  /**
   * * Acepta una invitacion a un evento
   * @param eventId
   * @param userId
   * @returns Promise<Event>
   */
  async acceptOrUpdateInvite(
    invitationCode: string,
    userId: number,
    action: statusEnum,
  ) {
    // obtener el evento por invitationCode
    const event = await this.eventRepository.findOne({
      where: { invitationCode, isActive: true },
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // verificar si el usuario ya fue invitado al evento
    const relationExists = await this.eventInvitedUserRepository.findOne({
      where: {
        user: { id: userId },
        event: { id: event.id },
      },
    });
    if (relationExists) {
      relationExists.status = action;
      return await this.eventInvitedUserRepository.save(relationExists);
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const newRelation = this.eventInvitedUserRepository.create({
      user,
      event,
      status: action,
    });

    return await this.eventInvitedUserRepository.save(newRelation);
  }

  /**
   * * Desactiva un evento
   * @param eventId
   * @param userId
   * @returns Promise<Event>
   */
  async deleteInvite(eventId: number, userId: number) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId, isActive: true },
      relations: ['owner'],
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.owner.id !== userId) {
      throw new BadRequestException('You are not the owner of the event');
    }

    event.isActive = false;
    return await this.eventRepository.save(event);
  }
}
