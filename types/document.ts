export interface Document {
  id: string;
  user_id: string;
  title: string;
  storage_path: string;
  subject?: string;
  indexed: boolean;
  created_at: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  user_id: string;
  text: string;
  embedding: number[]; // 768-dimensional vector
  page: number;
  subject?: string;
}
