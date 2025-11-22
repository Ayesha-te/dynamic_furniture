import { Star, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import apiFetch, { BACKEND_URL } from "@/lib/api";

interface ProductCardProps {
  id?: number;
  name: string;
  price: string | number;
  discount_price?: string | number | null;
  image?: string;
  images?: any[];
  rating?: number;
  badge?: string;
}

const ProductCard = ({ id, name, price, discount_price, image, images, rating = 0, badge }: ProductCardProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleViewDetails = () => {
    navigate(`/product/${id}`);
  };

  const prefetchProduct = async () => {
    if (!id) return;
    try {
      await queryClient.prefetchQuery(["product", String(id)], () => apiFetch(`/catalog/products/${id}/`));
    } catch (e) {
      // ignore prefetch errors
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    
    const base = BACKEND_URL.replace(/\/$/, "");
    
    if (imagePath.startsWith("/")) {
      return `${base}${imagePath}`;
    }
    
    if (imagePath.startsWith("media/")) {
      return `${base}/${imagePath}`;
    }
    
    return `${base}/media/${imagePath}`;
  };
  
  useEffect(() => {
    console.log("ProductCard render:", { name, image, images, displayImage: image || (images && images[0]?.image) });
  }, [name, image, images]);
  
  // Prefer explicit image prop, otherwise fall back to first variant image if provided
  const displayImage = image || (images && images[0]?.image) || "";
  return (
    <Card
      className="group overflow-hidden hover-lift border-border bg-card cursor-pointer flex flex-col h-full"
      onClick={handleViewDetails}
      onMouseEnter={prefetchProduct}
      onFocus={prefetchProduct}
      onMouseDown={prefetchProduct}
    >
      <div className="relative aspect-square overflow-hidden bg-muted flex-shrink-0">
        {/* Discount badge: shows percent off if discount_price exists */}
        {discount_price && Number(price) > 0 && Number(price) > Number(discount_price) && (
          (() => {
            const p = Number(price);
            const d = Number(discount_price);
            const pct = Math.round(((p - d) / p) * 100);
            return (
              <div className="discount-badge">-{pct}%</div>
            );
          })()
        )}
        {badge && (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded z-10">
            {badge}
          </div>
        )}
        {displayImage ? (
          <img
            src={getImageUrl(displayImage)}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              console.error("Image failed to load:", getImageUrl(displayImage), e);
              e.currentTarget.style.display = "none";
            }}
            onLoad={() => {
              console.log("Image loaded successfully:", getImageUrl(displayImage));
            }}
          />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2 h-12">
          {name}
        </h3>
        
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({rating}.0)</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col gap-1">
            {discount_price ? (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  AED {price}
                </span>
                <span className="text-xl font-bold text-primary">
                  AED {discount_price}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-primary">AED {price}</span>
            )}
          </div>
          <Button 
            size="sm" 
            className="gap-2"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
          >
            <ShoppingCart size={16} />
            View
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
