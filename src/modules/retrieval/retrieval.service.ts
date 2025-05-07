import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { EmbeddingData } from '../embeddings/types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RetrievalService {
  private logger = new Logger(RetrievalService.name);

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

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

  // TODO: Refactor
  async indexDocumentEmbeddings(
    indexName: string,
    fiileName: string,
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
        fiileName,
        pageNumber: page,
        embedding: embeddings.flat(),
        chunkText: chunks,
      });
    }
  }

  // TODO: Add Search Query method
}
