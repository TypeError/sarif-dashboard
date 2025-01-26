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
import { CloudUpload, Info, Github } from "lucide-react";
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

                <a
                  href="https://github.com/TypeError/sarif-dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Repo</span>
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
