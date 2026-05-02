import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function AdvancedGUI() {
  return (
    <PageContainer
      title="GUI avançado — temas, breakpoints e cores globais"
      subtitle="O arquivo gui.rpy controla TODA a aparência do jogo via variáveis globais (gui.text_color, gui.accent_color, gui.idle_color). Aprenda a montar um tema 'café diurno' e 'café noturno', adaptar para mobile e exportar skins reutilizáveis."
      difficulty="avancado"
      timeToRead="20 min"
      prompt="ui/advanced-gui"
    >
      <AlertBox type="info" title="O que é o gui.rpy">
        Quando você cria um projeto, o Ren'Py gera{" "}
        <code>game/gui.rpy</code> com ~80 variáveis globais. TODOS os{" "}
        <code>screen</code> e <code>style</code> padrões leem dessas
        variáveis em vez de cores hardcoded. Por isso, mudar 5 linhas em{" "}
        <code>gui.rpy</code> redesenha o jogo inteiro — incluindo menu,
        save/load, preferências e textbox.
      </AlertBox>

      <h2>1. Anatomia do gui.rpy</h2>

      <CodeBlock
        language="python"
        title="game/gui.rpy — seções principais"
        code={`init offset = -2

##############################################################################
## CORES GLOBAIS — referenciadas por todos os screens default
##############################################################################
define gui.accent_color       = "#ffaacc"   # cor de destaque (hover, links)
define gui.idle_color         = "#a8336c"   # cor padrão de itens
define gui.idle_small_color   = "#7a2550"   # cor padrão de itens pequenos
define gui.hover_color        = "#fff"      # cor no hover
define gui.selected_color     = "#ffd700"   # cor selecionada
define gui.insensitive_color  = "#80808080" # desabilitado (com alpha)

define gui.text_color         = "#5a1a3a"   # cor do texto principal
define gui.interface_text_color = "#ffaacc" # textos de UI (botões, labels)

define gui.muted_color        = "#3d1126"   # cor "apagada"
define gui.hover_muted_color  = "#5a1a3a"

##############################################################################
## FONTES
##############################################################################
define gui.text_font      = "fonts/NotoSansJP.ttf"   # texto comum
define gui.name_text_font = "fonts/Mochiy.ttf"       # nome do personagem
define gui.interface_text_font = "fonts/NotoSansJP.ttf"
define gui.glyph_font     = "DejaVuSans.ttf"         # ícones unicode

##############################################################################
## TAMANHOS
##############################################################################
define gui.text_size            = 24
define gui.name_text_size       = 32
define gui.interface_text_size  = 22
define gui.label_text_size      = 28
define gui.notify_text_size     = 18
define gui.title_text_size      = 60

##############################################################################
## TEXTBOX (caixa de fala)
##############################################################################
define gui.textbox_height = 220
define gui.textbox_yalign = 1.0
define gui.name_xpos = 360
define gui.name_ypos = 0
define gui.name_xalign = 0.0
define gui.dialogue_xpos = 402
define gui.dialogue_ypos = 75
define gui.dialogue_width = 1116
define gui.dialogue_text_outlines = [(2, "#000c", 0, 0), (1, "#000c", 0, 0)]`}
      />

      <h2>2. As variáveis mais importantes (e o que cada uma faz)</h2>

      <CommandTable
        title="Top variáveis do gui.rpy"
        variations={[
          { cmd: "gui.accent_color", desc: "Cor 'destaque' usada em hover, links, botões ativos.", output: "gui.accent_color = '#ffaacc'" },
          { cmd: "gui.idle_color", desc: "Cor padrão de itens (botões em estado normal).", output: "gui.idle_color = '#a8336c'" },
          { cmd: "gui.hover_color", desc: "Cor no hover do mouse.", output: "gui.hover_color = '#fff'" },
          { cmd: "gui.selected_color", desc: "Cor de item selecionado (toggle, abas).", output: "gui.selected_color = '#ffd700'" },
          { cmd: "gui.text_color", desc: "Cor padrão de texto narrativo (diálogo).", output: "gui.text_color = '#5a1a3a'" },
          { cmd: "gui.interface_text_color", desc: "Texto de UI (não diálogo).", output: "gui.interface_text_color = '#ffaacc'" },
          { cmd: "gui.text_font", desc: "Fonte do texto principal.", output: "gui.text_font = 'fonts/Noto.ttf'" },
          { cmd: "gui.name_text_font", desc: "Fonte do NOME do personagem.", output: "gui.name_text_font = 'fonts/Mochiy.ttf'" },
          { cmd: "gui.text_size", desc: "Tamanho do texto narrativo em px.", output: "gui.text_size = 24" },
          { cmd: "gui.textbox_height", desc: "Altura da caixa de fala em px.", output: "gui.textbox_height = 220" },
          { cmd: "gui.dialogue_xpos / dialogue_ypos", desc: "Posição do TEXTO dentro da textbox.", output: "gui.dialogue_xpos = 402" },
          { cmd: "gui.name_xpos / name_ypos", desc: "Posição do NOME dentro da textbox.", output: "gui.name_xpos = 360" },
          { cmd: "gui.button_width / button_height", desc: "Tamanho padrão dos botões da UI.", output: "gui.button_width = None  # auto" },
          { cmd: "gui.choice_button_width", desc: "Largura dos botões do menu de escolhas.", output: "gui.choice_button_width = 790" },
          { cmd: "gui.notify_text_size", desc: "Tamanho do texto da Notify().", output: "gui.notify_text_size = 18" },
          { cmd: "gui.history_height", desc: "Altura da janela de histórico de diálogo.", output: "gui.history_height = 210" },
          { cmd: "gui.slot_button_width", desc: "Largura de cada slot na tela de save/load.", output: "gui.slot_button_width = 414" },
          { cmd: "gui.file_slot_cols / rows", desc: "Grid de slots de save (cols × rows = qtd).", output: "gui.file_slot_cols = 3" },
        ]}
      />

      <h2>3. Tema 'café diurno' vs 'café noturno' — switch em runtime</h2>
      <p>
        O grande poder do gui.rpy é que tudo é variável Python. Você pode
        criar uma função que troca o tema inteiro do café — claro durante
        o dia, escuro à noite, sem reiniciar o jogo.
      </p>

      <CodeBlock
        language="python"
        title="game/themes.rpy"
        code={`init python:

    TEMA_DIURNO = {
        "accent_color":     "#ffaacc",
        "idle_color":       "#a8336c",
        "hover_color":      "#5a1a3a",
        "text_color":       "#3d1126",
        "interface_text_color": "#a8336c",
        "muted_color":      "#cccccc",
        "background_overlay": "#fff5fa",
    }

    TEMA_NOTURNO = {
        "accent_color":     "#ff77aa",
        "idle_color":       "#ffaacc",
        "hover_color":      "#fff",
        "text_color":       "#ffe6f0",
        "interface_text_color": "#ffaacc",
        "muted_color":      "#444",
        "background_overlay": "#1a0612",
    }

    def aplicar_tema(t):
        for k, v in t.items():
            setattr(gui, k, v)
        renpy.style.rebuild()      # força regenerar todos os styles
        renpy.restart_interaction()

# Ações para a tela de preferências
default persistent.tema_atual = "diurno"

label trocar_tema:
    if persistent.tema_atual == "diurno":
        $ aplicar_tema(TEMA_NOTURNO)
        $ persistent.tema_atual = "noturno"
    else:
        $ aplicar_tema(TEMA_DIURNO)
        $ persistent.tema_atual = "diurno"
    return`}
      />

      <CodeBlock
        language="python"
        title="game/screens.rpy — botão na tela de preferências"
        code={`screen preferences():
    tag menu

    use game_menu(_("Preferências"), scroll="viewport"):
        vbox:
            hbox:
                label _("Tema visual")
                textbutton _("Diurno") action [SetField(persistent, "tema_atual", "diurno"),
                                                Function(aplicar_tema, TEMA_DIURNO)]
                textbutton _("Noturno") action [SetField(persistent, "tema_atual", "noturno"),
                                                 Function(aplicar_tema, TEMA_NOTURNO)]`}
      />

      <h2>4. Breakpoints — adaptando para mobile</h2>
      <p>
        Em telas pequenas (Android, iOS) você quer texto maior, botões
        mais espaçados, textbox mais alta. O Ren'Py NÃO tem media queries
        prontas, mas você pode detectar plataforma e ajustar o gui no
        boot:
      </p>

      <CodeBlock
        language="python"
        title="game/gui.rpy — adaptação por dispositivo"
        code={`init python:
    import renpy

    if renpy.android or renpy.ios:
        # Mobile — aumenta tudo
        gui.text_size           = 32
        gui.name_text_size      = 40
        gui.interface_text_size = 28
        gui.button_text_size    = 28
        gui.textbox_height      = 320
        gui.choice_button_width = 1000
        gui.dialogue_xpos       = 80
        gui.dialogue_width      = 1760
    elif renpy.variant("small"):
        # Tablet pequeno
        gui.text_size           = 26
        gui.textbox_height      = 240
    # else: usa os defaults declarados em define`}
      />

      <CommandTable
        title="renpy.variant() — variantes detectadas"
        variations={[
          { cmd: "renpy.variant('pc')", desc: "Desktop (Windows/Mac/Linux).", output: "True em PC" },
          { cmd: "renpy.variant('mobile')", desc: "Android ou iOS.", output: "True em mobile" },
          { cmd: "renpy.variant('touch')", desc: "Tela tátil.", output: "True em phones, tablets, ChromeOS" },
          { cmd: "renpy.variant('small')", desc: "Tela pequena (< 800x500).", output: "True em phones" },
          { cmd: "renpy.variant('medium')", desc: "Tela média (tablet).", output: "True em tablets" },
          { cmd: "renpy.variant('large')", desc: "Tela grande (desktop).", output: "True em PC" },
          { cmd: "renpy.variant('tv')", desc: "Console / TV (Android TV).", output: "True em Android TV" },
        ]}
      />

      <h2>5. Variantes de screen — código diferente por plataforma</h2>

      <CodeBlock
        language="python"
        title="game/screens.rpy"
        code={`# Versão padrão (desktop)
screen quick_menu():
    zorder 100
    if quick_menu:
        hbox:
            xalign 0.5  yalign 0.99
            spacing 12
            textbutton _("Voltar") action Rollback()
            textbutton _("Histórico") action ShowMenu("history")
            textbutton _("Skip") action Skip() alternate Skip(fast=True, stop_at_skip=True)
            textbutton _("Auto") action Preference("auto-forward", "toggle")
            textbutton _("Save") action ShowMenu("save")
            textbutton _("Q.Save") action QuickSave()
            textbutton _("Q.Load") action QuickLoad()
            textbutton _("Pref") action ShowMenu("preferences")

# Versão MOBILE — botões maiores, menos itens
screen quick_menu():
    variant "mobile"
    zorder 100
    if quick_menu:
        hbox:
            xalign 0.5  yalign 0.985
            spacing 24
            textbutton _("←") action Rollback() text_size 36
            textbutton _("☰") action ShowMenu() text_size 36
            textbutton _("⏵⏵") action Skip() text_size 36`}
      />

      <h2>6. Regenerar a aparência sem reiniciar</h2>

      <Terminal
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Atalhos no jogo (modo developer)",
            cmd: "# SHIFT+R reload | SHIFT+I style inspector | SHIFT+G test gui",
            out: `Hot-reload: gui.rpy alterado, regenerando 142 styles...
Styles rebuilt in 0.18s
Interaction restarted.`,
            outType: "success",
          },
        ]}
      />

      <h2>7. Skins — gui_<em>nome</em>.rpy</h2>
      <p>
        Você pode separar TEMAS em arquivos opcionais que o jogador (ou o
        dev em build de demo) ativa. Crie <code>game/gui_xmas.rpy</code>{" "}
        com overrides de natal — vermelho, verde, fonte natalina:
      </p>

      <CodeBlock
        language="python"
        title="game/gui_xmas.rpy"
        code={`init 1 python:
    if persistent.skin == "xmas":
        gui.accent_color = "#c0392b"
        gui.idle_color   = "#27ae60"
        gui.text_color   = "#fff"
        gui.text_font    = "fonts/MountainsOfChristmas.ttf"
        gui.textbox_image = "gui/xmas_textbox.png"

# Permite o jogador trocar
default persistent.skin = "default"

screen escolher_skin():
    vbox xalign 0.5 yalign 0.5 spacing 16:
        textbutton "Padrão" action [SetField(persistent, "skin", "default"),
                                     Function(renpy.utter_restart)]
        textbutton "Natal"  action [SetField(persistent, "skin", "xmas"),
                                     Function(renpy.utter_restart)]
        textbutton "Hallow" action [SetField(persistent, "skin", "halloween"),
                                     Function(renpy.utter_restart)]`}
      />

      <PracticeBox
        title="Adicione um botão 'Modo Noturno' nas preferências"
        goal="Criar um toggle que muda gui.text_color e gui.accent_color em runtime, persistindo entre sessões."
        steps={[
          "Em game/themes.rpy crie dois dicionários TEMA_DIURNO e TEMA_NOTURNO com 4 cores cada.",
          "Crie a função aplicar_tema(t) que faz setattr(gui, k, v) para cada chave.",
          "Adicione 'default persistent.tema = \"diurno\"'.",
          "Em screens.rpy preferences(): adicione 2 textbuttons que chamam SetField + Function(aplicar_tema, ...).",
          "No início de game/script.rpy adicione 'init python: aplicar_tema(TEMA_DIURNO if persistent.tema=='diurno' else TEMA_NOTURNO)'.",
        ]}
        verify="Ao abrir Preferências e clicar 'Noturno', a cor de fundo da textbox e dos botões muda imediatamente, sem reiniciar."
      />

      <OutputBlock label="estrutura de arquivos com gui customizado" type="info">
{`game/
├── gui.rpy            ← variáveis padrão
├── gui_overrides.rpy  ← override para mobile (init 1)
├── themes.rpy         ← dicionários e função aplicar_tema
├── screens.rpy        ← screens default
└── ui/
    ├── menu_principal.rpy
    └── inventario.rpy`}
      </OutputBlock>

      <AlertBox type="warning" title="rebuild() é OBRIGATÓRIO depois de mexer no gui">
        Se você só fizer <code>gui.text_color = "#fff"</code> sem chamar{" "}
        <code>renpy.style.rebuild()</code>, os styles JÁ instanciados não
        atualizam. Sempre chame rebuild + restart_interaction depois de
        mudar variáveis globais em runtime.
      </AlertBox>

      <AlertBox type="success" title="Próximo">
        Para o resto da configuração GLOBAL do jogo (nome, versão,
        save_directory, gl2, layers), vá para a página{" "}
        <strong>Configuração</strong>.
      </AlertBox>
    </PageContainer>
  );
}
