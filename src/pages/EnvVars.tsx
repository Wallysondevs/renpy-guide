import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function EnvVars() {
  return (
    <PageContainer
      title="Environment Variables do Ren'Py"
      subtitle="As variáveis RENPY_* controlam renderer, GPU, log, performance e debug. Sem editar uma linha do .rpy você troca de OpenGL para ANGLE, ativa modo low-memory, força recompilação ou grava um log completo da sessão para investigar bug do beta-tester."
      difficulty="intermediario"
      timeToRead="13 min"
      prompt="config/env-vars"
    >
      <AlertBox type="info" title="Para que servem">
        Toda variável <code>RENPY_*</code> é lida pelo Ren'Py ANTES de
        carregar o jogo. Você define no shell, no atalho do Windows, no
        <code> launcher.bat</code> ou diretamente no painel do Steam (Launch
        Options). Útil em três cenários: <strong>(1)</strong> jogador com
        GPU problemática, <strong>(2)</strong> dev investigando crash que
        só rola em uma máquina, <strong>(3)</strong> CI/CD rodando build
        sem display.
      </AlertBox>

      <h2>1. Variáveis de renderização (GL2 / ANGLE / Software)</h2>
      <p>
        Por padrão Ren'Py 8.x tenta abrir <strong>OpenGL ES 2.0 (GL2)</strong>
        com aceleração de GPU. Se o driver não aguenta, ele cai para ANGLE
        (DirectX no Windows) e em último caso software puro. Essas vars
        forçam a escolha:
      </p>

      <CommandTable
        title="Variáveis de renderer"
        variations={[
          {
            cmd: "RENPY_RENDERER=gl2",
            desc: "Força OpenGL ES 2.0 (preferido — usa shaders modernos).",
            output: "Suporta model-based rendering, shaders custom, Live2D.",
          },
          {
            cmd: "RENPY_RENDERER=gl",
            desc: "OpenGL legado (fixed pipeline). Útil em GPU antiga.",
            output: "Sem shaders custom, sem matrixcolor avançado.",
          },
          {
            cmd: "RENPY_RENDERER=angle2",
            desc: "ANGLE — traduz GL para DirectX 11 no Windows.",
            output: "Salva pessoas com driver Intel HD bugado.",
          },
          {
            cmd: "RENPY_RENDERER=sw",
            desc: "Software renderer (pygame_sdl2). Ultra lento, mas roda em qualquer lugar.",
            output: "FPS pode ficar abaixo de 15. Última opção.",
          },
          {
            cmd: "RENPY_GL_VBLANK=1",
            desc: "Força vsync via OpenGL (em vez de SDL).",
            output: "Resolve tearing em algumas placas NVIDIA.",
          },
          {
            cmd: "RENPY_GL_NO_NPOT=1",
            desc: "Desabilita texturas non-power-of-two.",
            output: "Workaround para drivers antigos que travam com NPOT.",
          },
          {
            cmd: "RENPY_GL_ENVIRON=limited",
            desc: "Limita features GL para evitar crash em driver problemático.",
            output: "Útil em Linux com Mesa antigo.",
          },
        ]}
      />

      <h2>2. Variáveis de memória e performance</h2>

      <CommandTable
        title="Performance & memória"
        variations={[
          {
            cmd: "RENPY_LESS_MEMORY=1",
            desc: "Reduz cache de imagens. Bom para máquina com 4GB RAM.",
            output: "Pode causar pequeno hitch ao trocar de cena (recarrega).",
          },
          {
            cmd: "RENPY_LESS_UPDATES=1",
            desc: "Reduz frequência de updates da tela quando idle.",
            output: "Economia de bateria em laptop.",
          },
          {
            cmd: "RENPY_LESS_MOUSE=1",
            desc: "Diminui taxa de polling do mouse.",
            output: "Útil em sistemas com input latência alta.",
          },
          {
            cmd: "RENPY_PERFORMANCE_TEST=1",
            desc: "Mostra HUD com FPS, tempo de frame, alocação de cache.",
            output: "Aparece overlay no canto superior esquerdo.",
          },
          {
            cmd: "RENPY_TEXTURE_CACHE=128",
            desc: "Define MB do cache de textura (default ~256 dependendo do device).",
            output: "Aumentar acelera scroll de galeria.",
          },
          {
            cmd: "RENPY_PREDICT=1",
            desc: "Liga prediction agressiva de imagens próximas.",
            output: "Pré-carrega sprites das próximas falas.",
          },
        ]}
      />

      <h2>3. Variáveis de debug e log</h2>

      <CommandTable
        title="Debug, log e diagnóstico"
        variations={[
          {
            cmd: "RENPY_LOG=1",
            desc: "Grava log detalhado em log.txt na pasta do jogo.",
            output: "Inclui carga de imagens, áudio, traceback completo.",
          },
          {
            cmd: "RENPY_LOG_TO_STDOUT=1",
            desc: "Manda log para stdout (terminal) em vez de só log.txt.",
            output: "Útil em CI/CD e Docker.",
          },
          {
            cmd: "RENPY_DUMP=1",
            desc: "Faz dump do estado da engine ao crashar.",
            output: "Salva traceback.txt com snapshot completo.",
          },
          {
            cmd: "RENPY_DEVELOPER=1",
            desc: "Liga modo developer mesmo se config.developer = False.",
            output: "Habilita Console (Shift+O), Variable Viewer (Shift+V).",
          },
          {
            cmd: "RENPY_DISABLE_AUDIO=1",
            desc: "Desativa todo sistema de áudio (silêncio total).",
            output: "Workaround para máquina sem placa de som / CI.",
          },
          {
            cmd: "RENPY_DISABLE_JOYSTICK=1",
            desc: "Desabilita gamepad (alguns drivers travam ao iniciar).",
            output: "Útil em Linux com udev mal configurado.",
          },
          {
            cmd: "RENPY_DISABLE_FULLSCREEN=1",
            desc: "Força janela mesmo se config.fullscreen = True.",
            output: "Para debug em multi-monitor.",
          },
        ]}
      />

      <h2>4. Variáveis de plataforma</h2>

      <CommandTable
        title="Plataforma específica"
        variations={[
          {
            cmd: "RENPY_ANGLE=d3d9",
            desc: "Força ANGLE a usar DirectX 9 (em vez de 11).",
            output: "Compatibilidade com Windows 7 antigo.",
          },
          {
            cmd: "RENPY_X11_NO_SCALE=1",
            desc: "Desabilita auto-scale em telas HiDPI no Linux X11.",
            output: "Resolve UI gigante em monitor 4K Linux.",
          },
          {
            cmd: "RENPY_WAYLAND_FORCE=1",
            desc: "Força sessão Wayland em vez de XWayland.",
            output: "Linux moderno (GNOME 45+).",
          },
          {
            cmd: "RENPY_HIDPI=1",
            desc: "Trata janela como HiDPI (dobra tudo).",
            output: "macOS Retina, Windows 200% scaling.",
          },
          {
            cmd: "RENPY_BASE",
            desc: "Define o diretório base do Ren'Py manualmente.",
            output: "Usado em build CI quando o exe não acha sdk/.",
          },
        ]}
      />

      <h2>5. Aplicando no Linux / macOS</h2>

      <Terminal
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Roda o Sakura Café com renderer ANGLE e log completo",
            cmd: "RENPY_RENDERER=angle2 RENPY_LOG=1 ./renpy.sh .",
            out: `[INFO] Ren'Py 8.3.7 starting up...
[INFO] Renderer: angle2
[INFO] Logging to log.txt
[INFO] Loaded game/script.rpyc (412 statements)
[INFO] Loaded characters.rpyc (6 characters)`,
            outType: "success",
          },
          {
            comment: "Combina performance test + memória reduzida",
            cmd: "RENPY_PERFORMANCE_TEST=1 RENPY_LESS_MEMORY=1 ./renpy.sh .",
            out: `[FPS HUD] 58.2fps | frame 16.9ms | tex cache 124/256MB`,
            outType: "info",
          },
        ]}
      />

      <h2>6. Aplicando no Windows</h2>

      <CodeBlock
        title="run-debug.bat"
        language="bash"
        code={`@echo off
REM Atalho de debug para o Sakura Café
set RENPY_RENDERER=angle2
set RENPY_LOG=1
set RENPY_PERFORMANCE_TEST=1
set RENPY_DEVELOPER=1

renpy.exe .
pause`}
      />

      <p>
        Ou via PowerShell:
      </p>

      <CodeBlock
        title="PowerShell"
        language="bash"
        code={`$env:RENPY_RENDERER = "angle2"
$env:RENPY_LOG = "1"
.\\renpy.exe .`}
      />

      <h2>7. Aplicando no Steam (Launch Options)</h2>
      <p>
        Click direito no jogo → Properties → General → Launch Options. Use a
        sintaxe:
      </p>

      <OutputBlock label="Steam Launch Options" type="info">
{`# Força ANGLE (ajuda usuários com GPU Intel antiga)
RENPY_RENDERER=angle2 %command%

# Modo low-memory para Steam Deck
RENPY_LESS_MEMORY=1 RENPY_LESS_UPDATES=1 %command%

# Debug com log completo
RENPY_LOG=1 RENPY_DEVELOPER=1 %command%`}
      </OutputBlock>

      <h2>8. Investigando crash do beta-tester</h2>
      <p>
        O cenário clássico: a Yuki (sua tester) reporta "o jogo abre branco e
        fecha". Você não consegue reproduzir. Peça que ela rode com:
      </p>

      <Terminal
        path="C:\\Users\\Yuki\\Sakura-Cafe"
        user="yuki"
        host="laptop"
        lines={[
          {
            comment: "Yuki abre cmd na pasta do jogo e roda",
            cmd: "set RENPY_LOG=1 && set RENPY_RENDERER=sw && SakuraCafe.exe",
            out: `(janela abre rapidamente, fecha)
log.txt criado.`,
            outType: "warning",
          },
          {
            comment: "Yuki anexa log.txt no Discord. Você abre e vê",
            cmd: "type log.txt | findstr /i error",
            out: `OpenGL renderer: Intel(R) HD Graphics 4400
ERROR: Failed to compile shader: GLSL ES 1.00 unsupported.
ERROR: Falling back to software renderer.
ERROR: SDL_Surface allocation failed (out of memory).`,
            outType: "error",
          },
        ]}
      />

      <p>
        Diagnóstico: GPU dela não suporta ES 2.0. Solução: instruir uso de
        <code> RENPY_RENDERER=angle2</code>, ou subir o
        <code> config.gl2 = False</code> no fallback.
      </p>

      <h2>9. CI/CD — rodar Ren'Py sem display</h2>
      <p>
        Para testes automatizados em GitHub Actions, GitLab CI:
      </p>

      <CodeBlock
        title=".github/workflows/test.yml"
        language="bash"
        code={`name: Lint Sakura Cafe

on: [push]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Ren'Py
        run: |
          wget https://www.renpy.org/dl/8.3.7/renpy-8.3.7-sdk.tar.bz2
          tar xjf renpy-8.3.7-sdk.tar.bz2
      - name: Lint
        env:
          RENPY_DISABLE_AUDIO: "1"
          RENPY_DISABLE_JOYSTICK: "1"
          RENPY_LOG_TO_STDOUT: "1"
          SDL_VIDEODRIVER: "dummy"
        run: ./renpy-8.3.7-sdk/renpy.sh . lint`}
      />

      <h2>10. Lendo as vars dentro do .rpy</h2>
      <p>
        Você também pode ler env vars dentro do jogo (ex: comportamento
        diferente em modo dev):
      </p>

      <CodeBlock
        title="game/options.rpy"
        language="python"
        code={`init python:
    import os

    # Liga modo "show debug HUD" se a env var estiver setada
    if os.environ.get("SAKURA_DEBUG_HUD") == "1":
        config.overlay_screens.append("debug_hud")

    # Endpoint de leaderboard difere entre staging e prod
    LEADERBOARD_URL = os.environ.get(
        "SAKURA_LEADERBOARD_URL",
        "https://api.sakuracafe.dev/leaderboard"
    )`}
      />

      <PracticeBox
        title="Crie um atalho de debug do seu projeto"
        goal="Configurar um script que abre o Sakura Café com renderer ANGLE, log completo e overlay de FPS — sem precisar lembrar das vars toda vez."
        steps={[
          "No Linux/macOS, crie debug.sh com export RENPY_RENDERER=angle2 RENPY_LOG=1 RENPY_PERFORMANCE_TEST=1.",
          "Termine com ./renpy.sh . e dê chmod +x debug.sh.",
          "No Windows, crie debug.bat com set RENPY_... e renpy.exe .",
          "Rode o atalho — o overlay de FPS aparece no canto superior esquerdo.",
          "Abra log.txt e localize a linha [INFO] Renderer: angle2.",
        ]}
        verify="Você vê o HUD de FPS dentro do jogo e log.txt confirma renderer=angle2."
      />

      <AlertBox type="warning" title="Não comprometa env vars no commit">
        Variáveis tipo <code>SAKURA_LEADERBOARD_URL</code> com endpoints
        privados <strong>não devem entrar no .bat versionado</strong>. Use
        <code> .env.local</code> e ignore no <code>.gitignore</code>.
      </AlertBox>

      <OutputBlock label="cheat sheet — vars mais úteis" type="info">
{`RENDERER       RENPY_RENDERER  = gl2 | gl | angle2 | sw
DEBUG          RENPY_LOG=1, RENPY_DEVELOPER=1, RENPY_PERFORMANCE_TEST=1
MEMORY         RENPY_LESS_MEMORY=1, RENPY_TEXTURE_CACHE=128
PLATAFORMA     RENPY_ANGLE=d3d9, RENPY_HIDPI=1, RENPY_X11_NO_SCALE=1
CI/CD          RENPY_DISABLE_AUDIO=1, SDL_VIDEODRIVER=dummy
SUA APP        SAKURA_*  (use os.environ.get(...))`}
      </OutputBlock>

      <AlertBox type="success" title="Próximo passo">
        Em <strong>Self-Voicing</strong> você vai aprender o sistema de TTS
        embutido — fundamental para acessibilidade e exigido em algumas
        platformas (App Store) para certificação.
      </AlertBox>
    </PageContainer>
  );
}
