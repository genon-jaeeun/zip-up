import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TodoFormProps {
  onAdd: (text: string) => void;
  saving: boolean;
}

export function TodoForm({ onAdd, saving }: TodoFormProps) {
  const [value, setValue] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || saving) return;
    onAdd(trimmed);
    setValue("");
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="새로운 할 일을 입력하세요"
        aria-label="새 할 일 입력"
        disabled={saving}
        maxLength={200}
        className="h-12 flex-1 border-input bg-card text-base shadow-sm focus-visible:ring-2 focus-visible:ring-ring"
      />
      <Button
        type="submit"
        disabled={saving || value.trim().length === 0}
        className="h-12 gap-2 px-6 text-base font-semibold shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-60"
      >
        {saving ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Plus className="size-4" aria-hidden="true" />
        )}
        {saving ? "저장 중…" : "추가"}
      </Button>
    </form>
  );
}

export default TodoForm;