import { pipeline } from '@huggingface/transformers';

export class Embedding {
  async generate(content: string): Promise<number[]> {
    const extractor = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2',
    );
    const output = await extractor(content, {
      pooling: 'mean',
      normalize: true,
    });

    const embedding: number[] = Object.values(
      (output as any).ort_tensor.cpuData ?? {},
    );

    return embedding;
  }
}
