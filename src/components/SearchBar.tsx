import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search your journal..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-gray-900 transition-all duration-200"
      />
      {searchTerm && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};