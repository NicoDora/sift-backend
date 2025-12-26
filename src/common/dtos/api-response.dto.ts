import { ApiProperty } from "@nestjs/swagger";

export class BaseResponseDto<T> {
  @ApiProperty({ example: 200, description: "HTTP 상태 코드" })
  statusCode: number;

  @ApiProperty({ example: "성공 메시지", description: "응답 메시지" })
  message: string;

  @ApiProperty({
    example: "2025-12-26T05:00:00.000Z",
    description: "응답 시각",
  })
  timestamp: string;

  @ApiProperty({ example: "/auth/login", description: "요청 경로" })
  path: string;

  data?: T;
}
