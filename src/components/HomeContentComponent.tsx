import type { Recipe } from '../interface/Recipe';
import type { Blog } from '../interface/Blog';
import type { PortfolioItem } from '../interface/PortfolioItem';
import type { BookReview } from '../lib/types/bookReview';
import type { WatchList } from '../lib/types/watchList';

import moment from 'moment';

interface Props {
  recentRecipe: Recipe | null;
  recentBlog: Blog | null;
  recentPortfolioItem: PortfolioItem | null;
  recentRead: BookReview | null;
  recentWatch: WatchList | null;
}

const HomeContentComponent = ({ recentRecipe, recentBlog, recentPortfolioItem, recentRead, recentWatch }: Props) => {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__intro">
          <p className="home-kicker">Hello hello!</p>
          <h1>My digital garden for code, projects, recipes and notes.</h1>
          <p className="home-hero__lede">
            This is where I'm keeping track of what I am building, learning and enjoying: technical posts, portfolio work, recipes, reading notes, cosy game references and the odd personal musing. It is a labour of love, and I doubt I'll ever finish it.
          </p>

          <div className="home-hero__actions button-group">
            <a href="/blog-posts/" className="home-pill">Read the blog</a>
            <a href="/about/" className="home-pill home-pill--secondary">About me</a>
            <a href="/digital-garden/" className="home-pill home-pill--secondary">Explore the garden</a>
          </div>

          <div className="pressed-hero-flower pressed-hero-flower--sprig" aria-hidden="true">
            <img src="/images/flowers/pressed-sprig.svg" alt="" width="220" height="252" />
          </div>
        </div>

        <aside className="home-hero__note">
          <p className="home-note__label">At the moment</p>
          <ul>
            <li>Technical posts, personal musings and portfolio experiments</li>
            <li>Recipes, reading notes, musical obsessions and cosy game references</li>
            <li>Accessibility-first websites, CMS builds and practical tools</li>
            <li>Reflections on renovating an old house</li>
          </ul>
        </aside>
      </section>

      <section className="home-feature-strip">
        <article className="home-feature-card home-feature-card--work">
          <p className="home-card__eyebrow">Freelance availability</p>
          <h2>Open to work</h2>
          <p>If you have a project in mind, I would love to hear from you. I am especially interested in thoughtful websites, accessible user experiences, and practical tools that will make people's lives even a little bit easier.</p>
          <p>I also welcome <a href="/freelance/#tech-for-good">tech for good and charity projects</a>, with support available free of charge or at heavily reduced rates depending on scope and availability.</p>
          <a href="/freelance/" className="home-card__cta">Explore freelance services</a>
        </article>

        <article className="home-feature-card home-feature-card--wide">
          <p className="home-card__eyebrow">Featured collection</p>
          <h2>Research hub</h2>
          <p>Browse all of my research and dissertation-related posts as well as my any research projects like the MSc Deepfake Defence project in one place.</p>
          <a href="/research-hub/" className="home-card__cta">Visit my research hub</a>
        </article>
      </section>

      <section className="home-section">
        <details className="home-disclosure">
          <summary className="home-section__toggle">
            <span className="home-disclosure__show">Want to see the latest additions?</span>
            <span className="home-disclosure__hide">Hide the latest additions</span>
          </summary>
          <div id="latest-additions-content" className="home-section__content">
            <div className="home-section__heading">
              <p className="home-kicker">Latest additions</p>
              <h2>What have I been adding recently?</h2>
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
          <section className="home-section home-section--garden">
            <details className="home-disclosure">
              <summary className="home-section__toggle">
                <span className="home-disclosure__show">More from the digital garden?</span>
                <span className="home-disclosure__hide">Hide the digital garden updates</span>
              </summary>
              <div id="digital-garden-content" className="home-section__content">
                <div className="home-section__heading">
                  <p className="home-kicker">Direct from the digital garden</p>
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
            </details>
          </section>
        </details>
      </section>
    </div>
  );
};

export default HomeContentComponent;
