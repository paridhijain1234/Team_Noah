"use client";

import React, { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { SendIcon, UploadIcon } from "lucide-react";

interface PDFData {
  id: string;
  text: string;
  paragraphs: any[];
  pages: any[];
  tokens: any[];
  headers: any[];
  stats: {
    totalPages: number;
    totalWords: number;
    totalCharacters: number;
    sectionCount: number;
  };
}

export default function Chat() {
  const [pdfData, setPdfData] = useState<PDFData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      body: {
        pdfId: pdfData?.id,
      },
    });

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process PDF");
      }

      const data = await response.json();
      setPdfData(data);
    } catch (error) {
      console.error("Error processing PDF:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container pt-30 mx-auto max-w-4xl p-4">
      <Card className="border shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Padhai Buddy Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="pdf-upload"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("pdf-upload")?.click()}
                disabled={isProcessing}
              >
                <UploadIcon className="h-4 w-4 mr-2" />
                {isProcessing ? "Processing PDF..." : "Upload PDF"}
              </Button>
              {pdfData && (
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>Pages: {pdfData.stats.totalPages}</span>
                  <span>Words: {pdfData.stats.totalWords}</span>
                  <span>Sections: {pdfData.stats.sectionCount}</span>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4 mb-4 max-h-[60vh] min-h-[300px] overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground text-center">
                  {pdfData
                    ? "Start chatting about your PDF content!"
                    : "Upload a PDF or start a conversation by sending a message below."}
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role !== "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/file.svg" alt="AI" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder={
                pdfData
                  ? "Ask about the PDF content..."
                  : "Type your message here..."
              }
              disabled={isLoading || isProcessing}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim() || isProcessing}
            >
              <SendIcon className="h-4 w-4 mr-1" />
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
