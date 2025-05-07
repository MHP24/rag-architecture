import { IsNumber, IsPositive, IsString, Max } from 'class-validator';

export class SearchDocumentQueryDto {
  @IsString()
  query: string;

  @IsString()
  index: string;

  @IsNumber()
  @IsPositive()
  @Max(5)
  k: number;
}
