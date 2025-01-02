import { Body, Controller, Get } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { AskDto } from './dto';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get('ask')
  ask(@Body() askDto: AskDto) {
    return this.assistantService.ask(askDto);
  }
}
