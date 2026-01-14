import { Search, X } from "lucide-react";
import { Input } from "@/shared/ui/input";

interface StoriesSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function StoriesSearchInput({
  value,
  onChange,
  onClear,
}: StoriesSearchInputProps) {
  return (
    <div className="relative w-full sm:w-64">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Tìm kiếm truyện..."
        className="pl-10 pr-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
