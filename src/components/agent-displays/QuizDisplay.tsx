import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";

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

  return (
    <Card className="overflow-hidden border border-yellow-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/10 dark:to-yellow-900/20 pb-4">
        <CardTitle className="text-xl">{data.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {data.questions.map((question, qIndex) => (
            <div key={qIndex} className="border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-sm transition-all hover:shadow-md">
              <h3 className="font-medium text-lg mb-4">{question.question}</h3>
              <div className="space-y-2 mb-4">
                {question.options.map((option, oIndex) => {
                  const isSelected = selectedOptions[qIndex] === option;
                  const isOptionCorrect = option === question.correctAnswer;
                  const answered = !!selectedOptions[qIndex];
                  
                  let buttonClasses = "w-full justify-start text-left p-3 transition-all duration-200";
                  
                  if (answered) {
                    if (isSelected && isOptionCorrect) {
                      buttonClasses += " border-green-300 bg-green-50 dark:bg-green-900/10 text-green-700";
                    } else if (isSelected && !isOptionCorrect) {
                      buttonClasses += " border-red-300 bg-red-50 dark:bg-red-900/10 text-red-700";
                    } else if (isOptionCorrect) {
                      buttonClasses += " border-green-300 bg-green-50/50 dark:bg-green-900/5 text-green-700";
                    }
                  } else {
                    buttonClasses += " hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50";
                  }
                  
                  return (
                    <div key={oIndex} className="flex items-center">
                      <Button
                        variant="outline"
                        className={buttonClasses}
                        onClick={() => selectOption(qIndex, option)}
                        disabled={answered}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{option}</span>
                          {answered && isOptionCorrect && (
                            <Check className="h-5 w-5 text-green-600" />
                          )}
                          {answered && isSelected && !isOptionCorrect && (
                            <X className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                      </Button>
                    </div>
                  );
                })}
              </div>
              {selectedOptions[qIndex] && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExplanation(qIndex)}
                    className="mt-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 pl-0 flex items-center"
                  >
                    {showExplanations[qIndex] ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                    {showExplanations[qIndex] ? "Hide" : "Show"} Explanation
                  </Button>
                  {showExplanations[qIndex] && (
                    <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-100 dark:border-gray-700 animate-in fade-in">
                      <p className="text-gray-700 dark:text-gray-300">{question.explanation}</p>
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
