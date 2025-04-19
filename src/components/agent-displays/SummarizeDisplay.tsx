import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // We'll need to create this component if it doesn't exist

interface SummarizeAgentOutput {
  title: string;
  summary: string;
  keyPoints: string[];
  difficulty: string;
  error?: boolean;
  message?: string;
  rawResponse?: string;
}

interface SummarizeDisplayProps {
  data: SummarizeAgentOutput;
}

export const SummarizeDisplay: React.FC<SummarizeDisplayProps> = ({ data }) => {
  // Handle error state
  if (data.error) {
    return (
      <Card className="border-red-300 bg-red-50 dark:bg-red-900/20">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">
            Error
          </CardTitle>
          <CardDescription>{data.message}</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap text-xs">{data.rawResponse}</pre>
        </CardContent>
      </Card>
    );
  }

  // Helper function to get the color for difficulty level
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-green-50 dark:bg-green-900/20 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{data.title}</CardTitle>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(
              data.difficulty
            )}`}
          >
            {data.difficulty}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Summary */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {data.summary}
          </p>
        </div>

        {/* Key Points */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Key Points</h3>
          <ul className="list-disc list-inside space-y-2">
            {data.keyPoints.map((point, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
