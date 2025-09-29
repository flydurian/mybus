import { Coordinates, BusStop, SubwayStation, Arrival, BusRoute, SubwayLine } from '../types';

const MOCK_BUS_STOPS = [
  { id: 'bs_1', name: '강남역 5번 출구', coords: { lat: 37.4979, lon: 127.0276 } },
  { id: 'bs_2', name: '신논현역', coords: { lat: 37.5049, lon: 127.0259 } },
  { id: 'bs_3', name: '잠실역 1번 출구', coords: { lat: 37.5133, lon: 127.1001 } },
  { id: 'bs_4', name: '홍대입구역', coords: { lat: 37.557, lon: 126.924 } },
];

const MOCK_SUBWAY_STATIONS = [
  { id: 'ss_1', name: '강남', line: '2', coords: { lat: 37.4981, lon: 127.0278 } },
  { id: 'ss_2', name: '삼성', line: '2', coords: { lat: 37.5088, lon: 127.0631 } },
  { id: 'ss_3', name: '시청', line: '1', coords: { lat: 37.5658, lon: 126.9780 } },
];

const MOCK_BUS_ROUTES: BusRoute[] = [
  {id: 'br_470', name: '470', type: 'bus-route', color: '#0054A6', description: '상암 ↔ 강남'},
  {id: 'br_2224', name: '2224', type: 'bus-route', color: '#5CB949', description: '성수 ↔ 건대입구'},
  {id: 'br_9401', name: '9401', type: 'bus-route', color: '#E60012', description: '구미 ↔ 서울역'},
  {id: 'br_02', name: '02', type: 'bus-route', color: '#F2C100', description: '남산 순환'},
];

const MOCK_SUBWAY_LINES: SubwayLine[] = [
    { id: 'sl_2', name: '2호선', type: 'subway-line', color: '#00A84D', description: '시청 ↔ 시청 (순환)' },
    { id: 'sl_9', name: '9호선', type: 'subway-line', color: '#BDB092', description: '개화 ↔ 중앙보훈병원' },
    { id: 'sl_bundang', name: '수인분당선', type: 'subway-line', color: '#FABE00', description: '왕십리 ↔ 인천' },
]


const getRandomTime = () => Math.floor(Math.random() * 15) + 1;
const BUS_NAMES = ['470', '140', '360', '740', '9401'];
const SUBWAY_DESTINATIONS = ['잠실행', '시청행', '왕십리행', '사당행'];

// Simplified distance calculation
const calculateDistance = (coords1: Coordinates, coords2: Coordinates) => {
  const dx = coords1.lat - coords2.lat;
  const dy = coords1.lon - coords2.lon;
  return Math.sqrt(dx * dx + dy * dy) * 111000; // rough meters conversion
};

const generateBusArrivals = (): Arrival[] => {
  const count = Math.floor(Math.random() * 3) + 1;
  return Array.from({ length: count }, () => ({
    routeName: BUS_NAMES[Math.floor(Math.random() * BUS_NAMES.length)],
    destination: '회차지',
    timeMinutes: getRandomTime(),
  }));
};

const generateSubwayArrivals = (): Arrival[] => {
    const count = Math.floor(Math.random() * 2) + 1;
    return Array.from({ length: count }, () => ({
      routeName: SUBWAY_DESTINATIONS[Math.floor(Math.random() * SUBWAY_DESTINATIONS.length)],
      destination: SUBWAY_DESTINATIONS[Math.floor(Math.random() * SUBWAY_DESTINATIONS.length)],
      timeMinutes: getRandomTime(),
    }));
  };
  

