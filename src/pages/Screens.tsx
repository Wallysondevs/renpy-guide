import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Screens() {
  return (
    <PageContainer
      title="Screens — Screen Language do Ren'Py"
      subtitle="vbox, hbox, frame, text, imagebutton, textbutton, add, use, transclude — a linguagem declarativa que constrói TODA a interface da sua VN, do diálogo ao menu de Save."
      difficulty="avancado"
      timeToRead="25 min"
      prompt="interface/screens"
    >
      <AlertBox type="info" title="Tudo que tem pixel na tela é uma screen">
        O diálogo (<code>screen say</code>), as escolhas (
        <code>screen choice</code>), o menu Save/Load, o menu principal, a
        barra de notificação — TODOS são <em>screens</em> definidas em{" "}
        <code>game/screens.rpy</code>. Aprender a Screen Language é o que
        separa um projeto que parece template de uma VN com personalidade.
      </AlertBox>

      <h2>1. Estrutura de uma screen</h2>
      <p>
        Uma screen é declarada com <code>screen nome(parametros):</code> e
        contém widgets indentados. Para mostrá-la usa-se{" "}
        <code>show screen nome</code> ou <code>call screen nome</code>. A
        diferença: <code>call</code> bloqueia o fluxo até a screen retornar
        algo (clique num botão).
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy — screen mínima"
        code={`screen ola_sakura():
    frame:
        xalign 0.5
        yalign 0.5
        padding (40, 30)

        vbox:
            spacing 12
            text "Bem-vindo ao Sakura Café!" size 36
            text "Pressione Enter para começar." size 22

        key "K_RETURN" action Return()`}
      />

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          { comment: "para usar dentro do script.rpy", cmd: "cat game/script.rpy", out: `label start:
    call screen ola_sakura
    s "Vamos abrir as portas?"
    return`, outType: "info" },
        ]}
      />

      <h2>2. Containers — vbox, hbox, grid, frame</h2>
      <CommandTable
        title="Os 6 containers que você usa todo dia"
        variations={[
          { cmd: "vbox", desc: "Empilha widgets na vertical (de cima para baixo).", output: "Use para listas, menus de pausa, formulários." },
          { cmd: "hbox", desc: "Empilha na horizontal.", output: "Botões lado a lado, status bar." },
          { cmd: "frame", desc: "Caixa com background, borda e padding.", output: "Painel de info, modal." },
          { cmd: "grid cols rows", desc: "Distribui widgets numa malha.", output: "grid 4 3: 12 slots de save 4×3." },
          { cmd: "fixed", desc: "Posiciona filhos por coordenada absoluta (xpos/ypos).", output: "Usado para HUDs com sobreposição." },
          { cmd: "viewport", desc: "Área rolável.", output: "Lista de saves longa, log de mensagens." },
        ]}
      />

      <CodeBlock
        language="python"
        title="game/screens.rpy — HUD de status (afeição + dinheiro)"
        code={`screen status_hud():
    zorder 100   ## sempre acima do diálogo

    frame:
        background "#00000099"
        xalign 0.02
        yalign 0.02
        padding (16, 10)

        hbox:
            spacing 24
            text "Sakura: [afeicao_sakura]" size 22 color "#ffaacc"
            text "Yuki: [afeicao_yuki]"     size 22 color "#7fc8ff"
            text "Y [dinheiro]"              size 22 color "#ffd24d"`}
      />

      <h2>3. Widgets de exibição — text, add, bar</h2>
      <CodeBlock
        language="python"
        title="game/screens.rpy — exemplos de widgets"
        code={`screen exemplos():
    vbox:
        spacing 16

        ## Texto simples (suporta tags {b}, {i}, {color=...}, {size=...}).
        text "Olá, {b}Sakura{/b}!" size 32

        ## Imagem (qualquer Displayable: arquivo, Solid, Composite).
        add "images/logo.png" xalign 0.5
        add Solid("#ff86b0", xsize=200, ysize=4)

        ## Barra de progresso ligada a uma variável.
        bar value AnimatedValue(afeicao_sakura, 100, 0.5):
            xsize 320
            left_bar "gui/bar/heart_full.png"
            right_bar "gui/bar/heart_empty.png"`}
      />

      <h2>4. Botões — textbutton e imagebutton</h2>
      <p>
        Cada botão precisa de um <code>action</code>. As actions mais comuns
        são <code>Return(valor)</code>, <code>Jump("label")</code>,{" "}
        <code>Show("screen")</code>, <code>Hide("screen")</code>,{" "}
        <code>SetVariable("nome", valor)</code>,{" "}
        <code>Function(callable, args)</code>,{" "}
        <code>NullAction()</code> (botão clicável sem efeito).
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy — menu de escolhas customizado"
        code={`screen menu_escolhas(escolhas):
    style_prefix "choice"

    frame:
        xalign 0.5
        ypos 0.7
        background "gui/menu_bg.png"
        padding (40, 30)

        vbox:
            spacing 14

            for i in escolhas:
                textbutton i.caption:
                    action i.action
                    text_size 28
                    text_idle_color "#ffe0ec"
                    text_hover_color "#ff86b0"
                    hover_sound "audio/click.ogg"`}
      />

      <CodeBlock
        language="python"
        title="game/screens.rpy — imagebutton (usa imagens em vez de texto)"
        code={`screen botao_quitar():
    imagebutton:
        idle  "gui/button/quit_idle.png"
        hover "gui/button/quit_hover.png"
        focus_mask True
        action Quit(confirm=True)
        xpos 1820 ypos 20`}
      />

      <CommandTable
        title="As 14 actions mais usadas"
        variations={[
          { cmd: "Return(valor)", desc: "Encerra a screen e devolve o valor.", output: "Saída padrão de menus." },
          { cmd: "Jump('label')", desc: "Pula para um label do script.", output: "Funciona como o jump da .rpy." },
          { cmd: "Call('label')", desc: "Chama label e volta com return.", output: "Usar com cuidado dentro de screens persistentes." },
          { cmd: "Show('tela')", desc: "Mostra outra screen sem fechar a atual.", output: "Modal sobre HUD." },
          { cmd: "Hide('tela')", desc: "Esconde uma screen específica.", output: "Hide('status_hud')." },
          { cmd: "ShowMenu('save')", desc: "Abre o menu interno (Save/Load/etc).", output: "Equivalente ao botão do textbox." },
          { cmd: "SetVariable('x', v)", desc: "Define uma variável global.", output: "SetVariable('flag_visitou', True)." },
          { cmd: "ToggleVariable('x')", desc: "Inverte um booleano.", output: "Bom para checkbox." },
          { cmd: "Preference('text speed', 1.0)", desc: "Mexe nas preferências.", output: "Rebobinar UX." },
          { cmd: "MainMenu()", desc: "Volta ao menu principal.", output: "Confirma se confirm=True." },
          { cmd: "Quit(confirm=True)", desc: "Fecha o jogo.", output: "Pede confirmação." },
          { cmd: "Skip()", desc: "Liga/desliga o modo skip.", output: "Botão na statusbar." },
          { cmd: "AutoForward()", desc: "Liga o auto-play.", output: "Bom para visual novel passiva." },
          { cmd: "NullAction()", desc: "Botão clicável sem ação.", output: "Útil para receber foco e exibir tooltip." },
        ]}
      />

      <h2>5. Reaproveitando — use e transclude</h2>
      <p>
        Você pode chamar uma screen dentro de outra com <code>use</code> — é
        como um partial. Quando o "filho" precisa receber conteúdo, use{" "}
        <code>transclude</code> dentro do template.
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy — template + transclude"
        code={`## Template reutilizável: caixa rosa com título.
screen painel_rosa(titulo="Sakura Café"):
    frame:
        background "#3a1d2c"
        padding (24, 20)
        xalign 0.5 yalign 0.5

        vbox:
            spacing 10
            text titulo size 32 color "#ff86b0"
            null height 8
            transclude          ## ← aqui entra o conteúdo de quem usar

## Quem consome só preenche o miolo:
screen confirmacao_pedido():
    use painel_rosa("Confirmar pedido"):
        text "Latte com leite de aveia, certo?" size 22
        hbox:
            spacing 12
            textbutton "Sim"  action Return(True)
            textbutton "Não" action Return(False)`}
      />

      <h2>6. Customizando a screen 'say' (textbox de diálogo)</h2>
      <p>
        Esta é a tela mais importante da VN. Por padrão o Ren'Py gera uma
        decente — mas você pode reescrever por completo. Mantenha a assinatura{" "}
        <code>screen say(who, what)</code>:
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy — screen say customizada"
        code={`screen say(who, what):
    style_prefix "say"

    window:
        id "window"
        background Image("gui/textbox.png", xalign=0.5, yalign=1.0)

        if who is not None:
            window:
                id "namebox"
                style "namebox"
                text who id "who"

        text what id "what"

    ## Sprite lateral (side image) no canto inferior esquerdo.
    if not renpy.variant("small"):
        add SideImage() xalign 0.0 yalign 1.0`}
      />

      <h2>7. Tela de status com inventário (exemplo completo)</h2>
      <CodeBlock
        language="python"
        title="game/screens.rpy — tela acessada via tecla I"
        code={`default inventario = ["Croissant", "Caderno de receitas", "Chave do café"]

screen status_completo():
    modal True
    zorder 200

    frame:
        background "#1a0d14ee"
        xalign 0.5 yalign 0.5
        xsize 720 ysize 540
        padding (32, 28)

        vbox:
            spacing 18

            text "Status — [persistent.nome_jogador]" size 36 color "#ff86b0"

            hbox:
                spacing 30
                vbox:
                    text "Afeição" size 22 color "#aaaaaa"
                    text "Sakura: [afeicao_sakura] / 100" size 22
                    text "Yuki:   [afeicao_yuki] / 100"   size 22
                    text "Akira:  [afeicao_akira] / 100"  size 22

                vbox:
                    text "Mochila" size 22 color "#aaaaaa"
                    for item in inventario:
                        text "- [item]" size 20

            null height 10

            textbutton "Fechar" action Hide("status_completo") xalign 1.0

    key "K_ESCAPE" action Hide("status_completo")
    key "i"        action Hide("status_completo")`}
      />

      <PracticeBox
        title="Adicionar tecla I para abrir o status"
        goal="Ligar a screen 'status_completo' a uma tecla global."
        steps={[
          "Abra game/screens.rpy e cole a screen acima ao final.",
          "Abra game/script.rpy e adicione um init python: que registra a tecla.",
          "Salve, pressione Shift+R no jogo e teste pressionando I durante um diálogo.",
        ]}
      >
        <CodeBlock
          language="python"
          title="game/script.rpy"
          code={`init python:
    config.keymap['inventory'] = ['i', 'I']

    def _open_status():
        renpy.show_screen('status_completo')

    config.underlay.append(
        renpy.Keymap(inventory=_open_status)
    )`}
        />
      </PracticeBox>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          { comment: "lint avisa de screens com erro", cmd: "renpy.exe . lint", out: `Lint is checking sakura-cafe...
screens.rpy:42: warning: missing 'modal True' on full-screen overlay
Statistics: 18 screens, 312 dialogue blocks.`, outType: "warning" },
        ]}
      />

      <OutputBlock label="hierarquia visual de screens (zorder)" type="info">
{`zorder  0  -> screens "say" (diálogo)
zorder  1  -> choice
zorder 10  -> notify (notificação "Salvo no slot 1")
zorder 100 -> status_hud (HUD persistente)
zorder 200 -> status_completo (modal sobre tudo)
zorder MAX -> confirm (modal de confirmação do sistema)`}
      </OutputBlock>

      <AlertBox type="warning" title="Variáveis dentro de screens são perigosas">
        Não declare variáveis comuns dentro de uma screen — elas são
        re-avaliadas a cada frame. Use <code>default</code> em escopo global
        (init) e leia dentro da screen. Para estado local, use{" "}
        <code>SetScreenVariable</code>.
      </AlertBox>

      <AlertBox type="info" title="Screens são o coração do Ren'Py moderno">
        A partir do Ren'Py 7, a equipe migrou TUDO para Screen Language —
        inclusive o sistema de Save/Load. Se você dominar isto, qualquer telinha
        de mini-game, inventário, mapa ou diário vira meia hora de trabalho.
      </AlertBox>
    </PageContainer>
  );
}
