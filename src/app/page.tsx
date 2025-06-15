"use client";

import Header from "@/components/layout/header/header";
import { PublicHomePage } from "./_components/public-home";
import { Footer } from "@/components/layout/footer/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen min-w-full">
      <Header />
      <main className="flex-1 w-full">
        <PublicHomePage />
      </main>
      <Footer />
    </div>
  );
}
