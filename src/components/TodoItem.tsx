import { Trash2, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  saving: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function TodoItem({ todo, saving, onToggle, onDelete }: TodoItemProps) {
  return (
    <li
      className={cn(
        "group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md",
        todo.completed && "bg-muted/60",
      )}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        disabled={saving}
        aria-label={`${todo.text} 완료 표시`}
        className="size-5 rounded-md border-primary/60 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-medium text-foreground sm:text-base",
            todo.completed && "text-muted-foreground line-through",
          )}
        >
          {todo.text}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarClock className="size-3" aria-hidden="true" />
          {formatDateTime(todo.createdAt)}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        disabled={saving}
        aria-label={`${todo.text} 삭제`}
        className="size-9 shrink-0 text-muted-foreground transition-colors duration-200 hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </Button>
    </li>
  );
}

export function TodoItemSkeleton() {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
      <Skeleton className="size-5 rounded-md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="size-9 rounded-md" />
    </li>
  );
}