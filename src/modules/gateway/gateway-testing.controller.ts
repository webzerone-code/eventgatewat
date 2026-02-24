import { Controller, Get, Inject } from '@nestjs/common';
import HmacConfig from '../../config/hmac.config';
import { ConfigType } from '@nestjs/config';
import { createHmac } from 'crypto';

@Controller('gateway-testing')
export class GatewayTestingController {
  constructor(
    @Inject(HmacConfig.KEY) private hmacConfig: ConfigType<typeof HmacConfig>,
  ) {}

  @Get('dhl')
  test() {
    const providerId = 'DHL';
    const body = JSON.stringify({
      event_id: 'evt_dhl_1001',
      tracking_id: 'JD01460000223344',
      status: 'ARRIVED_AT_TRANSIT_FACILITY',
      location: 'Dubai, AE',
      timestamp: '2024-03-20T14:30:00Z',
    });
    console.log(body);
    const signature = createHmac('sha256', this.hmacConfig[providerId])
      .update(body)
      .digest('hex');

    console.log('--- TEST HEADERS ---');
    console.log('x-provider-id: DHL');
    console.log(`x-dhl-signature: ${signature}`);
    console.log('--- RAW BODY ---');
    console.log(body);
  }
}
