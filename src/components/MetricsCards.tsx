"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileBarChart, FileCode2, CheckCircle2, BarChart3 } from "lucide-react";
import { useMemo } from "react";
import { SarifLog } from "@/types/sarif";

/**
 * If the rule name is dot-delimited, return only the last segment.
 * Example: "javascript.sequelize.security.audit" => "audit"
 */
function shortRuleId(ruleId: string) {
  const parts = ruleId.split(".");
  return parts[parts.length - 1] || ruleId;
}

export function MetricsCards({ sarif }: { sarif: SarifLog }) {
  // Flatten all results
  const data = useMemo(() => {
    return sarif.runs.flatMap((run) => run.results || []);
  }, [sarif]);

  // 1) Total Findings
  const totalFindings = useMemo(() => data.length, [data]);

  // 2) Unique Files
  const uniqueFiles = useMemo(() => {
    const fileSet = new Set(
      data
        .map((r) => r.locations?.[0]?.physicalLocation?.artifactLocation?.uri)
        .filter(Boolean)
    );
    return fileSet.size;
  }, [data]);

  // 3) Check if anything is fixable
  const hasFixable = useMemo(() => {
    return data.some((r) => r.properties?.fixAvailable);
  }, [data]);

  // 3A) If fixable => show # of fixable
  const fixableFindings = useMemo(() => {
    if (!hasFixable) return 0;
    return data.filter((r) => r.properties?.fixAvailable).length;
  }, [data, hasFixable]);

  const fixablePercent = totalFindings
    ? Math.round((fixableFindings / totalFindings) * 100)
    : 0;

  // 3B) Otherwise => show average per file
  const avgFindingsPerFile = useMemo(() => {
    return uniqueFiles === 0 ? 0 : (totalFindings / uniqueFiles).toFixed(1);
  }, [uniqueFiles, totalFindings]);

  // 4) Most Common Rule (truncate ID for display)
  const mostCommonRuleInfo = useMemo(() => {
    if (!data.length) return { ruleId: "N/A", count: 0 };

    const counts: Record<string, number> = {};
    data.forEach((r) => {
      const id = r.ruleId || "Unknown.Rule";
      counts[id] = (counts[id] || 0) + 1;
    });

    let topRule = "";
    let maxCount = 0;
    for (const [ruleId, cnt] of Object.entries(counts)) {
      if (cnt > maxCount) {
        topRule = ruleId;
        maxCount = cnt;
      }
    }
    return { ruleId: topRule, count: maxCount };
  }, [data]);

  return (
    // 4 columns on large screens => single row; smaller screens => 2 columns or 1 column.
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* ---------- Card 1: Total Findings ---------- */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="flex items-center justify-between p-4 pb-3">
          <CardTitle className="text-base font-bold text-foreground">
            Total Findings
          </CardTitle>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-800/20">
            <FileBarChart className="h-6 w-6 text-red-400" />
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {data.length > 0 ? (
            <div className="text-2xl font-semibold text-foreground">
              {totalFindings}
            </div>
          ) : (
            <Skeleton className="h-6 w-1/2" />
          )}
          <p className="text-sm text-muted-foreground mt-1">across all files</p>
        </CardContent>
      </Card>

      {/* ---------- Card 2: Unique Files ---------- */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="flex items-center justify-between p-4 pb-3">
          <CardTitle className="text-base font-bold text-foreground">
            Unique Files
          </CardTitle>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-800/20">
            <FileCode2 className="h-6 w-6 text-blue-400" />
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {data.length > 0 ? (
            <div className="text-2xl font-semibold text-foreground">
              {uniqueFiles}
            </div>
          ) : (
            <Skeleton className="h-6 w-1/2" />
          )}
          <p className="text-sm text-muted-foreground mt-1">
            files with findings
          </p>
        </CardContent>
      </Card>

      {/* ---------- Card 3: Fixable Findings (or) Avg per File ---------- */}
      {hasFixable ? (
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex items-center justify-between p-4 pb-3">
            <CardTitle className="text-base font-bold text-foreground">
              Fixable Findings
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-800/20">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {data.length > 0 ? (
              <>
                <div className="text-2xl font-semibold text-foreground">
                  {fixableFindings}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {fixablePercent}% fixable
                </p>
              </>
            ) : (
              <>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/3 mt-2" />
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex items-center justify-between p-4 pb-3">
            <CardTitle className="text-base font-bold text-foreground">
              Avg Findings / File
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-800/20">
              <BarChart3 className="h-6 w-6 text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {data.length > 0 ? (
              <div className="text-2xl font-semibold text-foreground">
                {avgFindingsPerFile}
              </div>
            ) : (
              <Skeleton className="h-6 w-1/2" />
            )}
            <p className="text-sm text-muted-foreground mt-1">
              distribution across {uniqueFiles} file
              {uniqueFiles !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      )}

      {/* ---------- Card 4: Most Common Rule ---------- */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="flex items-center justify-between p-4 pb-3">
          <CardTitle className="text-base font-bold text-foreground">
            Most Common Rule
          </CardTitle>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-800/20">
            <BarChart3 className="h-6 w-6 text-purple-400" />
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {data.length > 0 ? (
            <>
              <div className="text-xl font-semibold text-foreground break-all">
                {shortRuleId(mostCommonRuleInfo.ruleId)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {mostCommonRuleInfo.count} occurrences
              </p>
            </>
          ) : (
            <>
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-1/3 mt-2" />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
