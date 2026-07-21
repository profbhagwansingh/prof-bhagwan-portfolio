import { Controller, Get } from '@nestjs/common';
import { ContentService } from './content.service';

@Controller('api/homepage-data')
export class HomepageController {
    constructor(private contentService: ContentService) { }

    @Get()
    async getHomepageData() {
        return this.contentService.getHomepageData();
    }
}
