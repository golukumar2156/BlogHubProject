import { Navbar } from "@/pages/Onbordingpage/Navbar"
import { useState } from "react"
import { Link } from "react-router-dom"

const categories = [
  { id: 1, name: "Technology", slug: "technology", blogs: 45, color: "from-primary to-secondary" },
  { id: 2, name: "Design", slug: "design", blogs: 32, color: "from-accent to-primary" },
  { id: 3, name: "Programming", slug: "programming", blogs: 28, color: "from-secondary to-accent" },
  { id: 4, name: "Business", slug: "business", blogs: 19, color: "from-primary to-accent" },
  { id: 5, name: "Lifestyle", slug: "lifestyle", blogs: 15, color: "from-accent to-secondary" },
  { id: 6, name: "Tutorial", slug: "tutorial", blogs: 22, color: "from-secondary to-primary" },
]

export default function CategoriesPage() {
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <div className="bg-background text-foreground">
      <Navbar />

      <main className="pt-20">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">Browse Categories</h1>
          <p className="text-lg text-muted-foreground">
            Discover content across all our topic areas
          </p>
        </div>

        {/* Categories Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/categories/${cat.slug}`}>
                <div
                  className="glass-card overflow-hidden cursor-pointer h-full hover:shadow-xl hover:shadow-primary/10 smooth-transition group"
                  onMouseEnter={() => setHoveredId(cat.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Gradient */}
                  <div className={`w-full h-40 bg-gradient-to-br ${cat.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white smooth-transition" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary smooth-transition">
                      {cat.name}
                    </h3>

                    <p className="text-muted-foreground text-sm mb-4">
                      Explore {cat.blogs} articles in this category
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary">
                        {cat.blogs} Articles
                      </span>
                      <span className="text-lg group-hover:translate-x-1 smooth-transition">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Why Section */}
        <div className="bg-muted/30 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">
              Why Browse by Category?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Focused Learning",
                  description:
                    "Find exactly what you're looking for with organized, topic-specific content.",
                },
                {
                  title: "Discover New Insights",
                  description:
                    "Explore different perspectives and deep dives within your areas of interest.",
                },
                {
                  title: "Stay Updated",
                  description:
                    "Get the latest posts from your favorite categories and never miss new content.",
                },
              ].map((feature, i) => (
                <div key={i} className="glass-card p-6">
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
