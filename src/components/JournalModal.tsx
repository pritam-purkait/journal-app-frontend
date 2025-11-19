import React from 'react';
import { X, Edit, Trash2, Heart, Meh, Frown, Smile } from 'lucide-react';
import { JournalEntry as JournalEntryType } from '../types/journal';

interface JournalModalProps {
  entry: JournalEntryType;
  onClose: () => void;
  onEdit: (entry: JournalEntryType) => void;
  onDelete: (id: string) => void;
}

const moodIcons = {
  HAPPY: { icon: Smile, color: 'text-yellow-500' },
  SAD: { icon: Frown, color: 'text-blue-500' },
  ANGRY: { icon: Heart, color: 'text-red-500' },
  ANXIOUS: { icon: Meh, color: 'text-purple-500' },
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getWordCount = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const getReadingTime = (text: string): number => {
  const wordsPerMinute = 200;
  const wordCount = getWordCount(text);
  return Math.ceil(wordCount / wordsPerMinute);
};

export const JournalModal: React.FC<JournalModalProps> = ({ entry, onClose, onEdit, onDelete }) => {
  const wordCount = getWordCount(entry.content);
  const readingTime = getReadingTime(entry.content);
  const MoodIcon = entry.sentiment ? moodIcons[entry.sentiment].icon : null;
  const moodColor = entry.sentiment ? moodIcons[entry.sentiment].color : '';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{entry.title}</h2>
              {MoodIcon && <MoodIcon className={`h-6 w-6 ${moodColor}`} />}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span>{formatDate(entry.date)}</span>
              <span>•</span>
              <span>{formatTime(entry.date)}</span>
              <span>•</span>
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{readingTime} min read</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onEdit(entry)} className="p-2 text-gray-400 dark:text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-full transition-all">
              <Edit className="h-5 w-5" />
            </button>
            <button onClick={() => onDelete(entry.id)} className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all">
              <Trash2 className="h-5 w-5" />
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
          {entry.sentiment && (
            <div className="mt-6">
              <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full text-sm">
                {entry.sentiment.toLowerCase()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
