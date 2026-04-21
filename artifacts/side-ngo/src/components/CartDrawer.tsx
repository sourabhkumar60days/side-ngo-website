import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, totalPrice } = useCart();
  const [, setLocation] = useLocation();

  const originalTotal = items.reduce((sum, item) => {
    const disc = Number(item.product.discount);
    const price = Number(item.product.price);
    const mrp = disc > 0 ? Math.round(price / (1 - disc / 100)) : price;
    return sum + mrp * item.quantity;
  }, 0);
  const savings = originalTotal - totalPrice;
  const hasAnyDiscount = items.some(i => Number(i.product.discount) > 0);

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl z-50 flex flex-col border-l border-border"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-display flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-primary" />
                Your Cart
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-lg font-medium">Your cart is empty</p>
                  <p className="text-sm mt-2">Explore our handmade products to support our cause.</p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setLocation('/products');
                    }}
                    className="mt-6 px-6 py-2 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-colors font-medium"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 border-b border-border/50 pb-6 last:border-0">
                    <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl.split(',')[0].trim()} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary/30 text-secondary">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.product.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {Number(item.product.discount) > 0 && (
                          <span className="text-xs text-muted-foreground line-through">
                            ₹{Math.round(Number(item.product.price) / (1 - Number(item.product.discount) / 100)).toLocaleString('en-IN')}
                          </span>
                        )}
                        <span className="text-primary font-bold">
                          ₹{Number(item.product.price).toLocaleString('en-IN')}
                        </span>
                        {Number(item.product.discount) > 0 && (
                          <span className="text-xs bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded">
                            {item.product.discount}% OFF
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-3 bg-muted rounded-lg px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:text-primary transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-4 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:text-primary transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-sm text-muted-foreground hover:text-destructive underline decoration-transparent hover:decoration-destructive transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-border bg-card">
                <div className="space-y-2 mb-4">
                  {hasAnyDiscount && (
                    <>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Original Price</span>
                        <span className="line-through">₹{originalTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-green-600 font-medium">
                        <span>Discount</span>
                        <span>− ₹{savings.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="h-px bg-border my-2" />
                    </>
                  )}
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Estimated</span>
                    <span className="text-2xl text-primary font-display">₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  {hasAnyDiscount && savings > 0 && (
                    <p className="text-xs text-green-600 font-medium text-right">
                      You save ₹{savings.toLocaleString('en-IN')} on this order 🎉
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setLocation('/checkout');
                  }}
                  className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                  Proceed to Order Inquiry
                </button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  No payment required now. We will contact you to confirm.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
