import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '@/components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Laptop, DollarSign, Baby, ShieldCheck, HandHeart,
  Star, Award, Scale, Users, Heart, ChevronLeft, ChevronRight
} from 'lucide-react';

const patronSlides = [
  {
    name: 'St. Francis De Sales',
    role: 'Our Patron Saint',
    desc: 'He taught us through his exemplary life, teachings and writings to follow Jesus who is meek and humble of heart and witness His love through salesian virtues of Love, Simplicity, Amenity, Hospitality, Kindness.',
    image: '/patron-st-francis.jpg',
    initials: 'SF',
    cardFrom: '#5bbf96',
    cardTo: '#3da67e',
    glow: 'rgba(91,191,150,0.55)',
  },
  {
    name: 'Fr. Henri Chaumont',
    role: 'Founder D.S.F.S',
    desc: 'Our Founder who gave us the beautiful charism to live the Gospel and to spread its spirit as Salesian Missionaries of Mary Immaculate. He gave us the Motto "Be Mary".',
    image: '/patron-henri.jpg',
    initials: 'HC',
    cardFrom: '#f97340',
    cardTo: '#e85e28',
    glow: 'rgba(249,115,64,0.55)',
  },
  {
    name: 'Mdm. Carre De Malberg',
    role: 'Co Foundress DSFS',
    desc: 'She co-founded the Daughters of St. Francis de Sales and dedicated her life to spreading the Salesian spirit of gentleness and charity among all people.',
    image: '/patron-malberg.jpg',
    initials: 'CM',
    cardFrom: '#5bbf96',
    cardTo: '#3da67e',
    glow: 'rgba(91,191,150,0.55)',
  },
  {
    name: 'Mother Marie Gertrude',
    role: 'Servant of God, Co Foundress of SMMI',
    desc: 'She is the first mother who came to India from France and began the missionary activities, thus our religious branch is born as Salesian Missionaries of Mary Immaculate [SMMI].',
    image: '/patron-gertrude.jpg',
    initials: 'MG',
    cardFrom: '#7ea8d4',
    cardTo: '#5b8fc2',
    glow: 'rgba(126,168,212,0.55)',
  },
];

const programs = [
  {
    title: 'Education',
    desc: 'Providing Remedial Classes and comprehensive Child & Parents Counseling to ensure strong educational foundations.',
    icon: BookOpen,
    color: 'bg-pink-100 text-pink-600',
    borderColor: '#f472b6',
    glow: 'rgba(244,114,182,0.55)',
  },
  {
    title: 'Skill Development',
    desc: 'Empowering youth and women through Computer Training, Cutting & Tailoring, Beauty Culture, and Mehndi Designing.',
    icon: Laptop,
    color: 'bg-purple-100 text-purple-600',
    borderColor: '#a78bfa',
    glow: 'rgba(167,139,250,0.55)',
  },
  {
    title: 'Micro Finance',
    desc: 'Fostering financial independence via Self Help Groups (SHG), SHG federations, Income Generation, and Entrepreneurship Support.',
    icon: DollarSign,
    color: 'bg-emerald-100 text-emerald-600',
    borderColor: '#34d399',
    glow: 'rgba(52,211,153,0.55)',
  },
  {
    title: 'Child & Youth Development',
    desc: 'NCP programs, Latent Development and Personality Training to nurture the potential of young minds.',
    icon: Baby,
    color: 'bg-orange-100 text-orange-600',
    borderColor: '#fb923c',
    glow: 'rgba(251,146,60,0.55)',
  },
  {
    title: 'Women Empowerment',
    desc: 'Organizing Day Celebrations, Legal Awareness camps, Mohalla Sabhas, and Exposure Visits to elevate women\'s status.',
    icon: ShieldCheck,
    color: 'bg-rose-100 text-rose-600',
    borderColor: '#fb7185',
    glow: 'rgba(251,113,133,0.55)',
  },
  {
    title: 'Community Work',
    desc: 'Grassroots community engagement and social development initiatives across New Delhi.',
    icon: HandHeart,
    color: 'bg-teal-100 text-teal-600',
    borderColor: '#2dd4bf',
    glow: 'rgba(45,212,191,0.55)',
  },
];

