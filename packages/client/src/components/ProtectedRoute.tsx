// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { trpc } from "src/api/client";

export function ProtectedRoute() {
  const token = trpc.auth.me.useQuery().data;

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
