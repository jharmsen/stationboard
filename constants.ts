export const API_BASE_URL = 'https://transport.opendata.ch/v1';

export const REFRESH_INTERVAL_MS = 60000; // Refresh every minute

// Map categories to simple types for icon selection
export const TRANSPORT_TYPE_MAP: Record<string, 'train' | 'bus' | 'tram' | 'ship' | 'cable'> = {
  'T': 'tram',
  'B': 'bus',
  'BUS': 'bus',
  'BAT': 'ship',
  'SHIP': 'ship',
  'M': 'train', // Metro usually maps to train icon
  'IC': 'train',
  'IR': 'train',
  'RE': 'train',
  'S': 'train',
  'EC': 'train',
  'ICE': 'train',
  'RJ': 'train',
  'TGV': 'train',
  'FUN': 'cable', // Funicular
  'PB': 'cable', // Cable car
};
