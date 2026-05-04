import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css"
import { trpcClient, trpc } from "./api/client";
import { ModalsProvider } from "@mantine/modals";

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
