import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { TypeOrmModule } from '@nestjs/typeorm';

/* controllers */
import { AuthController } from './auth.controller';

/* services */
import { AuthService } from './auth.service';

/* entities */
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule.forRoot()],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: OAuth2Client,
      useFactory: () => new OAuth2Client(process.env.GOOGLE_CLIENT_ID),
    },
  ],
})
export class AuthModule {}
