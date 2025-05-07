import { Body, Controller, Post } from '@nestjs/common';
import { CreateIndexDto, SearchDocumentQueryDto } from './dto';
import { RetrievalService } from './retrieval.service';

@Controller('retrieval')
export class RetrievalController {
  constructor(private readonly retrievalService: RetrievalService) {}

  @Post('create-index')
  createIndex(@Body() createIndexDto: CreateIndexDto) {
    return this.retrievalService.createDocumentIndex(createIndexDto.index);
  }

  @Post('search-document-query')
  searchDocumentQuery(@Body() searchDocumentQueryDto: SearchDocumentQueryDto) {
    return this.retrievalService.searchDocumentQuery(searchDocumentQueryDto);
  }
}
