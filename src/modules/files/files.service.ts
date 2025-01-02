import { Injectable, NotFoundException } from '@nestjs/common';
import { IndexesService } from '../indexes/indexes.service';
import * as pdf from 'pdf-parse';
import * as fs from 'fs';
import { UploadFileDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly indexesService: IndexesService,
    private readonly prismaService: PrismaService,
  ) {}

  // * Extract data required from PDF files
  async extractTextFromPdf(filePath: string): Promise<string> {
    const pdfBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(pdfBuffer);
    return pdfData.text;
  }

  // * Upload data from request
  async handleUploadFile(
    file: Express.Multer.File,
    uploadFileDto: UploadFileDto,
  ) {
    // * File data
    const { originalname, buffer, mimetype, ...rest } = file;

    // * File store
    const filePath = `./tmp/${originalname}`;
    fs.writeFileSync(filePath, buffer);

    // * Transformation and extraction
    const content = await this.extractTextFromPdf(filePath);
    const { id } = await this.indexesService.indexContent(
      uploadFileDto.index,
      content,
    );

    // * Remove from tmp directory
    fs.unlinkSync(filePath);

    // * Save file props in database
    const data = await this.prismaService.file.create({
      data: {
        id,
        mimetype,
        name: originalname,
      },
    });

    return { ...data, ...rest };
  }

  // * Get all files from database
  async getAll() {
    const files = await this.prismaService.file.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        isActive: true,
      },
    });

    if (!files.length) throw new NotFoundException('Files not found');

    return files;
  }
}
