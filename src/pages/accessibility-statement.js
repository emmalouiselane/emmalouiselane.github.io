import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const AccessibilityStatementPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
        <div class="accessibility-wrapper">   
            <h2>Accessibility Statement for <span class="basic-information website-name">Spark Lane Dev</span></h2>
            <p>
                This is an accessibility statement from <span class="basic-information organization-name">Spark Lane Dev</span>.
            </p>
            <h3>Measures to support accessibility</h3>
            <p>
                <span class="basic-information organization-name">Spark Lane Dev{` `}</span>
                takes the following measures to ensure accessibility of{` `}
                <span class="basic-information website-name">Spark Lane Dev</span>:
            </p>
            <ul class="organizational-effort accessibility-measures">
                <li>Include accessibility as part of our mission statement.</li>
                <li>Include accessibility throughout our internal policies.</li>
                <li>Provide continual accessibility training for our staff.</li>
                <li>Assign clear accessibility goals and responsibilities.</li>
            </ul>
            <h3>Conformance status</h3>
            <p>
                The <a href="https://www.w3.org/WAI/standards-guidelines/wcag/">Web Content Accessibility Guidelines (WCAG)</a> defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
                <span class="basic-information website-name">{` `}Spark Lane Dev{` `}</span>
                is{` `}
                <span class="basic-information conformance-status" data-printfilter="lowercase">partially conformant{` `}</span>
                with{` `}
                <span class="basic-information conformance-standard"><span data-negate="">WCAG 2.2 level AA</span>.</span>{` `}
                <span>
                <span class="basic-information conformance-status">Partially conformant</span>{` `}
                means that{` `}
                <span class="basic-information conformance-meaning">some parts of the content do not fully conform to the accessibility standard</span>.
            </span>
            </p>
            <h3>Feedback</h3>
            <p>
                We welcome your feedback on the accessibility of{` `}
                <span class="basic-information website-name">Spark Lane Dev</span>.
                Please let us know if you encounter accessibility barriers on{` `}
                <span class="basic-information website-name">Spark Lane Dev</span>:
            </p>
            <ul class="basic-information feedback h-card">
                <li>
                E-mail:{` `}
                <a class="email u-email" href="mailto:emma.louise.lane@pm.me">emma.louise.lane@pm.me</a>
            </li>
            </ul>
            <hr noshade="noshade" />
            <h3>Date</h3>
            <p>
                This statement was created on
                <span class="basic-information statement-created-date">31 May 2025</span>
                {` `}using the <a href="https://www.w3.org/WAI/planning/statements/">W3C Accessibility Statement Generator Tool</a>.
            </p>
        </div>
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
