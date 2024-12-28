import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  const configService = app.get(ConfigService);

  const port = configService.get('API_PORT');
  const hostname = configService.get('HOSTNAME');

  await app.listen(port, hostname, () => {
    const address = 'http' + '://' + hostname + ':' + port + '/';
    logger.log('Listening at ' + address, 'AppModule');
  });
}
bootstrap();
