"use client";

import { Player, Attendance, AttendanceStatus } from "@/lib/types";
import { updateAttendanceAction } from "@/app/actions";
import { useState, useTransition } from "react";
import { MessageSquare, Check, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type AttendanceListProps = {
  sessionId: string;
  players: Player[];
  initialAttendance: Attendance[];
};

export function AttendanceList({ sessionId, players, initialAttendance }: AttendanceListProps) {
  const [attendance, setAttendance] = useState<Attendance[]>(initialAttendance);
  const [, startTransition] = useTransition();
  const [commentingPlayer, setCommentingPlayer] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (playerId: string, status: AttendanceStatus) => {
    setAttendance((prev) => {
      const existing = prev.find((a) => a.player_id === playerId);
      if (existing) {
        return prev.map((a) => (a.player_id === playerId ? { ...a, status } : a));
      } else {
        return [...prev, { id: "temp", session_id: sessionId, player_id: playerId, status }];
      }
    });

    startTransition(() => {
      updateAttendanceAction(sessionId, playerId, status);
    });
  };

  const handleCommentSave = (playerId: string, comment: string) => {
    const currentStatus = attendance.find(a => a.player_id === playerId)?.status || "ABSENT";
    
    setAttendance((prev) => {
      const existing = prev.find((a) => a.player_id === playerId);
      if (existing) {
        return prev.map((a) => (a.player_id === playerId ? { ...a, comment } : a));
      } else {
        return [...prev, { id: "temp", session_id: sessionId, player_id: playerId, status: "ABSENT", comment }];
      }
    });

    startTransition(() => {
      updateAttendanceAction(sessionId, playerId, currentStatus, comment);
    });
    setCommentingPlayer(null);
  };

  return (
    <div>
      <div className="px-4 py-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-border rounded-lg pl-9 pr-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted"
          />
        </div>
      </div>

      {filteredPlayers.length === 0 ? (
        <div className="text-center py-10 px-4">
          <p className="text-muted text-sm">
            {searchQuery ? "No players match your search" : "No players on the team yet"}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {filteredPlayers.map((player) => {
            const record = attendance.find((a) => a.player_id === player.id);
            const status = record?.status || "ABSENT";
            const comment = record?.comment;
            const isCommenting = commentingPlayer === player.id;

            return (
              <div key={player.id} className="px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium truncate flex-1">
                    {player.name}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleStatusChange(player.id, "PRESENT")}
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center transition-all",
                        status === "PRESENT" 
                          ? "bg-success text-success-foreground" 
                          : "border border-border text-muted hover:bg-secondary"
                      )}
                    >
                      <Check className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => handleStatusChange(player.id, "ABSENT")}
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center transition-all",
                        status === "ABSENT" 
                          ? "bg-danger text-danger-foreground" 
                          : "border border-border text-muted hover:bg-secondary"
                      )}
                    >
                      <X className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => handleStatusChange(player.id, "LATE")}
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center transition-all text-xs font-medium",
                        status === "LATE" 
                          ? "bg-warning text-warning-foreground" 
                          : "border border-border text-muted hover:bg-secondary"
                      )}
                    >
                      Late
                    </button>
                  </div>
                </div>
                
                <div className="mt-2">
                  {!isCommenting && !comment ? (
                    <button 
                      onClick={() => setCommentingPlayer(player.id)}
                      className="text-xs text-muted hover:text-foreground flex items-center gap-1 transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" /> Add note
                    </button>
                  ) : isCommenting ? (
                    <input 
                      autoFocus
                      type="text" 
                      defaultValue={comment || ""}
                      placeholder="E.g., Injured ankle"
                      className="w-full border border-border rounded-lg px-3 py-1.5 text-xs bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCommentSave(player.id, e.currentTarget.value);
                        if (e.key === "Escape") setCommentingPlayer(null);
                      }}
                      onBlur={(e) => handleCommentSave(player.id, e.currentTarget.value)}
                    />
                  ) : (
                    <button 
                      onClick={() => setCommentingPlayer(player.id)}
                      className="text-xs text-muted hover:text-foreground flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3 h-3 shrink-0" />
                      <span className="italic">{comment}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
