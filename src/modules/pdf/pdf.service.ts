import { Injectable } from '@nestjs/common';
import { SearchesService } from '../searches/searches.service';
import * as pdf from 'pdf-parse';
import * as fs from 'fs';

@Injectable()
export class PdfService {
  constructor(private readonly searchesService: SearchesService) {}

  // * Extract data required from PDF files
  async extractTextFromPdf(filePath: string): Promise<string> {
    const pdfBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(pdfBuffer);
    return pdfData.text;
  }

  // * Upload data from request
  async handleUploadPdf(file: Express.Multer.File) {
    // * File data
    const { originalname, buffer, ...rest } = file;

    // * File store
    const filePath = `./tmp/${originalname}`;
    fs.writeFileSync(filePath, buffer);

    // * Transformation and extraction
    const content = await this.extractTextFromPdf(filePath);
    const { id } = await this.searchesService.indexContent('pdfs', content);

    // * Remove from tmp directory
    fs.unlinkSync(filePath);

    return { fileId: id, originalname, ...rest };
  }
}
