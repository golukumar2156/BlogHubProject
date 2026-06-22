import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import {
  ArrowRight, BookOpen, PenLine, Sparkles, TrendingUp,
  Users, Zap, ChevronLeft, ChevronRight, Star,
  Globe, Coffee, Code2, Palette, Lightbulb, Heart,
  CheckCircle, BarChart2, Rss, Award, Quote,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell,
} from "recharts";
import SmartBlogFinder from "./SmartBlogFinder";

// ── Data ──────────────────────────────────────────────────────
const slides = [
  { id:1, image:"https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&q=85", label:"Technology" },
  { id:2, image:"https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900&q=85", label:"Writing"    },
  { id:3, image:"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=85", label:"Community"  },
  { id:4, image:"https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=900&q=85", label:"Design"     },
];

const trending = [
  { id:1, category:"Tutorial",    icon:Code2,      title:"Getting Started with Next.js 14",       author:"Alex Johnson",   readTime:8,  likes:342, color:"from-violet-500 to-indigo-500"  },
  { id:2, category:"CSS",         icon:Palette,    title:"CSS Grid vs Flexbox: When to Use Each", author:"Lisa Moore",     readTime:5,  likes:218, color:"from-cyan-500 to-blue-500"      },
  { id:3, category:"Backend",     icon:Globe,      title:"Building Scalable Node.js Apps",        author:"Mike Chen",      readTime:12, likes:456, color:"from-emerald-500 to-teal-500"   },
  { id:4, category:"TypeScript",  icon:Zap,        title:"Advanced TypeScript Patterns",          author:"Sarah Williams", readTime:10, likes:289, color:"from-amber-500 to-orange-500"   },
  { id:5, category:"API Design",  icon:Lightbulb,  title:"The Art of API Design",                 author:"David Brown",    readTime:9,  likes:312, color:"from-rose-500 to-pink-500"      },
  { id:6, category:"Performance", icon:TrendingUp, title:"Web Performance Optimization Tips",     author:"Emma Davis",     readTime:7,  likes:198, color:"from-fuchsia-500 to-purple-500" },
];

const categories = [
  { label:"Technology", icon:Globe,      color:"bg-violet-500/15 text-violet-500 border-violet-500/30"   },
  { label:"Design",     icon:Palette,    color:"bg-pink-500/15 text-pink-500 border-pink-500/30"         },
  { label:"Tutorial",   icon:BookOpen,   color:"bg-cyan-500/15 text-cyan-500 border-cyan-500/30"         },
  { label:"Backend",    icon:Code2,      color:"bg-emerald-500/15 text-emerald-500 border-emerald-500/30"},
  { label:"Lifestyle",  icon:Coffee,     color:"bg-amber-500/15 text-amber-500 border-amber-500/30"      },
  { label:"Business",   icon:TrendingUp, color:"bg-rose-500/15 text-rose-500 border-rose-500/30"         },
];

const stats = [
  { value:"12K+", label:"Articles", icon:BookOpen, color:"text-violet-500" },
  { value:"4.8K", label:"Writers",  icon:PenLine,  color:"text-cyan-500"   },
  { value:"98K+", label:"Readers",  icon:Users,    color:"text-emerald-500"},
  { value:"200+", label:"Topics",   icon:Sparkles, color:"text-rose-500"   },
];

const features = ["Free to read & publish","No ads, ever","Join 4,800+ writers"];

const testimonials = [
  { name:"Priya Sharma",    role:"Software Engineer",    text:"BlogHub changed the way I learn. The quality of writing here is unmatched.", avatar:"P" },
  { name:"James Walker",    role:"UX Designer",          text:"I published my first article here and got 2,000 reads in a week. Amazing community.", avatar:"J" },
  { name:"Anjali Mehra",    role:"Product Manager",      text:"The best place to stay updated on tech. I read at least 3 articles every morning.", avatar:"A" },
];

// Chart data
const growthData = [
  { month:"Jan", articles:1200, writers:320 },
  { month:"Feb", articles:1800, writers:420 },
  { month:"Mar", articles:2400, writers:580 },
  { month:"Apr", articles:3100, writers:720 },
  { month:"May", articles:4200, writers:900 },
  { month:"Jun", articles:5800, writers:1100 },
  { month:"Jul", articles:7200, writers:1400 },
  { month:"Aug", articles:8900, writers:1800 },
  { month:"Sep", articles:10400, writers:2300 },
  { month:"Oct", articles:11200, writers:3100 },
  { month:"Nov", articles:11800, writers:3900 },
  { month:"Dec", articles:12400, writers:4800 },
];

