import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as Jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  verify(token: string) {
    try {
      const verify = Jwt.verify(token, process.env.JWT_SECRET);
      return verify;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
