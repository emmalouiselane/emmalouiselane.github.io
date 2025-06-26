// eslint-disable-next-line no-unused-vars
import * as React from "react"
import { useState, useEffect } from "react"
import moment from "moment"

//import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

import { entriesClient } from "../api/contentful/contentful-entries";
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { useTracking } from "../hooks/useTracking"

const BlogIndex = ({ data, location }) => {
  const { trackEvent } = useTracking();

  const [blogPosts, setBlogPosts] = useState([]);

  const siteTitle = data.site.siteMetadata?.title || `Title`
  
  useEffect(() => {
    async function getBlogPosts() {
      const posts = await entriesClient.getAllBlogs();
      setBlogPosts(posts);
    }
    getBlogPosts();
  }, []);

  const handlePostClick = (postSlug, postTitle) => {
    trackEvent('blog_post_clicked', {
      post_slug: postSlug,
      post_title: postTitle
    });
  };

  if (blogPosts.length === 0) {  
    return (
      <Layout location={location} title={siteTitle}>
        <p>
          No blog posts found.
        </p>
      </Layout>
    )
  } else {
    return (
      <Layout location={location} title={siteTitle}>
        <div className="blog-list">
          <ol style={{ listStyle: `none` }}>
            {blogPosts.map(post => {
              const title = post.title
  
              return (
                <li key={post.slug}>
                  <article
                    className="post-list-item"
                    itemScope
                    itemType="http://schema.org/Article"
                    
                  >
                    <header>
                      <h2>
                        <Link to={`/blog-posts/${post.slug}`} itemProp="url" onClick={() => handlePostClick(post.slug, title)}>
                          <span itemProp="headline">{title}</span>
                        </Link>
                      </h2>
                      <small>{moment(post.date).format("MMMM DD, YYYY")}</small>
                    </header>
                    <section>
                      <p>{post.description}</p>
                    </section>
                  </article>
                </li>
              )
            })}
          </ol>
        </div>
      </Layout>
    )
  }
}

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Blog Posts" description="Read my latest blog posts!" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
  }
`
