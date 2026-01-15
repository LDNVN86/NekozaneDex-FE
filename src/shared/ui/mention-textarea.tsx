"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { User } from "lucide-react";

interface MentionUser {
  id: string;
  username: string;
  tag_name: string;
  avatar_url?: string | null;
}

interface MentionTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onValueChange?: (value: string) => void;
}

export function MentionTextarea({
  className,
  value,
  onChange,
  onValueChange,
  onKeyDown,
  ...props
}: MentionTextareaProps) {
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [mentionQuery, setMentionQuery] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<MentionUser[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [mentionStart, setMentionStart] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const debounceRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  // Fetch users from API
  const fetchUsers = React.useCallback(async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/proxy/users/search?q=${encodeURIComponent(query)}&limit=5`,
        {
          credentials: "include",
        }
      );
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.data || []);
      }
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  React.useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (showSuggestions && mentionQuery) {
      debounceRef.current = setTimeout(() => {
        fetchUsers(mentionQuery);
      }, 200);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [mentionQuery, showSuggestions, fetchUsers]);

  // Handle textarea change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart || 0;

    // Find @ before cursor position
    const textBeforeCursor = newValue.slice(0, cursorPos);
    const match = textBeforeCursor.match(/@(\w*)$/);

    if (match) {
      setMentionQuery(match[1]);
      setMentionStart(cursorPos - match[0].length);
      setShowSuggestions(true);
      setSelectedIndex(0);
    } else {
      setShowSuggestions(false);
      setMentionQuery("");
    }

    onChange?.(e);
    onValueChange?.(newValue);
  };

  // Insert selected tag_name
  const insertMention = (tagName: string) => {
    const currentValue = (value as string) || "";
    const beforeMention = currentValue.slice(0, mentionStart);
    const afterMention = currentValue.slice(
      mentionStart + mentionQuery.length + 1 // +1 for @
    );

    const newValue = `${beforeMention}@${tagName} ${afterMention}`;

    // Create synthetic event for onChange
    const syntheticEvent = {
      target: { value: newValue },
    } as React.ChangeEvent<HTMLTextAreaElement>;

    onChange?.(syntheticEvent);
    onValueChange?.(newValue);
    setShowSuggestions(false);
    setMentionQuery("");

    // Focus and set cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = beforeMention.length + tagName.length + 2; // @ + space
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + suggestions.length) % suggestions.length
        );
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        insertMention(suggestions[selectedIndex].username);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setShowSuggestions(false);
        return;
      }
    }

    onKeyDown?.(e);
  };

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        data-slot="textarea"
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...props}
      />

      {/* Mention suggestions dropdown */}
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full z-[9999] mt-1 max-h-48 overflow-y-auto rounded-md border bg-popover p-1 shadow-lg"
        >
          {isLoading ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Đang tìm...
            </div>
          ) : (
            suggestions.map((user, index) => (
              <button
                key={user.id}
                type="button"
                className={cn(
                  "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                  index === selectedIndex
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                )}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => insertMention(user.tag_name)}
              >
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.username}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-3 w-3 text-primary" />
                  )}
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{user.username}</span>
                  <span className="text-xs text-muted-foreground">
                    @{user.tag_name}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
