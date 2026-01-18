"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";
import { searchStoriesSuggestions } from "@/shared/lib/search-api";
import type { Story } from "@/features/story/interface/story-interface";

interface SearchSuggestionsProps {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
}

export function SearchSuggestions({
  className,
  inputClassName,
  placeholder = "Tìm kiếm truyện...",
}: SearchSuggestionsProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<Story[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Debounced search with proper cleanup
  React.useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      if (cancelled) return;
      setIsLoading(true);
      try {
        const results = await searchStoriesSuggestions(query.trim(), 10);
        if (!cancelled) {
          setSuggestions(results);
          setIsOpen(results.length > 0);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/client/stories?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/client/stories/${slug}`);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setIsOpen(true)}
            className={cn("pl-10 pr-10", inputClassName)}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>
      {/* Suggestions dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg overflow-hidden z-50">
          {isLoading ? (
            <div className="p-3 text-sm text-muted-foreground text-center">
              Đang tìm kiếm...
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {suggestions.map((story) => (
                <li key={story.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(story.slug)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left"
                  >
                    {story.cover_image_url ? (
                      <img
                        src={story.cover_image_url}
                        alt={story.title}
                        className="w-10 h-14 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-14 bg-muted rounded flex items-center justify-center text-xs">
                        N/A
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{story.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {story.author_name || "Chưa rõ tác giả"}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <Link
            href={`/client/stories?q=${encodeURIComponent(query)}`}
            className="block p-3 text-sm text-center text-primary hover:bg-muted border-t"
            onClick={() => setIsOpen(false)}
          >
            Xem tất cả kết quả cho "{query}"
          </Link>
        </div>
      )}
    </div>
  );
}
