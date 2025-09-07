// eslint-disable-next-line no-unused-vars
import * as React from "react"
import { useState } from "react"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../../../components/layout"

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import QuickNavComponent from "../../../components/quick-nav";
import { Tabs, Tab, Button } from "react-bootstrap";

const StardewValleyTemplate = ({ data, location, pageContext }) => {

  const [showLargeMuseumLayout, setShowLargeMuseumLayout] = useState(false);
  const [showLargeFishGuide, setShowLargeFishGuide] = useState(false);



  return (
    <Layout location={location}>
      <QuickNavComponent /> 

      <Container className="gaming-item-content">
        <article>
          <header>
            <h2>
                Stardew Valley
            </h2>
          </header>
          
          <section>
            <Row>
              <Col>
                <p>
                  I love Stardew Valley! It's my ultimate cosy game. I can happily spend hours tending my farm, fishing by the river, exploring the mines, or just wandering through Pelican Town. 
                  With all the mods I use, there's always something new to discover, which makes it even easier to lose track of time in its charm.
                </p>
                <p>The resources below are for my own reference and have been added for ease of access - I've either created them, or sourced them elsewhere. Where they've been sourced elsewhere, I've added a note as to the creator/owner.</p>
              </Col>
            </Row>

            <Tabs defaultActiveKey="museum-layout" fill>
                <Tab eventKey="museum-layout" title="Museum Layout Reference">
                  <div className="image-layout">
                    <p>Source: <a href="https://www.reddit.com/r/StardewValleyExpanded/comments/1hfag51/my_museum_layout/" target="_blank">u/FoxgloveAndFireflies</a></p>
                 
                    {showLargeMuseumLayout && (
                      <StaticImage 
                        src="../../../images/gaming/museum-layout.png" 
                        alt="Museum Layout Reference"
                        placeholder="blurred"
                      />
                    )}
                    {!showLargeMuseumLayout && (
                      <StaticImage 
                        src="../../../images/gaming/museum-layout.png" 
                        alt="Museum Layout Reference"
                        placeholder="blurred"
                        layout="constrained"
                        height={400}
                      />
                    )}
                    
                    <Button onClick={() => setShowLargeMuseumLayout(!showLargeMuseumLayout)}>
                      Toggle Image Size
                    </Button>
                  </div>
                </Tab>
                <Tab eventKey="fish-guide" title="Fish Guide">        
                <div className="image-layout">
                    <p>Source: <a href="https://www.reddit.com/r/StardewValley/comments/7rekkf/updated_visual_fish_by_season/" target="_blank">u/Fynzou</a></p>

                    {showLargeFishGuide && (
                      <StaticImage 
                        src="../../../images/gaming/fish-guide.png" 
                        alt="Fish Guide"
                        placeholder="blurred"
                      />
                    )}
                    {!showLargeFishGuide && (
                      <StaticImage 
                        src="../../../images/gaming/fish-guide.png" 
                        alt="Fish Guide"
                        placeholder="blurred"
                        layout="constrained"
                        height={400}
                      />
                    )}
                    <p>Created by me</p>
                    <Button onClick={() => setShowLargeFishGuide(!showLargeFishGuide)}>
                      Toggle Image Size
                    </Button>
                  </div>            
                </Tab>
            </Tabs>
          </section>
        </article>
      </Container>
    </Layout>
  )
}

export default StardewValleyTemplate
