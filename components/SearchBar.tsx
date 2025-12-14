import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { LocationSuggestion } from '../types';
import { fetchLocations } from '../services/transportApi';

interface SearchBarProps {
  onStationSelect: (stationName: string) => void;
  isLoading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onStationSelect, isLoading = false }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setIsSearching(true);
        const results = await fetchLocations(query);
        setSuggestions(results.slice(0, 5));
        setIsSearching(false);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (name: string) => {
    setQuery(name);
    setShowSuggestions(false);
    onStationSelect(name);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className="relative w-full z-50">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
          )}
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-10 py-3 bg-slate-800/50 border border-slate-700/50 backdrop-blur-md rounded-2xl leading-5 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-slate-800 transition-all shadow-inner"
          placeholder="Search station (e.g., Zurich HB)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
          }}
          onKeyDown={(e) => {
              if(e.key === 'Enter') {
                  onStationSelect(query);
                  setShowSuggestions(false);
              }
          }}
        />
        {query && (
            <button 
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
            >
                <X className="h-4 w-4" />
            </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute mt-2 w-full bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="max-h-60 overflow-auto py-1 custom-scrollbar">
            {suggestions.map((station) => (
              <li key={station.id}>
                <button
                  onClick={() => handleSelect(station.name)}
                  className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center space-x-3 transition-colors group"
                >
                  <MapPin className="h-4 w-4 text-slate-500 group-hover:text-indigo-400" />
                  <div>
                    <span className="block text-sm font-medium text-slate-200 group-hover:text-white">
                      {station.name}
                    </span>
                    {/* Shows canton or type if available, simple for now */}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
