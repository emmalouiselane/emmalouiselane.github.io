// eslint-disable-next-line no-unused-vars
import * as React from "react"
import { useEffect, useState } from "react"
import moment from "moment"
import { entriesClient } from "../api/contentful/contentful-entries"
import Layout from "../components/layout"
import { useTracking } from "../hooks/useTracking"
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { documentToReactComponents  } from "@contentful/rich-text-react-renderer";
import Bio from "../components/bio"

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import QuickNavComponent from "../components/quick-nav";

const BlogPostTemplate = ({ location, pageContext }) => {
  const { slug } = pageContext
  const { trackEvent } = useTracking()
  const [post, setPost] = useState(null)
  const [kudosInitialized, setKudosInitialized] = useState(false);


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await entriesClient.getBlogPostBySlug(slug)
        setPost(post)
        trackEvent('blog_post_viewed', {
          post_title: post?.title
        })
      } catch (error) {
        console.error('Error fetching blog post:', error)
      }
    }

    if (post === null) {
      fetchPost()
    }
  })

  useEffect(() => {
    const button = document.querySelector('.tinylytics_kudos');
    if (button) {
      button.setAttribute('data-path', `/blog-posts/${post.slug}`);
      setKudosInitialized(true);
    }
  }, [post]);

  if (!post) {
    return (
      <Layout location={location}>
        <div>Loading...</div>
      </Layout>
    )
  }

  // Define custom render options for rich text
  const options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => {
        return <p className="blog-post-paragraph">{children}</p>
      },
      [BLOCKS.HEADING_1]: (node, children) => {
        return <h2 className="blog-post-heading">{children}</h2>
      },
      [BLOCKS.HEADING_2]: (node, children) => {
        return <h3 className="blog-post-subheading">{children}</h3>
      },
      // [BLOCKS.EMBEDDED_ASSET]: (node) => {
      //   console.log(node)
      //   return (
      //     <div className="blog-post-image">
      //       <img src={node.data.target.fields.file.url} alt={node.data.target.fields.title} />
      //     </div>
      //   )
      // },
    },
    renderMark: {
      [MARKS.BOLD]: (text) => <strong>{text}</strong>,
      [MARKS.ITALIC]: (text) => <em>{text}</em>,
      [MARKS.UNDERLINE]: (text) => <u>{text}</u>,
    },
  }

  return (
    <Layout location={location}> 
      <QuickNavComponent /> 
      
      <div className="blog-post">
        <article>
          <header>
            <h1>{post.title}</h1>
            <p>{moment(post.date).format("MMMM DD, YYYY")}</p>
            {!kudosInitialized && <button className="tinylytics_kudos"></button>}
          </header>
          
          <Row>
            {documentToReactComponents(post.blogContent.json, options)}
          </Row>
          
          <Row>
            <i style={{ display: "flow", textAlign: "center" }}>
              {"Your insights matter! Let's keep the discussion going!"}
            </i>
          </Row>
          
          <Bio />
        </article>
      </div>
    </Layout>
  )
}

export default BlogPostTemplate

