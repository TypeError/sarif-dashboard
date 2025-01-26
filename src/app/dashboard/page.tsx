import ClientDashboard from "@/components/ClientDashboard";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading your dashboard...</div>}>
      <ClientDashboard />
    </Suspense>
  );
}
