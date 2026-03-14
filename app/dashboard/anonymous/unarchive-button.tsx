"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { anonSecondaryButtonStyle } from "@/lib/anonymous-ui";

export default function UnarchiveButton({ messageId }: { messageId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleUnarchive() {
    setLoading(true);

    const res = await fetch("/api/anonymous/messages/unarchive", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messageId }),
    });

    setLoading(false);

    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <button
      onClick={handleUnarchive}
      disabled={loading}
      style={{
        ...anonSecondaryButtonStyle,
        fontSize: 14,
        padding: "10px 16px",
      }}
    >
      {loading ? "Restoring..." : "Undo archive"}
    </button>
  );
}