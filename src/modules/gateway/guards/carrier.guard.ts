import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CARRIER_KEY } from '../decorators/carrier.decorator';
import HmacConfig from '../../../config/hmac.config';
import { ConfigType } from '@nestjs/config';
import { createHmac } from 'crypto';
import { timingSafeEqual } from 'node:crypto';

@Injectable()
export class CarrierGuard implements CanActivate {
  constructor(
    @Inject(HmacConfig.KEY) private hmacConfig: ConfigType<typeof HmacConfig>,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    const providerid = this.reflector.get<string>(
      CARRIER_KEY,
      context.getHandler(),
    );
    if (this.hmacConfig[providerid] === undefined) {
      throw new UnauthorizedException('Invalid provider');
    }
    const signature =
      headers[this.hmacConfig[`${providerid}_HEADER`].toLowerCase()];
    if (signature === undefined)
      throw new UnauthorizedException('Missing signature header');

    if (!request.rawBody) {
      throw new UnauthorizedException('Empty or unreadable request body');
    }

    const generatedHash = createHmac('sha256', this.hmacConfig[providerid])
      .update(request.rawBody)
      .digest('hex');
    if (generatedHash.length !== signature.length) {
      throw new UnauthorizedException('Invalid signature');
    }
    return timingSafeEqual(Buffer.from(generatedHash), Buffer.from(signature));
  }
}
