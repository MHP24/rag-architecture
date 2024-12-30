import { IsString } from 'class-validator';

export class SearchDto {
  @IsString()
  message: string;

  @IsString()
  index: string;
}
