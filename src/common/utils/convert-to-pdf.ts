import { exec } from 'child_process';
import * as util from 'util';
import * as path from 'path';
import * as fs from 'fs';

const execPromise = util.promisify(exec);

export const convertToPdf = async (filePath: string): Promise<string> => {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf') return filePath;

  const outputDir = path.dirname(filePath);
  const pdfPath = path.join(outputDir, `${path.basename(filePath, ext)}.pdf`);

  try {
    await execPromise(
      `libreoffice --headless --convert-to pdf --outdir ${outputDir} ${filePath}`,
    );

    if (!fs.existsSync(pdfPath)) {
      throw new Error('PDF Conversion failed');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }

  return pdfPath;
};
