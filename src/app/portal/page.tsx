"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// /portal is the login gate (handled by the layout); once signed in,
// land on the dashboard.
export default function PortalIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/portal/dashboard");
  }, [router]);
  return null;
}
