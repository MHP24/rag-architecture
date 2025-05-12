import { Injectable } from '@nestjs/common';
import { EmbeddingData } from './types';
import { GenerativeService } from '../generative/generative.service';

@Injectable()
export class EmbeddingsService {
  constructor(private readonly generativeService: GenerativeService) {}

  // * Normalizes content based on the operating system's document generation format
  normalizeText(text: string): string {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n+/g, '\n')
      .replace(/([^\n])\s+([^\n])/g, '$1 $2')
      .trim();
  }

  // * Normalizes embeddings for queries and Elasticsearch storage
  normalizeEmbedding(embedding: number[]): number[] {
    const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map((val) => val / norm);
  }

  // * Text splitter into chunks with token limit consideration
  splitTextIntoChunks(text: string, maxChars: number = 500): string[] {
    const textSplitted = this.normalizeText(text).split('\n');
    const chunks: string[] = [];
    let currentChunk = '';

    for (const para of textSplitted) {
      const trimmedPara = para.trim();
      if (!trimmedPara) {
        continue;
      }

      if (currentChunk.length + trimmedPara.length + 1 <= maxChars) {
        currentChunk = currentChunk
          ? `${currentChunk}\n${trimmedPara}`
          : trimmedPara;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = trimmedPara;

        if (currentChunk.length > maxChars) {
          const words = currentChunk.split(' ');
          currentChunk = '';
          for (const word of words) {
            if (currentChunk.length + word.length + 1 <= maxChars) {
              currentChunk = currentChunk ? `${currentChunk} ${word}` : word;
            } else {
              chunks.push(currentChunk.trim());
              currentChunk = word;
            }
          }
        }
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  // * Generates embeddings for a specific page of text
  // * When processing a full document, this method should be used inside a map, for-loop, etc
  async embedPage(text: string): Promise<EmbeddingData> {
    const chunks = this.splitTextIntoChunks(text);
    const embeddingsResponse = await this.generativeService.embedChunks(chunks);

    const normalizedEmbeddings = embeddingsResponse.result.results.map(
      ({ embedding }) => this.normalizeEmbedding(embedding),
    );

    return {
      chunks,
      embeddings: normalizedEmbeddings,
    };
  }
}
