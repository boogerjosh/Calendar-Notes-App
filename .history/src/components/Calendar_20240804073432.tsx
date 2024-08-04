import React from 'react';

interface CalendarProps {
  onDateClick: (date: Date) => void;
  notes: { date: Date; content: string }[];
}

const Calendar: React.FC<CalendarProps> = ({ onDateClick, notes }) => {
  const currentDate = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  const renderCalendarDays = () => {
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const hasNote = notes.some(note => note.date.toDateString() === date.toDateString());

      days.push(
        <div
          key={i}
          className={`p-2 border cursor-pointer ${hasNote ? 'bg-blue-100' : ''}`}
          onClick={() => onDateClick(date)}
        >
          <span className="font-bold">{i}</span>
          {hasNote && <div className="w-2 h-2 bg-blue-500 rounded-full ml-1"></div>}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {renderCalendarDays()}
    </div>
  );
};

export default Calendar;