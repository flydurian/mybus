
import { useState, useEffect } from 'react';
import { Coordinates } from '../types';

interface GeolocationState {
  location: Coordinates | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = (): GeolocationState => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        location: null,
        loading: false,
        error: '브라우저에서 위치 정보 기능을 지원하지 않습니다.',
      });
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setState({
        location: {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        },
        loading: false,
        error: null,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      setState({
        location: null,
        loading: false,
        error: error.message,
      });
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return state;
};