import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '@/components/Layout';
import { useProducts, useCategories } from '@/hooks/use-products';
import { useCart } from '@/contexts/CartContext';
import { ShoppingBag, Check, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductLightboxProps {
  product: any;
  images: string[];
  startIndex: number;
  onClose: () => void;
}

function ProductLightbox({ product, images, startIndex, onClose }: ProductLightboxProps) {
  const [idx, setIdx] = useState(startIndex);

  const prev = useCallback(() => setIdx(i => (i === 0 ? images.length - 1 : i - 1)), [images.length]);
  const next = useCallback(() => setIdx(i => (i === images.length - 1 ? 0 : i + 1)), [images.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-black/97"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 shrink-0 z-10" onClick={e => e.stopPropagation()}>
        <div>
          <p className="text-white font-semibold text-base leading-tight">{product.name}</p>
          {product.categoryName && (
            <p className="text-white/50 text-xs mt-0.5 uppercase tracking-wider">{product.categoryName}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {images.length > 1 && (
            <span className="text-white/60 text-sm font-medium">{idx + 1} / {images.length}</span>
          )}
          <button
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main image */}
      <div className="flex-1 flex items-center justify-center relative min-h-0 px-16">
        {images.length > 1 && (
          <button
            className="absolute left-3 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-10"
            onClick={e => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        )}

        <div className="w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
          <AnimatePresence mode="wait">
            <motion.img
              key={idx}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              src={images[idx]}
              alt={`${product.name} photo ${idx + 1}`}
              className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
              style={{ maxHeight: 'calc(100vh - 160px)' }}
            />
          </AnimatePresence>
        </div>

        {images.length > 1 && (
          <button
            className="absolute right-3 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-10"
            onClick={e => { e.stopPropagation(); next(); }}
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="shrink-0 py-3 px-4 flex justify-center" onClick={e => e.stopPropagation()}>
          <div className="flex gap-2 overflow-x-auto max-w-full pb-1">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  i === idx ? 'border-white opacity-100 scale-105' : 'border-transparent opacity-45 hover:opacity-70'
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function ProductImageGallery({
  imageUrl,
  name,
  onImageClick,
}: {
  imageUrl: string | null;
  name: string;
  onImageClick: (index: number) => void;
}) {
  const images = imageUrl
    ? imageUrl.split(',').map(u => u.trim()).filter(Boolean)
    : [];
  const [idx, setIdx] = useState(0);

  if (images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-secondary/10">
        <ShoppingBag className="w-16 h-16 text-secondary/30" />
      </div>
    );
  }

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx(i => (i - 1 + images.length) % images.length);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx(i => (i + 1) % images.length);
  };

  return (
    <div
      className="w-full h-full relative cursor-zoom-in"
      onClick={() => onImageClick(idx)}
    >
      <img
        src={images[idx]}
        alt={`${name} photo ${idx + 1}`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        onError={e => (e.currentTarget.style.opacity = '0.3')}
      />

      {/* Zoom hint */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-black/40 rounded-full p-2">
          <ZoomIn className="w-5 h-5 text-white" />
        </div>
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setIdx(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? 'bg-white w-3' : 'bg-white/60'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Products() {
  const [activeCategory, setActiveCategory] = useState<number | undefined>(undefined);
  const { data: categories } = useCategories();
  const { data: products, isLoading } = useProducts(activeCategory);
  const { addItem, items } = useCart();
  const [addedId, setAddedId] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<{ product: any; images: string[]; startIndex: number } | null>(null);

  const handleAdd = (product: any) => {
    addItem(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  function openLightbox(product: any, startIndex: number) {
    const images = (product.imageUrl || '').split(',').map((u: string) => u.trim()).filter(Boolean);
    if (images.length === 0) return;
    setLightbox({ product, images, startIndex });
  }

  return (
    <Layout>
      <AnimatePresence>
        {lightbox && (
          <ProductLightbox
            product={lightbox.product}
            images={lightbox.images}
            startIndex={lightbox.startIndex}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>

      <div className="bg-accent/10 py-20 border-b border-border relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 hidden md:block">
          <img src={`${import.meta.env.BASE_URL}images/hero-products.png`} className="w-full h-full object-cover" alt="Products" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl font-display font-bold mb-6 text-[#e25a87]">Handmade Products</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Support our cause by purchasing beautiful handmade items crafted by the women in our skill development programs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row gap-8">
        {/* Categories Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" /> Categories
            </h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActiveCategory(undefined)}
                className={`text-left px-4 py-2 rounded-lg transition-colors ${!activeCategory ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
              >
                All Products
              </button>
              {categories?.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`text-left px-4 py-2 rounded-lg transition-colors ${activeCategory === cat.id ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 bg-card border border-border rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => {
                const inCart = items.some(item => item.product.id === product.id);
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={product.id}
                    className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden group flex flex-col hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      <ProductImageGallery
                        imageUrl={product.imageUrl}
                        name={product.name}
                        onImageClick={(idx) => openLightbox(product, idx)}
                      />
                      {/* Discount badge */}
                      {product.inStock && Number(product.discount) > 0 && (
                        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                          {product.discount}% OFF
                        </div>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                          <span className="bg-black text-white px-4 py-1.5 rounded-full font-bold text-sm uppercase tracking-wider">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="text-xs text-primary font-bold uppercase tracking-wider mb-2">{product.categoryName}</div>
                      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                      <p className="text-muted-foreground text-sm flex-1 mb-6">{product.description}</p>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                          {Number(product.discount) > 0 && (
                            <span className="text-xs text-muted-foreground line-through">
                              ₹{Math.round(Number(product.price) / (1 - Number(product.discount) / 100)).toLocaleString('en-IN')}
                            </span>
                          )}
                          <span className="text-2xl font-display font-bold text-foreground">
                            ₹{Number(product.price).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <button
                          disabled={!product.inStock}
                          onClick={() => handleAdd(product)}
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                            !product.inStock ? 'bg-muted text-muted-foreground cursor-not-allowed' :
                            addedId === product.id ? 'bg-green-500 text-white' :
                            inCart ? 'bg-primary/20 text-primary hover:bg-primary hover:text-white' :
                            'bg-primary text-white shadow-md shadow-primary/30 hover:scale-110'
                          }`}
                        >
                          {addedId === product.id ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 bg-card rounded-2xl border border-dashed">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground opacity-30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">Try selecting a different category.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
