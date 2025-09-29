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
                className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                title={isFavorited ? '즐겨찾기에서 제거' : '즐겨찾기에 추가'}
            >
                <StarIcon filled={isFavorited} className={`w-6 h-6 ${isFavorited ? 'text-yellow-400' : ''}`} />
            </button>
        </div>
    );
};

export default RouteListItem;