"use client";

import { PracticeSession, AttendanceStatus, Player } from "@/lib/types";
import { useState, useEffect, useTransition } from "react";
import { playerSubmitAttendanceAction } from "@/app/actions";
import { Check, X, Clock, Loader2, Search, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type PlayerInviteFormProps = {
  teamId: string;
  session: PracticeSession;
  players: Player[];
};

export function PlayerInviteForm({ teamId, session, players }: PlayerInviteFormProps) {
  const [playerName, setPlayerName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasName, setHasName] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<AttendanceStatus | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const storedName = localStorage.getItem(`paikalla_player_name_${teamId}`);
    if (storedName) {
      // Check if the stored name still exists in the roster
      const exists = players.some(p => p.name.toLowerCase() === storedName.toLowerCase());
      if (exists) {
        setPlayerName(storedName);
        setHasName(true);
      } else {
        localStorage.removeItem(`paikalla_player_name_${teamId}`);
      }
    }
  }, [teamId, players]);

  const handleSelectName = (name: string) => {
    localStorage.setItem(`paikalla_player_name_${teamId}`, name);
    setPlayerName(name);
    setHasName(true);
  };

  const handleSubmit = (status: AttendanceStatus) => {
    startTransition(async () => {
      try {
        await playerSubmitAttendanceAction(teamId, session.id, playerName, status);
        setSubmittedStatus(status);
      } catch (error) {
        console.error(error);
        alert("Something went wrong. Please refresh and try again.");
      }
    });
  };

  const filteredPlayers = players.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If the user hasn't identified themselves yet, show the searchable roster
  if (!hasName) {
    return (
      <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Select your name</h2>
          <p className="text-sm text-muted">You must be on the official roster to mark attendance.</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search roster..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary/50 border border-border rounded-2xl pl-11 pr-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            autoFocus
          />
        </div>

        <div className="bg-secondary/30 rounded-3xl border border-border overflow-hidden max-h-[400px] overflow-y-auto">
          {filteredPlayers.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <User className="w-8 h-8 text-muted mx-auto opacity-20" />
              <p className="text-muted text-sm italic">
                {searchQuery ? `No matches for "${searchQuery}"` : "Roster is empty."}
              </p>
              <p className="text-xs text-muted/60">Ask your coach to add you to the team.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filteredPlayers.map((player) => (
                <button
                  key={player.id}
                  onClick={() => handleSelectName(player.name)}
                  className="w-full p-5 text-left flex items-center justify-between hover:bg-secondary/50 active:bg-secondary transition-colors group"
                >
                  <span className="text-lg font-medium group-hover:text-primary transition-colors">{player.name}</span>
                  <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // If they have submitted their answer
  if (submittedStatus && !isPending) {
    return (
      <div className="text-center p-10 border border-border rounded-[2.5rem] space-y-6 animate-in zoom-in-95 duration-500 bg-background shadow-xl shadow-primary/5">
        <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center bg-secondary/50 border border-border shadow-inner">
          {submittedStatus === "PRESENT" && <Check className="w-10 h-10 text-success" strokeWidth={3} />}
          {submittedStatus === "ABSENT" && <X className="w-10 h-10 text-danger" strokeWidth={3} />}
          {submittedStatus === "LATE" && <Clock className="w-10 h-10 text-warning" strokeWidth={3} />}
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold tracking-tight">Got it, {playerName}!</h3>
          <p className="text-muted leading-relaxed">
            Your status is set for <br/>
            <span className="font-semibold text-foreground">{session.title}</span>
          </p>
        </div>
        <button 
          onClick={() => setSubmittedStatus(null)}
          className="text-sm font-medium text-muted hover:text-foreground transition-colors border-b border-dashed border-muted/50 hover:border-foreground"
        >
          Change my answer
        </button>
      </div>
    );
  }

  // Main status selection screen
  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full border border-border">
          <User className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest">{playerName}</span>
          <button 
            onClick={() => setHasName(false)}
            className="ml-2 text-[10px] text-muted hover:text-danger font-black uppercase transition-colors"
          >
            Switch
          </button>
        </div>

        <div className="space-y-1">
          <h3 className="text-2xl font-bold tracking-tight">{session.title}</h3>
          <p className="text-muted font-medium">
            {format(new Date(session.date_time), "EEEE, MMM d · h:mm a")}
            {session.location && ` · ${session.location}`}
          </p>
        </div>

        {session.comment && (
          <div className="max-w-[280px] mx-auto bg-secondary/20 p-4 rounded-2xl border border-border/50">
            <p className="text-sm text-muted italic">&quot;{session.comment}&quot;</p>
          </div>
        )}
      </div>

      <div className="grid gap-4">
        <button
          disabled={isPending}
          onClick={() => handleSubmit("PRESENT")}
          className="group relative flex items-center justify-between bg-success text-success-foreground rounded-[2rem] p-6 font-bold text-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-success/20 disabled:opacity-50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          Coming <Check className="w-7 h-7" strokeWidth={3} />
        </button>
        
        <button
          disabled={isPending}
          onClick={() => handleSubmit("ABSENT")}
          className="group relative flex items-center justify-between bg-danger text-danger-foreground rounded-[2rem] p-6 font-bold text-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-danger/20 disabled:opacity-50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          Not Coming <X className="w-7 h-7" strokeWidth={3} />
        </button>
        
        <button
          disabled={isPending}
          onClick={() => handleSubmit("LATE")}
          className="group relative flex items-center justify-between bg-warning text-warning-foreground rounded-[2rem] p-6 font-bold text-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-warning/20 disabled:opacity-50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          Late <Clock className="w-7 h-7" strokeWidth={3} />
        </button>
      </div>

      {isPending && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-md z-50 flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-background border border-border p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-sm font-bold uppercase tracking-widest opacity-50">Saving...</p>
          </div>
        </div>
      )}
    </div>
  );
}
