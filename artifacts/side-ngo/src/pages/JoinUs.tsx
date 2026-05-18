import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CheckCircle2, HeartHandshake, Loader2, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiUrl } from '@/lib/api';

const volunteerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone required"),
  area: z.string().min(1, "Please select an area"),
  message: z.string().min(10, "Please tell us briefly why you want to join"),
});

type VolunteerForm = z.infer<typeof volunteerSchema>;

export default function JoinUs() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<VolunteerForm>({
    resolver: zodResolver(volunteerSchema)
  });

  const onSubmit = async (data: VolunteerForm) => {
    setSubmitError('');
    try {
      const res = await fetch(apiUrl("/volunteer"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setSubmitError(err.error || "Submission failed. Please try again.");
        return;
      }
      setIsSuccess(true);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    }
  };

  return (
    <Layout>
      <div className="bg-primary py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern-bg.png')] mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <HeartHandshake className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-5xl font-display font-bold mb-6">Volunteer With Us</h1>
          <p className="text-2xl text-white/90 font-display italic">
            "SIDE - Home For People full of Energy, Passion, Vision and Innovation - Working Towards a Brighter Future"
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-10">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                Join our community of changemakers. Your time and skills can make a significant difference in someone's life.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Phone</h4>
                  <p className="text-muted-foreground text-sm mt-1">+91  8810549812 | +91 8178748737 | +91 9310852889</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/30 text-accent-foreground flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Email</h4>
                  <p className="text-muted-foreground text-sm mt-1">sidevinayabhawan@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-card p-8 md:p-12 rounded-3xl border border-border shadow-xl">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-4">Thank You!</h3>
                  <p className="text-lg text-muted-foreground">
                    Your application has been received. Our team will review it and get back to you soon.
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="mt-8 text-primary font-semibold hover:underline"
                  >
                    Submit another application
                  </button>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold mb-8">Application Form</h3>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <input 
                          {...register("name")}
                          className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50"
                          placeholder="Jane Doe"
                        />
                        {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <input 
                          {...register("phone")}
                          className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50"
                          placeholder="+91..."
                        />
                        {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <input 
                          {...register("email")}
                          type="email"
                          className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50"
                          placeholder="jane@example.com"
                        />
                        {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Area of Interest</label>
                        <select 
                          {...register("area")}
                          className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50"
                        >
                          <option value="">Select an area...</option>
                          <option value="Education">Education & Teaching</option>
                          <option value="Skill Development">Skill Development</option>
                          <option value="Women Empowerment">Women Empowerment</option>
                          <option value="Child Development">Child Development</option>
                          <option value="Admin Support">Admin Support</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.area && <p className="text-destructive text-xs mt-1">{errors.area.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Why do you want to join SIDE?</label>
                      <textarea 
                        {...register("message")}
                        rows={5}
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 resize-none"
                        placeholder="Tell us about yourself and your motivation..."
                      />
                      {errors.message && <p className="text-destructive text-xs mt-1">{errors.message.message}</p>}
                    </div>

                    {submitError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                        {submitError}
                      </div>
                    )}
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-secondary text-secondary-foreground font-bold rounded-xl shadow-lg shadow-secondary/25 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                      Submit Application
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
