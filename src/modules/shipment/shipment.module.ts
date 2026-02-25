import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Shipment, ShipmentSchema } from './schemas/shipment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shipment.name, schema: ShipmentSchema },
    ]),
  ],
})
export class ShipmentModule {}
