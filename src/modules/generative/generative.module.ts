import { Module } from '@nestjs/common';
import { GenerativeService } from './generative.service';

@Module({
  providers: [GenerativeService],
  exports: [GenerativeService],
})
export class GenerativeModule {}
