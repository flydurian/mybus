import React from 'react';
import { BusStop, SubwayStation, BusRoute, SubwayLine, FavoriteItem } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import BusIcon from './icons/BusIcon';
import SubwayIcon from './icons/SubwayIcon';
import StarIcon from './icons/StarIcon';

type SearchResultItemProps = {
    item: BusStop | SubwayStation | BusRoute | SubwayLine;
};

const SearchResultItem: React.FC<SearchResultItemProps> = ({ item }) => {
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const isFavorited = isFavorite(item.id);
    const canBeFavorited = item.type === 'bus-stop' || item.type === 'subway-station' || item.type === 'bus-route' || item.type === 'subway-line';

    const handleToggleFavorite = () => {
        if (isFavorited) {
            removeFavorite(item.id);
        } else {
            let favoriteItem: FavoriteItem | null = null;
            switch(item.type) {
                case 'bus-stop':
                    favoriteItem = { id: item.id, type: 'bus-stop', name: item.name };
                    break;
                case 'subway-station':
                    const exitInfo = item.exitNumber ? ` ${item.exitNumber}번 출구` : '';
                    favoriteItem = { 
                        id: item.id, 
                        type: 'subway-station', 
                        name: `${item.line}호선 ${item.name}역${exitInfo}`, 
                        details: `${item.line}호선` 
                    };
                    break;
                case 'bus-route':
                    favoriteItem = { id: item.id, type: 'bus-route', name: item.name };
                    break;
                case 'subway-line':
                    favoriteItem = { id: item.id, type: 'subway-line', name: item.name };
                    break;
            }
            
            if (favoriteItem) {
                addFavorite(favoriteItem);
            }
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
            name = `${item.line}호선 ${item.name}역`;
            description = item.exitNumber ? `${item.exitNumber}번 출구` : `${item.line}호선`;
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
            )}
        </div>
    );
};

export default SearchResultItem;