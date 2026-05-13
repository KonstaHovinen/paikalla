"use client";

import { PracticeSession, AttendanceStatus } from "@/lib/types";
import { useState, useEffect, useTransition } from "react";
import { playerSubmitAttendanceAction } from "@/app/actions";
import { Check, X, Clock, Loader2, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export function PlayerInviteForm({ teamId, session }: { teamId: string, session: PracticeSession }) {
  const [playerName, setPlayerName] = useState("");
  const [hasName, setHasName] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<AttendanceStatus | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const storedName = localStorage.getItem(`paikalla_player_name_${teamId}`);
    if (storedName) {
      setTimeout(() => {
        setPlayerName(storedName);
        setHasName(true);
      }, 0);
    }
  }, [teamId]);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    localStorage.setItem(`paikalla_player_name_${teamId}`, playerName.trim());
    setHasName(true);
  };

  const handleSubmit = (status: AttendanceStatus) => {
    startTransition(async () => {
      await playerSubmitAttendanceAction(teamId, session.id, playerName, status);
      setSubmittedStatus(status);
    });
  };

  if (!hasName) {
    return (
      <form onSubmit={handleSaveName} className="space-y-4">
        <div className="bg-secondary/30 p-6 rounded-2xl border border-border">
          <label className="block text-lg font-bold mb-3 text-center">Who are you?</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="w-full text-center bg-background border border-border rounded-xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
            autoFocus
          />
          <button 
            type="submit"
            className="w-full mt-4 bg-primary text-primary-foreground rounded-xl px-6 py-4 font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
          >
            Continue <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    );
  }

  if (submittedStatus && !isPending) {
    return (
      <div className="text-center p-8 bg-secondary/30 rounded-3xl border border-border space-y-4 animate-in zoom-in-95 duration-300">
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-background shadow-sm">
          {submittedStatus === "PRESENT" && <Check className="w-8 h-8 text-success" strokeWidth={3} />}
          {submittedStatus === "ABSENT" && <X className="w-8 h-8 text-danger" strokeWidth={3} />}
          {submittedStatus === "LATE" && <span className="text-warning font-black uppercase">Late</span>}
        </div>
        <h3 className="text-2xl font-bold">Got it, {playerName}!</h3>
        <p className="text-foreground/60">Your attendance has been recorded for <br/><strong className="text-foreground">{session.title}</strong>.</p>
        <button 
          onClick={() => setSubmittedStatus(null)}
          className="text-sm font-semibold text-foreground/40 hover:text-foreground mt-4 inline-block underline decoration-foreground/20 underline-offset-4"
        >
          Change my answer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8 bg-secondary/30 p-6 rounded-3xl border border-border relative">
        <button 
          onClick={() => setHasName(false)}
          className="absolute top-4 right-4 text-xs font-semibold text-foreground/40 hover:text-foreground"
        >
          Not {playerName}?
        </button>
        <h3 className="text-xl font-bold text-primary mb-1">{session.title}</h3>
        <p className="font-semibold text-lg">
          {format(new Date(session.date_time), "EEEE, MMM d @ h:mm a")}
          {session.location && ` @ ${session.location}`}
        </p>
        {session.comment && (
          <p className="mt-3 text-sm text-foreground/70 bg-background/50 inline-block px-4 py-2 rounded-lg">
            {session.comment}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <button
          disabled={isPending}
          onClick={() => handleSubmit("PRESENT")}
          className="w-full bg-success text-success-foreground rounded-2xl p-6 font-black text-2xl flex items-center justify-between hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-success/20 disabled:opacity-50"
        >
          Coming <Check className="w-8 h-8" strokeWidth={3} />
        </button>
        
        <button
          disabled={isPending}
          onClick={() => handleSubmit("ABSENT")}
          className="w-full bg-danger text-danger-foreground rounded-2xl p-6 font-black text-2xl flex items-center justify-between hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-danger/20 disabled:opacity-50"
        >
          Not Coming <X className="w-8 h-8" strokeWidth={3} />
        </button>
        
        <button
          disabled={isPending}
          onClick={() => handleSubmit("LATE")}
          className="w-full bg-warning text-warning-foreground rounded-2xl p-6 font-black text-2xl flex items-center justify-between hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-warning/20 disabled:opacity-50"
        >
          Late <Clock className="w-8 h-8" strokeWidth={3} />
        </button>
      </div>

      {isPending && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}
