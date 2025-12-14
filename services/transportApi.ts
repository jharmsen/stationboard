import { API_BASE_URL } from '../constants';
import { StationBoardResponse, LocationsResponse, LocationSuggestion } from '../types';

export const fetchStationBoard = async (stationName: string, limit: number = 15): Promise<StationBoardResponse> => {
  try {
    // Check if the input is a numeric ID (like 8576197)
    const isId = /^\d+$/.test(stationName);
    
    // Use 'id' param for IDs, 'station' param for text names
    const queryParam = isId 
      ? `id=${stationName}` 
      : `station=${encodeURIComponent(stationName)}`;

    const response = await fetch(`${API_BASE_URL}/stationboard?${queryParam}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`Service unavailable (${response.status})`);
    }

    const data = await response.json();
    
    // The API might return a 200 but with an empty station object if not found
    if (!data.station || !data.station.name) {
      throw new Error('Station not found');
    }

    return data as StationBoardResponse;
  } catch (error: any) {
    console.warn("Fetch error details:", error);
    
    // Handle network errors (e.g., offline, CORS, blocked by client)
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error('Network error: Unable to connect to transport service.');
    }
    
    throw error;
  }
};

export const fetchLocations = async (query: string): Promise<LocationSuggestion[]> => {
  try {
    if (!query || query.length < 2) return [];
    
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`${API_BASE_URL}/locations?query=${encodedQuery}&type=station`);

    if (!response.ok) {
      return [];
    }

    const data: LocationsResponse = await response.json();
    return data.stations || [];
  } catch (error) {
    // Silent fail for search suggestions
    return [];
  }
};
