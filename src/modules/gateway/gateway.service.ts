import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { DhlDto } from './dto/dhl.dto';
import { InjectRedis } from '@songkeys/nestjs-redis';
import Redis from 'ioredis';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class GatewayService {
  private readonly logger = new Logger(GatewayService.name);

  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectQueue('event-orchestration') private readonly eventQueue: Queue,
  ) {}
  async processDhlWebhook(webhookRequest: DhlDto) {
    try {
      const lockKey = `dhl:${webhookRequest.event_id}${webhookRequest.tracking_id}`;
      const isNew = await this.redis.set(lockKey, 'true', 'EX', 86400, 'NX');
      if (!isNew) return;
      webhookRequest.carrier = 'DHL';

      await this.eventQueue.add('dhl-webhook', webhookRequest, {
        jobId: webhookRequest.event_id,
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
      });
      this.logger.log(
        `DHL webhook processed: ${webhookRequest.event_id} for tracking_id: ${webhookRequest.tracking_id}`,
      );
    } catch (error) {
      this.logger.error('Error processing DHL webhook', error);
      throw new ServiceUnavailableException('Gateway Buffer Full');
    }
  }
}
