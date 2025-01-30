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
  UnauthorizedException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiBody, ApiHeader, ApiProperty } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';

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
    console.log(token);
    // TODO deberia gestionar el error generado para que sea un 401
    let verify;
    try {
      verify = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      this.logger.debug(verify, 'create Event controller');
    } catch {
      throw new UnauthorizedException();
    }

    return this.eventsService.createEvent(createEventDto, verify.sub);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(+id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}
