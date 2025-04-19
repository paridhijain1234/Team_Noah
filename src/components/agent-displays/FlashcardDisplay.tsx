import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Flashcard {
  front: string;
  back: string;
}

interface FlashcardAgentOutput {
  title: string;
  flashcards: Flashcard[];
  error?: boolean;
  message?: string;
  rawResponse?: string;
}

interface FlashcardDisplayProps {
  data: FlashcardAgentOutput;
}

export const FlashcardDisplay: React.FC<FlashcardDisplayProps> = ({ data }) => {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  // Handle error state
  if (data.error) {
    return (
      <Card className="border-red-300 bg-red-50 dark:bg-red-900/20">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 dark:text-red-400 mb-2">{data.message}</p>
          <pre className="whitespace-pre-wrap text-xs">{data.rawResponse}</pre>
        </CardContent>
      </Card>
    );
  }

  const flipCard = (index: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
        <CardTitle>{data.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.flashcards.map((card, index) => (
            <div
              key={index}
              className={`border rounded-lg overflow-hidden h-48 cursor-pointer transition-transform duration-300 transform-gpu ${
                flippedCards[index] ? "rotate-y-180" : ""
              }`}
              onClick={() => flipCard(index)}
            >
              <div className="relative w-full h-full">
                <div
                  className={`absolute w-full h-full flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900/30 transition-opacity duration-300 ${
                    flippedCards[index] ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <p className="text-center text-lg">{card.front}</p>
                </div>
                <div
                  className={`absolute w-full h-full flex items-center justify-center p-4 bg-green-100 dark:bg-green-900/30 transition-opacity duration-300 ${
                    flippedCards[index] ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <p className="text-center">{card.back}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-500 mt-4">Click on cards to flip</p>
      </CardContent>
    </Card>
  );
};
