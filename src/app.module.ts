import { Module } from '@nestjs/common';
import { FilesModule } from './modules/files/files.module';
import { IndexesModule } from './modules/indexes/indexes.module';
import { AssistantModule } from './modules/assistant/assistant.module';
@Module({
  imports: [FilesModule, IndexesModule, AssistantModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
