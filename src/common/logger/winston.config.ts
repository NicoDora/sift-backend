import * as winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp: time, context }) => {
  const msg =
    typeof message === "object" ? JSON.stringify(message, null, 2) : message;
  const ctx = context ? ` [${context}]` : "";
  return `${time} [${level}]${ctx} ${msg}`;
});

export const winstonLogger = winston.createLogger({
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),

  transports: [
    new winston.transports.Console({
      format: combine(colorize({ all: true }), logFormat),
    }),
  ],
});
