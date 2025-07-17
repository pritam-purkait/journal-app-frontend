import React from 'react';
import { Edit, Trash2, Heart, Meh, Frown, Smile } from 'lucide-react';
import { JournalEntry as JournalEntryType } from '../types/journal';

interface JournalEntryProps {
  entry: JournalEntryType;
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

export const JournalEntry: React.FC<JournalEntryProps> = ({ 
  entry, 
  onEdit, 
  onDelete 
}) => {
  const wordCount = getWordCount(entry.content);
  const readingTime = getReadingTime(entry.content);
  const MoodIcon = entry.sentiment ? moodIcons[entry.sentiment].icon : null;
  const moodColor = entry.sentiment ? moodIcons[entry.sentiment].color : '';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
              {entry.title}
            </h3>
            {MoodIcon && (
              <MoodIcon className={`h-5 w-5 ${moodColor}`} />
            )}
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-2">
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
          <button
            onClick={() => onEdit(entry)}
            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all duration-200"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed line-clamp-3">
          {entry.content}
        </p>
      </div>

      {entry.sentiment && (
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm">
            {entry.sentiment.toLowerCase()}
          </span>
        </div>
      )}
    </div>
  );
};