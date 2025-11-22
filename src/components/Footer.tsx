import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/assets/new-21.png";
import { useState } from "react";
import apiFetch from "@/lib/api";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || !emailRegex.test(value)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch("/newsletter/subscribe/", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMessage({ type: 'success', text: response.message || 'Successfully subscribed!' });
      setEmail("");
    } catch (err) {
      console.error('Newsletter subscribe error', err);
      // try to extract server JSON from error message if available
      let detail = 'Failed to subscribe. Please try again.';
      try {
        const msg = (err && (err as Error).message) || String(err);
        const jsonPart = msg.substring(msg.indexOf('-') + 1).trim();
        const parsed = JSON.parse(jsonPart);
        if (parsed && parsed.detail) detail = parsed.detail;
        else if (parsed && parsed.error) detail = parsed.error;
        else if (parsed && typeof parsed === 'string') detail = parsed;
      } catch (parseErr) {
        // fall back to generic
      }
      setMessage({ type: 'error', text: detail });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-brand-black text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-20">
        {/* Top Section - Logo and Branding */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-20 pb-12 border-b border-white/10">
          <div className="mb-8 lg:mb-0">
            <div className="flex items-center gap-4 mb-4 bg-white/80 p-3 rounded-lg">
              <img src={Logo} alt="Dynamics Furniture" className="h-14 w-auto" />
              
            </div>
          </div>

          {/* Social Icons - Right Aligned */}
          <div className="flex gap-4">
            <a
              href="#"
              className="bg-white/5 hover:bg-primary p-3 rounded-full transition-all duration-300 transform hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook size={22} className="text-white" />
            </a>
            <a
              href="#"
              className="bg-white/5 hover:bg-primary p-3 rounded-full transition-all duration-300 transform hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram size={22} className="text-white" />
            </a>
            <a
              href="#"
              className="bg-white/5 hover:bg-primary p-3 rounded-full transition-all duration-300 transform hover:scale-110"
              aria-label="YouTube"
            >
              <Youtube size={22} className="text-white" />
            </a>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
          {/* About Section */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-8">About</h3>
            <div className="space-y-5">
              <div className="flex gap-3 items-start">
                <MapPin size={18} className="text-primary flex-shrink-0 mt-1" />
                <p className="text-gray-400 text-sm leading-relaxed">
                  Dragon mart 1 Shop #JA10, Dubai, United Arab Emirates
                </p>
              </div>
              <div className="flex gap-3 items-center">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <p className="text-gray-400 text-sm hover:text-primary transition-colors cursor-pointer">
                  +971 557 324 185
                </p>
              </div>
              <div className="flex gap-3 items-center">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <p className="text-gray-400 text-sm hover:text-primary transition-colors cursor-pointer">
                  dynamicsfurniture1@gmail.com
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-8">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-primary transition-colors text-sm relative group"
                >
                  About Us
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-primary transition-colors text-sm relative group"
                >
                  Contact Us
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="text-gray-400 hover:text-primary transition-colors text-sm relative group"
                >
                  Shop
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-400 hover:text-primary transition-colors text-sm relative group"
                >
                  Blog
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-8">Categories</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/shop?category=office-chairs"
                  className="text-gray-400 hover:text-primary transition-colors text-sm relative group"
                >
                  Office Chairs
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=office-tables"
                  className="text-gray-400 hover:text-primary transition-colors text-sm relative group"
                >
                  Office Tables
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=workstation"
                  className="text-gray-400 hover:text-primary transition-colors text-sm relative group"
                >
                  Workstations
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=storage"
                  className="text-gray-400 hover:text-primary transition-colors text-sm relative group"
                >
                  Storage & Units
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-8">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Subscribe for exclusive updates on new collections and special offers.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="relative group">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 text-sm rounded-lg px-4 py-3 focus:bg-white/10 focus:border-primary transition-all duration-300 disabled:opacity-50"
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg py-2.5 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
              {message && (
                <p className={`text-xs font-medium ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {message.text}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-12 text-center">
          <p className="text-gray-400 text-xs">
            © 2024 Dynamics Furniture. All Rights Reserved. | Premium Office Solutions
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;