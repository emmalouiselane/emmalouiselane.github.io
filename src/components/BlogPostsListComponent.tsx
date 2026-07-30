import { useState, useEffect } from 'react';
import { getAllBlogs } from '../lib/contentful';
import type { BlogPost } from '../lib/types/blogPost';
import moment from 'moment';

const POSTS_PER_PAGE = 6;

const BlogPostsListComponent = () => {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlogType, setSelectedBlogType] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getAllBlogs();
        const sortedPosts = posts.sort((a: BlogPost, b: BlogPost) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setAllPosts(sortedPosts);
        setFilteredPosts(sortedPosts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
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
    setCurrentPage(1);
  }, [searchTerm, selectedBlogType, allPosts]);

  const blogTypes = [...new Set(allPosts.flatMap(post => post.blogType || []))];

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
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
        className={`blog-page-button ${pageNum === currentPage ? 'is-active' : ''}`}
      >
        {pageNum}
      </button>
    ));
  };

  if (loading) {
    return <div className="blog-page-loading">Loading blog posts...</div>;
  }

  return (
    <div className="blog-index-page">
      <section className="blog-index-hero">
        <div>
          <p className="home-kicker">Blog posts</p>
          <h1>Technical posts, personal musings and things I wanted to write down.</h1>
          <p>
            A mix of development notes, accessibility thoughts, dissertation updates and whatever else has been taking up space in my brain recently.
          </p>
        </div>

        <div className="pressed-hero-flower pressed-hero-flower--bloom" aria-hidden="true">
          <img src="/images/flowers/pressed-bloom.svg" alt="" />
        </div>

        <div className="blog-index-toolbar">
          <p><strong>{Math.min(endIndex, filteredPosts.length)}</strong> of {filteredPosts.length} posts found</p>
          <div className="blog-index-actions">
            <button
              onClick={toggleFilters}
              className="blog-icon-button"
              aria-label="Toggle filters"
              aria-expanded={isFilterOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
            </button>
            <button
              onClick={clearFilters}
              className="blog-icon-button blog-icon-button--secondary"
              aria-label="Clear filters"
              disabled={!hasActiveFilters}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
              itemScope
              itemType="http://schema.org/Article"
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

      {totalPages > 1 && (
        <nav className="blog-pagination" aria-label="Pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="blog-page-button"
          >
            Previous
          </button>

          <div className="blog-pagination__pages">
            {renderPageNumbers()}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="blog-page-button"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
};

export default BlogPostsListComponent;

