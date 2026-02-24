import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GatewayModule } from './gateway/gateway.module';
import hmacConfig from '../config/hmac.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [hmacConfig] }),
    GatewayModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
