// Ren'Py Guide - Course Structure
// Storage key: renpy-curso-progressso

export interface Lesson {
  id: string;
  title: string;
  path: string;
}

export interface Module {
  id: string;
  title: string;
  emoji: string;
  lessons: Lesson[];
}

export const COURSE_MODULES: Module[] = [
  {
    id: "introducao",
    title: "Introdução",
    emoji: "🎮",
    lessons: [
      { id: "home", title: "Bem-vindo", path: "/" },
      { id: "comece-aqui", title: "Comece Aqui", path: "/comece-aqui" },
      { id: "instalacao", title: "Instalação", path: "/instalacao" },
      { id: "primeiro-projeto", title: "Primeiro Projeto", path: "/primeiro-projeto" },
      { id: "estrutura-pastas", title: "Estrutura de Pastas", path: "/estrutura-pastas" },
    ],
  },
  {
    id: "fundamentos",
    title: "Fundamentos",
    emoji: "📚",
    lessons: [
      { id: "sintaxe-basica", title: "Sintaxe Básica", path: "/sintaxe-basica" },
      { id: "personagens", title: "Personagens", path: "/personagens" },
      { id: "dialogos", title: "Diálogos", path: "/dialogos" },
      { id: "menus", title: "Menus e Escolhas", path: "/menus" },
      { id: "variaveis", title: "Variáveis", path: "/variaveis" },
      { id: "condicionais", title: "Condicionais", path: "/condicionais" },
      { id: "labels", title: "Labels", path: "/labels" },
    ],
  },
  {
    id: "recursos",
    title: "Recursos Visuais",
    emoji: "🎨",
    lessons: [
      { id: "imagens", title: "Imagens", path: "/imagens" },
      { id: "sprites", title: "Sprites", path: "/sprites" },
      { id: "cenas", title: "Cenas e Backgrounds", path: "/cenas" },
      { id: "transicoes", title: "Transições", path: "/transicoes" },
      { id: "layered-images", title: "Layered Images", path: "/layered-images" },
      { id: "splashscreen", title: "Splashscreen", path: "/splashscreen" },
    ],
  },
  {
    id: "audio",
    title: "Áudio",
    emoji: "🎵",
    lessons: [
      { id: "audio", title: "Sistema de Áudio", path: "/audio" },
      { id: "audio-filters", title: "Filtros de Áudio", path: "/audio-filters" },
      { id: "voice", title: "Voice Acting", path: "/voice" },
    ],
  },
  {
    id: "historia",
    title: "Roteiro e História",
    emoji: "📝",
    lessons: [
      { id: "historia", title: "Roteiro Interativo", path: "/historia" },
      { id: "afeicao", title: "Sistema de Afeição", path: "/afeicao" },
      { id: "inventario", title: "Inventário", path: "/inventario" },
      { id: "achievements", title: "Conquistas", path: "/achievements" },
    ],
  },
  {
    id: "gui",
    title: "Interface (GUI)",
    emoji: "🖼️",
    lessons: [
      { id: "gui", title: "GUI Básica", path: "/gui" },
      { id: "screens", title: "Screens", path: "/screens" },
      { id: "screens-especiais", title: "Screens Especiais", path: "/screens-especiais" },
      { id: "text-input", title: "Text Input", path: "/text-input" },
      { id: "bubble", title: "Dialogue Bubble", path: "/bubble" },
      { id: "nvl-mode", title: "NVL Mode", path: "/nvl" },
      { id: "side-images", title: "Side Images", path: "/side-images" },
      { id: "styles", title: "Styles", path: "/styles" },
      { id: "skins", title: "Skins", path: "/skins" },
    ],
  },
  {
    id: "animacoes",
    title: "Animações",
    emoji: "✨",
    lessons: [
      { id: "atl", title: "ATL (Animation)", path: "/atl" },
      { id: "transform-properties", title: "Transform Properties", path: "/transform-properties" },
      { id: "gestures", title: "Gestures", path: "/gestures" },
      { id: "drag-drop", title: "Drag and Drop", path: "/drag-drop" },
    ],
  },
  {
    id: "screens-avancado",
    title: "Screens Avançado",
    emoji: "🔧",
    lessons: [
      { id: "screen-actions", title: "Screen Actions", path: "/screen-actions" },
      { id: "screens-python", title: "Screens + Python", path: "/screens-python" },
      { id: "minigames", title: "Minigames", path: "/minigames" },
      { id: "rooms", title: "Rooms/Map", path: "/rooms" },
      { id: "screen-optimization", title: "Otimização de Screens", path: "/screen-optimization" },
    ],
  },
  {
    id: "texto-avancado",
    title: "Texto Avançado",
    emoji: "💬",
    lessons: [
      { id: "text", title: "Sistema de Texto", path: "/text" },
      { id: "custom-text-tags", title: "Tags Customizadas", path: "/custom-text-tags" },
      { id: "text-shaders", title: "Text Shaders", path: "/text-shaders" },
      { id: "dialogue-history", title: "Dialogue History", path: "/dialogue-history" },
      { id: "multiple-dialogue", title: "Multiple Dialogue", path: "/multiple-dialogue" },
    ],
  },
  {
    id: "python",
    title: "Python no Ren'Py",
    emoji: "🐍",
    lessons: [
      { id: "screens-python", title: "Python em Screens", path: "/screens-python" },
      { id: "store-variables", title: "Store Variables", path: "/store-variables" },
      { id: "statement-equivalents", title: "Statement Equivalents", path: "/statement-equivalents" },
      { id: "other-functions", title: "Outras Funções", path: "/other-functions" },
    ],
  },
  {
    id: "displayables",
    title: "Displayables",
    emoji: "🖼️",
    lessons: [
      { id: "displayables", title: "Displayables", path: "/displayables" },
      { id: "model-rendering", title: "Model Rendering", path: "/model-rendering" },
      { id: "matrixcolor", title: "MatrixColor", path: "/matrixcolor" },
      { id: "matrix-class", title: "Matrix Class", path: "/matrix-class" },
      { id: "color-class", title: "Color Class", path: "/color-class" },
    ],
  },
  {
    id: "avancado",
    title: "Recursos Avançados",
    emoji: "🚀",
    lessons: [
      { id: "character-callbacks", title: "Character Callbacks", path: "/character-callbacks" },
      { id: "lifecycle", title: "Lifecycle", path: "/lifecycle" },
      { id: "cdd", title: "CDD (Custom Displayable)", path: "/cdd" },
      { id: "cds", title: "CDS (Custom Statement)", path: "/cds" },
      { id: "env-vars", title: "Environment Variables", path: "/env-vars" },
      { id: "updater", title: "Updater", path: "/updater" },
      { id: "security", title: "Segurança", path: "/security" },
    ],
  },
  {
    id: "plataformas",
    title: "Plataformas",
    emoji: "📱",
    lessons: [
      { id: "build", title: "Build & Distribuição", path: "/build" },
      { id: "web-android", title: "Web vs Android", path: "/web-android" },
      { id: "ios", title: "iOS", path: "/ios" },
      { id: "chromeos", title: "ChromeOS", path: "/chromeos" },
      { id: "raspberry-pi", title: "Raspberry Pi", path: "/raspberry-pi" },
    ],
  },
  {
    id: "i18n",
    title: "Internacionalização",
    emoji: "🌍",
    lessons: [
      { id: "i18n", title: "Tradução (I18n)", path: "/i18n" },
      { id: "self-voicing", title: "Self-Voicing (Acessibilidade)", path: "/self-voicing" },
    ],
  },
  {
    id: "ferramentas",
    title: "Ferramentas",
    emoji: "🛠️",
    lessons: [
      { id: "launcher", title: "Launcher", path: "/launcher" },
      { id: "cli", title: "CLI", path: "/cli" },
      { id: "editor-integration", title: "Editor Integration", path: "/editor-integration" },
      { id: "developer-tools", title: "Developer Tools", path: "/developer-tools" },
      { id: "director-tool", title: "Director Tool", path: "/director-tool" },
      { id: "keymap", title: "Keymap", path: "/keymap" },
      { id: "screenshot", title: "Screenshot", path: "/screenshot" },
    ],
  },
  {
    id: "debug",
    title: "Debug & Testes",
    emoji: "🐛",
    lessons: [
      { id: "debug-lint", title: "Debug & Lint", path: "/debug-lint" },
      { id: "automated-testing", title: "Automated Testing", path: "/automated-testing" },
    ],
  },
  {
    id: "recursos-especiais",
    title: "Recursos Especiais",
    emoji: "⭐",
    lessons: [
      { id: "live2d", title: "Live2D", path: "/live2d" },
      { id: "movie", title: "Movie/Video", path: "/movie" },
      { id: "stage-3d", title: "Stage3D", path: "/stage-3d" },
      { id: "iap", title: "In-App Purchases", path: "/iap" },
      { id: "downloader", title: "Downloader", path: "/downloader" },
      { id: "file-access", title: "File Access", path: "/file-access" },
      { id: "fetch", title: "Fetch", path: "/fetch" },
    ],
  },
  {
    id: "otimizacao",
    title: "Otimização",
    emoji: "⚡",
    lessons: [
      { id: "otimizacao", title: "Otimização", path: "/otimizacao" },
      { id: "saves", title: "Sistema de Saves", path: "/saves" },
      { id: "preferencias", title: "Preferências", path: "/preferencias" },
      { id: "configuracao", title: "Configuração", path: "/configuracao" },
    ],
  },
  {
    id: "extras",
    title: "Extras",
    emoji: "📖",
    lessons: [
      { id: "template-projects", title: "Templates", path: "/template-projects" },
      { id: "projeto-final", title: "Projeto Final", path: "/projeto-final" },
      { id: "comunidade", title: "Comunidade", path: "/comunidade" },
      { id: "referencias", title: "Referências", path: "/referencias" },
      { id: "aviso-legal", title: "Aviso Legal", path: "/aviso-legal" },
    ],
  },
];

