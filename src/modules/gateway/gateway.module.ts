import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { GatewayTestingController } from './gateway-testing.controller';
import { BullModule } from '@nestjs/bullmq';
import { MongooseModule } from '@nestjs/mongoose';
import { Shipment, ShipmentSchema } from '../shipment/schemas/shipment.schema';
import { EventProcessor } from './processors/event.processor';
import { ClientsModule, Transport } from '@nestjs/microservices';
import RedisConfig from '../../config/redis.config';
import { ConfigType } from '@nestjs/config';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'event-orchestration',
    }),
    MongooseModule.forFeature([
      { name: Shipment.name, schema: ShipmentSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: 'REDIS_TRANSIT',
        inject: [RedisConfig.KEY],
        useFactory: (cfg: ConfigType<typeof RedisConfig>) => ({
          transport: Transport.REDIS,
          options: { host: cfg.REDIS_HOST, port: cfg.REDIS_PORT },
        }),
      },
    ]),
  ],
  controllers: [GatewayController, GatewayTestingController],
  providers: [GatewayService, EventProcessor],
})
export class GatewayModule {}
