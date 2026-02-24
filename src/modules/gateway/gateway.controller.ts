import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Carrier } from './decorators/carrier.decorator';
import { CarrierGuard } from './guards/carrier.guard';

@UseGuards(CarrierGuard)
@Controller('gateway')
export class GatewayController {
  @Carrier('DHL')
  @Get('testing')
  testingDecorator() {
    return 'testing';
  }

  @Carrier('DHL')
  @Post('testing')
  testingPost() {
    return 'testing';
  }
}
