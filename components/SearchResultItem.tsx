import React from 'react';
import { BusStop, SubwayStation, BusRoute, SubwayLine, FavoriteItem } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import BusIcon from './icons/BusIcon';
import SubwayIcon from './icons/SubwayIcon';

type SearchResultItemProps = {
    item: BusStop | SubwayStation | BusRoute | SubwayLine;
};

const SearchResultItem: React.FC<SearchResultItemProps> = ({ item }) => {
    const { addFavorite, isFavorite } = useFavorites();
    const isFavorited = isFavorite(item.id);
    const canBeFavorited = item.type === 'bus-stop' || item.type === 'subway-station' || item.type === 'bus-route' || item.type === 'subway-line';

    const handleAddFavorite = () => {
        let favoriteItem: FavoriteItem | null = null;
        switch(item.type) {
            case 'bus-stop':
                favoriteItem = { id: item.id, type: 'bus-stop', name: item.name };
                break;
            case 'subway-station':
                favoriteItem = { id: item.id, type: 'subway-station', name: item.name, details: `${item.line}호선` };
                break;
            case 'bus-route':
                favoriteItem = { id: item.id, type: 'bus-route', name: item.name };
                break;
            case 'subway-line':
                favoriteItem = { id: item.id, type: 'subway-line', name: item.name };
                break;
        }
        
        if (favoriteItem && !isFavorited) {
            addFavorite(favoriteItem);
        }
    };
    
    let icon;
    let name;
    let description;

    switch (item.type) {
        case 'bus-stop':
            icon = <BusIcon className="w-5 h-5 text-green-500" />;
            name = item.name;
            description = "버스 정류장";
            break;
        case 'subway-station':
            icon = <SubwayIcon className="w-5 h-5 text-orange-500" />;
            name = `${item.name}역`;
            description = `${item.line}호선`;
            break;
        case 'bus-route':
            icon = <BusIcon className={`w-5 h-5 text-[${item.color}]`} />;
            name = `${item.name}번 버스`;
            description = item.description;
            break;
        case 'subway-line':
            icon = <SubwayIcon className={`w-5 h-5 text-[${item.color}]`} />;
            name = item.name;
            description = item.description;
            break;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 flex items-center space-x-4">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                {icon}
            </div>
            <div className="flex-grow min-w-0">
                <p className="font-bold text-gray-800 dark:text-gray-100 truncate">{name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{description}</p>
            </div>
            {canBeFavorited && (
                <button
                    onClick={handleAddFavorite}
                    disabled={isFavorited}
                    className="flex-shrink-0 px-3 py-1.5 text-sm font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-500"
                >
                    {isFavorited ? '추가됨' : '추가'}
                </button>
            )}
        </div>
    );
};

export default SearchResultItem;