import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { statusEnum } from '../enum/status.enum';

export class AcceptInviteDto {
  @IsEnum(statusEnum)
  @IsOptional()
  @ApiProperty({
    example: 'accepted',
    enum: statusEnum,
    required: false,
  })
  action: statusEnum;
}
