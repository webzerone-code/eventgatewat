import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  ServiceUnavailableException,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { Carrier } from './decorators/carrier.decorator';
import { CarrierGuard } from './guards/carrier.guard';
import { GatewayService } from './gateway.service';
import { DhlDto } from './dto/dhl.dto';

@UseGuards(CarrierGuard)
@Controller('gateway')
export class GatewayController {
  private readonly logger = new Logger(GatewayController.name);
  constructor(private readonly gatewayService: GatewayService) {}
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

  @Carrier('DHL')
  @Post('dhl-webhook')
  @HttpCode(HttpStatus.ACCEPTED)
  async dhlWebhook(@Body() webhookRequest: DhlDto) {
    try {
      await this.gatewayService.processDhlWebhook(webhookRequest);
    } catch (e) {
      this.logger.error(
        `Buffer Reject: Event ${webhookRequest.event_id} failed to queue`,
        e.stack,
      );
      throw new ServiceUnavailableException('Gateway Buffer Full');
    }
  }
}
