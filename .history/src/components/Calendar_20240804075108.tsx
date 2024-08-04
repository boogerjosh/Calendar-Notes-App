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
      days.push(<div key={`empty-${i}`} className="p-1 md:p-2 border"></div>);
    }

    // Add cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const notesForDate = notes.filter(note => note.date.toDateString() === date.toDateString());
      const noteCount = notesForDate.length;

      days.push(
        <div
          key={i}
          className={`p-1 md:p-2 border cursor-pointer hover:bg-gray-100 ${noteCount > 0 ? 'bg-blue-100' : ''}`}
          onClick={() => onDateClick(date)}
        >
          <span className="font-bold text-sm md:text-base">{i}</span>
          {noteCount > 0 && (
            <div className="w-4 h-4 md:w-5 md:h-5 bg-blue-500 rounded-full ml-1 inline-flex items-center justify-center text-white text-xs">
              {noteCount}
            </div>
          )}
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
      <div className="absolute top-full left-0 right-0 bg-white border shadow-lg rounded-lg p-2 grid grid-cols-1 gap-2">
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
        <button onClick={() => navigateMonth('prev')} className="px-2 py-1 md:px-4 md:py-2 bg-gray-200 rounded text-sm md:text-base">
          Previous
        </button>
        <div className="relative">
          <button
            onClick={handleMonthClick}
            className="text-lg md:text-xl font-bold px-2 py-1 md:px-4 md:py-2 bg-gray-200 rounded"
          >
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </button>
          {isMonthSelectorVisible && renderMonthSelector()}
        </div>
        <button onClick={() => navigateMonth('next')} className="px-2 py-1 md:px-4 md:py-2 bg-gray-200 rounded text-sm md:text-base">
          Next
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2 md:mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-bold text-center text-xs md:text-sm">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
    </div>
  );
};


export default Calendar;