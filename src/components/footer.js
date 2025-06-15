// eslint-disable-next-line no-unused-vars
import * as React from "react"
import { Link , useStaticQuery, graphql } from "gatsby"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons'

import { useDarkMode } from "../providers/dark-mode-provider"

const Footer = () => {
    const { isDarkMode } = useDarkMode();
 
    const data = useStaticQuery(graphql`
        query SocialQuery {
            site {
            siteMetadata {
                social {
                linkedIn
                gitHub
                }
            }
            }
        }
        `)
    const social = data.site.siteMetadata?.social

  return (
    <div className="footer-content">
        <div className="footer-content-left">
        {/* TODO: Migrate these two links to the about page */}
        {/* <Link className="navbar-link-disabled" aria-disabled="true">Sitemap</Link>
        <Link className="navbar-link-disabled" aria-disabled="true">Changelog</Link> */}
        <Link className="navbar-link" to="/accessibility-statement">Accessibility Statement</Link>
        </div>
        <div className="footer-content-right">
        <a id="not-by-ai" className="badge" href="https://notbyai.fyi">
            {isDarkMode ? (
            <img src="data:image/png;base64,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" alt="Written by a Human, Not by AI" />
            ) : (
            <img src="data:image/png;base64,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" alt="Written by a Human, Not by AI" />
            )}
        </a>
        
        {/* TODO: Add better badge */}
        {/* <img className="badge-img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxAAAAsQAa0jvXUAAAGHaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49J++7vycgaWQ9J1c1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCc/Pg0KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyI+PHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIj48dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCjw/eHBhY2tldCBlbmQ9J3cnPz4slJgLAAACJUlEQVRYR+2ZMWgTURjH/9+7pEtRAiYRCkIcHOKkw2UREhczWIQ+c4mDg3ESWqHX2UE7uOjQRrSOtYuFywunoyIBM5oMTskimNlkOAenHHkO9aR51U5p+xXyG//fN/z47nv34I6UUhrHiNYaRDSROY4zGfwDUkrpbrli5kfOl8WbsG0bl1IpzKXTTyzL2pFS9s2+iBMT3c+PlWUUCoU+Ea07jvPGrAOAMIOTIP1qC73KncxgMNiu1+sbZh1cRCMGyyvodDpuo9HYNmusRAFg/tlzNJvNqjlZdqIAcH7rNYbDoet5nhtlpJTS+r0z2ckEfcsL4vH4RSllwHKiEa1WKxGGoQuujz6i8PMltNarvu8nWIsCQK/XS4RheIW96OVvjwFgib0oABBRgZRS+qzgeeojgtDjfeojhBD8D1PETHTazESnDSmltPNxzcxZoYobp2eiM9FpMxOdNqdGdO/19PSXmbNCPZqHGI/HgVngiBBC/Pd7DyeE1vrz4oJn5uwQAN7lcjkzZ4eIxWJfs9ks+z0VUsqAiGoPr7XNGisIAHzfT4xGo+/+3U8Js4EDpd3i3gtfShlYlrWef3HV7GHD35upVCptJpPJ2rkHc5MdTJi4QsvlspvP53curPHbgAN3faVSqdq2XeO2BgdE8WeyqVTq/u23N/pcVuHQ/zu+72fCMKwCuNftdjPtdhtnPiyYbUdOabd4uOh+lFJLWuvrRLRq1o6D340uqX1G3GeOAAAAAElFTkSuQmCC" alt="LGBTQ+ Friendly" /> */}
        
        {/* <div>
            <a href="https://jigsaw.w3.org/css-validator/validator?uri=https://sparklane.dev/">
            <img src=" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAPCAMAAABEF7i9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1QYSEx41Z+WrXQAAAhBQTFRFAAAAAESKAESLAEWMAkWLAkaMA0aMBEWLBEaMBUaMBUeMBUeNB0iNCEmOCEuPCkuQDk6RD06REVCSEVGTE1KTFBQUGleXHFaWH1uZIFqYIVyZIl2aJF6bJl+bKioqK2SeLS0tLWWgLmWgL2afMGegMWegM2ihNTU1N2yjOW2lPDw8PHClPnGnQEBAQ3SpQ3WpRXaqR3irSkpKTExMTnytT09PUoCwWISyXYe1X4m1X4m2You2ZmZmZ4+5aGhoaJC6apG6b5W9cJW9cJa+cpi+dZm/dnZ2d5vBfJ7CfaDEgqPGg4ODhISEhKTGhKXHhqXHhqbHh4eHiqjKiqnJi6nJjKrKlpaWl7LPl7TQmLPQnAAAnQIBngMCngQCnwYDoAgEoAkEoQoFobrUornTo7rUpLvVpRIJpbzWp6enqBgMqKioqamprCEQrq6usCoVscbcsy4XtDIZt8vfuMreuczfu83gvc7gvc7hwcHBwdLiwdLjx9XlyNbmy2Ixy8vLzmg0z8/P0Gw20W020dHR0d3q0nA40t7q03I509/r1eDs19fX24FA29vb3IVC3YZD3+jx4eHh5ZdM5ubm6O/17KRS7e3t76pV8fHx8vLy9fj79/f39/r8+L5f+Pr8+fv8+fv9+sJh+vz9+/v7+/z9/MVi/Pz8/clk/f39/f3+/f7+/spl/v7+/v7//8tm/8xm////VM1bDQAAAWRJREFUOMtjsKEyYLBZT1UANlDNff16Ewsgz0oQCPTWTzC2m561fv06MgDEQFeVxesDROavnytoHuHMlLRcV8FIy44MA+fMgRpYxdKyPp2pbH05R+cafY15zeozVod1kW7glJzCZRADZ4t5rbdmdlzvIbE4lat6fUYuJDjAqhgYwAQDlMADJibEtEJduN5Sc76UqvRCJfu5snzBK7InIQwEGbSOAcrCCaYtWbe2Ly66FhaG61O4S3iK2PM5i+cmO7BGNkxFMRDhTJzmxectaIqNrodHyvrJ/MraK2UUBeauX7/aQHX5UjQXrluH35FL8qLSYqMbEbG8fr0Os/96F2YzENNJaNF6tDAkGIRLChIz29chGxjKWrO+kjG8LXz9GkP5utXr18/yISmWV3X3rkUxsENy4fqZ4v2lvJ5+bEE93j0NpoGUJOz161f6AgnflatDhPls566vkBN1W0SZgVTNy1QGAIC0hiM7IZxZAAAAAElFTkSuQmCC" alt="W3C CSS Validated" width="80" height="15" class="pixelated" />
            </a>
            <a href="https://validator.w3.org/nu/?doc=https://sparklane.dev/">
            <img src=" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAPCAMAAABEF7i9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxEAAAsRAX9kX5EAAAAHdElNRQfVBhUIOSEqXrltAAACEFBMVEUAAAAARIoARIsARYwCRYsCRowDRowERYsERowFRowFR4wFR40HSI0ISY4IS48KS5AOTpEPTpERUJIRUZMTUpMUFBQaV5ccVpYfW5kgWpghXJkiXZokXpsmX5sqKiorZJ4tLS0tZaAuZaAvZp8wZ6AxZ6AzaKE1NTU3bKM5baU8PDw8cKU+cadAQEBDdKlDdalFdqpHeKtKSkpMTExOfK1PT09SgLBYhLJdh7VfibVfibZii7ZmZmZnj7loaGhokLpqkbpvlb1wlb1wlr5ymL51mb92dnZ3m8F8nsJ9oMSCo8aDg4OEhISEpMaEpceGpceGpseHh4eKqMqKqcmLqcmMqsqWlpaXss+XtNCYs9CcAACdAgGeAwKeBAKfBgOgCASgCQShCgWhutSiudOjutSku9WlEgmlvNanp6eoGAyoqKipqamsIRCurq6wKhWxxtyzLhe0Mhm3y9+4yt65zN+7zeC9zuC9zuHBwcHB0uLB0uPH1eXI1ubLYjHLy8vOaDTPz8/QbDbRbTbR0dHR3erScDjS3urTcjnT3+vV4OzX19fbgUDb29vchULdhkPf6PHh4eHll0zm5ubo7/XspFLt7e3vqlXx8fHy8vL1+Pv39/f3+vz4vl/4+vz5+/z5+/36wmH6/P37+/v7/P38xWL8/Pz9yWT9/f39/f79/v7+ymX+/v7+/v//y2b/zGb///9UzVsNAAAAAWJLR0SuuWuTpwAAAXFJREFUOMtjsKEyYLBZT1UANlDNff16Ewsgz0oQCPTWTzC2m561fv06MgDEQFeVxesDROavnytoHuHMlLRcV8FIy44MA+fMgRpYxdKyPp2pbH05R+cafY15zeozVod1kW7glJzCZRADZ4t5rbdmdlzvIbE4lat6fUYuJDhAihhAiIGBAcRYByHBXCxgYkJMK9SF6y0150upSi9Usp8ryxe8InsSmoFgxLCOAWYghlnTlqxb2xcXXQsLw/Up3CU8Rez5nMVzkx1YIxumIhkIdg7EnThdOC0+b0FTbHQ9PFLWT+ZX1l4poygwd/361Qaqy5dicyHCyxhuXJIXlRYb3YiI5fXrdZj917swm4GYTkKL1uM2kAHiezSwpCAxs30dsoGhrDXrKxnD28LXrzGUr1u9fv0sH5JieVV371oUAzskF66fKd5fyuvpxxbU493TYBpIScJev36lL5DwXbk6RJjPdu76CjlRt0WUGUjVvExlAAC+JXiL+DgKGQAAAABJRU5ErkJggg==" alt="W3C HTML Validated" width="80" height="15" class="pixelated" />
            </a>
        </div> */}

        
        {social?.gitHub && (
            <Link className="social-link" to={social.gitHub} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FontAwesomeIcon icon={faGithub} size="2x" aria-hidden="true" />
            </Link>
        )}
        {social?.linkedIn && (
            <Link className="social-link" to={social.linkedIn} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FontAwesomeIcon icon={faLinkedin} size="2x" alt="LinkedIn" aria-hidden="true" />
            </Link>
        )}    
        </div>        
    </div>
  )
}

export default Footer
