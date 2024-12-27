import { v4 as uuidv4 } from 'uuid';
import { IdGeneratorAdapter } from './id-generator.adapter.interface';

export class IdGenerator implements IdGeneratorAdapter {
  generate(prefix: string = ''): string {
    return `${prefix.length > 0 ? prefix + '-' : ''}${uuidv4()}`;
  }
}
