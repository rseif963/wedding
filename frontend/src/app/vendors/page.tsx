export const dynamic = "force-dynamic"; // optional, but explicit

import { Suspense } from "react";
import VendorsClient from "./VendorsClient";

export default function VendorsPage() {
  return (
    <Suspense fallback={<div>Loading vendors...</div>}>
      <VendorsClient />
    </Suspense>
  );
}
