import { ApiProperty } from '@nestjs/swagger';

export class SearchDocumentResponseDto {
  @ApiProperty()
  score: number;

  @ApiProperty()
  fileName: string;

  @ApiProperty()
  pageNumber: number;

  @ApiProperty()
  chunkText: string;

  @ApiProperty()
  id: string;
}
