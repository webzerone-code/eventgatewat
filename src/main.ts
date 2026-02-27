import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { ConfigType } from '@nestjs/config';
import RedisConfig from './config/redis.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const rediaConf = app.get<ConfigType<typeof RedisConfig>>(RedisConfig.KEY);
  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      host: rediaConf.REDIS_HOST, // Use your config here
      port: rediaConf.REDIS_PORT,
    },
  });
  await app.startAllMicroservices();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
