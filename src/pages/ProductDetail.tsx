import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import apiFetch, { BACKEND_URL } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("Default");

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => apiFetch(`/catalog/products/${id}/`),
    enabled: !!id,
  });

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

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate("/shop")}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const colorGroups = images.reduce((acc: any, img: any) => {
    if (!acc[img.color]) {
      acc[img.color] = [];
    }
    acc[img.color].push(img);
    return acc;
  }, {});

  const colors = Object.keys(colorGroups);
  const currentColorImages = colorGroups[selectedColor] || [];
  const mainImage = currentColorImages[0]?.image || product.image;

  const handleAddToCart = async () => {
    if (auth.user) {
      try {
        await apiFetch("/cart/add/", {
          method: "POST",
          body: JSON.stringify({
            product_id: id,
            quantity,
            color: selectedColor,
          }),
        });
        window.dispatchEvent(new Event("cart_updated"));
        navigate("/cart");
      } catch (err) {
        console.error("Add to cart failed", err);
        alert("Failed to add item to cart");
      }
    } else {
      const raw = localStorage.getItem("cart_items");
      const items = raw ? JSON.parse(raw) : [];
      const existing = items.find((x: any) => x.id === id && x.color === selectedColor);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + quantity;
      } else {
        items.push({
          id,
          name: product.name,
          price: product.price,
          quantity,
          color: selectedColor,
          product: product,
        });
      }
      localStorage.setItem("cart_items", JSON.stringify(items));
      window.dispatchEvent(new Event("cart_updated"));
      navigate("/cart");
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate("/shop")}
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Shop
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              {mainImage ? (
                <img
                  src={getImageUrl(mainImage)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}
            </div>

            {/* Thumbnail Images */}
            {currentColorImages.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {currentColorImages.map((img: any) => (
                  <button
                    key={img.id}
                    onClick={() => {
                      const temp = document.querySelector(
                        `[data-image-src="${img.image}"]`
                      ) as HTMLImageElement;
                      if (temp) {
                        const mainImg = document.querySelector(
                          ".aspect-square img"
                        ) as HTMLImageElement;
                        if (mainImg) mainImg.src = getImageUrl(img.image);
                      }
                    }}
                    className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary"
                  >
                    <img
                      src={getImageUrl(img.image)}
                      alt={`${product.name} - ${img.color}`}
                      className="w-full h-full object-cover"
                      data-image-src={img.image}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-primary">
                  AED {parseFloat(product.price).toFixed(2)}
                </span>
                <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </Badge>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <Card className="p-4 bg-muted/50">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </Card>
            )}

            {/* Color Selection */}
            {colors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Available Colors</h3>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        selectedColor === color
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 pt-6 border-t">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    −
                  </Button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 text-center border rounded-md py-2"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full gap-2 h-12"
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>
            </div>

            {/* Product Details Card */}
            <Card className="p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">SKU</span>
                <span className="font-medium">{product.sku}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{product.category?.name || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={product.is_active ? "default" : "secondary"}>
                  {product.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
