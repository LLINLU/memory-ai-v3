
import { StrictMode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { PrivateRoute } from "@/components/PrivateRoute";
import Index from "./pages/Index";
import SearchResults from "./pages/SearchResults";
import TechnologyTree from "./pages/TechnologyTree";
import ResearchContext from "./pages/ResearchContext";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/AdminPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const App = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter
            future={{
              v7_relativeSplatPath: true,
            }}
          >
            <AuthProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                  <PrivateRoute>
                    <Index />
                  </PrivateRoute>
                } />
                <Route path="/search-results" element={
                  <PrivateRoute>
                    <SearchResults />
                  </PrivateRoute>
                } />
                <Route path="/research-context" element={
                  <PrivateRoute>
                    <ResearchContext />
                  </PrivateRoute>
                } />
                <Route path="/technology-tree" element={
                  <PrivateRoute>
                    <TechnologyTree />
                  </PrivateRoute>
                } />
                <Route path="/admin" element={
                  <PrivateRoute>
                    <AdminPage />
                  </PrivateRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};

export default App;
