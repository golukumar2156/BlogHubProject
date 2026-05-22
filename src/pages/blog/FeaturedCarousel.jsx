import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const featuredBlogs = [
  {
    id: 1,
    title: "The Future of Web Development",
    excerpt:
      "Exploring emerging technologies and trends shaping modern web development...",
    author: "Sarah Chen",
    image: "/web-development-conference.png",
    category: "Technology",
  },
  {
    id: 2,
    title: "Mastering React Hooks",
    excerpt:
      "Deep dive into React hooks and how to leverage them for better state management...",
    author: "James Smith",
    image: "/react-development-concept.png",
    category: "Programming",
  },
  {
    id: 3,
    title: "Design Thinking in Product Development",
    excerpt:
      "How design thinking methodology can transform your product development process...",
    author: "Emma Wilson",
    image: "/design-thinking-workshop.png",
    category: "Design",
  },
];

export function FeaturedCarousel() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((current + 1) % featuredBlogs.length);
  const prev = () =>
    setCurrent((current - 1 + featuredBlogs.length) % featuredBlogs.length);

  const blog = featuredBlogs[current];

  return (
    <div className="relative h-96 rounded-xl overflow-hidden group mb-12">
      <img
        src={blog.image || "/placeholder.svg"}
        alt={blog.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-primary/80 text-primary-foreground text-xs font-semibold rounded-full">
            Featured
          </span>
        </div>

        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight line-clamp-2">
            {blog.title}
          </h2>

          <p className="text-white/80 mb-4 line-clamp-2">{blog.excerpt}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {blog.author[0]}
                </span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{blog.author}</p>
                <p className="text-white/60 text-xs">{blog.category}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 smooth-transition">
        <Button
          size="sm"
          variant="secondary"
          onClick={prev}
          className="rounded-full w-10 h-10 p-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="secondary"
          onClick={next}
          className="rounded-full w-10 h-10 p-0"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-6 flex gap-2">
        {featuredBlogs.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full smooth-transition ${
              i === current ? "bg-white w-8" : "bg-white/40 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
export default FeaturedCarousel;
