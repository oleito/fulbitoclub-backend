import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  sub: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}
