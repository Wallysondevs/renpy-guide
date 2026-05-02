import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function ScreensEspeciais() {
  return (
    <PageContainer
      title="Screens Especiais — os reservados pela engine"
      subtitle="O Ren'Py procura screens com nomes específicos para renderizar diálogo (say), escolhas (choice), menu principal, save, load, preferências, notificações e o quick menu. Sobrescrever esses nomes é como você customiza TODA a UI do Sakura Café."
      difficulty="intermediario"
      timeToRead="18 min"
      prompt="screens/especiais"
    >
      <AlertBox type="info" title="Como o Ren'Py escolhe um screen?">
        Quando você escreve <code>s "Olá"</code>, a engine internamente
        chama <code>renpy.show_screen("say", who="Sakura", what="Olá")</code>.
        Se você definiu um <code>screen say():</code> próprio, o seu é
        usado. Caso contrário, cai no padrão de{" "}
        <code>screens.rpy</code> que o Launcher gerou. Ou seja:{" "}
        <strong>customizar a UI = redefinir os screens reservados</strong>.
      </AlertBox>

      <h2>1. Lista completa dos screens reservados</h2>

      <CommandTable
        title="Os 14 screens que o Ren'Py procura por nome"
        variations={[
          {
            cmd: "say",
            desc: "Renderiza UMA fala (caixa de diálogo + nome + texto + side image).",
            output: "Chamado por toda linha de diálogo do .rpy.",
          },
          {
            cmd: "choice",
            desc: "Renderiza um bloco menu: com escolhas como botões.",
            output: "Chamado por todo statement 'menu:'.",
          },
          {
            cmd: "input",
            desc: "Caixa de input para renpy.input() — captura texto do jogador.",
            output: 'renpy.input("Qual seu nome?")',
          },
          {
            cmd: "nvl",
            desc: "Modo NVL — texto de página inteira em vez de caixa.",
            output: "Ativado por Character(kind=nvl).",
          },
          {
            cmd: "main_menu",
            desc: "Tela inicial do jogo (Start / Load / Preferences / Quit).",
            output: "Aparece ao abrir o .exe.",
          },
          {
            cmd: "navigation",
            desc: "Sub-screen usada pelo main_menu e game_menu (botões laterais).",
            output: "use navigation dentro do main_menu.",
          },
          {
            cmd: "game_menu",
            desc: "Wrapper para save/load/preferences durante o jogo.",
            output: "Acionado por ESC ou ShowMenu().",
          },
          {
            cmd: "save",
            desc: "Tela de salvar partida (slots, thumbnail, data).",
            output: 'ShowMenu("save")',
          },
          {
            cmd: "load",
            desc: "Tela de carregar partida.",
            output: 'ShowMenu("load")',
          },
          {
            cmd: "preferences",
            desc: "Tela de configurações (volume, velocidade de texto, fullscreen).",
            output: 'ShowMenu("preferences")',
          },
          {
            cmd: "confirm",
            desc: "Caixa modal Sim/Não — usada por Confirm() Action.",
            output: "Confirm(...)",
          },
          {
            cmd: "quick_menu",
            desc: "Barra fixa no rodapé com Save/Load/Skip/Auto/Quick Save/Quick Load.",
            output: "Sempre visível durante diálogos.",
          },
          {
            cmd: "notify",
            desc: "Toast de notificação no canto da tela.",
            output: 'Notify("Salvo!") usa esse screen.',
          },
          {
            cmd: "skip_indicator",
            desc: "Ícone que aparece enquanto o jogador segura Ctrl (skip).",
            output: "Mostrado automaticamente.",
          },
        ]}
      />

      <h2>2. <code>say</code> — a caixa de diálogo do Sakura Café</h2>
      <p>
        O <code>say</code> recebe os parâmetros <code>who</code> (nome ou
        objeto Character) e <code>what</code> (texto da fala). Customize
        para deixar a caixa rosa pastel com borda de pétalas.
      </p>

      <CodeBlock
        title="game/screens.rpy"
        language="python"
        code={`screen say(who, what):
    style_prefix "say"

    window:
        id "window"
        background "images/ui/textbox_sakura.png"

        if who is not None:
            window:
                id "namebox"
                style "namebox"
                text who id "who" style "say_label"

        text what id "what"

    # Side image opcional (busto da Sakura à esquerda)
    if not renpy.variant("small"):
        add SideImage() xalign 0.0 yalign 1.0

style window:
    background Frame("images/ui/textbox_sakura.png", 30, 30)
    xalign 0.5 yalign 1.0
    xsize 1280 ysize 220
    padding (40, 20)

style say_label:
    color "#ff5599"
    size 32
    font "fonts/cinzel.ttf"

style say_dialogue:
    color "#fff"
    size 24
    line_spacing 4`}
      />

      <h2>3. <code>choice</code> — as escolhas do menu</h2>

      <CodeBlock
        title="game/screens.rpy"
        language="python"
        code={`screen choice(items):
    style_prefix "choice"

    vbox:
        xalign 0.5 yalign 0.5 spacing 12

        for i in items:
            textbutton i.caption:
                action i.action
                hovered Play("sound", "audio/hover.ogg")

style choice_button:
    background Frame("images/ui/btn_choice_idle.png", 12, 12)
    hover_background Frame("images/ui/btn_choice_hover.png", 12, 12)
    xsize 600 ysize 60
    padding (20, 12)

style choice_button_text:
    color "#fff" hover_color "#ffaacc"
    size 26 xalign 0.5`}
      />

      <p>
        No script você usa normal:
      </p>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`label menu_cafe:
    s "O que você quer pedir?"

    menu:
        "Cappuccino tradicional":
            jump pedir_cappuccino
        "Latte com matcha":
            jump pedir_matcha
        "Só água, obrigado":
            jump nada`}
      />

      <h2>4. <code>main_menu</code> e <code>navigation</code></h2>

      <CodeBlock
        title="game/screens.rpy"
        language="python"
        code={`screen main_menu():
    tag menu

    add "images/ui/main_bg_sakura.png"
    add "images/ui/petalas.webp" at flutuar

    frame:
        xalign 0.0 yalign 0.5
        background None
        padding (60, 40)

        vbox spacing 16:
            text "Sakura Café" size 80 color "#ff7799" font "fonts/cinzel.ttf"
            text "Uma história de inverno" size 24 color "#fff8" italic True

            null height 30

            use navigation

screen navigation():
    vbox spacing 12:
        textbutton "Começar" action Start()
        textbutton "Continuar" action ShowMenu("load")
        textbutton "Configurações" action ShowMenu("preferences")
        textbutton "Sobre" action ShowMenu("about")
        textbutton "Sair" action Quit(confirm=True)`}
      />

      <h2>5. <code>save</code> e <code>load</code></h2>

      <CodeBlock
        title="game/screens.rpy"
        language="python"
        code={`screen file_slots(title):
    default page_name_value = FilePageNameInputValue(pattern=_("Página {}"), auto=_("Auto-save"), quick=_("Quick save"))

    use game_menu(title):

        fixed:
            order_reverse True

            # Grid de slots (3 colunas x 2 linhas)
            grid 3 2:
                style_prefix "slot"
                xalign 0.5 yalign 0.5 spacing 16

                for i in range(6):
                    $ slot = i + 1
                    button:
                        action FileAction(slot)
                        has vbox

                        add FileScreenshot(slot) xalign 0.5
                        text FileTime(slot, format=_("{#file_time}%A, %d %B %Y, %H:%M"), empty=_("vazio")) size 14
                        text FileSaveName(slot) size 16

screen save():
    tag menu
    use file_slots(_("Salvar"))

screen load():
    tag menu
    use file_slots(_("Carregar"))`}
      />

      <h2>6. <code>preferences</code></h2>

      <CodeBlock
        title="game/screens.rpy"
        language="python"
        code={`screen preferences():
    tag menu

    use game_menu(_("Preferências")):
        vbox spacing 20 xalign 0.5:

            # Display
            hbox spacing 16:
                label _("Display:")
                textbutton _("Tela cheia") action Preference("display", "fullscreen")
                textbutton _("Janela") action Preference("display", "window")

            # Velocidade do texto
            label _("Velocidade do texto")
            bar value Preference("text speed") xsize 400

            # Volume música/sfx/voz
            label _("Música")
            bar value Preference("music volume") xsize 400
            label _("Efeitos")
            bar value Preference("sound volume") xsize 400
            label _("Voz")
            bar value Preference("voice volume") xsize 400`}
      />

      <h2>7. <code>quick_menu</code> e <code>notify</code></h2>

      <CodeBlock
        title="game/screens.rpy"
        language="python"
        code={`screen quick_menu():
    zorder 100
    if quick_menu:
        hbox:
            yalign 1.0 xalign 0.5 spacing 8

            textbutton _("Voltar") action Rollback()
            textbutton _("Histórico") action ShowMenu('history')
            textbutton _("Pular") action Skip() alternate Skip(fast=True, confirm=True)
            textbutton _("Auto") action Preference("auto-forward", "toggle")
            textbutton _("Salvar") action ShowMenu('save')
            textbutton _("Q.Save") action QuickSave()
            textbutton _("Q.Load") action QuickLoad()
            textbutton _("Pref") action ShowMenu('preferences')

screen notify(message):
    zorder 100
    text message:
        xalign 0.5 yalign 0.05
        background "#000c"
        padding (20, 10)
        color "#fff"
    timer 3.25 action Hide('notify')`}
      />

      <h2>8. Como sobrescrever sem quebrar</h2>
      <p>
        O <code>screens.rpy</code> gerado pelo Launcher é a <em>fonte da
        verdade</em> dos defaults. Sobrescrever um screen lá já é o
        suficiente — não precisa importar nem registrar nada.
      </p>

      <AlertBox type="warning" title="NUNCA delete o screens.rpy padrão">
        Se você deletar, o jogo crasha em <code>main_menu</code> não
        encontrado. Apenas EDITE os screens que você quer customizar e
        deixe os outros intactos. Para resetar, abra um projeto novo no
        Launcher e copie só o <code>screens.rpy</code> dele.
      </AlertBox>

      <Terminal
        path="~/projetos/sakura-cafe"
        user="dev"
        host="vn-studio"
        lines={[
          {
            comment: "lint avisa quando um screen reservado está faltando ou tem assinatura errada",
            cmd: "renpy.exe . lint",
            out: `game/screens.rpy: warning: screen 'say' has unexpected signature.
  Expected: say(who, what)
  Got:      say(who)

Statistics:
  Reserved screens defined: 13/14 (missing: skip_indicator)
Lint took 0.62s.`,
            outType: "warning",
          },
        ]}
      />

      <OutputBlock label="diagrama — quem chama qual screen reservado" type="info">
{`Toda fala .rpy        →   say(who, what)
Statement menu:       →   choice(items)
renpy.input(...)      →   input(prompt)
Character(kind=nvl)   →   nvl
Abrir o .exe          →   main_menu  →  navigation
ESC durante o jogo    →   game_menu  →  save | load | preferences
ShowMenu("save")      →   save
Confirm(...) action   →   confirm(message, yes_action, no_action)
Notify("...") func    →   notify(message)
Ctrl segurado         →   skip_indicator`}
      </OutputBlock>

      <PracticeBox
        title="Customize a caixa de diálogo do Sakura Café"
        goal="Sobrescrever o screen 'say' para mudar cor do nome para rosa pastel e font da fala para uma serifada."
        steps={[
          "Abra game/screens.rpy do projeto.",
          "Encontre o 'screen say(who, what):' já existente (gerado pelo Launcher).",
          "Mude o style 'say_label' (nome do personagem) para color '#ff5599' e size 32.",
          "Mude o style 'say_dialogue' para color '#fff', size 24, line_spacing 4.",
          "Salve, rode o projeto: a primeira fala deve aparecer com o novo visual.",
        ]}
        verify="Ao iniciar o jogo, o nome do personagem aparece em rosa forte e a fala em branco maior, com mais espaçamento entre linhas."
      >
        <CodeBlock
          title="game/screens.rpy (estilos modificados)"
          language="python"
          code={`style say_label:
    color "#ff5599"
    size 32
    bold True

style say_dialogue:
    color "#ffffff"
    size 24
    line_spacing 4`}
        />
      </PracticeBox>

      <AlertBox type="success" title="Próximo passo">
        Você agora controla as 14 telas que o Ren'Py mostra. Veja{" "}
        <strong>Screen Optimization</strong> para evitar lag em screens com
        muitos elementos (HUD do café com 20+ ingredientes, por exemplo).
      </AlertBox>
    </PageContainer>
  );
}
