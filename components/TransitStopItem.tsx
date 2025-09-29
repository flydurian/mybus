
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
        <div className="flex items-center">
            <span 
                className="font-bold w-16"
                style={color === 'custom' ? { color: customColor } : undefined}
            >
                {color !== 'custom' && <span className={color}>{arrival.routeName}</span>}
                {color === 'custom' && arrival.routeName}
            </span>
            <span className="text-gray-600 dark:text-gray-300">{arrival.destination}</span>
        </div>
        <div className="text-right">
            <span className="font-semibold text-blue-600 dark:text-blue-400">{arrival.timeMinutes}분</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs"> 후 도착</span>
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
                                ? `${item.line}호선 ${item.name}역${item.exitNumber ? ` ${item.exitNumber}번 출구` : ''}`
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
                    <>
                        {item.upboundArrivals.length > 0 && <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">상행</div>}
                        {item.upboundArrivals.map((arrival, index) => (
                             <ArrivalInfo key={`up-${index}`} arrival={arrival} color="custom" customColor={item.color || '#666666'} />
                        ))}
                         {item.downboundArrivals.length > 0 && <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mt-3 mb-1">하행</div>}
                        {item.downboundArrivals.map((arrival, index) => (
                           <ArrivalInfo key={`down-${index}`} arrival={arrival} color="custom" customColor={item.color || '#666666'} />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default TransitStopItem;