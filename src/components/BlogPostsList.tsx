import { useState, useEffect } from 'react';
import { getAllBlogs } from '../lib/contentful';
import moment from 'moment';

interface BlogPost {
  sys: { id: string };
  title: string;
  date: string;
  slug: string;
  description: string;
  blogType?: string[];
}

const POSTS_PER_PAGE = 5;

const BlogPostsList = () => {
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
        className={`px-3 py-2 text-sm font-medium rounded-md ${
          pageNum === currentPage
            ? 'text-white bg-gray-900 dark:bg-gray-100 border border-gray-900 dark:border-gray-100'
            : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        {pageNum}
      </button>
    ));
  };

  if (loading) {
    return <div className="text-center py-8">Loading blog posts...</div>;
  }

  return (
    <div className="container">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Blog Posts</h1>

        <div className="flex flex-row">
          <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
            <span>{Math.min(endIndex, filteredPosts.length)}</span> of {filteredPosts.length} posts found
          </div>
          <button
            onClick={toggleFilters}
            className="my-auto ml-2 px-3 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 focus:outline-none"
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
            disabled={searchTerm === '' && selectedBlogType === ''}
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
                Search Posts
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="search"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={() => setSearchTerm(searchTerm)} // Trigger filter
                  className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 focus:outline-none"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Blog Type Filter */}
            <div>
              <label htmlFor="blogType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Type
              </label>
              <select
                id="blogType"
                value={selectedBlogType}
                onChange={(e) => setSelectedBlogType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Types</option>
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
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            <p>No posts found matching your criteria.</p>
          </div>
        ) : (
          currentPosts.map((post, index) => (
            <div className="row mb-2 post-item" key={post.sys.id}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <div>
                  <div className="flex flex-row justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-xl">{post.title}</h2>
                    </div>
                    <small className="text-xs text-gray-600 mt-1 ml-4">{moment(post.date).format("DD/MM/YY")}</small>
                    {post.blogType && post.blogType.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2 ml-3">
                          {post.blogType.map(type => (
                            <span key={type} className="inline-block px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                              {type}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>

                  <section className="flex flex-row justify-between">
                    <p>{post.description}</p>
                    <a className="text-xs mt-auto min-w-fit whitespace-nowrap" href={`/blog-posts/${post.slug}`}>
                      <span>Read More</span>
                      <span className="sr-only">Read more about {post.title}</span>
                    </a>
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
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default BlogPostsList;