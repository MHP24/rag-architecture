import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { RetrievalService } from './retrieval.service';
import { envs } from '../../config';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: envs.es.url,
    }),
  ],
  providers: [RetrievalService],
  exports: [RetrievalService],
})
export class RetrievalModule {}
