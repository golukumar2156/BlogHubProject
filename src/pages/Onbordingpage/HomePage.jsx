import React from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "./Navbar";
import FeaturedCarousel from "../blog/FeaturedCarousel"
import BlogCard from "../blog/BlogCard";
import { useNavigate } from "react-router-dom";
const trendingBlogs = [
  {
    id: 1,
    title: "Getting Started with Next.js 14",
    excerpt:
      "A comprehensive guide to the latest features and improvements in Next.js...",
    author: "Alex Johnson",
    category: "Tutorial",
    date: "Jan 8, 2025",
    image: "/nextjs-development.png",
    readTime: 8,
    likes: 342,
  },
  {
    id: 2,
    title: "CSS Grid vs Flexbox: When to Use Each",
    excerpt:
      "Understanding the differences and best use cases for modern CSS layout methods...",
    author: "Lisa Moore",
    category: "CSS",
    date: "Jan 6, 2025",
    image: "/css-layout-design.jpg",
    readTime: 5,
    likes: 218,
  },
  {
    id: 3,
    title: "Building Scalable Node.js Applications",
    excerpt:
      "Best practices and patterns for building production-ready Node.js servers...",
    author: "Mike Chen",
    category: "Backend",
    date: "Jan 4, 2025",
    image: "/nodejs-backend.png",
    readTime: 12,
    likes: 456,
  },
  {
    id: 4,
    title: "Advanced TypeScript Patterns",
    excerpt:
      "Explore advanced TypeScript features and patterns for better type safety...",
    author: "Sarah Williams",
    category: "TypeScript",
    date: "Jan 2, 2025",
    image: "/typescript-coding.jpg",
    readTime: 10,
    likes: 289,
  },
  {
    id: 5,
    title: "The Art of API Design",
    excerpt:
      "Creating intuitive and maintainable REST APIs that scale with your application...",
    author: "David Brown",
    category: "API Design",
    date: "Dec 31, 2024",
    image: "/api-design-concept.png",
    readTime: 9,
    likes: 312,
  },
  {
    id: 6,
    title: "Web Performance Optimization Tips",
    excerpt:
      "Strategies and tools to improve your website's loading speed and performance...",
    author: "Emma Davis",
    category: "Performance",
    date: "Dec 28, 2024",
    image: "/web-performance-concept.png",
    readTime: 7,
    likes: 198,
  },
];

const HomePage = () => {
    const navigate = useNavigate(); 
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-20">
        {/* ================= HERO SECTION ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Discover Amazing
              </span>
              <br />
              Stories & Ideas
            </h1>

            <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-xl leading-relaxed">
              Explore curated blogs from talented writers across technology,
              design, and more. Find inspiration, learn something new, or share
              your own story.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
            <Button
                className="bg-indigo-600 hover:bg-indigo-700 px-6 py-5 rounded-xl text-base"
                onClick={() => navigate("/login")} // ✅ Navigate works
              >
                Start Reading
              </Button>

              <Button
                variant="outline"
                className="border-gray-700 text-white hover:bg-white/10 px-6 py-5 rounded-xl"
                onClick={() => navigate("/register")} // ✅ Navigate works
              >
                Write a Blog
              </Button>
            </div>
          </div>
        </section>

        {/* ================= FEATURED ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <FeaturedCarousel />
        </section>

        {/* ================= CATEGORIES ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[
              "All",
              "Technology",
              "Design",
              "Business",
              "Lifestyle",
              "Tutorial",
            ].map((cat) => (
              <Button
                key={cat}
                variant={cat === "All" ? "default" : "outline"}
                className="whitespace-nowrap border-gray-700 text-white"
              >
                {cat}
              </Button>
            ))}
          </div>
        </section>

        {/* ================= BLOG GRID ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {trendingBlogs.map((blog) => (
              <BlogCard key={blog.id} {...blog} />
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              size="lg"
              className="border-gray-700 text-white hover:bg-white/10"
            >
              Load More Articles
            </Button>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
              {[
                {
                  title: "Product",
                  links: ["Features", "Pricing", "Security"],
                },
                { title: "Company", links: ["About", "Blog", "Careers"] },
                { title: "Resources", links: ["Docs", "API", "Support"] },
                { title: "Legal", links: ["Privacy", "Terms", "Contact"] },
              ].map((section) => (
                <div key={section.title}>
                  <h3 className="font-semibold mb-4">{section.title}</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    {section.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="hover:text-white transition">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">
                © 2025 BlogHub. All rights reserved.
              </p>
              <div className="flex gap-4 text-sm text-gray-400">
                <a href="#" className="hover:text-white">
                  Twitter
                </a>
                <a href="#" className="hover:text-white">
                  LinkedIn
                </a>
                <a href="#" className="hover:text-white">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default HomePage;
