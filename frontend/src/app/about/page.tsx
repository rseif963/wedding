// app/about/page.tsx (SERVER)
import { Metadata } from "next";
import AboutClient from "./AboutClient"; // the old file

export const metadata: Metadata = {
  title: "About | Wedding Vendors in Kenya",
  description:
    "Learn about Wedpine, our mission, vision, and team building Kenya's trusted wedding vendor platform.",
  alternates: { canonical: "https://wedpine.com/about" },
};

export default function AboutPage() {
  return <AboutClient />;
}
