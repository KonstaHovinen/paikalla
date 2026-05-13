import { getTeamByInviteCode, getSessionsByTeam } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import { format } from "date-fns";

export default async function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = await params;
  const team = await getTeamByInviteCode(resolvedParams.code);
  if (!team) notFound();

  const sessions = await getSessionsByTeam(team.id);

  return (
    <main className="max-w-md mx-auto w-full p-6 min-h-screen flex flex-col pt-12">
      <header className="mb-10">
        <h1 className="text-xl font-bold text-foreground/60">{team.name}</h1>
        <h2 className="text-3xl font-extrabold tracking-tight mt-1">Schedule</h2>
        <p className="text-foreground/60 text-sm mt-2">Select a session to mark your attendance.</p>
      </header>

      {sessions.length === 0 ? (
        <div className="text-center p-8 bg-secondary/50 rounded-2xl border border-dashed border-border">
          <Calendar className="mx-auto w-8 h-8 text-foreground/40 mb-3" />
          <p className="font-semibold">No upcoming practices.</p>
          <p className="text-sm text-foreground/60 mt-1">Check back later when the coach schedules one.</p>
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto pb-12">
          {sessions.map((session) => (
            <Link 
              key={session.id}
              href={`/invite/${team.invite_code}/sessions/${session.id}`}
              className="flex items-center justify-between p-5 bg-secondary/50 border border-border rounded-2xl hover:bg-secondary transition-colors"
            >
              <div>
                <h3 className="font-bold text-lg">{session.title}</h3>
                <p className="font-medium text-foreground/70 text-sm mt-1">
                  {format(new Date(session.date_time), "EEEE, MMM d @ h:mm a")}
                  {session.location && ` @ ${session.location}`}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-foreground/40" />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
