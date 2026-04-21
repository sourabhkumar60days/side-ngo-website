import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '@/components/Layout';
import { useEvents } from '@/hooks/use-events';
import { format } from 'date-fns';
import { Calendar, MapPin, Image as ImageIcon, X, ChevronLeft, ChevronRight, Play, Images } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function getYoutubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

interface GalleryItem {
  type: 'image' | 'video';
  src: string;
}

interface LightboxProps {
  event: any;
  items: GalleryItem[];
  startIndex: number;
  onClose: () => void;
}

function Lightbox({ event, items, startIndex, onClose }: LightboxProps) {
  const [idx, setIdx] = useState(startIndex);

  const prev = useCallback(() => setIdx(i => (i === 0 ? items.length - 1 : i - 1)), [items.length]);
  const next = useCallback(() => setIdx(i => (i === items.length - 1 ? 0 : i + 1)), [items.length]);

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

  const current = items[idx];

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
          <p className="text-white font-semibold text-base leading-tight">{event.name}</p>
          <p className="text-white/50 text-xs mt-0.5 flex items-center gap-1.5">
            <MapPin className="w-3 h-3" /> {event.location} · {format(new Date(event.date), 'dd MMM yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {items.length > 1 && (
            <span className="text-white/60 text-sm font-medium">{idx + 1} / {items.length}</span>
          )}
          <button
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main view */}
      <div className="flex-1 flex items-center justify-center relative min-h-0 px-16">
        {/* Prev */}
        {items.length > 1 && (
          <button
            className="absolute left-3 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-10"
            onClick={e => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        )}

        {/* Content */}
        <div className="w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
          <AnimatePresence mode="wait">
            {current.type === 'image' ? (
              <motion.img
                key={idx}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                src={current.src}
                alt={`${event.name} photo ${idx + 1}`}
                className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
                style={{ maxHeight: 'calc(100vh - 160px)' }}
              />
            ) : (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-2xl"
              >
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${current.src}`}
                  title={event.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Next */}
        {items.length > 1 && (
          <button
            className="absolute right-3 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-10"
            onClick={e => { e.stopPropagation(); next(); }}
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {items.length > 1 && (
        <div className="shrink-0 py-3 px-4 flex justify-center" onClick={e => e.stopPropagation()}>
          <div className="flex gap-2 overflow-x-auto max-w-full pb-1">
            {items.map((item, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  i === idx ? 'border-white opacity-100 scale-105' : 'border-transparent opacity-45 hover:opacity-70'
                }`}
              >
                {item.type === 'image' ? (
                  <img src={item.src} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-red-700 flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function Events() {
  const { data: rawEvents, isLoading } = useEvents();
  const events = [...(rawEvents || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const [gallery, setGallery] = useState<{ event: any; items: GalleryItem[]; startIndex: number } | null>(null);

  function openGallery(event: any, startIndex = 0) {
    const images = event.driveImageUrl
      ? event.driveImageUrl.split(',').map((u: string) => u.trim()).filter(Boolean)
      : [];
    const ytId = event.youtubeUrl ? getYoutubeId(event.youtubeUrl) : null;

    const items: GalleryItem[] = [];
    if (ytId) items.push({ type: 'video', src: ytId });
    images.forEach((src: string) => items.push({ type: 'image', src }));

    if (items.length === 0) return;
    setGallery({ event, items, startIndex });
  }

  return (
    <Layout>
      <div className="bg-background py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-display font-bold mb-6 text-[#e25a87]">Our Events</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with our latest community programs, workshops, and celebrations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-96 rounded-3xl bg-muted animate-pulse" />)}
          </div>
        ) : events && events.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {events.map((event, idx) => {
              const images = event.driveImageUrl
                ? event.driveImageUrl.split(',').map((u: string) => u.trim()).filter(Boolean)
                : [];
              const ytId = event.youtubeUrl ? getYoutubeId(event.youtubeUrl) : null;
              const totalCount = images.length + (ytId ? 1 : 0);
              const hasMedia = totalCount > 0;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-card rounded-3xl border border-border shadow-lg overflow-hidden flex flex-col"
                >
                  {/* Primary media — click opens gallery */}
                  <div
                    className={`relative w-full aspect-video bg-muted overflow-hidden ${hasMedia ? 'cursor-pointer group' : ''}`}
                    onClick={() => hasMedia && openGallery(event, 0)}
                  >
                    {ytId ? (
                      <img
                        src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : images.length > 0 ? (
                      <img
                        src={images[0]}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => (e.currentTarget.style.display = 'none')}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="w-12 h-12 opacity-20" />
                      </div>
                    )}

                    {/* Date badge */}
                    <div className="absolute top-4 left-4 bg-white shadow-md px-4 py-2 rounded-xl text-center z-10">
                      <div className="text-xs text-pink-500 uppercase font-bold">{format(new Date(event.date), 'MMM')}</div>
                      <div className="text-2xl font-bold text-gray-800 leading-none">{format(new Date(event.date), 'dd')}</div>
                    </div>

                    {/* Media count badge */}
                    {totalCount > 1 && (
                      <div className="absolute top-4 right-4 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 z-10">
                        <Images className="w-3.5 h-3.5" />
                        {images.length > 0 && `${images.length} photo${images.length > 1 ? 's' : ''}`}
                        {ytId && images.length > 0 && ' + '}
                        {ytId && 'video'}
                      </div>
                    )}

                    {/* YouTube play overlay */}
                    {ytId && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          <Play className="w-7 h-7 text-white fill-white ml-1" />
                        </div>
                      </div>
                    )}

                    {/* Hover overlay */}
                    {hasMedia && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-800 font-semibold text-sm px-5 py-2.5 rounded-full shadow-lg">
                          {totalCount > 1 ? `View all ${totalCount} media` : 'View'}
                        </span>
                      </div>
                    )}
                  </div>


                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-foreground mb-3">{event.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 bg-muted/50 p-2.5 rounded-lg w-fit">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {event.location}
                    </div>
                    <p className="text-purple-700 font-medium leading-relaxed text-sm flex-1">
                      {event.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-3xl border border-dashed">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground opacity-30 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No events currently</h3>
            <p className="text-muted-foreground">Please check back later for upcoming events.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {gallery && (
          <Lightbox
            event={gallery.event}
            items={gallery.items}
            startIndex={gallery.startIndex}
            onClose={() => setGallery(null)}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}
