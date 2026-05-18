interface Chunk {
  text: string;
  page: number;
}

/**
 * Splits document text into overlapping semantic chunks of ~1000 characters
 * with ~200 characters of overlap. Estimates pages assuming ~3000 characters per page.
 */
export function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): Chunk[] {
  if (!text) return [];

  const chunks: Chunk[] = [];
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  let startIndex = 0;
  
  while (startIndex < cleanText.length) {
    let endIndex = startIndex + chunkSize;
    
    // Attempt to end chunk nicely at the end of a sentence
    if (endIndex < cleanText.length) {
      const searchSpace = cleanText.substring(endIndex - 100, endIndex + 50);
      const sentenceEnd = searchSpace.search(/[.!?]\s/);
      if (sentenceEnd !== -1) {
        endIndex = (endIndex - 100) + sentenceEnd + 1;
      }
    } else {
      endIndex = cleanText.length;
    }
    
    const chunkText = cleanText.substring(startIndex, endIndex).trim();
    
    if (chunkText.length > 50) { // Discard tiny noise fragments
      // Assume approx 3000 characters per printed page
      const estimatedPage = Math.floor(startIndex / 3000) + 1;
      
      chunks.push({
        text: chunkText,
        page: estimatedPage
      });
    }
    
    // Slide the window forward
    startIndex = endIndex - overlap;
    if (startIndex >= cleanText.length || endIndex === cleanText.length) {
      break;
    }
  }
  
  return chunks;
}
