import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { IndexesService } from './indexes.service';
import { IndexesController } from './indexes.controller';
import { envs } from '../../config';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: envs.elasticsearch.url,
    }),
  ],
  controllers: [IndexesController],
  providers: [IndexesService],
  exports: [IndexesService],
})
export class IndexesModule {}
