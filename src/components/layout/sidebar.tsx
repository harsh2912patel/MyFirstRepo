'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot,
  CandlestickChart,
  Landmark,
  LayoutDashboard,
  Menu,
  PiggyBank,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/icons';
import { useMediaQuery } from '@/hooks/use-media-query';
import { CurrencySwitcher } from './currency-switcher';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/budget', label: 'Budget', icon: PiggyBank },
  { href: '/loans', label: 'Loans', icon: Landmark },
  { href: '/portfolio', label: 'Portfolio', icon: CandlestickChart },
  { href: '/guidance', label: 'Guidance', icon: Bot },
];

function NavContent() {
  const pathname = usePathname();
  return (
    <>
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Logo className="h-6 w-6 text-primary" />
          <span className="">FinanceFlow</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-4 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                { 'bg-muted text-primary': pathname === item.href }
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <CurrencySwitcher />
    </>
  );
}

export function Sidebar() {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <aside className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <NavContent />
        </div>
      </aside>
    );
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
      <Link href="/" className="flex items-center gap-2 font-semibold md:hidden">
        <Logo className="h-6 w-6 text-primary" />
        <span className="">FinanceFlow</span>
      </Link>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden ml-auto">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <NavContent />
        </SheetContent>
      </Sheet>
    </header>
  );
}
