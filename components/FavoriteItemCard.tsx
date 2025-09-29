import React from 'react';
import { FavoriteItem, BusStop, SubwayStation, BusRoute, Arrival, SubwayLine } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import BusIcon from './icons/BusIcon';
import SubwayIcon from './icons/SubwayIcon';
import StarIcon from './icons/StarIcon';

type FavoriteItemCardProps = {
  item: BusStop | SubwayStation | BusRoute | SubwayLine;
};

const ArrivalInfo: React.FC<{ arrival: Arrival, color: string, customColor?: string }> = ({ arrival, color, customColor }) => (
    <div className="flex items-center justify-between text-sm py-1.5">
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
                        <span className="text-gray-500 dark:text-gray-400 text-xs"> 후</span>
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

const FavoriteItemCard: React.FC<FavoriteItemCardProps> = ({ item }) => {
  const { removeFavorite } = useFavorites();

  const renderContent = () => {
    switch (item.type) {
      case 'bus-stop':
        return (
          <>
            <div className="flex items-center mb-2">
                <BusIcon className="w-5 h-5 mr-3 text-green-500" />
                <h3 className="font-bold text-gray-800 dark:text-gray-100">{item.name}</h3>
            </div>
            <div className="space-y-1">
              {item.arrivals.slice(0, 3).map((arr, i) => <ArrivalInfo key={i} arrival={arr} color="text-green-600 dark:text-green-400" />)}
            </div>
          </>
        );
      case 'subway-station':
        return (
          <>
            <div className="flex items-center mb-2">
                <SubwayIcon className="w-5 h-5 mr-3" style={{ color: item.color || '#666666' }} />
                <h3 className="font-bold text-gray-800 dark:text-gray-100">
                    {item.line}호선 {item.name}역{item.exitNumber ? ` ${item.exitNumber}번 출구` : ''}
                </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
                {/* 상행 */}
                <div>
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">상행</div>
                    <div className="space-y-2">
                        {item.upboundArrivals.slice(0, 2).map((arr, i) => (
                            <div key={`u-${i}`} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-sm" style={{ color: item.color || '#666666' }}>
                                            {arr.routeName}
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                            {arr.destination}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                                            {arr.timeMinutes}분
                                        </div>
                                        {arr.stationsBefore && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {arr.stationsBefore}정거장 전
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 하행 */}
                <div>
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">하행</div>
                    <div className="space-y-2">
                        {item.downboundArrivals.slice(0, 2).map((arr, i) => (
                            <div key={`d-${i}`} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-sm" style={{ color: item.color || '#666666' }}>
                                            {arr.routeName}
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                            {arr.destination}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                                            {arr.timeMinutes}분
                                        </div>
                                        {arr.stationsBefore && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {arr.stationsBefore}정거장 전
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </>
        );
      case 'bus-route':
        return (
            <div className="flex items-center">
                <BusIcon className={`w-5 h-5 mr-3 text-[${item.color}]`} />
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100">{item.name} 번 버스</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                </div>
            </div>
        );
      case 'subway-line':
        return (
            <div className="flex items-center">
                <SubwayIcon className={`w-5 h-5 mr-3 text-[${item.color}]`} />
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100">{item.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4 flex items-start p-4">
      <div className="flex-grow">
        {renderContent()}
      </div>
      <button onClick={() => removeFavorite(item.id)} className="p-2 -mt-2 -mr-2 text-gray-400 hover:text-yellow-500 transition-colors flex-shrink-0">
          <StarIcon filled={true} className="w-6 h-6 text-yellow-400" />
      </button>
    </div>
  );
};

export default FavoriteItemCard;