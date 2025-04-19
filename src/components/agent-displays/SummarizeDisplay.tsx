import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { FileText, List } from "lucide-react";

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

  // Helper function to get the color for difficulty level
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800/30";
      case "intermediate":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 border-amber-200 dark:border-amber-800/30";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800/30";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <Card className="overflow-hidden border border-green-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-900/20 pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{data.title}</CardTitle>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
              data.difficulty
            )}`}
          >
            {data.difficulty}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Summary */}
        <div className="bg-white dark:bg-gray-800/20 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-start gap-3 mb-3">
            <FileText className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
            <h3 className="text-lg font-medium">Summary</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed ml-8">
            {data.summary}
          </p>
        </div>

        {/* Key Points */}
        <div className="bg-white dark:bg-gray-800/20 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-start gap-3 mb-3">
            <List className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
            <h3 className="text-lg font-medium">Key Points</h3>
          </div>
          <ul className="list-none space-y-2 ml-8">
            {data.keyPoints.map((point, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300 flex items-start">
                <span className="inline-block w-5 h-5 mr-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
