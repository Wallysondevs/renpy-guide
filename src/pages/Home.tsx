import { Link } from "wouter";
import {
  Sparkles,
  Heart,
  ChevronRight,
  Wand2,
  Star,
  Flower2,
  Code,
  Image as ImageIcon,
  Music,
  MousePointerClick,
  Palette,
  Languages,
  Server,
  Gamepad2,
  BookOpen,
} from "lucide-react";

const sections = [
  {
    icon: Wand2,
    title: "Comece Aqui (do zero)",
    desc: "Você nunca programou uma cena? Comece por aqui. Sem nenhum pré-requisito.",
    href: "/comece-aqui",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Star,
    title: "Primeiro Projeto",
    desc: "Crie seu primeiro VN no Launcher e veja a primeira fala aparecer.",
    href: "/primeiro-projeto",
    color: "bg-pink-500/10 text-pink-500",
  },
  {
    icon: Code,
    title: "Sintaxe .rpy",
    desc: "Labels, jumps, scenes e show — a anatomia de um script Ren'Py.",
    href: "/sintaxe-basica",
    color: "bg-violet-500/10 text-violet-500",
  },
  {
    icon: ImageIcon,
    title: "Sprites & Cenas",
    desc: "Personagens, expressões, backgrounds, transições e ATL.",
    href: "/imagens",
    color: "bg-fuchsia-500/10 text-fuchsia-500",
  },
  {
    icon: Music,
    title: "Música & Voice",
    desc: "Trilha sonora, efeitos e dublagem por linha de diálogo.",
    href: "/audio",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: MousePointerClick,
    title: "Menus & Escolhas",
    desc: "Crie rotas, finais múltiplos e pontos de afeição (route system).",
    href: "/menus",
    color: "bg-rose-500/10 text-rose-500",
  },
  {
    icon: Palette,
    title: "GUI & Screens",
    desc: "Customize o textbox, cores, fontes e crie telas de inventário.",
    href: "/gui",
    color: "bg-pink-400/10 text-pink-400",
  },
  {
    icon: Languages,
    title: "Tradução (i18n)",
    desc: "Lance sua VN em múltiplos idiomas com `renpy.translate`.",
    href: "/i18n",
    color: "bg-indigo-500/10 text-indigo-500",
  },
  {
    icon: Server,
    title: "Build & Distribuição",
    desc: "Empacote para PC, Mac, Linux, Web e Android — sem sofrer.",
    href: "/build",
    color: "bg-purple-400/10 text-purple-400",
  },
  {
    icon: Gamepad2,
    title: "Mini-games",
    desc: "Use Screens + Python para mini-puzzles dentro da VN.",
    href: "/minigames",
    color: "bg-pink-300/10 text-pink-300",
  },
  {
    icon: Heart,
    title: "Sistema de Afeição",
    desc: "Variáveis, flags e finais condicionais por personagem.",
    href: "/afeicao",
    color: "bg-rose-400/10 text-rose-400",
  },
  {
    icon: Flower2,
    title: "Projeto Final: Sakura Café",
    desc: "Uma VN completa rodável com sprites, música, escolhas e 3 finais.",
    href: "/projeto-final",
    color: "bg-fuchsia-400/10 text-fuchsia-400",
  },
];

const stats = [
  { value: "38+", label: "Tópicos" },
  { value: "100+", label: "Exemplos .rpy" },
  { value: "PT-BR", label: "Em Português" },
  { value: "Open", label: "Source · MIT" },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 pb-24">
      {/* Hero */}
      <div className="text-center mb-16 mt-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
          <Flower2 className="w-4 h-4" />
          Guia Completo em Português · Visual Novel · Ren'Py 8.x
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
          Crie Visual Novels{" "}
          <span className="text-primary">do Zero Absoluto</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Da primeira fala da heroína ao APK na Play Store. Aprenda Ren'Py com{" "}
          <strong className="text-foreground">exemplos práticos</strong> em ordem
          cronológica — você cria o sprite antes de aprender a animá-lo.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 max-w-2xl mx-auto">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-4 text-center"
            >
              <div className="text-3xl font-extrabold text-primary">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cartão de boas-vindas / Welcome */}
      <div className="mb-12 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-pink-500/5 to-accent/10 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 bg-primary/15 border-b border-primary/20">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold uppercase tracking-wider text-primary">
            O que é uma Visual Novel?
          </span>
        </div>
        <div className="p-6 space-y-3">
          <p className="text-sm text-foreground/90 leading-relaxed m-0">
            Uma <strong>Visual Novel (VN)</strong> é um jogo narrativo onde a
            história é o protagonista: você lê diálogos, vê os sprites dos
            personagens reagirem, ouve a trilha sonora e, em pontos chave,{" "}
            <strong>escolhe</strong> o caminho que a história vai seguir. Ren'Py
            é o motor open-source mais usado no mundo para criar VNs — feito em
            Python, gratuito, multiplataforma e gigante na cena indie japonesa,
            ocidental e LGBTQIA+.
          </p>
          <p className="text-sm text-foreground/90 leading-relaxed m-0">
            Este guia te leva da <strong>instalação do SDK</strong> até{" "}
            <strong>publicar uma VN completa</strong> — chamada{" "}
            <em>Sakura Café</em> — com sprites, música, sistema de afeição,
            múltiplos finais, GUI customizada e build para web/Android.
          </p>
        </div>
      </div>

      {/* Trilha */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Sua trilha de aprendizado
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((s, i) => {
            const Icon = s.icon;
            return (
              <Link href={s.href} key={i}>
                <div className="group bg-card border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
                  <div
                    className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1 text-sm mt-0 border-0">
                    {s.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {s.desc}
                  </p>
                  <div className="flex items-center gap-1 mt-3 text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Explorar <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-card border border-border rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-3 mt-0 border-0">
          Pronto para começar?
        </h2>
        <p className="text-muted-foreground mb-6">
          Mesmo se você nunca abriu um editor de código na vida, a primeira
          página foi feita para você.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/comece-aqui">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity">
              Começar do zero <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
          <Link href="/projeto-final">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-xl font-semibold hover:border-primary/40 transition-colors">
              <BookOpen className="w-4 h-4 text-primary" />
              Ver o projeto final (Sakura Café)
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
