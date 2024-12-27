import { IsString } from 'class-validator';

export class AskDto {
  @IsString()
  message: string;
}
