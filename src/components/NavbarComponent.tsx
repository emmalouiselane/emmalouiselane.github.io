import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTracking } from "../hooks/useTracking";

const NavbarComponent = () => {
    const { trackEvent } = useTracking();
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const handleNavigation = (section: string) => {
        trackEvent("navigation_clicked", { section, location: window.location.pathname });
        setIsOpen(false);
    };

    const navLinks = [
        { text: "Journal", path: "/blog-posts/" },
        { text: "Research", path: "/dissertation/" },
        {
            text: "Garden",
            path: "/digital-garden/",
            children: [
                { text: "Portfolio", path: "/portfolio/" },
                { text: "Recipes", path: "/digital-garden/recipes/" },
                { text: "Gaming", path: "/digital-garden/gaming/" },
                { text: "Reading", path: "/digital-garden/reading/" },
                { text: "Listening", path: "/digital-garden/listening/" },
                { text: "Watching", path: "/digital-garden/watching/" },
            ],
        },
        { text: "About Me", path: "/about/" },
    ];

    const toggleDarkMode = () => {
        const isDark = document.documentElement.classList.toggle("dark");
        setIsDarkMode(isDark);
    };

    useEffect(() => {
        setIsDarkMode(document.documentElement.classList.contains("dark"));
    }, []);

    return (
        <nav className="site-nav">
            <div className="site-nav__inner">
                <a className="site-nav__brand" href="/">
                    <span className="site-nav__brand-mark">Spark Lane</span>
                    <span className="site-nav__brand-tag">code, notes and curiosities</span>
                </a>

                <div className="site-nav__desktop">
                    {navLinks.map((link) => (
                        <a key={link.path} href={link.path} className="site-nav__link" onClick={() => handleNavigation(link.text)}>
                            {link.text}
                        </a>
                    ))}
                    <button className="site-nav__icon-button" type="button" onClick={toggleDarkMode} aria-label="Toggle theme">
                        {isDarkMode ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
                    </button>
                </div>

                <div className="site-nav__mobile">
                    <button className="site-nav__icon-button" type="button" onClick={toggleDarkMode} aria-label="Toggle theme">
                        {isDarkMode ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
                    </button>
                    <button className="site-nav__icon-button" type="button" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? "Close menu" : "Open menu"} aria-expanded={isOpen}>
                        {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="site-nav__mobile-panel">
                    {navLinks.map((link) => (
                        <div key={link.path} className="site-nav__mobile-group">
                            <a href={link.path} onClick={() => handleNavigation(link.text)}>{link.text}</a>
                            {link.children?.map((child) => (
                                <a key={child.path} href={child.path} className="site-nav__mobile-child" onClick={() => handleNavigation(child.text)}>{child.text}</a>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default NavbarComponent;