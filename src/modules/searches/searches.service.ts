import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { v4 as uuidv4 } from 'uuid';
import { Search } from './types';
import { formatArrayToText } from './utils';

@Injectable()
export class SearchesService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  // * Index content from PDF
  async indexContent(index: string, content: string): Promise<{ id: string }> {
    const id = uuidv4();
    await this.elasticsearchService.index({
      index,
      id,
      body: { content },
    });

    return { id };
  }

  // * Get content from database
  async searchContent(index: string, query: string): Promise<Search> {
    const data = await this.elasticsearchService.search({
      index,
      body: {
        query: {
          match: { content: query },
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
