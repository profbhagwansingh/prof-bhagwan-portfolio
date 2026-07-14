import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class SanitizePipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
    private sanitizeString;
    private sanitizeObject;
}
export declare class SanitizeRichTextPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
    private sanitize;
    private sanitizeObject;
}
