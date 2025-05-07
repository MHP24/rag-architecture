import { IsObject, IsString } from 'class-validator';

export class CreateIndexDto {
  @IsString()
  index: string;

  @IsObject()
  body: any;
}
