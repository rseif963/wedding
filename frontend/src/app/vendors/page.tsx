export const dynamic = "force-dynamic"; // optional, fine to keep

export const metadata = {
  title: "Wedding Vendors in Kenya",
  description:
    "Browse verified wedding vendors in Kenya including photographers, planners, venues and caterers.",
  alternates: {
    canonical: "https://wedpine.com/vendors",
  },
};

import { Suspense } from "react";
import VendorsClient from "./VendorsClient";

export default function VendorsPage() {
  return (
    <Suspense fallback={<div></div>}>
      <VendorsClient />
    </Suspense>
  );
}
