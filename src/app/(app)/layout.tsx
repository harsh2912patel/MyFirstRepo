import { Sidebar } from '@/components/layout/sidebar';
import { CurrencyProvider } from '@/context/currency-context';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CurrencyProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <main className="flex flex-col bg-background">{children}</main>
      </div>
    </CurrencyProvider>
  );
}
