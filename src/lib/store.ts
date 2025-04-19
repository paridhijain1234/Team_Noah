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
    // Initialize storage path
    this.storagePath = path.join(process.cwd(), "data", "embeddings");
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
      console.log(`Loaded ${this.store.size} embeddings from storage`);
    } catch (error) {
      console.error("Error loading from storage:", error);
    }
  }

  private saveToStorage(id: string, data: PDFEmbedding) {
    try {
      const filePath = path.join(this.storagePath, `${id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`Saved embedding to ${filePath}`);
    } catch (error) {
      console.error("Error saving to storage:", error);
    }
  }

  save(id: string, data: PDFEmbedding) {
    console.log(`Saving PDF data with ID: ${id}`);
    console.log(`Number of embeddings: ${data.embeddings.length}`);

    const dataWithTimestamp = {
      ...data,
      timestamp: Date.now(),
    };

    // Save to memory
    this.store.set(id, dataWithTimestamp);
    console.log(`Store size after save: ${this.store.size}`);

    // Save to file
    this.saveToStorage(id, dataWithTimestamp);
  }

  get(id: string): PDFEmbedding | undefined {
    console.log(`Getting PDF data for ID: ${id}`);

    // Try to get from memory first
    let data = this.store.get(id);

    // If not in memory, try to load from file
    if (!data) {
      try {
        const filePath = path.join(this.storagePath, `${id}.json`);
        if (fs.existsSync(filePath)) {
          const loadedData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
          if (loadedData && loadedData.id && loadedData.embeddings) {
            data = loadedData as PDFEmbedding;
            // Update memory cache
            this.store.set(id, data);
            console.log(`Loaded PDF data from file for ID: ${id}`);
          }
        }
      } catch (error) {
        console.error(`Error loading PDF data for ID ${id}:`, error);
      }
    }

    if (data) {
      console.log(`Found PDF data with ${data.embeddings.length} embeddings`);
    } else {
      console.log("No PDF data found");
    }

    return data;
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
      console.error(`Error deleting PDF data for ID ${id}:`, error);
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
