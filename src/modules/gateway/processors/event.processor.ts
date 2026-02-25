import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logger } from '@nestjs/common';
import { Shipment } from '../../shipment/schemas/shipment.schema';

@Processor('event-orchestration') // Must match the name in GatewayModule
export class EventProcessor extends WorkerHost {
  private readonly logger = new Logger(EventProcessor.name);

  constructor(
    @InjectModel(Shipment.name) private shipmentModel: Model<Shipment>,
  ) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    const { tracking_id, eventId, status, location, timestamp, carrier } =
      job.data;
    this.logger.log(
      `Processing event: ${eventId} for tracking_id: ${tracking_id}`,
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));
    const result = await this.shipmentModel.findOneAndUpdate(
      {
        trackingId: tracking_id,
        carrier: carrier,
        processedEvents: { $ne: eventId },
      },
      {
        $set: { status: status, timestamp: timestamp, location: location },
        $addToSet: { processedEvents: eventId }, // Adds to array only if unique
      },
      { upsert: true, new: true },
    );

    if (!result) {
      this.logger.warn(
        `Duplicate detected in Worker for Event: ${eventId}. Skipping.`,
      );
      return { status: 'skipped', reason: 'idempotency_hit' };
    }

    this.logger.log(`Success: Shipment ${tracking_id} updated to ${status}`);
    return { status: 'completed' };
  }
}
