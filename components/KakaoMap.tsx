import React, { useEffect, useRef } from 'react';

interface KakaoMapProps {
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
}

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap = React.forwardRef<any, KakaoMapProps>(({ 
  center = { lat: 37.5665, lng: 126.9780 }, // 서울시청 기본 위치
  zoom = 3,
  onLocationSelect 
}, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markers = useRef<any[]>([]);

  useEffect(() => {
    const loadKakaoMapScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.kakao && window.kakao.maps) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}`;
        script.async = true;
        
        script.onload = () => {
          if (window.kakao && window.kakao.maps) {
            resolve();
          } else {
            reject(new Error('카카오맵 API 로드 실패'));
          }
        };
        
        script.onerror = () => {
          reject(new Error('카카오맵 스크립트 로드 실패'));
        };
        
        document.head.appendChild(script);
      });
    };

    const initMap = () => {
      if (!window.kakao || !mapRef.current) return;

      const options = {
        center: new window.kakao.maps.LatLng(center.lat, center.lng),
        level: zoom
      };

      mapInstance.current = new window.kakao.maps.Map(mapRef.current, options);

      // 지도 클릭 이벤트
      if (onLocationSelect) {
        window.kakao.maps.event.addListener(mapInstance.current, 'click', (mouseEvent: any) => {
          const latlng = mouseEvent.latLng;
          onLocationSelect(latlng.getLat(), latlng.getLng());
        });
      }

      // 현재 위치 표시
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            
            const userLocation = new window.kakao.maps.LatLng(userLat, userLng);
            
            // 현재 위치 마커 추가
            const userMarker = new window.kakao.maps.Marker({
              position: userLocation,
              image: new window.kakao.maps.MarkerImage(
                'data:image/svg+xml;base64,' + btoa(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#3B82F6">
                    <circle cx="12" cy="12" r="10" fill="#3B82F6"/>
                    <circle cx="12" cy="12" r="4" fill="white"/>
                  </svg>
                `),
                new window.kakao.maps.Size(24, 24),
                { offset: new window.kakao.maps.Point(12, 12) }
              )
            });
            
            userMarker.setMap(mapInstance.current);
            
            // 지도 중심을 현재 위치로 이동
            mapInstance.current.setCenter(userLocation);
            
            // 인포윈도우 추가
            const infoWindow = new window.kakao.maps.InfoWindow({
              content: '<div style="padding:5px; font-size:12px; text-align:center;">현재 위치</div>'
            });
            
            window.kakao.maps.event.addListener(userMarker, 'click', () => {
              infoWindow.open(mapInstance.current, userMarker);
            });
          },
          (error) => {
            console.warn('현재 위치를 가져올 수 없습니다:', error);
          }
        );
      }
    };

    // 카카오맵 스크립트 로드 및 지도 초기화
    loadKakaoMapScript()
      .then(() => {
        initMap();
      })
      .catch((error) => {
        console.error('카카오맵 로드 오류:', error);
      });
  }, [center.lat, center.lng, zoom, onLocationSelect]);

  // 마커 추가 함수
  const addMarker = (lat: number, lng: number, title: string, content?: string) => {
    if (!window.kakao || !mapInstance.current) return;

    const markerPosition = new window.kakao.maps.LatLng(lat, lng);
    
    const marker = new window.kakao.maps.Marker({
      position: markerPosition
    });
    
    marker.setMap(mapInstance.current);
    markers.current.push(marker);

    // 인포윈도우 추가
    if (content) {
      const infoWindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:10px; font-size:14px; text-align:center;">
          <div style="font-weight:bold; margin-bottom:5px;">${title}</div>
          <div>${content}</div>
        </div>`
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(mapInstance.current, marker);
      });
    }
  };

  // 마커 제거 함수
  const clearMarkers = () => {
    markers.current.forEach(marker => {
      marker.setMap(null);
    });
    markers.current = [];
  };

  // 지도 중심 이동 함수
  const setCenter = (lat: number, lng: number) => {
    if (!mapInstance.current) return;
    const newCenter = new window.kakao.maps.LatLng(lat, lng);
    mapInstance.current.setCenter(newCenter);
  };

  // 외부에서 사용할 수 있도록 ref로 함수 노출
  React.useImperativeHandle(ref, () => ({
    addMarker,
    clearMarkers,
    setCenter
  }));

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg"
      style={{ minHeight: '400px' }}
    />
  );
});

KakaoMap.displayName = 'KakaoMap';

export default KakaoMap;
