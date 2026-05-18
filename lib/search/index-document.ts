import { elasticClient, ensureIndexExists } from './elastic-client';
import { getEmbedding } from '../ai/embeddings';
import { markDocumentAsIndexed } from '../db/documents';

interface ChunkInput {
  text: string;
  page: number;
}

/**
 * Generates vector embeddings for academic chunks and indexes them inside Elasticsearch.
 * After completion, marks the document status as 'indexed' = true in PostgreSQL.
 */
export async function indexDocumentChunks(
  userId: string,
  documentId: string,
  title: string,
  chunks: ChunkInput[],
  subject?: string
): Promise<boolean> {
  const indexName = 'eduagent_chunks';
  
  try {
    // 1. Validate Elasticsearch index
    await ensureIndexExists(indexName);

    if (chunks.length === 0) return true;

    // 2. Build bulk indexing payload
    const body = [];
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkId = `${documentId}_c${i}`;
      
      // Generate dense 768 vector from Gemini Embeddings API
      const embedding = await getEmbedding(chunk.text);
      
      // Elasticsearch bulk format: Action
      body.push({
        index: { _index: indexName, _id: chunkId }
      });
      
      // Elasticsearch bulk format: Document
      body.push({
        id: chunkId,
        document_id: documentId,
        user_id: userId,
        text: chunk.text,
        embedding,
        page: chunk.page,
        subject: subject || null
      });
    }

    // 3. Dispatch bulk upload to Elasticsearch
    const response = await elasticClient.bulk({ refresh: true, operations: body });
    
    if (response.errors) {
      console.error('Elasticsearch bulk indexing had errors:', JSON.stringify(response.items, null, 2));
      throw new Error('Bulk indexing failed for some chunks');
    }

    // 4. Update Supabase indexed status
    await markDocumentAsIndexed(documentId);
    console.log(`Document '${title}' successfully indexed with ${chunks.length} chunks.`);
    return true;
  } catch (error) {
    console.error(`Failed to index document '${title}':`, error);
    return false;
  }
}
export async function deleteDocumentFromIndex(documentId: string): Promise<boolean> {
  try {
    await elasticClient.deleteByQuery({
      index: 'eduagent_chunks',
      query: {
        term: { document_id: documentId }
      }
    });
    return true;
  } catch (error) {
    console.error(`Failed to delete document ${documentId} from Elastic search:`, error);
    return false;
  }
}
