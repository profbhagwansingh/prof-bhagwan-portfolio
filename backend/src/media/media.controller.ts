import { Controller, Post, Delete, Body, UseGuards, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';

@Controller('api/media')
@UseGuards(AuthGuard('jwt'))
export class MediaController {
    constructor(private mediaService: MediaService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.mediaService.saveFile(file);
    }

    @Post('upload/multiple')
    @UseInterceptors(FilesInterceptor('files', 10, { limits: { fileSize: 10 * 1024 * 1024 } }))
    async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
        const results = await Promise.all(files.map((f) => this.mediaService.saveFile(f)));
        return results;
    }

    @Delete('delete')
    async deleteFile(@Body('url') url: string) {
        await this.mediaService.deleteFile(url);
        return { message: 'File deleted' };
    }
}
