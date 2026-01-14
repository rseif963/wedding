// app/auth/page.tsx
import { Suspense } from "react";
import AuthClient from "./AuthClient";
import type { Metadata } from "next";

// ✅ Page-specific title for login
export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your Wedpine account to manage bookings and vendors.",
};

export default function AuthPage() {
  return (
    <Suspense fallback={<div></div>}>
      <AuthClient />
    </Suspense>
  );
}
