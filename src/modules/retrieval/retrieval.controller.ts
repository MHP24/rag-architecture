import { Body, Controller, Post } from '@nestjs/common';
import { CreateIndexDto } from './dto';
import { RetrievalService } from './retrieval.service';

@Controller('retrieval')
export class RetrievalController {
  constructor(private readonly retrievalService: RetrievalService) {}

  @Post('create-index')
  createIndex(@Body() createIndexDto: CreateIndexDto) {
    return this.retrievalService.createIndex(
      createIndexDto.index,
      createIndexDto.body,
    );
  }
}
