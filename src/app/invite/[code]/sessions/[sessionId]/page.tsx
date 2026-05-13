import { getTeamByInviteCode, getSessionById } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PlayerInviteForm } from "@/components/PlayerInviteForm";

export default async function PlayerSessionPage({ params }: { params: Promise<{ code: string, sessionId: string }> }) {
  const resolvedParams = await params;
  const team = await getTeamByInviteCode(resolvedParams.code);
  if (!team) notFound();

  const session = await getSessionById(resolvedParams.sessionId);
  if (!session || session.team_id !== team.id) notFound();

  return (
    <main className="max-w-md mx-auto w-full p-6 min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-sm space-y-6">
        <Link 
          href={`/invite/${team.invite_code}`}
          className="text-sm font-medium text-foreground/60 hover:text-foreground inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Schedule
        </Link>
        <PlayerInviteForm 
          teamId={team.id} 
          session={session} 
        />
      </div>
    </main>
  );
}
