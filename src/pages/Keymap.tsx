import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Keymap() {
  return (
    <PageContainer
      title="Keymap — atalhos e teclas custom"
      subtitle="config.keymap, Action Keymap(), atalhos próprios (H esconde HUD, P abre cardápio do Sakura Café), gamepad e como sobrescrever os defaults sem quebrar a engine."
      difficulty="intermediario"
      timeToRead="14 min"
      prompt="ui/keymap"
    >
      <AlertBox type="info" title="Por que mexer com keymap">
        O Ren'Py vem com 30+ atalhos default (Space avança, Ctrl pula,
        Esc abre menu...). Quando seu jogo tem mecânicas próprias —
        cardápio do café, modo "esconder UI para screenshot", troca de
        idioma rápida — você precisa registrar suas próprias teclas. O
        sistema é via <code>config.keymap</code> (dict global) e{" "}
        <code>Keymap()</code> Action (em screens específicos).
      </AlertBox>

      <h2>1. Os 2 caminhos: <code>config.keymap</code> vs <code>Keymap()</code></h2>

      <CommandTable
        title="Quando usar cada"
        variations={[
          {
            cmd: "config.keymap[name] = [keys]",
            desc: "ATALHO GLOBAL — funciona em qualquer tela.",
            output: 'config.keymap["screenshot"] = ["s", "K_F12"]',
          },
          {
            cmd: "key 'h' action ...",
            desc: "Local a 1 screen — só funciona enquanto este screen ativo.",
            output: "Em screen game_hud:",
          },
          {
            cmd: "Keymap(name=fn)",
            desc: "Action que pode ser usada como ação de qualquer keymap.",
            output: 'Keymap(toggle_hud=ToggleVar("hud_on"))',
          },
        ]}
      />

      <h2>2. Adicionando atalhos globais</h2>

      <CodeBlock
        language="python"
        title="game/options.rpy ou game/keymap.rpy"
        code={`# config.keymap é um dict: nome_da_acao → lista de teclas
init python:
    # Tirar screenshot com PrintScreen E F12 (default só PrintScreen)
    config.keymap["screenshot"].append("K_F12")

    # Adicionar 'F1' para o menu de ajuda do café
    config.keymap["help"] = ["K_F1", "h"]

    # Atalho para ir DIRETO ao menu de save (Q)
    config.keymap["save"] = ["q", "K_F5"]

    # NUNCA pular com Ctrl em modo demo (sobrescreve o default)
    if config.developer:
        config.keymap["skip"] = []   # desativa
        config.keymap["fast_skip"] = []`}
      />

      <h2>3. Os 30+ keymaps padrão do Ren'Py</h2>

      <CommandTable
        title="config.keymap defaults — os mais importantes"
        variations={[
          { cmd: "rollback", desc: "Voltar fala anterior (PageUp / mouse-up).", output: '["K_PAGEUP", "mousedown_4"]' },
          { cmd: "rollforward", desc: "Avançar (PageDown / mouse-down).", output: '["K_PAGEDOWN", "mousedown_5"]' },
          { cmd: "dismiss", desc: "Avança fala (Space, Enter, click).", output: '["K_SPACE", "K_RETURN"]' },
          { cmd: "skip", desc: "Pular falas LIDAS (Ctrl segurado).", output: '["K_LCTRL", "K_RCTRL"]' },
          { cmd: "fast_skip", desc: "Pular tudo (>) — geralmente desativado.", output: '[">"]' },
          { cmd: "toggle_skip", desc: "Liga/desliga skip (Tab).", output: '["K_TAB"]' },
          { cmd: "auto", desc: "Auto-forward (A).", output: '["a"]' },
          { cmd: "screenshot", desc: "Salva screenshot (PrintScreen).", output: '["K_PRINT", "K_s"]' },
          { cmd: "hide_windows", desc: "Esconde caixa diálogo (H / mouse middle).", output: '["mouseup_2", "h", "K_PERIOD"]' },
          { cmd: "game_menu", desc: "Abre menu in-game (Esc, mouse direito).", output: '["K_ESCAPE", "mouseup_3"]' },
          { cmd: "save", desc: "Atalho para tela de save.", output: '["s", "K_F5"]' },
          { cmd: "load", desc: "Atalho para tela de load.", output: '["l", "K_F6"]' },
          { cmd: "quicksave", desc: "Salvar rápido (F2).", output: '["K_F2"]' },
          { cmd: "quickload", desc: "Carregar rápido (F3).", output: '["K_F3"]' },
          { cmd: "toggle_fullscreen", desc: "Janela ↔ fullscreen (F / Alt+Enter).", output: '["f", "K_F11"]' },
          { cmd: "console", desc: "Abre console developer (Shift+O).", output: '["shift_K_o"]' },
          { cmd: "developer", desc: "Variable Viewer (Shift+D).", output: '["shift_K_d"]' },
          { cmd: "reload_game", desc: "Reload sem fechar (Shift+R).", output: '["shift_K_r"]' },
          { cmd: "self_voicing", desc: "Liga/desliga TTS (V).", output: '["v"]' },
          { cmd: "accessibility", desc: "Menu acessibilidade (Alt+A).", output: '["alt_K_a"]' },
        ]}
      />

      <h2>4. <code>Keymap()</code> Action — registrar funções</h2>

      <CodeBlock
        language="python"
        title="game/keymap.rpy"
        code={`# Define funções que serão "ações de teclado"
init python:
    def toggle_hud():
        # Troca o estado de uma flag global
        store.hud_visivel = not store.hud_visivel
        renpy.restart_interaction()

    def abrir_cardapio():
        renpy.show_screen("cardapio_cafe")
        renpy.restart_interaction()

    def screenshot_silencioso():
        renpy.screenshot("screenshots/sakura_" +
            str(renpy.time.time()) + ".png")
        renpy.notify("Screenshot salva!")

# Vincula a teclas globais (efeito em TODA tela)
init 1 python:
    config.overlay_screens.append("hotkeys")

screen hotkeys():
    # 'key' captura a tecla mesmo sem foco visível
    key "h" action Function(toggle_hud)
    key "p" action Function(abrir_cardapio)
    key "K_F12" action Function(screenshot_silencioso)
    key "shift_K_l" action ShowMenu("load")  # Shift+L
    key "K_F8" action ToggleVariable("modo_secreto")`}
      />

      <h2>5. Sobrescrever atalho default sem quebrar</h2>
      <p>
        Documentação oficial diz "edite config.keymap" — mas ela esquece
        de avisar: se você sobrescrever um default e o jogador estiver
        em um screen que dependia dele, vira bug. Padrão seguro:
        <strong>preserve a função original como fallback</strong>.
      </p>

      <CodeBlock
        language="python"
        title="game/keymap.rpy"
        code={`init python:
    # Salvar default e SOMAR meu atalho
    config.keymap["game_menu"].append("m")  # M também abre menu

    # NUNCA faça isso (apaga o default):
    # config.keymap["game_menu"] = ["m"]    # ← Esc deixa de funcionar!

    # Para REMOVER de fato, atribua lista vazia
    config.keymap["fast_skip"] = []

    # Para detectar conflito: print do dict
    if config.developer:
        for k, v in config.keymap.items():
            if "h" in v and k != "hide_windows":
                print(f"[KEYMAP] conflito: 'h' usado em {k}")`}
      />

      <h2>6. Esconder o HUD com tecla H — exemplo completo</h2>

      <CodeBlock
        language="python"
        title="game/screens.rpy — HUD do café"
        code={`default hud_visivel = True

screen game_hud():
    if hud_visivel:
        # Painel com hora, dinheiro, clientes atendidos
        frame:
            xalign 1.0  yalign 0.0
            xsize 280  ysize 100
            background "#0008"
            padding (16, 12)
            vbox:
                spacing 4
                text "[hora_jogo]" size 22 color "#fff"
                text "¥ [dinheiro]" size 20 color "#ffcc66"
                text "Clientes: [clientes]" size 16 color "#aaccff"

    # Tecla H sempre captura, mesmo com HUD oculto
    key "h" action ToggleVariable("hud_visivel")`}
      />

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label dia_no_cafe:
    show screen game_hud
    scene bg cafe
    show sakura feliz at left

    s "Bem-vindo de volta! Pronto pro turno?"
    s "Aperta H se quiser esconder o HUD pra tirar screenshot."
    return`}
      />

      <h2>7. Modificadores: shift, ctrl, alt e meta</h2>

      <CommandTable
        title="Sintaxe das teclas em config.keymap"
        variations={[
          { cmd: '"h"', desc: "Tecla H simples.", output: '["h"]' },
          { cmd: '"K_F1"', desc: "Tecla de função (use prefixo K_).", output: '["K_F1", "K_F12"]' },
          { cmd: '"shift_K_o"', desc: "Shift + O.", output: 'modificadores_K_TECLA' },
          { cmd: '"ctrl_K_s"', desc: "Ctrl + S.", output: '["ctrl_K_s"]' },
          { cmd: '"alt_K_F4"', desc: "Alt + F4.", output: '["alt_K_F4"]' },
          { cmd: '"meta_K_q"', desc: "Cmd+Q (macOS) ou Win+Q (Windows).", output: '["meta_K_q"]' },
          { cmd: '"mousedown_3"', desc: "Botão direito do mouse.", output: '["mousedown_3"]' },
          { cmd: '"mouseup_4"', desc: "Scroll up.", output: '["mouseup_4"]' },
          { cmd: '"pad_a_press"', desc: "Botão A do gamepad.", output: '["pad_a_press"]' },
          { cmd: '"pad_back_press"', desc: "Back/Select do gamepad.", output: '["pad_back_press"]' },
        ]}
      />

      <h2>8. Atalhos só dentro de 1 screen</h2>

      <CodeBlock
        language="python"
        title="game/screens.rpy"
        code={`screen cardapio_cafe():
    modal True
    add "gui/cardapio_bg.png"

    vbox xalign 0.5 yalign 0.5 spacing 12:
        textbutton "1. Café Puro" action Return("cafe")
        textbutton "2. Café com Leite" action Return("cafe_leite")
        textbutton "3. Matchá Latte" action Return("matcha")

    # Atalhos NUMÉRICOS — só ativos enquanto o cardápio está visível
    key "K_1" action Return("cafe")
    key "K_2" action Return("cafe_leite")
    key "K_3" action Return("matcha")
    key "K_ESCAPE" action Return(None)`}
      />

      <h2>9. Gamepad — mapeamento básico</h2>

      <CodeBlock
        language="python"
        title="game/keymap.rpy"
        code={`init python:
    # B do gamepad volta ao menu
    config.keymap["game_menu"].append("pad_b_press")
    # Y abre cardápio
    config.keymap.setdefault("cardapio", []).append("pad_y_press")
    # Triggers funcionam como rollback/forward
    config.keymap["rollback"].append("pad_lefttrigger_pos")
    config.keymap["rollforward"].append("pad_righttrigger_pos")

screen hotkeys_gamepad():
    key "pad_y_press" action Show("cardapio_cafe")
    key "pad_back_press" action ShowMenu("preferences")`}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        user="dev"
        host="vn-studio"
        lines={[
          {
            comment: "debug do keymap em runtime — console (Shift+O)",
            cmd: "renpy.exe . run --console",
            out: `Ren'Py 8.2.3 console.

>>> import json
>>> print(json.dumps(list(config.keymap.keys()), indent=2))
[
  "rollback", "rollforward", "dismiss", "skip", "auto",
  "screenshot", "hide_windows", "game_menu", "save", "load",
  "quicksave", "quickload", "toggle_fullscreen", "console",
  "developer", "reload_game", "self_voicing", ...
]
>>> config.keymap["help"]
['K_F1', 'h']
>>> exit()`,
            outType: "info",
          },
        ]}
      />

      <PracticeBox
        title="3 atalhos custom no Sakura Café"
        goal="Adicionar tecla H (toggle HUD), tecla P (abre cardápio screen) e Shift+S (screenshot na pasta screenshots/)."
        steps={[
          "Em game/keymap.rpy crie default hud_visivel = True.",
          "Crie screen overlay 'hotkeys' com 3 keys (h, p, shift_K_s).",
          "Adicione 'hotkeys' a config.overlay_screens em init 1 python.",
          "h → ToggleVariable('hud_visivel')",
          "p → Show('cardapio_cafe') (crie um cardapio screen mínimo).",
          "shift_K_s → Function(screenshot_silencioso) que chama renpy.screenshot.",
        ]}
        verify="Em qualquer cena, apertar H esconde/mostra o HUD do café. P abre menu de cardápio. Shift+S salva screenshot e mostra notify de confirmação."
      >
        <CodeBlock
          language="python"
          title="game/keymap.rpy (gabarito)"
          code={`default hud_visivel = True

init python:
    def screenshot_silencioso():
        import time
        path = "screenshots/sakura_%d.png" % int(time.time())
        renpy.screenshot(path)
        renpy.notify("Screenshot salva em " + path)

init 1 python:
    if "hotkeys" not in config.overlay_screens:
        config.overlay_screens.append("hotkeys")

screen hotkeys():
    key "h" action ToggleVariable("hud_visivel")
    key "p" action Show("cardapio_cafe")
    key "shift_K_s" action Function(screenshot_silencioso)

screen cardapio_cafe():
    modal True
    frame xalign 0.5 yalign 0.5 padding (40, 30):
        vbox spacing 10:
            textbutton "Café Puro" action [Return("cafe"), Hide("cardapio_cafe")]
            textbutton "Latte"     action [Return("latte"), Hide("cardapio_cafe")]
            textbutton "Fechar"    action Hide("cardapio_cafe")
            key "K_ESCAPE" action Hide("cardapio_cafe")`}
        />
      </PracticeBox>

      <OutputBlock label="cheatsheet — keymap" type="info">
{`GLOBAL    config.keymap["nome"] = ["k1","k2"]
          config.keymap["nome"].append("nova_tecla")
          config.keymap["nome"] = []   # desativa

LOCAL     screen X:
              key "h" action SomeAction()

OVERLAY   config.overlay_screens.append("meus_hotkeys")
          → key dentro do screen funciona em TODAS as cenas

MODIFIERS shift_K_X / ctrl_K_X / alt_K_X / meta_K_X
LETRAS    "h" "a" "z"
FUNÇÃO    K_F1 ... K_F12
ESPECIAIS K_ESCAPE K_RETURN K_SPACE K_TAB K_PRINT
MOUSE     mousedown_1..5 / mouseup_1..5
GAMEPAD   pad_a_press, pad_b_press, pad_lefttrigger_pos, ...`}
      </OutputBlock>

      <AlertBox type="warning" title="Cuidado: capturar tecla bloqueia o default">
        Quando você usa <code>key "h" action ...</code> em um screen,
        Ren'Py NÃO chama mais o keymap default <code>hide_windows</code>{" "}
        para essa tecla enquanto o screen estiver ativo. Se a tecla fizer
        sentido em outras telas, REGISTRE NO config.keymap em vez de
        local — assim os 2 efeitos coexistem com prioridades.
      </AlertBox>

      <AlertBox type="success" title="Próximo passo">
        Para atalhos contextuais que aparecem visualmente na tela
        (mostrar ao jogador "P = Cardápio"), combine com a screen{" "}
        <code>quick_menu</code>. E para customizar o cursor que mostra
        sobre cada botão, veja <strong>MouseCustom.tsx</strong>.
      </AlertBox>
    </PageContainer>
  );
}
