import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { GatewayTestingController } from './gateway-testing.controller';

@Module({
  controllers: [GatewayController, GatewayTestingController],
  providers: [GatewayService],
})
export class GatewayModule {}
