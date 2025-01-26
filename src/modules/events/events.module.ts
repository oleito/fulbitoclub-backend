import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      privateKey: 'process.env.JWT_SECRET',
      secret: 'process.env.JWT_SECRET',
      publicKey: 'process.env.JWT_SECRET',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
