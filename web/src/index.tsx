import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./Routes";

import "./styles/main.sass";
import { createTheme, ThemeProvider } from "@mui/material";
import { MantineProvider } from "@mantine/core";
import { removeToken } from "./api/token";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      onError: (error: any) => {
        if ((error.response.status = 401)) {
          // removeToken();
          // window.location.reload();
        }
      },
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MantineProvider
          theme={{
            colorScheme: "dark",
          }}
        >
          <main className="main">
            <AppRouter />
          </main>
        </MantineProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
