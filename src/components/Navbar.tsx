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
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [isMobileSubOpen, setIsMobileSubOpen] = useState<number | null>(null);

  useEffect(() => {
    try {
      const cached = localStorage.getItem("site_categories");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed);
        }
      }
    } catch (e) {}

    const fetchCategories = async () => {
      try {
        const data = await apiFetch("/catalog/categories/");
        const list = Array.isArray(data) ? data : [];
        setCategories(list);
        try {
          localStorage.setItem("site_categories", JSON.stringify(list));
        } catch (e) {}
      } catch (err) {
        console.error("Failed to fetch categories:", err);
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
      <nav className="hidden lg:flex bg-red-600 backdrop-blur-sm relative z-40">
        <div className="w-full">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-8">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="relative"
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <Link
                    to={`/shop?category=${category.slug}`}
                    className="py-4 px-2 text-sm font-semibold text-white hover:text-gray-100 flex items-center gap-1 block"
                  >
                    {category.name}
                    {category.subcategories?.length > 0 && (
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform ${hoveredCategory === category.id ? "rotate-180" : ""}`}
                      />
                    )}
                  </Link>

                  {/* BIG FULLSCREEN DROPDOWN */}
                  {hoveredCategory === category.id && category.subcategories?.length > 0 && (
                    <div
                      className="fixed inset-x-0 top-full bg-white shadow-lg z-50 overflow-x-hidden"
                      onMouseEnter={() => setHoveredCategory(category.id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      <div className="container mx-auto px-8 py-8 grid grid-cols-4 gap-6">
                        {category.subcategories.map((subcategory) => (
                          <Link
                            key={subcategory.id}
                            to={`/shop?category=${subcategory.slug}`}
                            className="text-sm text-gray-800 hover:text-red-600 transition-colors font-medium"
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
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="lg:hidden bg-red-600">
        <div className="container mx-auto px-4">
          {/* CATEGORIES DROPDOWN BUTTON */}
          <button
            onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
            className="w-full py-4 text-left text-sm font-semibold text-white flex items-center justify-between border-b border-red-700"
          >
            <span>CATEGORIES</span>
            <ChevronDown
              size={18}
              className={`transition-transform ${isMobileCategoriesOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* CATEGORIES LIST */}
          {isMobileCategoriesOpen && (
            <div className="bg-red-500">
              {categories.map((category) => (
                <div key={category.id}>
                  {/* Category Button */}
                  <button
                    onClick={() => setIsMobileSubOpen(isMobileSubOpen === category.id ? null : category.id)}
                    className="w-full py-3 text-left text-sm font-semibold text-white flex items-center justify-between px-4 border-b border-red-600 hover:bg-red-700 transition-colors"
                  >
                    <span>{category.name}</span>
                    {category.subcategories?.length > 0 && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${isMobileSubOpen === category.id ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>

                  {/* Subcategories List */}
                  {isMobileSubOpen === category.id && category.subcategories?.length > 0 && (
                    <div className="bg-red-400">
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          to={`/shop?category=${subcategory.slug}`}
                          onClick={() => {
                            setIsMobileSubOpen(null);
                            setIsMobileCategoriesOpen(false);
                          }}
                          className="block px-8 py-2 text-sm text-black hover:bg-red-300 transition-colors border-b last:border-b-0"
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;