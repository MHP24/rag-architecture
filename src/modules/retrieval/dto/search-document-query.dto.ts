import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, Max } from 'class-validator';

export class SearchDocumentQueryDto {
  @ApiProperty()
  @IsString()
  query: string;

  @ApiProperty()
  @IsString()
  index: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @Max(15)
  k: number;
}
