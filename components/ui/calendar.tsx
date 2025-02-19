// components/ui/calendar.tsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  markedDates?: Date[];
  className?: string;
}

export function Calendar({ selectedDate, onDateSelect, markedDates = [], className }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className={cn("p-4 bg-white rounded-lg shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="font-semibold text-primary-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <Button variant="outline" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-secondary-600 p-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isMarked = markedDates.some((marked) => isSameDay(marked, day));
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={cn(
                "p-2 text-sm rounded-md transition-colors",
                !isCurrentMonth && "text-secondary-300",
                isCurrentMonth && "text-secondary-900 hover:bg-primary-50",
                isSelected && "bg-primary-100 text-primary-900 font-semibold",
                isMarked && !isSelected && "bg-secondary-100"
              )}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}