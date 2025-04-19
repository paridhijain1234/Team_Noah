import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const embeddingsDir = path.join(dataDir, "embeddings");

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log("Created data directory");
}

// Create embeddings directory if it doesn't exist
if (!fs.existsSync(embeddingsDir)) {
  fs.mkdirSync(embeddingsDir, { recursive: true });
  console.log("Created embeddings directory");
}

// Set permissions
try {
  fs.chmodSync(dataDir, 0o777);
  fs.chmodSync(embeddingsDir, 0o777);
  console.log("Set directory permissions");
} catch (error) {
  console.error("Error setting permissions:", error);
}

console.log("Data directory initialization complete");
