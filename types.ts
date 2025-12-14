export interface Coordinate {
  type: string;
  x: number;
  y: number;
}

export interface Station {
  id: string;
  name: string;
  score: number | null;
  coordinate: Coordinate;
  distance: number | null;
}

export interface Stop {
  station: Station;
  arrival: string | null;
  arrivalTimestamp: number | null;
  departure: string | null;
  departureTimestamp: number | null;
  delay: number | null;
  platform: string;
  prognosis: {
    platform: string | null;
    arrival: string | null;
    departure: string | null;
    capacity1st: number | null;
    capacity2nd: number | null;
  };
}

export interface Departure {
  stop: Stop;
  name: string;
  category: string;
  subCategory: string; // e.g., "T", "B", "IC"
  categoryCode: number | null;
  number: string;
  operator: string;
  to: string;
  passList: Array<{
    station: { id: string; name: string };
    arrival: string | null;
    departure: string | null;
  }>;
  capacity1st: number | null;
  capacity2nd: number | null;
}

export interface StationBoardResponse {
  station: Station;
  stationboard: Departure[];
}

export interface LocationSuggestion {
  id: string;
  name: string;
  score: number;
  coordinate: Coordinate;
  distance: number | null;
}

export interface LocationsResponse {
  stations: LocationSuggestion[];
}
