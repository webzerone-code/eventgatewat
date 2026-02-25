import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  REDIS_HOST:
    process.env.REDIS_HOST ??
    (() => {
      throw new Error('Redis host is missing');
    })(),
  REDIS_PORT:
    Number(process.env.REDIS_PORT) ??
    (() => {
      throw new Error('Redis port is missing');
    })(),
}));
