// custom typefaces
import "@fontsource-variable/montserrat"
import "@fontsource/merriweather"

// normalize CSS across browsers
import "./src/styles/normalize.css"
import "./src/styles/global.css"

// Highlighting for code blocks
import "prismjs/themes/prism.css"

// Initialize PostHog
export const onRouteUpdate = () => {
    if (window.posthog) {
        window.posthog.capture('$pageview')
    }
}