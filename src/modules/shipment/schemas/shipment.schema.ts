import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Shipment extends Document {
  @Prop({ required: true, index: true })
  tracking_id: string;

  @Prop({ required: true })
  carrier: string;

  @Prop({
    type: [
      {
        event_id: String,
        status: String,
        location: String,
        timestamp: String,
      },
    ],
  })
  processedEvents: any[];
}
export const ShipmentSchema = SchemaFactory.createForClass(Shipment);
ShipmentSchema.index({ carrier: 1, tracking_id: 1 }, { unique: true });
