import { getTeamById, getPlayersByTeam, getSessionsByTeam } from "@/lib/db";
import { notFound } from "next/navigation";
import { CopyInviteLink } from "@/components/CopyInviteLink";
import { TeamRosterList } from "@/components/TeamRosterList";
import { TeamSchedule } from "@/components/TeamSchedule";
import { createPlayerAction } from "@/app/actions";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const team = await getTeamById(resolvedParams.id);
  if (!team) notFound();

  const players = await getPlayersByTeam(team.id);
  const sessions = await getSessionsByTeam(team.id);

  const addPlayerWithTeamId = createPlayerAction.bind(null, team.id);

  return (
    <main className="max-w-4xl mx-auto w-full px-6 py-10 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-10 md:gap-16 items-start">
        {/* Left Column */}
        <div className="space-y-10">
          <header>
            <Link href="/" className="text-sm text-muted hover:text-foreground mb-6 inline-block transition-colors">
              ← Back to Teams
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight">{team.name}</h1>
            <div className="mt-4">
              <CopyInviteLink inviteCode={team.invite_code} />
            </div>
          </header>

          <TeamSchedule teamId={team.id} sessions={sessions} />
        </div>

        {/* Right Column: Roster */}
        <div className="md:mt-20">
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-secondary/50">
              <h2 className="text-sm font-medium">Roster ({players.length})</h2>
              <form action={addPlayerWithTeamId} className="flex gap-2">
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Add player..." 
                  required
                  className="w-28 border border-border rounded-lg px-3 py-1.5 text-xs bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted"
                />
                <button 
                  type="submit"
                  className="bg-primary text-primary-foreground rounded-lg px-2.5 py-1.5 hover:opacity-90 transition-opacity flex items-center justify-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
            
            <TeamRosterList teamId={team.id} players={players} />
          </div>
        </div>
      </div>
    </main>
  );
}
