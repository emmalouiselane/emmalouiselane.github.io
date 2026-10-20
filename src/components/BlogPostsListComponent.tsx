import { useState, useEffect } from 'react';
import type { BlogPost } from '../lib/types/blogPost';
import moment from 'moment';

import { BLOG_PAGE_SIZE } from '../lib/pagination';
import Pagination from './PaginationComponent';

interface Props { initialPosts: BlogPost[]; initialPage?: number; }

const BlogPostsListComponent = ({ initialPosts, initialPage = 1 }: Props) => {
  const allPosts = initialPosts;
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(initialPosts);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlogType, setSelectedBlogType] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    setSelectedBlogType(new URLSearchParams(window.location.search).get('type') ?? '');
  }, []);

  useEffect(() => {
    let filtered = allPosts;

    if (searchTerm !== '') {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedBlogType !== '') {
      filtered = filtered.filter(post => post.blogType?.includes(selectedBlogType));
    }

    setFilteredPosts(filtered);
    setCurrentPage(searchTerm !== '' || selectedBlogType !== '' ? 1 : initialPage);
  }, [searchTerm, selectedBlogType, allPosts, initialPage]);

  const blogTypes = [...new Set(allPosts.flatMap(post => post.blogType || []))];

  const totalPages = Math.ceil(filteredPosts.length / BLOG_PAGE_SIZE);
  const startIndex = (currentPage - 1) * BLOG_PAGE_SIZE;
  const endIndex = startIndex + BLOG_PAGE_SIZE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

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
    setSelectedBlogType('');
    setIsFilterOpen(false);
  };

  const hasActiveFilters = searchTerm !== '' || selectedBlogType !== '';

  return (
    <div className="blog-index-page">
      <section className="blog-index-hero">
        <div>
          <p className="home-kicker">Blog posts</p>
          <h1>Technical posts, personal musings and anything I wanted to write down.</h1>
          <p>
            A mix of development notes, accessibility thoughts and whatever else has been taking up space in my brain recently.
          </p>
        </div>

        <div className="pressed-hero-flower pressed-hero-flower--bloom" aria-hidden="true">
          <img src="/images/flowers/pressed-bloom.svg" alt="" width="220" height="220" />
        </div>

        <div className="blog-index-toolbar">
          <p><strong>{Math.min(endIndex, filteredPosts.length)}</strong> of {filteredPosts.length} posts found</p>
          <div className="blog-index-actions button-group">
            <button
              onClick={toggleFilters}
              className="blog-icon-button"
              aria-label="Toggle filters"
              aria-expanded={isFilterOpen}
            >
              <svg className="blog-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
            </button>
            <button
              onClick={clearFilters}
              className="blog-icon-button blog-icon-button--secondary"
              aria-label="Clear filters"
              disabled={!hasActiveFilters}
            >
              <svg className="blog-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
              </svg>
            </button>
          </div>
        </div>
      </section>

      <div className="blog-filter-wrapper">
        {isFilterOpen && (
          <div className="blog-filter-panel">
            <div className="blog-filter-field">
              <label htmlFor="search">Search posts</label>
              <div className="blog-search-row">
                <input
                  type="text"
                  id="search"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={() => setSearchTerm(searchTerm)}>Search</button>
              </div>
            </div>

            <div className="blog-filter-field">
              <label htmlFor="blogType">Filter by type</label>
              <select
                id="blogType"
                value={selectedBlogType}
                onChange={(e) => setSelectedBlogType(e.target.value)}
              >
                <option value="">All types</option>
                {blogTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="blog-list">
        {currentPosts.length === 0 ? (
          <div className="blog-empty-state">
            <p>No posts found matching your criteria.</p>
          </div>
        ) : (
          currentPosts.map((post) => (
            <article
              className="post-list-item"
              key={post.sys.id}
            >
              <div className="post-list-item__topline">
                <time dateTime={post.date}>{moment(post.date).format('DD MMM YYYY')}</time>
                {post.blogType && post.blogType.length > 0 && (
                  <div className="post-list-item__tags">
                    {post.blogType.map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedBlogType(type)}
                        title={`Filter by ${type}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <h2>{post.title}</h2>
              <p>{post.description}</p>

              <a className="post-list-item__link" href={`/blog-posts/${post.slug}/`}>
                <span>Read more</span>
                <span className="sr-only"> about {post.title}</span>
              </a>
            </article>
          ))
        )}
      </div>

      <Pagination
        basePath="/blog-posts/"
        currentPage={currentPage}
        totalPages={totalPages}
        filtered={searchTerm !== '' || selectedBlogType !== ''}
        onPageChange={handlePageChange}
        variant="blog"
      />
    </div>
  );
};

export default BlogPostsListComponent;

