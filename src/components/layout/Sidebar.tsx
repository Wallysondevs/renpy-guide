import { Link } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { cn } from "@/lib/utils";
import {
  BookOpen, Sparkles, Heart, Settings, FileText, Users,
  X, Package, Code, FolderOpen, Image as ImageIcon,
  ChevronRight, Search, Layers, Music,
  Video, HardDrive, Zap, Eye, MessageSquare,
  Server, AlertTriangle, Award, Cpu, GitBranch,
  Palette, MonitorSmartphone, BookMarked, Trophy,
  Smartphone, FileCode, Dot, Wand2, Star, Flower2,
  Languages, Save, ListTree, Film, Smile, MousePointerClick,
  Gamepad2, Bug, Globe,
} from "lucide-react";

const NAVIGATION = [
  {
    title: "Comece Aqui",
    items: [
      { path: "/", label: "Início", icon: BookOpen },
      { path: "/aviso-legal", label: "Licença & Créditos", icon: AlertTriangle },
      { path: "/comece-aqui", label: "Do Zero Absoluto", icon: Zap },
      { path: "/historia", label: "O que é Ren'Py", icon: Sparkles },
    ],
  },
  {
    title: "Instalação & Setup",
    items: [
      { path: "/instalacao", label: "Instalação do SDK", icon: HardDrive },
      { path: "/launcher", label: "Launcher do Ren'Py", icon: Wand2 },
      { path: "/primeiro-projeto", label: "Primeiro Projeto", icon: Star },
      { path: "/estrutura-pastas", label: "Estrutura de Pastas", icon: FolderOpen },
    ],
  },
  {
    title: "Linguagem & Diálogo",
    items: [
      { path: "/sintaxe-basica", label: "Sintaxe Básica", icon: Code },
      { path: "/labels", label: "Labels & Jumps", icon: ListTree },
      { path: "/personagens", label: "Personagens", icon: Smile },
      { path: "/dialogos", label: "Diálogos & Narração", icon: MessageSquare },
      { path: "/multiple-dialogue", label: "Múltiplos Diálogos", icon: MessageSquare },
      { path: "/bubble", label: "Speech Bubbles", icon: MessageSquare },
      { path: "/text-input", label: "Text Input", icon: FileCode },
    ],
  },
  {
    title: "Visual, Sprites & 3D",
    items: [
      { path: "/imagens", label: "Imagens & Sprites", icon: ImageIcon },
      { path: "/cenas", label: "Cenas & Backgrounds", icon: Film },
      { path: "/transicoes", label: "Transições", icon: Layers },
      { path: "/atl", label: "ATL (Animação)", icon: Video },
      { path: "/layered-images", label: "Layered Images", icon: Layers },
      { path: "/displayables", label: "Displayables", icon: ImageIcon },
      { path: "/transform-properties", label: "Transform Properties", icon: Settings },
      { path: "/matrixcolor", label: "Matrixcolor", icon: Palette },
      { path: "/stage-3d", label: "Stage 3D", icon: Eye },
      { path: "/live2d", label: "Live2D Cubism", icon: Smile },
      { path: "/sprites", label: "Partículas (Sprites)", icon: Star },
      { path: "/mouse-custom", label: "Cursor Custom", icon: MousePointerClick },
    ],
  },
  {
    title: "Texto & Tipografia",
    items: [
      { path: "/text", label: "Text Tags & Fontes", icon: FileText },
      { path: "/text-shaders", label: "Text Shaders", icon: Wand2 },
      { path: "/custom-text-tags", label: "Tags Custom", icon: FileCode },
      { path: "/character-callbacks", label: "Character Callbacks", icon: Code },
    ],
  },
  {
    title: "Áudio, Voz & Mídia",
    items: [
      { path: "/audio", label: "Música & SFX", icon: Music },
      { path: "/voice", label: "Voice Acting", icon: MessageSquare },
      { path: "/audio-filters", label: "Audio Filters", icon: Music },
      { path: "/movie", label: "Movie / Vídeo", icon: Video },
      { path: "/splashscreen", label: "Splash & Presplash", icon: Film },
    ],
  },
  {
    title: "Lógica, Python & Saves",
    items: [
      { path: "/variaveis", label: "Variáveis & Python", icon: Code },
      { path: "/condicionais", label: "Condicionais & Flow", icon: GitBranch },
      { path: "/menus", label: "Menus & Escolhas", icon: MousePointerClick },
      { path: "/saves", label: "Saves & Persistent", icon: Save },
      { path: "/store-variables", label: "Store Variables", icon: Save },
      { path: "/lifecycle", label: "Lifecycle do Jogo", icon: GitBranch },
    ],
  },
  {
    title: "GUI, Estilos & Screens",
    items: [
      { path: "/gui", label: "GUI Customization", icon: Palette },
      { path: "/screens", label: "Screen Language", icon: MonitorSmartphone },
      { path: "/nvl", label: "Modo NVL", icon: FileText },
      { path: "/side-images", label: "Side Images", icon: Users },
      { path: "/styles", label: "Styles", icon: Palette },
      { path: "/style-properties", label: "Style Properties", icon: Settings },
      { path: "/advanced-gui", label: "GUI Avançado", icon: Palette },
      { path: "/configuracao", label: "config.* Variables", icon: Settings },
      { path: "/preferencias", label: "Preferências", icon: Settings },
      { path: "/screen-actions", label: "Screen Actions", icon: MousePointerClick },
      { path: "/screens-especiais", label: "Screens Especiais", icon: MonitorSmartphone },
      { path: "/screen-optimization", label: "Screen Optimization", icon: Cpu },
      { path: "/screens-python", label: "Screens em Python", icon: Code },
      { path: "/keymap", label: "Keymap", icon: FileCode },
      { path: "/dialogue-history", label: "History (Log)", icon: ListTree },
      { path: "/rooms", label: "Gallery / Music Room", icon: ImageIcon },
      { path: "/drag-drop", label: "Drag & Drop", icon: MousePointerClick },
    ],
  },
  {
    title: "Sistemas de Jogo",
    items: [
      { path: "/inventario", label: "Inventário", icon: Package },
      { path: "/afeicao", label: "Sistema de Afeição", icon: Heart },
      { path: "/minigames", label: "Mini-games", icon: Gamepad2 },
      { path: "/i18n", label: "Tradução / i18n", icon: Languages },
      { path: "/achievements", label: "Achievements (Steam)", icon: Trophy },
    ],
  },
  {
    title: "Python Avançado",
    items: [
      { path: "/statement-equivalents", label: "Statement Equivalents", icon: Code },
      { path: "/cdd", label: "Creator Displayables", icon: ImageIcon },
      { path: "/cds", label: "Creator Statements", icon: FileCode },
      { path: "/file-access", label: "File Access", icon: FolderOpen },
      { path: "/color-class", label: "Color Class", icon: Palette },
      { path: "/matrix-class", label: "Matrix Class", icon: Layers },
      { path: "/model-rendering", label: "Model Rendering", icon: Cpu },
      { path: "/other-functions", label: "Outras Funções", icon: Code },
      { path: "/ren-py-files", label: "_ren.py Files", icon: FileCode },
    ],
  },
  {
    title: "Network & Updates",
    items: [
      { path: "/fetch", label: "HTTP Fetch", icon: Globe },
      { path: "/screenshot", label: "Screenshots", icon: ImageIcon },
      { path: "/updater", label: "Auto-Updater", icon: Server },
      { path: "/downloader", label: "Downloader Lazy", icon: HardDrive },
    ],
  },
  {
    title: "Build & Plataformas",
    items: [
      { path: "/build", label: "Empacotar o Jogo", icon: Server },
      { path: "/web-android", label: "Web & Android", icon: Smartphone },
      { path: "/ios", label: "iOS / iPadOS", icon: Smartphone },
      { path: "/chromeos", label: "Chrome OS", icon: MonitorSmartphone },
      { path: "/raspberry-pi", label: "Raspberry Pi", icon: HardDrive },
      { path: "/iap", label: "In-App Purchase", icon: Package },
      { path: "/gestures", label: "Gestures Mobile", icon: Smartphone },
      { path: "/otimizacao", label: "Otimização", icon: Cpu },
      { path: "/debug-lint", label: "Debug & Lint", icon: Bug },
    ],
  },
  {
    title: "Tools & Engine",
    items: [
      { path: "/security", label: "Segurança", icon: AlertTriangle },
      { path: "/env-vars", label: "Env Vars", icon: Settings },
      { path: "/self-voicing", label: "Self-Voicing (TTS)", icon: MessageSquare },
      { path: "/developer-tools", label: "Developer Tools", icon: Bug },
      { path: "/director-tool", label: "Interactive Director", icon: Wand2 },
      { path: "/automated-testing", label: "Testes Automatizados", icon: Bug },
      { path: "/template-projects", label: "Templates", icon: FolderOpen },
      { path: "/cli", label: "CLI (renpy.sh)", icon: Server },
      { path: "/editor-integration", label: "VSCode/Editor", icon: FileCode },
      { path: "/skins", label: "Skins do Launcher", icon: Palette },
    ],
  },
  {
    title: "Projeto Final",
    items: [
      { path: "/projeto-final", label: "Sakura Café — VN Completa", icon: Flower2 },
    ],
  },
  {
    title: "Referências",
    items: [
      { path: "/comunidade", label: "Comunidade & Carreira", icon: Trophy },
      { path: "/referencias", label: "Referências", icon: BookMarked },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location] = useHashLocation();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar — janela "renpy launcher" */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-72 z-50 overflow-y-auto kali-scroll transition-transform duration-300 border-r border-[hsl(var(--kali-magenta))]/20",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{ background: "hsl(var(--kali-bg))" }}
      >
        {/* Title-bar — ren'py launcher window */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b border-white/5 sticky top-0 z-10"
          style={{ background: "hsl(var(--kali-bg-2))" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <div className="min-w-0">
              <h1 className="font-mono font-bold text-sm leading-tight text-[hsl(var(--kali-magenta))] flex items-center gap-1.5">
                <Flower2 className="w-3.5 h-3.5" />
                renpy-sdk
              </h1>
              <p className="text-[10px] text-[hsl(var(--kali-dim))] font-mono leading-tight">
                /game/script.rpy
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 rounded text-gray-400 hover:text-white hover:bg-white/10"
            aria-label="Fechar menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mini banner sakura */}
        <div
          className="px-4 py-2 border-b border-white/5 font-mono text-[11px]"
          style={{ background: "hsl(var(--kali-bg))" }}
        >
          <span className="text-[hsl(var(--kali-magenta))]">label</span>{" "}
          <span className="text-[hsl(var(--kali-cyan))]">start</span>
          <span className="text-[hsl(var(--kali-fg))]">:</span>
          <br />
          <span className="text-[hsl(var(--kali-dim))]">{"    "}</span>
          <span className="text-[hsl(var(--kali-magenta))]">scene</span>{" "}
          <span className="text-[hsl(var(--kali-cyan))]">bg sakura</span>
          <br />
          <span className="text-[hsl(var(--kali-dim))]">{"    "}</span>
          <span className="text-[hsl(var(--kali-magenta))]">"</span>
          <span className="text-[hsl(var(--kali-fg))]">Bem-vindo, dev.</span>
          <span className="text-[hsl(var(--kali-magenta))]">"</span>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-5 pb-8">
          {NAVIGATION.map((section, sIdx) => (
            <div key={section.title}>
              <h2 className="text-[10px] font-mono font-semibold text-[hsl(var(--kali-magenta))]/85 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <span className="text-[hsl(var(--kali-cyan))]">
                  ❀ {String(sIdx + 1).padStart(2, "0")}
                </span>
                {section.title}
              </h2>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = location === item.path;
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] font-mono transition-colors",
                          isActive
                            ? "bg-[hsl(var(--kali-magenta))]/15 text-[hsl(var(--kali-magenta))] font-semibold"
                            : "text-[hsl(var(--kali-fg))]/75 hover:text-[hsl(var(--kali-magenta))] hover:bg-white/5"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {isActive ? (
                          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-[hsl(var(--kali-cyan))]" />
                        ) : (
                          <Dot className="w-3.5 h-3.5 flex-shrink-0 text-[hsl(var(--kali-dim))]" />
                        )}
                        <Icon className="w-3.5 h-3.5 flex-shrink-0 opacity-80" />
                        <span className="flex-1 leading-tight truncate">
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer estilo console renpy */}
        <div className="px-4 py-3 border-t border-white/5 font-mono text-[10px] sticky bottom-0" style={{ background: "hsl(var(--kali-bg-2))" }}>
          <p className="text-[hsl(var(--kali-dim))] m-0 leading-tight">
            <span className="text-[hsl(var(--kali-green))]">●</span> Ren'Py 8.x · PT-BR
          </p>
          <p className="text-[hsl(var(--kali-dim))] m-0 leading-tight">
            <span className="text-[hsl(var(--kali-magenta))]">$</span> Visual Novel Studio
          </p>
        </div>
      </aside>
    </>
  );
}
