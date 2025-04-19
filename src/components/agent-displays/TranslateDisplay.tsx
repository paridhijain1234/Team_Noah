import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Languages, MessageSquareQuote } from "lucide-react";

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
    <Card className="overflow-hidden border border-indigo-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/10 dark:to-indigo-900/20 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Languages className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <CardTitle className="text-xl">Translation</CardTitle>
        </div>
        <div className="flex flex-wrap gap-2 items-center mt-1">
          <Badge
            variant="outline"
            className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/30"
          >
            {data.detectedLanguage}
          </Badge>
          <span className="text-indigo-500 dark:text-indigo-400">→</span>
          <Badge
            variant="outline"
            className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800/30"
          >
            {data.targetLanguage}
          </Badge>
        </div>
        <CardDescription className="mt-3 text-gray-600 dark:text-gray-400 line-clamp-2">
          <span className="text-indigo-600 dark:text-indigo-400 font-medium">Original: </span>
          <span className="italic">{data.originalText}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-800/20 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
              <span className="text-green-600 dark:text-green-400 font-semibold">{data.targetLanguage}</span> Translation
            </h3>
            <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800/30 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                {data.translatedText}
              </p>
            </div>
          </div>

          {data.notes && (
            <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-5 rounded-xl border border-indigo-100 dark:border-indigo-800/20 shadow-sm">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <MessageSquareQuote className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                Translation Notes
              </h3>
              <p className="text-gray-700 dark:text-gray-300 ml-6 leading-relaxed">
                {data.notes}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
