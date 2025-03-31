import { Injectable } from '@nestjs/common';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Club } from './entities/club.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClubsService {
  constructor(
    @InjectRepository(Club)
    private readonly clubRepository: Repository<Club>,
  ) {}

  async createClub(createClubDto: CreateClubDto, userId: any) {
    // TODO: Verificar que el userID este bien en el tipo de dato
    const newClub = this.clubRepository.create(createClubDto);
    newClub.user = userId;
    return await this.clubRepository.save(newClub);
  }

  async findAllByUserId(userId: number) {
    return await this.clubRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }
}
