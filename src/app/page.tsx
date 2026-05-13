import { getTeams } from "@/lib/db";
import { createTeamAction } from "./actions";
import Link from "next/link";
import { Plus, Users, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const teams = await getTeams();

  return (
    <main className="max-w-lg mx-auto w-full px-6 py-16 min-h-screen">
      <header className="mb-12">
        <h1 className="text-2xl font-semibold tracking-tight">Teams</h1>
        <p className="text-muted mt-1 text-sm">Select a team to manage attendance</p>
      </header>

      <div className="space-y-3">
        {teams.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-xl border border-dashed border-border">
            <Users className="mx-auto h-8 w-8 text-muted mb-4" />
            <p className="font-medium">No teams yet</p>
            <p className="text-muted text-sm mt-1">Create your first team to get started.</p>
          </div>
        ) : (
          teams.map((team) => (
            <Link 
              href={`/teams/${team.id}`} 
              key={team.id}
              className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-secondary transition-colors"
            >
              <div>
                <h2 className="font-medium">{team.name}</h2>
                <p className="text-sm text-muted mt-0.5">Manage team</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted" />
            </Link>
          ))
        )}
      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <p className="text-xs font-medium text-muted uppercase tracking-wider mb-4">Create New</p>
        <form action={createTeamAction} className="flex gap-3">
          <input 
            type="text" 
            name="name" 
            placeholder="Team name (e.g. U14 Boys)" 
            required
            className="flex-1 border border-border rounded-lg px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted"
          />
          <button 
            type="submit"
            className="bg-primary text-primary-foreground rounded-lg px-4 py-2.5 font-medium flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>
      </div>
    </main>
  );
}
