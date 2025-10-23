import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const origin =
    process.env.NODE_ENV === 'dev'
      ? 'http://localhost:5173'
      : 'https://ecocow-attendance.netlify.app/';

  const app = await NestFactory.create(AppModule);
  // ValidationPipe 켜기
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: [origin, 'https://ecocow-attendance.netlify.app'],
    allowedHeaders: [
      'Content-Type',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Authorization',
    ],
    exposedHeaders: ['Authorization'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
