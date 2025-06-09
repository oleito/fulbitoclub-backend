import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Logger,
  Param,
  Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { ApiBody, ApiHeader } from '@nestjs/swagger';
import { JwtService } from 'src/common/services/jwt/jwt.service';
import { AcceptInviteDto } from './dto/accept-invite.dto';

@Controller('')
export class EventsController {
  logger = new Logger();
  constructor(
    private readonly eventsService: EventsService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @ApiHeader({
    name: 'token',
    description: 'Token',
    required: true,
  })
  @ApiBody({
    description: 'Create event',
    type: CreateEventDto,
  })
  createEvent(
    @Body() createEventDto: CreateEventDto,
    @Headers('token') token: string,
  ) {
    const { sub } = this.jwtService.verify(token);
    return this.eventsService.createEvent(createEventDto, +sub);
  }

  @Get()
  @ApiHeader({
    name: 'token',
    description: 'Token',
    required: true,
  })
  findAllByUserId(@Headers('token') token: string) {
    const { sub } = this.jwtService.verify(token);
    return this.eventsService.findAllByUserId(+sub);
  }

  @Get(':id')
  @ApiHeader({
    name: 'token',
    description: 'Token',
    required: true,
  })
  findOneById(@Headers('token') token: string, @Param('id') id: string) {
    const { sub } = this.jwtService.verify(token);
    return this.eventsService.findOneById(+id, +sub);
  }

  @Post('/invite/:id')
  @ApiHeader({
    name: 'token',
    description: 'Token',
    required: true,
  })
  acceptOrUpdateInvite(
    @Body() acceptInviteDto: AcceptInviteDto,
    @Headers('token') token: string,
    @Param('id') invitationCode: string,
  ) {
    const { sub } = this.jwtService.verify(token);
    return this.eventsService.acceptOrUpdateInvite(
      invitationCode,
      +sub,
      acceptInviteDto.action,
    );
  }

  @Delete(':id')
  @ApiHeader({
    name: 'token',
    description: 'Token',
    required: true,
  })
  deleteInvite(@Headers('token') token: string, @Param('id') id: string) {
    const { sub } = this.jwtService.verify(token);
    return this.eventsService.deleteInvite(+id, +sub);
  }
}
