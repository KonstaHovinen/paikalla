"use client";

import { PracticeSession } from "@/lib/types";
import { useState } from "react";
import Link from "next/link";
import { Calendar, ChevronRight, Eye, EyeOff, Plus } from "lucide-react";
import { format, isPast } from "date-fns";

type TeamScheduleProps = {
  teamId: string;
  sessions: PracticeSession[];
};

export function TeamSchedule({ teamId, sessions }: TeamScheduleProps) {
  const [showPastEvents, setShowPastEvents] = useState(false);

  const filteredSessions = sessions.filter((session) => {
    if (showPastEvents) return true;
    return !isPast(new Date(session.date_time));
  });

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-medium text-foreground">Schedule</h2>
          <button
            onClick={() => setShowPastEvents(!showPastEvents)}
            className="text-xs text-muted hover:text-foreground flex items-center gap-1.5 transition-colors"
          >
            {showPastEvents ? (
              <><Eye className="w-3.5 h-3.5" /> Past events shown</>
            ) : (
              <><EyeOff className="w-3.5 h-3.5" /> Past events hidden</>
            )}
          </button>
        </div>
        
        <Link 
          href={`/teams/${teamId}/sessions/new`}
          className="text-sm font-medium text-foreground border border-border px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> New
        </Link>
      </div>

      <div className="space-y-2">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-dashed border-border">
            <Calendar className="mx-auto h-6 w-6 text-muted mb-3" />
            <p className="text-muted text-sm">
              {showPastEvents ? "No sessions yet" : "No upcoming sessions"}
            </p>
            {!showPastEvents && sessions.some(s => isPast(new Date(s.date_time))) && (
              <button 
                onClick={() => setShowPastEvents(true)}
                className="mt-3 text-xs text-foreground font-medium hover:underline"
              >
                Show past events
              </button>
            )}
          </div>
        ) : (
          filteredSessions.map((session) => (
            <Link
              href={`/teams/${teamId}/sessions/${session.id}`}
              key={session.id}
              className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-secondary/50 transition-colors"
            >
              <div className="min-w-0">
                <h3 className="font-medium text-sm">{session.title}</h3>
                <p className="text-xs text-muted mt-0.5">
                  {format(new Date(session.date_time), "MMM d, yyyy · h:mm a")}
                  {session.location && ` · ${session.location}`}
                </p>
              </div>
              <ChevronRight className="text-muted w-4 h-4 shrink-0 ml-4" />
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
