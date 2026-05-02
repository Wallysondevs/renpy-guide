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
    title: "Linguagem .rpy",
    items: [
      { path: "/sintaxe-basica", label: "Sintaxe Básica", icon: Code },
      { path: "/labels", label: "Labels & Jumps", icon: ListTree },
      { path: "/personagens", label: "Personagens", icon: Smile },
      { path: "/dialogos", label: "Diálogos & Narração", icon: MessageSquare },
    ],
  },
  {
    title: "Visual & Cenas",
    items: [
      { path: "/imagens", label: "Imagens & Sprites", icon: ImageIcon },
      { path: "/cenas", label: "Cenas & Backgrounds", icon: Film },
      { path: "/transicoes", label: "Transições", icon: Layers },
      { path: "/atl", label: "ATL (Animação)", icon: Video },
      { path: "/layered-images", label: "Layered Images", icon: Layers },
    ],
  },
  {
    title: "Áudio & Voz",
    items: [
      { path: "/audio", label: "Música & SFX", icon: Music },
      { path: "/voice", label: "Voice Acting", icon: MessageSquare },
    ],
  },
  {
    title: "Lógica & Python",
    items: [
      { path: "/variaveis", label: "Variáveis & Python", icon: Code },
      { path: "/condicionais", label: "Condicionais & Flow", icon: GitBranch },
      { path: "/menus", label: "Menus & Escolhas", icon: MousePointerClick },
      { path: "/saves", label: "Saves & Persistent", icon: Save },
    ],
  },
  {
    title: "Interface (GUI)",
    items: [
      { path: "/gui", label: "GUI Customization", icon: Palette },
      { path: "/screens", label: "Screen Language", icon: MonitorSmartphone },
      { path: "/nvl", label: "Modo NVL", icon: FileText },
      { path: "/side-images", label: "Side Images", icon: Users },
    ],
  },
  {
    title: "Recursos Avançados",
    items: [
      { path: "/inventario", label: "Inventário", icon: Package },
      { path: "/afeicao", label: "Sistema de Afeição", icon: Heart },
      { path: "/minigames", label: "Mini-games", icon: Gamepad2 },
      { path: "/i18n", label: "Tradução / i18n", icon: Languages },
    ],
  },
  {
    title: "Build & Distribuição",
    items: [
      { path: "/build", label: "Empacotar o Jogo", icon: Server },
      { path: "/web-android", label: "Web & Android", icon: Smartphone },
      { path: "/otimizacao", label: "Otimização", icon: Cpu },
      { path: "/debug-lint", label: "Debug & Lint", icon: Bug },
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
