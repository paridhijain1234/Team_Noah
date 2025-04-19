import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Question {
  question: string;
  answer: string;
}

interface QAAgentOutput {
  title: string;
  questions: Question[];
  error?: boolean;
  message?: string;
  rawResponse?: string;
}

interface QADisplayProps {
  data: QAAgentOutput;
}

export const QADisplay: React.FC<QADisplayProps> = ({ data }) => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

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

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
        <CardTitle>{data.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {data.questions.map((item, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <div
                className={`flex justify-between items-center p-4 cursor-pointer ${
                  openQuestion === index
                    ? "bg-purple-100 dark:bg-purple-900/40"
                    : "bg-gray-50 dark:bg-gray-800/50"
                }`}
                onClick={() => toggleQuestion(index)}
              >
                <h3 className="font-medium text-lg">{item.question}</h3>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${
                    openQuestion === index ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {openQuestion === index && (
                <div className="p-4 border-t">
                  <p className="text-gray-700 dark:text-gray-300">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
