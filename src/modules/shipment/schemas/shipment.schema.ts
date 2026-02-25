import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Shipment extends Document {
  @Prop({ required: true, index: true })
  trackingId: string;

  @Prop({ required: true })
  carrier: string;

  @Prop({ type: [String] })
  processedEvents: string[];
}
export const ShipmentSchema = SchemaFactory.createForClass(Shipment);
ShipmentSchema.index({ carrier: 1, trackingId: 1 }, { unique: true });
