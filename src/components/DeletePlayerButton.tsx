"use client";

import { Trash2 } from "lucide-react";
import { deletePlayerAction } from "@/app/actions";

type DeletePlayerButtonProps = {
  playerId: string;
  teamId: string;
};

export function DeletePlayerButton({ playerId, teamId }: DeletePlayerButtonProps) {
  return (
    <form action={deletePlayerAction.bind(null, playerId, teamId)}>
      <button
        type="submit"
        className="p-2.5 text-danger border border-border rounded-lg hover:bg-danger/5 transition-colors"
        title="Remove Player"
        onClick={(e) => {
          if (!confirm("Remove this player? All their attendance history will be deleted.")) {
            e.preventDefault();
          }
        }}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </form>
  );
}
