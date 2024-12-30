import { Injectable } from '@nestjs/common';
import { IndexesService } from '../indexes/indexes.service';
import * as pdf from 'pdf-parse';
import * as fs from 'fs';
import { UploadPdfDto } from './dto';

@Injectable()
export class PdfService {
  constructor(private readonly indexesService: IndexesService) {}

  // * Extract data required from PDF files
  async extractTextFromPdf(filePath: string): Promise<string> {
    const pdfBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(pdfBuffer);
    return pdfData.text;
  }

  // * Upload data from request
  async handleUploadPdf(file: Express.Multer.File, uploadPdfDto: UploadPdfDto) {
    // * File data
    const { originalname, buffer, ...rest } = file;

    // * File store
    const filePath = `./tmp/${originalname}`;
    fs.writeFileSync(filePath, buffer);

    // * Transformation and extraction
    const content = await this.extractTextFromPdf(filePath);
    const { id, embedding } = await this.indexesService.indexContent(
      uploadPdfDto.index,
      content,
    );

    // * Remove from tmp directory
    fs.unlinkSync(filePath);

    return { fileId: id, originalname, embedding, ...rest };
  }
}
