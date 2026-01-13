import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface SectionHeaderProps {
  icon: LucideIcon;
  iconClassName?: string;
  iconBgClassName?: string;
  title: string;
  linkHref: string;
  linkText: string;
  className?: string;
}

export function SectionHeader({
  icon: Icon,
  iconClassName,
  iconBgClassName = "bg-primary/10",
  title,
  linkHref,
  linkText,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-8", className)}>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            iconBgClassName
          )}
        >
          <Icon className={cn("h-5 w-5 text-primary", iconClassName)} />
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <Button variant="ghost" asChild>
        <Link href={linkHref} className="gap-1">
          {linkText}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
