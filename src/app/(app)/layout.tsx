import { Sidebar } from '@/components/layout/sidebar';
import { CurrencyProvider } from '@/context/currency-context';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CurrencyProvider>
      <div className="flex flex-col min-h-screen w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col bg-background">{children}</main>
      </div>
    </CurrencyProvider>
  );
}
