import Header from "@/components/layout/header/header";
import { Footer } from "@/components/layout/footer/footer";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
      <Footer />
    </div>
  );
}
