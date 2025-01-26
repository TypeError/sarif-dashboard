"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function HistoryList() {
  const router = useRouter();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = sessionStorage.getItem("sarifHistory");
    const now = Date.now();

    if (storedHistory) {
      const parsed = JSON.parse(storedHistory).filter((entry: any) => {
        const isExpired = now - entry.timestamp > 24 * 60 * 60 * 1000;
        return !isExpired;
      });

      sessionStorage.setItem("sarifHistory", JSON.stringify(parsed));
      setHistory(parsed);
    }
  }, []);

  const handleDelete = (id: string) => {
    const updatedHistory = history.filter((entry: any) => entry.id !== id);
    sessionStorage.setItem("sarifHistory", JSON.stringify(updatedHistory));
    setHistory(updatedHistory);

    toast({
      title: "Deleted",
      description: "SARIF entry has been deleted.",
    });
  };

  return (
    <div className="space-y-4">
      {history.length === 0 ? (
        <p className="text-gray-300">No SARIF history available.</p>
      ) : (
        <ul className="space-y-2">
          {history.map((entry: any) => (
            <li
              key={entry.id}
              className="p-4 bg-gray-800 rounded-md shadow-md flex justify-between"
            >
              <div>
                <p className="font-medium">{entry.name}</p>
                <p className="text-xs text-gray-500">
                  {new Date(entry.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="space-x-2">
                <Button
                  size="sm"
                  onClick={() => router.push(`/dashboard?id=${entry.id}`)}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(entry.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
