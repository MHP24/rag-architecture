import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export const fileTypePipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({
      maxSize: 25 * 1024 * 1024,
      message: 'Max file size supported: 25MB',
    }),
    new FileTypeValidator({
      fileType: new RegExp('application/pdf'),
    }),
  ],
});
