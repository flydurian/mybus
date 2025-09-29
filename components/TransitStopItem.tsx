
import React from 'react';
import { BusStop, SubwayStation, Arrival, FavoriteItem } from '../types';
import BusIcon from './icons/BusIcon';
import SubwayIcon from './icons/SubwayIcon';
import StarIcon from './icons/StarIcon';
import { useFavorites } from '../contexts/FavoritesContext';

type TransitStopItemProps = {
  item: BusStop | SubwayStation;
};

const ArrivalInfo: React.FC<{ arrival: Arrival, color: string, customColor?: string }> = ({ arrival, color, customColor }) => (
    <div className="flex items-center justify-between text-sm py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
        <div className="flex items-center flex-grow min-w-0">
            <span 
                className="font-bold w-16 flex-shrink-0"
                style={color === 'custom' ? { color: customColor } : undefined}
            >
                {color !== 'custom' && <span className={color}>{arrival.routeName}</span>}
                {color === 'custom' && arrival.routeName}
            </span>
            <div className="flex items-center space-x-2 min-w-0">
                <span className="text-gray-600 dark:text-gray-300 truncate">{arrival.destination}</span>
                {arrival.isLowFloor && (
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                        저상
                    </span>
                )}
            </div>
        </div>
        <div className="text-right flex-shrink-0">
            <div className="space-y-1">
                <div className="flex items-center justify-end space-x-2">
                    <div>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">{arrival.timeMinutes}분</span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs"> 후 도착</span>
                    </div>
                    {arrival.nextArrival && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            다음 {arrival.nextArrival}분
                        </div>
                    )}
                </div>
                {arrival.stationsBefore && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {arrival.stationsBefore}정거장 전
                    </div>
                )}
            </div>
        </div>
    </div>
);

