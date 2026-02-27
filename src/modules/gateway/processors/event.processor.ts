import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inject, Logger } from '@nestjs/common';
import { Shipment } from '../../shipment/schemas/shipment.schema';
import { ClientProxy } from '@nestjs/microservices';

@Processor('event-orchestration') // Must match the name in GatewayModule
export class EventProcessor extends WorkerHost {
  private readonly logger = new Logger(EventProcessor.name);

  constructor(
    @InjectModel(Shipment.name) private shipmentModel: Model<Shipment>,
    @Inject('REDIS_TRANSIT') private readonly redisClient: ClientProxy,
  ) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    const { tracking_id, event_id, status, location, timestamp, carrier } =
      job.data;
    this.logger.log(
      `Processing event: ${event_id} for tracking_id: ${tracking_id}`,
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));
    const result = await this.shipmentModel.findOneAndUpdate(
      {
        tracking_id: tracking_id,
        carrier: carrier,
        'processedEvents.event_id': { $ne: event_id },
      },
      {
        $push: {
          processedEvents: {
            event_id: event_id,
            status: status,
            location: location,
            timestamp: timestamp,
          },
        },
      },
      { upsert: true, returnDocument: 'after' },
    );

    this.logger.log(`Success: Shipment ${tracking_id} updated to ${status}`);
    return { status: 'completed' };
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `${job.id} failed permanently after 5 attempts. Error: ${error.message}`,
    );
  }
  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`${job.id} completed successfully`);
    this.redisClient.emit('shipment.processed', job.data);
    //this.redisClient.send('shipment.processed', job.data);
  }
}
