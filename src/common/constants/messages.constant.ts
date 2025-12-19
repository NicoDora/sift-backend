import { HttpStatus } from "@nestjs/common";

export const ERROR_MESSAGES = {
  [HttpStatus.BAD_REQUEST]: "Bad Request",
  [HttpStatus.UNAUTHORIZED]: "Unauthorized",
  [HttpStatus.FORBIDDEN]: "Forbidden",
  [HttpStatus.NOT_FOUND]: "Not Found",
  [HttpStatus.INTERNAL_SERVER_ERROR]: "Internal Server Error",
} as const;
