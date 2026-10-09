import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/dawn/app-sidebar";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Dawn - Find your next design client",
  description: "Automated outreach to VC-funded startups that need product design help",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 w-full">
              {children}
            </main>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
