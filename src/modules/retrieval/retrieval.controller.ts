import { Body, Controller, Post } from '@nestjs/common';
import {
  CreateIndexDto,
  SearchDocumentQueryDto,
  SearchDocumentResponseDto,
} from './dto';
import { RetrievalService } from './retrieval.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('retrieval')
@Controller('retrieval')
export class RetrievalController {
  constructor(private readonly retrievalService: RetrievalService) {}

  @Post('create-index')
  @ApiBody({ type: CreateIndexDto })
  @ApiResponse({ status: 201, description: 'Index created successfully' })
  @ApiResponse({ status: 500, description: 'Unexpected error creating index' })
  createIndex(@Body() createIndexDto: CreateIndexDto) {
    return this.retrievalService.createDocumentIndex(createIndexDto.index);
  }

  @Post('search-document-query')
  @ApiBody({ type: SearchDocumentQueryDto })
  @ApiResponse({
    status: 201,
    type: SearchDocumentResponseDto,
    isArray: true,
    description: 'Array with search results',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  searchDocumentQuery(@Body() searchDocumentQueryDto: SearchDocumentQueryDto) {
    return this.retrievalService.searchDocumentQuery(searchDocumentQueryDto);
  }
}
