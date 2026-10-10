import { useState, useEffect } from 'react';
import type { WatchListSummary } from '../lib/types/watchList';

import { WATCHING_PAGE_SIZE } from '../lib/pagination';
import Pagination from './PaginationComponent';

interface Props { initialWatchList: WatchListSummary[]; initialPage?: number; }

const WatchListComponent = ({ initialWatchList, initialPage = 1 }: Props) => {
  const allWatchList = initialWatchList;
  const [filteredWatchList, setFilteredWatchList] = useState<WatchListSummary[]>(initialWatchList);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSelectedType(params.get('type') ?? '');
    setSelectedStatus(params.get('status') ?? '');
  }, []);

  useEffect(() => {
    let filtered = allWatchList;

    if (searchTerm !== '') {
      filtered = filtered.filter(review =>
        review.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedStatus !== '') {
      filtered = filtered.filter(review => review.status === selectedStatus);
    }
    if (selectedType !== '') {
      filtered = filtered.filter(review => review.type === selectedType);
    }

    setFilteredWatchList(filtered);
    setCurrentPage(searchTerm !== '' || selectedType !== '' || selectedStatus !== '' ? 1 : initialPage);
  }, [searchTerm, selectedType, selectedStatus, allWatchList, initialPage]);

  const types = Array.from(new Set(allWatchList.map(item => item.type)));

  const totalPages = Math.ceil(filteredWatchList.length / WATCHING_PAGE_SIZE);
  const startIndex = (currentPage - 1) * WATCHING_PAGE_SIZE;
  const endIndex = startIndex + WATCHING_PAGE_SIZE;
  const currentWatchList = filteredWatchList.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const updateUrlFilter = (key: string, value: string) => {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
    window.history.replaceState({}, '', url);
  };

  const updateTypeFilter = (type: string) => {
    setSelectedType(type);
    updateUrlFilter('type', type);
  };

  const updateStatusFilter = (status: string) => {
    setSelectedStatus(status);
    updateUrlFilter('status', status);
  };

  const clearFilters = () => {
    setSearchTerm('');
    updateStatusFilter('');
    updateTypeFilter('');
    setIsFilterOpen(false);
  };

  return (
    <div className="watching-page garden-list-page">
      <section className="garden-list-hero garden-list-hero--watching">
        <p className="home-kicker">Digital garden</p>
        <h1>What I have been watching.</h1>
        <p>
          A watch list for films, shows and anything else I want to remember. Some entries are just quick tracking notes, and some have fuller thoughts attached.
        </p>
              <div className="garden-hero-flower garden-hero-flower--sprig" aria-hidden="true">
          <img src="/images/flowers/pressed-sprig.svg" alt="" width="220" height="252" />
        </div>
      </section>

      <section className="garden-list-toolbar" aria-label="Watch list controls">
        <p><span>{Math.min(endIndex, filteredWatchList.length)}</span> of {filteredWatchList.length} watches found</p>
        <div className="garden-list-actions">
          <button onClick={toggleFilters} className="garden-icon-button" aria-label="Toggle filters">
            <svg className="garden-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
          </button>
          <button
            onClick={clearFilters}
            className="garden-icon-button garden-icon-button--secondary"
            aria-label="Clear Filters"
            disabled={searchTerm === '' && selectedStatus === '' && selectedType === ''}
          >
            <svg className="garden-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
            </svg>
          </button>
        </div>
      </section>

      {/* Filter Wrapper */}
      <div className="garden-filter-wrapper">
        {/* Search and Filter Section */}
        {isFilterOpen && (
          <div className="garden-filter-panel">
            {/* Search Input */}
            <div className="garden-filter-field">
              <label htmlFor="search">Search Watch List</label>
              <div className="garden-search-row">
                <input
                  type="text"
                  id="search"
                  placeholder="Search by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={() => setSearchTerm(searchTerm)}>Search</button>
              </div>
            </div>

            {/* Status Filter */}
            <div className="garden-filter-field">
              <label htmlFor="status">Filter by Status</label>
              <select id="status" value={selectedStatus} onChange={(e) => updateStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="To be watched">To be watched</option>
                <option value="Watching">Watching</option>
                <option value="Complete">Complete</option>
              </select>
            </div>

            {/* Type Filter */}
            {types && types.length > 0 && (
              <div className="garden-filter-field">
                <label htmlFor="type">Filter by Type</label>
                <select id="type" value={selectedType} onChange={(e) => updateTypeFilter(e.target.value)}>
                  <option value="">All Types</option>
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="garden-card-list watch-list">
        {currentWatchList.length === 0 ? (
          <div className="garden-empty-state">
            <p>No watch records found matching your criteria.</p>
          </div>
        ) : (
          currentWatchList.map((watch) => (
            <article className="watch-list-item garden-list-card" key={watch.sys.id}>
              <div className="garden-list-card__topline">
                <div>
                  <h2>{watch.title}</h2>
                  {watch.platform && watch.status !== 'Watching' && (
                    <p>{`Watched on ${watch.platform}`}</p>
                  )}
                </div>
                {watch.type && watch.type.length > 0 && (
                  <div className="garden-tag-list">
                    <button onClick={() => updateTypeFilter(watch.type)} title={`Filter by ${watch.type}`}>
                      {watch.type}
                    </button>
                  </div>
                )}
              </div>

              <div className="garden-list-card__footer">
                <span>{watch.status === 'Watching' && watch.platform ? `Currently watching on ${watch.platform}` : watch.status}</span>
                {watch.hasThoughts && (
                  <a href={`/digital-garden/watching/${watch.sys.id}/`}>
                    <span>Read my thoughts</span>
                    <span className="sr-only">Read thoughts on {watch.title}</span>
                  </a>
                )}
              </div>
            </article>
          ))
        )}
      </div>

      <Pagination
        basePath="/digital-garden/watching/"
        currentPage={currentPage}
        totalPages={totalPages}
        filtered={searchTerm !== '' || selectedType !== '' || selectedStatus !== ''}
        onPageChange={handlePageChange}
        variant="garden"
      />
    </div>
  );
};

export default WatchListComponent;



