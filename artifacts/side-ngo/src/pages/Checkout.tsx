import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { useCreateOrder } from '@/hooks/use-orders';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'wouter';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone required"),
  email: z.string().email("Valid email required"),
  address: z.string().min(10, "Full address is required"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema)
  });

  const onSubmit = async (data: CheckoutForm) => {
    try {
      const itemsString = items.map(i => `${i.quantity}x ${i.product.name} (₹${i.product.price})`).join('\n');
      await createOrder.mutateAsync({
        ...data,
        items: itemsString,
        totalAmount: totalPrice
      });
      clearCart();
      setIsSuccess(true);
    } catch (error) {
      console.error("Failed to submit order", error);
      alert("Failed to submit order. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center p-4">
          <div className="bg-card border border-border p-10 rounded-3xl shadow-xl max-w-lg w-full text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">Order Received</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Your order request has been received. We will contact you shortly on the provided phone number for payment and delivery confirmation.
            </p>
            <Link href="/products" className="inline-flex px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all">
              Return to Shop
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link href="/products" className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Go back to products
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-display font-bold mb-10">Checkout Inquiry</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Your Details</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input 
                  {...register("fullName")}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Jane Doe"
                />
                {errors.fullName && <p className="text-destructive text-sm mt-1">{errors.fullName.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input 
                    {...register("phone")}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="+91"
                  />
                  {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input 
                    {...register("email")}
                    type="email"
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="jane@example.com"
                  />
                  {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Delivery Address</label>
                <textarea 
                  {...register("address")}
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Full street address..."
                />
                {errors.address && <p className="text-destructive text-sm mt-1">{errors.address.message}</p>}
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              >
                {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                Submit Order Inquiry
              </button>
              <p className="text-sm text-center text-muted-foreground mt-4">
                Note: No payment is collected now. We will review your inquiry and contact you.
              </p>
            </form>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-muted/30 p-8 rounded-3xl border border-border/50 sticky top-32">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 bg-card p-4 rounded-xl border border-border/50">
                    <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      {item.product.imageUrl && <img src={item.product.imageUrl.split(',')[0].trim()} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm line-clamp-1">{item.product.name}</h4>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-muted-foreground text-sm">Qty: {item.quantity}</span>
                        <span className="font-bold text-primary">₹{item.product.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-6 mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-sm italic">Calculated later</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary text-3xl font-display">₹{totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
