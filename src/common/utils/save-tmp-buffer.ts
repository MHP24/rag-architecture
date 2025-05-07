import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export const saveTmpBuffer = async (
  buffer: Buffer,
  extension: string,
): Promise<string> => {
  const filePath = `tmp/${uuidv4()}.${extension}`;
  await fs.writeFile(filePath, buffer);

  return filePath;
};
