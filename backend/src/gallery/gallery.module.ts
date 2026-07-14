import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';

@Module({
    imports: [
        MulterModule.register({
            limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
        }),
    ],
    controllers: [GalleryController],
    providers: [GalleryService],
})
export class GalleryModule { }
