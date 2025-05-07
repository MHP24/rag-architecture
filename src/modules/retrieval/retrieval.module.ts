import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { RetrievalService } from './retrieval.service';
import { envs } from '../../config';
import { RetrievalController } from './retrieval.controller';
import { GenerativeModule } from '../generative/generative.module';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: envs.es.url,
    }),
    GenerativeModule,
  ],
  controllers: [RetrievalController],
  providers: [RetrievalService],
  exports: [RetrievalService],
})
export class RetrievalModule {}
