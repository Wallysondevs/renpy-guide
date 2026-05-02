import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Screenshot() {
  return (
    <PageContainer
      title="Screenshot — capturar a tela do jogo"
      subtitle="renpy.screenshot(), atalho S, _screenshot, save thumbnails, captura programática no fim de cada rota e integração com Steam Screenshots."
      difficulty="intermediario"
      timeToRead="14 min"
      prompt="api/screenshot"
    >
      <AlertBox type="info" title="Três caminhos de captura">
        <p>
          Ren'Py oferece <strong>três</strong> formas distintas de tirar
          uma screenshot, e cada uma serve para um propósito diferente:
        </p>
        <ul className="list-disc pl-5 mt-2">
          <li>
            <strong>Tecla S do jogador</strong> — built-in. Salva PNG no
            diretório do jogo. Você só configura o caminho e o nome.
          </li>
          <li>
            <code>renpy.screenshot(filename)</code> — programático. Você
            decide quando, onde e o nome. Usado para finais de rota,
            achievements, share buttons.
          </li>
          <li>
            <code>renpy.screenshot_to_bytes()</code> — retorna os bytes
            PNG diretamente, sem tocar o disco. Para enviar via{" "}
            <code>renpy.fetch()</code> POST a um servidor.
          </li>
        </ul>
      </AlertBox>

      <h2>1. Captura padrão pelo jogador (tecla S)</h2>
      <p>
        Por default, Ren'Py mapeia a tecla <code>s</code> (e a combinação
        de hotkeys do menu) para chamar <code>screenshot</code>. Os
        arquivos vão para o diretório do jogo (mesma pasta do
        executável) com o nome configurado em{" "}
        <code>config.screenshot_pattern</code>.
      </p>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`# Padrão do nome do arquivo. Variáveis aceitas:
#   %d  — número sequencial
#   %02d, %03d — com padding
#   %s  — nome do jogo
define config.screenshot_pattern = "sakura-cafe-screenshot-%04d.png"

# Cropar a barra inferior (Quick Menu) da captura?
define config.screenshot_crop = None  # ou (x, y, w, h)`}
      />

      <h2>2. Captura programática</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`init python:
    import os, time

    def capturar_fim_de_rota(rota):
        """Salva uma screenshot única para cada final."""
        pasta = os.path.join(config.basedir, "screenshots")
        if not os.path.isdir(pasta):
            os.makedirs(pasta)

        nome = "fim-{}-{}.png".format(rota, int(time.time()))
        caminho = os.path.join(pasta, nome)

        sucesso = renpy.screenshot(caminho)
        if sucesso:
            renpy.notify("Final da rota {} salvo em {}".format(rota, nome))
        return caminho if sucesso else None

label fim_rota_sakura:
    scene bg cafe_amanhecer with fade
    show sakura sorriso at center
    s "Obrigada por escolher ficar comigo."

    # captura justo antes da tela de créditos
    $ capturar_fim_de_rota("sakura")

    jump credits`}
      />

      <h2>3. Captura para envio (bytes em memória)</h2>
      <p>
        Combinado com <code>renpy.fetch()</code>, dá para mandar a
        screenshot direto para um servidor sem nunca tocar o disco —
        ideal para Web build e compartilhamento social.
      </p>

      <CodeBlock
        language="python"
        title="game/share.rpy"
        code={`init python:
    def compartilhar_screenshot():
        # Bytes PNG diretos, sem disco
        png_bytes = renpy.screenshot_to_bytes(size=(1280, 720))

        try:
            resp = renpy.fetch(
                "https://api.sakura-cafe.dev/share",
                method="POST",
                data=png_bytes,
                content_type="image/png",
                headers={"Authorization": "Bearer " + persistent.api_token},
                timeout=15,
                result="json",
            )
            return resp.get("share_url")
        except renpy.fetch.FetchError as e:
            renpy.notify("Falha ao compartilhar: " + str(e))
            return None

screen botao_share():
    textbutton "📸 Compartilhar"
        action Function(compartilhar_screenshot)
        xalign 1.0 yalign 0.0`}
      />

      <h2>4. Funções e variáveis disponíveis</h2>

      <CommandTable
        title="API de screenshot do Ren'Py"
        variations={[
          { cmd: "renpy.screenshot(filename)", desc: "Salva PNG no caminho dado. Retorna True/False.", output: 'renpy.screenshot("/tmp/cena.png")' },
          { cmd: "renpy.screenshot_to_bytes(size=None)", desc: "Retorna bytes PNG. size opcional redimensiona.", output: "b'\\x89PNG\\r\\n...'" },
          { cmd: "_screenshot", desc: "Variável global: caminho da última screenshot tirada pelo jogador.", output: '"sakura-cafe-screenshot-0042.png"' },
          { cmd: "config.screenshot_pattern", desc: "Padrão do nome de arquivo (printf-like).", output: '"shot-%04d.png"' },
          { cmd: "config.screenshot_callback", desc: "Função chamada após cada screenshot do jogador.", output: 'def cb(path): upload(path)' },
          { cmd: "config.screenshot_crop", desc: "(x,y,w,h) para cortar a captura.", output: "(0, 0, 1280, 720)" },
          { cmd: "config.thumbnail_width / _height", desc: "Tamanho do thumbnail dos saves (também é uma forma de captura).", output: "256 / 144" },
          { cmd: "ScreenShot()", desc: "Action pronta para ligar a um botão de UI.", output: 'textbutton "📸" action ScreenShot()' },
        ]}
      />

      <h2>5. Callback ao capturar (logging / Steam)</h2>

      <CodeBlock
        language="python"
        title="game/screenshot_hook.rpy"
        code={`init python:
    def on_screenshot(path):
        """Roda toda vez que o jogador aperta S."""
        renpy.log("Screenshot tirada em " + path)

        # Exemplo: enviar para Steam Screenshots overlay
        try:
            import steamapi
            steamapi.screenshots.write_screenshot(path)
        except Exception:
            pass

        # Exemplo: notificar no jogo
        renpy.notify("Captura salva!")

define config.screenshot_callback = on_screenshot`}
      />

      <h2>6. Captura customizada — tirar foto sem o HUD</h2>

      <CodeBlock
        language="python"
        title="game/screenshot_clean.rpy"
        code={`init python:
    def screenshot_sem_hud(filename):
        """Esconde quick menu, captura, mostra de volta."""
        renpy.hide_screen("quick_menu")
        renpy.restart_interaction()
        renpy.pause(0.05, hard=True)  # garante o render

        ok = renpy.screenshot(filename)

        renpy.show_screen("quick_menu")
        renpy.restart_interaction()
        return ok

label tirar_foto_limpa:
    $ screenshot_sem_hud("/tmp/sem_hud.png")
    "Foto tirada sem a barra inferior."
    return`}
      />

      <h2>7. Save thumbnails — captura automática</h2>
      <p>
        Toda vez que o jogador salva, Ren'Py captura automaticamente um
        thumbnail (tamanho de <code>config.thumbnail_width</code> x{" "}
        <code>config.thumbnail_height</code>) e embute no arquivo de
        save. Você pode customizar o que vai nesse thumbnail:
      </p>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`define config.thumbnail_width = 256
define config.thumbnail_height = 144

init python:
    # Customiza o thumbnail antes de cada save
    def customizar_thumb(filename, slot):
        # Adiciona overlay com nome da rota antes do save
        renpy.show("ui rota_atual_overlay", layer="overlay")
        renpy.restart_interaction()

    config.save_started_callback = customizar_thumb`}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Verifica que as screenshots foram salvas",
            cmd: "ls -lh screenshots/",
            out: `total 1.2M
-rw-r--r-- 1 dev dev 312K 2026-04-04 14:32 fim-sakura-1712238731.png
-rw-r--r-- 1 dev dev 287K 2026-04-04 15:02 fim-yuki-1712240520.png
-rw-r--r-- 1 dev dev 451K 2026-04-04 15:48 fim-akira-1712243287.png`,
            outType: "success",
          },
          {
            comment: "Roda o jogo e tira screenshot via console (Shift+O)",
            cmd: 'renpy.screenshot("/tmp/teste.png")',
            out: `True`,
            outType: "success",
          },
          {
            comment: "Falha: caminho inválido",
            cmd: 'renpy.screenshot("/sys/forbidden.png")',
            out: `False
PermissionError: [Errno 13] Permission denied`,
            outType: "error",
          },
        ]}
      />

      <h2>8. Integração com Steam Screenshots</h2>

      <CodeBlock
        language="python"
        title="game/steam_screenshots.rpy"
        code={`init python:
    try:
        import steamapi
        STEAM = True
    except ImportError:
        STEAM = False

    def steam_screenshot(filename, comentario=""):
        """Tira shot e envia para overlay Steam (F12)."""
        if not renpy.screenshot(filename):
            return False
        if STEAM:
            steamapi.screenshots.add_screenshot_to_library(
                filename, None, 1280, 720
            )
            steamapi.screenshots.set_caption(filename, comentario)
        return True

label achievement_desbloqueado:
    $ steam_screenshot(
        "/tmp/ach.png",
        "Servi 100 cafés! #SakuraCafe"
    )
    "Achievement compartilhado com Steam Friends!"
    return`}
      />

      <OutputBlock label="quando usar cada API" type="info">
{`renpy.screenshot()           — quando você precisa do PNG no disco (Steam, share local)
renpy.screenshot_to_bytes()  — quando vai mandar pela rede (renpy.fetch POST)
config.screenshot_callback   — quando quer interceptar a tecla S do jogador
ScreenShot() (action)        — botão na UI sem código Python
config.thumbnail_*           — para customizar a miniatura nos saves`}
      </OutputBlock>

      <PracticeBox
        title="Salvar screenshot ao final de cada rota"
        goal="Implementar a função capturar_fim_de_rota() e chamá-la em 3 finais distintos do Sakura Café."
        steps={[
          "Crie game/screenshots.rpy com a função capturar_fim_de_rota().",
          "Garanta que a pasta screenshots/ é criada em config.basedir se não existir.",
          "Em cada um dos 3 finais (sakura, yuki, akira), chame a função antes do return.",
          "Adicione um config.screenshot_callback que printa um log no terminal.",
          "Rode o jogo, jogue até o fim de uma rota, verifique a pasta screenshots/.",
        ]}
        verify="A pasta screenshots/ contém um PNG nomeado fim-<rota>-<timestamp>.png para cada final disparado."
      />

      <AlertBox type="warning" title="Mobile e Web: cuidado com permissão de disco">
        No Android, <code>renpy.screenshot()</code> precisa de permissão
        de escrita externa (configurada em <code>options.rpy</code> via{" "}
        <code>build.android_permissions</code>). No Web build, NÃO existe
        sistema de arquivos persistente — use sempre{" "}
        <code>renpy.screenshot_to_bytes()</code> + envio HTTP, ou
        ofereça download via <code>renpy.fetch</code> reverso.
      </AlertBox>

      <AlertBox type="success" title="Próximo passo">
        Próximo: <strong>Updater</strong> — entregar patch 1.1 do Sakura
        Café automaticamente, atualizando só os arquivos modificados via
        HTTPS sem o jogador precisar baixar o jogo de novo.
      </AlertBox>
    </PageContainer>
  );
}
