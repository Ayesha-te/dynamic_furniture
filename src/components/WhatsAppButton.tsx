import { MessageCircle } from "lucide-react";

const WhatsappButton = () => {
  const phoneNumber = "971501234567";
  const message = "Hello! I'm interested in your products.";

  const handleClick = () => {
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 p-4 bg-green-500 hover:bg-green-600 rounded-2xl shadow-lg transition-all duration-200 hover:scale-110"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={28} className="text-white" />
    </button>
  );
};

export default WhatsappButton;
