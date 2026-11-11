"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { hasSignedUp } from "@/lib/grazie";

const never = () => () => {};

/** Shows its content only in a tab that has just signed up; anyone else goes to the home. Not a protection, see lib/grazie.ts. */
export function SignedUpOnly({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const signedUp = useSyncExternalStore(never, () => hasSignedUp(), () => false);

  // read here, not from `signedUp`: during hydration that is still the server's answer
  useEffect(() => {
    if (!hasSignedUp()) router.replace("/");
  }, [router]);

  return signedUp ? children : null;
}
