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
    // let shipment = await this.shipmentModel.findOne({ tracking_id, carrier });
    // if (!shipment) {
    //   shipment = new this.shipmentModel({
    //     tracking_id,
    //     carrier,
    //     processedEvents: [
    //       {
    //         event_id: event_id,
    //         status: status,
    //         location: location,
    //         timestamp: timestamp,
    //       },
    //     ],
    //   });
    // }
    //
    // const exists = shipment.processedEvents.some(
    //   (e) => e.event_id === event_id,
    // );
    // if (!exists) {
    //   shipment.processedEvents.push({ event_id, status, location, timestamp });
    //   await shipment.save(); // <--- If this fails, the error message is VERY detailed
    // }

    // if (!result) {
    //   this.logger.warn(
    //     `Duplicate detected in Worker for Event: ${event_id}. Skipping.`,
    //   );
    //   return { status: 'skipped', reason: 'idempotency_hit' };
    // }

    this.logger.log(`Success: Shipment ${tracking_id} updated to ${status}`);
    return { status: 'completed' };
  }
}
