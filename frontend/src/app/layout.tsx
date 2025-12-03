import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "@/context/AppContext"; // ✅ import from AppContext.js

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Wedpine",
  description: "Find your perfect wedding vendors",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
      <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-GMT9GH8T3L"></script>
  <script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-GMT9GH8T3L');
  </script>
      </head>
      <body className="font-sans bg-gray-50 text-gray-800 bg-white">
        <AppProvider>
          {children}
          {/* ✅ Global toast notifications */}
          <Toaster position="top-right" reverseOrder={false} />
        </AppProvider>
      </body>
    </html>
  );
}
