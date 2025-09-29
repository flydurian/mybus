import React, { useEffect, useState, useCallback } from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import { fetchFavoriteDetails } from '../services/transitApi';
import { BusStop, SubwayStation, BusRoute, SubwayLine } from '../types';
import Loader from '../components/Loader';
import FavoriteItemCard from '../components/FavoriteItemCard';
import BookmarkIcon from '../components/icons/BookmarkIcon';
import RefreshIcon from '../components/icons/RefreshIcon';

const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();
  const [details, setDetails] = useState<(BusStop | SubwayStation | BusRoute | SubwayLine)[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadFavoriteDetails = useCallback(() => {
    if (favorites.length > 0) {
      const favoriteIds = favorites.map(f => f.id);
      return fetchFavoriteDetails(favoriteIds);
    }
    return Promise.resolve([]);
  }, [favorites]);

  useEffect(() => {
    setLoading(true);
    loadFavoriteDetails().then(data => {
      setDetails(data);
      setLoading(false);
    });
  }, [favorites, loadFavoriteDetails]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadFavoriteDetails().then(data => {
      setDetails(data);
      setIsRefreshing(false);
    });
  };
  
  const renderContent = () => {
      if (loading) {
          return <Loader />;
      }
      
      if (favorites.length === 0) {
          return (
              <div className="text-center p-8 mt-16">
                  <BookmarkIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" />
                  <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">즐겨찾기 없음</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">'주변' 또는 '노선' 탭에서 즐겨찾기를 추가하세요.</p>
              </div>
          );
      }
      
      return (
          <div className="animate-fade-in">
              {details.map(item => <FavoriteItemCard key={item.id} item={item} />)}
          </div>
      );
  }

  return (
    <div>
        <div className="flex justify-between items-center p-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">즐겨찾기</h1>
            <button
                onClick={handleRefresh}
                disabled={isRefreshing || favorites.length === 0}
                className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="새로고침"
            >
                <RefreshIcon className={`w-6 h-6 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
        </div>
        <div className="px-4 pb-4">
            {renderContent()}
        </div>
    </div>
  );
};

export default FavoritesPage;