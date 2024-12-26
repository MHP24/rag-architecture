import { Module } from '@nestjs/common';
import { PdfModule } from './modules/pdf/pdf.module';
import { SearchesModule } from './modules/searches/searches.module';

@Module({
  imports: [PdfModule, SearchesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
