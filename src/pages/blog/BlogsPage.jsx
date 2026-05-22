import { useState } from "react"
import { Search } from "lucide-react"
import { Navbar } from "../Onbordingpage/Navbar"
import { Input } from "@/components/ui/input"
import BlogCard from "./BlogCard"
import { Button } from "@/components/ui/button"



const allBlogs = [
  {
    id: 1,
    title: "Getting Started with Next.js 14",
    excerpt: "A comprehensive guide to the latest features and improvements in Next.js...",
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
    excerpt: "Understanding the differences and best use cases for modern CSS layout methods...",
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
    excerpt: "Best practices and patterns for building production-ready Node.js servers...",
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
    excerpt: "Explore advanced TypeScript features and patterns for better type safety...",
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
    excerpt: "Creating intuitive and maintainable REST APIs that scale with your application...",
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
    excerpt: "Strategies and tools to improve your website's loading speed and performance...",
    author: "Emma Davis",
    category: "Performance",
    date: "Dec 28, 2024",
    image: "/web-performance-concept.png",
    readTime: 7,
    likes: 198,
  },
]

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  const categories = [
    "all",
    "Tutorial",
    "CSS",
    "Backend",
    "TypeScript",
    "API Design",
    "Performance",
  ]

  const filteredBlogs = allBlogs.filter((blog) => {
    const matchesSearch = blog.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || blog.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedBlogs =
    sortBy === "popular"
      ? [...filteredBlogs].sort((a, b) => b.likes - a.likes)
      : filteredBlogs

  return (
    <div className="bg-background text-foreground">
      <Navbar />

      <main className="pt-20">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">Discover All Blogs</h1>
          <p className="text-lg text-muted-foreground">
            Explore our vast collection of articles and tutorials
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="glass-card p-6 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search blogs by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* Category + Sort */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-muted/50 border rounded-lg outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 bg-muted/50 border rounded-lg outline-none"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Blogs Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          {sortedBlogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {sortedBlogs.map((blog) => (
                  <BlogCard key={blog.id} {...blog} />
                ))}
              </div>

              <div className="flex justify-center">
                <Button variant="outline" size="lg">
                  Load More Articles
                </Button>
              </div>
            </>
          ) : (
            <div className="glass-card p-12 text-center">
              <p className="text-muted-foreground mb-4">
                No blogs found matching your criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
