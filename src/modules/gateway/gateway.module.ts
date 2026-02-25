import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { GatewayTestingController } from './gateway-testing.controller';
import { BullModule } from '@nestjs/bullmq';
import { MongooseModule } from '@nestjs/mongoose';
import { Shipment, ShipmentSchema } from '../shipment/schemas/shipment.schema';
import { EventProcessor } from './processors/event.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'event-orchestration',
    }),
    MongooseModule.forFeature([
      { name: Shipment.name, schema: ShipmentSchema },
    ]),
  ],
  controllers: [GatewayController, GatewayTestingController],
  providers: [GatewayService, EventProcessor],
})
export class GatewayModule {}
