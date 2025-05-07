import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { RetrievalService } from './retrieval.service';
import { envs } from '../../config';
import { RetrievalController } from './retrieval.controller';
import { GenerativeModule } from '../generative/generative.module';
import { EmbeddingsModule } from '../embeddings/embeddings.module';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: envs.es.url,
    }),
    GenerativeModule,
    EmbeddingsModule,
  ],
  controllers: [RetrievalController],
  providers: [RetrievalService],
  exports: [RetrievalService],
})
export class RetrievalModule {}
