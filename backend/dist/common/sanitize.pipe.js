"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanitizeRichTextPipe = exports.SanitizePipe = void 0;
const common_1 = require("@nestjs/common");
let SanitizePipe = class SanitizePipe {
    transform(value, metadata) {
        if (metadata.type === 'param')
            return value;
        if (typeof value === 'string') {
            return this.sanitizeString(value);
        }
        if (typeof value === 'object' && value !== null) {
            return this.sanitizeObject(value);
        }
        return value;
    }
    sanitizeString(str) {
        return str
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '')
            .replace(/\bon\w+\s*=\s*[^\s>]*/gi, '')
            .replace(/javascript\s*:/gi, '')
            .replace(/data\s*:\s*text\/html/gi, '')
            .replace(/vbscript\s*:/gi, '')
            .replace(/expression\s*\(/gi, '')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
    sanitizeObject(obj) {
        if (Array.isArray(obj)) {
            return obj.map((item) => {
                if (typeof item === 'string')
                    return this.sanitizeString(item);
                if (typeof item === 'object' && item !== null)
                    return this.sanitizeObject(item);
                return item;
            });
        }
        const sanitized = {};
        for (const [key, val] of Object.entries(obj)) {
            if (typeof val === 'string') {
                sanitized[key] = this.sanitizeString(val);
            }
            else if (typeof val === 'object' && val !== null) {
                sanitized[key] = this.sanitizeObject(val);
            }
            else {
                sanitized[key] = val;
            }
        }
        return sanitized;
    }
};
exports.SanitizePipe = SanitizePipe;
exports.SanitizePipe = SanitizePipe = __decorate([
    (0, common_1.Injectable)()
], SanitizePipe);
let SanitizeRichTextPipe = class SanitizeRichTextPipe {
    transform(value, metadata) {
        if (metadata.type === 'param')
            return value;
        if (typeof value === 'string') {
            return this.sanitize(value);
        }
        if (typeof value === 'object' && value !== null) {
            return this.sanitizeObject(value);
        }
        return value;
    }
    sanitize(str) {
        return str
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '')
            .replace(/\bon\w+\s*=\s*[^\s>]*/gi, '')
            .replace(/javascript\s*:/gi, '')
            .replace(/vbscript\s*:/gi, '')
            .replace(/expression\s*\(/gi, '');
    }
    sanitizeObject(obj) {
        if (Array.isArray(obj)) {
            return obj.map((item) => {
                if (typeof item === 'string')
                    return this.sanitize(item);
                if (typeof item === 'object' && item !== null)
                    return this.sanitizeObject(item);
                return item;
            });
        }
        const result = {};
        for (const [key, val] of Object.entries(obj)) {
            if (typeof val === 'string') {
                result[key] = this.sanitize(val);
            }
            else if (typeof val === 'object' && val !== null) {
                result[key] = this.sanitizeObject(val);
            }
            else {
                result[key] = val;
            }
        }
        return result;
    }
};
exports.SanitizeRichTextPipe = SanitizeRichTextPipe;
exports.SanitizeRichTextPipe = SanitizeRichTextPipe = __decorate([
    (0, common_1.Injectable)()
], SanitizeRichTextPipe);
//# sourceMappingURL=sanitize.pipe.js.map