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
      { id: "comece-aqui", title: "Comece Aqui", path: "/ComeceAqui" },
      { id: "instalacao", title: "Instalação", path: "/Instalacao" },
      { id: "primeiro-projeto", title: "Primeiro Projeto", path: "/PrimeiroProjeto" },
      { id: "estrutura-pastas", title: "Estrutura de Pastas", path: "/EstruturaPastas" },
    ],
  },
  {
    id: "fundamentos",
    title: "Fundamentos",
    emoji: "📚",
    lessons: [
      { id: "sintaxe-basica", title: "Sintaxe Básica", path: "/SintaxeBasica" },
      { id: "personagens", title: "Personagens", path: "/Personagens" },
      { id: "dialogos", title: "Diálogos", path: "/Dialogos" },
      { id: "menus", title: "Menus e Escolhas", path: "/Menus" },
      { id: "variaveis", title: "Variáveis", path: "/Variaveis" },
      { id: "condicionais", title: "Condicionais", path: "/Condicionais" },
      { id: "labels", title: "Labels", path: "/Labels" },
    ],
  },
  {
    id: "recursos",
    title: "Recursos Visuais",
    emoji: "🎨",
    lessons: [
      { id: "imagens", title: "Imagens", path: "/Imagens" },
      { id: "sprites", title: "Sprites", path: "/Sprites" },
      { id: "cenas", title: "Cenas e Backgrounds", path: "/Cenas" },
      { id: "transicoes", title: "Transições", path: "/Transicoes" },
      { id: "layered-images", title: "Layered Images", path: "/LayeredImages" },
      { id: "splashscreen", title: "Splashscreen", path: "/Splashscreen" },
    ],
  },
  {
    id: "audio",
    title: "Áudio",
    emoji: "🎵",
    lessons: [
      { id: "audio", title: "Sistema de Áudio", path: "/Audio" },
      { id: "audio-filters", title: "Filtros de Áudio", path: "/AudioFilters" },
      { id: "voice", title: "Voice Acting", path: "/Voice" },
    ],
  },
  {
    id: "historia",
    title: "Roteiro e História",
    emoji: "📝",
    lessons: [
      { id: "historia", title: "Roteiro Interativo", path: "/Historia" },
      { id: "afeicao", title: "Sistema de Afeição", path: "/Afeicao" },
      { id: "inventario", title: "Inventário", path: "/Inventario" },
      { id: "achievements", title: "Conquistas", path: "/Achievements" },
    ],
  },
  {
    id: "gui",
    title: "Interface (GUI)",
    emoji: "🖼️",
    lessons: [
      { id: "gui", title: "GUI Básica", path: "/GUI" },
      { id: "screens", title: "Screens", path: "/Screens" },
      { id: "screens-especiais", title: "Screens Especiais", path: "/ScreensEspeciais" },
      { id: "text-input", title: "Text Input", path: "/TextInput" },
      { id: "bubble", title: "Dialogue Bubble", path: "/Bubble" },
      { id: "nvl-mode", title: "NVL Mode", path: "/NVL" },
      { id: "side-images", title: "Side Images", path: "/SideImages" },
      { id: "styles", title: "Styles", path: "/Styles" },
      { id: "skins", title: "Skins", path: "/Skins" },
    ],
  },
  {
    id: "animacoes",
    title: "Animações",
    emoji: "✨",
    lessons: [
      { id: "atl", title: "ATL (Animation)", path: "/ATL" },
      { id: "transform-properties", title: "Transform Properties", path: "/TransformProperties" },
      { id: "gestures", title: "Gestures", path: "/Gestures" },
      { id: "drag-drop", title: "Drag and Drop", path: "/DragDrop" },
    ],
  },
  {
    id: "screens-avancado",
    title: "Screens Avançado",
    emoji: "🔧",
    lessons: [
      { id: "screen-actions", title: "Screen Actions", path: "/ScreenActions" },
      { id: "screens-python", title: "Screens + Python", path: "/ScreensPython" },
      { id: "minigames", title: "Minigames", path: "/Minigames" },
      { id: "rooms", title: "Rooms/Map", path: "/Rooms" },
      { id: "screen-optimization", title: "Otimização de Screens", path: "/ScreenOptimization" },
    ],
  },
  {
    id: "texto-avancado",
    title: "Texto Avançado",
    emoji: "💬",
    lessons: [
      { id: "text", title: "Sistema de Texto", path: "/Text" },
      { id: "custom-text-tags", title: "Tags Customizadas", path: "/CustomTextTags" },
      { id: "text-shaders", title: "Text Shaders", path: "/TextShaders" },
      { id: "dialogue-history", title: "Dialogue History", path: "/DialogueHistory" },
      { id: "multiple-dialogue", title: "Multiple Dialogue", path: "/MultipleDialogue" },
    ],
  },
  {
    id: "python",
    title: "Python no Ren'Py",
    emoji: "🐍",
    lessons: [
      { id: "screens-python", title: "Python em Screens", path: "/ScreensPython" },
      { id: "store-variables", title: "Store Variables", path: "/StoreVariables" },
      { id: "statement-equivalents", title: "Statement Equivalents", path: "/StatementEquivalents" },
      { id: "other-functions", title: "Outras Funções", path: "/OtherFunctions" },
    ],
  },
  {
    id: "displayables",
    title: "Displayables",
    emoji: "🖼️",
    lessons: [
      { id: "displayables", title: "Displayables", path: "/Displayables" },
      { id: "model-rendering", title: "Model Rendering", path: "/ModelRendering" },
      { id: "matrixcolor", title: "MatrixColor", path: "/Matrixcolor" },
      { id: "matrix-class", title: "Matrix Class", path: "/MatrixClass" },
      { id: "color-class", title: "Color Class", path: "/ColorClass" },
    ],
  },
  {
    id: "avancado",
    title: "Recursos Avançados",
    emoji: "🚀",
    lessons: [
      { id: "character-callbacks", title: "Character Callbacks", path: "/CharacterCallbacks" },
      { id: "lifecycle", title: "Lifecycle", path: "/Lifecycle" },
      { id: "cdd", title: "CDD (Custom Displayable)", path: "/CDD" },
      { id: "cds", title: "CDS (Custom Statement)", path: "/CDS" },
      { id: "env-vars", title: "Environment Variables", path: "/EnvVars" },
      { id: "updater", title: "Updater", path: "/Updater" },
      { id: "security", title: "Segurança", path: "/Security" },
    ],
  },
  {
    id: "plataformas",
    title: "Plataformas",
    emoji: "📱",
    lessons: [
      { id: "build", title: "Build & Distribuição", path: "/Build" },
      { id: "web-android", title: "Web vs Android", path: "/WebAndroid" },
      { id: "ios", title: "iOS", path: "/iOS" },
      { id: "chromeos", title: "ChromeOS", path: "/ChromeOS" },
      { id: "raspberry-pi", title: "Raspberry Pi", path: "/RaspberryPi" },
    ],
  },
  {
    id: "i18n",
    title: "Internacionalização",
    emoji: "🌍",
    lessons: [
      { id: "i18n", title: "Tradução (I18n)", path: "/I18n" },
      { id: "self-voicing", title: "Self-Voicing (Acessibilidade)", path: "/SelfVoicing" },
    ],
  },
  {
    id: "ferramentas",
    title: "Ferramentas",
    emoji: "🛠️",
    lessons: [
      { id: "launcher", title: "Launcher", path: "/Launcher" },
      { id: "cli", title: "CLI", path: "/CLI" },
      { id: "editor-integration", title: "Editor Integration", path: "/EditorIntegration" },
      { id: "developer-tools", title: "Developer Tools", path: "/DeveloperTools" },
      { id: "director-tool", title: "Director Tool", path: "/DirectorTool" },
      { id: "keymap", title: "Keymap", path: "/Keymap" },
      { id: "screenshot", title: "Screenshot", path: "/Screenshot" },
    ],
  },
  {
    id: "debug",
    title: "Debug & Testes",
    emoji: "🐛",
    lessons: [
      { id: "debug-lint", title: "Debug & Lint", path: "/DebugLint" },
      { id: "automated-testing", title: "Automated Testing", path: "/AutomatedTesting" },
    ],
  },
  {
    id: "recursos-especiais",
    title: "Recursos Especiais",
    emoji: "⭐",
    lessons: [
      { id: "live2d", title: "Live2D", path: "/Live2D" },
      { id: "movie", title: "Movie/Video", path: "/Movie" },
      { id: "stage3d", title: "Stage3D", path: "/Stage3D" },
      { id: "iap", title: "In-App Purchases", path: "/IAP" },
      { id: "downloader", title: "Downloader", path: "/Downloader" },
      { id: "file-access", title: "File Access", path: "/FileAccess" },
      { id: "fetch", title: "Fetch", path: "/Fetch" },
    ],
  },
  {
    id: "otimizacao",
    title: "Otimização",
    emoji: "⚡",
    lessons: [
      { id: "otimizacao", title: "Otimização", path: "/Otimizacao" },
      { id: "saves", title: "Sistema de Saves", path: "/Saves" },
      { id: "preferencias", title: "Preferências", path: "/Preferencias" },
      { id: "configuracao", title: "Configuração", path: "/Configuracao" },
    ],
  },
  {
    id: "extras",
    title: "Extras",
    emoji: "📖",
    lessons: [
      { id: "template-projects", title: "Templates", path: "/TemplateProjects" },
      { id: "projeto-final", title: "Projeto Final", path: "/ProjetoFinal" },
      { id: "comunidade", title: "Comunidade", path: "/Comunidade" },
      { id: "referencias", title: "Referências", path: "/Referencias" },
      { id: "aviso-legal", title: "Aviso Legal", path: "/AvisoLegal" },
    ],
  },
];

const STORAGE_KEY = "ren…esso";

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
