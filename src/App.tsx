import { useEffect, useState } from "react";
import { CheckCircle2, ListTodo, Loader2, TriangleAlert, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import { useTodos } from "@/hooks/useTodos";

function App() {
  const { todos, status, error, addTodo, toggleTodo, deleteTodo, clearError } = useTodos();
  const [page, setPage] = useState(1);

  const loading = status === "loading";
  const saving = status === "saving";
  const completedCount = todos.filter((todo) => todo.completed).length;

  // 저장 실패 시 이전 상태로 되돌려졌음을 사용자에게 알린다.
  useEffect(() => {
    if (status === "error" && error) {
      toast.error(error);
    }
  }, [status, error]);

  const handleAdd = (text: string) => {
    setPage(1);
    addTodo(text);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <ListTodo className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-lg font-bold leading-tight text-foreground sm:text-xl">
                할 일 관리
              </h1>
              <p className="text-xs text-muted-foreground">
                브라우저에 자동 저장됩니다
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="gap-1 bg-secondary px-3 py-1.5 text-secondary-foreground"
          >
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            완료 {completedCount} / {todos.length}
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <Card className="border-border/60 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold">오늘의 할 일</CardTitle>
            <CardDescription>
              할 일을 추가하고, 체크로 완료 표시를 하거나 삭제할 수 있어요.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <TodoForm onAdd={handleAdd} saving={saving} />

            {status === "error" && error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4"
              >
                <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-destructive">저장에 실패했어요</p>
                  <p className="mt-0.5 text-sm text-destructive/90">{error}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    목록을 이전 상태로 되돌렸습니다.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearError}
                  aria-label="오류 알림 닫기"
                  className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <X className="size-4" aria-hidden="true" />
                </Button>
              </div>
            )}

            <Separator />

            <TodoList
              todos={todos}
              loading={loading}
              saving={saving}
              page={page}
              onPageChange={setPage}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          </CardContent>
        </Card>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          {saving && (
            <>
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              저장 중…
            </>
          )}
        </p>
      </main>

      <Toaster position="top-center" />
    </div>
  );
}

export default App;