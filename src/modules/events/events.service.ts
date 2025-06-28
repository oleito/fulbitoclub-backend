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

// Respuesta filtrada para eventos
export interface EventResponse {
  id: number;
  date: Date;
  place: string;
  players_per_team: number;
  description: string;
  invitationCode: string;
}

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
  async createEvent(
    createEventDto: CreateEventDto,
    userId: any,
  ): Promise<EventResponse> {
    const newEvent = this.eventRepository.create(createEventDto);
    newEvent.owner = userId;

    const nanoid = customAlphabet(alphabet, 8);
    newEvent.invitationCode = nanoid(8);

    const savedEvent = await this.eventRepository.save(newEvent);

    // Retornar solo los campos relevantes
    return {
      id: savedEvent.id,
      date: savedEvent.date,
      place: savedEvent.place,
      players_per_team: savedEvent.players_per_team,
      description: savedEvent.description,
      invitationCode: savedEvent.invitationCode,
    };
  }

  /**
   * * Busca un evento para un usuario
   * @param userId
   * @returns Promise<Event>
   */
  async findAllByUserId(userId: number): Promise<EventResponse[]> {
    const createdEvents = await this.eventRepository.find({
      where: { owner: { id: userId }, isActive: true },
    });
    const invitedEventsRelations = await this.eventInvitedUserRepository.find({
      where: { user: { id: userId }, status: statusEnum.ACCEPTED },
      relations: ['event'],
    });

    const invitedEvents = invitedEventsRelations.map((e) => ({
      event: e.event,
    }));

    const events = [
      ...createdEvents,
      ...invitedEvents
        .filter((e) => !createdEvents.some((ce) => ce.id === e.event.id))
        .map((e) => ({ ...e.event })),
    ];

    return events.map((event) => ({
      id: event.id,
      date: event.date,
      place: event.place,
      players_per_team: event.players_per_team,
      description: event.description,
      invitationCode: event.invitationCode,
    }));
  }

  /**
   * * Busca un evento por id
   * @param eventId
   * @returns Promise<Event>
   */
  async findOneById(
    eventId: number,
    userId?: number,
  ): Promise<EventResponse & { invitedUsers: any[] }> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId, isActive: true },
      relations: ['owner', 'invitedUsers'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const invitedUsersExists = await this.eventInvitedUserRepository.find({
      where: {
        event: { id: event.id },
        status: statusEnum.ACCEPTED,
      },
      relations: ['user'],
    });

    const invitedUsers = invitedUsersExists.map((e) => {
      const { status, user } = e;
      return {
        status,
        user,
      };
    });

    return {
      id: event.id,
      date: event.date,
      place: event.place,
      players_per_team: event.players_per_team,
      description: event.description,
      invitationCode: event.invitationCode,
      invitedUsers,
    };
  }

  /**
   * * Acepta una invitacion a un evento
   * @param eventId
   * @param userId
   * @returns Promise<Event>
   */
  async findOneByInvitationCode(invitationCode: string) {
    // obtener el evento por invitationCode
    const event = await this.eventRepository.findOne({
      where: { invitationCode, isActive: true },
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // return event;
    // const { status, ...rest } = event;
    return {
      date: event.date,
      players_per_team: event.players_per_team,
      place: event.place,
      description: event.description,
    };
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

    const inviteResult =
      await this.eventInvitedUserRepository.save(newRelation);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { status, ...rest } = inviteResult;
    return status;
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
