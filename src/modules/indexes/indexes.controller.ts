import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IndexesService } from './indexes.service';
import { SearchDto } from './dto';

@Controller('indexes')
export class IndexesController {
  constructor(private readonly indexesService: IndexesService) {}

  @Get('search')
  searchContent(@Body() searchDto: SearchDto) {
    return this.indexesService.searchIndexedContent(searchDto);
  }

  @Post('create-index/:index')
  createIndex(@Param('index') index: string) {
    return this.indexesService.createIndex(index);
  }
}
