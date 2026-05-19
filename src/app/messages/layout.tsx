import AppShell from "@/components/layout/AppShell";
import { Suspense } from "react";

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" /></div>}>
        {children}
      </Suspense>
    </AppShell>
  );
}
