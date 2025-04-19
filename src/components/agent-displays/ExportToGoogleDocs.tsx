import { Button } from "@/components/ui/button";
import { FileDown, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ExportToGoogleDocsProps {
  results: Record<string, unknown>;
  title?: string;
  className?: string;
}

export function ExportToGoogleDocs({ 
  results, 
  title = "AI Learning Notes",
  className = "" 
}: ExportToGoogleDocsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleExport = async () => {
    if (Object.keys(results).length === 0) {
      toast.error("No content to export", {
        description: "Please generate some content first"
      });
      return;
    }

    setIsExporting(true);
    setExportStatus("loading");
    
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || `Export failed: ${response.statusText}`);
      }
      
      setExportStatus("success");
      
      // Create a temporary anchor element to ensure the link opens in a new tab
      if (data.url) {
        const a = document.createElement('a');
        a.href = data.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer'; // Security best practice
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        toast.success("Exported to Google Docs", {
          description: "Your document has been created and opened in a new tab"
        });
      } else {
        toast.success("Export successful", {
          description: "Check your Google Drive for the document"
        });
      }
      
      // Reset to idle state after 3 seconds
      setTimeout(() => {
        setExportStatus("idle");
      }, 3000);
      
    } catch (error) {
      console.error("Error exporting to Google Docs:", error);
      setExportStatus("error");
      
      toast.error("Export failed", {
        description: error instanceof Error ? error.message : "Unable to export to Google Docs"
      });
      
      // Reset to idle state after 3 seconds
      setTimeout(() => {
        setExportStatus("idle");
      }, 3000);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle button states
  const getButtonContent = () => {
    switch (exportStatus) {
      case "loading":
        return (
          <>
            <Loader2 size={16} className="animate-spin mr-1.5" />
            Exporting...
          </>
        );
      case "success":
        return (
          <>
            <CheckCircle size={16} className="mr-1.5 text-green-500" />
            Exported
          </>
        );
      case "error":
        return (
          <>
            <AlertCircle size={16} className="mr-1.5 text-red-500" />
            Failed
          </>
        );
      default:
        return (
          <>
            <FileDown size={16} className="mr-1.5" />
            Export to Google Docs
          </>
        );
    }
  };

  // Determine button variant based on status
  const getButtonVariant = () => {
    switch (exportStatus) {
      case "success":
        return "outline";
      case "error":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting || Object.keys(results).length === 0}
      variant={getButtonVariant()}
      className={`flex items-center gap-1 transition-all duration-300 ${className}`}
      size="sm"
      title={Object.keys(results).length === 0 ? "No content to export" : "Export content to Google Docs"}
    >
      {getButtonContent()}
    </Button>
  );
}