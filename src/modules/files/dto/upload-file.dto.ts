import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UploadFileDto {
  @ApiProperty()
  @IsString()
  index: string;
}
