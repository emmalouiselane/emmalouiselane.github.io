// eslint-disable-next-line no-unused-vars
import * as React from "react"
import { useState } from "react"

import { Link, graphql } from "gatsby"

import Layout from "../../components/layout"
import Seo from "../../components/seo"
import { useTracking } from "../../hooks/useTracking"

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import QuickNavComponent from "../../components/quick-nav";

const GamingIndex = ({ data, location }) => {
  const { trackEvent } = useTracking();

  const [games, setGames] = useState([
    {
      name: "Stardew Valley",
      slug: "stardew-valley"
    }
  ]);
  
  const handleGameClick = (gameSlug, gameTitle) => {
    trackEvent('game_clicked', {
      game_slug: gameSlug,
      game_title: gameTitle
    });
  };

  if (games.length === 0) {  
    return (
      <Layout location={location}>
        <Container>
          <Row>
            No games found.
          </Row>
        </Container>
      </Layout>
    )
  } else {
    return (
      <Layout location={location}>
        <QuickNavComponent /> 

        <Container className="workshop-list"> 
            {games.map(game => {  
              return (
                <Row key={game.slug}>
                  <Col>
                    <Link className="workshop-link" to={`/workshop/gaming/${game.slug}`} itemProp="url" onClick={() => handleGameClick(game.slug, game.name)}>
                      <div>
                        <p>{game.name}</p>
                      </div>
                    </Link>
                  </Col>
                </Row>
              )
            })}
        </Container>
      </Layout>
    )
  }
}

export default GamingIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Gaming" description="My go to games!" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
  }
`
