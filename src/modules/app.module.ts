import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { GatewayModule } from './gateway/gateway.module';
import hmacConfig from '../config/hmac.config';
import { RedisModule } from '@songkeys/nestjs-redis';
import RedisConfig from '../config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [hmacConfig, RedisConfig] }),
    RedisModule.forRootAsync({
      inject: [RedisConfig.KEY],
      useFactory: (rediasConfig: ConfigType<typeof RedisConfig>) => ({
        config: {
          host: rediasConfig.REDIS_HOST,
          port: rediasConfig.REDIS_PORT,
        },
      }),
    }),
    GatewayModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
