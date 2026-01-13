export const dynamic = "force-dynamic"; // optional, but explicit

import { Suspense } from "react";
import Messages from "../components/Messages";

export default function MessagesPage() {
  return (
    <Suspense fallback={<div></div>}>
      <Messages />
    </Suspense>
  );
}