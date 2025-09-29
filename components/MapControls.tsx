import React from 'react';
import { useMap, ZoomControl } from 'react-leaflet';
import { Coordinates } from '../types';
import CrosshairIcon from './icons/CrosshairIcon';

interface MapControlsProps {
    userLocation: Coordinates;
}

const MapControls: React.FC<MapControlsProps> = ({ userLocation }) => {
    const map = useMap();

    const handleRecenter = () => {
        map.flyTo([userLocation.lat, userLocation.lon], map.getZoom());
    };

    return (
        <>
            <ZoomControl position="bottomright" />
            <div className="leaflet-bottom leaflet-right mb-[58px]">
                <div className="leaflet-control leaflet-bar bg-white rounded-md shadow-md">
                     <button
                        className="w-[30px] h-[30px] flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-md"
                        title="현재 위치로 이동"
                        aria-label="현재 위치로 이동"
                        onClick={handleRecenter}
                    >
                       <CrosshairIcon className="w-5 h-5 text-gray-800" />
                    </button>
                </div>
            </div>
        </>
    );
};

export default MapControls;
