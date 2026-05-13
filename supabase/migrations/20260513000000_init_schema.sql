-- Supabase Database Schema for Paikalla (MVP)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TEAMS
CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    invite_code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PLAYERS
CREATE TABLE public.players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PRACTICE SESSIONS
CREATE TABLE public.practice_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ATTENDANCE STATUS ENUM
CREATE TYPE attendance_status AS ENUM ('PRESENT', 'ABSENT', 'LATE');

-- ATTENDANCE
CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.practice_sessions(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    status attendance_status NOT NULL DEFAULT 'ABSENT',
    comment TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, player_id)
);

-- ROW LEVEL SECURITY (RLS) policies
-- For MVP, if there is no auth, you might want to enable anonymous access
-- BUT for a real app, you would tie teams to an authenticated user id.

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Allow read/write to all for local development/MVP (Update for production!)
CREATE POLICY "Enable all access for mvp on teams" ON public.teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for mvp on players" ON public.players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for mvp on practice_sessions" ON public.practice_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for mvp on attendance" ON public.attendance FOR ALL USING (true) WITH CHECK (true);
