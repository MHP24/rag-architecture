import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { EmbeddingData } from '../embeddings/types';
import { v4 as uuidv4 } from 'uuid';
import { SearchDocumentQueryDto } from './dto';
import { GenerativeService } from '../generative/generative.service';

@Injectable()
export class RetrievalService {
  private logger = new Logger(RetrievalService.name);

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly generativeService: GenerativeService,
  ) {}

  async createIndex(index: string, body?: any) {
    return this.elasticsearchService.indices.create({
      index,
      body,
    });
  }

  async createDocumentIndex(indexName: string) {
    await this.createIndex(indexName, {
      mappings: {
        properties: {
          id: { type: 'text' },
          fileName: { type: 'text' },
          pageNumber: { type: 'integer' },
          chunkText: { type: 'text' },
          embedding: { type: 'dense_vector', dims: 3840 },
        },
      },
    });
  }

  async indexDocument(index: string, body: any) {
    return this.elasticsearchService.index({
      index,
      body,
    });
  }

  async search(index: string, query: any) {
    try {
      const data = await this.elasticsearchService.search({
        index,
        body: query,
      });
      return data;
    } catch (error) {
      throw new Error(`Error searching Elasticsearch: ${error.message}`);
    }
  }

  async deleteIndex(index: string) {
    try {
      const exists = await this.elasticsearchService.indices.exists({ index });
      if (exists) {
        await this.elasticsearchService.indices.delete({ index });
      }
    } catch (error) {
      throw new Error(`Error deleting Elasticsearch index: ${error.message}`);
    }
  }

  async indexDocumentEmbeddings(
    indexName: string,
    fileName: string,
    embeddingsData: { page: number; data: EmbeddingData }[],
  ) {
    for (const {
      data: { chunks, embeddings },
      page,
    } of embeddingsData) {
      this.logger.log(
        `Indexing page ${page} with ${embeddings.flat().length} dims`,
      );
      await this.indexDocument(indexName, {
        id: uuidv4(),
        fileName,
        pageNumber: page,
        embedding: embeddings.flat(),
        chunkText: chunks,
      });
    }
  }

  async searchDocumentQuery(searchDocumentQueryDto: SearchDocumentQueryDto) {
    const { index, query, k } = searchDocumentQueryDto;

    try {
      const queryArray = await this.generativeService.embedChunks([
        query,
        '',
        '',
        '',
        '',
      ]);

      const embeddings = queryArray.result.results.map(
        ({ embedding }) => embedding,
      );

      const searchResponse = await this.elasticsearchService.search({
        index,
        body: {
          size: k,
          query: {
            script_score: {
              query: { match_all: {} },
              script: {
                source:
                  "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
                params: {
                  query_vector: embeddings.flat(),
                },
              },
            },
          },
          _source: ['fileName', 'pageNumber', 'chunkText'],
        },
      });

      return searchResponse.hits.hits.map((hit: any) => ({
        score: hit._score,
        fileName: hit._source.fileName,
        pageNumber: hit._source.pageNumber,
        chunkText: hit._source.chunkText,
        id: hit._id,
      }));
    } catch (error) {
      this.logger.error(`Error in similarity search: ${error.message}`);
      throw new InternalServerErrorException(`Search failed: ${error.message}`);
    }
  }
}
