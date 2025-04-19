import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizAgentOutput {
  title: string;
  questions: QuizQuestion[];
  error?: boolean;
  message?: string;
  rawResponse?: string;
}

interface QuizDisplayProps {
  data: QuizAgentOutput;
}

export const QuizDisplay: React.FC<QuizDisplayProps> = ({ data }) => {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, string>
  >({});
  const [showExplanations, setShowExplanations] = useState<
    Record<number, boolean>
  >({});

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

  const selectOption = (questionIndex: number, option: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  const toggleExplanation = (questionIndex: number) => {
    setShowExplanations((prev) => ({
      ...prev,
      [questionIndex]: !prev[questionIndex],
    }));
  };

  const isCorrect = (questionIndex: number) => {
    return (
      selectedOptions[questionIndex] ===
      data.questions[questionIndex].correctAnswer
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-yellow-50 dark:bg-yellow-900/20">
        <CardTitle>{data.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-8">
          {data.questions.map((question, qIndex) => (
            <div key={qIndex} className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-3">{question.question}</h3>
              <div className="space-y-2 mb-4">
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center">
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left p-3 ${
                        selectedOptions[qIndex] === option
                          ? isCorrect(qIndex)
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                            : "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : ""
                      } ${
                        selectedOptions[qIndex] &&
                        option === question.correctAnswer
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : ""
                      }`}
                      onClick={() => selectOption(qIndex, option)}
                      disabled={!!selectedOptions[qIndex]}
                    >
                      {option}
                    </Button>
                  </div>
                ))}
              </div>
              {selectedOptions[qIndex] && (
                <>
                  <div className="mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExplanation(qIndex)}
                    >
                      {showExplanations[qIndex] ? "Hide" : "Show"} Explanation
                    </Button>
                  </div>
                  {showExplanations[qIndex] && (
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
                      <p>{question.explanation}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
