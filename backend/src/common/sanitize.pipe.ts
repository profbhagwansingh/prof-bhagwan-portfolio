import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

/**
 * XSS Sanitization Pipe
 * 
 * Strips dangerous HTML/script patterns from string inputs.
 * Applied globally or per-route to prevent XSS attacks.
 * 
 * Usage (per-route):
 *   @Body(new SanitizePipe()) data: CreateDto
 * 
 * Usage (global - in main.ts):
 *   app.useGlobalPipes(new SanitizePipe());
 */
@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Only sanitize body/query parameters, not route params
    if (metadata.type === 'param') return value;

    if (typeof value === 'string') {
      return this.sanitizeString(value);
    }

    if (typeof value === 'object' && value !== null) {
      return this.sanitizeObject(value);
    }

    return value;
  }

  private sanitizeString(str: string): string {
    return str
      // Remove script tags and content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove event handlers (onclick, onerror, etc.)
      .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/\bon\w+\s*=\s*[^\s>]*/gi, '')
      // Remove javascript: protocol
      .replace(/javascript\s*:/gi, '')
      // Remove data: protocol (can be used for XSS)
      .replace(/data\s*:\s*text\/html/gi, '')
      // Remove vbscript: protocol
      .replace(/vbscript\s*:/gi, '')
      // Remove expression() in CSS
      .replace(/expression\s*\(/gi, '')
      // Encode remaining angle brackets in non-rich-text fields
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  private sanitizeObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => {
        if (typeof item === 'string') return this.sanitizeString(item);
        if (typeof item === 'object' && item !== null) return this.sanitizeObject(item);
        return item;
      });
    }

    const sanitized: any = {};
    for (const [key, val] of Object.entries(obj)) {
      if (typeof val === 'string') {
        sanitized[key] = this.sanitizeString(val);
      } else if (typeof val === 'object' && val !== null) {
        sanitized[key] = this.sanitizeObject(val);
      } else {
        sanitized[key] = val;
      }
    }
    return sanitized;
  }
}

/**
 * Lighter sanitizer for rich-text fields where HTML is expected.
 * Only strips dangerous patterns but preserves safe HTML tags.
 */
@Injectable()
export class SanitizeRichTextPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'param') return value;

    if (typeof value === 'string') {
      return this.sanitize(value);
    }

    if (typeof value === 'object' && value !== null) {
      return this.sanitizeObject(value);
    }

    return value;
  }

  private sanitize(str: string): string {
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/\bon\w+\s*=\s*[^\s>]*/gi, '')
      .replace(/javascript\s*:/gi, '')
      .replace(/vbscript\s*:/gi, '')
      .replace(/expression\s*\(/gi, '');
  }

  private sanitizeObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => {
        if (typeof item === 'string') return this.sanitize(item);
        if (typeof item === 'object' && item !== null) return this.sanitizeObject(item);
        return item;
      });
    }

    const result: any = {};
    for (const [key, val] of Object.entries(obj)) {
      if (typeof val === 'string') {
        result[key] = this.sanitize(val);
      } else if (typeof val === 'object' && val !== null) {
        result[key] = this.sanitizeObject(val);
      } else {
        result[key] = val;
      }
    }
    return result;
  }
}
