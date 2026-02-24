import { SetMetadata } from '@nestjs/common';

export const CARRIER_KEY = 'carrier';
export const Carrier = (providerId: string) =>
  SetMetadata(CARRIER_KEY, providerId);
