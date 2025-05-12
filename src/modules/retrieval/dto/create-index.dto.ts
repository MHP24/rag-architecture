import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateIndexDto {
  @ApiProperty()
  @IsString()
  index: string;
}