export default function About() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const total = patronSlides.length;

  const goTo = useCallback((idx: number, dir: number) => {
    setDirection(dir);
    setCurrent((idx + total) % total);
  }, [total]);

  const prev = useCallback(() => { setPaused(true); goTo(current - 1, -1); }, [current, goTo]);
  const next = useCallback(() => { setPaused(true); goTo(current + 1, 1); }, [current, goTo]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => goTo(current + 1, 1), 4000);
    return () => clearInterval(timer);
  }, [current, goTo, paused]);

  useEffect(() => {
    patronSlides.forEach(s => { const img = new Image(); img.src = s.image; });
  }, []);

  const slide = patronSlides[current];

  return (
    <Layout>
      {/* Header */}
      <div className="bg-secondary/10 py-20 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-display font-bold mb-6 text-[#e25a87]">About SIDE</h1>
          <p className="text-xl text-muted-foreground text-balance">
            Society for Integrated Development Through Empowerment
          </p>
        </div>
      </div>
      {/* Full-width group photo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 mb-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl overflow-hidden shadow-2xl"
        >
          <img
            src="/group-photo.jpg"
            alt="SIDE NGO group photo"
            className="w-full h-auto block"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* History */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-lg prose-p:text-muted-foreground max-w-3xl mx-auto text-center"
          >
            <h2 className="font-display text-4xl text-foreground mb-6">Our History</h2>
            <p>
              SIDE is founded, run and managed by the SMMI (Salesian Missionaries of Mary Immaculate) sisters.
              Our mission is to spread the compassionate love of Jesus through social ministry, standing as a testament
              to the relentless faith of the people and their love for Jesus since 1975.
            </p>
            <p>
              Registered under the Societies Registration Act XXI Of 1860 (S/489/District. South/2011), we have grown
              from a small initiative to a structured organization deeply rooted in the communities of New Delhi.
            </p>
          </motion.div>

          {/* History Infographic */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-12 shadow-xl border border-border rounded-2xl overflow-hidden"
          >
            <img
              src="/side-history.png"
              alt="SIDE Genesis and History — Story of relentless faith of people and love of Jesus"
              className="w-full h-auto block rounded-2xl"
              loading="lazy"
            />
          </motion.div>
        </div>

        {/* Patron / Founders Carousel */}
        <div className="mb-24">
          <h2 className="text-4xl font-display font-bold text-center mb-12">Our Inspirations</h2>

          <div className="relative flex items-center gap-3">
            {/* Prev arrow */}
            <button
              onClick={prev}
              className="shrink-0 w-10 h-10 rounded-full bg-card border border-border shadow flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Slide area — outer div holds the glow, inner clips the slide animation */}
            <div
              className="flex-1 rounded-3xl transition-all duration-500"
              style={{
                border: `1.5px solid ${slide.cardFrom}`,
                boxShadow: `0 0 12px ${slide.glow}, 0 0 32px ${slide.glow}, 0 0 60px ${slide.glow.replace('0.55','0.25')}, inset 0 0 10px ${slide.glow.replace('0.55','0.08')}`,
              }}
            >
              <div className="overflow-hidden rounded-3xl">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
                    center: { x: 0, opacity: 1 },
                    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                  className="flex flex-col sm:flex-row items-center gap-6 bg-card rounded-3xl p-6 sm:p-10"
                >
                  {/* Photo */}
                  <div className="shrink-0 w-40 h-52 sm:w-48 sm:h-60 rounded-2xl overflow-hidden bg-muted flex items-center justify-center shadow-md">
                    <img
                      src={slide.image}
                      alt={slide.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fb = e.currentTarget.nextSibling as HTMLElement;
                        if (fb) { fb.classList.remove('hidden'); fb.classList.add('flex'); }
                      }}
                    />
                    <div className="hidden w-full h-full items-center justify-center text-4xl font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${slide.cardFrom}, ${slide.cardTo})` }}>
                      {slide.initials}
                    </div>
                  </div>

                  {/* Content card */}
                  <div
                    className="flex-1 rounded-2xl p-7 sm:p-10 text-white text-center sm:text-left"
                    style={{ background: `linear-gradient(135deg, ${slide.cardFrom}, ${slide.cardTo})` }}
                  >
                    <h3 className="text-2xl sm:text-3xl font-display font-bold mb-1 tracking-wide">{slide.name}</h3>
                    <p className="text-white/80 font-semibold text-base mb-5 uppercase tracking-wider">{slide.role}</p>
                    {slide.desc && (
                      <p className="text-white/90 leading-relaxed text-sm sm:text-base italic">{slide.desc}</p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
              </div>
            </div>

            {/* Next arrow */}
            <button
              onClick={next}
              className="shrink-0 w-10 h-10 rounded-full bg-card border border-border shadow flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {patronSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? 'bg-primary w-6' : 'bg-muted-foreground/30'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* All 6 Programs */}
        <div className="mb-20">
          <h2 className="text-4xl font-display font-bold text-center mb-16">Comprehensive Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((prog, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07 }}
                className="bg-background p-8 rounded-2xl transition-all duration-300 flex gap-5 items-start"
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
                <div className={`w-12 h-12 rounded-xl ${prog.color} flex items-center justify-center shrink-0 mt-0.5`}>
                  <prog.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">{prog.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{prog.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* ── Our Values ── */}
      <section className="py-24 bg-secondary/5 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-6">
            <span className="text-primary font-semibold uppercase tracking-wider text-[16px]">What We Stand For</span>
            <h2 className="text-4xl font-display font-bold mt-3 mb-4">Our Values</h2>
            <p className="text-muted-foreground leading-relaxed">
              We believe in values which serve as foundation stones for all the activities carried out inside our
              organization to achieve our Vision and Mission.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: Star,
                title: 'Commitment',
                desc: 'Setting expectations right and delivering them to all our stakeholders.',
                color: 'bg-pink-100 text-pink-600',
                borderColor: '#f472b6',
                glow: 'rgba(244,114,182,0.50)',
              },
              {
                icon: Award,
                title: 'Competence',
                desc: 'Enhancing capacity and building skills of the SIDE personnel time to time.',
                color: 'bg-purple-100 text-purple-600',
                borderColor: '#a78bfa',
                glow: 'rgba(167,139,250,0.50)',
              },
              {
                icon: ShieldCheck,
                title: 'Integrity',
                desc: 'Truthful, responsible and trustworthy projects and code of ethics.',
                color: 'bg-emerald-100 text-emerald-600',
                borderColor: '#34d399',
                glow: 'rgba(52,211,153,0.50)',
              },
              {
                icon: Heart,
                title: 'Respect',
                desc: 'No discrimination on the basis of Gender, Caste, Class etc. and accepting people as they are.',
                color: 'bg-orange-100 text-orange-600',
                borderColor: '#fb923c',
                glow: 'rgba(251,146,60,0.50)',
              },
              {
                icon: HandHeart,
                title: 'Service',
                desc: 'Acknowledging that serving others is more important than self interest. Inherent desire to improve the lives of people who are less fortunate.',
                color: 'bg-rose-100 text-rose-600',
                borderColor: '#fb7185',
                glow: 'rgba(251,113,133,0.50)',
              },
              {
                icon: Scale,
                title: 'Social Justice',
                desc: 'Advocacy for the poor and vulnerable sections of the society.',
                color: 'bg-teal-100 text-teal-600',
                borderColor: '#2dd4bf',
                glow: 'rgba(45,212,191,0.50)',
              },
              {
                icon: Users,
                title: 'Human Relationships',
                desc: 'Encouraging mutual participation, upholding confidentiality and enhancing social functioning.',
                color: 'bg-indigo-100 text-indigo-600',
                borderColor: '#818cf8',
                glow: 'rgba(129,140,248,0.50)',
              },
            ].map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07 }}
                className="bg-background rounded-2xl p-7 transition-all duration-300"
                style={{
                  border: `1.5px solid ${val.borderColor}`,
                  boxShadow: `0 0 10px ${val.glow}, 0 0 24px ${val.glow}, inset 0 0 8px ${val.glow.replace('0.50','0.08')}`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    `0 0 16px ${val.glow}, 0 0 40px ${val.glow}, 0 0 60px ${val.glow.replace('0.50','0.28')}, inset 0 0 12px ${val.glow.replace('0.50','0.14')}`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    `0 0 10px ${val.glow}, 0 0 24px ${val.glow}, inset 0 0 8px ${val.glow.replace('0.50','0.08')}`;
                }}
              >
                <div className={`w-12 h-12 rounded-xl ${val.color} flex items-center justify-center mb-5`}>
                  <val.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{val.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
