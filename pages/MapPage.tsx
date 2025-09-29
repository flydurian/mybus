import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { useGeolocation } from '../hooks/useGeolocation';
import { fetchNearbyStops } from '../services/transitApi';
import { BusStop, SubwayStation } from '../types';
import Loader from '../components/Loader';
import BusIcon from '../components/icons/BusIcon';
import SubwayIcon from '../components/icons/SubwayIcon';
import UserLocationIcon from '../components/icons/UserLocationIcon';
import MapControls from '../components/MapControls';

const createDivIcon = (component: React.ReactElement) => {
  return L.divIcon({
    html: ReactDOMServer.renderToString(component),
    className: 'leaflet-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const busIcon = createDivIcon(<div className="p-1 bg-white rounded-full shadow-lg"><BusIcon className="w-6 h-6 text-green-500" /></div>);
const subwayIcon = createDivIcon(<div className="p-1 bg-white rounded-full shadow-lg"><SubwayIcon className="w-6 h-6 text-orange-500" /></div>);
const userLocationIcon = createDivIcon(<UserLocationIcon className="w-8 h-8" />);


const MapPage: React.FC = () => {
  const { location, loading: locationLoading, error: locationError } = useGeolocation();
  const [stops, setStops] = useState<(BusStop | SubwayStation)[]>([]);

  useEffect(() => {
    if (location) {
      fetchNearbyStops(location).then(setStops);
    }
  }, [location]);

  if (locationLoading) {
    return <Loader />;
  }

  if (locationError) {
    return <p className="text-center text-red-500 p-4">오류: {locationError}. 위치 서비스를 활성화해주세요.</p>;
  }

  if (!location) {
    return <p className="text-center text-gray-500 dark:text-gray-400 p-4">위치를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="h-full w-full">
      <MapContainer 
        center={[location.lat, location.lon]} 
        zoom={15} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.lat, location.lon]} icon={userLocationIcon}>
          <Popup>현재 위치</Popup>
        </Marker>
        {stops.map(stop => (
          <Marker
            key={stop.id}
            position={[stop.coordinates.lat, stop.coordinates.lon]}
            icon={stop.type === 'bus-stop' ? busIcon : subwayIcon}
          >
            <Popup>
              <div className="font-bold">{stop.name}</div>
              <div className="text-sm text-gray-600">{stop.type === 'bus-stop' ? '버스 정류장' : `지하철역 (${(stop as SubwayStation).line}호선)`}</div>
            </Popup>
          </Marker>
        ))}
        <MapControls userLocation={location} />
      </MapContainer>
    </div>
  );
};

export default MapPage;