import React from 'react';
import { FavoriteItem, BusStop, SubwayStation, BusRoute, Arrival, SubwayLine } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import BusIcon from './icons/BusIcon';
import SubwayIcon from './icons/SubwayIcon';
import StarIcon from './icons/StarIcon';

type FavoriteItemCardProps = {
  item: BusStop | SubwayStation | BusRoute | SubwayLine;
};

const ArrivalInfo: React.FC<{ arrival: Arrival, color: string }> = ({ arrival, color }) => (
    <div className="flex items-center justify-between text-sm py-1.5">
        <div className="flex items-center truncate">
            <span className={`font-bold w-16 ${color}`}>{arrival.routeName}</span>
            <span className="text-gray-600 dark:text-gray-300 truncate">{arrival.destination}</span>
        </div>
        <div className="text-right flex-shrink-0">
            <span className="font-semibold text-blue-600 dark:text-blue-400">{arrival.timeMinutes}분 후</span>
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
              {item.arrivals.slice(0, 2).map((arr, i) => <ArrivalInfo key={i} arrival={arr} color="text-green-600 dark:text-green-400" />)}
            </div>
          </>
        );
      case 'subway-station':
        return (
          <>
            <div className="flex items-center mb-2">
                <SubwayIcon className="w-5 h-5 mr-3 text-orange-500" />
                <h3 className="font-bold text-gray-800 dark:text-gray-100">{item.name} ({item.line}호선)</h3>
            </div>
            <div className="space-y-1">
                {item.upboundArrivals.slice(0, 1).map((arr, i) => <ArrivalInfo key={`u-${i}`} arrival={arr} color="text-orange-600 dark:text-orange-400" />)}
                {item.downboundArrivals.slice(0, 1).map((arr, i) => <ArrivalInfo key={`d-${i}`} arrival={arr} color="text-orange-600 dark:text-orange-400" />)}
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