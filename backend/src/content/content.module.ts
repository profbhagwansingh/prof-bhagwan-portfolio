import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { HomepageController } from './homepage.controller';

@Module({
    controllers: [ContentController, HomepageController],
    providers: [ContentService],
    exports: [ContentService],
})
export class ContentModule { }
