import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Users, GitBranchPlus } from "lucide-react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { title: "Accueil", path: "/", icon: <Users className="h-5 w-5" /> },
    {
      title: "Liste des membres",
      path: "/members",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "Organigramme",
      path: "/org-chart",
      icon: <GitBranchPlus className="h-5 w-5" />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glassmorphism border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold text-primary">
              HeavenFlowChart
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1 transition-all py-2 px-1 border-b-2 ${
                  location.pathname === link.path
                    ? "border-primary text-primary font-medium"
                    : "border-transparent hover:border-primary/50 hover:text-primary/90"
                }`}
              >
                {link.icon}
                <span>{link.title}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              className="p-2 rounded-md focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="md:hidden animate-fade-in absolute w-full bg-background/95 backdrop-blur-md shadow-md border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 py-2 px-3 rounded-md transition-colors ${
                    location.pathname === link.path
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-primary/5 hover:text-primary/90"
                  }`}
                  onClick={closeMenu}
                >
                  {link.icon}
                  <span>{link.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
