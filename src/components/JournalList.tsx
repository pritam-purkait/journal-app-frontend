import React from 'react';
import { JournalEntry } from './JournalEntry';
import { JournalEntry as JournalEntryType } from '../types/journal';

interface JournalListProps {
  entries: JournalEntryType[];
  onEdit: (entry: JournalEntryType) => void;
  onDelete: (id: string) => void;
}

export const JournalList: React.FC<JournalListProps> = ({ 
  entries, 
  onEdit, 
  onDelete 
}) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No journal entries yet</div>
        <p className="text-gray-500">Start writing your first entry to begin your journey!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {entries.map(entry => (
        <JournalEntry
          key={entry.id}
          entry={entry}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};