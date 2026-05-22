import { useParams } from "react-router-dom"
import { Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "../Onbordingpage/Navbar"


export default function BlogDetailsPage() {
  const { id } = useParams() // future backend use

  return (
    <div className="bg-background text-foreground">
      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <div className="relative h-96 overflow-hidden">
          <img
            src="/blog-article-hero.jpg"
            alt="Blog Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mt-8 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                Technology
              </span>
              <span className="text-sm text-muted-foreground">6 min read</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Getting Started with Next.js 14
            </h1>

            <p className="text-xl text-muted-foreground mb-6">
              Discover the latest features and improvements that make Next.js 14
              a game-changer for modern web development.
            </p>

            {/* Author Info */}
            <div className="flex items-center justify-between py-6 border-y border-border/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">AJ</span>
                </div>
                <div>
                  <p className="font-semibold">Alex Johnson</p>
                  <p className="text-sm text-muted-foreground">
                    Published Jan 8, 2025
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4 mr-1" />
                  342
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Article */}
          <article className="prose prose-invert max-w-none mb-12">
            <h2>Introduction</h2>
            <p>
              Next.js 14 brings a host of new features and improvements that make
              building modern web applications more efficient and enjoyable.
            </p>

            <h2>What's New in Next.js 14?</h2>
            <p>
              The latest version includes improvements to server components,
              enhanced performance optimizations, and better developer
              experience.
            </p>

            <h3>Server Components</h3>
            <p>
              Server Components are now more powerful and flexible, allowing you
              to build more efficient applications.
            </p>

            <h3>Performance Improvements</h3>
            <p>
              Next.js 14 includes several performance enhancements that make
              applications faster by default.
            </p>

            <h2>Conclusion</h2>
            <p>
              Next.js 14 represents a significant step forward in web
              development.
            </p>
          </article>

          {/* Related Blogs */}
          <div className="border-t border-border/50 py-12">
            <h3 className="text-2xl font-bold mb-8">Related Articles</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Advanced Next.js Patterns",
                  author: "Sarah Chen",
                  image: "/nextjs-patterns.jpg",
                },
                {
                  title: "React Server Components Explained",
                  author: "Mike Davis",
                  image: "/react-server-components.png",
                },
              ].map((blog, i) => (
                <div
                  key={i}
                  className="glass-card overflow-hidden cursor-pointer group"
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 smooth-transition"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-2 group-hover:text-primary">
                      {blog.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      by {blog.author}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="border-t border-border/50 py-12 mb-12">
            <h3 className="text-2xl font-bold mb-6">Comments</h3>

            <div className="glass-card p-6 mb-6">
              <textarea
                rows={4}
                placeholder="Share your thoughts..."
                className="w-full bg-muted/50 border border-border/50 rounded-lg p-4 resize-none outline-none"
              />
              <div className="mt-4 flex justify-end">
                <Button>Post Comment</Button>
              </div>
            </div>

            {[
              {
                author: "John Doe",
                date: "2 hours ago",
                text: "Great article! Very helpful.",
              },
              {
                author: "Jane Smith",
                date: "4 hours ago",
                text: "Loved the detailed explanation!",
              },
            ].map((comment, i) => (
              <div key={i} className="glass-card p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <p className="font-semibold">{comment.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {comment.date}
                  </p>
                </div>
                <p className="text-muted-foreground">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
