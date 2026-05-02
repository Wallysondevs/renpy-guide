import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function RaspberryPi() {
  return (
    <PageContainer
      title="Raspberry Pi — Sakura Café em ARM e modo Kiosk"
      subtitle="Build do Ren'Py para ARM64 (Pi 4 e Pi 5), drivers GL2 KMSDRM, performance esperada por modelo, e como transformar o Pi em um kiosk dedicado para feiras, museus ou cafeterias temáticas."
      difficulty="avancado"
      timeToRead="20 min"
      prompt="plataformas/raspberrypi"
    >
      <AlertBox type="info" title="Ren'Py 8.x suporta ARM64 oficialmente">
        Desde a versão 8.0 (2022), o Ren'Py distribui binários nativos para{" "}
        <strong>linux-arm64</strong> e <strong>linux-armv7l</strong>. Antes
        era preciso compilar à mão. Hoje você baixa o pacote{" "}
        <code>renpy-8.2.3-sdk.tar.bz2</code> e pode rodar/build no próprio
        Raspberry Pi 4 ou 5 sem cross-compilation.
      </AlertBox>

      <h2>1. Por que rodar o Sakura Café num Raspberry Pi?</h2>
      <p>
        Três casos de uso reais que justificam:
      </p>
      <ul>
        <li>
          <strong>Cafeteria temática:</strong> um Pi 4 num display 7" no
          balcão, mostrando o Sakura Café como "menu interativo" — cliente
          escolhe o pedido conversando com a Sakura.
        </li>
        <li>
          <strong>Stand de feira indie:</strong> rodar 4 Pi-Zeros 2W em
          tablets de demonstração, mais barato que 4 notebooks.
        </li>
        <li>
          <strong>Museu / exposição:</strong> kiosk que reseta a cada 5min
          de inatividade — Pi é fácil de gravar SD card de imagem
          read-only.
        </li>
      </ul>

      <h2>2. Modelos suportados e performance esperada</h2>

      <CommandTable
        title="Sakura Café 1080p, GL2, 3 sprites, 1 parallax"
        variations={[
          { cmd: "Raspberry Pi 5 (8GB)", desc: "BCM2712, 4×Cortex-A76 2.4GHz, VideoCore VII", output: "60 FPS estáveis, Live2D OK" },
          { cmd: "Raspberry Pi 4 (4GB/8GB)", desc: "BCM2711, 4×Cortex-A72 1.5GHz, VideoCore VI", output: "45-55 FPS, parallax pesa" },
          { cmd: "Raspberry Pi 4 (2GB)", desc: "Mesmo SoC, RAM apertada", output: "35-45 FPS, swap frequente" },
          { cmd: "Raspberry Pi 400", desc: "Pi 4 dentro de teclado, mesmo desempenho", output: "Mesmo do Pi 4 4GB" },
          { cmd: "Raspberry Pi Zero 2 W", desc: "ARM Cortex-A53 1GHz, 512MB RAM", output: "10-15 FPS — apenas 720p sem parallax" },
          { cmd: "Raspberry Pi 3 B+", desc: "ARM Cortex-A53 1.4GHz, 1GB RAM", output: "20-30 FPS em 720p, NÃO recomendado 1080p" },
        ]}
      />

      <AlertBox type="warning" title="Pi 5 mudou a stack gráfica — atenção">
        O Pi 5 usa o driver <code>vc7-kms-v3d</code> em vez do antigo{" "}
        <code>vc4-kms-v3d</code>. Se você instalar Ren'Py em um Pi 5 com
        Raspberry Pi OS antigo (pré-2024), o GL2 não inicializa. Atualize
        para Bookworm 64-bit recente.
      </AlertBox>

      <h2>3. Setup do sistema</h2>

      <Terminal
        path="~"
        user="pi"
        host="cafe-kiosk"
        lines={[
          {
            comment: "Confirma que está em ARM64 com OpenGL ES funcional",
            cmd: "uname -m && glxinfo | grep 'OpenGL renderer'",
            out: `aarch64
OpenGL renderer string: V3D 7.1.7`,
            outType: "success",
          },
          {
            comment: "Pacotes obrigatórios para SDL2/GL2 no Pi",
            cmd: "sudo apt install libsdl2-2.0-0 libsdl2-image-2.0-0 libsdl2-mixer-2.0-0 libfreetype6 libavcodec60 libgl1-mesa-dri",
            out: `Reading package lists... Done
The following NEW packages will be installed:
  libsdl2-2.0-0 libsdl2-image-2.0-0 libsdl2-mixer-2.0-0
0 upgraded, 3 newly installed, 0 to remove.
Setting up libsdl2-2.0-0:arm64 (2.26.5+dfsg-1) ...`,
            outType: "info",
          },
          {
            comment: "Habilita driver GL Full-KMS no config.txt do Pi",
            cmd: "sudo nano /boot/firmware/config.txt",
            out: `# adicione/edite:
dtoverlay=vc4-kms-v3d   # (ou vc7-kms-v3d no Pi 5)
gpu_mem=256             # reserva 256MB para GPU
max_framebuffers=2`,
            outType: "muted",
          },
        ]}
      />

      <h2>4. Instalando o Ren'Py SDK ARM64</h2>

      <Terminal
        path="~"
        user="pi"
        host="cafe-kiosk"
        lines={[
          {
            cmd: "wget https://www.renpy.org/dl/8.2.3/renpy-8.2.3-sdk.tar.bz2",
            out: `Saving to: 'renpy-8.2.3-sdk.tar.bz2'
renpy-8.2.3-sdk.tar.bz2  100%[========>] 215.4M  4.21MB/s  in 52s`,
            outType: "success",
          },
          {
            cmd: "tar xjf renpy-8.2.3-sdk.tar.bz2 && cd renpy-8.2.3",
            out: "(extraído em ~/renpy-8.2.3)",
            outType: "muted",
          },
          {
            comment: "Roda o Sakura Café direto pelo CLI do Ren'Py",
            cmd: "./renpy.sh ~/projetos/sakura-cafe",
            out: `Ren'Py 8.2.3 starting up...
Architecture: linux-arm64
GPU: V3D 7.1.7 via KMSDRM
GL2 enabled.
Loading game/script.rpy ...
Game window opened at 1920x1080@60Hz.`,
            outType: "success",
          },
        ]}
      />

      <h2>5. Otimizações específicas para ARM</h2>

      <CodeBlock
        title="game/options.rpy — modo Pi"
        language="python"
        code={`init python:
    import platform
    is_pi = "aarch64" in platform.machine() and "arm" in platform.processor().lower()

    # Detecção mais robusta: lê o /proc/cpuinfo
    try:
        with open("/proc/cpuinfo") as f:
            cpu = f.read()
        if "BCM27" in cpu or "Raspberry Pi" in cpu:
            is_pi = True
    except Exception:
        pass

    if is_pi:
        # GL2 obrigatório no Pi (sem ele cai em software = 5 FPS)
        config.gl2 = True
        config.gl_resize = False  # KMSDRM não gosta de resize dinâmico

        # Reduz cache para não comer RAM (Pi 4 4GB tem pouco para sobrar)
        config.image_cache_size = 80  # MB
        config.predict_statements = 1

        # Texturas comprimidas economizam VRAM da VideoCore
        config.gl_texture_compression = True

        # Desativa antialiasing pesado
        config.gl_npot = True

        # Áudio: usa formato leve
        config.sound_sample_rate = 44100`}
      />

      <h2>6. Modo Kiosk — Sakura Café como exposição</h2>
      <p>
        O objetivo: ligou o Pi → cai direto no Sakura Café em fullscreen,
        sem mouse, sem desktop, sem nada. Se o usuário ficar 3min sem
        clicar, reinicia do começo.
      </p>

      <CodeBlock
        title="/etc/systemd/system/sakura-kiosk.service"
        language="ini"
        code={`[Unit]
Description=Sakura Cafe Kiosk
After=graphical.target

[Service]
Type=simple
User=pi
Environment=DISPLAY=:0
Environment=XAUTHORITY=/home/pi/.Xauthority
Environment=RENPY_KIOSK=1
ExecStart=/home/pi/renpy-8.2.3/renpy.sh /home/pi/projetos/sakura-cafe
Restart=always
RestartSec=5

[Install]
WantedBy=graphical.target`}
      />

      <CodeBlock
        title="game/kiosk.rpy — auto-reset por inatividade"
        language="python"
        code={`init python:
    import os
    KIOSK_MODE = os.environ.get("RENPY_KIOSK") == "1"

    if KIOSK_MODE:
        # Sem menu de save/load (cliente não vai salvar nada)
        config.has_quicksave = False
        config.has_save = False

        # Sem console (não queremos cliente abrindo Shift+O)
        config.developer = False
        config.console = False

        # Sem opção de sair
        config.has_quit = False

        # Watchdog de inatividade
        last_input_time = [renpy.get_game_runtime()]

        def check_idle():
            now = renpy.get_game_runtime()
            if now - last_input_time[0] > 180:  # 3 min
                last_input_time[0] = now
                renpy.full_restart()
            return 1.0  # roda de novo em 1s

        config.periodic_callback = check_idle

        def on_input(*args, **kwargs):
            last_input_time[0] = renpy.get_game_runtime()

        config.start_interact_callbacks.append(on_input)`}
      />

      <Terminal
        path="~"
        user="pi"
        host="cafe-kiosk"
        lines={[
          {
            cmd: "sudo systemctl enable sakura-kiosk && sudo systemctl start sakura-kiosk",
            out: `Created symlink /etc/systemd/system/graphical.target.wants/sakura-kiosk.service.
● sakura-kiosk.service - Sakura Cafe Kiosk
     Loaded: loaded (/etc/systemd/system/sakura-kiosk.service; enabled)
     Active: active (running) since Mon 2026-04-12 09:14:32`,
            outType: "success",
          },
          {
            comment: "Status confirma que o Ren'Py está em loop kiosk",
            cmd: "journalctl -u sakura-kiosk -n 5",
            out: `Apr 12 09:14:35 cafe-kiosk renpy[2841]: Ren'Py 8.2.3 starting up...
Apr 12 09:14:36 cafe-kiosk renpy[2841]: KIOSK_MODE=1 detected, restricting menus.
Apr 12 09:14:37 cafe-kiosk renpy[2841]: Game window opened at 1920x1080.`,
            outType: "info",
          },
        ]}
      />

      <h2>7. SD card read-only — proteção contra desligamento bruto</h2>
      <p>
        Em kiosk, o cliente vai puxar da tomada — e o SD card corrompe.
        Solução: rootfs em <code>overlay</code> (escritas vão pra RAM, ao
        reboot somem). Configure pelo <code>raspi-config</code>:
      </p>

      <Terminal
        path="~"
        user="pi"
        host="cafe-kiosk"
        lines={[
          {
            cmd: "sudo raspi-config nonint do_overlayfs 0",
            out: `Overlay filesystem enabled.
Boot partition is read-only.
Reboot for changes to take effect.`,
            outType: "success",
          },
          {
            cmd: "sudo reboot",
            out: "(boot — agora SD card está em modo read-only)",
            outType: "muted",
          },
          {
            comment: "Para atualizar o jogo: desabilita overlay, atualiza, reabilita",
            cmd: "sudo raspi-config nonint disable_overlayfs",
            out: "Overlay disabled. Filesystem is now writable.",
            outType: "warning",
          },
        ]}
      />

      <h2>8. Display 7" oficial e touch</h2>

      <CodeBlock
        title={`game/options.rpy — display 7" Pi (800x480)`}
        language="python"
        code={`init python:
    if is_pi:
        # Detecta resolução nativa do display
        sw, sh = renpy.get_physical_size()
        if (sw, sh) == (800, 480):
            # Display 7" oficial — interface compacta
            config.screen_width = 800
            config.screen_height = 480
            # Aumenta tap targets (dedo na tela pequena)
            gui.text_size = 22
            gui.button_text_size = 24
            gui.choice_button_text_size = 26`}
      />

      <PracticeBox
        title="Faça seu Sakura Café Kiosk em 30min"
        goal="Pi 4 + Sakura Café em modo kiosk com auto-restart por inatividade."
        steps={[
          "Instale Raspberry Pi OS 64-bit Bookworm com Imager.",
          "ssh pi@cafe-kiosk.local e atualize: sudo apt update && sudo apt full-upgrade.",
          "Habilite driver KMS no /boot/firmware/config.txt (dtoverlay=vc4-kms-v3d).",
          "Instale dependências SDL2 (apt list acima).",
          "Baixe o renpy-8.2.3-sdk.tar.bz2 e extraia em ~/.",
          "Copie o projeto sakura-cafe para ~/projetos/.",
          "Adicione o bloco kiosk.rpy ao game/.",
          "Crie e habilite o systemd service sakura-kiosk.",
          "Habilite overlayfs com raspi-config.",
          "Reboot — Sakura aparece no boot, sem desktop.",
        ]}
        verify="Ao ligar o Pi, em ~25s o Sakura Café está fullscreen mostrando o menu inicial. Após 3min sem clicar, ele reseta para o menu principal."
      />

      <h2>9. Troubleshooting comum no Pi</h2>

      <CommandTable
        title="Erros que TODO mundo encontra"
        variations={[
          { cmd: "Failed to create EGL context", desc: "Driver GL2 não habilitado em config.txt.", output: "Adicione dtoverlay=vc4-kms-v3d e reboot." },
          { cmd: "Out of memory (OOM)", desc: "Pi 2GB com cache padrão estoura.", output: "config.image_cache_size = 64." },
          { cmd: "Áudio com crackling", desc: "Buffer SDL muito pequeno.", output: "export SDL_AUDIODRIVER=alsa antes de rodar." },
          { cmd: "Tela preta após splash", desc: "GPU mem < 128MB.", output: "gpu_mem=256 em config.txt." },
          { cmd: "Touch não responde", desc: "udev não detectou o display.", output: "sudo apt install xserver-xorg-input-evdev." },
          { cmd: "Screen tearing", desc: "VSync desligado.", output: "config.gl_vsync = True (default mas pode ter sido sobrescrito)." },
        ]}
      />

      <OutputBlock label="checklist final do Sakura Café Kiosk" type="success">
{`✓ Build Ren'Py rodando em ARM64 nativo
✓ Fullscreen automático no boot via systemd
✓ Auto-reset após 3min sem input
✓ Sem menu de save/load/quit (cliente não bagunça)
✓ SD card em overlayfs (à prova de desligamento bruto)
✓ Áudio funcionando via HDMI ou jack 3.5mm
✓ Touch ou mouse plugado responde
✓ Watchdog systemd — se Ren'Py crashar, reinicia em 5s`}
      </OutputBlock>

      <AlertBox type="success" title="Pi 5 muda o jogo">
        Com o Raspberry Pi 5, Sakura Café roda em 1080p 60FPS sem nenhuma
        otimização especial. Live2D, parallax 3D, tudo funciona nativamente.
        Para quem quer fazer kiosk sério em 2025+, é o modelo certo.
      </AlertBox>
    </PageContainer>
  );
}
