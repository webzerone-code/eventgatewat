import { Injectable } from '@nestjs/common';
import { DhlDto } from './dto/dhl.dto';

@Injectable()
export class GatewayService {
  async processDhlWebhook(webhookRequest: DhlDto) {}
}
