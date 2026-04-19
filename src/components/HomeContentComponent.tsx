import type { Recipe } from '../interface/Recipe';
import type { Blog } from '../interface/Blog';
import type { PortfolioItem } from '../interface/PortfolioItem';
import type { BookReview } from '../lib/types/bookReview';
import type { WatchList } from '../lib/types/watchList';

import moment from 'moment';

import { useState, useEffect } from 'react';
import {
  getAllRecipes,
  getAllBlogs,
  getAllPortfolioItems,
  getAllBookReviews,
  getAllWatchList
} from '../lib/contentful';

const HomeContentComponent = () => {
  const [recentRecipe, setRecentRecipe] = useState<Recipe | null>(null);
  const [recentBlog, setRecentBlog] = useState<Blog | null>(null);
  const [recentPortfolioItem, setRecentPortfolioItem] = useState<PortfolioItem | null>(null);
  const [recentRead, setRecentRead] = useState<BookReview | null>(null);
  const [recentWatch, setRecentWatch] = useState<WatchList | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipes, blogs, portfolioItems, reviews, watchList] = await Promise.all([
          getAllRecipes(),
          getAllBlogs(),
          getAllPortfolioItems(),
          getAllBookReviews(),
          getAllWatchList()
        ]);

        const latestNonDissertationBlog = blogs.find(
          (post) => !(post.blogType || []).some((type) => type.toLowerCase().includes('dissertation'))
        ) ?? null;

        const latestNonDissertationPortfolio = portfolioItems.find((item) => {
          const slug = item.slug?.toLowerCase() || '';
          const title = item.title?.toLowerCase() || '';
          return slug !== 'msc-deepfake-defence' && !title.includes('dissertation');
        }) ?? null;

        setRecentRecipe(recipes.length > 0 ? recipes[0] : null);
        setRecentBlog(latestNonDissertationBlog);
        setRecentPortfolioItem(latestNonDissertationPortfolio);

        const completedReviews = reviews.filter((review) => review.status === 'Complete');
        setRecentRead((completedReviews.length > 0 ? completedReviews : reviews)[0] ?? null);
        setRecentWatch(watchList.length > 0 ? watchList[0] : null);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <>
      <div className="text-center my-10">
        <h2 className='text-xl'>Hello and welcome to my site!</h2>
        <p>This site is a true labour of love - I'm still working on the content and may <i>never</i> finish it, but in the meantime, you can check out my blog, digital garden or some of my latest additions below!</p>
      </div>

      <div className="mx-10 space-y-6">
        <a href="/dissertation/" className="latest-block pink block group">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-transparent transition-colors group-hover:border-[var(--color-primary)]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold">Interested in my MSc dissertation?</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Browse all dissertation-related posts and my MSc Deepfake Defence project in one place.</p>
              </div>
              <span className="inline-block px-3 py-1 text-sm rounded-md bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white whitespace-nowrap">
                Visit Dissertation Hub
              </span>
            </div>
          </div>
        </a>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentBlog && (
            <a href={`/blog-posts/${recentBlog.slug}/`} className="latest-block pink block group">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-transparent transition-colors group-hover:border-[var(--color-primary)] h-full flex flex-col justify-start">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="text-xl font-semibold">Latest Blog...</h2>
                  <span className="inline-block px-2 py-1 text-xs rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {moment(recentBlog.date).format('DD MMM, YYYY')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-center">{recentBlog.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">{recentBlog.description}</p>
              </div>
            </a>
          )}

          {recentPortfolioItem && (
            <a href={`/portfolio/${recentPortfolioItem.slug}/`} className="latest-block blue block group">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-transparent transition-colors group-hover:border-[var(--color-secondary)] h-full flex flex-col justify-start">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="text-xl font-semibold">Latest Portfolio Update...</h2>
                  {recentPortfolioItem.sys?.publishedAt && (
                    <span className="inline-block px-2 py-1 text-xs rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {moment(recentPortfolioItem.sys.publishedAt).format('DD MMM, YYYY')}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-center">{recentPortfolioItem.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">{recentPortfolioItem.description}</p>
              </div>
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentRead && (
            <a href={`/digital-garden/reading/${recentRead.sys.id}/`} className="latest-block pink block group">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-transparent transition-colors group-hover:border-[var(--color-primary)] h-full flex flex-col justify-start">
                <h2 className="text-lg font-semibold mb-2">Latest Read...</h2>
                <h3 className="text-base font-bold text-center">{recentRead.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">by {recentRead.author?.name || 'Unknown Author'}</p>
              </div>
            </a>
          )}

          {recentRecipe && (
            <a href={`/digital-garden/recipes/${recentRecipe.slug}/`} className="latest-block blue block group">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-transparent transition-colors group-hover:border-[var(--color-secondary)] h-full flex flex-col justify-start">
                <h2 className="text-lg font-semibold mb-2">Latest Recipe...</h2>
                <h3 className="text-base font-bold text-center">{recentRecipe.name}</h3>
                {recentRecipe.rating && (
                  <p className="text-sm mb-2 text-center">
                    {'⭐'.repeat(recentRecipe.rating)}
                  </p>
                )}
              </div>
            </a>
          )}

          {recentWatch && (
            <a href={`/digital-garden/watching/${recentWatch.sys.id}/`} className="latest-block blue block group">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-transparent transition-colors group-hover:border-[var(--color-secondary)] h-full flex flex-col justify-start">
                <h2 className="text-lg font-semibold mb-2">Latest Watch...</h2>
                <h3 className="text-base font-bold text-center">{recentWatch.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">{recentWatch.type} ~ {recentWatch.status}</p>
              </div>
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export default HomeContentComponent;