const STORAGE_KEY = "renpy-curso-progressso";

function getAllLessonIds(): string[] {
  return COURSE_MODULES.flatMap((module) => module.lessons.map((l) => l.id));
}

export function getProgress(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress: Record<string, boolean>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function markLessonComplete(lessonId: string): void {
  const progress = getProgress();
  progress[lessonId] = true;
  saveProgress(progress);
}

export function markLessonIncomplete(lessonId: string): void {
  const progress = getProgress();
  delete progress[lessonId];
  saveProgress(progress);
}

export function isLessonComplete(lessonId: string): boolean {
  const progress = getProgress();
  return progress[lessonId] === true;
}

export function getCompletionStats(): {
  completed: number;
  total: number;
  percentage: number;
} {
  const allLessons = getAllLessonIds();
  const progress = getProgress();
  const completed = allLessons.filter((id) => progress[id]).length;
  const total = allLessons.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
}

export function getModuleProgress(moduleId: string): {
  completed: number;
  total: number;
} {
  const module = COURSE_MODULES.find((m) => m.id === moduleId);
  if (!module) return { completed: 0, total: 0 };
  const progress = getProgress();
  const completed = module.lessons.filter((l) => progress[l.id]).length;
  return { completed, total: module.lessons.length };
}

export function getNavigation(
  currentLessonId: string
): { prev: Lesson | null; next: Lesson | null } {
  const allLessons = getAllLessonIds();
  const currentIndex = allLessons.indexOf(currentLessonId);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  let prev: Lesson | null = null;
  let next: Lesson | null = null;

  if (currentIndex > 0) {
    const prevId = allLessons[currentIndex - 1];
    for (const module of COURSE_MODULES) {
      const lesson = module.lessons.find((l) => l.id === prevId);
      if (lesson) {
        prev = lesson;
        break;
      }
    }
  }

  if (currentIndex < allLessons.length - 1) {
    const nextId = allLessons[currentIndex + 1];
    for (const module of COURSE_MODULES) {
      const lesson = module.lessons.find((l) => l.id === nextId);
      if (lesson) {
        next = lesson;
        break;
      }
    }
  }

  return { prev, next };
}

export function findLessonByPath(path: string): Lesson | null {
  for (const module of COURSE_MODULES) {
    const lesson = module.lessons.find((l) => l.path === path);
    if (lesson) return lesson;
  }
  return null;
}
