import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/logo";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-lg py-lg">
        <Link aria-label="Buzz home" href="/">
          <Logo />
        </Link>
        <nav className="flex items-center gap-md text-14">
          <Link
            className="rounded-md border border-border bg-secondary px-base py-md font-medium transition-colors hover:bg-secondary-hover"
            href="/sign-in"
          >
            Sign in
          </Link>
          <Link
            className="rounded-md bg-primary px-base py-md font-medium text-foreground-inverted transition-colors hover:bg-primary-hover"
            href="/sign-up"
          >
            Sign up
          </Link>
        </nav>
      </header>
      <div className="min-h-0 flex-1">{children}</div>
      <footer className="mx-auto flex w-full max-w-6xl items-center justify-between px-lg py-lg text-13 text-foreground-muted">
        <span>&copy; 2026 Buzz</span>
        <nav className="flex items-center gap-lg">
          <Link
            className="transition-colors hover:text-foreground"
            href="/privacy"
          >
            Privacy
          </Link>
          <Link
            className="transition-colors hover:text-foreground"
            href="/terms"
          >
            Terms
          </Link>
        </nav>
      </footer>
    </div>
  );
}
