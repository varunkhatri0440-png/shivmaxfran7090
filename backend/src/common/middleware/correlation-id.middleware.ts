import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export interface CorrelatedRequest extends Request {
  correlationId?: string;
}

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: CorrelatedRequest, res: Response, next: NextFunction) {
    const correlationIdHeader = req.headers['x-correlation-id'];
    const correlationId =
      (Array.isArray(correlationIdHeader)
        ? correlationIdHeader[0]
        : correlationIdHeader) || `corr_${crypto.randomUUID()}`;

    req.correlationId = correlationId;
    res.setHeader('x-correlation-id', correlationId);

    next();
  }
}
