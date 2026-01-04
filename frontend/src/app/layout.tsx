import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "@/context/AppContext";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script"; // ✅ add this

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Wedpine – Wedding Vendors & Planning Platform",
    template: "%s | Wedpine",
  },
  description:
    "Find trusted wedding vendors, venues, photographers, caterers and planners on Wedpine.",
  keywords: [
    "wedding vendors",
    "wedding planning",
    "wedding photographers",
    "wedding venues",
    "wedding catering",
  ],
  metadataBase: new URL("https://www.wedpine.com"),
  openGraph: {
    title: "Wedpine",
    description:
      "Discover and book the best wedding vendors in one place.",
    url: "https://www.wedpine.com",
    siteName: "Wedpine",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans bg-gray-50 text-gray-800 bg-white">

        {/* ✅ Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GMT9GH8T3L"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GMT9GH8T3L');
          `}
        </Script>

        <AppProvider>
          {children}
          <Analytics />
          <Toaster position="top-right" reverseOrder={false} />
        </AppProvider>

      </body>
    </html>
  );
}
