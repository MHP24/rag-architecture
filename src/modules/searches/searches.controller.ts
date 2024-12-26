import { Body, Controller, Get } from '@nestjs/common';
import { SearchesService } from './searches.service';
import { SearchDto } from './dto';

@Controller('searches')
export class SearchesController {
  constructor(private readonly searchesService: SearchesService) {}

  @Get('search')
  searchPdf(@Body() searchDto: SearchDto) {
    return this.searchesService.searchContent('pdfs', searchDto.message);
  }
}
