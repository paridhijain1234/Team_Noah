import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RefreshCcw } from "lucide-react";

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
      <Card className="border border-red-200 shadow-sm">
        <CardHeader className="bg-red-50 dark:bg-red-900/10 pb-3">
          <CardTitle className="text-red-600 dark:text-red-400">
            Error
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-red-600 dark:text-red-400 mb-2">{data.message}</p>
          <pre className="whitespace-pre-wrap text-xs bg-red-50 dark:bg-red-900/5 p-3 rounded-md">{data.rawResponse}</pre>
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
    <Card className="overflow-hidden border border-blue-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-900/20 pb-4">
        <CardTitle className="text-xl">{data.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {data.flashcards.map((card, index) => (
            <div
              key={index}
              className="group relative border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden h-56 cursor-pointer transition-all duration-200 hover:shadow-md"
              onClick={() => flipCard(index)}
            >
              <div 
                className="relative w-full h-full transition-transform duration-500"
                style={{ 
                  transform: flippedCards[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div
                  className="absolute w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 backface-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <p className="text-center text-lg font-medium">{card.front}</p>
                  <div className="absolute bottom-3 right-3 opacity-30 group-hover:opacity-70 transition-opacity">
                    <RefreshCcw size={16} />
                  </div>
                </div>
                <div
                  className="absolute w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 backface-hidden"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <p className="text-center text-gray-700 dark:text-gray-300">{card.back}</p>
                  <div className="absolute bottom-3 right-3 opacity-30 group-hover:opacity-70 transition-opacity">
                    <RefreshCcw size={16} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-500 mt-6 text-sm">Click on a card to flip</p>
      </CardContent>
    </Card>
  );
};
