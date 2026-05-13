import { getTeamById, getSessionById } from "@/lib/db";
import { notFound } from "next/navigation";
import { updateSessionAction } from "@/app/actions";
import { DeleteSessionButton } from "@/components/DeleteSessionButton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";

export default async function EditSessionPage({ 
  params 
}: { 
  params: Promise<{ id: string, sessionId: string }> 
}) {
  const resolvedParams = await params;
  const team = await getTeamById(resolvedParams.id);
  const session = await getSessionById(resolvedParams.sessionId);
  
  if (!team || !session || session.team_id !== team.id) notFound();

  const updateWithIds = updateSessionAction.bind(null, session.id, team.id);
  
  const formattedDateTime = format(new Date(session.date_time), "yyyy-MM-dd'T'HH:mm");

  return (
    <main className="max-w-lg mx-auto w-full px-6 py-10 min-h-screen">
      <div className="flex items-start justify-between mb-10">
        <div>
          <Link 
            href={`/teams/${team.id}/sessions/${session.id}`} 
            className="text-sm text-muted hover:text-foreground mb-6 inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Session
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Edit Session</h1>
        </div>

        <DeleteSessionButton sessionId={session.id} teamId={team.id} />
      </div>

      <form action={updateWithIds} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="title">Title</label>
          <input 
            type="text" 
            id="title"
            name="title" 
            defaultValue={session.title}
            required
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="date_time">Date & Time</label>
          <input 
            type="datetime-local" 
            id="date_time"
            name="date_time" 
            defaultValue={formattedDateTime}
            required
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="location">Location</label>
          <input 
            type="text" 
            id="location"
            name="location" 
            defaultValue={session.location || ""}
            placeholder="Optional"
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="comment">Notes</label>
          <textarea 
            id="comment"
            name="comment" 
            defaultValue={session.comment || ""}
            rows={3}
            placeholder="Optional"
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none placeholder:text-muted"
          ></textarea>
        </div>

        <button 
          type="submit"
          className="w-full bg-primary text-primary-foreground rounded-lg px-4 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}
