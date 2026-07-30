import { useState, useEffect } from 'react';
import { getAllBookReviews } from '../lib/contentful';
import type { BookReview } from '../lib/types/bookReview';

const REVIEWS_PER_PAGE = 5;

const getInitialGenre = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  return new URLSearchParams(window.location.search).get('genre') ?? '';
};

const BookReviewsList = () => {
  const [allReviews, setAllReviews] = useState<BookReview[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<BookReview[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(getInitialGenre);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviews = await getAllBookReviews();
        setAllReviews(reviews);
        setFilteredReviews(reviews);
      } catch (error) {
        console.error('Error fetching book reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    let filtered = allReviews;

    if (searchTerm !== '') {
      filtered = filtered.filter(review =>
        review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.author.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre !== '') {
      filtered = filtered.filter(review => review.genres?.includes(selectedGenre));
    }

    if (selectedStatus !== '') {
      filtered = filtered.filter(review => review.status.includes(selectedStatus));
    }

    setFilteredReviews(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedGenre, selectedStatus, allReviews]);

  const genres = Array.from(new Set(allReviews.flatMap(review => review.genres || [])));

  const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const endIndex = startIndex + REVIEWS_PER_PAGE;
  const currentReviews = filteredReviews.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const updateGenreFilter = (genre: string) => {
    setSelectedGenre(genre);

    const url = new URL(window.location.href);
    if (genre) {
      url.searchParams.set('genre', genre);
    } else {
      url.searchParams.delete('genre');
    }
    window.history.replaceState({}, '', url);
  };

  const clearFilters = () => {
    setSearchTerm('');
    updateGenreFilter('');
    setSelectedStatus('');
    setIsFilterOpen(false);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'review-star is-filled' : 'review-star'}>
          {String.fromCharCode(9733)}
        </span>
      );
    }
    return stars;
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
    return <div className="garden-page-loading">Loading books...</div>;
  }

  return (
    <div className="reading-page garden-list-page">
      <section className="garden-list-hero garden-list-hero--reading">
        <p className="home-kicker">Digital garden</p>
        <h1>What I have been reading.</h1>
        <p>
          Part reading journal, part recommendation shelf. This is where I keep track of what I have read, what I am working through, and what might be worth passing on.
        </p>
              <div className="garden-hero-flower garden-hero-flower--bloom" aria-hidden="true">
          <img src="/images/flowers/pressed-bloom.svg" alt="" />
        </div>
      </section>

      <section className="garden-list-toolbar" aria-label="Reading list controls">
        <p><span>{Math.min(endIndex, filteredReviews.length)}</span> of {filteredReviews.length} books found</p>
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
            disabled={searchTerm === '' && selectedGenre === '' && selectedStatus === ''}
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
              <label htmlFor="search">Search Books</label>
              <div className="garden-search-row">
                <input
                  type="text"
                  id="search"
                  placeholder="Search by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={() => setSearchTerm(searchTerm)}>Search</button>
              </div>
            </div>

            {/* Genre Filter */}
            <div className="garden-filter-field">
              <label htmlFor="genre">Filter by Genre</label>
              <select id="genre" value={selectedGenre} onChange={(e) => updateGenreFilter(e.target.value)}>
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="garden-filter-field">
              <label htmlFor="status">Filter by Status</label>
              <select id="status" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="TBR">TBR</option>
                <option value="In Progress">In Progress</option>
                <option value="Complete">Complete</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="garden-card-list review-list">
        {currentReviews.length === 0 ? (
          <div className="garden-empty-state">
            <p>No books found matching your criteria.</p>
          </div>
        ) : (
          currentReviews.map((review) => (
            <article className="review-list-item garden-list-card" key={review.sys.id} itemScope itemType="http://schema.org/Review">
              <div className="garden-list-card__topline">
                <div>
                  <h2>{review.title}</h2>
                  <p>by {review.author.name}</p>
                </div>
                {review.starRating !== null && (
                  <div className="review-rating" aria-label={`${review.starRating} out of 5 stars`}>
                    {renderStars(review.starRating)}
                    <span>({review.starRating}/5)</span>
                  </div>
                )}
              </div>

              {review.genres && review.genres.length > 0 && (
                <div className="garden-tag-list">
                  {review.genres.map(genre => (
                    <button key={genre} onClick={() => updateGenreFilter(genre)} title={`Filter by ${genre}`}>
                      {genre}
                    </button>
                  ))}
                </div>
              )}

              <div className="garden-list-card__footer">
                {review.completionDate && (
                  <span>Completed: {new Date(review.completionDate).toLocaleDateString()}</span>
                )}

                <div className="garden-card-links">
                  {review.amazonLink && (
                    <a href={review.amazonLink} target="_blank" rel="noopener noreferrer">View on Amazon</a>
                  )}
                  {review.status == 'Complete' ? (
                    <a href={`/digital-garden/reading/${review.sys.id}/`}>
                      <span>Read review</span>
                      <span className="sr-only">Read review for {review.title}</span>
                    </a>
                  ) : <span>Currently reading...</span>}
                </div>
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

export default BookReviewsList;


