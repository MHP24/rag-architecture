import { Injectable } from '@nestjs/common';
import { AskDto } from './dto';
import { SearchesService } from '../searches/searches.service';
import { Http } from '../../common';
import { envs } from '../../config';
import { OpenaiResponse } from './types/openai';

@Injectable()
export class AssistantService {
  private readonly http = new Http();
  constructor(private readonly searchesService: SearchesService) {}

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

  async ask({ message }: AskDto) {
    const data = await this.searchesService.searchContent('pdfs', message);
    if (!data.results) {
      return { message: 'No estoy capacitado para responder esta pregunta' };
    }
    console.log(data.response);
    return {
      message: await this.sendToLLM(data.response, message),
    };
  }
}
