import { Search, MapPin, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface SearchBarProps {
  onSearch: (city: string) => void;
  onGeolocate: () => void;
  loading: boolean;
  searchHistory: string[];
}

export function SearchBar({ onSearch, onGeolocate, loading, searchHistory }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowHistory(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => searchHistory.length > 0 && setShowHistory(true)}
            placeholder="Search for a city..."
            className="w-full h-12 pl-12 pr-20 rounded-2xl bg-card/80 backdrop-blur-lg border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body text-sm"
            maxLength={100}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              className="absolute right-14 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={onGeolocate}
          disabled={loading}
          className="ml-2 h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
          title="Use my location"
        >
          <MapPin className="h-5 w-5" />
        </button>
      </form>

      {showHistory && searchHistory.length > 0 && (
        <div className="absolute top-full left-0 right-12 mt-2 bg-card rounded-xl border border-border shadow-lg overflow-hidden z-50 animate-fade-in">
          <div className="p-2">
            <p className="text-xs text-muted-foreground px-3 py-1 font-body">Recent searches</p>
            {searchHistory.map((city) => (
              <button
                key={city}
                onClick={() => { onSearch(city); setQuery(city); setShowHistory(false); }}
                className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors text-foreground font-body"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
