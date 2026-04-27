import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Buzz",
  description: "Privacy policy for Buzz.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-full w-full max-w-6xl px-lg py-2xl">
      <h1 className="font-semibold text-20 text-foreground">Privacy Policy</h1>
    </main>
  );
}
