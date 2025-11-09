import { CheckCircle, Target, Eye, Award } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To provide premium office furniture solutions that enhance productivity and comfort in workspaces across the UAE.",
    },
    {
      icon: Eye,
      title: "Our Vision",
      description:
        "To become the leading office furniture provider in the region, known for quality, innovation, and customer satisfaction.",
    },
    {
      icon: Award,
      title: "Our Quality",
      description:
        "We ensure every piece of furniture meets the highest standards of durability, comfort, and aesthetic appeal.",
    },
  ];

  const features = [
    "Premium quality office furniture",
    "Wide range of modern designs",
    "Competitive pricing",
    "Fast delivery across UAE",
    "Professional installation service",
    "After-sales support",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Welcome to Dynamics Furniture LLC, your trusted partner for premium
              office furniture solutions in Dubai and across the UAE.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"
                alt="Office Furniture Showroom"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div className="animate-fade-in-up">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Located in Dragon Mart 1, Dubai, Dynamics Furniture LLC has been
                  serving businesses and individuals with top-quality office
                  furniture solutions. We understand that a well-furnished workspace
                  is essential for productivity and success.
                </p>
                <p>
                  Our extensive collection includes everything from ergonomic office
                  chairs and executive desks to complete workstation solutions and
                  storage units. Each piece is carefully selected to meet the diverse
                  needs of modern offices.
                </p>
                <p>
                  With years of experience in the furniture industry, we've built a
                  reputation for reliability, quality, and exceptional customer
                  service. Our team is dedicated to helping you create the perfect
                  workspace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Values & Commitment
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              What drives us to deliver excellence every day
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <value.icon className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose Dynamics Furniture?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-card rounded-lg animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CheckCircle className="text-primary flex-shrink-0" size={24} />
                  <span className="text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">
            Ready to Furnish Your Office?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto animate-fade-in-up">
            Visit our showroom in Dragon Mart 1 or contact us today for a consultation
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/contact" className="inline-block">
              <button className="bg-white text-brand-black px-8 py-3 rounded-md font-semibold hover:bg-brand-gray transition-colors">
                Contact Us
              </button>
            </a>
            <a href="/shop" className="inline-block">
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white/10 transition-colors">
                Browse Products
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
