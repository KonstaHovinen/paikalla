import { supabase } from "./supabase";
import { Team, Player, PracticeSession, Attendance, AttendanceWithSession } from "./types";

export async function getTeams(): Promise<Team[]> {
  const { data, error } = await supabase.from("teams").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function getTeamById(id: string): Promise<Team | null> {
  const { data, error } = await supabase.from("teams").select("*").eq("id", id).single();
  if (error && error.code !== "PGRST116") throw new Error(error.message);
  return data;
}

export async function getTeamByInviteCode(code: string): Promise<Team | null> {
  const { data, error } = await supabase.from("teams").select("*").eq("invite_code", code).single();
  if (error && error.code !== "PGRST116") throw new Error(error.message);
  return data;
}

export async function createTeam(name: string): Promise<Team> {
  const inviteCode = Math.random().toString(36).substring(2, 10);
  const { data, error } = await supabase.from("teams").insert([{ name, invite_code: inviteCode }]).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getPlayersByTeam(teamId: string): Promise<Player[]> {
  const { data, error } = await supabase.from("players").select("*").eq("team_id", teamId).order("name");
  if (error) throw new Error(error.message);
  return data;
}

export async function createPlayer(teamId: string, name: string): Promise<Player> {
  const { data, error } = await supabase.from("players").insert([{ team_id: teamId, name }]).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getSessionsByTeam(teamId: string): Promise<PracticeSession[]> {
  const { data, error } = await supabase.from("practice_sessions").select("*").eq("team_id", teamId).order("date_time", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function getSessionById(sessionId: string): Promise<PracticeSession | null> {
  const { data, error } = await supabase.from("practice_sessions").select("*").eq("id", sessionId).single();
  if (error && error.code !== "PGRST116") throw new Error(error.message);
  return data;
}

export async function createSession(teamId: string, title: string, date_time: string, location?: string, comment?: string): Promise<PracticeSession> {
  const { data, error } = await supabase.from("practice_sessions").insert([{ team_id: teamId, title, date_time, location, comment }]).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getAttendanceForSession(sessionId: string): Promise<Attendance[]> {
  const { data, error } = await supabase.from("attendance").select("*").eq("session_id", sessionId);
  if (error) throw new Error(error.message);
  return data;
}

export async function updateAttendance(sessionId: string, playerId: string, status: Attendance["status"], comment?: string): Promise<Attendance> {
  // Try to find if exists
  const { data: existing } = await supabase.from("attendance").select("*").eq("session_id", sessionId).eq("player_id", playerId).single();

  if (existing) {
    const { data, error } = await supabase
      .from("attendance")
      .update({ status, comment: comment !== undefined ? comment : existing.comment, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  } else {
    const { data, error } = await supabase
      .from("attendance")
      .insert([{ session_id: sessionId, player_id: playerId, status, comment }])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
}

export async function getPlayerById(playerId: string): Promise<Player | null> {
  const { data, error } = await supabase.from("players").select("*").eq("id", playerId).single();
  if (error && error.code !== "PGRST116") throw new Error(error.message);
  return data;
}

export async function getPlayerAttendanceHistory(playerId: string): Promise<AttendanceWithSession[]> {
  const { data, error } = await supabase
    .from("attendance")
    .select("*, practice_sessions(*)")
    .eq("player_id", playerId);
  
  if (error) throw new Error(error.message);
  
  // Sort descending by session date_time
  return (data as unknown as AttendanceWithSession[]).sort((a, b) => {
    return new Date(b.practice_sessions.date_time).getTime() - new Date(a.practice_sessions.date_time).getTime();
  });
}

export async function updateSession(
  id: string,
  title: string,
  date_time: string,
  location?: string,
  comment?: string
): Promise<PracticeSession> {
  const { data, error } = await supabase
    .from("practice_sessions")
    .update({ title, date_time, location, comment })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSession(id: string): Promise<void> {
  const { error } = await supabase.from("practice_sessions").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deletePlayer(id: string): Promise<void> {
  const { error } = await supabase.from("players").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
