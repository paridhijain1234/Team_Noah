import fs from "fs";
import path from "path";

interface PDFEmbedding {
  id: string;
  filename: string;
  text: string;
  embeddings: {
    content: string;
    embedding: number[];
    metadata: any;
  }[];
  stats: {
    totalPages: number;
    totalWords: number;
    totalCharacters: number;
    sectionCount: number;
  };
  timestamp: number;
}

class EmbeddingStore {
  private store: Map<string, PDFEmbedding> = new Map();
  private static instance: EmbeddingStore;
  private storagePath: string;

  private constructor() {
    // Create storage directory if it doesn't exist
    this.storagePath = path.join(process.cwd(), ".embeddings");
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
    this.loadFromStorage();
  }

  static getInstance(): EmbeddingStore {
    if (!EmbeddingStore.instance) {
      EmbeddingStore.instance = new EmbeddingStore();
    }
    return EmbeddingStore.instance;
  }

  private loadFromStorage() {
    try {
      const files = fs.readdirSync(this.storagePath);
      for (const file of files) {
        if (file.endsWith(".json")) {
          const filePath = path.join(this.storagePath, file);
          const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
          this.store.set(data.id, data);
        }
      }
      console.log("Loaded embeddings from storage:", this.store.size);
    } catch (error) {
      console.error("Error loading from storage:", error);
    }
  }

  private saveToStorage(id: string, data: PDFEmbedding) {
    try {
      const filePath = path.join(this.storagePath, `${id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error saving to storage:", error);
    }
  }

  save(id: string, data: PDFEmbedding) {
    const dataWithTimestamp = {
      ...data,
      timestamp: Date.now(),
    };
    this.store.set(id, dataWithTimestamp);
    this.saveToStorage(id, dataWithTimestamp);
  }

  get(id: string): PDFEmbedding | undefined {
    return this.store.get(id);
  }

  getAll(): PDFEmbedding[] {
    return Array.from(this.store.values());
  }

  delete(id: string) {
    this.store.delete(id);
    try {
      const filePath = path.join(this.storagePath, `${id}.json`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error("Error deleting from storage:", error);
    }
  }

  clear() {
    this.store.clear();
    try {
      const files = fs.readdirSync(this.storagePath);
      for (const file of files) {
        if (file.endsWith(".json")) {
          fs.unlinkSync(path.join(this.storagePath, file));
        }
      }
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  }
}

export const embeddingStore = EmbeddingStore.getInstance();
