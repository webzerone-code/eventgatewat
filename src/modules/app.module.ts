import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { GatewayModule } from './gateway/gateway.module';
import hmacConfig from '../config/hmac.config';
import { RedisModule } from '@songkeys/nestjs-redis';
import RedisConfig from '../config/redis.config';
import { BullModule } from '@nestjs/bullmq';
import { MongooseModule } from '@nestjs/mongoose';
import { ShipmentModule } from './shipment/shipment.module';
import MongoConfig from '../config/mongo.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [hmacConfig, RedisConfig, MongoConfig],
    }),
    RedisModule.forRootAsync({
      inject: [RedisConfig.KEY],
      useFactory: (rediasConfig: ConfigType<typeof RedisConfig>) => ({
        config: {
          host: rediasConfig.REDIS_HOST,
          port: rediasConfig.REDIS_PORT,
        },
      }),
    }),
    BullModule.forRootAsync({
      inject: [RedisConfig.KEY],
      useFactory: (rediasConfig: ConfigType<typeof RedisConfig>) => ({
        connection: {
          host: rediasConfig.REDIS_HOST,
          port: rediasConfig.REDIS_PORT,
        },
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [MongoConfig.KEY],
      useFactory: (mongoConfig: ConfigType<typeof MongoConfig>) => ({
        uri: mongoConfig.uri,
      }),
    }),
    GatewayModule,
    ShipmentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
