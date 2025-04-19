import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

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

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-blue-50 dark:bg-blue-900/20 pb-2">
        <CardTitle>{data.title}</CardTitle>
        <CardDescription className="text-base font-medium">
          {data.summary}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Main Concepts */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Main Concepts</h3>
          <div className="space-y-4">
            {data.mainConcepts.map((item, index) => (
              <div
                key={index}
                className="border-l-4 border-blue-400 dark:border-blue-600 pl-4 py-1"
              >
                <h4 className="font-medium text-blue-700 dark:text-blue-400">
                  {item.concept}
                </h4>
                <p className="mt-1 text-gray-700 dark:text-gray-300">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Points */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Key Points</h3>
          <ul className="list-disc list-inside space-y-1 pl-2">
            {data.keyPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>

        {/* Conclusion */}
        {data.conclusion && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Conclusion</h3>
            <p className="italic">{data.conclusion}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
