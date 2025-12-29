import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseDto {
  @ApiProperty({
    example: "eyJhbGciOiJIUzI1Ni...",
    description: "JWT 액세스 토큰",
  })
  readonly accessToken: string;
  @ApiProperty({
    example: "eyJhbGciOiJIUzI1Ni...",
    description: "JWT 리프레시 토큰",
  })
  readonly refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
