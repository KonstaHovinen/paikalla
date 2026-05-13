"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyInviteLink({ inviteCode }: { inviteCode: string }) {
  const [copied, setCopied] = useState(false);
  const inviteUrl = typeof window !== 'undefined' ? `${window.location.origin}/invite/${inviteCode}` : '';

  const handleCopy = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-xs text-muted hover:text-foreground hover:bg-secondary transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : "Copy invite link"}
    </button>
  );
}
