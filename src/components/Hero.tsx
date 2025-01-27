"use client";

import React, { useCallback, useState, DragEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

// Shadcn UI & Hooks
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CloudUpload, Info } from "lucide-react";

import { motion } from "motion/react";
import Footer from "./Footer";
import HistoryList from "./HistoryList";
import { Badge } from "./ui/badge";

function isValidJSON(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

export default function Hero() {
  const router = useRouter();
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const storeSarifInSessionStorage = useCallback(
    (name: string, content: string) => {
      const existingString = sessionStorage.getItem("sarifHistory");
      const existing = existingString ? JSON.parse(existingString) : [];

      const id = Date.now().toString();
      const newEntry = {
        id,
        name,
        content,
        timestamp: Date.now(),
      };

      existing.push(newEntry);
      sessionStorage.setItem("sarifHistory", JSON.stringify(existing));
      return id;
    },
    []
  );

  const handleFileUpload = useCallback(
    async (file?: File) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const content = e.target.result.toString();
          if (!isValidJSON(content)) {
            toast({
              title: "Invalid JSON",
              description: "The uploaded file does not contain valid JSON.",
              variant: "destructive",
            });
            return;
          }
          const entryId = storeSarifInSessionStorage(file.name, content);
          setFileUploaded(true);
          toast({
            title: "File Uploaded",
            description: `Successfully loaded "${file.name}"`,
          });
          router.push(`/dashboard?id=${entryId}`);
        }
      };
      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Could not read the file. Please try again.",
          variant: "destructive",
        });
      };
      reader.readAsText(file);
    },
    [router, storeSarifInSessionStorage]
  );

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = useCallback(
    (e: DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer?.files?.[0];
      handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const handleFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      handleFileUpload(file);
    },
    [handleFileUpload]
  );

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gray-900 text-white">
      {/* Subtle background gradient, slightly darker */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-gray-900 to-blue-900 opacity-60 z-[-1]" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="max-w-3xl w-full mx-4"
      >
        <Card className="bg-white/5 backdrop-blur-sm rounded-xl shadow-lg pt-8 space-y-6 border border-white/10">
          <CardHeader className="p-0 text-center">
            <CardTitle>
              <h1
                className="text-5xl font-extrabold bg-clip-text text-transparent 
                             animate-text 
                             bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500"
              >
                SARIF Dashboard
              </h1>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8 px-6 pb-8">
            <div className="text-center space-y-4">
              <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto pb-2">
                Gain actionable insights into potential issues in your code by
                uploading or pasting your SARIF data below.
              </p>
              {/* Feature bullets */}
              <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-gray-800/80 rounded-lg shadow-md w-full sm:w-80"
                >
                  <h3 className="text-xl font-semibold text-blue-400 mb-2">
                    High-Level Overview
                  </h3>
                  <p className="text-sm text-gray-400">
                    Quickly scan and summarize your SARIF data for a broad
                    understanding of code health.
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-gray-800/80 rounded-lg shadow-md w-full sm:w-80"
                >
                  <h3 className="text-xl font-semibold text-blue-400 mb-2">
                    In-Depth Analysis
                  </h3>
                  <p className="text-sm text-gray-400">
                    Dive deep into specific findings to uncover vulnerabilities
                    and actionable details.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-gray-200">
                <CloudUpload className="w-5 h-5 text-green-300" />
                <h2 className="font-semibold text-lg">Upload a SARIF File</h2>
              </div>

              <label
                htmlFor="sarifFile"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-md cursor-pointer ${
                  isDragging
                    ? "border-green-400 bg-gray-700/50"
                    : "border-gray-600 hover:border-gray-400"
                } transition-colors`}
              >
                <CloudUpload className="w-8 h-8 mb-2 text-gray-300" />
                <p className="text-sm text-gray-400">
                  {isDragging
                    ? "Drop the file to upload"
                    : "Drag & drop a SARIF file here or click to select"}
                </p>
              </label>
              <Input
                id="sarifFile"
                type="file"
                accept=".json,.sarif"
                onChange={handleFileInputChange}
                className="hidden"
              />
              {fileUploaded && (
                <p className="text-sm text-green-400 mt-2">
                  File successfully uploaded! Redirecting to the dashboard...
                </p>
              )}
            </div>

            {/* History List */}
            <HistoryList />

            {/* Footer row: Privacy + GitHub */}
            <div className="text-sm text-gray-400 text-center mt-10 flex flex-col gap-4 items-center">
              <div className="flex gap-4">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <span className="cursor-pointer inline-flex items-center gap-1">
                      <Info className="w-4 h-4" />
                      <strong>Privacy Notice</strong>
                      <Badge variant="outline" className="ml-1">
                        Local Only
                      </Badge>
                    </span>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64 p-4 bg-gray-800 text-gray-200 text-sm rounded-lg shadow-lg">
                    All SARIF data is processed locally in your browser. No data
                    is sent to any server.
                  </HoverCardContent>
                </HoverCard>

                {/* GitHub Link */}
                <a
                  href="https://github.com/cak/sarif-dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gray-300 hover:underline"
                  aria-label="View source on GitHub"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 98 96"
                    className="w-4 h-4 text-gray-300"
                    role="img"
                    aria-label="GitHub logo"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-blue-400">
                Need example SARIF files? Check out{" "}
                <a
                  href="https://github.com/microsoft/sarif-sdk/blob/main/src/Samples/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-300"
                >
                  SARIF Samples on GitHub
                </a>
                .
              </p>
            </div>

            <Footer />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
