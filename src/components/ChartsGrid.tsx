"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { SarifLog, Result } from "@/types/sarif";
import { useMemo } from "react";

/** Basic data item with a guaranteed `count: number`. */
interface BasicItem {
  name: string;
  count: number;
  fill?: string;
}

/** Return the segment after the last '.' in ruleId (or entire if not found). */
function shortRuleId(fullId: string): string {
  const parts = fullId.split(".");
  return parts.length > 1 ? parts[parts.length - 1] : fullId;
}

/** Return the portion after the last '/' in a file path. */
function fileNameAfterSlash(fullPath: string): string {
  const slashIndex = fullPath.lastIndexOf("/");
  return slashIndex >= 0 ? fullPath.slice(slashIndex + 1) : fullPath;
}

const CustomTick = ({
  x,
  y,
  payload,
}: {
  x: number;
  y: number;
  payload: { value: string };
}) => (
  <g transform={`translate(${x},${y})`}>
    <text
      x={0}
      y={0}
      dy={16}
      textAnchor="end"
      fill="#e5e7eb"
      transform="rotate(-45)"
      style={{ fontSize: 8 }}
    >
      {payload.value}
    </text>
  </g>
);

export function ChartsGrid({ sarif }: { sarif: SarifLog }) {
  // Gather all results
  const allResults = useMemo<Result[]>(() => {
    return sarif.runs.flatMap((run) => run.results || []);
  }, [sarif]);

  // ======================
  // 1) Severity Breakdown (Doughnut)
  // ======================
  const severityData = useMemo<BasicItem[]>(() => {
    const severityCounts: Record<string, number> = {};
    sarif.runs.forEach((run) => {
      // Map default rule levels if provided
      const ruleLevelMap = new Map<string, string>();
      (run.tool.driver.rules || []).forEach((rule) => {
        if (rule.id && rule.defaultConfiguration?.level) {
          ruleLevelMap.set(
            rule.id,
            rule.defaultConfiguration.level.toLowerCase()
          );
        }
      });

      (run.results || []).forEach((res) => {
        const sev =
          res.level?.toLowerCase() ||
          (res.ruleId ? ruleLevelMap.get(res.ruleId) : undefined) ||
          "unknown";
        severityCounts[sev] = (severityCounts[sev] || 0) + 1;
      });
    });

    // Include these severities even if 0
    const allSeverities = ["error", "warning", "note", "none", "unknown"];
    return allSeverities.map((sev) => ({
      name: sev.charAt(0).toUpperCase() + sev.slice(1),
      count: severityCounts[sev] || 0,
      fill:
        sev === "error"
          ? "#ef4444"
          : sev === "warning"
            ? "#facc15"
            : sev === "note"
              ? "#3b82f6"
              : sev === "none"
                ? "#10b981"
                : "#9ca3af", // unknown -> gray
    }));
  }, [sarif]);

  // ======================
  // 2) Findings by Short Rule (Vertical Bar, top 10)
  // ======================
  const shortRuleData = useMemo<BasicItem[]>(() => {
    const tally: Record<string, number> = {};
    allResults.forEach((r) => {
      const sr = r.ruleId ? shortRuleId(r.ruleId) : "Unknown";
      tally[sr] = (tally[sr] || 0) + 1;
    });
    let arr = Object.entries(tally).map(([name, count]) => ({ name, count }));
    // Sort descending
    arr.sort((a, b) => b.count - a.count);
    // If > 10, combine remainder as "Other"
    if (arr.length > 10) {
      const top = arr.slice(0, 10);
      const remainder = arr.slice(10);
      const otherCount = remainder.reduce((acc, item) => acc + item.count, 0);
      top.push({ name: "Other", count: otherCount });
      arr = top;
    }
    return arr;
  }, [allResults]);

  // ======================
  // 3) Affected Files (Horizontal Bar, top 10)
  // ======================
  const filesData = useMemo<BasicItem[]>(() => {
    const fileCounts: Record<string, number> = {};
    allResults.forEach((r) => {
      const uri = r.locations?.[0]?.physicalLocation?.artifactLocation?.uri;
      if (!uri) return;
      const shortName = fileNameAfterSlash(uri);
      fileCounts[shortName] = (fileCounts[shortName] || 0) + 1;
    });
    let arr = Object.entries(fileCounts).map(([name, count]) => ({
      name,
      count,
    }));
    // Sort descending
    arr.sort((a, b) => b.count - a.count);
    // If > 10, combine extras
    if (arr.length > 10) {
      const top = arr.slice(0, 10);
      const remainder = arr.slice(10);
      const otherCount = remainder.reduce((acc, item) => acc + item.count, 0);
      top.push({ name: "Other", count: otherCount });
      arr = top;
    }
    return arr;
  }, [allResults]);

  // ======================
  // 4) File Extension Distribution (Doughnut, top 10)
  // ======================
  const extensionData = useMemo<BasicItem[]>(() => {
    const extCounts: Record<string, number> = {};
    allResults.forEach((r) => {
      const uri = r.locations?.[0]?.physicalLocation?.artifactLocation?.uri;
      if (!uri) return;
      const dotIndex = uri.lastIndexOf(".");
      let ext = "NoExt";
      if (dotIndex !== -1 && dotIndex < uri.length - 1) {
        ext = uri.slice(dotIndex).toLowerCase();
      }
      extCounts[ext] = (extCounts[ext] || 0) + 1;
    });

    let arr = Object.entries(extCounts).map(([name, count]) => ({
      name,
      count,
    }));
    // Sort desc
    arr.sort((a, b) => b.count - a.count);
    // If more than 10, combine extras
    if (arr.length > 10) {
      const top = arr.slice(0, 10);
      const remainder = arr.slice(10);
      const otherCount = remainder.reduce((acc, item) => acc + item.count, 0);
      top.push({ name: "Other", count: otherCount });
      arr = top;
    }
    return arr;
  }, [allResults]);

  // A shared dark tooltip style
  const tooltipStyle = {
    backgroundColor: "#1f2937",
    border: "1px solid #374151",
    borderRadius: 6,
    color: "#f9fafb",
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* ===========================================
          (1) Severity Breakdown (Doughnut)
      ============================================ */}
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="p-3 text-white bg-gradient-to-r from-purple-900 via-pink-900 to-blue-900">
          <CardTitle className="text-lg font-semibold">
            Severity Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {severityData.every((item) => item.count === 0) ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart margin={{ top: 10 }}>
                <Pie
                  data={severityData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  label
                  labelLine={false}
                >
                  {severityData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  wrapperStyle={{ outline: "none" }}
                  cursor={{ fill: "rgba(255,255,255,0.1)" }}
                />
                <Legend
                  wrapperStyle={{ color: "#fff" }}
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* ===========================================
          (2) Findings by Short Rule (vertical bar)
      ============================================ */}
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="p-3 text-white bg-gradient-to-r from-purple-900 via-pink-900 to-blue-900">
          <CardTitle className="text-lg font-semibold">
            Findings by Rule
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!shortRuleData.length ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={shortRuleData}
                margin={{ top: 20, right: 30, left: 20, bottom: 75 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                <XAxis
                  dataKey="name"
                  stroke="#e5e7eb"
                  tick={(props) => <CustomTick {...props} />}
                  interval={0}
                  tickMargin={12}
                />
                <YAxis
                  allowDecimals={false}
                  stroke="#e5e7eb"
                  tick={{ fontSize: 10, fill: "#e5e7eb" }}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  wrapperStyle={{ outline: "none" }}
                  cursor={{ fill: "rgba(255,255,255,0.1)" }}
                />
                <defs>
                  <linearGradient
                    id="shortRuleGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <Bar dataKey="count" fill="url(#shortRuleGradient)">
                  <LabelList
                    dataKey="count"
                    position="top"
                    style={{ fontSize: 12, fill: "#e5e7eb" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* ===========================================
          (3) Affected Files (horizontal bar)
      ============================================ */}
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="p-3 text-white bg-gradient-to-r from-purple-900 via-pink-900 to-blue-900">
          <CardTitle className="text-lg font-semibold">
            Affected Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!filesData.length ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={filesData}
                layout="vertical"
                margin={{ top: 20, right: 30, bottom: 20, left: 150 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  stroke="#e5e7eb"
                  tick={{ fontSize: 10, fill: "#e5e7eb" }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={140}
                  stroke="#e5e7eb"
                  tick={{ fontSize: 10, fill: "#e5e7eb" }}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  wrapperStyle={{ outline: "none" }}
                  cursor={{ fill: "rgba(255,255,255,0.1)" }}
                />
                <defs>
                  <linearGradient
                    id="filesGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#ec4899" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#f472b6" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <Bar dataKey="count" fill="url(#filesGradient)">
                  <LabelList
                    dataKey="count"
                    position="insideRight"
                    style={{
                      fontSize: 12,
                      fill: "#ffffff",
                      fontWeight: "bold",
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* ===========================================
          (4) File Extension Distribution (Doughnut)
      ============================================ */}
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="p-3 text-white bg-gradient-to-r from-purple-900 via-pink-900 to-blue-900">
          <CardTitle className="text-lg font-semibold">
            File Extension Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!extensionData.length ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart margin={{ top: 10 }}>
                <Pie
                  data={extensionData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  label
                  labelLine={false}
                >
                  {extensionData.map((entry, idx) => (
                    <Cell key={idx} fill="#3b82f6" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  wrapperStyle={{ outline: "none" }}
                  cursor={{ fill: "rgba(255,255,255,0.1)" }}
                />
                <Legend
                  wrapperStyle={{ color: "#fff" }}
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
