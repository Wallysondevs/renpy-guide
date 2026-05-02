import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Gestures() {
  return (
    <PageContainer
      title="Gestures touch — swipe, pinch, tap no Sakura Café mobile"
      subtitle="Como o Ren'Py mapeia gestos touch (swipe esquerda/direita/cima/baixo, pinch, tap longo) para ações do jogo, customizar config.gestures e adicionar gestos próprios para abrir o cardápio do café."
      difficulty="intermediario"
      timeToRead="16 min"
      prompt="plataformas/gestures"
    >
      <AlertBox type="info" title="Gestures = strings nomeadas no Ren'Py">
        Internamente, o Ren'Py traduz cada movimento do dedo numa string
        tipo <code>"n_e_s"</code> (norte → leste → sul) e procura essa
        string em <code>config.gestures</code>. Se achar, dispara a ação
        associada. É um sistema declarativo: você só edita um dicionário,
        sem escutar eventos touch manualmente.
      </AlertBox>

      <h2>1. O dicionário config.gestures padrão</h2>
      <p>
        Por default, o Ren'Py mobile vem com 3 gestos pré-mapeados que
        cobrem o essencial de uma VN. O resto fica desligado para não
        confundir.
      </p>

      <CommandTable
        title="Gestos padrão do Ren'Py (Android e iOS)"
        variations={[
          { cmd: '"e" → "rollback"', desc: "Swipe pra LESTE (direita) → volta no diálogo.", output: "Equivalente a clicar 'Voltar'." },
          { cmd: '"w" → "rollforward"', desc: "Swipe pra OESTE (esquerda) → avança rollback.", output: "Equivalente a clicar 'Avançar'." },
          { cmd: '"n" → "hide_windows"', desc: "Swipe pra cima → esconde a caixa de diálogo (CG view).", output: "Útil para ver background." },
          { cmd: '"s" → (não mapeado)', desc: "Swipe pra baixo — você pode atribuir.", output: "Default: nada." },
          { cmd: '"n_w_s_e" → (não mapeado)', desc: "Cima→Esquerda→Baixo→Direita (Z-shape).", output: "Default: nada." },
        ]}
      />

      <h2>2. Como o Ren'Py codifica direções</h2>

      <OutputBlock label="anatomia da string de gesto" type="info">
{`O dedo se move pela tela e o Ren'Py registra mudanças de direção:

      n  (norte)
      ↑
  w ←─┼─→ e   (west / east)
      ↓
      s  (sul)

Exemplos reais que você vai mapear:

  "e"        = swipe simples para a direita
  "w"        = swipe simples para a esquerda
  "n"        = swipe para cima
  "s"        = swipe para baixo
  "n_e"      = traça um L invertido: sobe e depois vai pra direita
  "e_n_w"    = ↗ ↑ ↖ — traça um arco horário do tipo "U invertido"
  "s_e_n_w"  = começa descendo, vai pra direita, sobe, volta — quase um quadrado

Pinch e tap NÃO entram nesse sistema — são detectados separados.`}
      </OutputBlock>

      <h2>3. Customizando — gestos para o Sakura Café</h2>

      <CodeBlock
        title="game/options.rpy"
        language="python"
        code={`init python:
    # Gestos padrão (mantém os 3 originais)
    config.gestures["e"] = "rollback"
    config.gestures["w"] = "rollforward"
    config.gestures["n"] = "hide_windows"

    # NOSSOS gestos custom para Sakura Café:

    # Swipe para baixo abre o cardápio do café
    config.gestures["s"] = "show_cardapio"

    # Z-shape: pula direto pro próximo capítulo (cheat dev)
    config.gestures["e_s_w"] = "skip_chapter"

    # L invertido: abre o menu de save rápido
    config.gestures["n_e"] = "quick_save"

    # U: abre o menu de load rápido
    config.gestures["s_e_n"] = "quick_load"

    # Arco completo: tira screenshot
    config.gestures["e_n_w_s_e"] = "screenshot"`}
      />

      <h2>4. Definindo as ações nomeadas</h2>
      <p>
        As strings em <code>config.gestures</code> precisam estar
        registradas em <code>config.gesture_actions</code>. Cada chave
        aponta para uma função Python que executa.
      </p>

      <CodeBlock
        title="game/gestures.rpy"
        language="python"
        code={`init python:
    def show_cardapio_action():
        renpy.show_screen("cardapio_sakura")
        renpy.restart_interaction()

    def skip_chapter_action():
        if config.developer:
            renpy.notify("Pulando capítulo (modo dev)")
            renpy.jump("proximo_capitulo")
        else:
            renpy.notify("Cheat só funciona em modo dev")

    def quick_save_action():
        renpy.run(QuickSave())
        renpy.notify("✓ Save rápido feito")

    def quick_load_action():
        renpy.run(QuickLoad())

    def screenshot_action():
        import os, time
        path = os.path.join(config.savedir, f"screen_{int(time.time())}.png")
        renpy.screenshot(path)
        renpy.notify("Screenshot salvo!")

    # Registra cada uma — string deve bater EXATAMENTE com config.gestures
    config.gesture_actions["show_cardapio"] = show_cardapio_action
    config.gesture_actions["skip_chapter"] = skip_chapter_action
    config.gesture_actions["quick_save"] = quick_save_action
    config.gesture_actions["quick_load"] = quick_load_action
    config.gesture_actions["screenshot"] = screenshot_action`}
      />

      <h2>5. Tela do cardápio acionada por swipe</h2>

      <CodeBlock
        title="game/screens.rpy"
        language="python"
        code={`screen cardapio_sakura():
    modal True
    zorder 200

    add Solid("#000000bb")  # escurece o fundo

    frame:
        xalign 0.5  yalign 0.5
        background Frame("gui/cardapio_bg.png", 32, 32)
        padding (40, 30)

        vbox spacing 12:
            text "☕ Cardápio do Sakura Café" size 36 color "#cc6600"
            null height 8

            textbutton "Café com Leite — R$ 8" action [Hide("cardapio_sakura"), Jump("pedir_cafe_leite")]
            textbutton "Matcha Latte — R$ 12" action [Hide("cardapio_sakura"), Jump("pedir_matcha")]
            textbutton "Torta de Morango — R$ 14" action [Hide("cardapio_sakura"), Jump("pedir_torta")]
            textbutton "Mochi de Chá Verde — R$ 6" action [Hide("cardapio_sakura"), Jump("pedir_mochi")]

            null height 16
            textbutton "Fechar" action Hide("cardapio_sakura") xalign 1.0`}
      />

      <h2>6. Configurações finas — sensibilidade dos gestos</h2>

      <CodeBlock
        title="game/options.rpy — tunning"
        language="python"
        code={`init python:
    # Distância MÍNIMA (em pixels) para considerar um movimento como swipe.
    # Default: 0.05 da menor dimensão da tela. Em 1080p = ~54px.
    # Mais alto = exige movimento maior, evita falsos positivos.
    config.gesture_stroke_size = 0.07

    # Distância MÍNIMA para mudar de direção dentro do gesto.
    # Default: 0.025. Aumentar evita gestos compostos acidentais.
    config.gesture_component_size = 0.04

    # Distância MÁXIMA entre fim de um stroke e início do próximo.
    # Default: 0.05. Para gestos como "n_e" (precisa parar e mudar).
    config.dispatch_gesture = renpy.invoke_in_thread`}
      />

      <h2>7. Pinch — zoom em CG</h2>
      <p>
        Pinch (zoom com 2 dedos) NÃO está no sistema config.gestures — é
        detectado pelo evento <code>pinch</code> direto. Para CG gallery
        do Sakura Café onde o jogador quer dar zoom no detalhe da arte:
      </p>

      <CodeBlock
        title="game/cg_gallery.rpy"
        language="python"
        code={`screen cg_viewer(image_path):
    default zoom_level = 1.0
    default pan_x = 0
    default pan_y = 0

    add image_path:
        zoom zoom_level
        xoffset pan_x
        yoffset pan_y

    # Captura eventos touch raw
    key "K_PLUS" action SetScreenVariable("zoom_level", min(zoom_level + 0.2, 3.0))
    key "K_MINUS" action SetScreenVariable("zoom_level", max(zoom_level - 0.2, 0.5))

    # Botões on-screen para tablet
    hbox xalign 0.95 yalign 0.05 spacing 10:
        textbutton "−" action SetScreenVariable("zoom_level", max(zoom_level - 0.2, 0.5))
        textbutton "+" action SetScreenVariable("zoom_level", min(zoom_level + 0.2, 3.0))
        textbutton "×" action Hide("cg_viewer")

init python:
    # Pinch real via raw event handler — Ren'Py 8.x
    def on_pinch(event, x, y, st):
        if event == "pinch_begin":
            store.pinch_start = 1.0
        elif event == "pinch":
            scale = renpy.display.touch.pinch_scale
            store.pinch_start = max(0.5, min(3.0, scale))
            renpy.restart_interaction()

    config.touch_callbacks.append(on_pinch)`}
      />

      <h2>8. Tap longo — menu contextual</h2>

      <CodeBlock
        title="game/screens.rpy — long press abre opções"
        language="python"
        code={`init python:
    # config.longpress_duration controla o tempo (segundos)
    config.longpress_duration = 0.5  # default 0.5s

    # config.longpress_radius — quantos pixels o dedo pode mover
    # antes de cancelar o long press. Default 15.
    config.longpress_radius = 20

screen sakura_say(who, what):
    use say(who, what)

    # Long press na tela abre o menu rápido
    key "K_LONGPRESS" action ShowMenu("game_menu")
    # Equivalente para mouse: botão direito
    key "mouseup_3" action ShowMenu("game_menu")`}
      />

      <h2>9. Vibração háptica — feedback do gesto</h2>

      <CodeBlock
        title="game/gestures.rpy — vibrar ao reconhecer"
        language="python"
        code={`init python:
    def vibrar(ms=20):
        if renpy.android:
            from android import vibrate
            vibrate(ms / 1000.0)
        elif renpy.ios:
            # iOS usa UIFeedbackGenerator — exposto via pyobjus
            try:
                from pyobjus import autoclass
                gen = autoclass('UIImpactFeedbackGenerator').alloc()
                gen.initWithStyle_(1).impactOccurred()  # 1 = medium
            except Exception:
                pass

    # Wraps as ações para vibrar antes de executar
    def show_cardapio_action():
        vibrar(30)
        renpy.show_screen("cardapio_sakura")
        renpy.restart_interaction()

    def quick_save_action():
        vibrar(15)
        renpy.run(QuickSave())
        renpy.notify("✓ Save rápido feito")`}
      />

      <h2>10. Debugando gestos no console Android</h2>

      <Terminal
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Compila APK em modo developer (mostra strings de gesto na tela)",
            cmd: "renpy.sh launcher android_build sakura-cafe debug",
            out: `Built bin/sakuracafe-debug.apk
Developer mode: ON (gestures visible on screen)`,
            outType: "success",
          },
          {
            comment: "Roda no celular conectado e captura logcat",
            cmd: 'adb logcat | grep "Gesture"',
            out: `04-12 10:23:11 PythonHandler I/python  : Gesture detected: 'e' (rollback)
04-12 10:23:14 PythonHandler I/python  : Gesture detected: 's' (show_cardapio)
04-12 10:23:18 PythonHandler I/python  : Gesture detected: 'e_s_w' (skip_chapter)
04-12 10:23:22 PythonHandler I/python  : Gesture detected: 'q' (UNKNOWN — not in config.gestures)`,
            outType: "info",
          },
        ]}
      />

      <AlertBox type="warning" title="Gesto desconhecido = silêncio">
        Se o jogador faz um movimento que vira string não mapeada (tipo
        <code>"q"</code>, "querreto"), o Ren'Py simplesmente ignora — não
        loga warning na build de release. Use <code>config.developer = True</code>
        + <code>config.log_gestures = True</code> para ver tudo durante QA.
      </AlertBox>

      <h2>11. Acessibilidade — desligar swipe para usuários com tremor</h2>

      <CodeBlock
        title="game/options.rpy"
        language="python"
        code={`init python:
    # Permite usuário desligar gestos no menu de preferências
    if persistent.gestures_disabled:
        config.gestures = {}  # zera tudo
    else:
        config.gestures["e"] = "rollback"
        config.gestures["w"] = "rollforward"
        config.gestures["n"] = "hide_windows"
        config.gestures["s"] = "show_cardapio"

# Adicione o toggle em screens.rpy:
screen preferences():
    vbox:
        textbutton _("Desativar gestos touch"):
            action ToggleField(persistent, "gestures_disabled")
        if persistent.gestures_disabled:
            text "Gestos desativados — use os botões na tela." size 16`}
      />

      <PracticeBox
        title="Adicione swipe-para-baixo no cardápio"
        goal="Implementar do zero o gesto que abre o cardápio com swipe vertical descendente."
        steps={[
          "Em options.rpy adicione: config.gestures['s'] = 'show_cardapio'.",
          "Crie game/gestures.rpy com a função show_cardapio_action().",
          "Registre: config.gesture_actions['show_cardapio'] = show_cardapio_action.",
          "Em screens.rpy crie a tela cardapio_sakura com 4 botões de pedido.",
          "Build APK debug e instale no celular: adb install bin/sakuracafe-debug.apk.",
          "Abra o jogo, durante uma fala faça swipe de cima pra baixo na tela.",
          "Verifique no logcat: adb logcat | grep Gesture.",
        ]}
        verify="Ao deslizar o dedo de cima para baixo na tela, o cardápio abre por cima do diálogo. Tocar 'Fechar' o dispensa."
      />

      <h2>12. Cheat sheet final</h2>

      <CommandTable
        title="Tudo que você precisa lembrar"
        variations={[
          { cmd: "config.gestures", desc: "Dict {string_gesto: nome_acao}.", output: '{"e": "rollback", "s": "show_cardapio"}' },
          { cmd: "config.gesture_actions", desc: "Dict {nome_acao: função}.", output: '{"show_cardapio": show_cardapio_action}' },
          { cmd: "config.gesture_stroke_size", desc: "Distância mínima de cada stroke (proporção da tela).", output: "0.05 (default) — 0.07 mais rígido" },
          { cmd: "config.gesture_component_size", desc: "Distância mínima para mudar direção.", output: "0.025 (default)" },
          { cmd: "config.longpress_duration", desc: "Segundos para considerar long press.", output: "0.5 (default)" },
          { cmd: "config.longpress_radius", desc: "Pixels de tolerância no long press.", output: "15 (default)" },
          { cmd: "config.touch_callbacks", desc: "Lista de callbacks para eventos touch raw.", output: "Para pinch / multi-touch custom" },
          { cmd: "renpy.android / renpy.ios", desc: "True só na plataforma respectiva.", output: "Use para vibração háptica seletiva" },
        ]}
      />

      <AlertBox type="success" title="Resultado: Sakura Café fluido no celular">
        Com 5 gestos bem escolhidos (e/w/n/s + um Z-shape secreto), o
        jogador experiente nunca mais precisa tocar nos botões da
        quick_menu. A VN flui como um Twitter scroll — exatamente o que
        deixa o público mobile feliz.
      </AlertBox>
    </PageContainer>
  );
}
