import { Injectable } from '@nestjs/common';
import { UploadFileDto } from './dto';
import { RetrievalService } from '../retrieval/retrieval.service';
import {
  chunkArray,
  convertToPdf,
  extractPdfText,
  saveTmpBuffer,
  wait,
} from '../../common/utils';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { EmbeddingData } from '../embeddings/types';

@Injectable()
export class FilesService {
  constructor(
    private readonly searchService: RetrievalService,
    private readonly embeddingsService: EmbeddingsService,
  ) {}

  // * Upload data from request
  async handleUploadFile(
    file: Express.Multer.File,
    uploadFileDto: UploadFileDto,
  ) {
    // * File data
    const { originalname, buffer } = file;

    // * File store
    const fileTmpPath = await saveTmpBuffer(
      buffer,
      originalname.split('.').at(-1),
    );

    const convertedFileTmpPath = await convertToPdf(fileTmpPath);

    // * Transformation and extraction
    const pages = await extractPdfText(convertedFileTmpPath);
    const chunkedPages = chunkArray(pages, 5);

    const fileData: { page: number; data: EmbeddingData }[] = [];

    for (const chunk of chunkedPages) {
      const chunkResult = await Promise.all(
        chunk.map(async ({ page, content }) => ({
          page,
          data: await this.embeddingsService.embedPage(content),
        })),
      );
      fileData.push(...chunkResult);

      await wait(1000);
    }

    // * Store embeddings in ES
    await this.searchService.indexDocumentEmbeddings(
      uploadFileDto.index,
      originalname,
      fileData,
    );
    return fileData;
  }
}
