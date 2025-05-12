import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateEventDto {
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;
}
