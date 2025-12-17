import { SetMetadata } from "@nestjs/common";

export const RESPONSE_MESSAGE_KEY = "response_message";

/**
 * 사용법: @ResponseMessage('회원가입이 완료되었습니다.')
 */
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE_KEY, message);
