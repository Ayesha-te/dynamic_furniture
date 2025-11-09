import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send } from 'lucide-react';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const sectionRef = useRef(null);
  const bannerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Moving banner animation
      if (bannerRef.current) {
        const bannerWidth = bannerRef.current.scrollWidth;
        const containerWidth = bannerRef.current.parentElement.offsetWidth;
        
        gsap.to(bannerRef.current, {
          x: -(bannerWidth - containerWidth),
          duration: 20,
          ease: "none",
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize(value => {
              const num = parseFloat(value);
              if (num <= -(bannerWidth - containerWidth)) {
                return 0;
              }
              return num;
            })
          }
        });
      }

      // Content animations
      gsap.fromTo(".contact-animate", 
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-primary overflow-hidden">
      {/* Moving Text Banner */}
      <div className="relative py-8 overflow-hidden border-b border-gray-700">
        <div 
          ref={bannerRef}
          className="flex whitespace-nowrap"
          style={{ width: 'max-content' }}
        >
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex items-center">
              <span className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mr-16">
               DYNAMICS  <span style={{ fontFamily: 'QeneG', fontWeight: 'normal' }}> FURNITURE</span>
              </span>
              <div className="w-4 h-4 bg-gold rounded-full mr-16"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      
    </section>
  );
};

export default ContactSection;
