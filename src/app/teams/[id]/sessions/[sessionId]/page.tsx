import { getSessionById, getTeamById, getPlayersByTeam, getAttendanceForSession } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, AlignLeft } from "lucide-react";
import { format } from "date-fns";
import { AttendanceList } from "@/components/AttendanceList";

export default async function SessionPage({ params }: { params: Promise<{ id: string, sessionId: string }> }) {
  const resolvedParams = await params;
  const session = await getSessionById(resolvedParams.sessionId);
  if (!session || session.team_id !== resolvedParams.id) notFound();

  const team = await getTeamById(session.team_id);
  const players = await getPlayersByTeam(session.team_id);
  const attendance = await getAttendanceForSession(session.id);

  if (!team) notFound();

  const comingCount = attendance.filter(a => a.status === "PRESENT" || a.status === "LATE").length;
  const notComingCount = players.length - comingCount;

  return (
    <main className="max-w-4xl mx-auto w-full px-6 py-10 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-10 md:gap-16 items-start">
        {/* Left Column */}
        <div>
          <Link 
            href={`/teams/${team.id}`} 
            className="text-sm text-muted hover:text-foreground mb-8 inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Team
          </Link>

          <div className="flex items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">{session.title}</h1>
            <Link 
              href={`/teams/${team.id}/sessions/${session.id}/edit`}
              className="text-xs text-muted border border-border px-3 py-1.5 rounded-lg hover:bg-secondary hover:text-foreground transition-colors"
            >
              Edit
            </Link>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-foreground">
              <Clock className="w-4 h-4 text-muted shrink-0" />
              <span>{format(new Date(session.date_time), "EEEE, MMM d · h:mm a")}</span>
            </div>
            {session.location && (
              <div className="flex items-center gap-3 text-foreground">
                <MapPin className="w-4 h-4 text-muted shrink-0" />
                <span>{session.location}</span>
              </div>
            )}
            {session.comment && (
              <div className="flex items-start gap-3 text-muted">
                <AlignLeft className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{session.comment}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Attendance */}
        <div className="md:mt-14">
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-secondary/50">
              <h2 className="text-sm font-medium">Attendance</h2>
              <div className="flex gap-2">
                <span className="text-xs font-medium text-success">{comingCount} in</span>
                <span className="text-xs text-muted">·</span>
                <span className="text-xs font-medium text-danger">{notComingCount} out</span>
              </div>
            </div>

            {players.length === 0 ? (
              <div className="text-center py-12 px-4">
                <p className="text-muted text-sm">No players on the team yet.</p>
                <Link href={`/teams/${team.id}`} className="text-foreground font-medium text-sm mt-2 inline-block hover:underline">
                  Add Players
                </Link>
              </div>
            ) : (
              <AttendanceList 
                sessionId={session.id} 
                players={players} 
                initialAttendance={attendance} 
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
