import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun } from "lucide-react";
import { useTracking } from "../hooks/useTracking";

const NavbarComponent = () => {
    const { trackEvent } = useTracking();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleNavigation = (section: string) => {
        trackEvent('navigation_clicked', {
            section,
            location: window.location.pathname
        });
        setIsOpen(false);
    };

    const navLinks = [
        {
            text: "Journal", path: "/blog-posts/"
        },
        {
            text: "Research", path: "/dissertation/"
        },
        {
            text: "Garden", path: "/digital-garden/", children: [
                { text: "Portfolio", path: "/portfolio/" },
                { text: "Recipes", path: "/digital-garden/recipes/" },
                { text: "Gaming", path: "/digital-garden/gaming/" },
                { text: "Reading", path: "/digital-garden/reading/" },
                { text: "Listening", path: "/digital-garden/listening/" },
                { text: "Watching", path: "/digital-garden/watching/" }
            ]
        },
        {
            text: "About Me", path: "/about/"
        }
    ];

    const toggleDarkMode = () => {
        const isDark = document.documentElement.classList.toggle('dark');
        setIsDarkMode(isDark);
    };

    useEffect(() => {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
    }, []);

    return (
        <nav className="site-nav sticky top-0 z-50 w-full">
            <div className="site-nav__inner container mx-auto flex min-h-20 items-center justify-between gap-4 px-4 py-3">
                <a className="site-nav__brand no-underline" href="/">
                    <span className="site-nav__brand-mark">Spark Lane</span>
                    <span className="site-nav__brand-tag">code, notes and curiosities</span>
                </a>

                {/* Desktop navigation */}
                <div className="hidden md:flex items-center gap-3">
                    {navLinks.map((link) => (
                        <a
                            key={link.path}
                            href={link.path}
                            className="site-nav__link no-underline"
                            onClick={() => handleNavigation(link.text)}
                        >
                            {link.text}
                        </a>
                    ))}

                    <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle theme" className="site-nav__icon-button ml-2">
                        {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                    </Button>
                </div>

                {/* Mobile navigation */}
                <div className="md:hidden flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle theme" className="site-nav__icon-button mr-2">
                        {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                    </Button>

                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Menu" className="site-nav__icon-button">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="site-nav__sheet">
                            <div className="flex flex-col gap-6 mt-10 mobile-nav-container">
                                {navLinks.map((link) => (
                                    <div key={link.path} className="flex flex-col gap-6">
                                        <a
                                            href={link.path}
                                            className="text-lg font-medium transition-colors no-underline"
                                            onClick={() => handleNavigation(link.text)}
                                        >
                                            {link.text}
                                        </a>

                                        {link.children && link.children.length > 0 && (
                                            <div className="ml-4 flex flex-col gap-6">
                                                {link.children.map((child) => (
                                                    <a
                                                        key={child.path}
                                                        href={child.path}
                                                        className="text-base font-normal transition-colors no-underline"
                                                        onClick={() => handleNavigation(child.text)}
                                                    >
                                                        {child.text}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
};

export default NavbarComponent;



