import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHashLocation } from "wouter/use-hash-location";
import {
  getNavigation,
  isLessonComplete,
  markLessonComplete,
  markLessonIncomplete,
  findLessonByPath,
  type Lesson,
} from "@/lib/course";

export function LessonNav() {
  const [location] = useHashLocation();
  const [complete, setComplete] = useState(false);
  const [nav, setNav] = useState<{ prev: Lesson | null; next: Lesson | null }>({
    prev: null,
    next: null,
  });

  useEffect(() => {
    try {
      const lesson = findLessonByPath(location);
      if (lesson) {
        setComplete(isLessonComplete(lesson.id));
        setNav(getNavigation(lesson.id));
      } else {
        setComplete(false);
        setNav({ prev: null, next: null });
      }
    } catch {
      setComplete(false);
      setNav({ prev: null, next: null });
    }
  }, [location]);

  const toggleComplete = () => {
    const lesson = findLessonByPath(location);
    if (!lesson) return;

    if (complete) {
      markLessonIncomplete(lesson.id);
      setComplete(false);
    } else {
      markLessonComplete(lesson.id);
      setComplete(true);
    }
  };

  if (!nav.prev && !nav.next) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:left-72 bg-background/95 backdrop-blur-sm border-t border-border z-40">
      <div className="container max-w-4xl px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex-1">
          {nav.prev && (
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
              onClick={() => (window.location.hash = nav.prev!.path)}
            >
              <ChevronLeft className="h-4 w-4 shrink-0" />
              <span className="truncate text-sm">{nav.prev.title}</span>
            </Button>
          )}
        </div>

        <Button
          variant={complete ? "default" : "outline"}
          size="sm"
          onClick={toggleComplete}
          className={`shrink-0 gap-2 ${
            complete
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "text-emerald-600 border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
          }`}
        >
          <Check className="h-4 w-4" />
          {complete ? "Concluído" : "Marcar concluído"}
        </Button>

        <div className="flex-1">
          {nav.next && (
            <Button
              variant="ghost"
              className="w-full justify-end gap-2 text-muted-foreground hover:text-foreground"
              onClick={() => (window.location.hash = nav.next!.path)}
            >
              <span className="truncate text-sm">{nav.next.title}</span>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
