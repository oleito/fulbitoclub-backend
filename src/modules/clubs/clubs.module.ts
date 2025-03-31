import { Module } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { ClubsController } from './clubs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Club } from './entities/club.entity';
import { JwtService } from 'src/common/services/jwt/jwt.service';

@Module({
  imports: [TypeOrmModule.forFeature([Club]), ConfigModule.forRoot()],
  controllers: [ClubsController],
  providers: [ClubsService, JwtService],
})
export class ClubsModule {}
