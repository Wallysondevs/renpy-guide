import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function ChromeOS() {
  return (
    <PageContainer
      title="Chrome OS / Chromebook — rodando o Sakura Café"
      subtitle="Como o build Android do Ren'Py roda em Chromebook, performance esperada, input híbrido (touch + mouse + teclado) e os ajustes essenciais para uma boa experiência em sala de aula."
      difficulty="intermediario"
      timeToRead="16 min"
      prompt="plataformas/chromeos"
    >
      <AlertBox type="info" title="Chrome OS = Android Container + Linux Container">
        Chromebooks modernos (2019+) executam APKs Android dentro do{" "}
        <strong>ARC++</strong> (Android Runtime for Chrome). Isso significa que
        você <strong>não precisa de um build separado</strong> — o mesmo{" "}
        <code>SakuraCafe.apk</code> que sobe na Play Store roda no Chromebook.
        Mas a experiência precisa ser adaptada porque o usuário tem teclado,
        trackpad, tela touch (às vezes), tudo ao mesmo tempo.
      </AlertBox>

      <h2>1. Por que pensar em Chromebook?</h2>
      <p>
        Em escolas (especialmente Brasil/EUA/Japão), Chromebook domina. VNs
        educativas como <em>Sakura Café — edição professor de japonês</em>{" "}
        têm um nicho enorme nesse mercado. Além disso, a Play Store no
        Chrome OS é a forma mais fácil de distribuir um build "desktop-like"
        sem precisar empacotar para Windows/Mac/Linux separadamente.
      </p>

      <h2>2. Distribuição — Play Store é o caminho</h2>

      <OutputBlock label="caminhos para chegar ao Chromebook" type="info">
{`OPÇÃO A — Play Store (recomendado):
  upload do .aab → Play Console → marca "Chrome OS" como suportado
  ✓ Auto-update, billing, ratings, alcança escolas via Google Workspace

OPÇÃO B — APK side-load (dev):
  ative Linux + ADB no Chromebook → adb install SakuraCafe.apk
  ✓ Bom para QA, ruim para usuário final

OPÇÃO C — Build Linux (.tar.bz2) + Crostini:
  ative "Linux Development Environment" → roda como app Linux nativo
  ✓ Performance melhor, ✗ usuário precisa habilitar Crostini`}
      </OutputBlock>

      <h2>3. Preparando o APK para reconhecer Chromebook</h2>

      <CodeBlock
        title="game/options.rpy — detecção e ajuste de input"
        language="python"
        code={`init python:
    # Variável que vamos checar em todo o jogo
    is_chromebook = False

    if renpy.android:
        # No ARC++ a propriedade ro.boot.container vem como "1"
        # E ro.product.board contém "eve", "nocturne", etc (placas Chromebook)
        try:
            import os
            board = os.popen("getprop ro.product.board").read().strip()
            container = os.popen("getprop ro.boot.container").read().strip()
            if container == "1" or board in ("eve", "nocturne", "atlas", "kohaku"):
                is_chromebook = True
        except Exception:
            pass

    if is_chromebook:
        # Chromebook tem mouse + teclado: ative quick menu sempre visível
        config.always_has_joystick = False
        config.mouse_hide_time = None  # nunca esconde o cursor
        config.skip_indicator = True
        # Resolução desktop-like
        config.screen_width = 1920
        config.screen_height = 1080`}
      />

      <h2>4. Performance esperada por modelo</h2>

      <CommandTable
        title="Sakura Café 1080p, 4 sprites, 1 parallax"
        variations={[
          { cmd: "Acer Chromebook Spin 713 (i5-10210U)", desc: "Top de linha 2020-2022", output: "60 FPS estáveis, Live2D fluido" },
          { cmd: "Lenovo Duet (MT8183)", desc: "Tablet Chromebook ARM", output: "45-55 FPS, Live2D pesado" },
          { cmd: "HP Chromebook 14 (Celeron N4020)", desc: "Modelo escolar comum", output: "30-40 FPS, desligar parallax 3D" },
          { cmd: "Pixelbook (i7-7Y75)", desc: "Original 2017", output: "60 FPS em 720p, queda em 1080p" },
          { cmd: "Samsung Galaxy Chromebook 2 (i3)", desc: "Tela QLED 1080p", output: "50-60 FPS, ótimo visualmente" },
        ]}
      />

      <AlertBox type="warning" title="Memória é o gargalo, não a CPU">
        Chromebooks de 4GB de RAM (a maioria escolar) param de cachear
        sprites e o jogo trava nas trocas de cena. Force{" "}
        <code>config.image_cache_size = 64</code> e desligue
        <code>config.cache_surfaces</code>.
      </AlertBox>

      <h2>5. Input híbrido — teclado, trackpad, touch</h2>
      <p>
        O grande charme (e dor) do Chromebook é que o usuário pode estar
        usando <strong>os 3 ao mesmo tempo</strong>. Sakura Café precisa
        responder bem a todos.
      </p>

      <CodeBlock
        title="game/keymap.rpy — atalhos amigáveis para Chromebook"
        language="python"
        code={`init python:
    # Chromebook não tem F1-F12 nem Print Screen padrão.
    # Use teclas que TODO Chromebook tem: Esc, Espaço, Setas, Shift, Ctrl.

    config.keymap['rollback'] = ['K_PAGEUP', 'mouseup_4']
    config.keymap['rollforward'] = ['K_PAGEDOWN', 'mouseup_5']
    config.keymap['skip'] = ['K_LCTRL', 'K_RCTRL']
    config.keymap['hide_windows'] = ['mouseup_3', 'h', 'H']
    config.keymap['game_menu'] = ['K_ESCAPE', 'mouseup_3_LONG']
    config.keymap['quick_save'] = ['s', 'S']
    config.keymap['quick_load'] = ['l', 'L']
    # Tela cheia: F4 no Chromebook (tecla "fullscreen")
    config.keymap['toggle_fullscreen'] = ['K_F4', 'K_F11', 'meta_K_RETURN']`}
      />

      <h2>6. UI adaptada — botões grandes para touch</h2>

      <CodeBlock
        title="game/screens.rpy — quick_menu touch-friendly"
        language="python"
        code={`screen quick_menu():
    zorder 100
    if quick_menu and not main_menu:
        hbox:
            style_prefix "quick"
            xalign 0.5
            yalign 1.0
            spacing 8

            # Em chromebook, botões 64px mínimo (Material Design touch target)
            textbutton _("Voltar") action Rollback() text_size 22
            textbutton _("Histórico") action ShowMenu('history') text_size 22
            textbutton _("Pular") action Skip() alternate Skip(fast=True, confirm=True)
            textbutton _("Auto") action Preference("auto-forward", "toggle")
            textbutton _("Salvar") action ShowMenu('save')
            textbutton _("Q.Salvar") action QuickSave()
            textbutton _("Q.Carregar") action QuickLoad()
            textbutton _("Pref") action ShowMenu('preferences')

style quick_button:
    properties gui.button_properties("quick_button")
    padding (16, 12, 16, 12)  # área tap maior
    background Frame("gui/quick_button.png", 8, 8)`}
      />

      <h2>7. Modo "tablet" vs "laptop"</h2>
      <p>
        Chromebooks 2-em-1 (Lenovo Duet, ASUS Flip) detectam quando você
        gira a tela. O ARC++ envia um evento de configuração. Você pode
        recompor o HUD do Sakura Café:
      </p>

      <CodeBlock
        title="game/screens.rpy"
        language="python"
        code={`init python:
    def is_tablet_mode():
        # Aspect ratio < 1.0 = portrait/tablet rotacionado
        return renpy.get_physical_size()[1] > renpy.get_physical_size()[0]

screen sakura_hud():
    if is_tablet_mode():
        # Layout vertical — pedidos em coluna na lateral
        vbox:
            xalign 1.0  yalign 0.5
            text "[cafes_pedidos] cafés" size 28
            textbutton "Pedido" action Jump("fazer_pedido")
    else:
        # Layout horizontal — barra inferior
        hbox:
            xalign 0.5  yalign 0.95
            text "[cafes_pedidos] cafés servidos" size 22
            textbutton "Novo Pedido" action Jump("fazer_pedido")`}
      />

      <h2>8. Rodando build Linux via Crostini</h2>

      <Terminal
        path="~"
        user="user"
        host="penguin"
        lines={[
          {
            comment: "Crostini = container Debian dentro do Chrome OS",
            cmd: "lsb_release -a",
            out: `Distributor ID: Debian
Description:    Debian GNU/Linux 12 (bookworm)
Release:        12
Codename:       bookworm`,
            outType: "info",
          },
          {
            comment: "Instala libs SDL necessárias (Ren'Py linux build pede)",
            cmd: "sudo apt install libsdl2-2.0-0 libfreetype6 libavcodec59",
            out: `E: libavcodec59 not available... installing libavcodec60 instead
Setting up libsdl2-2.0-0:amd64 (2.26.5+dfsg-1) ...
Done.`,
            outType: "warning",
          },
          {
            comment: "Roda Sakura Café Linux build direto no Chromebook",
            cmd: "./SakuraCafe-1.0-linux/SakuraCafe.sh",
            out: `Ren'Py 8.2.3 starting up...
Detected Crostini environment.
GPU: virtio_gpu (software rasterizer fallback)
Performance mode: balanced
Game window opened at 1920x1080.`,
            outType: "success",
          },
        ]}
      />

      <AlertBox type="warning" title="Crostini não tem GPU acelerada (geralmente)">
        Por padrão o container Linux não tem acesso à GPU do Chromebook —
        Ren'Py cai em software rendering e fica a 15 FPS. Em modelos novos
        (Brya, Volteer) habilite <code>chrome://flags/#crostini-gpu-support</code>{" "}
        para passthrough Vulkan.
      </AlertBox>

      <h2>9. Subindo na Play Store com suporte ChromeOS marcado</h2>

      <CodeBlock
        title="AndroidManifest.xml — adicionado pelo rapt"
        language="xml"
        code={`<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Sakura Café roda em qualquer tela -->
    <supports-screens
        android:smallScreens="false"
        android:normalScreens="true"
        android:largeScreens="true"
        android:xlargeScreens="true"
        android:resizeable="true"
        android:anyDensity="true" />

    <!-- DECLARAR explicitamente que NÃO precisa touch (chromebook clamshell) -->
    <uses-feature android:name="android.hardware.touchscreen" android:required="false" />
    <uses-feature android:name="android.hardware.faketouch" android:required="true" />

    <!-- Suporte a teclado físico — Play Store usa para "ChromeOS optimized" -->
    <uses-feature android:name="android.hardware.type.pc" android:required="false" />

    <application android:resizeableActivity="true">
        <activity
            android:configChanges="orientation|keyboardHidden|screenSize|smallestScreenSize|screenLayout|uiMode"
            android:windowSoftInputMode="adjustResize" />
    </application>
</manifest>`}
      />

      <PracticeBox
        title="Teste seu APK em Chromebook (sem ter um)"
        goal="Validar que o Sakura Café roda bem em ARC++ usando o emulador oficial Google."
        steps={[
          "Instale Android Studio no seu PC.",
          "AVD Manager → 'Create Virtual Device' → categoria 'Tablet' → 'Pixel C' (similar ao Pixel Slate).",
          "System Image: x86_64 com Google APIs (Chrome OS-like).",
          "Boot o emulador, ative modo desktop nas configurações.",
          "adb install SakuraCafe.apk",
          "Abra o app — testa redimensionamento de janela arrastando a borda.",
          "Conecte um teclado USB físico ao PC e tente jogar com setas/Esc.",
        ]}
        verify="A janela do Sakura Café redimensiona suavemente entre 800x600 e 1920x1080 sem quebrar layout, e os atalhos de teclado funcionam."
      />

      <h2>10. Quick wins para 4 estrelas+ na Play Store ChromeOS</h2>

      <CommandTable
        title="O que reviewers de Chromebook reclamam"
        variations={[
          { cmd: "Janela não redimensiona", desc: "App fica preso em 360x640.", output: "Adicione resizeableActivity=true." },
          { cmd: "Tela preta ao alt-tab", desc: "Activity não restaura context GL.", output: "configChanges no manifest." },
          { cmd: "Texto minúsculo em 1080p", desc: "DPI scaling não é aplicado.", output: "Use config.screen_width = 1920 quando detectar Chromebook." },
          { cmd: "Cursor desaparece", desc: "Ren'Py mobile esconde cursor.", output: "config.mouse_hide_time = None." },
          { cmd: "Scroll do trackpad inverte", desc: "Wheel rolla a história ao invés de avançar.", output: "Customize keymap rollback/rollforward." },
          { cmd: "Atalhos do Chrome OS conflitam", desc: "Ctrl+W fecha o app inteiro.", output: "Capture KeyDown e bloqueie." },
        ]}
      />

      <AlertBox type="success" title="Resultado: Sakura Café como app universal Google">
        Com APK único + manifest correto, o mesmo build que está no celular
        Android dos seus jogadores roda perfeitamente em qualquer
        Chromebook escolar — sem build extra, sem certificado novo, sem
        store separada. É o melhor custo-benefício de plataforma do Ren'Py.
      </AlertBox>
    </PageContainer>
  );
}
