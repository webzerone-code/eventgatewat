import { registerAs } from '@nestjs/config';

export default registerAs('hmac', () => ({
  DHL:
    process.env.DHL ??
    (() => {
      throw new Error('DHL hmac is missing');
    })(),
  DHL_HEADER:
    process.env.DHL_HEADER ??
    (() => {
      throw new Error('DHL Header is missing');
    })(),
  FEDEX:
    process.env.FEDEX ??
    (() => {
      throw new Error('FEDEX hmac is missing');
    })(),
  FEDEX_HEADER:
    process.env.FEDEX_HEADER ??
    (() => {
      throw new Error('FEDEX header is missing');
    })(),
}));
