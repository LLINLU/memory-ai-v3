
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Navigation } from "@/components/Navigation";

interface PageLayoutProps {
  children: React.ReactNode;

}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 bg-gray-50 pb-12">
          <Navigation />
          <div className="relative">
            <SidebarTrigger className="absolute left-4 top-4 md:hidden" />
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};
