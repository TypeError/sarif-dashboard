"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ErrorComponent } from "@/components/ErrorComponent";
import HistoryList from "@/components/HistoryList";
import { SarifLog } from "@/types/sarif";
import { Progress } from "@/components/ui/progress";

export default function ClientDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sarifData, setSarifData] = useState<SarifLog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check for ?id= in the URL to load from session storage
    const id = searchParams.get("id");
    if (id) {
      loadFromSessionStorage(id);
    } else {
      setError(
        "No SARIF data found. Please upload a file or select from history."
      );
      setLoading(false);
    }
  }, [searchParams]);

  /**
   * loadFromSessionStorage:
   * Find the matching SARIF entry by ID in sessionStorage.
   */
  function loadFromSessionStorage(entryId: string) {
    setLoading(true);
    setProgress(20);

    const storedHistory = sessionStorage.getItem("sarifHistory");
    if (!storedHistory) {
      setError("No SARIF data in sessionStorage.");
      setLoading(false);
      return;
    }

    const historyArray = JSON.parse(storedHistory) as {
      id: string;
      name: string;
      content: string;
      timestamp: number;
    }[];
    const entry = historyArray.find((h) => h.id === entryId);

    if (!entry) {
      setError("No matching SARIF entry found in sessionStorage.");
      setLoading(false);
      return;
    }

    setProgress(50);

    try {
      const parsed: SarifLog = JSON.parse(entry.content);
      setProgress(80);
      setSarifData(parsed);
      setProgress(100);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to parse SARIF content.");
      } else {
        setError("Failed to parse SARIF content.");
      }
    } finally {
      setLoading(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          <h1 className="text-xl font-bold mt-4">Processing SARIF file...</h1>
          <Progress value={progress} className="w-1/2 mt-4" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return <ErrorComponent message={error} onRetry={() => router.push("/")} />;
  }

  // Main content
  return (
    <main>
      <Navbar />

      {/* Dashboard */}
      {sarifData ? (
        <Dashboard sarif={sarifData} />
      ) : (
        <div className="p-6 text-center text-gray-200">
          <p>No SARIF selected. Please choose from history or upload anew.</p>
        </div>
      )}

      {/* Session Storage History */}
      <div className="p-6 border-t mt-8">
        <h2 className="text-lg font-semibold mb-4">Your SARIF History</h2>
        <HistoryList />
      </div>

      <Footer />
    </main>
  );
}
