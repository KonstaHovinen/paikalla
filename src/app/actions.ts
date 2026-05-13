"use server";

import { createTeam, createPlayer, createSession, updateAttendance, updateSession, deleteSession, deletePlayer } from "@/lib/db";
import { AttendanceStatus } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTeamAction(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) return;
  const team = await createTeam(name);
  revalidatePath("/");
  redirect(`/teams/${team.id}`);
}

export async function createPlayerAction(teamId: string, formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) return;
  await createPlayer(teamId, name);
  revalidatePath(`/teams/${teamId}`);
}

export async function deletePlayerAction(playerId: string, teamId: string) {
  await deletePlayer(playerId);
  revalidatePath(`/teams/${teamId}`);
  redirect(`/teams/${teamId}`);
}

export async function createSessionAction(teamId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const date_time = formData.get("date_time") as string;
  const location = formData.get("location") as string;
  const comment = formData.get("comment") as string;
  
  if (!title || !date_time) return;
  const session = await createSession(teamId, title, date_time, location, comment);
  revalidatePath(`/teams/${teamId}`);
  redirect(`/teams/${teamId}/sessions/${session.id}`);
}

export async function updateSessionAction(sessionId: string, teamId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const date_time = formData.get("date_time") as string;
  const location = formData.get("location") as string;
  const comment = formData.get("comment") as string;
  
  if (!title || !date_time) return;
  await updateSession(sessionId, title, date_time, location, comment);
  revalidatePath(`/teams/${teamId}`);
  revalidatePath(`/teams/${teamId}/sessions/${sessionId}`);
  redirect(`/teams/${teamId}/sessions/${sessionId}`);
}

export async function deleteSessionAction(sessionId: string, teamId: string) {
  await deleteSession(sessionId);
  revalidatePath(`/teams/${teamId}`);
  redirect(`/teams/${teamId}`);
}

export async function updateAttendanceAction(sessionId: string, playerId: string, status: AttendanceStatus, comment?: string) {
  await updateAttendance(sessionId, playerId, status, comment);
  revalidatePath(`/teams/any`); 
}

export async function playerSubmitAttendanceAction(teamId: string, sessionId: string, playerName: string, status: AttendanceStatus) {
  // Find or create player
  const { getPlayersByTeam } = await import("@/lib/db");
  const players = await getPlayersByTeam(teamId);
  let player = players.find(p => p.name.toLowerCase() === playerName.toLowerCase());
  
  if (!player) {
    player = await createPlayer(teamId, playerName);
  }

  // Update attendance
  await updateAttendance(sessionId, player.id, status);
  revalidatePath(`/invite/any`); // Revalidate any invite path
  
  return player.id;
}
