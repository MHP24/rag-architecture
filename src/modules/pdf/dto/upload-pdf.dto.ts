import { IsString } from 'class-validator';

export class UploadPdfDto {
  @IsString()
  index: string;
}
