import React, { useState, useEffect, useRef } from 'react';
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
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);

    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript).join('');
        setNoteContent(prevContent => prevContent + ' ' + transcript);
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
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

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
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
            <div className="relative">
              <textarea
                className="w-full h-32 p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Enter your note here..."
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={toggleListening}
                className={`absolute right-2 bottom-2 p-2 rounded-full ${isListening ? 'bg-red-500' : 'bg-blue-500'
                  } text-white`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </motion.button>
            </div>
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