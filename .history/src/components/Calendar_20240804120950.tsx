import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Note {
  id: string;
  date: Date;
  content: string;
}

interface CalendarProps {
  onDateClick: (date: Date) => void;
  notes: Note[];
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
      days.push(<div key={`empty-${i}`} className="p-1 md:p-2"></div>);
    }

    // Add cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const notesForDate = notes.filter(note => note.date.toDateString() === date.toDateString());
      const noteCount = notesForDate.length;
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={i}
          className={`p-1 md:p-2 rounded-lg cursor-pointer ${isToday ? 'bg-blue-500 text-white' : noteCount > 0 ? 'bg-blue-100' : 'bg-white hover:bg-gray-100'
            } transition-colors duration-200 shadow`}
          onClick={() => onDateClick(date)}
        >
          <span className={`font-bold text-sm md:text-base ${isToday ? 'text-white' : ''}`}>{i}</span>
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

  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setMonth(prevDate.getMonth() - 1);
      } else {
        newDate.setMonth(prevDate.getMonth() + 1);
      }
      return newDate;
    });
  }, []);

  const handleMonthClick = useCallback(() => {
    setIsMonthSelectorVisible(!isMonthSelectorVisible);
  }, [isMonthSelectorVisible]);

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    setIsMonthSelectorVisible(false);
  };

  const renderMonthSelector = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-full left-0 right-0 bg-white border shadow-lg rounded-lg p-2 grid grid-cols-1 gap-2 z-10"
      >
        {monthNames.map((month, index) => (
          <motion.button
            key={month}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMonthSelect(index)}
            className="px-2 py-1 text-sm hover:bg-blue-100 rounded transition-colors duration-200"
          >
            {month}
          </motion.button>
        ))}
      </motion.div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigateMonth('prev')}
          className="px-2 py-1 md:px-4 md:py-2 bg-blue-500 text-white rounded-lg text-sm md:text-base hover:bg-blue-600 transition-colors duration-200"
        >
          Previous
        </motion.button>
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMonthClick}
            className="text-lg md:text-xl font-bold px-2 py-1 md:px-4 md:py-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors duration-200"
          >
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </motion.button>
          <AnimatePresence>
            {isMonthSelectorVisible && renderMonthSelector()}
          </AnimatePresence>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigateMonth('next')}
          className="px-2 py-1 md:px-4 md:py-2 bg-blue-500 text-white rounded-lg text-sm md:text-base hover:bg-blue-600 transition-colors duration-200"
        >
          Next
        </motion.button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2 md:mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-bold text-center text-xs md:text-sm text-gray-600">{day}</div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="grid grid-cols-7 gap-2"
      >
        {renderCalendarDays()}
      </motion.div>
    </div>
  );
};

export default Calendar;