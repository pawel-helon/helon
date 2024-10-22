import type { Metadata } from "next";
import { Toaster } from "sonner";
import "@/app/globals.css";
import { poppins } from "@/components/typography";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Helon",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(poppins.className, "antialiased")}>
        <div className="flex relative min-h-screen mx-auto xl:max-w-screen-xl 2xl:max-w-screen-2xl">
          {children}
        </div>
        <Toaster position="top-center" toastOptions={{
          unstyled: true,
          classNames: {
            toast: 'w-[351px] xs:w-[480px] flex gap-2 bg-background-sh p-4 border border-border rounded-lg shadow-black shadow-sm',
            title: 'text-xs font-base text-white mr-4 xs:mr-6',
            description: 'text-xs font-base text-white',
            actionButton: 'h-8 inline-flex justify-center items-center px-3 text-xs text-nowrap transition-colors border border-input hover:bg-accent hover:text-accent-foreground rounded-md shadow-sm bg-background-sh'
          }
        }}
        />
      </body>
    </html>
  );
}
