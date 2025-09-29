import React, { useState, useEffect } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { fetchNearbyStops } from '../services/transitApi';
import { BusStop, SubwayStation } from '../types';
import TransitStopItem from '../components/TransitStopItem';
import Loader from '../components/Loader';

const NearbyPage: React.FC = () => {
  const { location, loading: locationLoading, error: locationError } = useGeolocation();
  const [stops, setStops] = useState<(BusStop | SubwayStation)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location) {
      setLoading(true);
      fetchNearbyStops(location)
        .then(data => {
          setStops(data);
          setLoading(false);
        });
    } else {
        setLoading(locationLoading);
    }
  }, [location, locationLoading]);

  const renderContent = () => {
    if (loading) {
      return <Loader />;
    }

    if (locationError) {
      return <p className="text-center text-red-500 p-4">오류: {locationError}. 위치 서비스를 활성화해주세요.</p>;
    }
    
    if (stops.length === 0) {
        return <p className="text-center text-gray-500 dark:text-gray-400 p-4">주변 정류장/역을 찾을 수 없습니다.</p>;
    }

    return (
        <div className="animate-fade-in">
           {stops.map(stop => <TransitStopItem key={stop.id} item={stop} />)}
        </div>
    );
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold p-4 text-gray-900 dark:text-white">주변 정류장/역</h1>
      <div className="px-4 pb-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default NearbyPage;