import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { MediaModule } from '../media/media.module';

@Module({
    imports: [
        MulterModule.register({
            storage: memoryStorage(),
            limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
        }),
        MediaModule,
    ],
    controllers: [GalleryController],
    providers: [GalleryService],
    exports: [GalleryService],
})
export class GalleryModule { }
