import { useState, useEffect } from 'react';
import { getAllRecipes, getAllBlogs, getAllPortfolioItems } from '../lib/contentful';
import moment from 'moment';

interface Recipe {
  slug: string;
  name: string;
  rating?: number;
  personalNote?: string;
}

interface Blog {
  slug: string;
  title: string;
  date: string;
  description: string;
}

interface PortfolioItem {
  slug: string;
  title: string;
  description: string;
}

const HomeContent = () => {
  const [recentRecipe, setRecentRecipe] = useState<Recipe | null>(null);
  const [recentBlog, setRecentBlog] = useState<Blog | null>(null);
  const [recentPortfolioItem, setRecentPortfolioItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipes, blogs, portfolioItems] = await Promise.all([
          getAllRecipes(),
          getAllBlogs(),
          getAllPortfolioItems()
        ]);

        setRecentRecipe(recipes.length > 0 ? recipes[0] : null);
        setRecentBlog(blogs.length > 0 ? blogs[0] : null);
        setRecentPortfolioItem(portfolioItems.length > 0 ? portfolioItems[0] : null);
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
      <div className="text-center">
        <h2 className='text-xl'> ✨ Hello and welcome to my site! ✨ </h2>
        <p>This site is a true labour of love - I'm still working on the content but in the meantime, you can check out my blog, digital garden or some of my latest additions below!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recentRecipe && (
          <div className="container mt-4 latest-block blue">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">Latest Recipe...</h2>
              <h3 className="text-lg font-bold text-center">
                <a href={`/digital-garden/recipes/${recentRecipe.slug}`}>
                  {recentRecipe.name} →
                </a>
              </h3>
              {recentRecipe.rating && (
                <p className="text-sm mb-3 text-center">
                  {'⭐'.repeat(recentRecipe.rating)}
                </p>
              )}
              {recentRecipe.personalNote && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">{recentRecipe.personalNote}</p>
              )}
            </div>
          </div>
        )}

        {recentBlog && (
          <div className="container mt-4 latest-block pink">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">Latest Blog...</h2>
              <h3 className="text-lg font-bold text-center">
                <a href={`/blog-posts/${recentBlog.slug}`}>
                  {recentBlog.title} →
                </a>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 text-center">Posted {moment(recentBlog.date).format("DD MMM, YYYY")}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">{recentBlog.description}</p>
            </div>
          </div>
        )}

        {recentPortfolioItem && (
          <div className="container mt-4 latest-block blue">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">Latest Project...</h2>
              <h3 className="text-lg font-bold text-center">
                <a href={`/portfolio/${recentPortfolioItem.slug}`}>
                  {recentPortfolioItem.title} →
                </a>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">{recentPortfolioItem.description}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HomeContent;