import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { RetrievalModule } from '../retrieval/retrieval.module';
import { EmbeddingsModule } from '../embeddings/embeddings.module';

@Module({
  imports: [RetrievalModule, EmbeddingsModule],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
