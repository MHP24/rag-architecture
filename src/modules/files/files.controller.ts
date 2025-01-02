import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { UploadFileDto } from './dto';
import { fileTypePipe } from './pipes';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload/:index')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(fileTypePipe) file: Express.Multer.File,
    @Param() uploadFileDto: UploadFileDto,
  ) {
    return this.filesService.handleUploadFile(file, uploadFileDto);
  }

  @Get('/')
  getFiles() {
    return this.filesService.getAll();
  }
}
