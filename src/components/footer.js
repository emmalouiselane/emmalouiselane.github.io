// eslint-disable-next-line no-unused-vars
import * as React from "react"
import { Link , useStaticQuery, graphql } from "gatsby"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons'

import { useIsMobile } from "../hooks/useIsMobile"

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Footer = () => { 
    const data = useStaticQuery(graphql`
    query SocialQuery {
        site {
            siteMetadata {
                footerTagline
                social {
                    linkedIn
                    gitHub
                }
            }
        }
    }`);

    const social = data.site.siteMetadata?.social
    const footerTagline = data.site.siteMetadata?.footerTagline

    const { isMobile } = useIsMobile();

    if (isMobile) {
        return (
            <Container className="footer-content-mobile">  
                <Row>
                    <Col xs={8}>
                        <p>{footerTagline}</p>
                    </Col>
                    <Col xs={4}>
                        {social?.gitHub && (
                            <a className="link social-link" to={social.gitHub} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                <FontAwesomeIcon icon={faGithub} size="2x" aria-hidden="true" />
                            </a>
                        )}
                        {social?.linkedIn && (
                            <a className="link social-link" to={social.linkedIn} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                <FontAwesomeIcon icon={faLinkedin} size="2x" alt="LinkedIn" aria-hidden="true" />
                            </a>
                        )}
                    </Col>
                </Row>
            </Container>       
        )
    }

    return (
        <Container className="footer-content">
            <Row>
                <Col md={2}>
                    {/* TODO: Migrate these two links to the about page */}
                    {/* <Link className="navbar-link-disabled" aria-disabled="true">Sitemap</Link>
                    <Link className="navbar-link-disabled" aria-disabled="true">Changelog</Link> */}
                    <Link className="navbar-link" to="/accessibility-statement">Accessibility</Link>
                </Col>

                <Col md={8} className="footer-content-center">
                    <p>{footerTagline}</p>
                </Col>

                <Col md={2} className="footer-content-right">
                    
                
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
                        <a className="link social-link" href={social.gitHub} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <FontAwesomeIcon icon={faGithub} size="2x" aria-hidden="true" />
                        </a>
                    )}
                    {social?.linkedIn && (
                        <a className="link social-link" href={social.linkedIn} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <FontAwesomeIcon icon={faLinkedin} size="2x" alt="LinkedIn" aria-hidden="true" />
                        </a>
                    )}    
                </Col>  
            </Row>      
        </Container>
    )
}

export default Footer
