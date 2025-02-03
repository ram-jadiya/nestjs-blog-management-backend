/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthGuard } from './auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

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
  const reflector = app.get(Reflector);

  // Register global guard with reflector
  app.useGlobalGuards(new AuthGuard(app.get(JwtService), reflector));

  /**
   * Swagger API documentation configuration.
   */
  const config = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('Blog management system API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name should match the Security decorator name
    )
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
