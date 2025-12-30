import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AppConfigService } from "@src/core/configs/app-config.service";
import { AuthService } from "@src/modules/auth/application/auth.service";
import { AUTH_TOKENS } from "@src/modules/auth/auth.constant";
import { JwtTokenService } from "@src/modules/auth/infrastructure/adapters/jwt-token.service";
import { JwtAccessStrategy } from "@src/modules/auth/infrastructure/strategies/jwt-access.strategy";
import { JwtRefreshStrategy } from "@src/modules/auth/infrastructure/strategies/jwt-refresh.strategy";
import { AuthController } from "@src/modules/auth/presentation/auth.controller";
import { UserModule } from "@src/modules/user/user.module";

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        secret: config.jwtSecret,
        signOptions: { expiresIn: config.jwtAccessExpiresIn },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    {
      provide: AUTH_TOKENS.ITokenService,
      useClass: JwtTokenService,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
