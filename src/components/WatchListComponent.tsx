import { useState, useEffect } from 'react';
import { getAllWatchList } from '../lib/contentful';
import type { WatchList } from '@/lib/types/watchList';

const REVIEWS_PER_PAGE = 5;

const WatchListComponent = () => {
  const [allWatchList, setAllWatchList] = useState<WatchList[]>([]);
  const [filteredWatchList, setFilteredWatchList] = useState<WatchList[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
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

    setFilteredWatchList(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedStatus, allWatchList]);

  const types = Array.from(new Set(allWatchList.map(item => item.type)));

  const totalPages = Math.ceil(filteredWatchList.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const endIndex = startIndex + REVIEWS_PER_PAGE;
  const currentReviews = filteredWatchList.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
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
        className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
          pageNum === currentPage
            ? 'text-white bg-gray-900 dark:bg-white dark:text-gray-900 border border-gray-900 dark:border-white'
            : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        {pageNum}
      </button>
    ));
  };

  if (loading) {
    return <div className="text-center py-8">Loading watches...</div>;
  }

  return (
    <div className="container">
      <div className='flex flex-col'>
        <h1 className="text-2xl font-bold">What have I been watching?</h1>
      </div>
      <div className="flex flex-row justify-end">
        <div className="flex flex-row">
          <div className="text-center mt-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
            <span>{Math.min(endIndex, filteredWatchList.length)}</span> of {filteredWatchList.length} watches found
          </div>
          <button
            onClick={toggleFilters}
            className="my-auto ml-2 px-3 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-highlight)] focus:outline-none"
            aria-label="Toggle filters"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
          </button>
          <button
            onClick={clearFilters}
            className="my-auto ml-2 px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 focus:outline-none dark:bg-slate-500 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Clear Filters"
            disabled={searchTerm === '' && selectedStatus === ''}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Filter Wrapper */}
      <div className="mb-4 relative">
        {/* Search and Filter Section */}
        {isFilterOpen && (
          <div className="absolute top-full right-0 z-50 w-96 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mt-2">
            {/* Search Input */}
            <div className="mb-4">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Watches
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="search"
                  placeholder="Search by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={() => setSearchTerm(searchTerm)} // Trigger filter
                  className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-highlight)] focus:outline-none"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Status Filter */}
            <div className="mt-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Status
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="To be watched">To be watched</option>
                <option value="Watching">Watching</option>
                <option value="Complete">Complete</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="watch-list">
        {currentReviews.length === 0 ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            <p>No watches found matching your criteria.</p>
          </div>
        ) : (
          currentReviews.map((review) => (
            <div className="row mb-2 watch-item" key={review.sys.id}>
              <article
                className="watch-list-item"
                itemScope
                itemType="http://schema.org/Review"
              >
                <div>
                  <div className="flex flex-row justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-xl">{review.title}</h2>
                    </div>
                    <div className="flex flex-col items-end ml-4">
                    
                      {/* {review.completionDate && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Completed: {new Date(review.completionDate).toLocaleDateString()}
                        </div>
                      )} */}
                    </div>
                  </div>

                  <section className="flex flex-row justify-between mt-1">
                    {review.status === "Complete" ? (
                      <a className="text-sm min-w-fit whitespace-nowrap" href={`/digital-garden/reading/${review.sys.id}`}>
                        <span>Read Review</span>
                        <span className="sr-only">Read review for {review.title}</span>
                      </a>
                    ) : <span className="text-sm mt-2 mr-4 text-gray-500 dark:text-gray-400">Currently reading...</span>}
                  </section>
                </div>
              </article>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4">
          <nav className="justify-center flex items-center space-x-2" aria-label="Pagination">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex space-x-2">
              {renderPageNumbers()}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default WatchListComponent;