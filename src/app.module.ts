import { Module } from '@nestjs/common';
import { PdfModule } from './modules/pdf/pdf.module';
import { SearchesModule } from './modules/searches/searches.module';
import { AssistantModule } from './modules/assistant/assistant.module';
@Module({
  imports: [PdfModule, SearchesModule, AssistantModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
