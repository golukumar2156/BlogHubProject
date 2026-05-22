import React from "react"
import { Heart, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const BlogCard = (props) => {
  const {
    id,
    title,
    excerpt,
    author,
    category,
    date,
    image,
    readTime,
    likes = 0,
  } = props

  return (
    <a href={`/blog/${id}`}>
      <div className="glass-card h-full overflow-hidden hover:shadow-xl hover:shadow-primary/10 group cursor-pointer">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-muted">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 smooth-transition"
          />
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 bg-primary/90 text-primary-foreground text-xs font-semibold rounded-lg">
              {category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col h-full">
          <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary smooth-transition">
            {title}
          </h3>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
            {excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
            <span>{author}</span>
            <span>•</span>
            <span>{date}</span>
            <span>•</span>
            <span>{readTime} min read</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border/30">
            <div className="flex items-center gap-3 text-muted-foreground text-sm">
              <button className="flex items-center gap-1 hover:text-primary smooth-transition">
                <Heart className="w-4 h-4" />
                <span>{likes}</span>
              </button>

              <button className="flex items-center gap-1 hover:text-primary smooth-transition">
                <MessageCircle className="w-4 h-4" />
                <span>5</span>
              </button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:bg-primary/10"
            >
              →
            </Button>
          </div>
        </div>
      </div>
    </a>
  )
}

export default BlogCard
