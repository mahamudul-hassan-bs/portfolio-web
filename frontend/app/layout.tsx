import type { Metadata } from "next";
import "./globals.css";
import LightRays from "@/components/LightRays";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mahamudul Hassan Barshan | Full-Stack Developer",
  description:
    "Personal portfolio & blog of Mahamudul Hassan Barshan - Full-Stack Developer",
  keywords: "Full-Stack Developer, React, Node.js, MongoDB, Portfolio",
  authors: [{ name: "Mahamudul Hassan Barshan" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white min-h-screen">
        <div className="absolute inset-0 top-0 -z-10 h-full pointer-events-none">
          <LightRays
            raysOrigin="top-center-offset"
            raysColor="#5dfeca"
            raysSpeed={0.5}
            lightSpread={0.9}
            rayLength={1.4}
            followMouse={true}
            mouseInfluence={0.02}
            noiseAmount={0.0}
            distortion={0.01}
          />
        </div>
        {children}
      </body>
    </html>
  );
}
