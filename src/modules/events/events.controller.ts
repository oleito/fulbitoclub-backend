import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Logger,
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
  async create(
    @Body() createEventDto: CreateEventDto,
    @Headers('token') token,
  ) {
    const { sub } = await this.jwtService.verify(token);
    return this.eventsService.createEvent(createEventDto, sub);
  }

  @Get()
  @ApiHeader({
    name: 'token',
    description: 'Token',
    required: true,
  })
  async findAll(@Headers('token') token) {
    const { sub } = await this.jwtService.verify(token);
    return this.eventsService.findAllByUserId(sub);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.eventsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
  //   return this.eventsService.update(+id, updateEventDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.eventsService.remove(+id);
  // }
}
