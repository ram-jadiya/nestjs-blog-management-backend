/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Bootstrap function to initialize the NestJS application.
 *
 * - Configures Swagger API documentation.
 * - Enables cookie parsing and CORS.
 * - Starts the application on the specified port.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  /**
   * Swagger API documentation configuration.
   */
  const config = new DocumentBuilder()
    .setTitle('Blog Demo API')
    .setDescription('Blog Demo API')
    .setVersion('1.0')
    .addCookieAuth('refresh_token', {
      type: 'http',
      in: 'header',
      scheme: 'Bearer',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // Middleware setup
  app.use(cookieParser());

  // Enable CORS for frontend access
  app.enableCors({
    origin: configService.get('CLIENT_URL'),
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
