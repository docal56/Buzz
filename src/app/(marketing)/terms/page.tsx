import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Buzz",
  description: "Terms for using Buzz.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-full w-full max-w-6xl px-lg py-2xl">
      <h1 className="font-semibold text-20 text-foreground">
        Terms &amp; Conditions
      </h1>
    </main>
  );
}
