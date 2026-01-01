// app/auth/page.tsx
import dynamic from "next/dynamic";

// Dynamically import your AuthPage, client-only
const AuthPage = dynamic(() => import("./AuthPage"), { ssr: false });

export default function Page() {
  return <AuthPage />;
}
