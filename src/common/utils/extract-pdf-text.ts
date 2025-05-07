import { PDFExtract } from 'pdf.js-extract';

export const extractPdfText = (
  filePath: string,
): Promise<{ page: number; content: string }[]> => {
  const pdfExtract = new PDFExtract();

  return new Promise((resolve, reject) => {
    // * Extract raw PDF data
    pdfExtract.extract(filePath, {}, (err, data) => {
      if (err) {
        return reject(err);
      }

      // * Process each page to reconstruct text with proper paragraphs
      const processedPages = data.pages.map((page, pageIndex) => {
        // *  Sort elements by vertical position (top to bottom)
        const elementsByVerticalPosition = [...page.content].sort(
          (a, b) => a.y - b.y,
        );

        let pageContent = '';
        let previousElementY = 0;
        const NEW_PARAGRAPH_THRESHOLD = 5;

        // * Rebuild text while preserving paragraph breaks
        for (const element of elementsByVerticalPosition) {
          // * Add line break when vertical position changes significantly
          if (
            Math.abs(element.y - previousElementY) > NEW_PARAGRAPH_THRESHOLD
          ) {
            pageContent += '\n';
          }

          pageContent += element.str;
          previousElementY = element.y;
        }

        return {
          page: pageIndex + 1,
          content: pageContent.trim(),
        };
      });

      resolve(processedPages);
    });
  });
};
