"use client";

import React, { useEffect, useMemo, useState } from "react";
import { MetricsCards } from "./MetricsCards";
import { ChartsGrid } from "./ChartsGrid";
import { DataTable } from "./DataTable";
import { SarifLog } from "@/types/sarif";

export default function Dashboard({ sarif }: { sarif: SarifLog }) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  return (
    <div className="p-6 space-y-8">
      {/* Summary metrics */}
      <MetricsCards sarif={sarif} />

      {/* Charts */}
      <ChartsGrid sarif={sarif} />

      {/* Table */}
      <DataTable sarif={sarif} />
    </div>
  );
}
