import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw, MapPin, AlertCircle, Clock } from 'lucide-react';
import { fetchStationBoard } from '../services/transportApi';
import { StationBoardResponse } from '../types';
import { REFRESH_INTERVAL_MS } from '../constants';
import DepartureRow from './DepartureRow';

const StationBoard: React.FC = () => {
  // Hardwired to the requested station ID (8576197)
  const [stationName] = useState<string>('8576197');
  const [data, setData] = useState<StationBoardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadData = useCallback(async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchStationBoard(name);
      setData(result);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData(stationName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Auto-refresh interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (stationName && !loading && !error && navigator.onLine) {
        // Silent refresh
        fetchStationBoard(stationName)
            .then(result => {
                setData(result);
                setLastUpdated(new Date());
            })
            .catch(err => {
                console.warn("Background refresh failed:", err);
            });
      }
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [stationName, loading, error]);

  const handleRefresh = () => {
    loadData(stationName);
  };

  return (
    <div className="w-full max-w-md mx-auto h-full max-h-screen flex flex-col relative">
      {/* Decorative background glow inside the widget container */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/20 blur-[60px] rounded-full pointer-events-none"></div>

      {/* Main Card */}
      <div className="flex-1 flex flex-col bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden m-4 md:m-6">
        
        {/* Header Section */}
        <div className="p-5 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
          
          {data && data.station ? (
            <div className="flex justify-between items-end">
              <div>
                <div className="flex items-center text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  Station
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {data.station.name}
                </h1>
              </div>
              <div className="text-right">
                <button 
                  onClick={handleRefresh} 
                  className={`text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5 ${loading ? 'animate-spin' : ''}`}
                  title="Refresh"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
             /* Fallback header if data isn't loaded yet */
             <div className="flex justify-between items-center h-[52px]">
                <div className="h-6 w-32 bg-slate-700/50 rounded animate-pulse"></div>
             </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 relative">
          
          {/* Loading State (if no data yet) */}
          {loading && !data && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                <span className="text-slate-400 text-sm">Fetching departures...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <div className="bg-red-500/10 p-4 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Oops!</h3>
              <p className="text-slate-400 text-sm max-w-xs">{error}</p>
              <button 
                onClick={() => loadData(stationName)}
                className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && data && data.stationboard.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Clock className="w-12 h-12 text-slate-600 mb-4" />
                <p className="text-slate-400">No departures found soon.</p>
            </div>
          )}

          {/* List Data */}
          {data && data.stationboard.length > 0 && (
            <div className="space-y-1">
              {data.stationboard.map((departure, idx) => (
                <DepartureRow 
                  key={`${departure.stop.departure}-${departure.number}-${idx}`} 
                  departure={departure} 
                />
              ))}
              
              <div className="pt-4 text-center">
                <p className="text-xs text-slate-600">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StationBoard;
