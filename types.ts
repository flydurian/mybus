export interface Coordinates {
  lat: number;
  lon: number;
}

export type Arrival = {
  routeName: string;
  destination: string;
  timeMinutes: number;
  isLowFloor?: boolean; // 저상버스 여부
  nextArrival?: number; // 다음 도착 시간 (분)
  stationsBefore?: number; // N정거장 전
  direction?: 'up' | 'down'; // 상행/하행 방향
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
  upboundId?: string; // 상행 즐겨찾기 ID
  downboundId?: string; // 하행 즐겨찾기 ID
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