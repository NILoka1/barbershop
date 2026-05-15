// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { trpc } from "src/api/client";

export function AdminRoute() {
  const { data } = trpc.auth.me.useQuery();

  if (!data) {
    return;
  }
  if (!data.isAdmin) {
    return <Navigate to="/workerDashbord" replace />;
  }

  return <Outlet />;
}
