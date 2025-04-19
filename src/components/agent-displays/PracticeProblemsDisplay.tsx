import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Eye, EyeOff, Lightbulb, BookOpen } from "lucide-react";

interface Problem {
  problem: string;
  solution: string;
}

interface PracticeProblemsAgentOutput {
  title: string;
  problems: Problem[];
  error?: boolean;
  message?: string;
  rawResponse?: string;
}

interface PracticeProblemsDisplayProps {
  data: PracticeProblemsAgentOutput;
}

export const PracticeProblemsDisplay: React.FC<
  PracticeProblemsDisplayProps
> = ({ data }) => {
  const [visibleSolutions, setVisibleSolutions] = useState<
    Record<number, boolean>
  >({});

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

  const toggleSolution = (index: number) => {
    setVisibleSolutions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Card className="overflow-hidden border border-green-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-900/20 pb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
          <CardTitle className="text-xl">{data.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {data.problems.map((problem, index) => (
            <div 
              key={index} 
              className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md"
            >
              <div className="p-5 bg-white dark:bg-gray-800/20">
                <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span>Problem</span>
                </h3>
                <div className="whitespace-pre-line ml-8 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {problem.problem}
                </div>
              </div>

              <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/10">
                <Button
                  onClick={() => toggleSolution(index)}
                  variant="outline"
                  size="sm"
                  className={`transition-all ${
                    visibleSolutions[index] 
                      ? "border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800/30 dark:text-red-400 dark:hover:bg-red-900/10" 
                      : "border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800/30 dark:text-green-400 dark:hover:bg-green-900/10"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {visibleSolutions[index] ? (
                      <>
                        <EyeOff size={14} /> Hide Solution
                      </>
                    ) : (
                      <>
                        <Eye size={14} /> Show Solution
                      </>
                    )}
                  </span>
                </Button>

                {visibleSolutions[index] && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-800/20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <h4 className="font-medium mb-2 flex items-center gap-2 text-green-700 dark:text-green-400">
                      <Lightbulb size={16} />
                      Solution
                    </h4>
                    <div className="whitespace-pre-line ml-6 text-gray-700 dark:text-gray-300">
                      {problem.solution}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
