import * as winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

/**
 * 로그 출력 형식을 정의합니다.
 * - timestamp: 로그 발생 시간
 * - level: 로그 레벨 (info, error, warn, debug 등)
 * - context: 로그 발생 위치 (클래스명 또는 모듈명)
 * - message: 로그 내용 (객체일 경우 JSON 문자열로 변환)
 */
const logFormat = printf(({ level, message, timestamp: time, context }) => {
  const msg =
    typeof message === "object" ? JSON.stringify(message, null, 2) : message;
  const ctx = context ? ` [${context}]` : "";
  return `${time} [${level}]${ctx} ${msg}`;
});

/**
 * Winston 로거 인스턴스를 생성 및 설정합니다.
 * - level: 로깅 레벨을 환경에 따라 설정합니다. (error < warn < info < http < verbose < debug < silly)
 * - format: 타임스탬프와 커스텀 로그 포맷을 조합하여 사용합니다.
 * - transports: 로그를 출력할 대상을 설정합니다. (현재는 콘솔 출력만 설정됨)
 */
export const winstonLogger = winston.createLogger({
  // 프로덕션 환경에서는 info 레벨 이상, 개발 환경에서는 debug 레벨 이상을 로깅합니다.
  level: process.env.NODE_ENV === "production" ? "info" : "debug",

  transports: [
    new winston.transports.Console({
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        colorize({ all: true }),
        logFormat,
      ),
    }),
  ],
});
