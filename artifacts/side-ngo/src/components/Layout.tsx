import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, ShoppingBag, Mail, Phone, MapPin } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { CartDrawer } from './CartDrawer';
import { useSettings } from '@/hooks/use-settings';

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
    </svg>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { data: settings } = useSettings();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Team', path: '/team' },
    { name: 'Events', path: '/events' },
    { name: 'Handmade Products', path: '/products' },
  ];

  const socialLinks = [
    {
      icon: FacebookIcon,
      url: 'https://www.facebook.com/SideNgo1/',
      label: 'Facebook',
      hoverColor: 'hover:bg-blue-600',
    },
    {
      icon: InstagramIcon,
      url: 'https://www.instagram.com/sidengo1/',
      label: 'Instagram',
      hoverColor: 'hover:bg-pink-600',
    },
    {
      icon: YoutubeIcon,
      url: 'https://www.youtube.com/@SideNgo-1',
      label: 'YouTube',
      hoverColor: 'hover:bg-red-600',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${
          isScrolled ? 'bg-white/85 backdrop-blur-lg border-border shadow-sm py-3' : 'bg-transparent border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/side-logo.png"
                alt="SIDE NGO Logo"
                className="h-14 w-16 object-contain group-hover:scale-105 transition-transform"
              />
              <div>
                <h1 className="text-2xl font-display font-bold leading-none tracking-tight text-[#e25a87]">SIDE</h1>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === link.path ? 'text-primary' : 'text-foreground/80'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-foreground hover:text-primary transition-colors"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center transform translate-x-1/4 -translate-y-1/4 shadow-sm border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </button>

              <Link
                href="/join"
                className="hidden md:inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-secondary text-white font-semibold shadow-md shadow-secondary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                Volunteer
              </Link>

              <button
                className="lg:hidden p-2 text-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] z-30 bg-white border-t border-border lg:hidden flex flex-col py-6 px-6 overflow-y-auto">
          <nav className="flex flex-col gap-6 text-xl font-display font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={location === link.path ? 'text-primary' : 'text-foreground'}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/join"
              className="mt-4 px-6 py-3 text-center rounded-xl bg-secondary text-white font-semibold"
            >
              Volunteer With Us
            </Link>
          </nav>
        </div>
      )}
      <CartDrawer />
      {/* Main Content */}
      <main className="flex-grow pt-[88px]">
        {children}
      </main>
      {/* Footer */}
      <footer className="bg-foreground/95 text-white mt-20 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

            {/* Brand + Social */}
            <div>
              <Link href="/" className="flex items-center gap-3 mb-5">
                <img
                  src="/side-logo.png"
                  alt="SIDE NGO Logo"
                  className="h-14 w-16 object-contain"
                />
                <h2 className="text-xl font-display font-bold text-white">SIDE NGO</h2>
              </Link>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-6">
                Society for Integrated Development Through Empowerment. Working towards a brighter future for women and children since 1975.
              </p>
              {/* Social Icons */}
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, url, label, hoverColor }) => (
                  url ? (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white ${hoverColor} transition-all duration-200`}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ) : (
                    <div
                      key={label}
                      title={`${label} (link not set)`}
                      className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50 ${hoverColor} hover:text-white transition-all duration-200 cursor-default`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-display font-bold text-lg mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3 text-sm text-white/60">
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/team" className="hover:text-primary transition-colors">Our Team</Link></li>
                <li><Link href="/events" className="hover:text-primary transition-colors">Latest Events</Link></li>
                <li><Link href="/products" className="hover:text-primary transition-colors">Handmade Products</Link></li>
                <li><Link href="/join" className="hover:text-primary transition-colors">Volunteer With Us</Link></li>
              </ul>
            </div>

            {/* Contact with Icons */}
            <div>
              <h3 className="font-display font-bold text-lg mb-6 text-white">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-0.5">Email</p>
                    <a
                      href={`mailto:${settings?.contact_email || 'sidevinayabhawan@gmail.com'}`}
                      className="text-sm text-white/70 hover:text-primary transition-colors"
                    >
                      {settings?.contact_email || 'sidevinayabhawan@gmail.com'}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-0.5">Phone</p>
                    {settings?.contact_phone ? (
                      <a
                        href={`tel:${settings.contact_phone}`}
                        className="text-sm text-white/70 hover:text-primary transition-colors"
                      >
                        {settings.contact_phone}
                      </a>
                    ) : (
                      <div className="text-sm text-white/70 space-y-0.5">
                        <p>+91  8810549812</p>
                        <p>+91 7042136250</p>
                        <p>+91 9310852889</p>
                      </div>
                    )}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-0.5">Address</p>
                    <p className="text-sm text-white/70">
                      {settings?.contact_address || '19/564 DDA Flats, Vinaya Bhawan, Madangir New Delhi 110062'}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/35">
            <p>© {new Date().getFullYear()} SIDE NGO. All rights reserved. Regn. No. S/489/District. South/2011</p>
            <p>Website designed & managed by ScaleBridge Consulting</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
