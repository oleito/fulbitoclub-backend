import {
  Injectable,
  Logger,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { OAuth2Client } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthResponse } from 'src/common/models/auth/auth.model';

@Injectable()
export class AuthService {
  logger = new Logger();
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly GoogleOAuth2Client: OAuth2Client,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(token: string): Promise<AuthResponse> {
    // TODO ver que pasa si el token es de otra APP (clientID)
    const isValidToken = await this.verifyToken(token);
    if (!isValidToken) {
      throw new UnauthorizedException();
    }

    const { sub, picture, name, email } = this.jwtService.decode(token);

    const currUser: User = await this.getOrRegisterUser(sub, email);

    const responseData = {
      sub: currUser.id,
      gsub: currUser.sub,
      picture,
      name,
      email,
    };

    const access_token = await this.jwtService.signAsync(responseData);

    const response = {
      access_token,
      ...responseData,
    };

    return response;
  }

  async verifyToken(idToken: string) {
    try {
      const result = await this.GoogleOAuth2Client.verifyIdToken({
        idToken,
      });

      const payload = result.getPayload();
      return !!payload;
    } catch (error) {
      if (error.message.includes('Token used too late')) {
        throw new UnauthorizedException('GoogleSession expired');
      }
      this.logger.error('Error in verifyToken:', error);
      throw new InternalServerErrorException();
    }
  }

  async getOrRegisterUser(sub: string, email: string): Promise<User> {
    try {
      let currUser = await this.userRepository.findOne({
        where: { sub: sub },
      });

      if (!currUser) {
        const createUserDto: CreateUserDto = {
          sub,
          email,
        };
        const newUser = this.userRepository.create(createUserDto);
        currUser = await this.userRepository.save(newUser);
      }
      return currUser;
    } catch (error) {
      this.logger.error('Error in getOrRegisterUser:', error);
      throw new InternalServerErrorException();
    }
  }
}
