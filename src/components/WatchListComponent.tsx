import { useState, useEffect } from 'react';
import { getAllWatchList } from '../lib/contentful';
import type { WatchList } from '../lib/types/watchList';

const REVIEWS_PER_PAGE = 5;

const getInitialFilter = (key: string) => {
  if (typeof window === 'undefined') {
    return '';
  }

  return new URLSearchParams(window.location.search).get(key) ?? '';
};

const WatchListComponent = () => {
  const [allWatchList, setAllWatchList] = useState<WatchList[]>([]);
  const [filteredWatchList, setFilteredWatchList] = useState<WatchList[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState(() => getInitialFilter('type'));
  const [selectedStatus, setSelectedStatus] = useState(() => getInitialFilter('status'));
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchList = async () => {
      try {
        const watchList = await getAllWatchList();
        setAllWatchList(watchList);
        setFilteredWatchList(watchList);
      } catch (error) {
        console.error('Error fetching watch list:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWatchList();
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
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedStatus, allWatchList]);

  const types = Array.from(new Set(allWatchList.map(item => item.type)));

  const totalPages = Math.ceil(filteredWatchList.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const endIndex = startIndex + REVIEWS_PER_PAGE;
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

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages.map(pageNum => (
      <button
        key={pageNum}
        onClick={() => handlePageChange(pageNum)}
        className={`garden-page-button${pageNum === currentPage ? ' is-active' : ''}`}
      >
        {pageNum}
      </button>
    ));
  };

  if (loading) {
    return <div className="garden-page-loading">Loading watches...</div>;
  }

  return (
    <div className="watching-page garden-list-page">
      <section className="garden-list-hero garden-list-hero--watching">
        <p className="home-kicker">Digital garden</p>
        <h1>What I have been watching.</h1>
        <p>
          A watch list for films, shows and anything else I want to remember. Some entries are just quick tracking notes, and some have fuller thoughts attached.
        </p>
              <div className="garden-hero-flower garden-hero-flower--sprig" aria-hidden="true">
          <img src="/images/flowers/pressed-sprig.svg" alt="" />
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
            <article className="watch-list-item garden-list-card" key={watch.sys.id} itemScope itemType="http://schema.org/Review">
              <div className="garden-list-card__topline">
                <div>
                  <h2>{watch.title}</h2>
                  {watch.platform && (
                    <p>{watch.status === 'Watching' ? `Currently watching on ${watch.platform}` : `Watched on ${watch.platform}`}</p>
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
                <span>{watch.status}</span>
                {watch.thoughts && (
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

      {totalPages > 1 && (
        <nav className="garden-pagination" aria-label="Pagination">
          {/* Previous Button */}
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="garden-page-button">
            Previous
          </button>

          {/* Page Numbers */}
          <div className="garden-pagination__pages">
            {renderPageNumbers()}
          </div>

          {/* Next Button */}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="garden-page-button">
            Next
          </button>
        </nav>
      )}
    </div>
  );
};

export default WatchListComponent;



