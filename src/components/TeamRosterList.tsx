"use client";

import { Player } from "@/lib/types";
import { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";

type TeamRosterListProps = {
  teamId: string;
  players: Player[];
};

export function TeamRosterList({ teamId, players }: TeamRosterListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="px-4 py-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-border rounded-lg pl-9 pr-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted"
          />
        </div>
      </div>

      {filteredPlayers.length === 0 ? (
        <div className="text-center py-10 px-4">
          <p className="text-muted text-sm">
            {searchQuery ? "No players match your search" : "No players added yet"}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {filteredPlayers.map((player) => (
            <li key={player.id}>
              <Link
                href={`/teams/${teamId}/players/${player.id}`}
                className="px-5 py-3.5 flex items-center justify-between hover:bg-secondary/50 transition-colors"
              >
                <span className="text-sm font-medium">{player.name}</span>
                <ChevronRight className="w-4 h-4 text-muted" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
