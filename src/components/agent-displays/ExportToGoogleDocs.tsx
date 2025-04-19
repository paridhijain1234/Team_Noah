import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ExportToGoogleDocsProps {
  results: Record<string, unknown>;
  title?: string;
}

export function ExportToGoogleDocs({ results, title = "AI Learning Notes" }: ExportToGoogleDocsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (Object.keys(results).length === 0) {
      toast.error("No content to export");
      return;
    }

    setIsExporting(true);
    try {
      const response = await fetch("/api/export-to-gdocs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          results,
          title,
        }),
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Open the Google Docs URL in a new tab
      if (data.url) {
        window.open(data.url, "_blank");
        toast.success("Successfully exported to Google Docs!");
      } else {
        toast.success("Export successful! Check your Google Drive.");
      }
    } catch (error) {
      console.error("Error exporting to Google Docs:", error);
      toast.error(error instanceof Error ? error.message : "Failed to export to Google Docs");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting || Object.keys(results).length === 0}
      variant="outline"
      className="flex items-center gap-1.5"
      size="sm"
    >
      {isExporting ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <FileDown size={14} />
          Export to Google Docs
        </>
      )}
    </Button>
  );
} 