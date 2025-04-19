import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

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
      <Card className="border border-red-200 shadow-sm">
        <CardHeader className="bg-red-50 dark:bg-red-900/10 pb-3">
          <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle size={18} />
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

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <Card className="overflow-hidden border border-purple-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/10 dark:to-purple-900/20 pb-4">
        <CardTitle className="text-xl">{data.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {data.questions.map((item, index) => {
            const isOpen = openQuestion === index;
            
            return (
              <div 
                key={index} 
                className={`border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm transition-all duration-200 ${
                  isOpen ? "shadow-md" : ""
                }`}
              >
                <div
                  className={`flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                    isOpen
                      ? "bg-purple-50 dark:bg-purple-900/30 border-b border-purple-100 dark:border-purple-800/30"
                      : ""
                  }`}
                  onClick={() => toggleQuestion(index)}
                >
                  <h3 className="font-medium text-md">{item.question}</h3>
                  <div className="flex-shrink-0 ml-2 text-purple-600 dark:text-purple-400">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {isOpen && (
                  <div className="p-5 bg-white dark:bg-gray-800/10 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
