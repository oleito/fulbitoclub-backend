import { Controller, Get, Post, Body, Headers, Logger } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { JwtService } from 'src/common/services/jwt/jwt.service';
import { ApiHeader } from '@nestjs/swagger';

@Controller('clubs')
export class ClubsController {
  logger = new Logger();
  constructor(
    private readonly clubsService: ClubsService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @ApiHeader({
    name: 'token',
    description: 'Token',
    required: true,
  })
  create(
    @Body() createClubDto: CreateClubDto,
    @Headers('token') token: string,
  ) {
    const { sub } = this.jwtService.verify(token);
    return this.clubsService.createClub(createClubDto, Number(sub));
  }

  @Get()
  @ApiHeader({
    name: 'token',
    description: 'Token',
    required: true,
  })
  findAll(@Headers('token') token: string) {
    const { sub } = this.jwtService.verify(token);
    return this.clubsService.findAllByUserId(Number(sub));
  }
}
