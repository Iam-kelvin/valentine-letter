"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { anonSecondaryButtonStyle } from "@/lib/anonymous-ui";

export default function ArchiveButton({ messageId }: { messageId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleArchive() {
    setLoading(true);

    const res = await fetch("/api/anonymous/messages/archive", {
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
      onClick={handleArchive}
      disabled={loading}
      style={{
        ...anonSecondaryButtonStyle,
        fontSize: 14,
        padding: "10px 16px",
      }}
    >
      {loading ? "Archiving..." : "Archive"}
    </button>
  );
}