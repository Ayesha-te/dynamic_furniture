import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import apiFetch from "@/lib/api";

interface Subcategory {
  id: number;
  name: string;
  slug: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  subcategories: Subcategory[];
}

const Navbar = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState<number | null>(null);

  useEffect(() => {
    // Try to populate immediately from a cached copy in localStorage so navbar
    // appears instantly on page load. Then refresh from the API in background.
    try {
      const cached = localStorage.getItem("site_categories");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed);
        }
      }
    } catch (e) {
      // ignore parse errors
    }

    const fetchCategories = async () => {
      try {
        const data = await apiFetch("/catalog/categories/");
        const list = Array.isArray(data) ? data : [];
        setCategories(list);
        try {
          localStorage.setItem("site_categories", JSON.stringify(list));
        } catch (e) {
          // ignore storage errors
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        // keep cached categories if fetch fails
      }
    };

    fetchCategories();
  }, []);

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden lg:flex bg-red-600 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-8">
            {categories.map((category) => (
              <div
                key={category.id}
                className="relative group"
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Link
                  to={`/shop?category=${category.slug}`}
                  className="py-4 px-2 text-sm font-semibold text-white hover:text-gray-100 transition-colors flex items-center gap-1 group-hover:text-gray-100"
                >
                  {category.name}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {category.subcategories && category.subcategories.length > 0 && (
                  <div className="absolute left-0 mt-0 w-48 bg-white border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          to={`/shop?category=${subcategory.slug}`}
                          className="block px-4 py-2 text-sm text-black hover:bg-gray-100 hover:text-black transition-colors"
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="lg:hidden bg-red-600">
        <div className="container mx-auto px-4">
          {categories.map((category) => (
            <div key={category.id}>
              <button
                onClick={() => setIsMobileOpen(isMobileOpen === category.id ? null : category.id)}
                className="w-full py-3 text-left text-sm font-semibold text-white hover:text-gray-100 transition-colors flex items-center justify-between border-b last:border-b-0"
              >
                <span>{category.name}</span>
                {category.subcategories && category.subcategories.length > 0 && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isMobileOpen === category.id ? "rotate-180" : ""}`}
                  />
                )}
              </button>

              {/* Mobile Submenu */}
              {isMobileOpen === category.id && category.subcategories && (
                <div className="bg-red-500">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      to={`/shop?category=${subcategory.slug}`}
                      onClick={() => setIsMobileOpen(null)}
                      className="block px-8 py-2 text-sm text-black hover:bg-red-400 transition-colors border-b last:border-b-0"
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
