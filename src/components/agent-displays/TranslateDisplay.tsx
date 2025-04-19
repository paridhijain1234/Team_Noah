import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TranslateAgentOutput {
  detectedLanguage: string;
  targetLanguage: string;
  originalText: string;
  translatedText: string;
  notes?: string;
  error?: boolean;
  message?: string;
  rawResponse?: string;
}

interface TranslateDisplayProps {
  data: TranslateAgentOutput;
}

export const TranslateDisplay: React.FC<TranslateDisplayProps> = ({ data }) => {
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
      <CardHeader className="bg-indigo-50 dark:bg-indigo-900/20 pb-2">
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="flex gap-2 items-center">
            <Badge
              variant="outline"
              className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
            >
              {data.detectedLanguage}
            </Badge>
            <span className="text-gray-500">→</span>
            <Badge
              variant="outline"
              className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
            >
              {data.targetLanguage}
            </Badge>
          </div>
        </div>
        <CardDescription className="mt-2 text-gray-600 dark:text-gray-400">
          Original text:{" "}
          <span className="italic">"{data.originalText}..."</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Translation</h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md">
              <p className="text-gray-800 dark:text-gray-200">
                {data.translatedText}
              </p>
            </div>
          </div>

          {data.notes && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <div className="p-4 border-l-4 border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20">
                <p className="italic text-gray-700 dark:text-gray-300">
                  {data.notes}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
