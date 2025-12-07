import { useEffect, useState } from "react";
import { Nav, Navbar, Button, Container } from "react-bootstrap";
import { useIsMobile } from "../hooks/useIsMobile";
import { useTracking } from "../hooks/useTracking";

const NavbarComponent = () => {
    const { trackEvent } = useTracking();
    const { isMobile } = useIsMobile();
    const [isDarkMode, setIsDarkMode] = useState(true);

    const handleNavigation = (section: string) => {
        trackEvent('navigation_clicked', {
            section,
            location: window.location.pathname
        });
    };

    const navLinks = [
        { text: "Blog", path: "/blog-posts/" },
        { text: "Workshop", path: "/workshop/" }
    ];

    const toggleDarkMode = () => {
        const currentSavedTheme = localStorage.getItem('theme');
        if (currentSavedTheme === 'dark') {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            setIsDarkMode(true);
        } else {
            document.body.classList.remove('dark-mode');
            setIsDarkMode(false);
        }
    }, []);

    return (
        <Navbar expand="md">
            <Container className="custom-navbar-container">
                <a className="main-heading" href="/">
                    <h1>
                        Spark Lane
                    </h1>
                </a>

                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="custom-nav-links">
                        {navLinks.map((link) => (
                            <a className="navbar-link"
                                key={link.path} href={link.path}
                                onClick={() => handleNavigation(link.text)}>
                                {link.text}
                            </a>
                        ))}

                        <Button className="navbar-link dark-mode-toggle" style={isMobile ? { width: '100px' } : {}} onClick={toggleDarkMode}>
                            {isDarkMode ? "☀️" : "🌙"}
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;
