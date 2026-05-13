import { getPlayerById, getTeamById, getPlayerAttendanceHistory } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { isPast } from "date-fns";
import { PlayerAttendanceCalendar } from "@/components/PlayerAttendanceCalendar";
import { DeletePlayerButton } from "@/components/DeletePlayerButton";

export default async function PlayerProfilePage({ 
  params 
}: { 
  params: Promise<{ id: string, playerId: string }> 
}) {
  const { id: teamId, playerId } = await params;
  
  const player = await getPlayerById(playerId);
  if (!player || player.team_id !== teamId) notFound();
  
  const team = await getTeamById(teamId);
  if (!team) notFound();
  
  const history = await getPlayerAttendanceHistory(playerId);
  
  // Only count sessions that have already occurred for the stats
  const pastHistory = history.filter(h => isPast(new Date(h.practice_sessions.date_time)));
  
  const totalSessions = pastHistory.length;
  const presentCount = pastHistory.filter(a => a.status === "PRESENT").length;
  const lateCount = pastHistory.filter(a => a.status === "LATE").length;
  const attendanceRate = totalSessions > 0 
    ? Math.round(((presentCount + lateCount) / totalSessions) * 100) 
    : 0;

  return (
    <main className="max-w-4xl mx-auto w-full px-6 py-10 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-10 md:gap-16 items-start">
        {/* Left Column */}
        <div>
          <div className="flex items-start justify-between mb-8">
            <div>
              <Link 
                href={`/teams/${teamId}`} 
                className="text-sm text-muted hover:text-foreground mb-6 inline-flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> {team.name}
              </Link>
              <h1 className="text-2xl font-semibold tracking-tight">{player.name}</h1>
              <p className="text-xs text-muted mt-1">Player Profile</p>
            </div>
            <DeletePlayerButton playerId={player.id} teamId={teamId} />
          </div>

          <div className="space-y-4">
            <div className="border border-border rounded-xl p-5">
              <p className="text-xs text-muted mb-1">Attendance</p>
              <p className="text-3xl font-semibold tracking-tight">{attendanceRate}%</p>
            </div>
            <div className="border border-border rounded-xl p-5">
              <p className="text-xs text-muted mb-1">Events attended</p>
              <p className="text-3xl font-semibold tracking-tight">{presentCount + lateCount}<span className="text-muted text-lg font-normal"> / {totalSessions}</span></p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:mt-14">
          <PlayerAttendanceCalendar history={history} />
        </div>
      </div>
    </main>
  );
}
