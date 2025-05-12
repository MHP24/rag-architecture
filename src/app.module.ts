import { Module } from '@nestjs/common';
import { FilesModule } from './modules/files/files.module';
import { EmbeddingsModule } from './modules/embeddings/embeddings.module';
import { RetrievalModule } from './modules/retrieval/retrieval.module';
import { GenerativeModule } from './modules/generative/generative.module';
@Module({
  imports: [EmbeddingsModule, RetrievalModule, GenerativeModule, FilesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
