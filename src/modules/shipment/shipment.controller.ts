import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { InjectRedis } from '@songkeys/nestjs-redis';
import Redis from 'ioredis';

@Controller('shipment')
export class ShipmentController {
  @EventPattern('shipment.processed')
  handleShipmentFinished(data: any) {
    //console.log('Gateway received message:', data);
    // Trigger logic in GatewayModule here
  }
}
