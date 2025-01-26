"use client";

import React from "react";
import { MetricsCards } from "./MetricsCards";
import { ChartsGrid } from "./ChartsGrid";
import { DataTable } from "./DataTable";
import { SarifLog } from "@/types/sarif";

export default function Dashboard({ sarif }: { sarif: SarifLog }) {
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
