import { useState } from "react";
import { Link } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { cn } from "@/lib/utils";
import { Heart, X, ChevronDown, ChevronRight, Check, BookOpen } from "lucide-react";
import { COURSE_MODULES, getProgress, getCompletionStats, type Module } from "@/lib/course";

function ModuleSection({ module }: { module: Module }) {
  const [location] = useHashLocation();
  const [open, setOpen] = useState(() => {
    return module.lessons.some((l) => l.path === location);
  });
  const progress = getProgress();

  const completedCount = module.lessons.filter((l) => progress[l.id]).length;
  const isComplete = completedCount === module.lessons.length;
  const hasActiveChild = module.lessons.some((l) => l.path === location);

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
          hasActiveChild ? "bg-rose-500/10 text-rose-500" : "text-foreground hover:bg-muted"
        )}
      >
        <span className="text-lg">{module.emoji}</span>
        <span className="flex-1 text-left">{module.title}</span>
        {isComplete ? (
          <Check className="w-4 h-4 text-emerald-500" />
        ) : completedCount > 0 ? (
          <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {completedCount}/{module.lessons.length}
          </span>
        ) : null}
        {open ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="mt-1 ml-4 border-l-2 border-border/50 pl-3 space-y-1">
          {module.lessons.map((lesson) => {
            const active = location === lesson.path;
            const done = progress[lesson.id];
            return (
              <Link key={lesson.id} href={lesson.path}>
                <div
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition-all",
                    active
                      ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    done && !active && "text-emerald-600 dark:text-emerald-400"
                  )}
                >
                  {done ? (
                    <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                  ) : (
                    <div className="w-4 h-4 shrink-0 rounded-full border border-muted-foreground/30" />
                  )}
                  <span className="truncate">{lesson.title}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const stats = getCompletionStats();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-72 z-50 bg-card border-r border-border flex flex-col transition-transform duration-300",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-border shrink-0">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm leading-tight">Ren'Py Guide</div>
              <div className="text-[10px] text-muted-foreground font-normal">Livro Completo</div>
            </div>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-muted-foreground">Seu progresso</span>
            <span className="font-bold text-rose-500">{stats.percentage}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
          <div className="text-[10px] text-muted-foreground mt-1.5 text-center">
            {stats.completed} de {stats.total} lições
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <Link href="/">
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold mb-3",
                "text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              )}
            >
              <BookOpen className="w-4 h-4 text-rose-500" />
              Início
            </div>
          </Link>
          {COURSE_MODULES.map((module) => (
            <ModuleSection key={module.id} module={module} />
          ))}
        </div>

        <div className="p-3 border-t border-border">
          <div className="text-[10px] text-muted-foreground text-center">
            Ren'Py Guide 2025
          </div>
        </div>
      </aside>
    </>
  );
}
