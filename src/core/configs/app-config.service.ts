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
    return Number(this.configService.get<number>("SALT_ROUNDS")) || 10;
  }

  get jwtSecret(): string {
    const jwtSecretKey = this.configService.get<string>("JWT_SECRET_KEY");

    if (!jwtSecretKey && this.isProduction) {
      throw new Error(
        "프로덕션 환경에서 JWT_SECRET_KEY 환경 변수가 설정되지 않았습니다.",
      );
    }

    return jwtSecretKey || "default-secret-key";
  }

  get jwtAccessExpiresIn(): StringValue {
    return this.configService.get<StringValue>("JWT_ACCESS_EXPIRES_IN") || "1h";
  }

  get jwtRefreshExpiresIn(): StringValue {
    return (
      this.configService.get<StringValue>("JWT_REFRESH_EXPIRES_IN") || "7d"
    );
  }

  get googleClientId(): string {
    const clientId = this.configService.get<string>("GOOGLE_CLIENT_ID");

    if (!clientId) {
      throw new Error("GOOGLE_CLIENT_ID 환경 변수가 설정되지 않았습니다.");
    }

    return clientId;
  }

  get googleClientSecret(): string {
    const clientSecret = this.configService.get<string>("GOOGLE_CLIENT_SECRET");

    if (!clientSecret) {
      throw new Error("GOOGLE_CLIENT_SECRET 환경 변수가 설정되지 않았습니다.");
    }

    return clientSecret;
  }

  get googleRedirectUri(): string {
    const redirectUri = this.configService.get<string>("GOOGLE_REDIRECT_URI");

    if (!redirectUri) {
      throw new Error("GOOGLE_REDIRECT_URI 환경 변수가 설정되지 않았습니다.");
    }

    return redirectUri;
  }
}
