import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (noteContent.trim()) {
      onAddNote(noteContent);
      setNoteContent('');
    }
  };

  const handleNoteClick = (noteId: string) => {
    setActiveNoteId(activeNoteId === noteId ? null : noteId);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="bg-white p-6 rounded-lg w-full max-w-md shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Notes for {date.toDateString()}
          </h2>
          <div className="mb-6 max-h-48 overflow-y-auto">
            <AnimatePresence>
              {notes.length > 0 ? (
                notes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`bg-gray-100 p-3 mb-2 rounded-lg cursor-pointer transition-colors duration-200 ${activeNoteId === note.id ? 'bg-blue-100' : 'hover:bg-gray-200'
                      }`}
                    onClick={() => handleNoteClick(note.id)}
                  >
                    <p className="text-sm text-gray-800 break-words">
                      {activeNoteId === note.id ? note.content : note.content.slice(0, 50) + (note.content.length > 50 ? '...' : '')}
                    </p>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-600 italic">No notes for this date.</p>
              )}
            </AnimatePresence>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Enter your note here..."
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Add Note
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NoteModal;