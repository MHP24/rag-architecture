import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { EmbeddingData } from '../embeddings/types';
import { v4 as uuidv4 } from 'uuid';
import { SearchDocumentQueryDto } from './dto';
import { GenerativeService } from '../generative/generative.service';
import { EmbeddingsService } from '../embeddings/embeddings.service';

@Injectable()
export class RetrievalService {
  private logger = new Logger(RetrievalService.name);

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly generativeService: GenerativeService,
    private readonly embeddingsService: EmbeddingsService,
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
          id: { type: 'keyword' },
          fileName: { type: 'text' },
          pageNumber: { type: 'integer' },
          chunkText: { type: 'text' },
          embedding: { type: 'dense_vector', dims: 768, similarity: 'cosine' },
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
      for (let i = 0; i < chunks.length; i++) {
        this.logger.log(
          `Page (${page}). Indexing embeddings with: ${embeddings[i].length} dims`,
        );
        await this.indexDocument(indexName, {
          id: uuidv4(),
          fileName,
          pageNumber: page,
          chunkText: chunks[i],
          embedding: embeddings[i],
        });
      }
    }
  }

  async searchDocumentQuery(searchDocumentQueryDto: SearchDocumentQueryDto) {
    const { index, query, k } = searchDocumentQueryDto;

    const queryArray = await this.generativeService.embedChunks([query]);
    const rawEmbedding = queryArray.result.results[0].embedding;
    const queryEmbedding =
      this.embeddingsService.normalizeEmbedding(rawEmbedding);

    const searchResponse = await this.elasticsearchService.search({
      index,
      body: {
        size: k,
        query: {
          knn: {
            field: 'embedding',
            query_vector: queryEmbedding,
            k,
            num_candidates: 100,
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
  }
}
