import { Client } from '@elastic/elasticsearch';

const elasticUrl = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';
const elasticApiKey = process.env.ELASTICSEARCH_API_KEY || '';

if (!process.env.ELASTICSEARCH_URL) {
  console.warn('Warning: ELASTICSEARCH_URL is missing. Defaulting to http://localhost:9200');
}

// Instantiate Elasticsearch Client
export const elasticClient = new Client({
  node: elasticUrl,
  auth: elasticApiKey ? { apiKey: elasticApiKey } : undefined,
  // Disable SSL verification for local self-signed docker certs
  tls: {
    rejectUnauthorized: false
  }
});

// Helper to ensure the index exists with proper dynamic mappings
export async function ensureIndexExists(indexName: string = 'eduagent_chunks') {
  try {
    const exists = await elasticClient.indices.exists({ index: indexName });
    if (!exists) {
      await elasticClient.indices.create({
        index: indexName,
        settings: {
          index: {
            number_of_shards: 1,
            number_of_replicas: 0
          }
        },
        mappings: {
          properties: {
            id: { type: 'keyword' },
            document_id: { type: 'keyword' },
            user_id: { type: 'keyword' },
            text: { type: 'text' },
            embedding: {
              type: 'dense_vector',
              dims: 768, // Gemini Embeddings size
              index: true,
              similarity: 'cosine'
            },
            page: { type: 'integer' },
            subject: { type: 'keyword' }
          }
        }
      });
      console.log(`Elasticsearch index '${indexName}' successfully created.`);
    }
  } catch (error) {
    console.error(`Error checking/creating Elasticsearch index '${indexName}':`, error);
  }
}
