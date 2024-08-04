import React, { useState } from 'react';
import Calendar from './components/Calendar';
import NoteModal from './components/NoteModal';

interface Note {
  id: string;
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
      const newNote: Note = {
        id: Date.now().toString(),
        date: selectedDate,
        content
      };
      setNotes([...notes, newNote]);
      setIsModalOpen(false);
    }
  };

  const getNotesForDate = (date: Date) => {
    return notes.filter(note => note.date.toDateString() === date.toDateString());
  };

  return (
    <div className="container mx-auto p-4 max-w-screen-lg">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">Calendar Notes App</h1>
      <Calendar onDateClick={handleDateClick} notes={notes} />
      {isModalOpen && selectedDate && (
        <NoteModal
          date={selectedDate}
          notes={getNotesForDate(selectedDate)}
          onClose={() => setIsModalOpen(false)}
          onAddNote={handleAddNote}
        />
      )}
    </div>
  );
};

export default App;