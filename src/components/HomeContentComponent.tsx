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
  const [showLatestAdditions, setShowLatestAdditions] = useState(false);
  const [showDigitalGarden, setShowDigitalGarden] = useState(false);

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
    return <div className="home-content-loading">Loading...</div>;
  }

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__intro">
          <p className="home-kicker">Hello hello!</p>
          <h1>My digital garden for code, projects, recipes and notes.</h1>
          <p className="home-hero__lede">
            This is where I keep track of what I am building, learning and enjoying: technical posts, portfolio work, recipes, reading notes, cosy game references and the odd personal musing. It is a true labour of love, and I may never quite finish it.
          </p>

          <div className="home-hero__actions">
            <a href="/blog-posts/" className="home-pill">Read the blog</a>
            <a href="/digital-garden/" className="home-pill home-pill--secondary">Explore the garden</a>
            <a href="mailto:emma@sparklane.dev" className="home-pill home-pill--secondary">Work with me</a>
          </div>

          <div className="pressed-hero-flower pressed-hero-flower--sprig" aria-hidden="true">
            <img src="/images/flowers/pressed-sprig.svg" alt="" />
          </div>
        </div>

        <aside className="home-hero__note">
          <span className="home-note__pin" aria-hidden="true"></span>
          <p className="home-note__label">At the moment</p>
          <ul>
            <li>Accessibility-first websites, CMS builds and practical tools</li>
            <li>Technical posts, personal musings and portfolio experiments</li>
            <li>Recipes, reading notes, music recommendations and cosy game references</li>
            <li>Dissertation work and MSc Deepfake Defence updates</li>
          </ul>
        </aside>
      </section>

      <section className="home-feature-strip">
        <a href="mailto:emma@sparklane.dev" className="home-feature-card home-feature-card--work">
          <p className="home-card__eyebrow">Freelance availability</p>
          <h2>Open to work</h2>
          <p>If you have a project in mind, I would love to hear from you. I am especially interested in thoughtful websites, accessible user experiences, and practical tools that make people&apos;s lives a bit easier.</p>
          <span className="home-card__cta">Email me</span>
        </a>

        <a href="/dissertation/" className="home-feature-card home-feature-card--wide">
          <p className="home-card__eyebrow">Featured collection</p>
          <h2>Dissertation hub</h2>
          <p>Browse all dissertation-related posts and my MSc Deepfake Defence project in one place.</p>
          <span className="home-card__cta">Visit the dissertation hub</span>
        </a>
      </section>

      <section className="home-section">
         {!showLatestAdditions && (
            <button
              type="button"
              className="home-section__toggle"
              onClick={() => setShowLatestAdditions((current) => !current)}
              aria-expanded={showLatestAdditions}
              aria-controls="digital-garden-content"
            >
              Want to see the latest additions?
            </button>
        )}

        {showLatestAdditions && (
          <div id="latest-additions-content" className="home-section__content">
            <div className="home-section__heading">
              <p className="home-kicker">Latest additions</p>
              <h2>What I have been adding recently</h2>
            </div>

            <div className="home-grid home-grid--primary">
              {recentBlog && (
                <a href={`/blog-posts/${recentBlog.slug}/`} className="home-card home-card--journal">
                  <p className="home-card__eyebrow">Blog</p>
                  <div className="home-card__meta">{moment(recentBlog.date).format('DD MMM YYYY')}</div>
                  <h3>{recentBlog.title}</h3>
                  <p>{recentBlog.description}</p>
                </a>
              )}

              {recentPortfolioItem && (
                <a href={`/portfolio/${recentPortfolioItem.slug}/`} className="home-card home-card--project">
                  <p className="home-card__eyebrow">Portfolio</p>
                  {recentPortfolioItem.sys?.publishedAt && (
                    <div className="home-card__meta">{moment(recentPortfolioItem.sys.publishedAt).format('DD MMM YYYY')}</div>
                  )}
                  <h3>{recentPortfolioItem.title}</h3>
                  <p>{recentPortfolioItem.description}</p>
                </a>
              )}
            </div>
          </div>
        )}
      </section>

    {showLatestAdditions && (
      <section className="home-section">
        {!showDigitalGarden && (
          <button
            type="button"
            className="home-section__toggle"
            onClick={() => setShowDigitalGarden((current) => !current)}
            aria-expanded={showDigitalGarden}
            aria-controls="digital-garden-content"
          >
            More from the digital garden?
          </button>
        )}

        {showDigitalGarden && (
          <div id="digital-garden-content" className="home-section__content">
            <div className="home-section__heading">
              <p className="home-kicker">From the digital garden</p>
              <h2>Small updates and recommendations</h2>
            </div>

            <div className="home-grid home-grid--secondary">
              {recentRead && (
                <a href={`/digital-garden/reading/${recentRead.sys.id}/`} className="home-card home-card--garden">
                  <p className="home-card__eyebrow">Reading</p>
                  <h3>{recentRead.title}</h3>
                  <p>by {recentRead.author?.name || 'Unknown Author'}</p>
                </a>
              )}

              {recentRecipe && (
                <a href={`/digital-garden/recipes/${recentRecipe.slug}/`} className="home-card home-card--garden">
                  <p className="home-card__eyebrow">Recipe</p>
                  <h3>{recentRecipe.name}</h3>
                  <p>{recentRecipe.rating ? `${String.fromCharCode(9733).repeat(recentRecipe.rating)} personal rating` : 'New recipe! Not yet rated'}</p>
                </a>
              )}

              {recentWatch && (
                <a href={`/digital-garden/watching/${recentWatch.sys.id}/`} className="home-card home-card--garden">
                  <p className="home-card__eyebrow">Watching</p>
                  <h3>{recentWatch.title}</h3>
                  <p>{recentWatch.type} ~ {recentWatch.status}</p>
                </a>
              )}
            </div>
          </div>
        )}
      </section>
    )}
    </div>
  );
};

export default HomeContentComponent;
