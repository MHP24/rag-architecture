import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { UploadFileDto } from './dto';
import { fileTypePipe } from './pipes';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload/:index')
  @ApiOperation({ summary: 'Upload a document' })
  @ApiBody({ type: UploadFileDto })
  @ApiResponse({ status: 201, description: 'Document created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or unsupported extension',
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(fileTypePipe) file: Express.Multer.File,
    @Param() uploadFileDto: UploadFileDto,
  ) {
    return this.filesService.handleUploadFile(file, uploadFileDto);
  }
}