const TransitStopItem: React.FC<TransitStopItemProps> = ({ item }) => {
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const isFavorited = isFavorite(item.id);

    const handleFavoriteClick = () => {
        let favoriteItem: FavoriteItem;
        
        if (item.type === 'subway-station') {
            const exitInfo = item.exitNumber ? ` ${item.exitNumber}번 출구` : '';
            favoriteItem = {
                id: item.id,
                type: item.type,
                name: `${item.line}호선 ${item.name}역${exitInfo}`,
                details: `${item.line}호선`
            };
        } else {
            favoriteItem = {
                id: item.id,
                type: item.type,
                name: item.name,
                details: undefined
            };
        }
        
        if (isFavorited) {
            removeFavorite(item.id);
        } else {
            addFavorite(favoriteItem);
        }
    };

    const handleDirectionFavoriteClick = (direction: 'up' | 'down') => {
        if (item.type !== 'subway-station') return;
        
        const directionId = direction === 'up' ? item.upboundId : item.downboundId;
        const directionText = direction === 'up' ? '상행' : '하행';
        
        if (!directionId) return;
        
        const favoriteItem: FavoriteItem = {
            id: directionId,
            type: 'subway-station',
            name: `${item.line}호선 ${item.name}역 ${directionText}`,
            details: `${item.line}호선 ${directionText}`
        };
        
        const isDirectionFavorited = isFavorite(directionId);
        
        if (isDirectionFavorited) {
            removeFavorite(directionId);
        } else {
            addFavorite(favoriteItem);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center">
                    {item.type === 'bus-stop' ? (
                        <BusIcon className="w-6 h-6 mr-3 text-green-500" />
                    ) : (
                        <SubwayIcon className="w-6 h-6 mr-3" style={{ color: item.color || '#666666' }} />
                    )}
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
                            {item.type === 'subway-station' 
                                ? `${item.line}호선 ${item.name}역`
                                : item.name
                            }
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{Math.round(item.distance)}m</p>
                    </div>
                </div>
                <button onClick={handleFavoriteClick} className="p-2 text-gray-400 hover:text-yellow-500 transition-colors">
                    <StarIcon filled={isFavorited} className={`w-6 h-6 ${isFavorited ? 'text-yellow-400' : ''}`} />
                </button>
            </div>
            <div className="p-4">
                {item.type === 'bus-stop' && item.arrivals.map((arrival, index) => (
                    <ArrivalInfo key={index} arrival={arrival} color="text-green-600 dark:text-green-400" />
                ))}
                {item.type === 'subway-station' && (
                    <div className="grid grid-cols-2 gap-4">
                        {/* 상행 */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">상행</div>
                                <button 
                                    onClick={() => handleDirectionFavoriteClick('up')} 
                                    className="p-1 text-gray-400 hover:text-yellow-500 transition-colors"
                                    title={isFavorite(item.upboundId || '') ? '상행 즐겨찾기에서 제거' : '상행 즐겨찾기에 추가'}
                                >
                                    <StarIcon filled={isFavorite(item.upboundId || '')} className={`w-4 h-4 ${isFavorite(item.upboundId || '') ? 'text-yellow-400' : ''}`} />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {(() => {
                                    // 행선지별로 그룹핑
                                    const grouped = item.upboundArrivals.reduce((acc, arrival) => {
                                        const key = `${arrival.routeName}-${arrival.destination}`;
                                        if (!acc[key]) {
                                            acc[key] = [];
                                        }
                                        acc[key].push(arrival);
                                        return acc;
                                    }, {} as { [key: string]: typeof item.upboundArrivals });

                                    return Object.entries(grouped).map(([key, arrivals]) => (
                                        <div key={`up-${key}`} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-bold text-sm" style={{ color: item.color || '#666666' }}>
                                                        {arrivals[0].routeName}
                                                    </div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                                        {arrivals[0].destination}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div>
                                                        <div className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                                                            {arrivals[0].timeMinutes}분 후
                                                        </div>
                                                        {arrivals[0].stationsBefore && (
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                {arrivals[0].stationsBefore}정거장 전
                                                            </div>
                                                        )}
                                                        {arrivals.length > 1 && arrivals[1] && (
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                그 다음편이 {arrivals[1].timeMinutes}분 후
                                                                {arrivals[1].stationsBefore && ` ${arrivals[1].stationsBefore}정거장 전`}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>

                        {/* 하행 */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">하행</div>
                                <button 
                                    onClick={() => handleDirectionFavoriteClick('down')} 
                                    className="p-1 text-gray-400 hover:text-yellow-500 transition-colors"
                                    title={isFavorite(item.downboundId || '') ? '하행 즐겨찾기에서 제거' : '하행 즐겨찾기에 추가'}
                                >
                                    <StarIcon filled={isFavorite(item.downboundId || '')} className={`w-4 h-4 ${isFavorite(item.downboundId || '') ? 'text-yellow-400' : ''}`} />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {(() => {
                                    // 행선지별로 그룹핑
                                    const grouped = item.downboundArrivals.reduce((acc, arrival) => {
                                        const key = `${arrival.routeName}-${arrival.destination}`;
                                        if (!acc[key]) {
                                            acc[key] = [];
                                        }
                                        acc[key].push(arrival);
                                        return acc;
                                    }, {} as { [key: string]: typeof item.downboundArrivals });

                                    return Object.entries(grouped).map(([key, arrivals]) => (
                                        <div key={`down-${key}`} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-bold text-sm" style={{ color: item.color || '#666666' }}>
                                                        {arrivals[0].routeName}
                                                    </div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                                        {arrivals[0].destination}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div>
                                                        <div className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                                                            {arrivals[0].timeMinutes}분 후
                                                        </div>
                                                        {arrivals[0].stationsBefore && (
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                {arrivals[0].stationsBefore}정거장 전
                                                            </div>
                                                        )}
                                                        {arrivals.length > 1 && arrivals[1] && (
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                그 다음편이 {arrivals[1].timeMinutes}분 후
                                                                {arrivals[1].stationsBefore && ` ${arrivals[1].stationsBefore}정거장 전`}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransitStopItem;