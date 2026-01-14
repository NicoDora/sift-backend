import { ApiProperty } from "@nestjs/swagger";

export class AccessTokenResponseDto {
  @ApiProperty({
    example: "eyJhbGciOiJIUzI1Ni...",
    description: "JWT 액세스 토큰",
  })
  readonly accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}
