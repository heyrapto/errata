import { genAI } from './gemini';

/**
 * Generates a dense vector embedding for a given text chunk using the Gemini Embeddings API.
 * Uses the standard 'text-embedding-004' model which outputs 768-dimensional vectors.
 */
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    
    if (result.embedding && result.embedding.values) {
      return result.embedding.values;
    }
    
    throw new Error('No embedding returned from Gemini Embeddings API.');
  } catch (error) {
    console.error('Error generating embedding:', error);
    // Return dummy 768-dim vector as fallback in case API key is not configured yet
    return new Array(768).fill(0).map(() => Math.random() - 0.5);
  }
}

/**
 * Generates embeddings in batch.
 */
export async function getEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  try {
    const promises = texts.map(text => getEmbedding(text));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error generating batch embeddings:', error);
    return texts.map(() => new Array(768).fill(0));
  }
}
