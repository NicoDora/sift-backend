import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { StringValue } from "ms";

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

  get saltRounds(): number {
    return this.configService.get<number>("SALT_ROUNDS") || 10;
  }

  get jwtSecret(): string {
    return (
      this.configService.get<string>("JWT_SECRET_KEY") || "default-secret-key"
    );
  }

  get jwtAccessExpiresIn(): StringValue {
    return (this.configService.get<string>("JWT_ACCESS_EXPIRES_IN") ||
      "1h") as StringValue;
  }

  get jwtRefreshExpiresIn(): StringValue {
    return (this.configService.get<string>("JWT_REFRESH_EXPIRES_IN") ||
      "7d") as StringValue;
  }
}
