import { elasticClient } from './elastic-client';
import { getEmbedding } from '../ai/embeddings';

interface SearchHit {
  id: string;
  document_id: string;
  user_id: string;
  text: string;
  page: number;
  subject?: string;
  score: number;
}

/**
 * Executes a Hybrid Search combining BM25 keyword search and kNN cosine similarity vector search.
 * Merges results using Reciprocal Rank Fusion (RRF) and filters out results below the 0.65 threshold.
 */
export async function hybridSearch(
  userId: string,
  query: string,
  documentId?: string,
  limit: number = 5
): Promise<SearchHit[]> {
  const indexName = 'eduagent_chunks';
  
  try {
    // 1. Generate dense query vector
    const queryVector = await getEmbedding(query);
    
    // 2. Build filters
    const filterClauses: any[] = [{ term: { user_id: userId } }];
    if (documentId) {
      filterClauses.push({ term: { document_id: documentId } });
    }

    // 3. Execute BM25 Keyword Search
    const keywordSearchPromise = elasticClient.search({
      index: indexName,
      size: limit * 2,
      query: {
        bool: {
          must: {
            match: { text: query }
          },
          filter: filterClauses
        }
      }
    });

    // 4. Execute kNN Cosine Vector Search
    const vectorSearchPromise = elasticClient.search({
      index: indexName,
      size: limit * 2,
      query: {
        bool: {
          filter: filterClauses
        }
      },
      knn: {
        field: 'embedding',
        query_vector: queryVector,
        k: limit * 2,
        num_candidates: 50
      }
    });

    const [keywordRes, vectorRes] = await Promise.all([
      keywordSearchPromise.catch(() => ({ hits: { hits: [] } })),
      vectorSearchPromise.catch(() => ({ hits: { hits: [] } }))
    ]);

    const keywordHits = keywordRes.hits?.hits || [];
    const vectorHits = vectorRes.hits?.hits || [];

    // 5. Merge results using Reciprocal Rank Fusion (RRF)
    // Formula: RRFScore = sum( 1 / (60 + rank) )
    const rrfMap = new Map<string, { doc: any; keywordRank: number; vectorRank: number }>();

    keywordHits.forEach((hit: any, idx: number) => {
      rrfMap.set(hit._id, { doc: hit._source, keywordRank: idx + 1, vectorRank: Infinity });
    });

    vectorHits.forEach((hit: any, idx: number) => {
      const existing = rrfMap.get(hit._id);
      if (existing) {
        existing.vectorRank = idx + 1;
      } else {
        rrfMap.set(hit._id, { doc: hit._source, keywordRank: Infinity, vectorRank: idx + 1 });
      }
    });

    const k = 60; // Standard RRF parameter
    const mergedResults: SearchHit[] = [];

    rrfMap.forEach((ranks, id) => {
      const keywordScore = ranks.keywordRank === Infinity ? 0 : 1 / (k + ranks.keywordRank);
      const vectorScore = ranks.vectorRank === Infinity ? 0 : 1 / (k + ranks.vectorRank);
      const rrfScore = keywordScore + vectorScore;
      
      // Rescale RRF score to approximately a 0-1 scale for standard thresholding (0.65 threshold)
      // Since max possible RRF is (1/61 + 1/61) = ~0.0327, we multiply to bring it to a 0-1 range.
      const normalizedScore = Math.min(rrfScore * 30, 1.0);

      mergedResults.push({
        id,
        document_id: ranks.doc.document_id,
        user_id: ranks.doc.user_id,
        text: ranks.doc.text,
        page: ranks.doc.page,
        subject: ranks.doc.subject,
        score: normalizedScore
      });
    });

    // 6. Sort and apply minimum score threshold of 0.65
    const finalResults = mergedResults
      .sort((a, b) => b.score - a.score)
      .filter(item => item.score >= 0.65)
      .slice(0, limit);

    // If no results pass the 0.65 threshold, fallback to return top 2 best results to prevent empty AI context
    if (finalResults.length === 0 && mergedResults.length > 0) {
      return mergedResults.slice(0, 2);
    }

    return finalResults;
  } catch (error) {
    console.error('Error conducting hybrid search:', error);
    return [];
  }
}
