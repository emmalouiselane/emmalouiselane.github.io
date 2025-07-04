import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// custom typefaces
import "@fontsource-variable/montserrat"
import "@fontsource/merriweather"

import './src/styles/global.scss'

// Highlighting for code blocks
import "prismjs/themes/prism.css"

// Initialize PostHog
export const onRouteUpdate = () => {
    if (window.posthog) {
        window.posthog.capture('$pageview')
    }
}