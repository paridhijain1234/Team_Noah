"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { agentRegistry } from "@/lib/agents/agentRegistry";
import { useEffect, useCallback, useState } from "react";

// Import our new display components
import { ExplainDisplay } from "@/components/agent-displays/ExplainDisplay";
import { SummarizeDisplay } from "@/components/agent-displays/SummarizeDisplay";
import { QADisplay } from "@/components/agent-displays/QADisplay";
import { TranslateDisplay } from "@/components/agent-displays/TranslateDisplay";

const AgentsPage = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [results, setResults] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<string>("summarize");
  const [apiKey, setApiKey] = useState<string | null>(null);

  // Get available agent names from registry
  const agentNames = Object.keys(agentRegistry);
  const totalSteps = agentNames.length;
  // For tracking progress
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    // Fetch API key from server endpoint
    const fetchApiKey = async () => {
      try {
        const response = await fetch("/api/get-api-key");
        if (!response.ok) {
          throw new Error("Failed to fetch API key");
        }
        const data = await response.json();
        setApiKey(data.apiKey);
      } catch (error) {
        console.error("Error fetching API key:", error);
      }
    };

    fetchApiKey();
  }, []);

  const processInput = useCallback(async () => {
    if (!userInput.trim() || !apiKey) return;

    setIsProcessing(true);
    setResults({});

    try {
      // Call the server-side API to process all agents at once
      const response = await fetch("/api/run-agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: userInput,
          apiKey,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process with agents");
      }

      const data = await response.json();
      setResults(data.results);

      // Automatically select the first available tab if "summarize" isn't available
      const resultKeys = Object.keys(data.results);
      if (resultKeys.length > 0 && !resultKeys.includes("summarize")) {
        setActiveTab(resultKeys[0]);
      } else if (resultKeys.includes("summarize")) {
        setActiveTab("summarize");
      }
    } catch (error) {
      console.error("Error processing agents:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [userInput, apiKey]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-4xl p-6 bg-background rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-primary">AI Agents</h1>

        <p className="text-muted-foreground mb-6">
          Enter your text below to process it with different AI agents. Each
          agent provides a different perspective on your content.
        </p>

        {!apiKey && (
          <div className="mb-4 p-4 border border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Loading API key... If this message persists, there may be an issue
              with the API configuration.
            </p>
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <Textarea
              id="user-input"
              placeholder="Enter text to process with agents..."
              className="min-h-32"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={processInput}
              disabled={isProcessing || !userInput.trim() || !apiKey}
            >
              {isProcessing ? "Processing..." : "Process with Agents"}
            </Button>
          </div>

          {/* Processing overlay */}
          {isProcessing && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <Card className="p-6 max-w-md w-full">
                <h3 className="text-xl font-medium mb-4">
                  Processing with Agents
                </h3>
                <div className="space-y-4">
                  {agentNames.map((name) => (
                    <div key={name} className="flex items-center space-x-3">
                      <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
                      <span className="capitalize text-blue-500">
                        {name} Agent
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Processing your text... This may take a moment.
                </p>
              </Card>
            </div>
          )}

          {/* Results in tabs */}
          {Object.keys(results).length > 0 && (
            <div className="mt-8 border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Agent Results</h3>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="w-full">
                  {Object.keys(results).map((agentName) => (
                    <TabsTrigger
                      key={agentName}
                      value={agentName}
                      className="flex-1 capitalize"
                    >
                      {agentName}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.entries(results).map(([agentName, result]) => (
                  <TabsContent
                    key={agentName}
                    value={agentName}
                    className="p-4 mt-2 border rounded-md bg-muted/50"
                  >
                    {agentName === "explain" ? (
                      <ExplainDisplay data={result} />
                    ) : agentName === "summarize" ? (
                      <SummarizeDisplay data={result} />
                    ) : agentName === "qa" ? (
                      <QADisplay data={result} />
                    ) : agentName === "translate" ? (
                      <TranslateDisplay data={result} />
                    ) : (
                      // Fallback for any other agent types that may be added in the future
                      <div className="prose max-w-none dark:prose-invert">
                        <h4 className="text-md font-medium mb-2 capitalize">
                          {agentName} Agent Results
                        </h4>
                        <div className="whitespace-pre-wrap">
                          {typeof result === "string"
                            ? result
                            : JSON.stringify(result, null, 2)}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentsPage;
