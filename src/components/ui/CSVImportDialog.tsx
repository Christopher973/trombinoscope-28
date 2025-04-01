import React, { useState, useRef } from "react";
import { useTeam } from "@/context/TeamContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CSVImportDialogProps {
  children: React.ReactNode;
}

const CSVImportDialog = ({ children }: CSVImportDialogProps) => {
  const { importTeamMembersFromCSV } = useTeam();
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [importStatus, setImportStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (
        selectedFile.type !== "text/csv" &&
        !selectedFile.name.endsWith(".csv")
      ) {
        toast({
          title: "Invalid file format",
          description: "Please select a CSV file",
          variant: "destructive",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setFile(selectedFile);
      setImportStatus("idle");
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const text = await file.text();
      const result = await importTeamMembersFromCSV(text);
      setImportStatus("success");
      toast({
        title: "Import successful",
        description: `${result.imported} members were successfully imported.`,
      });

      // Close dialog after successful import
      setTimeout(() => {
        setOpen(false);
        setFile(null);
        setImportStatus("idle");
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 1500);
    } catch (error) {
      setImportStatus("error");
      toast({
        title: "Import failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetFileInput = () => {
    setFile(null);
    setImportStatus("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Team Members from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file containing team member data. The file should have
            columns for firstname, lastname, jobDescription, etc.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          {importStatus === "success" ? (
            <div className="flex flex-col items-center justify-center space-y-2 p-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="text-lg font-medium">Import successful!</p>
            </div>
          ) : (
            <>
              <div className="flex w-full items-center justify-center">
                <label
                  htmlFor="csvFile"
                  className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center transition hover:bg-gray-100"
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="mt-2 block text-sm font-medium text-gray-700">
                    {file ? file.name : "Select a CSV file"}
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    CSV files only, max 10MB
                  </span>
                  <Input
                    id="csvFile"
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {importStatus === "error" && (
                <div className="flex items-center rounded-md bg-red-50 p-3 text-red-800">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span className="text-sm">
                    There was an error processing your file. Please check the
                    format and try again.
                  </span>
                </div>
              )}

              <div className="text-xs text-gray-500">
                <p className="font-medium mb-1">CSV Format Requirements:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Required columns: firstname, lastname, professionnalEmail,
                    jobDescription, startDate, birthday
                  </li>
                  <li>Dates should be in YYYY-MM-DD format</li>
                  <li>
                    Optional columns: gender, managementCategory,
                    serviceAssignmentCode, departmentId, locationId, managerId
                  </li>
                  <li className="font-medium text-primary-800">
                    Both comma (,) and semicolon (;) are supported as separators
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
        <DialogFooter className="flex flex-row items-center justify-between sm:justify-between">
          {importStatus !== "success" && (
            <>
              <Button
                variant="outline"
                onClick={resetFileInput}
                disabled={!file || isLoading}
              >
                Reset
              </Button>
              <Button
                onClick={handleImport}
                disabled={!file || isLoading}
                className="ml-auto"
              >
                {isLoading ? "Importing..." : "Import Members"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CSVImportDialog;
