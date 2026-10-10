import { useState, useEffect } from 'react';
import type { BookReview } from '../lib/types/bookReview';

import { READING_PAGE_SIZE } from '../lib/pagination';
import Pagination from './PaginationComponent';

interface Props { initialReviews: BookReview[]; initialPage?: number; }

const BookReviewsList = ({ initialReviews, initialPage = 1 }: Props) => {
  const allReviews = initialReviews;
  const [filteredReviews, setFilteredReviews] = useState<BookReview[]>(initialReviews);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    setSelectedGenre(new URLSearchParams(window.location.search).get('genre') ?? '');
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
    setCurrentPage(searchTerm !== '' || selectedGenre !== '' || selectedStatus !== '' ? 1 : initialPage);
  }, [searchTerm, selectedGenre, selectedStatus, allReviews, initialPage]);

  const genres = Array.from(new Set(allReviews.flatMap(review => review.genres || [])));

  const totalPages = Math.ceil(filteredReviews.length / READING_PAGE_SIZE);
  const startIndex = (currentPage - 1) * READING_PAGE_SIZE;
  const endIndex = startIndex + READING_PAGE_SIZE;
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

  return (
    <div className="reading-page garden-list-page">
      <section className="garden-list-hero garden-list-hero--reading">
        <p className="home-kicker">Digital garden</p>
        <h1>What I have been reading.</h1>
        <p>
          Part reading journal, part recommendation shelf. This is where I keep track of what I have read, what I am working through, and what might be worth passing on.
        </p>
              <div className="garden-hero-flower garden-hero-flower--bloom" aria-hidden="true">
          <img src="/images/flowers/pressed-bloom.svg" alt="" width="220" height="220" />
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
            <article className="review-list-item garden-list-card" key={review.sys.id}>
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
                  <span>Completed: {new Date(review.completionDate).toLocaleDateString('en-GB', { timeZone: 'UTC' })}</span>
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

      <Pagination
        basePath="/digital-garden/reading/"
        currentPage={currentPage}
        totalPages={totalPages}
        filtered={searchTerm !== '' || selectedGenre !== '' || selectedStatus !== ''}
        onPageChange={handlePageChange}
        variant="garden"
      />
    </div>
  );
};

export default BookReviewsList;


