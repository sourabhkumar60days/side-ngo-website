import React from 'react';
import { Layout } from '@/components/Layout';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import {
  ArrowRight, Heart, BookOpen, GraduationCap, Users, Laptop,
  DollarSign, Baby, ShieldCheck, HandHeart, ShoppingBag, MapPin
} from 'lucide-react';
import { useEvents } from '@/hooks/use-events';
import { useProducts } from '@/hooks/use-products';
import { useCart } from '@/contexts/CartContext';
import { format } from 'date-fns';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=1920&q=85&auto=format&fit=crop';
const WOMEN_IMAGE = '/students-photo.jpg';
const CHILDREN_IMAGE = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&q=80&auto=format&fit=crop';
const SKILL_IMAGE = 'https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=900&q=80&auto=format&fit=crop';

export default function Home() {
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { addItem } = useCart();
  const latestEvents = [...(events || [])]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  const featuredProducts = products?.filter((p) => p.inStock).slice(0, 4) || [];

  const stats = [
    { label: 'Years of Service', value: '49+', icon: Heart, color: 'text-primary' },
    { label: 'Women Empowered', value: '10,000+', icon: Users, color: 'text-secondary' },
    { label: 'Children Educated', value: '25,000+', icon: GraduationCap, color: 'text-accent' },
  ];

  const programs = [
    {
      title: 'Education',
      desc: 'Remedial Classes and Child & Parents Counseling for underprivileged communities.',
      icon: BookOpen,
      color: 'bg-pink-100 text-pink-700',
      borderColor: '#f472b6',
      glow: 'rgba(244,114,182,0.55)',
    },
    {
      title: 'Skill Development',
      desc: 'Computer Training, Cutting & Tailoring, Beauty Culture and Mehndi Designing.',
      icon: Laptop,
      color: 'bg-purple-100 text-purple-700',
      borderColor: '#a78bfa',
      glow: 'rgba(167,139,250,0.55)',
    },
    {
      title: 'Micro Finance',
      desc: 'Self Help Groups, SHG Federations, Income Generation Activities and Entrepreneurship Support.',
      icon: DollarSign,
      color: 'bg-emerald-100 text-emerald-700',
      borderColor: '#34d399',
      glow: 'rgba(52,211,153,0.55)',
    },
    {
      title: 'Child & Youth Development',
      desc: 'NCP programs, Latent Development and Personality Training for young minds.',
      icon: Baby,
      color: 'bg-orange-100 text-orange-700',
      borderColor: '#fb923c',
      glow: 'rgba(251,146,60,0.55)',
    },
    {
      title: 'Women Empowerment',
      desc: 'Day Celebrations, Legal Awareness, Mohalla Sabha and Exposure Visits for women.',
      icon: ShieldCheck,
      color: 'bg-rose-100 text-rose-700',
      borderColor: '#fb7185',
      glow: 'rgba(251,113,133,0.55)',
    },
    {
      title: 'Community Work',
      desc: 'Grassroots community engagement and social development initiatives across New Delhi.',
      icon: HandHeart,
      color: 'bg-teal-100 text-teal-700',
      borderColor: '#2dd4bf',
      glow: 'rgba(45,212,191,0.55)',
    },
  ];

  return (
    <Layout>
      {/* ── Hero Section ── */}
      <section className="relative min-h-[70vh] md:min-h-[92vh] flex items-center justify-center pt-16 pb-16 md:pt-20 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-rose-900 via-purple-900 to-indigo-950">
          <img
            src={HERO_IMAGE}
            alt=""
            className="w-full h-full object-cover object-center"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
            >
              <span className="inline-block py-1.5 px-4 rounded-full bg-primary/25 border border-primary/40 text-white font-semibold text-sm mb-6 uppercase tracking-wider backdrop-blur-sm">Since 1975</span>
              <h1 className="text-[clamp(1.8rem,8.5vw,2.6rem)] sm:text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
                Working Towards a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 block">Brighter Future</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed">
                Founded by SMMI sisters, SIDE is dedicated to the holistic development and empowerment of Women, Youth and Children in marginalized communities of New Delhi.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  href="/about"
                  className="px-8 py-4 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                >
                  Discover Our Mission
                </Link>
                <Link
                  href="/join"
                  className="px-8 py-4 rounded-xl bg-white/15 text-white border border-white/30 font-semibold backdrop-blur-sm hover:bg-white/25 transition-all duration-300 flex items-center gap-2"
                >
                  Volunteer With Us <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* ── Impact Stats ── */}
      <section className="py-20 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12 }}
                className="flex flex-col items-center text-center p-8 rounded-3xl bg-background border border-border shadow-sm"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-4xl font-display font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* ── Emotional Photo + About Strip ── */}
      <section className="py-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[480px]">
          <div className="relative overflow-hidden bg-slate-300">
            <img
              src={WOMEN_IMAGE}
              alt="Happy rural Indian women and children"
              className="w-full h-full object-cover"
              style={{ minHeight: 320 }}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/20" />
          </div>
          <div className="flex items-center bg-card px-8 lg:px-16 py-16">
            <div className="max-w-lg">
              <span className="text-primary font-semibold uppercase tracking-wider text-[18px]">Who We Are</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-6">
                Society for Integrated Development Through Empowerment
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                SIDE is a Society/NGO (Regn. No. S/489/District. South/2011) registered under the Societies Registration Act XXI of 1860. We are founded, run and managed by the SMMI (Salesian Missionaries of Mary Immaculate) sisters, who spread the compassionate love of Jesus through their social ministry.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                We follow Jesus who is meek and humble of heart as taught by our Patron Saint St. Francis De Sales — guided by the salesian virtues of Love, Simplicity, Amenity, Hospitality, and Kindness.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
              >
                Learn Our Story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* ── All 6 Programs ── */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-semibold uppercase tracking-wider text-[18px]">What We Do</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">Our Core Programs</h2>
            <p className="text-muted-foreground text-lg">
              We focus on sustainable development through integrated approaches that empower communities from within.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((prog, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="group p-8 rounded-3xl bg-background hover:-translate-y-2 transition-all duration-300"
                style={{
                  border: `1.5px solid ${prog.borderColor}`,
                  boxShadow: `0 0 10px ${prog.glow}, 0 0 24px ${prog.glow}, inset 0 0 8px ${prog.glow.replace('0.55', '0.10')}`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    `0 0 16px ${prog.glow}, 0 0 40px ${prog.glow}, 0 0 60px ${prog.glow.replace('0.55','0.30')}, inset 0 0 12px ${prog.glow.replace('0.55','0.15')}`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    `0 0 10px ${prog.glow}, 0 0 24px ${prog.glow}, inset 0 0 8px ${prog.glow.replace('0.55', '0.10')}`;
                }}
              >
                <div className={`w-14 h-14 rounded-2xl ${prog.color} flex items-center justify-center mb-6`}>
                  <prog.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{prog.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed text-sm">{prog.desc}</p>
                <Link
                  href="/about"
                  className="text-primary font-semibold flex items-center gap-1 hover:gap-3 transition-all text-sm"
                >
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* ── Children Photo Strip ── */}
      <section className="relative h-80 overflow-hidden bg-slate-700">
        <img
          src={CHILDREN_IMAGE}
          alt="Children receiving education and support"
          className="w-full h-full object-cover object-center"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/30 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            <p className="text-white/90 text-xl md:text-2xl font-display italic font-semibold max-w-2xl">
              "Every child deserves a chance to dream, learn, and grow."
            </p>
          </div>
        </div>
      </section>
      {/* ── Latest Events ── */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Stay Updated</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-2">Latest Events</h2>
              <p className="text-muted-foreground">See our recent activities and community engagements.</p>
            </div>
            <Link
              href="/events"
              className="hidden md:flex px-6 py-2.5 rounded-full border-2 border-border font-semibold hover:border-primary hover:text-primary transition-colors text-sm"
            >
              View All Events
            </Link>
          </div>

          {eventsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="h-96 bg-muted rounded-3xl animate-pulse" />)}
            </div>
          ) : latestEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestEvents.map((event) => (
                <Link
                  key={event.id}
                  href="/events"
                  className="group rounded-3xl overflow-hidden bg-background border border-border shadow-md hover:shadow-xl transition-all duration-300 block cursor-pointer"
                >
                  <div className="h-48 bg-muted relative overflow-hidden">
                    {event.driveImageUrl ? (
                      <img
                        src={event.driveImageUrl.split(',')[0].trim()}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <img
                        src={SKILL_IMAGE}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      />
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary">
                      {format(new Date(event.date), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2 line-clamp-1">{event.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {event.location}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground bg-background rounded-3xl border border-dashed">
              No recent events found.
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link href="/events" className="inline-flex px-6 py-3 rounded-full bg-primary/10 text-primary font-semibold">
              View All Events
            </Link>
          </div>
        </div>
      </section>
      {/* ── Handmade Products ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-accent-foreground text-sm font-semibold px-3 py-1 rounded-full uppercase tracking-wider bg-[#79d2b5ab]">Support Our Work</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold mt-4 mb-2">Handmade Products</h2>
              <p className="text-muted-foreground max-w-xl">
                Beautiful handcrafted items made by skilled women from our skill development programs. Every purchase empowers a woman.
              </p>
            </div>
            <Link
              href="/products"
              className="hidden md:flex px-6 py-2.5 rounded-full border-2 border-border font-semibold hover:border-primary hover:text-primary transition-colors text-sm"
            >
              Shop All Products
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-80 bg-muted rounded-3xl animate-pulse" />)}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link key={product.id} href="/products" className="block">
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="group rounded-3xl overflow-hidden bg-background border border-border shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="h-52 bg-muted relative overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl.split(',')[0].trim()}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary/10">
                        <ShoppingBag className="w-12 h-12 text-secondary/40" />
                      </div>
                    )}
                    {product.categoryName && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold text-foreground">
                        {product.categoryName}
                      </div>
                    )}
                    {product.inStock && Number(product.discount) > 0 && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                        {product.discount}% OFF
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                        <span className="bg-black text-white px-4 py-1.5 rounded-full font-bold text-sm uppercase tracking-wider">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-base mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {Number(product.discount) > 0 && (
                          <span className="text-xs text-muted-foreground line-through">
                            ₹{Math.round(Number(product.price) / (1 - Number(product.discount) / 100)).toLocaleString('en-IN')}
                          </span>
                        )}
                        <span className="text-lg font-bold text-primary">
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <button
                        disabled={!product.inStock}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); product.inStock && addItem(product); }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          product.inStock
                            ? 'bg-primary text-white hover:shadow-md hover:-translate-y-0.5'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                      >
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground bg-background rounded-3xl border border-dashed">
              Products coming soon.
            </div>
          )}

          <div className="mt-10 text-center md:hidden">
            <Link href="/products" className="inline-flex px-6 py-3 rounded-full bg-primary/10 text-primary font-semibold">
              Shop All Products
            </Link>
          </div>
        </div>
      </section>
      {/* ── Join Us CTA ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-slate-800">
          <img
            src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1920&q=80&auto=format&fit=crop"
            alt="Community volunteers working together"
            className="w-full h-full object-cover object-center"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/75 to-foreground/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              SIDE — Home For People Full of<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                Energy, Passion, Vision and Innovation
              </span>
            </h2>
            <p className="text-white/75 text-lg mb-10 max-w-2xl mx-auto">
              Join us in building a more equitable world. Every volunteer, every helping hand, every act of kindness makes a difference.
            </p>
            <Link
              href="/join"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              Join Us <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
