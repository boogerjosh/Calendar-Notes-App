import React, { useState } from 'react';

interface CalendarProps {
  onDateClick: (date: Date) => void;
  notes: { date: Date; content: string }[];
}

const Calendar: React.FC<CalendarProps> = ({ onDateClick, notes }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMonthSelectorVisible, setIsMonthSelectorVisible] = useState(false);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border"></div>);
    }

    // Add cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const hasNote = notes.some(note => note.date.toDateString() === date.toDateString());

      days.push(
        <div
          key={i}
          className={`p-2 border cursor-pointer hover:bg-gray-100 ${hasNote ? 'bg-blue-100' : ''}`}
          onClick={() => onDateClick(date)}
        >
          <span className="font-bold">{i}</span>
          {hasNote && <div className="w-2 h-2 bg-blue-500 rounded-full ml-1 inline-block"></div>}
        </div>
      );
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setMonth(prevDate.getMonth() - 1);
      } else {
        newDate.setMonth(prevDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleMonthClick = () => {
    setIsMonthSelectorVisible(!isMonthSelectorVisible);
  };

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    setIsMonthSelectorVisible(false);
  };

  const renderMonthSelector = () => {
    return (
      <div className="absolute top-full left-0 bg-white border shadow-lg rounded-lg p-2 grid grid-cols-1 gap-2">
        {monthNames.map((month, index) => (
          <button
            key={month}
            onClick={() => handleMonthSelect(index)}
            className="px-2 py-1 text-sm hover:bg-gray-100 rounded"
          >
            {month}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigateMonth('prev')} className="px-4 py-2 bg-gray-200 rounded">
          Previous
        </button>
        <div className="relative">
          <button
            onClick={handleMonthClick}
            className="text-xl font-bold px-4 py-2 bg-gray-200 rounded"
          >
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </button>
          {isMonthSelectorVisible && renderMonthSelector()}
        </div>
        <button onClick={() => navigateMonth('next')} className="px-4 py-2 bg-gray-200 rounded">
          Next
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-bold text-center">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default Calendar;