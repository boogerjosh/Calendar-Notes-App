import React, { useState } from 'react';

interface Note {
  id: string;
  date: Date;
  content: string;
}

interface NoteModalProps {
  date: Date;
  notes: Note[];
  onClose: () => void;
  onAddNote: (content: string) => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ date, notes, onClose, onAddNote }) => {
  const [noteContent, setNoteContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (noteContent.trim()) {
      onAddNote(noteContent);
      setNoteContent('');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-4 rounded-lg w-full max-w-md">
        <h2 className="text-lg md:text-xl font-bold mb-2">Notes for {date.toDateString()}</h2>
        <div className="mb-4 max-h-32 md:max-h-40 overflow-y-auto">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note.id} className="bg-gray-100 p-2 mb-2 rounded text-sm md:text-base">
                {note.content}
              </div>
            ))
          ) : (
            <p className="text-sm md:text-base">No notes for this date.</p>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full h-24 md:h-32 p-2 border rounded text-sm md:text-base"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Enter your note here..."
          ></textarea>
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              className="px-3 py-1 md:px-4 md:py-2 bg-gray-200 rounded mr-2 text-sm md:text-base"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="submit"
              className="px-3 py-1 md:px-4 md:py-2 bg-blue-500 text-white rounded text-sm md:text-base"
            >
              Add Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal; 