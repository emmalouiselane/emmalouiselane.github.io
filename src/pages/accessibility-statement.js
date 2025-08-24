// eslint-disable-next-line no-unused-vars
import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

import Container from 'react-bootstrap/Container';

const AccessibilityStatementPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
        <Container className="accessibility-wrapper">   
            <h2>Accessibility Statement for <span className="basic-information website-name">Spark Lane Dev</span></h2>
            <p>
                This is an accessibility statement from <span className="basic-information organization-name">Spark Lane Dev</span>.
            </p>
            <h3>Measures to support accessibility</h3>
            <p>
                <span className="basic-information organization-name">Spark Lane Dev{` `}</span>
                takes the following measures to ensure accessibility of{` `}
                <span className="basic-information website-name">Spark Lane Dev</span>:
            </p>
            <ul className="organizational-effort accessibility-measures">
                <li>Include accessibility as part of our mission statement.</li>
                <li>Include accessibility throughout our internal policies.</li>
                <li>Provide continual accessibility training for our staff.</li>
                <li>Assign clear accessibility goals and responsibilities.</li>
            </ul>
            <h3>Conformance status</h3>
            <p>
                The <a href="https://www.w3.org/WAI/standards-guidelines/wcag/">Web Content Accessibility Guidelines (WCAG)</a> defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
                <span className="basic-information website-name">{` `}Spark Lane Dev{` `}</span>
                is{` `}
                <span className="basic-information conformance-status" data-printfilter="lowercase">partially conformant{` `}</span>
                with{` `}
                <span className="basic-information conformance-standard"><span data-negate="">WCAG 2.2 level AA</span>.</span>{` `}
                <span>
                <span className="basic-information conformance-status">Partially conformant</span>{` `}
                means that{` `}
                <span className="basic-information conformance-meaning">some parts of the content do not fully conform to the accessibility standard</span>.
            </span>
            </p>
            <h3>Feedback</h3>
            <p>
                We welcome your feedback on the accessibility of{` `}
                <span className="basic-information website-name">Spark Lane Dev</span>.
                Please let us know if you encounter accessibility barriers on{` `}
                <span className="basic-information website-name">Spark Lane Dev</span>:
            </p>
            <ul className="basic-information feedback h-card">
                <li>
                E-mail:{` `}
                <a className="email u-email" href="mailto:emma@sparklane.dev">emma@sparklane.dev</a>
            </li>
            </ul>
            <hr />
            <h3>Date</h3>
            <p>
                This statement was created on
                <span className="basic-information statement-created-date">31 May 2025</span>
                {` `}using the <a href="https://www.w3.org/WAI/planning/statements/">W3C Accessibility Statement Generator Tool</a>.
            </p>
        </Container>
    </Layout>
  )
}

export const Head = () => <Seo title="Accessibility Statement" />

export default AccessibilityStatementPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
