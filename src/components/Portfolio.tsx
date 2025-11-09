import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import portfolioGalleryImage from "@/assets/hero-office.jpg";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Portfolio = () => {
  const containerRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

   const portfolioImages = [
    {
      id: 1,
      category: "Office Chairs",
      title: "Ergonomic Comfort Collection",
      image:
        "https://images.pexels.com/photos/1181395/pexels-photo-1181395.jpeg",
      size: "small",
    },
    {
      id: 2,
      category: "Executive Desks",
      title: "Modern Executive Workspace",
      image:
        "https://images.pexels.com/photos/5717314/pexels-photo-5717314.jpeg",
      size: "large",
    },
    {
      id: 3,
      category: "Meeting Tables",
      title: "Collaborative Boardroom Design",
      image:
        "https://images.pexels.com/photos/2976970/pexels-photo-2976970.jpeg",
      size: "large",
    },
    {
      id: 4,
      category: "Storage Solutions",
      title: "Smart Office Cabinets",
      image:
        "https://images.pexels.com/photos/1181395/pexels-photo-1181395.jpeg",
      size: "small",
    },
    {
      id: 5,
      category: "Reception Counters",
      title: "Luxury Front Desk Setup",
      image:
        "https://images.pexels.com/photos/518244/pexels-photo-518244.jpeg",
      size: "small",
    },
    {
      id: 6,
      category: "Conference Chairs",
      title: "Professional Meeting Comfort",
      image:
        "https://images.pexels.com/photos/9300724/pexels-photo-9300724.jpeg",
      size: "large",
    },
    {
      id: 7,
      category: "Workstations",
      title: "Functional Modular Setup",
      image:
        "https://images.pexels.com/photos/6794967/pexels-photo-6794967.jpeg",
      size: "large",
    },
    {
      id: 8,
      category: "Office Decor",
      title: "Minimal & Modern Interiors",
      image: portfolioGalleryImage,
      size: "large",
    },
  ];

  // Split images into two rows
  const row1Images = portfolioImages.filter((_, index) => index % 2 === 0);
  const row2Images = portfolioImages.filter((_, index) => index % 2 === 1);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      const scrollAmount = isMobile ? window.innerWidth * 0.3 : window.innerWidth * 0.5;
      const row2ScrollAmount = isMobile ? window.innerWidth * 0.05 : window.innerWidth * 0.1;

      gsap.to(row1Ref.current, {
        x: -scrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(row2Ref.current, {
        x: row2ScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.fromTo(
        ".portfolio-image",
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const ImageCard = ({ item }) => (
    <div
      className={`portfolio-image group relative overflow-hidden rounded-2xl flex-shrink-0 cursor-pointer transition-all duration-500 hover:scale-105 ${
        item.size === "large"
          ? "w-[250px] h-[180px] sm:w-[350px] sm:h-[250px] md:w-[500px] md:h-[350px] lg:w-[600px] lg:h-[400px]"
          : "w-[160px] h-[130px] sm:w-[220px] sm:h-[180px] md:w-[300px] md:h-[250px] lg:w-[350px] lg:h-[280px]"
      }`}
    >
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
        <span className="inline-block px-3 py-1 bg-gold/80 text-white text-xs font-medium rounded-full mb-2 backdrop-blur-sm">
          {item.category}
        </span>
        <h4 className="text-lg font-bold mb-1">{item.title}</h4>
        <p className="text-white/80 text-sm">Elegant workspace solutions</p>
      </div>

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <button className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
      </div>

      <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/30 rounded-2xl transition-all duration-500"></div>
    </div>
  );

  return (
    <section ref={containerRef} className="py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Explore <span className="text-primary">Office Furniture</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover our collection of modern and ergonomic office furniture —
            from premium chairs and desks to modular workstations and elegant
            reception setups.
          </p>
        </div>
      </div>

      {/* Scrolling Image Rows */}
      <div className="space-y-4 md:space-y-8">
        <div className="relative overflow-hidden">
          <div
            ref={row1Ref}
            className="flex gap-2 sm:gap-3 md:gap-6 w-max"
            style={{ willChange: "transform" }}
          >
            {[...row1Images, ...row1Images].map((item, index) => (
              <ImageCard key={`row1-${index}`} item={item} />
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div
            ref={row2Ref}
            className="flex gap-2 sm:gap-3 md:gap-6 w-max ml-[-30px] sm:ml-[-50px] md:ml-[-100px]"
            style={{ willChange: "transform" }}
          >
            {[...row2Images, ...row2Images].map((item, index) => (
              <ImageCard key={`row2-${index}`} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
        <Link to="/shop" className="inline-block bg-gold hover:bg-gold-light text-brand-black font-medium px-8 py-3 rounded-full transition-all duration-300 hover:scale-105">
          Shop Office Furniture
        </Link>
        <Link to="/shop" className="inline-block ml-4 bg-gold hover:bg-gold-light text-brand-black font-medium px-8 py-3 rounded-full transition-all duration-300 hover:scale-105">
          Customize Your Workspace
        </Link>
      </div>
    </section>
  );
};

export default Portfolio;
