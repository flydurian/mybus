import React from 'react';
import { BusRoute, SubwayLine, FavoriteItem } from '../types';
import BusIcon from './icons/BusIcon';
import SubwayIcon from './icons/SubwayIcon';
import StarIcon from './icons/StarIcon';
import { useFavorites } from '../contexts/FavoritesContext';

type RouteListItemProps = {
    item: BusRoute | SubwayLine;
};

const RouteListItem: React.FC<RouteListItemProps> = ({ item }) => {
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const isFavorited = isFavorite(item.id);
    const isBus = item.type === 'bus-route';
    
    const icon = isBus 
        ? <BusIcon className="w-5 h-5" style={{ color: item.color }} />
        : <SubwayIcon className="w-5 h-5" style={{ color: item.color }} />;
        
    const name = isBus
        ? `${item.name} 번`
        : item.name;

    const handleToggleFavorite = () => {
        if (isFavorited) {
            removeFavorite(item.id);
        } else {
            const favoriteItem: FavoriteItem = {
                id: item.id,
                type: item.type,
                name: item.name,
            };
            addFavorite(favoriteItem);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 flex items-center space-x-4 transition-transform duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700`}>
                {icon}
            </div>
            <div className="flex-grow">
                <p className="font-bold text-gray-800 dark:text-gray-100">{name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
            </div>
            {!isBus && <div className="w-2 h-10 rounded-full" style={{ backgroundColor: item.color }}></div>}
            <button
                onClick={handleToggleFavorite}
                className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 ${
                    isFavorited 
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                title={isFavorited ? '즐겨찾기에서 제거' : '즐겨찾기에 추가'}
            >
                <StarIcon className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                <span>{isFavorited ? '즐겨찾기' : '추가'}</span>
            </button>
        </div>
    );
};

export default RouteListItem;