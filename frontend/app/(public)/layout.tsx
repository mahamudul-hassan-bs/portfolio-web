import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="mt-4 flex items-center flex-col">
        <Header/>
      </div>
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
