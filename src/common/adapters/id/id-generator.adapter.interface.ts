export interface IdGeneratorAdapter {
  generate(prefix?: string): string;
}
