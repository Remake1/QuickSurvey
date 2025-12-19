import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import {RouterProvider} from "react-router";
import router from "./app/router.tsx";
import {QueryClientContext, QueryClient} from "@tanstack/react-query";
import {AppProviders} from "@/app/providers.tsx";

const queryClient = new QueryClient;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientContext value={queryClient}>
          <AppProviders>
              <RouterProvider router={router} />
          </AppProviders>
      </QueryClientContext>
  </StrictMode>,
)
