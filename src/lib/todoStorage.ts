import type { Todo } from "@/types/todo";

const STORAGE_KEY = "todos.v1";

export interface StorageResult<T> {
  data: T;
  error: Error | null;
}

export interface PersistResult {
  ok: boolean;
  error: Error | null;
}

function readRaw(): unknown {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error("[todoStorage] localStorage 읽기 실패", error);
    return null;
  }
}

function parseTodos(raw: unknown): StorageResult<Todo[]> {
  if (raw === null || raw === "") {
    return { data: [], error: null };
  }
  try {
    const parsed: unknown = JSON.parse(String(raw));
    if (
      parsed !== null &&
      typeof parsed === "object" &&
      Array.isArray((parsed as { todos?: unknown }).todos)
    ) {
      const todos = (parsed as { todos: unknown[] }).todos.filter(isTodo);
      return { data: todos, error: null };
    }
    if (Array.isArray(parsed)) {
      return { data: parsed.filter(isTodo), error: null };
    }
    return { data: [], error: new Error("저장된 데이터 형식이 올바르지 않습니다.") };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error("저장 데이터를 해석하지 못했습니다."),
    };
  }
}

function isTodo(value: unknown): value is Todo {
  if (value === null || typeof value !== "object") return false;
  const todo = value as Record<string, unknown>;
  return (
    typeof todo.id === "string" &&
    typeof todo.text === "string" &&
    typeof todo.completed === "boolean" &&
    typeof todo.createdAt === "number"
  );
}

export function loadTodos(): StorageResult<Todo[]> {
  return parseTodos(readRaw());
}

export function saveTodos(todos: Todo[]): PersistResult {
  try {
    const payload = JSON.stringify({ version: 1, todos });
    localStorage.setItem(STORAGE_KEY, payload);
    return { ok: true, error: null };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error
          : new Error("할 일을 저장하지 못했습니다."),
    };
  }
}