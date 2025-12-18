import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

const LOCAL = "local";
const PRODUCTION = "production";

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get nodeEnv(): string {
    return this.configService.get<string>("NODE_ENV") || LOCAL;
  }

  get isLocal(): boolean {
    return this.nodeEnv === LOCAL;
  }

  get isProduction(): boolean {
    return this.nodeEnv === PRODUCTION;
  }

  get port(): number {
    return this.configService.get<number>("PORT") || 3000;
  }
}
