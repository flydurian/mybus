import React, { useEffect, useState } from 'react';
import { fetchAllRoutes, searchTransit } from '../services/transitApi';
import { BusRoute, SubwayLine, BusStop, SubwayStation } from '../types';
import Loader from '../components/Loader';
import RouteListItem from '../components/RouteListItem';
import SearchResultItem from '../components/SearchResultItem';
import SearchIcon from '../components/icons/SearchIcon';
import { useDebounce } from '../hooks/useDebounce';

const RoutesPage: React.FC = () => {
    const [allRoutes, setAllRoutes] = useState<{ buses: BusRoute[], subways: SubwayLine[] }>({ buses: [], subways: [] });
    const [loadingAllRoutes, setLoadingAllRoutes] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<(BusStop | SubwayStation | BusRoute | SubwayLine)[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    useEffect(() => {
        setLoadingAllRoutes(true);
        fetchAllRoutes().then(data => {
            setAllRoutes(data);
            setLoadingAllRoutes(false);
        });
    }, []);

    useEffect(() => {
        if (debouncedSearchQuery.trim()) {
            setIsSearching(true);
            searchTransit(debouncedSearchQuery).then(results => {
                setSearchResults(results);
                setIsSearching(false);
            });
        } else {
            setSearchResults([]);
        }
    }, [debouncedSearchQuery]);

    const renderDefaultList = () => {
        if (loadingAllRoutes) {
            return <Loader />;
        }

        return (
            <div className="animate-fade-in">
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">버스</h2>
                    <div className="space-y-3">
                        {allRoutes.buses.map(route => <RouteListItem key={route.id} item={route} />)}
                    </div>
                </section>
                <section className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">지하철</h2>
                    <div className="space-y-3">
                        {allRoutes.subways.map(line => <RouteListItem key={line.id} item={line} />)}
                    </div>
                </section>
            </div>
        );
    }

    const renderSearchResults = () => {
        if (isSearching) {
            return <Loader />;
        }
        if (searchResults.length === 0) {
            return <p className="text-center text-gray-500 dark:text-gray-400 p-4">검색 결과가 없습니다.</p>;
        }
        return (
             <div className="animate-fade-in space-y-3">
                {searchResults.map((item) => <SearchResultItem key={item.id} item={item} />)}
            </div>
        )
    };

    return (
        <div>
            <h1 className="text-2xl font-bold p-4 text-gray-900 dark:text-white">노선 검색</h1>
            <div className="px-4 mb-4">
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                       <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="버스, 지하철, 정류장 검색"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-md border-gray-300 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 py-2 pl-10 pr-4 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>
            <div className="px-4 pb-4">
                {searchQuery.trim() ? renderSearchResults() : renderDefaultList()}
            </div>
        </div>
    );
};

export default RoutesPage;