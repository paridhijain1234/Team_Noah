import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  const toggleSolution = (index: number) => {
    setVisibleSolutions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-green-50 dark:bg-green-900/20">
        <CardTitle>{data.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {data.problems.map((problem, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="font-medium text-lg mb-2">
                  Problem {index + 1}
                </h3>
                <div className="whitespace-pre-line">{problem.problem}</div>
              </div>

              <div className="p-4 border-t">
                <Button
                  onClick={() => toggleSolution(index)}
                  variant="outline"
                  className="mb-2"
                >
                  {visibleSolutions[index] ? "Hide Solution" : "Show Solution"}
                </Button>

                {visibleSolutions[index] && (
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/10 rounded">
                    <h4 className="font-medium mb-2">Solution:</h4>
                    <div className="whitespace-pre-line">
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
