import React, { useState } from 'react';

interface NoteModalProps {
  date: Date;
  onClose: () => void;
  onAddNote: (content: string) => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ date, onClose, onAddNote }) => {
  const [noteContent, setNoteContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddNote(noteContent);
    setNoteContent('');
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Add Note for {date.toDateString()}</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full h-32 p-2 border rounded"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Enter your note here..."
          ></textarea>
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
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