"use client";
import React, { useState } from "react";

export default function AutoPipelineRunner() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const runAutoPipeline = async () => {
    setLoading(true);
    setOutput("");
    try {
      const resp = await fetch("/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setOutput(data.result ?? data.error ?? "Unknown error");
    } catch (err) {
      console.error("Failed to fetch or parse JSON:", err);
      setOutput(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-2">Automatic AI Pipeline</h2>
      <textarea
        className="w-full border p-2 mb-4"
        rows={5}
        placeholder="Enter your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={runAutoPipeline}
        disabled={loading || !text.trim()}
        className="bg-blue-600 text-white py-2 px-4 rounded"
      >
        {loading ? "Processing..." : "Run Automatic Pipeline"}
      </button>
      <div className="mt-4">
        <label className="block font-semibold mb-2">Output:</label>
        <textarea
          className="w-full border p-2 bg-gray-50"
          rows={6}
          value={output}
          readOnly
        />
      </div>
    </div>
  );
}
