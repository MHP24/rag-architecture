import { Module } from '@nestjs/common';
import { PdfModule } from './modules/pdf/pdf.module';
import { IndexesModule } from './modules/indexes/indexes.module';
import { AssistantModule } from './modules/assistant/assistant.module';
@Module({
  imports: [PdfModule, IndexesModule, AssistantModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
