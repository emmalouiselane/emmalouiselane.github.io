// eslint-disable-next-line no-unused-vars
import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../../../components/layout"

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import QuickNavComponent from "../../../components/quick-nav";
import { Tabs, Tab } from "react-bootstrap";

const StardewValleyTemplate = ({ data, location, pageContext }) => {

  return (
    <Layout location={location}>
      <QuickNavComponent /> 

      <Container className="portfolio-item-content">
        <article>
          <header>
            <h2>
                Stardew Valley
            </h2>
          </header>
          
          <section>
            <Row>
              <Col>
                <p>I love Stardew Valley! It's my ultimate cosy game. I can happily spend hours tending my farm, fishing by the river, exploring the mines, or just wandering through Pelican Town. With all the mods I use, there's always something new to discover, which makes it even easier to lose track of time in its charm.</p>
              </Col>
            </Row>

            <Tabs defaultActiveKey="museum-layout">
                <Tab eventKey="museum-layout" title="Museum Layout Reference">                    
                    <StaticImage 
                      src="../../../images/gaming/museum-layout.png" 
                      alt="Museum Layout Reference"
                      placeholder="blurred"
                      layout="constrained"
                      height={500}
                    />
                </Tab>
            </Tabs>
          </section>
        </article>
      </Container>
    </Layout>
  )
}

export default StardewValleyTemplate
