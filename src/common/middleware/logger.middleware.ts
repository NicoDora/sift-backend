import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NestMiddleware,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get("user-agent") || "";
    const host = req.hostname;
    const port = req.socket.localPort;
    const startTime = Date.now();

    res.on("finish", () => {
      const { statusCode } = res;
      const contentLength = res.get("content-length");
      const duration = Date.now() - startTime;

      this.logger.log(
        `[${method}] [${statusCode}] +${duration}ms - ${host}:${port}${originalUrl} - ${ip} - ${userAgent} - ${contentLength}`,
        "HTTP",
      );
    });

    next();
  }
}
