import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateEventDto {
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2025-06-18T18:00:00-03:00',
    description: 'Fecha y hora del evento en formato ISO 8601',
  })
  date: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  place: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  players_per_team: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;
}
