"use client";

import { Trash2 } from "lucide-react";
import { deleteSessionAction } from "@/app/actions";

type DeleteSessionButtonProps = {
  sessionId: string;
  teamId: string;
};

export function DeleteSessionButton({ sessionId, teamId }: DeleteSessionButtonProps) {
  return (
    <form action={deleteSessionAction.bind(null, sessionId, teamId)}>
      <button
        type="submit"
        className="p-2.5 text-danger border border-border rounded-lg hover:bg-danger/5 transition-colors"
        title="Delete Session"
        onClick={(e) => {
          if (!confirm("Are you sure you want to delete this session? All attendance records will be lost.")) {
            e.preventDefault();
          }
        }}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </form>
  );
}
