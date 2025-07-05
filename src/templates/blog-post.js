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

const BlogPostTemplate = ({ location, pageContext }) => {
  const { slug } = pageContext
  const { trackEvent } = useTracking()
  const [post, setPost] = useState(null)

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
      <article className="blog-post">
        <header>
          <h1>{post.title}</h1>
          <p>{moment(post.date).format("MMMM DD, YYYY")}</p>
        </header>
        
        <div>
          {documentToReactComponents(post.blogContent.json, options)}
        </div>
        
        <i style={{ display: "flow", textAlign: "center" }}>
          {"Your insights matter! Let's keep the discussion going!"}
        </i>
        <Bio />
      </article>
    </Layout>
  )
}

export default BlogPostTemplate

