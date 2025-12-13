import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun } from "lucide-react";
import { useTracking } from "../hooks/useTracking";

const NavbarComponent = () => {
    const { trackEvent } = useTracking();
    const [isDarkMode, setIsDarkMode] = useState(true);
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
            text: "Blog", path: "/blog-posts/"
        },
        {
            text: "Workshop", path: "/workshop/", children: [
                { text: "Portfolio", path: "/portfolio/" },
                { text: "Recipes", path: "/workshop/recipes/" },
                { text: "Gaming", path: "/workshop/gaming/" },
            ]
        },
        {
            text: "About Me", path: "/about/"
        }
    ];

    const toggleDarkMode = () => {
        const isDark = document.documentElement.classList.toggle('dark');
        setIsDarkMode(isDark);
        // localStorage is handled by the MutationObserver in BaseLayout
    };

    useEffect(() => {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
    }, []);

    return (
        <nav className="border-b bg-background sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <a className="font-bold text-4xl no-underline text-foreground hover:text-primary transition-colors font-montserrat" href="/">
                    Spark Lane
                </a>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <a
                            key={link.path}
                            href={link.path}
                            className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground no-underline"
                            onClick={() => handleNavigation(link.text)}
                        >
                            {link.text}
                        </a>
                    ))}

                    <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle theme">
                        {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                    </Button>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle theme" className="mr-2">
                        {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                    </Button>

                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Menu">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <div className="flex flex-col gap-6 mt-10 mobile-nav-container">
                                {navLinks.map((link) => (
                                    <div key={link.path} className="flex flex-col gap-6">
                                        <a
                                            href={link.path}
                                            className="text-lg font-medium hover:text-primary transition-colors no-underline"
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
                                                        className="text-base font-normal hover:text-primary transition-colors no-underline"
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