const categoryData = [
  { name:"Technology", value:34, color:"#8b5cf6" },
  { name:"Design",     value:22, color:"#06b6d4" },
  { name:"Tutorial",   value:18, color:"#10b981" },
  { name:"Backend",    value:14, color:"#f59e0b" },
  { name:"Other",      value:12, color:"#f43f5e" },
];

const weeklyData = [
  { day:"Mon", reads:420 },
  { day:"Tue", reads:680 },
  { day:"Wed", reads:540 },
  { day:"Thu", reads:890 },
  { day:"Fri", reads:760 },
  { day:"Sat", reads:1100 },
  { day:"Sun", reads:940 },
];

// ── Custom Tooltip ─────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-3 py-2 border border-border/50 shadow-xl text-xs">
      <p className="font-semibold mb-1 text-foreground">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-bold text-foreground ml-1">{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

// ── Slide Panel ────────────────────────────────────────────────
function SlidePanel() {
  const [cur,  setCur]  = useState(0);
  const [prev, setPrev] = useState(null);
  const [anim, setAnim] = useState(false);
  const timer = useRef(null);
  const N = slides.length;

  const goTo = (idx) => {
    if (anim || idx === cur) return;
    setPrev(cur); setAnim(true); setCur(idx);
    setTimeout(() => { setPrev(null); setAnim(false); }, 650);
  };
  const next  = () => goTo((cur + 1) % N);
  const prev2 = () => goTo((cur - 1 + N) % N);

  useEffect(() => {
    timer.current = setInterval(next, 4000);
    return () => clearInterval(timer.current);
  }, [cur, anim]);

  return (
    <>
      <style>{`
        @keyframes slideIn  { from{transform:translateX(100%)} to{transform:translateX(0)} }
        @keyframes slideOut { from{transform:translateX(0)}    to{transform:translateX(-105%)} }
        .s-in  { animation: slideIn  0.65s cubic-bezier(.4,0,.2,1) forwards }
        .s-out { animation: slideOut 0.65s cubic-bezier(.4,0,.2,1) forwards }
        @keyframes zoomSlow { from{transform:scale(1)} to{transform:scale(1.06)} }
        .zoom-slow { animation: zoomSlow 5s ease-in-out forwards }
        @keyframes floatUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .float-card { animation: floatUp 3s ease-in-out infinite }
        .float-card-2 { animation: floatUp 3.5s ease-in-out infinite 0.5s }
      `}</style>

      <div className="relative w-full h-full overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl">
        {slides.map((s, i) => {
          const isCur = i === cur, isPrev = i === prev;
          if (!isCur && !isPrev) return null;
          return (
            <div key={s.id}
              className={`absolute inset-0 ${isCur && anim ? "s-in" : ""} ${isPrev && anim ? "s-out" : ""}`}
              style={{ zIndex: isCur ? 2 : 1 }}
            >
              <img src={s.image} alt={s.label}
                className={`w-full h-full object-cover ${isCur ? "zoom-slow" : ""}`}
                draggable={false} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <span className="px-3 py-1.5 rounded-full text-xs font-bold
                                 bg-white/15 text-white backdrop-blur-md border border-white/20">
                  ✦ {s.label}
                </span>
              </div>
            </div>
          );
        })}

        <button onClick={prev2}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full
                     bg-black/30 hover:bg-black/55 border border-white/20 flex items-center justify-center
                     text-white transition-all backdrop-blur-sm hover:scale-110">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full
                     bg-black/30 hover:bg-black/55 border border-white/20 flex items-center justify-center
                     text-white transition-all backdrop-blur-sm hover:scale-110">
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="absolute bottom-5 right-5 z-10 flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300
                ${i === cur ? "w-6 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"}`} />
          ))}
        </div>

        <div className="absolute top-4 right-4 z-10 text-white/70 text-xs font-medium
                        bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
          {cur + 1}/{N}
        </div>
      </div>
    </>
  );
}

// ── Blog Card ──────────────────────────────────────────────────
function BlogCard({ blog }) {
  const Icon = blog.icon;
  return (
    <div className="group glass-card rounded-2xl p-5 hover:shadow-xl transition-all duration-300
                    hover:-translate-y-1.5 cursor-pointer border border-border/50 hover:border-primary/30
                    flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${blog.color} flex items-center justify-center shadow-sm`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted/60 text-muted-foreground border border-border/40">
          {blog.category}
        </span>
      </div>
      <h3 className="font-bold text-sm sm:text-base leading-snug group-hover:text-primary transition-colors line-clamp-2 flex-1">
        {blog.title}
      </h3>
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/30">
        <span className="truncate max-w-[120px] font-medium">{blog.author}</span>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span>{blog.readTime} min read</span>
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />{blog.likes}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Testimonial Card ───────────────────────────────────────────
function TestimonialCard({ t }) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-border/50 flex flex-col gap-4">
      <Quote className="w-6 h-6 text-primary/40" />
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">"{t.text}"</p>
      <div className="flex items-center gap-3 pt-3 border-t border-border/30">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/60 to-accent/60
                        flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {t.avatar}
        </div>
        <div>
          <p className="text-sm font-semibold">{t.name}</p>
          <p className="text-xs text-muted-foreground">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
//  MAIN PAGE
// ════════════════════════════════════════════
const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      <main>

        {/* ══════════════════════════════════════════
            HERO
        ══════════════════════════════════════════ */}
        <section className="min-h-[calc(100vh-4rem)] pt-16 flex items-center
                            bg-gradient-to-br from-background via-background to-violet-500/5 relative overflow-hidden">
          {/* ambient blobs */}
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full
                          bg-violet-500/8 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full
                          bg-cyan-500/8 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-0 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

              {/* LEFT */}
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                                bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  The home for curious minds
                </div>

                <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight mb-5">
                  Read, Write &{" "}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                      Inspire
                    </span>
                    <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" preserveAspectRatio="none">
                      <path d="M0 5 Q50 0 100 5 Q150 10 200 5" stroke="url(#u1)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                      <defs>
                        <linearGradient id="u1" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#8b5cf6"/><stop offset=".5" stopColor="#d946ef"/><stop offset="1" stopColor="#06b6d4"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                  {" "}the World
                </h1>

                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-7 max-w-lg">
                  BlogHub is where ideas live. Discover thousands of stories on technology,
                  design, culture and more — or share your own voice with the world.
                </p>

                <div className="flex flex-col gap-2 mb-8">
                  {features.map(f => (
                    <div key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mb-10">
                  <button onClick={() => navigate("/blogs")}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl
                               bg-gradient-to-r from-violet-600 to-indigo-600
                               text-white font-semibold text-sm
                               shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50
                               hover:scale-[1.02] transition-all duration-200">
                    Start Reading <ArrowRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => navigate("/register")}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border
                               bg-background hover:bg-muted/50 font-semibold text-sm transition-all">
                    <PenLine className="w-4 h-4" /> Start Writing
                  </button>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-3 pt-6 border-t border-border/40">
                  {stats.map((s) => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${s.color}`} />
                        <span className="font-extrabold text-sm">{s.value}</span>
                        <span className="text-xs text-muted-foreground">{s.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT */}
              <div className="order-1 lg:order-2 relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-violet-500/15 via-fuchsia-500/8 to-cyan-500/15 rounded-3xl blur-2xl pointer-events-none" />
                <div className="relative" style={{ height:"clamp(300px,50vw,560px)" }}>
                  <SlidePanel />
                </div>

                {/* floating cards */}
                <div className="float-card absolute -bottom-5 -left-4 z-20 glass-card rounded-2xl px-4 py-3
                                border border-border/60 shadow-xl hidden sm:flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500
                                  flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Trending Today</p>
                    <p className="text-[11px] text-muted-foreground">456 new articles</p>
                  </div>
                </div>

                <div className="float-card-2 absolute -top-4 -right-4 z-20 glass-card rounded-2xl px-4 py-3
                                border border-border/60 shadow-xl hidden sm:flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500
                                  flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">4,800+ Writers</p>
                    <p className="text-[11px] text-muted-foreground">Join the community</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>



        {/* ══ PLATFORM INSIGHTS — CHARTS ══ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                              bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-2">
                <BarChart2 className="w-3.5 h-3.5" /> Platform Insights
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold">Growing every month</h2>
              <p className="text-muted-foreground text-sm mt-1">Real numbers — BlogHub's growth in 2024</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Area Chart — Growth */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm">Articles & Writers Growth</h3>
                  <p className="text-xs text-muted-foreground">Jan — Dec 2024</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1.5 rounded-full bg-violet-500 inline-block"/>
                    <span className="text-muted-foreground">Articles</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1.5 rounded-full bg-cyan-500 inline-block"/>
                    <span className="text-muted-foreground">Writers</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={growthData} margin={{ left:-20, right:4, top:4, bottom:0 }}>
                  <defs>
                    <linearGradient id="gArticles" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gWriters" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border)/0.3)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize:11, fill:"hsl(var(--muted-foreground))" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize:11, fill:"hsl(var(--muted-foreground))" }} tickFormatter={v => v >= 1000 ? `${v/1000}k` : v} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="articles" name="Articles" stroke="#8b5cf6" strokeWidth={2} fill="url(#gArticles)" dot={false} />
                  <Area type="monotone" dataKey="writers"  name="Writers"  stroke="#06b6d4" strokeWidth={2} fill="url(#gWriters)"  dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart — Category split */}
            <div className="glass-card rounded-2xl p-5 border border-border/50 flex flex-col">
              <h3 className="font-bold text-sm mb-1">Content by Category</h3>
              <p className="text-xs text-muted-foreground mb-4">% of total articles</p>
              <div className="flex-1 flex items-center justify-center">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={72}
                         dataKey="value" paddingAngle={3} strokeWidth={0}>
                      {categoryData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`, ""]} contentStyle={{
                      background:"hsl(var(--card))", border:"1px solid hsl(var(--border)/0.5)",
                      borderRadius:"12px", fontSize:"11px", boxShadow:"0 4px 24px rgba(0,0,0,0.1)"
                    }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {categoryData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background:d.color }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="font-bold">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar Chart — Weekly reads */}
            <div className="lg:col-span-3 glass-card rounded-2xl p-5 border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm">Weekly Read Activity</h3>
                  <p className="text-xs text-muted-foreground">Average reads per day this week</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-500
                                border border-emerald-500/20 rounded-full px-2.5 py-1">
                  <TrendingUp className="w-3 h-3" /> +18% vs last week
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={weeklyData} margin={{ left:-20, right:4, top:4, bottom:0 }}>
                  <defs>
                    <linearGradient id="gBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border)/0.3)" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize:11, fill:"hsl(var(--muted-foreground))" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize:11, fill:"hsl(var(--muted-foreground))" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="reads" name="Reads" fill="url(#gBar)" radius={[6,6,0,0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </section>

        {/* ══ CATEGORIES ══ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Explore Topics</h2>
            <button onClick={() => navigate("/categories")}
              className="text-sm text-primary hover:underline underline-offset-4 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button key={cat.label} onClick={() => navigate("/blogs")}
                  className={`flex flex-col items-center gap-2 py-5 px-3 rounded-2xl border
                              font-medium text-sm transition-all hover:scale-[1.04] hover:shadow-lg ${cat.color}`}>
                  <Icon className="w-5 h-5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* ══ TRENDING ══ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-rose-400" /> Trending Now
            </h2>
            <button onClick={() => navigate("/blogs")}
              className="text-sm text-primary hover:underline underline-offset-4 flex items-center gap-1">
              All articles <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trending.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
          </div>
        </section>

        {/* ══ TESTIMONIALS ══ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                            bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold mb-3">
              <Award className="w-3.5 h-3.5" /> What readers say
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">Loved by thousands</h2>
            <p className="text-muted-foreground text-sm mt-1">Real words from real community members</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {testimonials.map((t, i) => <TestimonialCard key={i} t={t} />)}
          </div>
        </section>

        {/* ══ CTA BANNER ══ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br
                          from-violet-600 via-indigo-600 to-cyan-600 p-8 sm:p-14 text-center">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                              bg-white/15 border border-white/20 text-white text-xs font-semibold mb-4">
                <Star className="w-3.5 h-3.5 fill-white" /> Join 4,800+ writers today
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3">
                Ready to share your story?
              </h2>
              <p className="text-white/75 text-sm sm:text-base max-w-md mx-auto mb-7">
                Create your free account and start publishing to thousands of eager readers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => navigate("/register")}
                  className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl
                             bg-white text-indigo-700 font-bold text-sm hover:bg-white/90
                             shadow-xl transition-all hover:scale-[1.02]">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => navigate("/login")}
                  className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl
                             border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-all">
                  Already have an account?
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer className="border-t border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
              {[
                { title:"Product",   links:["Features","Pricing","Security","Changelog"] },
                { title:"Company",   links:["About","Blog","Careers","Press"]            },
                { title:"Resources", links:["Docs","API","Support","Status"]             },
                { title:"Legal",     links:["Privacy","Terms","Cookies","Contact"]       },
              ].map((s) => (
                <div key={s.title}>
                  <h3 className="font-bold text-sm mb-4">{s.title}</h3>
                  <ul className="space-y-2.5">
                    {s.links.map((l) => (
                      <li key={l}>
                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t border-border/40 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-sm">BlogHub</span>
                <span className="text-xs text-muted-foreground ml-1">© 2025 All rights reserved.</span>
              </div>
              <div className="flex gap-5 text-sm text-muted-foreground">
                {["Twitter","LinkedIn","GitHub"].map((l) => (
                  <a key={l} href="#" className="hover:text-foreground transition-colors">{l}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>

      </main>

      {/* 🔍 Smart Blog Finder */}
      <SmartBlogFinder />
    </div>
  );
};

export default HomePage;