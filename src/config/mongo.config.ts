import { registerAs } from '@nestjs/config';

export default registerAs('mongo', () => ({
  uri:
    process.env.MONGO_URI ??
    (() => {
      throw new Error('Mongo url is missing');
    })(),
}));
