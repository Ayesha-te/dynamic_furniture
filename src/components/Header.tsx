import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  Phone,
  Mail,
  Home,
  Info,
  Briefcase,
  BookMarked,
  Mail as MailIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/new-21.png";
import { useAuth } from "@/hooks/useAuth";
import apiFetch from "@/lib/api";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    const loadCart = async () => {
      try {
        if (auth.user) {
          const data: any = await apiFetch("/cart/");
          setCartCount((data.items || []).reduce((s: number, i: any) => s + (i.quantity || 0), 0));
        } else {
          const raw = localStorage.getItem("cart_items");
          if (!raw) return setCartCount(0);
          const items = JSON.parse(raw);
          setCartCount(items.reduce((s: number, i: any) => s + (i.quantity || 0), 0));
        }
      } catch (err) {
        // ignore errors for now
      }
    };
    loadCart();

    const onCartUpdated = () => loadCart();
    window.addEventListener("cart_updated", onCartUpdated);
    return () => window.removeEventListener("cart_updated", onCartUpdated);
  }, [auth.user]);

  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "About", path: "/about", icon: Info },
    { name: "Shop", path: "/shop", icon: Briefcase },
    { name: "Blog", path: "/blog", icon: BookMarked },
    { name: "Contact", path: "/contact", icon: MailIcon },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-background border-b">
      {/* Top Bar - Hidden on Mobile */}
      <div className="hidden sm:block bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex gap-4">
            <a
              href="tel:+971557324185"
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <Phone size={14} />
              <span>+971 557 324 185</span>
            </a>
            <a
              href="mailto:dynamicsfurniture1@gmail.com"
              className="hidden md:flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <Mail size={14} />
              <span>dynamicsfurniture1@gmail.com</span>
            </a>
          </div>
          <div className="flex gap-2 items-center">
            <span className="hidden sm:inline">
              10% Free Shipping On All Order Over AED 2000
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src={logo}
              alt="Logo"
              className="h-10 md:h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Search & Actions */}
          <div className="hidden md:flex items-center gap-3 flex-1 justify-end">
            <div className="flex items-center gap-2">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-48 lg:w-64"
              />
              <Button size="icon" variant="ghost">
                <Search size={20} />
              </Button>
            </div>

            <Link to="/cart">
              <Button size="icon" variant="ghost" className="relative">
                <ShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              </Button>
            </Link>

            {auth.user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground hidden lg:inline">
                  {auth.user.username || auth.user.email}
                </span>
                <Button size="icon" variant="ghost" onClick={auth.logout}>
                  <LogOut size={20} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm text-foreground hover:text-primary">
                  Login
                </Link>
                <Link to="/signup" className="text-sm text-foreground hover:text-primary">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={20} />
            </Button>

            <Link to="/cart">
              <Button size="icon" variant="ghost" className="relative">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden mt-3 pb-3 border-t pt-3">
            <div className="flex items-center gap-2">
              <Input
                type="search"
                placeholder="Search products..."
                className="flex-1"
              />
              <Button size="icon" variant="ghost">
                <Search size={20} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-b z-40">
        <div className="flex items-center justify-around h-16">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`flex flex-col items-center justify-center py-2 px-4 transition-colors ${
                isActive(link.path)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <link.icon size={20} />
              <span className="text-xs mt-1 font-medium">{link.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Hamburger Menu */}
      {isMenuOpen && (
        <nav className="md:hidden border-t bg-background pb-20">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {auth.user ? (
              <>
                <div className="py-2 px-4 bg-primary/10 rounded-lg mb-2">
                  <p className="text-sm font-medium text-foreground">
                    Welcome, {auth.user.username || auth.user.email}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={auth.logout}
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" className="w-full">
                  <Button className="w-full">Sign up</Button>
                </Link>
              </>
            )}

            {/* Contact Info */}
            <div className="border-t pt-4 mt-4 space-y-2">
              <a
                href="tel:+971557324185"
                className="flex items-center gap-2 py-2 px-4 text-sm hover:bg-muted rounded"
              >
                <Phone size={16} />
                <span>+971 557 324 185</span>
              </a>
              <a
                href="mailto:dynamicsfurniture1@gmail.com"
                className="flex items-center gap-2 py-2 px-4 text-sm hover:bg-muted rounded"
              >
                <Mail size={16} />
                <span>dynamicsfurniture1@gmail.com</span>
              </a>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;