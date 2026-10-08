import { useCallback, useEffect, useRef, useState } from "react";
import type { Todo } from "@/types/todo";
import { loadTodos, saveTodos } from "@/lib/todoStorage";

export type TodoStatus = "idle" | "loading" | "saving" | "error";

export interface TodoState {
  todos: Todo[];
  status: TodoStatus;
  error: string | null;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  clearError: () => void;
}

export function useTodos(): TodoState {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<TodoStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const previousRef = useRef<Todo[]>([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // 최초 로드: 저장소에서 읽어 상태로 복원한다.
  useEffect(() => {
    const { data, error: loadError } = loadTodos();
    if (!mountedRef.current) return;
    if (loadError) {
      setError("저장된 할 일을 불러오지 못해 새로 시작합니다.");
    }
    setTodos(data);
    previousRef.current = data;
    setStatus("idle");
  }, []);

  const commit = useCallback(
    (next: Todo[]) => {
      const previous = previousRef.current;
      setTodos(next);
      setStatus("saving");
      // setTimeout 으로 감싸 실제 비동기 저장 흐름(로딩 표시 → 성공/실패)을 만든다.
      window.setTimeout(() => {
        if (!mountedRef.current) return;
        const { ok, error: saveError } = saveTodos(next);
        if (ok) {
          previousRef.current = next;
          setStatus("idle");
        } else {
          setStatus("error");
          setError(
            saveError?.message ??
              "할 일을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
          );
          setTodos(previous);
        }
      }, 250);
    },
    [],
  );

  const addTodo = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const todo: Todo = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        text: trimmed,
        completed: false,
        createdAt: Date.now(),
      };
      commit([todo, ...previousRef.current]);
    },
    [commit],
  );

  const toggleTodo = useCallback(
    (id: string) => {
      commit(
        previousRef.current.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      );
    },
    [commit],
  );

  const deleteTodo = useCallback(
    (id: string) => {
      commit(previousRef.current.filter((todo) => todo.id !== id));
    },
    [commit],
  );

  const clearError = useCallback(() => {
    setError(null);
    setStatus("idle");
  }, []);

  return { todos, status, error, addTodo, toggleTodo, deleteTodo, clearError };
}