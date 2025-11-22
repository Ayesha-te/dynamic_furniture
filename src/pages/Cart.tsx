import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiFetch from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

type CartItem = {
  id?: number;
  product?: {
    id?: number;
    name?: string;
    price?: number;
    discount_price?: number | null;
    delivery_charges?: number;
    image?: string;
    images?: Array<{
      id?: number;
      image?: string;
      color?: string;
      alt_text?: string;
    }>;
  };
  name?: string;
  quantity: number;
  price?: number;
  discount_price?: number | null;
  delivery_charges?: number;
  selected?: boolean;
  color?: string;
};

const Cart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [step, setStep] = useState<"cart" | "checkout" | "confirm">("cart");
  const [checkoutForm, setCheckoutForm] = useState({
    phone: "",
    address: "",
    city: "",
    postal: "",
  });

  const navigate = useNavigate();
  const auth = useAuth();

  const load = useCallback(async () => {
    if (auth.user) {
      try {
        const data = (await apiFetch("/cart/")) as { items?: CartItem[] };
        const updated = (data.items || []).map((i: CartItem) => ({
          ...i,
          selected: true,
          color: i.color || "Default",
        }));
        setItems(updated);
      } catch (err) {
        console.error(err);
        setItems([]);
      }
    } else {
      // Load guest cart from localStorage immediately for instant UX
      try {
        const raw = localStorage.getItem("cart_items");
        const parsed = raw ? JSON.parse(raw) : [];

        // Sanitize guest items: ensure numeric id or product.id exists and quantity > 0
        const sanitized = (parsed || [])
          .filter((i: any) => {
            const idOk = (i && (Number(i.id) || (i.product && Number(i.product.id)))) && Number(i.quantity) > 0;
            return !!idOk;
          })
          .map((i: CartItem) => ({
            ...i,
            selected: true,
            color: i.color || "Default",
            quantity: Number(i.quantity) || 1,
          }));

        if (!sanitized.length && raw) {
          // If storage had items but none are valid, remove stale key
          localStorage.removeItem("cart_items");
        }

        setItems(sanitized);
      } catch (e) {
        console.error("Failed to read guest cart from localStorage", e);
        setItems([]);
      }
    }
  }, [auth.user]);

  useEffect(() => {
    load();
  }, [auth.user]);

  useEffect(() => {
    const onCartUpdated = (e: Event) => {
      try {
        // If event carried a detail (optimistic add), merge it into state immediately
        const evt = e as CustomEvent;
        const detail = evt?.detail;
        if (detail && detail.item) {
          const added: CartItem = detail.item;
          setItems((prev) => {
            // try to merge by product id + color
            const existingIndex = prev.findIndex(
              (p) => p.id === added.id && (p.color || "Default") === (added.color || "Default")
            );
            if (existingIndex !== -1) {
              const copy = [...prev];
              copy[existingIndex] = { ...copy[existingIndex], quantity: (copy[existingIndex].quantity || 0) + (added.quantity || 1) };
              if (!auth.user) localStorage.setItem("cart_items", JSON.stringify(copy));
              return copy;
            }
            const next = [{ ...added, selected: true }, ...prev];
            if (!auth.user) localStorage.setItem("cart_items", JSON.stringify(next));
            return next;
          });
          return;
        }
      } catch (err) {
        console.error("Error handling cart_updated event detail", err);
      }

      // default: reload from source
      load();
    };

    window.addEventListener("cart_updated", onCartUpdated as EventListener);
    return () => window.removeEventListener("cart_updated", onCartUpdated as EventListener);
  }, [load]);

  const toggleSelect = (id?: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i))
    );
  };

  const updateQuantity = (id?: number, qty?: number) => {
    if (!id || !qty || qty < 1) return;

    setItems((prev) => {
      const updated = prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i));
      if (!auth.user) {
        localStorage.setItem("cart_items", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateColor = (id?: number, color?: string) => {
    setItems((prev) => {
      const updated = prev.map((i) => (i.id === id ? { ...i, color } : i));
      if (!auth.user) {
        localStorage.setItem("cart_items", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const getImageUrl = (item: CartItem): string => {
    if (!item.product) return "";
    
    const selectedColor = item.color || "Default";
    const colorImage = item.product.images?.find((img) => img.color === selectedColor);
    
    return colorImage?.image || item.product.image || "";
  };

  const getAvailableColors = (item: CartItem): string[] => {
    if (!item.product?.images) return ["Default"];
    return Array.from(new Set(item.product.images.map((img) => img.color || "Default")));
  };

  const remove = async (itemId?: number) => {
    if (!itemId) return;
    
    if (auth.user) {
      try {
        const data = await apiFetch("/cart/remove/", {
          method: "POST",
          body: JSON.stringify({ item_id: itemId }),
        });
        setItems(data.items || []);
      } catch (err) {
        console.error(err);
      }
    } else {
      const updated = items.filter((i) => i.id !== itemId);
      setItems(updated);
      if (updated.length > 0) {
        localStorage.setItem("cart_items", JSON.stringify(updated));
      } else {
        localStorage.removeItem("cart_items");
      }
    }
  };

  const proceedCheckout = () => {
    const selectedItems = items.filter((i) => i.selected);
    if (!selectedItems.length) return alert("Select at least one item");

    if (!auth.user) return navigate("/login");

    setStep("checkout");
  };

  const confirmOrder = async () => {
    try {
      const selectedItems = items.filter((i) => i.selected);
      const cartData = selectedItems.map((i) => ({
        id: i.id,
        quantity: i.quantity,
        color: i.color,
      }));

      const order = await apiFetch("/orders/checkout/", {
        method: "POST",
        body: JSON.stringify({
          items: cartData,
          shipping: checkoutForm,
        }),
      });

      alert("✅ Order created successfully! Order ID: " + order.id);
      // Clear client state and notify other UI pieces (Header)
      setItems([]);
      try {
        localStorage.removeItem("cart_items");
      } catch (e) {
        // ignore if localStorage unavailable
      }
      window.dispatchEvent(new Event("cart_updated"));
      setStep("cart");
    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    }
  };

  // ---------- UI ----------
  if (!items.length)
    return (
      <section className="container mx-auto py-12">
        <h2 className="text-2xl font-bold mb-4">Your Cart is empty</h2>
      </section>
    );

  return (
    <section className="container mx-auto py-12">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <ShoppingCart /> {step === "cart" ? "Your Cart" : step === "checkout" ? "Shipping Details" : "Confirm Order"}
      </h2>

      {/* STEP 1: CART */}
      {step === "cart" && (
        <>
          <div className="grid gap-4">
            {items.map((it) => {
              const imageUrl = getImageUrl(it);
              const colors = getAvailableColors(it);
              return (
                <div key={it.id} className="flex items-start gap-4 p-4 border rounded">
                  <input
                    type="checkbox"
                    checked={it.selected}
                    onChange={() => toggleSelect(it.id)}
                    className="mt-2"
                  />

                  {imageUrl && (
                    <img 
                      src={imageUrl} 
                      alt={it.product?.name} 
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}

                  <div className="flex-1">
                    <div className="font-semibold text-lg">{it.product?.name || it.name}</div>
                    
                    <div className="mt-2 space-y-2">
                      <div>
                        <label className="text-sm text-muted-foreground">Qty:</label>
                        <input
                          type="number"
                          value={it.quantity}
                          min={1}
                          onChange={(e) => updateQuantity(it.id, Number(e.target.value))}
                          className="border px-2 py-1 w-20 rounded ml-2"
                        />
                      </div>

                      {colors.length > 1 ? (
                        <div>
                          <label className="text-sm text-muted-foreground">Color:</label>
                          <select
                            value={it.color}
                            onChange={(e) => updateColor(it.id, e.target.value)}
                            className="border px-2 py-1 rounded ml-2"
                          >
                            {colors.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="text-sm">Color: {it.color || "Default"}</div>
                      )}
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <div className="space-y-1">
                      {(it.product?.discount_price || it.discount_price) ? (
                        <>
                          <div className="text-sm text-muted-foreground line-through">AED {it.product?.price || it.price}</div>
                          <div className="font-medium text-lg">AED {it.product?.discount_price || it.discount_price}</div>
                        </>
                      ) : (
                        <div className="font-medium text-lg">AED {it.product?.price || it.price}</div>
                      )}
                    </div>
                    {(it.product?.delivery_charges || it.delivery_charges) ? (
                      <div className="text-sm text-muted-foreground">DC: AED {it.product?.delivery_charges || it.delivery_charges}</div>
                    ) : null}
                    <Button variant="ghost" size="sm" onClick={() => remove(it.id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <Button onClick={proceedCheckout} className="bg-primary text-white">
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}

      {/* STEP 2: CHECKOUT FORM */}
      {step === "checkout" && (
        <div className="grid gap-4 max-w-lg">
          <div>
            <label className="text-sm font-medium">Phone Number (Optional)</label>
            <input
              placeholder="Your phone number"
              className="border p-2 rounded w-full mt-1"
              value={checkoutForm.phone}
              onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Address (Optional)</label>
            <input
              placeholder="Delivery address"
              className="border p-2 rounded w-full mt-1"
              value={checkoutForm.address}
              onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">If left empty, will use your email</p>
          </div>
          <div>
            <label className="text-sm font-medium">City (Optional)</label>
            <input
              placeholder="City"
              className="border p-2 rounded w-full mt-1"
              value={checkoutForm.city}
              onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Postal Code (Optional)</label>
            <input
              placeholder="Postal Code"
              className="border p-2 rounded w-full mt-1"
              value={checkoutForm.postal}
              onChange={(e) => setCheckoutForm({ ...checkoutForm, postal: e.target.value })}
            />
          </div>

          <Button onClick={() => setStep("confirm")} className="bg-primary text-white">
            Continue
          </Button>
        </div>
      )}

      {/* STEP 3: CONFIRM ORDER */}
      {step === "confirm" && (
        <div className="max-w-lg space-y-4">
          <h3 className="text-xl font-bold">Review Your Order</h3>

          {items
            .filter((i) => i.selected)
            .map((i) => {
              const imageUrl = getImageUrl(i);
              return (
                <div key={i.id} className="p-3 border rounded flex gap-3">
                  {imageUrl && (
                    <img 
                      src={imageUrl} 
                      alt={i.product?.name} 
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold">{i.product?.name}</div>
                    <div>Quantity: {i.quantity}</div>
                    <div>Color: {i.color}</div>
                    <div className="space-y-1">
                      {(i.product?.discount_price || i.discount_price) ? (
                        <>
                          <div className="text-sm text-muted-foreground line-through">AED {i.product?.price || i.price}</div>
                          <div className="font-medium">AED {i.product?.discount_price || i.discount_price}</div>
                        </>
                      ) : (
                        <div className="font-medium">AED {i.product?.price || i.price}</div>
                      )}
                    </div>
                    {(i.product?.delivery_charges || i.delivery_charges) ? (
                      <div className="text-sm text-muted-foreground">Delivery: AED {i.product?.delivery_charges || i.delivery_charges}</div>
                    ) : null}
                  </div>
                </div>
              );
            })}

          <h4 className="text-lg font-semibold">Shipping Details</h4>
          <div>Phone: {checkoutForm.phone}</div>
          <div>Address: {checkoutForm.address}</div>
          <div>City: {checkoutForm.city}</div>
          <div>Postal Code: {checkoutForm.postal}</div>

          <div className="border-t pt-4">
            <h4 className="text-lg font-semibold mb-2">Order Summary</h4>
            <div className="space-y-2">
              {(() => {
                const selectedItems = items.filter(i => i.selected);
                const subtotal = selectedItems.reduce((sum, i) => {
                  const discountPrice = i.product?.discount_price || i.discount_price;
                  const price = discountPrice ? Number(discountPrice) : (Number(i.product?.price) || Number(i.price) || 0);
                  return sum + (price * i.quantity);
                }, 0);
                const deliveryTotal = selectedItems.reduce((sum, i) => sum + (Number(i.product?.delivery_charges) || Number(i.delivery_charges) || 0), 0);
                const total = subtotal + deliveryTotal;

                return (
                  <>
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>AED {subtotal.toFixed(2)}</span>
                    </div>
                    {deliveryTotal > 0 && (
                      <div className="flex justify-between">
                        <span>Delivery Charges:</span>
                        <span>AED {deliveryTotal.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>AED {total.toFixed(2)}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          <Button onClick={confirmOrder} className="bg-primary text-white w-full">
            Confirm Order
          </Button>
        </div>
      )}
    </section>
  );
};

export default Cart;
