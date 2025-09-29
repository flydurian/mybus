
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
      let errorMessage = '위치 정보를 가져올 수 없습니다.';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = '위치 접근 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = '위치 정보를 사용할 수 없습니다. GPS 신호를 확인해주세요.';
          break;
        case error.TIMEOUT:
          errorMessage = '위치 정보 요청 시간이 초과되었습니다. 다시 시도해주세요.';
          break;
        default:
          errorMessage = '알 수 없는 위치 오류가 발생했습니다.';
          break;
      }
      
      setState({
        location: null,
        loading: false,
        error: errorMessage,
      });
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
  }, []);

  return state;
};