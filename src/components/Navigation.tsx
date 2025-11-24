import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Logo from "@/assets/logo.svg?react"; // SVG as React component

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Scroll listener for dark mode
  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById("about");
      if (!aboutSection) return;

      const aboutPosition = aboutSection.offsetTop;
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      setIsDark(scrollPosition >= aboutPosition);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Text */}
          <div className="flex items-center gap-2">
            <h1 className={`text-2xl font-bold flex items-center transition-colors duration-300 ${isDark ? "text-white" : "text-primary"}`}>
              <Logo className="inline-block h-[2.5em] w-auto align-baseline mr-10 transition-colors duration-300" />
              Sancak Nakliyat
            </h1>           
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {["home", "services", "gallery", "reviews"].map((id) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="text-foreground hover:text-primary transition-colors"
              >
                {id === "home"
                  ? "Ana Sayfa"
                  : id === "services"
                  ? "Hizmetlerimiz"
                  : id === "gallery"
                  ? "Galeri"
                  : "Yorumlar"}
              </button>
            ))}
            <Button variant="accent" onClick={() => scrollToSection("quote")}>
              Teklif Al
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 animate-in slide-in-from-top">
            {["home", "services", "gallery", "reviews"].map((id) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="block w-full text-left px-4 py-2 text-foreground hover:bg-secondary rounded-md transition-colors"
              >
                {id === "home"
                  ? "Ana Sayfa"
                  : id === "services"
                  ? "Hizmetlerimiz"
                  : id === "gallery"
                  ? "Galeri"
                  : "Yorumlar"}
              </button>
            ))}
            <div className="px-4">
              <Button variant="accent" className="w-full" onClick={() => scrollToSection("quote")}>
                Teklif Al
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
