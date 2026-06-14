import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Toaster } from "sonner"
import App from "@/app/App"
import QueryProvider from "@/shared/providers/QueryProvider"
import "@/index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <App />
      <Toaster theme="dark" richColors position="top-right" />
    </QueryProvider>
  </StrictMode>,
)
