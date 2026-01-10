import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

interface BarChartProps {
  title: string;
  description?: string;
  data: number[];
  labels: string[];
}

export function BarChart({ title, description, data, labels }: BarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between h-32 gap-2">
          {data.map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-primary/80 rounded-t transition-all hover:bg-primary"
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-muted-foreground">{labels[i]}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
