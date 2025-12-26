import { ApiProperty } from "@nestjs/swagger";

export class ApiErrorResponseDto {
  @ApiProperty({ example: "2025-12-26T05:00:00.000Z" })
  timestamp: string;

  @ApiProperty({ example: "/auth/login" })
  path: string;

  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({
    example: { message: "이메일 또는 비밀번호가 일치하지 않습니다." },
    description: "에러 상세 정보",
  })
  error: any;
}
