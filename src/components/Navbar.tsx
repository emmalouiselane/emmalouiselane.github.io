import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun, Flower, Leaf } from "lucide-react";
import { useTracking } from "../hooks/useTracking";

const NavbarComponent = () => {
    const { trackEvent } = useTracking();
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [colorTheme, setColorTheme] = useState('green');
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
            text: "Digital Garden", path: "/digital-garden/", children: [
                { text: "Portfolio", path: "/portfolio/" },
                { text: "Recipes", path: "/digital-garden/recipes/" },
                { text: "Gaming", path: "/digital-garden/gaming/" },
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

    const toggleColorTheme = () => {
        const newTheme = colorTheme === 'green' ? 'pink' : 'green';
        setColorTheme(newTheme);
        document.documentElement.setAttribute('data-color-theme', newTheme);
        localStorage.setItem('colorTheme', newTheme);
    };

    useEffect(() => {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
        const savedTheme = localStorage.getItem('colorTheme') || 'green';
        setColorTheme(savedTheme);
        document.documentElement.setAttribute('data-color-theme', savedTheme);
    }, []);

    return (
        <nav className="border-b bg-background sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <a className="font-bold text-4xl no-underline text-foreground hover:text-[var(--color-highlight)] transition-colors font-montserrat" href="/">
                    Spark Lane
                </a>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <a
                            key={link.path}
                            href={link.path}
                            className="text-sm font-medium transition-colors hover:text-[var(--color-highlight)] text-muted-foreground no-underline"
                            onClick={() => handleNavigation(link.text)}
                        >
                            {link.text}
                        </a>
                    ))}

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={toggleColorTheme} aria-label="Toggle color theme" className={colorTheme === 'green' ? 'hover:text-pink-500' : 'hover:text-green-500'}>
                            {colorTheme === 'green' ? <Flower className="h-[1.2rem] w-[1.2rem]" /> : <Leaf className="h-[1.2rem] w-[1.2rem]" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle theme" className={isDarkMode ? 'hover:text-yellow-500' : 'hover:text-gray-400'}>
                            {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleColorTheme} aria-label="Toggle color theme" className={colorTheme === 'green' ? 'hover:text-pink-500' : 'hover:text-green-500'}>
                        {colorTheme === 'green' ? <Flower className="h-[1.2rem] w-[1.2rem]" /> : <Leaf className="h-[1.2rem] w-[1.2rem]" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle theme" className={`mr-2 ${isDarkMode ? 'hover:text-yellow-500' : 'hover:text-gray-400'}`}>
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
                                            className="text-lg font-medium hover:text-[var(--color-highlight)] transition-colors no-underline"
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
                                                        className="text-base font-normal hover:text-[var(--color-highlight)] transition-colors no-underline"
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
