import React, { useState } from 'react';
import Calendar from './components/Calendar';
import NoteModal from './components/NoteModal';

interface Note {
  date: Date;
  content: string;
}

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleAddNote = (content: string) => {
    if (selectedDate) {
      setNotes([...notes, { date: selectedDate, content }]);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Calendar Notes App</h1>
      <Calendar onDateClick={handleDateClick} notes={notes} />
      {isModalOpen && selectedDate && (
        <NoteModal
          date={selectedDate}
          onClose={() => setIsModalOpen(false)}
          onAddNote={handleAddNote}
        />
      )}
    </div>
  );
};

export default App;