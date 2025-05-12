import { Module } from '@nestjs/common';
import { EmbeddingsService } from './embeddings.service';
import { GenerativeModule } from '../generative/generative.module';

@Module({
  imports: [GenerativeModule],
  providers: [EmbeddingsService],
  exports: [EmbeddingsService],
})
export class EmbeddingsModule {}
