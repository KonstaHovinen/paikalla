"use client";

import { AttendanceWithSession } from "@/lib/types";
import { useState } from "react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from "date-fns";
import { ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

type PlayerAttendanceCalendarProps = {
  history: AttendanceWithSession[];
};

export function PlayerAttendanceCalendar({ history }: PlayerAttendanceCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getAttendanceForDay = (day: Date) => {
    return history.filter((h) => isSameDay(new Date(h.practice_sessions.date_time), day));
  };

  const selectedDayAttendance = selectedDate ? getAttendanceForDay(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div className="border border-border rounded-xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-medium">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <div className="flex gap-1">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg border border-border hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg border border-border hover:bg-secondary transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 mb-3">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-center text-xs text-muted font-medium py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarDays.map((day, idx) => {
            const dayAttendance = getAttendanceForDay(day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            
            let statusColor = "";
            if (dayAttendance.length > 0) {
              const status = dayAttendance[0].status;
              if (status === "PRESENT") statusColor = "bg-success/15 text-success";
              else if (status === "LATE") statusColor = "bg-warning/15 text-warning";
              else if (status === "ABSENT") statusColor = "bg-danger/15 text-danger";
            }

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "aspect-square rounded-lg flex items-center justify-center text-xs transition-all relative",
                  !isCurrentMonth && "opacity-20",
                  isCurrentMonth && !statusColor && "text-muted hover:bg-secondary",
                  statusColor,
                  isToday(day) && "ring-1 ring-foreground/20",
                  isSelected && "ring-2 ring-primary"
                )}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedDate && selectedDayAttendance.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted px-1">
            {format(selectedDate, "EEEE, MMM d, yyyy")}
          </p>
          {selectedDayAttendance.map((record) => (
            <div 
              key={record.id} 
              className="border border-border rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{record.practice_sessions.title}</span>
                <span className={cn(
                  "text-xs font-medium",
                  record.status === "PRESENT" && "text-success",
                  record.status === "ABSENT" && "text-danger",
                  record.status === "LATE" && "text-warning",
                )}>
                  {record.status.toLowerCase()}
                </span>
              </div>
              {record.comment && (
                <div className="flex items-start gap-2 mt-2 text-muted">
                  <MessageSquare className="w-3 h-3 mt-0.5 shrink-0" />
                  <p className="text-xs italic">{record.comment}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
