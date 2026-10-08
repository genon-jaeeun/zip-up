import { ChevronLeft, ChevronRight, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TodoItem, TodoItemSkeleton } from "@/components/TodoItem";
import type { Todo } from "@/types/todo";

const PAGE_SIZE = 20;

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  saving: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoList({
  todos,
  loading,
  saving,
  page,
  onPageChange,
  onToggle,
  onDelete,
}: TodoListProps) {
  const totalPages = Math.max(1, Math.ceil(todos.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = todos.slice(start, start + PAGE_SIZE);

  if (loading) {
    return (
      <ul className="flex flex-col gap-3" aria-busy="true" aria-label="할 일 불러오는 중">
        {Array.from({ length: 3 }).map((_, index) => (
          <TodoItemSkeleton key={index} />
        ))}
      </ul>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/40 px-6 py-14 text-center">
        <ClipboardList className="size-12 text-muted-foreground/70" aria-hidden="true" />
        <p className="text-base font-semibold text-foreground">등록된 할 일이 없습니다</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          위 입력창에 첫 번째 할 일을 적고 추가 버튼을 눌러 보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {visible.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            saving={saving}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </ul>

      {totalPages > 1 && (
        <nav
          aria-label="할 일 목록 페이지"
          className="flex items-center justify-center gap-2 pt-1"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(safePage - 1)}
            disabled={safePage <= 1}
            aria-label="이전 페이지"
            className="size-9 border-border bg-card hover:bg-accent"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>
          <span className="min-w-24 text-center text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{safePage}</span>
            {" / "}
            {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(safePage + 1)}
            disabled={safePage >= totalPages}
            aria-label="다음 페이지"
            className="size-9 border-border bg-card hover:bg-accent"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </nav>
      )}
    </div>
  );
}

export default TodoList;