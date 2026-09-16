import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

export interface StructuredLogPayload {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  context?: string;
  correlationId?: string;
  message: string;
  meta?: Record<string, unknown>;
}

@Injectable()
export class StructuredLogger implements NestLoggerService {
  private formatLog(
    level: 'info' | 'warn' | 'error' | 'debug',
    message: string,
    context?: string,
    meta?: Record<string, unknown>,
    correlationId?: string
  ): string {
    const payload: StructuredLogPayload = {
      timestamp: new Date().toISOString(),
      level,
      context: context || 'Application',
      correlationId,
      message,
      meta,
    };
    return JSON.stringify(payload);
  }

  log(message: string, context?: string, meta?: Record<string, unknown>, correlationId?: string) {
    console.log(this.formatLog('info', message, context, meta, correlationId));
  }

  error(message: string, trace?: string, context?: string, correlationId?: string) {
    console.error(
      this.formatLog('error', message, context, { stack: trace }, correlationId)
    );
  }

  warn(message: string, context?: string, correlationId?: string) {
    console.warn(this.formatLog('warn', message, context, undefined, correlationId));
  }

  debug(message: string, context?: string, correlationId?: string) {
    console.debug(this.formatLog('debug', message, context, undefined, correlationId));
  }
}
