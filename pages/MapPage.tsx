import React, { useState, useEffect, useRef } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { fetchNearbyStops } from '../services/transitApi';
import { BusStop, SubwayStation } from '../types';
import Loader from '../components/Loader';
import KakaoMap from '../components/KakaoMap';
import MapControls from '../components/MapControls';

declare global {
  interface Window {
    kakao: any;
  }
}

const MapPage: React.FC = () => {
  const { location, loading: locationLoading, error: locationError } = useGeolocation();
  const [stops, setStops] = useState<(BusStop | SubwayStation)[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (location) {
      fetchNearbyStops(location).then(setStops);
    }
  }, [location]);

  useEffect(() => {
    if (selectedLocation) {
      fetchNearbyStops({ lat: selectedLocation.lat, lon: selectedLocation.lng }).then(setStops);
    }
  }, [selectedLocation]);

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  const addStopMarkers = () => {
    if (!window.kakao || !mapRef.current) return;

    // 기존 마커 제거
    mapRef.current.clearMarkers();

    // 정류장 마커 추가
    stops.forEach(stop => {
      const title = stop.name;
      const content = stop.type === 'bus-stop' 
        ? `버스 정류장 (${stop.distance}m)` 
        : `${(stop as SubwayStation).line}호선 (${stop.distance}m)`;
      
      mapRef.current.addMarker(
        stop.coordinates.lat, 
        stop.coordinates.lon, 
        title, 
        content
      );
    });
  };

  useEffect(() => {
    if (stops.length > 0) {
      addStopMarkers();
    }
  }, [stops]);

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
    <div className="h-full w-full relative">
      <KakaoMap
        ref={mapRef}
        center={{ lat: location.lat, lng: location.lon }}
        zoom={15}
        onLocationSelect={handleLocationSelect}
      />
      <MapControls userLocation={location} />
    </div>
  );
};

export default MapPage;