import React, { useState } from 'react';
import { Save, X, Heart, Meh, Frown, Smile } from 'lucide-react';
import { JournalFormData, JournalEntry } from '../types/journal';

interface JournalFormProps {
  onSubmit: (data: JournalFormData) => void;
  onCancel: () => void;
  initialData?: JournalEntry | null;
}

const sentimentOptions = [
  { value: 'HAPPY', label: 'Happy', icon: Smile, color: 'text-yellow-500' },
  { value: 'SAD', label: 'Sad', icon: Frown, color: 'text-blue-500' },
  { value: 'ANGRY', label: 'Angry', icon: Heart, color: 'text-red-500' },
  { value: 'ANXIOUS', label: 'Anxious', icon: Meh, color: 'text-purple-500' },
] as const;

export const JournalForm: React.FC<JournalFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData 
}) => {
  const [formData, setFormData] = useState<JournalFormData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    sentiment: initialData?.sentiment || undefined
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.content.trim()) {
      onSubmit(formData);
    }
  };

  const wordCount = formData.content.trim().split(/\s+/).filter(word => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {initialData ? 'Edit Entry' : 'New Journal Entry'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What's on your mind?"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How are you feeling?
            </label>
            <div className="flex gap-2 flex-wrap">
              {sentimentOptions.map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    sentiment: prev.sentiment === value ? undefined : value 
                  }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
                    formData.sentiment === value
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${formData.sentiment === value ? 'text-emerald-600' : color}`} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your thoughts..."
              rows={12}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none"
              required
            />
            <div className="mt-2 text-sm text-gray-500 flex gap-4">
              <span>{wordCount} words</span>
              <span>{readingTime} min read</span>
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.title.trim() || !formData.content.trim()}
            className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" />
            {initialData ? 'Update' : 'Save'} Entry
          </button>
        </div>
      </div>
    </div>
  );
};