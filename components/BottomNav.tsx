import React from 'react';
import { Tab } from '../types';
import BookmarkIcon from './icons/BookmarkIcon';
import LocationIcon from './icons/LocationIcon';
import MapIcon from './icons/MapIcon';
import SearchIcon from './icons/SearchIcon';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'text-blue-600 dark:text-blue-400';
  const inactiveClasses = 'text-gray-500 dark:text-gray-400';
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200">
      <div className={`w-6 h-6 ${isActive ? activeClasses : inactiveClasses}`}>{icon}</div>
      <span className={`text-xs mt-1 ${isActive ? activeClasses : inactiveClasses}`}>{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-t-lg">
      <div className="flex justify-around h-full">
        <NavItem 
          label="즐겨찾기" 
          icon={<BookmarkIcon />} 
          isActive={activeTab === 'favorites'} 
          onClick={() => setActiveTab('favorites')}
        />
        <NavItem 
          label="주변" 
          icon={<LocationIcon />} 
          isActive={activeTab === 'nearby'} 
          onClick={() => setActiveTab('nearby')}
        />
        <NavItem
          label="노선"
          icon={<SearchIcon />}
          isActive={activeTab === 'routes'}
          onClick={() => setActiveTab('routes')}
        />
        <NavItem 
          label="지도" 
          icon={<MapIcon />} 
          isActive={activeTab === 'map'} 
          onClick={() => setActiveTab('map')}
        />
      </div>
    </nav>
  );
};

export default BottomNav;