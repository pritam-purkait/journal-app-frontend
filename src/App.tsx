import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Calendar, TrendingUp, LogOut, User } from 'lucide-react';
import { JournalEntry, JournalFormData } from './types/journal';
import { JournalForm } from './components/JournalForm';
import { JournalList } from './components/JournalList';
import { SearchBar } from './components/SearchBar';
import { AuthForm } from './components/AuthForm';
import { AuthProvider, useAuth } from './hooks/useAuth.tsx';
import { apiService } from './services/api';

function JournalApp() {
  const { isAuthenticated, logout } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated) {
      loadEntries();
      loadGreeting();
    }
  }, [isAuthenticated]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAllEntries();
      if (Array.isArray(data)) {
        // Sort by date (newest first)
        const sortedEntries = data.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setEntries(sortedEntries);
      } else {
        setEntries([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load entries');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const loadGreeting = async () => {
    try {
      const greetingText = await apiService.getUserGreeting();
      setGreeting(greetingText);
    } catch (err) {
      console.error('Failed to load greeting:', err);
    }
  };

  const handleSubmit = async (formData: JournalFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      if (editingEntry) {
        // Update existing entry
        await apiService.updateEntry(editingEntry.id, formData);
        setEditingEntry(null);
      } else {
        // Create new entry
        await apiService.createEntry(formData);
      }
      
      setShowForm(false);
      await loadEntries(); // Reload entries
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        setLoading(true);
        setError(null);
        await apiService.deleteEntry(id);
        await loadEntries(); // Reload entries
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete entry');
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.sentiment && entry.sentiment.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalEntries = entries.length;
  const totalWords = entries.reduce((sum, entry) => {
    const wordCount = entry.content.trim().split(/\s+/).filter(word => word.length > 0).length;
    return sum + wordCount;
  }, 0);
  
  const thisMonth = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    const now = new Date();
    return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
  }).length;

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-600 rounded-2xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">DayScribe</h1>
                <p className="text-gray-600">Your personal space for thoughts and reflections</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowForm(true)}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:bg-gray-400 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5" />
                New Entry
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Greeting */}
          {greeting && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20">
              <pre className="text-gray-700 whitespace-pre-wrap font-sans">{greeting}</pre>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalEntries}</p>
                  <p className="text-sm text-gray-600">Total Entries</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalWords.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Words Written</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{thisMonth}</p>
                  <p className="text-sm text-gray-600">This Month</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        )}

        {/* Journal List */}
        {!loading && (
          <JournalList
            entries={filteredEntries}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Form Modal */}
        {showForm && (
          <JournalForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingEntry(null);
            }}
            initialData={editingEntry}
          />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <JournalApp />
    </AuthProvider>
  );
}

export default App;