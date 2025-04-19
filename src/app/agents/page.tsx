/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { agentRegistry } from "@/lib/agents/agentRegistry";
import { useEffect, useCallback, useState, useRef } from "react";

// Import our display components
import { ExplainDisplay } from "@/components/agent-displays/ExplainDisplay";
import { SummarizeDisplay } from "@/components/agent-displays/SummarizeDisplay";
import { TranslateDisplay } from "@/components/agent-displays/TranslateDisplay";
import { FlashcardDisplay } from "@/components/agent-displays/FlashcardDisplay";
import { QuizDisplay } from "@/components/agent-displays/QuizDisplay";
import { PracticeProblemsDisplay } from "@/components/agent-displays/PracticeProblemsDisplay";
import { ExportToGoogleDocs } from "@/components/agent-displays/ExportToGoogleDocs";

// Import icons
import { FileTextIcon, UploadCloudIcon, FileIcon, XIcon, AlertCircle, BrainIcon, BookOpenIcon, Languages, ScrollText, FileQuestion, CheckSquare } from "lucide-react";

// Define types for results to fix the any type issue
interface AgentResult {
  [key: string]: unknown;
}

const AgentsPage = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [results, setResults] = useState<AgentResult>({});
  const [activeTab, setActiveTab] = useState<string>("summarize");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<"text" | "file">("text");
  
  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // For tracking progress
  const [progress, setProgress] = useState<number>(0);
  
  // Track which agents are currently processing
  const [processingAgents, setProcessingAgents] = useState<Record<string, boolean>>({});

  // New state for selected agents
  const [selectedAgents, setSelectedAgents] = useState<Record<string, boolean>>({});

  // Agent metadata for better visualization
  const agentInfo = {
    summarize: { 
      icon: <BookOpenIcon size={16} />, 
      color: "bg-green-500/50",
      description: "Summarize content concisely" 
    },
    explain: { 
      icon: <BrainIcon size={16} />, 
      color: "bg-violet-500/50",
      description: "Explain concepts clearly" 
    },
    translate: { 
      icon: <Languages size={16} />, 
      color: "bg-indigo-500/50",
      description: "Translate to other languages" 
    },
    flashcard: { 
      icon: <ScrollText size={16} />, 
      color: "bg-blue-500/50",
      description: "Create study flashcards" 
    },
    quiz: { 
      icon: <FileQuestion size={16} />, 
      color: "bg-amber-500/50",
      description: "Generate quiz questions" 
    },
    practiceProblems: { 
      icon: <CheckSquare size={16} />, 
      color: "bg-emerald-500/50",
      description: "Create practice problems" 
    }
  };

  // Get available agent names from registry
  const agentNames = Object.keys(agentRegistry);

  useEffect(() => {
    // Add example text for better UX
    setUserInput("The quantum theory of fields was developed in the late 1920s and early 1930s by many physicists, including Dirac, Heisenberg, and Fermi.");

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
    
    // Clean up any intervals on unmount
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  // Validate file type
  const validateFile = (file: File): boolean => {
    if (!file.type.includes('pdf')) {
      setUploadError("Only PDF files are supported");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setUploadError("File size exceeds 10MB limit");
      return false;
    }
    return true;
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setUploadError(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  // Remove selected file
  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload and process file
  const uploadAndProcessFile = async () => {
    if (!file || !apiKey) return;
    
    setIsProcessing(true);
    setResults({});
    setProgress(0);
    
    // Get list of selected agents or use all if none selected
    const agentsToProcess = Object.keys(selectedAgents).filter(name => selectedAgents[name]);
    const useSelectedAgents = agentsToProcess.length > 0;
    
    // Set all agents as processing
    const initialProcessingState = agentNames.reduce((acc, name) => ({
      ...acc,
      [name]: useSelectedAgents ? selectedAgents[name] : true
    }), {});
    setProcessingAgents(initialProcessingState);
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('apiKey', apiKey);
    if (useSelectedAgents) {
      formData.append('agents', JSON.stringify(agentsToProcess));
    }
    
    try {
      // Simulate progress updates
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const increment = Math.random() * 15;
          const newProgress = Math.min(prev + increment, 95);
          return newProgress;
        });
      }, 500);
      
      // Call the server-side API to process PDF
      const response = await fetch("/api/process-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process PDF file");
      }

      const data = await response.json();
      setResults(data.results);
      setProgress(100);
      
      // Mark all agents as completed
      setProcessingAgents({});

      // Automatically select the first available tab if "summarize" isn't available
      const resultKeys = Object.keys(data.results);
      if (resultKeys.length > 0 && !resultKeys.includes("summarize")) {
        setActiveTab(resultKeys[0]);
      } else if (resultKeys.includes("summarize")) {
        setActiveTab("summarize");
      }
    } catch (error) {
      console.error("Error processing PDF:", error);
      setUploadError(error instanceof Error ? error.message : "Failed to process PDF");
    } finally {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setIsProcessing(false);
      setProcessingAgents({});
    }
  };

  // Toggle agent selection
  const toggleAgentSelection = (agentName: string) => {
    setSelectedAgents(prev => ({
      ...prev,
      [agentName]: !prev[agentName]
    }));
  };
  
  // Select all agents
  const selectAllAgents = () => {
    const allSelected = Object.keys(agentInfo).reduce((acc, name) => ({
      ...acc,
      [name]: true
    }), {});
    setSelectedAgents(allSelected);
  };
  
  // Clear all selected agents
  const clearSelectedAgents = () => {
    setSelectedAgents({});
  };

  // Process text input
  const processTextInput = useCallback(async () => {
    if (!userInput.trim() || !apiKey) return;

    setIsProcessing(true);
    setResults({});
    setProgress(0);
    
    // Get list of selected agents or use all if none selected
    const agentsToProcess = Object.keys(selectedAgents).filter(name => selectedAgents[name]);
    const useSelectedAgents = agentsToProcess.length > 0;
    
    // Set all agents as processing
    const initialProcessingState = agentNames.reduce((acc, name) => ({
      ...acc,
      [name]: useSelectedAgents ? selectedAgents[name] : true
    }), {});
    setProcessingAgents(initialProcessingState);

    try {
      // Simulate progress updates
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const increment = Math.random() * 15;
          const newProgress = Math.min(prev + increment, 95);
          return newProgress;
        });
      }, 500);
      
      // Call the server-side API to process all agents at once
      const response = await fetch("/api/run-agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: userInput,
          apiKey,
          agents: useSelectedAgents ? agentsToProcess : undefined
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process with agents");
      }

      const data = await response.json();
      setResults(data.results);
      setProgress(100);
      
      // Mark all agents as completed
      setProcessingAgents({});

      // Automatically select the first available tab
      const resultKeys = Object.keys(data.results);
      if (resultKeys.length > 0) {
        setActiveTab(resultKeys[0]);
      }
    } catch (error) {
      console.error("Error processing agents:", error);
    } finally {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setIsProcessing(false);
      setProcessingAgents({});
    }
  }, [userInput, apiKey, agentNames, selectedAgents]);

  // Helper function to render the appropriate display component based on agent type
  const renderAgentDisplay = (agentName: string, result: unknown) => {
    switch(agentName) {
      case "explain":
        return <ExplainDisplay data={result as any} />;
      case "summarize":
        return <SummarizeDisplay data={result as any} />;
      case "translate":
        return <TranslateDisplay data={result as any} />;
      case "flashcard":
        return <FlashcardDisplay data={result as any} />;
      case "quiz":
        return <QuizDisplay data={result as any} />;
      case "practiceProblems":
        return <PracticeProblemsDisplay data={result as any} />;
      default:
        return (
          <div className="prose max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap">
              {typeof result === "string"
                ? result
                : JSON.stringify(result, null, 2)}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight mb-1">AI Learning Agents</h1>
          <p className="text-muted-foreground text-sm">
            Analyze text or PDF files with specialized AI agents to enhance your learning
          </p>
        </div>

        {/* Input Card */}
        <Card className="mb-6 shadow-sm bg-transparent relative transition-all duration-300 border-0 bg-gradient-to-br from-transparent via-transparent to-transparent border-primary/30 hover:border-primary/50 focus:border-primary/70 shadow-[0_0_15px_rgba(129,140,248,0.1)] hover:shadow-[0_0_20px_rgba(167,139,250,0.25)] focus:shadow-[0_0_25px_rgba(217,70,239,0.3)]">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">Input</CardTitle>
            
            {/* Input Mode Tabs */}
            <div className="flex p-1 bg-muted rounded-lg">
              <Button 
                variant={inputMode === "text" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setInputMode("text")}
                className="text-xs flex gap-1.5 items-center h-7"
              >
                <FileTextIcon size={14} />
                Text
              </Button>
              <Button 
                variant={inputMode === "file" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setInputMode("file")}
                className="text-xs flex gap-1.5 items-center h-7"
              >
                <FileIcon size={14} />
                PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!apiKey && (
              <div className="mb-4 p-3 rounded-md bg-amber-100 border-l-4 border-amber-500 dark:bg-amber-900/30 dark:border-amber-600">
                <p className="text-sm text-amber-800 dark:text-amber-200 flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  Loading API key...
                </p>
              </div>
            )}

            <div className="space-y-4">
              {inputMode === "text" ? (
                /* Text Input Mode */
                <Textarea
                  id="user-input"
                  placeholder="Enter text to process with agents..."
                  className="min-h-32 resize-none focus-visible:ring-1 focus-visible:ring-offset-0"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                />
              ) : (
                /* File Input Mode */
                <div 
                  className={`relative border-2 border-dashed rounded-lg p-6 
                    ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'} 
                    transition-all duration-150 ease-in-out min-h-[180px] flex flex-col items-center justify-center gap-4
                    ${file ? 'bg-muted/10' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="file-upload"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {!file ? (
                    <>
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <UploadCloudIcon size={24} className="text-primary" />
                      </div>
                      <div className="text-center space-y-1">
                        <h3 className="font-medium">Drag & drop your PDF file</h3>
                        <p className="text-sm text-muted-foreground max-w-xs">
                          Supports PDF documents up to 10MB
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-1"
                      >
                        Browse files
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileIcon size={20} className="text-primary" />
                      </div>
                      <div className="text-center space-y-1 w-full">
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-medium truncate max-w-[200px]">
                            {file.name}
                          </span>
                          <Badge variant="outline" className="bg-muted/50">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 rounded-full"
                            onClick={removeFile}
                          >
                            <XIcon size={14} className="text-muted-foreground" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Ready to process
                        </p>
                      </div>
                    </>
                  )}
                  
                  {uploadError && (
                    <div className="text-sm text-destructive bg-destructive/10 p-2 rounded mt-2 flex items-center gap-1.5">
                      <AlertCircle size={14} />
                      {uploadError}
                    </div>
                  )}
                </div>
              )}
              
              {/* Agent info */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-3">
                {Object.entries(agentInfo).map(([name, info]) => (
                  <div 
                    key={name}
                    className={`p-2 rounded-lg flex flex-col items-center text-center border 
                      ${selectedAgents[name] 
                        ? 'border-primary/40 bg-primary/5 shadow-sm' 
                        : 'border-muted bg-background hover:bg-muted/10'} 
                      ${processingAgents[name] ? 'animate-pulse' : ''}
                      transition-all duration-150 cursor-pointer`}
                    onClick={() => !isProcessing && toggleAgentSelection(name)}
                  >
                    <div className={`h-8 w-8 rounded-full ${selectedAgents[name] ? 'bg-primary/20' : 'bg-primary/10'} flex items-center justify-center mb-1`}>
                      {info.icon}
                    </div>
                    <span className="text-xs font-medium capitalize">{name}</span>
                    <span className="text-[10px] text-muted-foreground leading-tight mt-0.5">{info.description}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                {/* Selected agents counter */}
                <div className="text-xs text-muted-foreground">
                  {Object.values(selectedAgents).filter(Boolean).length > 0 ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/5 text-primary font-normal">
                        {Object.values(selectedAgents).filter(Boolean).length} agent{Object.values(selectedAgents).filter(Boolean).length !== 1 ? 's' : ''} selected
                      </Badge>
                      <div className="flex gap-2">
                        {Object.values(selectedAgents).filter(Boolean).length < Object.keys(agentInfo).length && (
                          <span 
                            className="text-xs underline cursor-pointer hover:text-primary transition-colors"
                            onClick={selectAllAgents}
                          >
                            select all
                          </span>
                        )}
                        <span 
                          className="text-xs underline cursor-pointer hover:text-primary transition-colors"
                          onClick={clearSelectedAgents}
                        >
                          clear
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs">All agents will be used</span>
                      <span 
                        className="text-xs underline cursor-pointer hover:text-primary transition-colors"
                        onClick={selectAllAgents}
                      >
                        select specific
                      </span>
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={inputMode === "text" ? processTextInput : uploadAndProcessFile}
                  disabled={isProcessing || 
                            (inputMode === "text" ? !userInput.trim() : !file) || 
                            !apiKey}
                  size="sm"
                  className="relative group overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {inputMode === "text" ? "Process with Agents" : "Process PDF"}
                      </>
                    )}
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Progress indicator when processing */}
        {isProcessing && (
          <div className="mb-6 animate-in fade-in duration-300">
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-300 ease-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Processing your content</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        )}
        
        {/* Results */}
        {Object.keys(results).length > 0 && (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Results</h2>
              
              {/* Add Export to Google Docs button */}
              <ExportToGoogleDocs 
                results={results} 
                title={`AI Learning Notes - ${new Date().toLocaleDateString()}`} 
              />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4 flex gap-2 overflow-x-auto p-1 bg-muted rounded-lg">
                {Object.keys(results).map((agentName) => (
                  <TabsTrigger
                    key={agentName}
                    value={agentName}
                    className="py-1.5 px-3 rounded-md data-[state=active]:bg-background flex items-center gap-1.5 flex-shrink-0 capitalize"
                  >
                    <span>{agentInfo[agentName as keyof typeof agentInfo]?.icon || '🤖'}</span>
                    {agentName}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div>
                {Object.entries(results).map(([agentName, result]) => (
                  <TabsContent key={agentName} value={agentName} className="mt-0">
                    {renderAgentDisplay(agentName, result)}
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentsPage;
