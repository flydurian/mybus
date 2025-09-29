export interface Coordinates {
  lat: number;
  lon: number;
}

export type Arrival = {
  routeName: string;
  destination: string;
  timeMinutes: number;
};

export type BusStop = {
  id: string;
  name:string;
  type: 'bus-stop';
  coordinates: Coordinates;
  distance: number;
  arrivals: Arrival[];
};

export type SubwayStation = {
  id: string;
  name: string;
  line: string;
  type: 'subway-station';
  coordinates: Coordinates;
  distance: number;
  upboundArrivals: Arrival[];
  downboundArrivals: Arrival[];
  exitNumber?: number; // 출구 번호
  color?: string; // 노선 색상
};

export type BusRoute = {
  id: string;
  name: string;
  type: 'bus-route';
  color: string;
  description: string;
}

export type SubwayLine = {
  id: string;
  name: string;
  type: 'subway-line';
  color: string;
  description: string;
}

export type FavoriteItem = {
  id: string;
  type: 'bus-stop' | 'subway-station' | 'bus-route' | 'subway-line';
  name: string;
  // This could be expanded with more details like line name for subways
  details?: string;
};

export type Tab = 'favorites' | 'nearby' | 'routes' | 'map';