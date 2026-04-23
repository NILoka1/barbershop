import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "server";
import App from "./App";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css"
import { trpcClient } from "./api/client";
import { ModalsProvider } from "@mantine/modals";
export const trpc = createTRPCReact<AppRouter>();

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider defaultColorScheme="dark">
          <ModalsProvider>
            <App />
          </ModalsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>,
);
