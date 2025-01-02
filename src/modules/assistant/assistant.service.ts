import { Injectable } from '@nestjs/common';
import { AskDto } from './dto';
import { IndexesService } from '../indexes/indexes.service';
import { Http } from '../../common';
import { envs } from '../../config';
import { OpenaiResponse } from './types/openai';

@Injectable()
export class AssistantService {
  private readonly http = new Http();
  constructor(private readonly indexesService: IndexesService) {}

  async sendToLLM(context: string, question: string): Promise<string> {
    const { data } = await this.http.post<OpenaiResponse>({
      url: envs.llm.openaiUrl,
      headers: { Authorization: `Bearer ${envs.llm.openaiApiKey}` },
      body: {
        model: envs.llm.openaiModel,
        messages: [
          {
            role: 'system',
            content: envs.llm.prompt,
          },
          { role: 'user', content: `Texto: ${context}\nPregunta: ${question}` },
        ],
        max_tokens: 150,
        temperature: 0.7,
      },
    });

    return data.choices[0].message.content.trim();
  }

  async ask(askDto: AskDto) {
    const data = await this.indexesService.searchIndexedContent(askDto);
    if (!data.results) {
      return { message: 'No estoy capacitado para responder esta pregunta' };
    }
    return {
      message: await this.sendToLLM(data.response, askDto.message),
    };
  }
}
