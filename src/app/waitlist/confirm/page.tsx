import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import { Container } from "@/components/section";
import { ConfirmCard } from "./confirm-card";

export const metadata: Metadata = {
  title: "Confirm your email",
  robots: { index: false, follow: false },
};

// Opened from the link in the confirmation email. The token is only checked when the visitor presses Confirm.
export default async function ConfirmPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { token } = await searchParams;

  return (
    <>
      <header className="border-b border-line">
        <Container className="flex h-16 items-center">
          <Link href="/" aria-label="Textcrew home" className="rounded-lg">
            <Logo />
          </Link>
        </Container>
      </header>
      <main className="relative flex flex-1 items-center py-20 sm:py-28">
        <div aria-hidden className="dot-grid absolute inset-0" />
        <Container className="relative">
          <ConfirmCard token={typeof token === "string" ? token : ""} />
        </Container>
      </main>
      <Footer />
    </>
  );
}
