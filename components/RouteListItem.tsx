import React from 'react';
import { BusRoute, SubwayLine } from '../types';
import BusIcon from './icons/BusIcon';
import SubwayIcon from './icons/SubwayIcon';

type RouteListItemProps = {
    item: BusRoute | SubwayLine;
};

const RouteListItem: React.FC<RouteListItemProps> = ({ item }) => {
    const isBus = item.type === 'bus-route';
    
    const icon = isBus 
        ? <BusIcon className={`w-5 h-5 text-[${item.color}]`} />
        : <SubwayIcon className={`w-5 h-5 text-[${item.color}]`} />;
        
    const name = isBus
        ? `${item.name} 번`
        : item.name;

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
        </div>
    );
};

export default RouteListItem;