import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Fulbito App')
    .setDescription('Una app para gestionar los partidos con tus compas.')
    .setVersion('0.0.1')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, documentFactory);

  const port = configService.get('API_PORT');
  const hostname = configService.get('HOSTNAME');

  // TODO enable CORS
  app.enableCors();

  await app.listen(port, hostname, () => {
    const address = 'http' + '://' + hostname + ':' + port + '/';
    logger.log('Listening at ' + address, 'AppModule');
  });
}
bootstrap();
