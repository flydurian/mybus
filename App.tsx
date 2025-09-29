import React, { useState } from 'react';
import { Tab } from './types';
import { FavoritesProvider } from './contexts/FavoritesContext';
import BottomNav from './components/BottomNav';
import NearbyPage from './pages/NearbyPage';
import FavoritesPage from './pages/FavoritesPage';
import MapPage from './pages/MapPage';
import RoutesPage from './pages/RoutesPage';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('nearby');

  const renderPage = () => {
    switch (activeTab) {
      case 'favorites':
        return <FavoritesPage />;
      case 'nearby':
        return <NearbyPage />;
      case 'routes':
        return <RoutesPage />;
      case 'map':
        return <MapPage />;
      default:
        return <NearbyPage />;
    }
  };

  return (
    <FavoritesProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col h-screen">
        <main className={`flex-1 ${activeTab === 'map' ? 'overflow-hidden' : 'overflow-y-auto scroll-container'}`}>
          {renderPage()}
        </main>
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </FavoritesProvider>
  );
};

export default App;