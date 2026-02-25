import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { GatewayTestingController } from './gateway-testing.controller';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'event-orchestration',
    }),
  ],
  controllers: [GatewayController, GatewayTestingController],
  providers: [GatewayService],
})
export class GatewayModule {}
