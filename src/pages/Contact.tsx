import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Our Address",
      details: "Dragon mart 1 Shop #JA10, Dubai, United Arab Emirates",
    },
    {
      icon: Phone,
      title: "Phone Number",
      details: "+971 557 324 185",
    },
    {
      icon: Mail,
      title: "Email Address",
      details: "dynamicsfurniture1@gmail.com",
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: "Saturday - Thursday: 9:00 AM - 9:00 PM",
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll
            respond as soon as possible.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <Card
              key={index}
              className="p-6 text-center hover:shadow-lg transition-shadow animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <info.icon className="text-primary" size={28} />
              </div>
              <h3 className="font-bold mb-2">{info.title}</h3>
              <p className="text-sm text-muted-foreground">{info.details}</p>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="animate-fade-in">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name
                    </label>
                    <Input placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <Input placeholder="Doe" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" placeholder="john@example.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input type="tel" placeholder="+971 XX XXX XXXX" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <Input placeholder="How can we help you?" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea
                    placeholder="Tell us more about your requirements..."
                    rows={5}
                  />
                </div>

                <Button className="w-full" size="lg">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>

          {/* Map & Additional Info */}
          <div className="space-y-8 animate-fade-in-up">
            <Card className="overflow-hidden">
              <div className="h-80 bg-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3613.1872634132!2d55.3872!3d25.1746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f64d8e4c5f7e9%3A0x7c8f9c8b8e8e8e8e!2sDragon%20Mart!5e0!3m2!1sen!2sae!4v1234567890123"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Card>

            <Card className="p-8 bg-primary text-primary-foreground">
              <h3 className="text-2xl font-bold mb-4">Visit Our Showroom</h3>
              <p className="mb-6 opacity-90">
                Experience our furniture collection in person. Our showroom features
                a wide range of office furniture displays to help you make the right
                choice for your workspace.
              </p>
              <div className="space-y-3 opacity-90">
                <p>
                  <strong>Location:</strong> Dragon Mart 1, Shop #JA10
                </p>
                <p>
                  <strong>Parking:</strong> Free parking available
                </p>
                <p>
                  <strong>Accessibility:</strong> Wheelchair accessible
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: "Do you offer delivery services?",
                a: "Yes, we offer free delivery across Dubai for orders over AED 2000.",
              },
              {
                q: "Can I customize furniture?",
                a: "Absolutely! We offer customization options for many of our furniture pieces.",
              },
              {
                q: "What is your return policy?",
                a: "We offer a 30-day return policy for unused items in original condition.",
              },
              {
                q: "Do you provide installation?",
                a: "Yes, we provide professional installation services for all our furniture.",
              },
            ].map((faq, index) => (
              <Card
                key={index}
                className="p-6"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h4 className="font-bold mb-2">{faq.q}</h4>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
