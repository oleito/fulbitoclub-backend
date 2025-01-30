import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { OAuth2Client } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  logger = new Logger();
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly GoogleOAuth2Client: OAuth2Client,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(token: string) {
    // TODO Dividir y encapsular
    // TODO Separar en bloques/metodos
    // TODO ver que pasa si el token es de otra APP (clientID)
    const isValidToken = await this.verifyToken(token);
    if (!isValidToken) {
      throw new UnauthorizedException();
    }

    const { sub, picture, name, email } = this.jwtService.decode(token);

    let currUser = await this.userRepository.findOne({
      where: { sub: sub },
    });

    if (!currUser) {
      // TODO mover a un registerUser
      const createUserDto: CreateUserDto = {
        sub,
        email,
      };
      const newUser = this.userRepository.create(createUserDto);
      // TODO borrar
      this.logger.debug('newUser');
      currUser = await this.userRepository.save(newUser);
    } else {
      // TODO borrar el else
      this.logger.debug('userExist');
    }

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

    // TODO Agregar typescript a la response
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
      this.logger.error(error);
      // TODO implementar una respuesta de token vencido
      // if(error.includes) {
      //   throw new e
      // }
      return false;
    }
  }
}
