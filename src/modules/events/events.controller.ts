import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Logger,
  Param,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { ApiBody, ApiHeader } from '@nestjs/swagger';
import { JwtService } from 'src/common/services/jwt/jwt.service';

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
    description: 'Nuevo evento',
    type: CreateEventDto,
  })
  create(
    @Body() createEventDto: CreateEventDto,
    @Headers('token') token: string,
  ) {
    const { sub } = this.jwtService.verify(token);
    return this.eventsService.createEvent(createEventDto, Number(sub));
  }

  @Get()
  @ApiHeader({
    name: 'token',
    description: 'Token',
    required: true,
  })
  findAll(@Headers('token') token: string) {
    const { sub } = this.jwtService.verify(token);
    return this.eventsService.findAllByUserId(Number(sub));
  }

  @Get(':id')
  @ApiHeader({
    name: 'token',
    description: 'Token',
    required: true,
  })
  findOne(@Headers('token') token: string, @Param('id') id: string) {
    const { sub } = this.jwtService.verify(token);
    return this.eventsService.findAllById(+id, Number(sub));
  }

  @Post('/invite/:id')
  @ApiHeader({
    name: 'token',
    description: 'Token',
    required: true,
  })
  aceptInvite(@Headers('token') token: string, @Param('id') eventId: string) {
    const { sub } = this.jwtService.verify(token);
    // TODO aca deberia poder recibir el caso de rechazo
    return this.eventsService.aceptInvite(+eventId, Number(sub));
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
  //   return this.eventsService.update(+id, updateEventDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.eventsService.remove(+id);
  // }
}
