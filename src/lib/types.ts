export type Team = {
  id: string;
  name: string;
  invite_code: string;
  created_at: string;
};

export type Player = {
  id: string;
  team_id: string;
  name: string;
  created_at: string;
};

export type PracticeSession = {
  id: string;
  team_id: string;
  title: string;
  date_time: string;
  location?: string | null;
  comment?: string;
};

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

export type Attendance = {
  id: string;
  session_id: string;
  player_id: string;
  status: AttendanceStatus;
  comment?: string;
  updated_at?: string;
};

export type AttendanceWithSession = Attendance & {
  practice_sessions: PracticeSession;
};

// V1 Custom fields could just be unstructured JSON or we add them later as requested.
// The user mentioned custom fields but to keep V1 extremely focused and simple,
// I'll leave space for them but not overengineer them.
