import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Truck, Shield, Headphones, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import {
  Armchair,
  Table2,
  BookOpen,
  Sofa,
  Coffee,
  Users,
  Archive,
} from "lucide-react";
import heroImage from "@/assets/pexels-pixabay-416320.jpg";
import Portfolio from "@/components/Portfolio";
import ContactSection from "@/components/ContactSection";
import { useQuery } from "@tanstack/react-query";
import apiFetch from "@/lib/api";
import React from "react";

const getCategoryIcon = (categoryName: string): React.ComponentType<React.SVGProps<SVGSVGElement>> => {
  const lowerName = categoryName.toLowerCase();
  
  if (lowerName.includes("desk")) return Table2;
  if (lowerName.includes("chair")) return Armchair;
  if (lowerName.includes("bookshelf") || lowerName.includes("shelf")) return BookOpen;
  if (lowerName.includes("reception")) return Sofa;
  if (lowerName.includes("coffee") || lowerName.includes("table")) return Table2;
  if (lowerName.includes("meeting")) return Users;
  if (lowerName.includes("workstation")) return Archive;
  
  return Table2;
};

const Home = () => {
  const [categoryScroll, setCategoryScroll] = useState(0);
  const [productScroll, setProductScroll] = useState(0);
  const categoryContainerRef = React.useRef<HTMLDivElement>(null);
  const productContainerRef = React.useRef<HTMLDivElement>(null);

  const { data: categoriesData = [] } = useQuery<any[]>({
    queryKey: ["categories"],
    queryFn: () => apiFetch("/catalog/categories/"),
    staleTime: 1000 * 60 * 5,
  });

  const categories = categoriesData.map((cat) => ({
    name: cat.name,
    icon: getCategoryIcon(cat.name),
    path: `/shop?category=${cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")}`,
  }));

  const { data: products = [], isLoading } = useQuery<any[]>({
    queryKey: ["home-products"],
    queryFn: () => apiFetch("/catalog/products/"),
    staleTime: 1000 * 60 * 2,
  });

  const featuredProducts = products;

  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over AED 2000",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure transaction",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Dedicated customer service",
    },
    {
      icon: Award,
      title: "Quality Products",
      description: "Premium office furniture",
    },
  ];

  const scrollCategories = (direction: "left" | "right") => {
    if (categoryContainerRef.current) {
      const scrollAmount = 300;
      const newScroll =
        direction === "left"
          ? categoryScroll - scrollAmount
          : categoryScroll + scrollAmount;
      categoryContainerRef.current.scrollLeft = newScroll;
      setCategoryScroll(newScroll);
    }
  };

  const scrollProducts = (direction: "left" | "right") => {
    if (productContainerRef.current) {
      const scrollAmount = 300;
      const newScroll =
        direction === "left"
          ? productScroll - scrollAmount
          : productScroll + scrollAmount;
      productContainerRef.current.scrollLeft = newScroll;
      setProductScroll(newScroll);
    }
  };

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      {/* Hero Section - Optimized for Mobile */}
      <section className="relative h-[50vh] md:h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Office Furniture"
            className="w-full h-full object-cover object-center"
          />
          {/* Better gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-2xl text-white">
            <p className="uppercase tracking-[2px] md:tracking-[4px] text-xs md:text-sm mb-2 md:mb-4 text-primary font-semibold">
              Premium Office Furniture
            </p>
            <h1 className="text-2xl md:text-6xl font-extrabold leading-tight mb-3 md:mb-6">
              Elevate Your <span className="text-primary">Workspace</span>
              <br className="hidden md:block" /> With Modern Comfort
            </h1>
            <p className="text-sm md:text-xl mb-6 md:mb-10 text-white/85">
              Discover designer desks, ergonomic chairs, and modern office setups.
            </p>

            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
              <Link to="/shop" className="w-full md:w-auto">
                <Button
                  size="lg"
                  className="w-full md:w-auto bg-primary hover:bg-primary/90 text-sm md:text-lg px-4 md:px-8 py-4 md:py-6 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Shop Now
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>

              <Link to="/contact" className="w-full md:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full md:w-auto border-white/70 text-black hover:bg-white hover:text-black text-sm md:text-lg px-4 md:px-8 py-4 md:py-6 font-semibold rounded-full transition-all"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="bg-primary text-primary-foreground py-2 text-center text-xs md:text-sm">
        <p className="font-semibold">🎉 10% Free Shipping On All Orders Over AED 2000</p>
      </section>

      {/* Categories Slider Section */}
      <section className="py-8 md:py-20 bg-gradient-to-b from-white to-muted/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8 md:mb-14 animate-fade-in">
            <h2 className="text-2xl md:text-5xl font-extrabold mb-2 md:mb-4 text-brand-black">
              Explore by <span className="text-primary">Categories</span>
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Find everything you need to furnish your workspace
            </p>
          </div>

          {/* Categories Slider - Mobile Only */}
          <div className="lg:hidden relative">
            <div
              ref={categoryContainerRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-2 md:pb-4"
              style={{ scrollBehavior: "smooth" }}
            >
              {categories.map((category, index) => (
                <Link
                  key={index}
                  to={category.path}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/40 flex-shrink-0 w-40"
                >
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                    <div className="w-14 h-14 flex items-center justify-center bg-primary/10 text-primary rounded-full mb-4 transition-transform group-hover:scale-110">
                      <category.icon size={28} />
                    </div>
                    <h3 className="text-sm font-semibold mb-1 transition-colors group-hover:text-primary line-clamp-2">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            {/* Slider Navigation Buttons */}
            <button
              onClick={() => scrollCategories("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md hover:shadow-lg z-10 hidden md:flex"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scrollCategories("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md hover:shadow-lg z-10 hidden md:flex"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Categories Grid - Desktop Only */}
          <div className="hidden lg:grid grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.path}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/40"
              >
                <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                  <div className="w-16 h-16 flex items-center justify-center bg-primary/10 text-primary rounded-full mb-6 transition-transform group-hover:scale-110">
                    <category.icon size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 transition-colors group-hover:text-primary">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground opacity-80 mb-4">
                    Discover collection
                  </p>
                  <span className="inline-flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                    Browse <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Slider */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6 md:mb-12">
            <div className="animate-fade-in">
              <h2 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">Featured Products</h2>
              <p className="text-xs md:text-base text-muted-foreground">Discover our best-selling furniture</p>
            </div>
            <Link to="/shop" className="hidden md:block">
              <Button variant="outline" className="gap-2">
                View All
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No products available yet</p>
              <Link to="/shop">
                <Button variant="outline">Browse Shop</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Products Slider - Mobile Only */}
              <div className="lg:hidden relative">
                <div
                  ref={productContainerRef}
                  className="flex gap-3 md:gap-6 overflow-x-auto scroll-smooth pb-2 md:pb-4"
                  style={{ scrollBehavior: "smooth" }}
                >
                  {featuredProducts.map((product: any, index: number) => (
                    <div
                      key={index}
                      className="animate-fade-in-up flex-shrink-0 w-48 md:w-64"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ProductCard id={product.id ?? index} {...product} />
                    </div>
                  ))}
                </div>

                {/* Slider Navigation Buttons */}
                <button
                  onClick={() => scrollProducts("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md hover:shadow-lg z-10 hidden md:flex"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => scrollProducts("right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md hover:shadow-lg z-10 hidden md:flex"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Products Grid - Desktop Only */}
              <div className="hidden lg:grid grid-cols-4 gap-6">
                {featuredProducts.map((product: any, index: number) => (
                  <div
                    key={index}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard id={product.id ?? index} {...product} />
                  </div>
                ))}
              </div>
            </>
          )}

          <Link to="/shop" className="lg:hidden mt-6 block">
            <Button className="w-full" size="lg">
              View All Products
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </Link>
        </div>
      </section>

      <Portfolio />

      {/* Why Choose Us */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12 animate-fade-in">
            <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Why Choose Us?</h2>
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide the best office furniture solutions with exceptional service
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-3 md:p-6 rounded-xl bg-card hover:shadow-lg transition-shadow animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <feature.icon className="text-primary" size={24} />
                </div>
                <h3 className="text-base md:text-xl font-bold mb-1 md:mb-2">{feature.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 animate-fade-in">
            Ready to Transform Your Office?
          </h2>
          <p className="text-sm md:text-xl mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto animate-fade-in-up">
            Get 10% off on orders over AED 2000. Free delivery across Dubai!
          </p>
          <Link to="/shop">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-brand-black hover:bg-brand-gray text-sm md:text-lg px-6 md:px-8 animate-scale-in w-full md:w-auto"
            >
              Shop Now
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </Link>
        </div>
      </section>

      <ContactSection />
    </div>
  );
};

export default Home;