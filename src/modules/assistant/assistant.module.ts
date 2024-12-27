import { Module } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { AssistantController } from './assistant.controller';
import { SearchesModule } from '../searches/searches.module';

@Module({
  imports: [SearchesModule],
  controllers: [AssistantController],
  providers: [AssistantService],
})
export class AssistantModule {}
