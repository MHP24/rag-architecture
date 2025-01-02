import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { v4 as uuidv4 } from 'uuid';
import { Search } from './types';
import { formatArrayToText } from './utils';
import { Embedding } from '../embeddings/embedding';
import { SearchDto } from './dto';

@Injectable()
export class IndexesService {
  private readonly embedding: Embedding = new Embedding();

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  // * Create index
  async createIndex(index: string) {
    return await this.elasticsearchService.indices.create({
      index,
      body: {
        mappings: {
          properties: {
            content: { type: 'text' },
            embedding: {
              type: 'dense_vector',
              dims: 384,
            },
          },
        },
      },
    });
  }

  // * Index content from File
  async indexContent(
    index: string,
    content: string,
  ): Promise<{ id: string; embedding: number[] }> {
    const id = uuidv4();
    const embedding = await this.embedding.generate(content);

    await this.elasticsearchService.index({
      index,
      id,
      body: {
        content,
        embedding,
      },
    });

    return { id, embedding };
  }

  // * Get content from database
  async searchIndexedContent(searchDto: SearchDto): Promise<Search> {
    const queryEmbedding = await this.embedding.generate(searchDto.message);
    const data = await this.elasticsearchService.search({
      index: searchDto.index,
      body: {
        query: {
          function_score: {
            query: {
              match: { content: searchDto.message },
            },
            functions: [
              {
                script_score: {
                  script: {
                    source: `
                      cosineSimilarity(params.queryVector, 'embedding') + 1.0`,
                    params: { queryVector: queryEmbedding },
                  },
                },
              },
            ],
          },
        },
        highlight: {
          fields: {
            content: {
              fragment_size: 200,
              number_of_fragments: 5,
            },
          },
        },
      },
    });

    // * Output format
    const results: number = (data.hits.total as any).value;
    return {
      results,
      response: results
        ? formatArrayToText(data.hits.hits[0].highlight.content)
        : null,
    };
  }
}
