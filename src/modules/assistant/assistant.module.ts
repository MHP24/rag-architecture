import { Module } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { AssistantController } from './assistant.controller';
import { IndexesModule } from '../indexes/indexes.module';

@Module({
  imports: [IndexesModule],
  controllers: [AssistantController],
  providers: [AssistantService],
})
export class AssistantModule {}
