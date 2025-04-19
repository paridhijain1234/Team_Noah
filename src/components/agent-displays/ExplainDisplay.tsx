import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { AlertCircle, Lightbulb, ListChecks, BookText } from "lucide-react";

interface ExplainAgentOutput {
  title: string;
  summary: string;
  mainConcepts: { concept: string; explanation: string }[];
  keyPoints: string[];
  conclusion: string;
  error?: boolean;
  message?: string;
  rawResponse?: string;
}

interface ExplainDisplayProps {
  data: ExplainAgentOutput;
}

export const ExplainDisplay: React.FC<ExplainDisplayProps> = ({ data }) => {
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

  return (
    <Card className="overflow-hidden border border-blue-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-900/20 pb-4">
        <CardTitle className="text-xl">{data.title}</CardTitle>
        <CardDescription className="text-base mt-2 text-gray-700 dark:text-gray-300">
          {data.summary}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Main Concepts */}
        <div className="bg-white dark:bg-gray-800/20 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-medium">Main Concepts</h3>
          </div>
          <div className="space-y-5 ml-1">
            {data.mainConcepts.map((item, index) => (
              <div
                key={index}
                className="relative pl-6 border-l-2 border-blue-300 dark:border-blue-600 py-1"
              >
                <div className="absolute left-[-4px] top-0 w-[6px] h-[6px] rounded-full bg-blue-500 dark:bg-blue-400" />
                <h4 className="font-medium text-blue-700 dark:text-blue-400 text-lg">
                  {item.concept}
                </h4>
                <p className="mt-1 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Points */}
        <div className="bg-white dark:bg-gray-800/20 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ListChecks className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-medium">Key Points</h3>
          </div>
          <ul className="space-y-2 ml-1">
            {data.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs mr-3 flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Conclusion */}
        {data.conclusion && (
          <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-800/20 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <BookText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-medium">Conclusion</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 ml-7">{data.conclusion}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