export const fetchNearbyStops = (location: Coordinates): Promise<(BusStop | SubwayStation)[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const busStops: BusStop[] = MOCK_BUS_STOPS.map(stop => ({
        ...stop,
        type: 'bus-stop',
        coordinates: stop.coords,
        distance: calculateDistance(location, stop.coords),
        arrivals: generateBusArrivals(),
      }));

      const subwayStations: SubwayStation[] = MOCK_SUBWAY_STATIONS.map(station => ({
        ...station,
        type: 'subway-station',
        coordinates: station.coords,
        distance: calculateDistance(location, station.coords),
        upboundArrivals: generateSubwayArrivals(),
        downboundArrivals: generateSubwayArrivals(),
      }));

      const allStops = [...busStops, ...subwayStations];
      allStops.sort((a, b) => a.distance - b.distance);
      resolve(allStops.slice(0, 5)); // Return top 5 closest
    }, 1000);
  });
};

export const fetchFavoriteDetails = (ids: string[]): Promise<(BusStop | SubwayStation | BusRoute | SubwayLine)[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const results: (BusStop | SubwayStation | BusRoute | SubwayLine)[] = [];
            ids.forEach(id => {
                if (id.startsWith('bs_')) {
                    const stop = MOCK_BUS_STOPS.find(s => s.id === id);
                    if (stop) {
                        results.push({
                            ...stop,
                            type: 'bus-stop',
                            coordinates: stop.coords,
                            distance: 0, // Not relevant for favorites view
                            arrivals: generateBusArrivals(),
                        });
                    }
                } else if (id.startsWith('ss_')) {
                    const station = MOCK_SUBWAY_STATIONS.find(s => s.id === id);
                    if (station) {
                        results.push({
                            ...station,
                            type: 'subway-station',
                            coordinates: station.coords,
                            distance: 0,
                            upboundArrivals: generateSubwayArrivals(),
                            downboundArrivals: generateSubwayArrivals(),
                        });
                    }
                } else if (id.startsWith('br_')) {
                    const route = MOCK_BUS_ROUTES.find(r => r.id === id);
                    if(route) {
                        results.push({ ...route, type: 'bus-route'});
                    }
                } else if (id.startsWith('sl_')) {
                    const line = MOCK_SUBWAY_LINES.find(l => l.id === id);
                    if(line) {
                        results.push({ ...line, type: 'subway-line' });
                    }
                }
            });
            resolve(results);
        }, 800);
    });
};

export const fetchAllRoutes = (): Promise<{ buses: BusRoute[], subways: SubwayLine[] }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                buses: MOCK_BUS_ROUTES,
                subways: MOCK_SUBWAY_LINES,
            });
        }, 500);
    });
};

export const searchTransit = (query: string): Promise<(BusStop | SubwayStation | BusRoute | SubwayLine)[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (!query) {
                resolve([]);
                return;
            }
            const lowerCaseQuery = query.toLowerCase();
            const results: (BusStop | SubwayStation | BusRoute | SubwayLine)[] = [];

            // Search bus stops
            MOCK_BUS_STOPS.forEach(stop => {
                if (stop.name.toLowerCase().includes(lowerCaseQuery)) {
                    results.push({
                        id: stop.id,
                        name: stop.name,
                        type: 'bus-stop',
                        coordinates: stop.coords,
                        distance: 0,
                        arrivals: [],
                    });
                }
            });

            // Search subway stations
            MOCK_SUBWAY_STATIONS.forEach(station => {
                if (station.name.toLowerCase().includes(lowerCaseQuery) || station.line.includes(lowerCaseQuery)) {
                    results.push({
                        id: station.id,
                        name: station.name,
                        line: station.line,
                        type: 'subway-station',
                        coordinates: station.coords,
                        distance: 0,
                        upboundArrivals: [],
                        downboundArrivals: [],
                    });
                }
            });

            // Search bus routes
            MOCK_BUS_ROUTES.forEach(route => {
                if (route.name.toLowerCase().includes(lowerCaseQuery)) {
                    results.push(route);
                }
            });

            // Search subway lines
            MOCK_SUBWAY_LINES.forEach(line => {
                if (line.name.toLowerCase().includes(lowerCaseQuery)) {
                    results.push(line);
                }
            });

            resolve(results);
        }, 300);
    });
};