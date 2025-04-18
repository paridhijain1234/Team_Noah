'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { masterAgent } from '@/lib/gemini';

export default function AgentPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setIsLoading(true);
    setResult('Processing...');
    
    try {
      // Call the master agent without specifying an agent type to activate auto-detection
      const response = await masterAgent(input);
      setResult(response);
    } catch (error) {
      console.error('Error calling agent:', error);
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to result when it updates
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Unified AI Assistant</h1>
      </header>

      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-2">Smart AI Assistant</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter any text and our AI will automatically determine the best way to process it - 
            whether it needs translation, summarization, answering questions, analysis, or creative content generation.
          </p>
        </div>

        {/* Unified input area */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="agent-input" className="block text-sm font-medium mb-1">
              Your Input
            </label>
            <Textarea
              id="agent-input"
              className="min-h-[200px]"
              placeholder="Enter any text here - ask a question, paste content to summarize, request a translation, and more..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="px-6"
            >
              {isLoading ? 'Processing...' : 'Submit'}
            </Button>
          </div>
        </form>
        
        {/* Result area */}
        {result && (
          <div className="mt-8" ref={resultRef}>
            <h3 className="text-lg font-medium mb-2">Result</h3>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
