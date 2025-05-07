import { IsString } from 'class-validator';

export class CreateIndexDto {
  @IsString()
  index: string;
}
