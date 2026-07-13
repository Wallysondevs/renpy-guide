import { ReactNode, useEffect, useState } from "react";
import { DifficultyBadge } from "../ui/DifficultyBadge";
import { motion } from "framer-motion";

interface PageContainerProps {
  title: string;
  subtitle?: string;
  difficulty?: "iniciante" | "intermediário" | "avançado";
  timeToRead?: string;
  children: ReactNode;
}

export function PageContainer({ title, subtitle, difficulty, timeToRead, children }: PageContainerProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = windowHeight > 0 ? totalScroll / windowHeight : 0;
      setScrollProgress(scroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 pb-32 min-h-[60vh]">
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500 z-50 transition-all duration-150"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {difficulty && <DifficultyBadge level={difficulty} />}
            {timeToRead && (
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                ⏱ {timeToRead}
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          )}
        </header>

        <article className="prose prose-lg max-w-none">
          {children}
        </article>
      </motion.div>
    </div>
  );
}
