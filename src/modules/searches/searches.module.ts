import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchesService } from './searches.service';
import { SearchesController } from './searches.controller';
import { envs } from '../../config';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: envs.elasticsearch.url,
    }),
  ],
  controllers: [SearchesController],
  providers: [SearchesService],
  exports: [SearchesService],
})
export class SearchesModule {}
