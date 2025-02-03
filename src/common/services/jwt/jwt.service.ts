import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as Jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  async verify(token: string) {
    try {
      const verify = await Jwt.verify(token, process.env.JWT_SECRET);
      return verify;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
