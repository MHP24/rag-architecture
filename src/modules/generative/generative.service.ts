import { Injectable } from '@nestjs/common';
import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import { IamAuthenticator } from 'ibm-cloud-sdk-core';
import { envs } from '../../config';

@Injectable()
export class GenerativeService {
  private watsonxAIService = WatsonXAI.newInstance({
    version: envs.llm.version,
    serviceUrl: envs.llm.serviceUrl,
    authenticator: new IamAuthenticator({
      apikey: envs.llm.apiKey,
    }),
  });

  async generateText(prompt: string): Promise<string> {
    const response = await this.watsonxAIService.generateText({
      modelId: envs.llm.model,
      projectId: envs.llm.projectId,
      input: prompt,
      parameters: {
        decoding_method: 'sample',
        max_new_tokens: 2000,
        min_new_tokens: 0,
        random_seed: 42,
        temperature: 0.7,
        top_k: 50,
        top_p: 0.95,
        repetition_penalty: 1,
      },
    });

    return response.result.results[0]?.generated_text ?? '';
  }

  async embedChunks(chunks: string[]) {
    return await this.watsonxAIService.embedText({
      inputs: chunks,
      modelId: envs.llm.embeddingsModel,
      projectId: envs.llm.projectId,
    });
  }
}
