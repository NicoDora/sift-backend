import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppConfigService {
  private readonly LOCAL = "local";
  private readonly PRODUCTION = "production";

  constructor(private configService: ConfigService) {}

  get nodeEnv(): string {
    return this.configService.get<string>("NODE_ENV") || this.LOCAL;
  }

  get isLocal(): boolean {
    return this.nodeEnv === this.LOCAL;
  }

  get isProduction(): boolean {
    return this.nodeEnv === this.PRODUCTION;
  }
}
