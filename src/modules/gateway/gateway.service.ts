import { Injectable } from '@nestjs/common';
import { DhlDto } from './dto/dhl.dto';
import { InjectRedis } from '@songkeys/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class GatewayService {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  async processDhlWebhook(webhookRequest: DhlDto) {
    const lockKey = `idempotency:dhl:${webhookRequest.eventId}`;
    const isNew = await this.redis.set(lockKey, 'true', 'EX', 86400, 'NX');
  }
}
