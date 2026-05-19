/**
 * Extracts raw textual data from an uploaded PDF document buffer.
 */
export async function extractTextFromPdf(pdfBuffer: Buffer): Promise<string> {
  try {
    // Polyfill DOMMatrix for pdf-parse CJS evaluation in Node.js environments
    if (typeof global !== 'undefined' && !(global as any).DOMMatrix) {
      (global as any).DOMMatrix = class DOMMatrix {};
    }
    
    const pdf = require('pdf-parse');
    const data = await pdf(pdfBuffer);
    
    if (data && data.text) {
      return data.text;
    }
    
    throw new Error('PDF parsed, but returned no textual data.');
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to parse uploaded PDF file. Ensure it contains select-able text.');
  }
}
