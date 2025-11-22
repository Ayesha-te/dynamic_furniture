import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiFetch from "@/lib/api";

const Shop = () => {
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchParams] = useSearchParams();

  const queryQ = searchParams.get("q") || "";

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, [searchParams]);

  interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
    parent_category_id?: number | null;
    subcategories?: Array<{
      id: number;
      name: string;
      slug: string;
      description: string;
      is_active: boolean;
    }>;
  }

  interface Product {
    id: number;
    name: string;
    price: string | number;
    category: { id: number; name: string; slug: string } | null;
    image?: string;
  }

  const { data: categoriesData = [], isLoading: loadingCategories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => apiFetch("/catalog/categories/"),
    staleTime: 1000 * 60 * 5,
  });

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => apiFetch("/catalog/products/"),
    staleTime: 1000 * 60 * 2,
  });

  const categoryMap = useMemo(() => {
    return (categoriesData || []).reduce((acc: Record<string, Category>, cat: Category) => {
      acc[cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")] = cat;
      return acc;
    }, {});
  }, [categoriesData]);

  const filteredProducts = useMemo(() => {
    const qLower = (queryQ || "").toLowerCase().trim();
    return products.filter((product: Product) => {
      const price = parseFloat(String(product.price) || "0");
      const inPriceRange = price >= priceRange[0] && price <= priceRange[1];
      
      // If a text query is present, match product name or category or slug
      if (qLower) {
        const inText = (String(product.name || "") + " " + (product.category?.name || "") + " " + (product.category?.slug || "")).toLowerCase().includes(qLower);
        if (!inText) return false;
      }

      if (selectedCategories.length === 0) {
        return inPriceRange;
      }

      const productCategory = product.category;
      if (!productCategory) {
        return false;
      }
      
      const categorySlug = typeof productCategory === "object" 
        ? productCategory.slug 
        : "";

      const matchesCategory = selectedCategories.includes(categorySlug);
      return inPriceRange && matchesCategory;
    });
  }, [products, priceRange, selectedCategories]);

  const toggleCategory = (categorySlug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categorySlug)
        ? prev.filter((c) => c !== categorySlug)
        : [...prev, categorySlug]
    );
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Our Products</h1>
          <p className="text-muted-foreground">Browse our complete furniture collection</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Mobile Expandable Categories */}
              <div className="bg-card border rounded-lg p-6">
                <div className="flex justify-between items-center lg:block">
                  <h3 className="font-bold mb-0 lg:mb-4">Categories</h3>
                  <button
                    className="lg:hidden flex items-center text-sm text-muted-foreground"
                    onClick={() => setShowCategories(!showCategories)}
                  >
                    {showCategories ? (
                      <>
                        Hide <ChevronUp className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Show <ChevronDown className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </div>

                {/* Collapsible Categories */}
                <div
                  className={`space-y-3 overflow-hidden transition-all duration-300 ${
                    showCategories ? "max-h-96 mt-4" : "max-h-0 lg:max-h-full lg:mt-4"
                  }`}
                >
                  {categoriesData.map((category: Category) => {
                    const categorySlug = category.slug || category.name.toLowerCase().replace(/\s+/g, "-");
                    return (
                      <div key={category.id} className="flex items-center gap-2">
                        <Checkbox
                          id={categorySlug}
                          checked={selectedCategories.includes(categorySlug)}
                          onCheckedChange={() => toggleCategory(categorySlug)}
                        />
                        <Label htmlFor={categorySlug} className="text-sm cursor-pointer flex-1">
                          {category.name}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-bold mb-4">Price Range</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={5000}
                  step={100}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>AED {priceRange[0]}</span>
                  <span>AED {priceRange[1]}</span>
                </div>
              </div>

              <Button className="w-full">Apply Filters</Button>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing {filteredProducts.length} products
              </p>
              <select className="border rounded-md px-4 py-2 text-sm">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div>Loading products...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No products found matching your filters.
                </div>
              ) : (
                filteredProducts.map((product: Product, index: number) => (
                  <div
                    key={product.id ?? index}
                    className="animate-fade-in-up h-full"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ProductCard id={product.id ?? index} {...product} />
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-12">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button variant="default" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
