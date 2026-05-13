import { getTeamById } from "@/lib/db";
import { notFound } from "next/navigation";
import { createSessionAction } from "@/app/actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";

export default async function NewSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const team = await getTeamById(resolvedParams.id);
  if (!team) notFound();

  const createWithTeam = createSessionAction.bind(null, team.id);
  
  const today = new Date();
  today.setHours(18, 0, 0, 0);
  const defaultDateTime = format(today, "yyyy-MM-dd'T'HH:mm");

  return (
    <main className="max-w-lg mx-auto w-full px-6 py-10 min-h-screen">
      <div className="mb-10">
        <Link 
          href={`/teams/${team.id}`} 
          className="text-sm text-muted hover:text-foreground mb-6 inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {team.name}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">New Session</h1>
      </div>

      <form action={createWithTeam} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="title">Title</label>
          <input 
            type="text" 
            id="title"
            name="title" 
            placeholder="e.g. Tuesday Practice" 
            required
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="date_time">Date & Time</label>
          <input 
            type="datetime-local" 
            id="date_time"
            name="date_time" 
            defaultValue={defaultDateTime}
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
            placeholder="Optional" 
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="comment">Notes</label>
          <textarea 
            id="comment"
            name="comment" 
            rows={3}
            placeholder="Optional" 
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none placeholder:text-muted"
          ></textarea>
        </div>

        <button 
          type="submit"
          className="w-full bg-primary text-primary-foreground rounded-lg px-4 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Create Session
        </button>
      </form>
    </main>
  );
}
