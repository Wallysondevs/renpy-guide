import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Updater() {
  return (
    <PageContainer
      title="Updater — patches automáticos via HTTPS"
      subtitle="O módulo updater do Ren'Py: hospedar updates incrementais, gerar manifesto, integrar UI de download e entregar o patch 1.1 do Sakura Café sem o jogador baixar o jogo todo."
      difficulty="avancado"
      timeToRead="20 min"
      prompt="distribuicao/updater"
    >
      <AlertBox type="info" title="O que é o Updater do Ren'Py">
        <p>
          O updater é um módulo nativo do Ren'Py que <strong>compara
          arquivos locais vs remotos</strong> via assinatura ECDSA, baixa
          só o que mudou (delta-style) e substitui in-place. Funciona em
          Windows, Mac, Linux. <strong>Não funciona</strong> em Android,
          iOS (lojas obrigam a passar pelo update da própria store) nem
          Web (sem disco persistente).
        </p>
      </AlertBox>

      <h2>1. Arquitetura: como o updater funciona</h2>

      <OutputBlock label="fluxo do update" type="info">
{`+-------------------+        +-------------------------+
|  Jogador roda     |        |  CDN / servidor próprio |
|  Sakura Café 1.0  |        |  https://updates/sk-cafe/|
+--------+----------+        +-----------+-------------+
         |                               |
         | 1. GET updates.json (manifesto)
         |------------------------------>|
         | 2. Compara sha1 dos arquivos  |
         |   locais com o manifesto      |
         |                               |
         | 3. GET <arquivos modificados>.zsync
         |------------------------------>|
         | 4. Aplica patch in-place      |
         | 5. Reinicia se necessário     |
         |                               |
+--------+----------+                    |
| Sakura Café 1.1   |                    |
+-------------------+                    |`}
      </OutputBlock>

      <h2>2. Gerar o pacote de update no Launcher</h2>
      <p>
        No <strong>Launcher Ren'Py → Build Distributions</strong>, marque{" "}
        <code>Build Updates</code>. Configure a URL base em{" "}
        <code>options.rpy</code>:
      </p>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`# Onde os updates vão ser hospedados (HTTPS obrigatório)
define build.itch_project = "wallysondevs/sakura-cafe"
define updater.url = "https://updates.sakura-cafe.dev/"

# Versão atual — o updater compara com a versão remota
define config.version = "1.0.0"

# Build Updates: marca quais arquivos vão para o pacote de update
init python:
    build.classify("**~", None)         # ignora backups
    build.classify("**.bak", None)
    build.classify("**.psd", None)      # ignora source art
    build.classify("game/**.rpy", "all")
    build.classify("game/**.rpyc", "all")
    build.classify("game/audio/**", "all")
    build.classify("game/images/**", "all")`}
      />

      <p>Após o build o Launcher gera:</p>

      <CommandTable
        title="Arquivos gerados em /dists/sakura-cafe-1.0.0/"
        variations={[
          { cmd: "sakura-cafe-1.0.0-pc.zip", desc: "Build completo desktop (~1GB).", output: "ZIP da release inteira" },
          { cmd: "updates.json", desc: "Manifesto: lista de arquivos + sha1 + tamanho.", output: "manifest assinado" },
          { cmd: "<arquivo>.zsync", desc: "Arquivo de delta para cada asset, usado pelo updater.", output: "patch incremental" },
          { cmd: "updates.ecdsa", desc: "Assinatura ECDSA do manifesto (chave privada do dev).", output: "256 bytes binário" },
        ]}
      />

      <h2>3. Hospedar os updates</h2>
      <p>
        Faça upload dos 3 últimos itens (<code>updates.json</code>,{" "}
        <code>*.zsync</code>, <code>updates.ecdsa</code>) para o servidor
        configurado em <code>updater.url</code>. Pode ser:
      </p>
      <ul className="list-disc pl-5">
        <li><strong>S3 / R2 / Cloudflare</strong> — barato, escala bem.</li>
        <li><strong>itch.io Butler</strong> — automático se você usa{" "}
          <code>build.itch_project</code>.</li>
        <li><strong>Servidor próprio</strong> — qualquer Apache/Nginx
          serve estático.</li>
      </ul>

      <h2>4. Disparar o update no jogo</h2>

      <CodeBlock
        language="python"
        title="game/screens.rpy — botão de update no main menu"
        code={`screen main_menu():
    add "images/menu_bg.png"
    vbox:
        xalign 0.5 yalign 0.5 spacing 12
        textbutton _("Iniciar")     action Start()
        textbutton _("Carregar")    action ShowMenu("load")
        textbutton _("Opções")      action ShowMenu("preferences")
        textbutton _("Buscar atualização") action Function(checar_update)
        textbutton _("Sair")        action Quit(confirm=False)`}
      />

      <CodeBlock
        language="python"
        title="game/update.rpy"
        code={`init python:
    def checar_update():
        """Verifica e baixa update, se disponível."""
        u = updater.UpdateVersion(updater.url + "updates.json", check_only=True)

        if u.state == updater.Updater.UPDATE_AVAILABLE:
            # confirma com o jogador
            if renpy.invoke_in_new_context(
                renpy.call_screen, "confirm",
                "Há uma nova versão. Baixar agora?",
                yes_action=Return(True), no_action=Return(False)
            ):
                aplicar_update()
        elif u.state == updater.Updater.UPDATE_NOT_AVAILABLE:
            renpy.notify("Você já está na versão mais recente!")
        elif u.state == updater.Updater.ERROR:
            renpy.notify("Falha ao consultar atualizações.")

    def aplicar_update():
        """Mostra a tela de progresso e aplica."""
        u = updater.Updater(updater.url + "updates.json", restart=True)
        renpy.show_screen("updater_progress", u=u)`}
      />

      <h2>5. Tela de progresso de download</h2>

      <CodeBlock
        language="python"
        title="game/screens.rpy"
        code={`screen updater_progress(u):
    modal True
    add "#000c"  # overlay escuro

    frame:
        xalign 0.5 yalign 0.5
        background "#1a1a2e"
        padding (40, 30)

        vbox:
            spacing 18 xsize 600

            text "Atualizando Sakura Café":
                size 28 color "#ffaacc"

            # Estado textual
            if u.state == updater.Updater.CHECKING:
                text "Consultando servidor..."
            elif u.state == updater.Updater.DOWNLOADING:
                text "Baixando atualização ([int(u.progress * 100)]%)"
                bar value u.progress range 1.0 xsize 520
            elif u.state == updater.Updater.UNPACKING:
                text "Descompactando arquivos..."
            elif u.state == updater.Updater.FINISHING:
                text "Finalizando — o jogo vai reiniciar."
            elif u.state == updater.Updater.DONE:
                text "Atualização aplicada com sucesso!"
                textbutton "Reiniciar agora" action Function(renpy.restart_interaction)
            elif u.state == updater.Updater.ERROR:
                text "Erro: [u.message]" color "#ff5555"
                textbutton "Cancelar" action Hide("updater_progress")

    timer 0.5 action Function(renpy.restart_interaction) repeat True`}
      />

      <h2>6. API completa do updater</h2>

      <CommandTable
        title="Funções e estados"
        variations={[
          { cmd: "updater.Updater(url, restart=True)", desc: "Inicia processo de update. Roda em thread.", output: "Updater object" },
          { cmd: "updater.UpdateVersion(url, check_only=True)", desc: "Só verifica, sem baixar.", output: "estado da versão remota" },
          { cmd: "u.state", desc: "Estado atual: CHECKING, UPDATE_AVAILABLE, DOWNLOADING, UNPACKING, FINISHING, DONE, ERROR.", output: "DOWNLOADING" },
          { cmd: "u.progress", desc: "Float 0.0–1.0 do download atual.", output: "0.42" },
          { cmd: "u.message", desc: "String com a mensagem de erro (se ERROR).", output: '"Connection timed out"' },
          { cmd: "u.cancel()", desc: "Aborta o download em andamento.", output: "—" },
          { cmd: "u.add_dlc('extra-rota')", desc: "Adiciona DLC opcional ao update.", output: "—" },
          { cmd: "updater.can_update()", desc: "Bool: True se a plataforma suporta updater.", output: "True (desktop) | False (mobile)" },
        ]}
      />

      <h2>7. DLCs opcionais (rotas extras)</h2>
      <p>
        Você pode marcar uma parte do conteúdo como DLC e baixar só sob
        demanda. Útil para rotas extras pagas ou idiomas adicionais.
      </p>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`init python:
    # Marca uma rota como DLC
    build.classify("game/rotas/mei_rota.rpy", "rota_mei")
    build.classify("game/audio/mei/**", "rota_mei")
    build.classify("game/images/mei/**", "rota_mei")

    # Marca outra rota como DLC
    build.classify("game/rotas/rin_rota.rpy", "rota_rin")
    build.classify("game/audio/rin/**", "rota_rin")
    build.classify("game/images/rin/**", "rota_rin")`}
      />

      <CodeBlock
        language="python"
        title="game/dlc.rpy — comprar e baixar a rota da Mei"
        code={`init python:
    def baixar_dlc_mei():
        u = updater.Updater(
            updater.url + "updates.json",
            add=["rota_mei"],
            restart=True,
        )
        renpy.show_screen("updater_progress", u=u)

screen menu_dlc():
    vbox xalign 0.5 yalign 0.5 spacing 14:
        text "Conteúdo extra"
        if "rota_mei" in persistent.dlcs_compradas:
            textbutton "Baixar rota da Mei" action Function(baixar_dlc_mei)
        else:
            textbutton "Comprar rota da Mei (R$ 9,90)" action Function(comprar_iap, "rota_mei")
        if "rota_rin" in persistent.dlcs_compradas:
            textbutton "Baixar rota da Rin" action Function(baixar_dlc_rin)`}
      />

      <h2>8. Auto-check no startup</h2>

      <CodeBlock
        language="python"
        title="game/auto_update.rpy"
        code={`init python:
    import threading

    def auto_check_silencioso():
        """Verifica em background se há update; se houver, notifica."""
        try:
            u = updater.UpdateVersion(
                updater.url + "updates.json",
                check_only=True,
            )
            if u.state == updater.Updater.UPDATE_AVAILABLE:
                renpy.invoke_in_main_thread(
                    renpy.notify, "Nova versão disponível! Veja em Opções."
                )
        except Exception:
            pass  # silencioso

    def on_main_menu():
        threading.Thread(target=auto_check_silencioso, daemon=True).start()

# Roda o check 1x ao chegar no menu principal
define config.after_load_callbacks = [on_main_menu]`}
      />

      <Terminal
        path="~/projetos/sakura-cafe/dists"
        lines={[
          {
            comment: "Verifica os arquivos do build de update",
            cmd: "ls sakura-cafe-1.0.0/",
            out: `sakura-cafe-1.0.0-pc.zip
updates.json
updates.ecdsa
game.zsync
audio.zsync
images.zsync`,
            outType: "default",
          },
          {
            comment: "Sobe para o servidor (rsync)",
            cmd: "rsync -av sakura-cafe-1.0.0/{updates.json,updates.ecdsa,*.zsync} \\\n  user@updates.sakura-cafe.dev:/var/www/updates/",
            out: `sending incremental file list
updates.json     12,841 bytes
updates.ecdsa       256 bytes
game.zsync       45,210 bytes
audio.zsync     128,440 bytes
images.zsync    342,118 bytes
total size: 528,865  speedup is 1.00`,
            outType: "success",
          },
          {
            comment: "No jogo, console (Shift+O), dispara um check",
            cmd: 'updater.UpdateVersion(updater.url + "updates.json", check_only=True).state',
            out: `'update available'`,
            outType: "info",
          },
        ]}
      />

      <PracticeBox
        title="Patch 1.1 entregue automaticamente"
        goal="Configurar o jogo para detectar e aplicar uma atualização hospedada localmente em http://localhost:8000."
        steps={[
          "No Launcher, marque 'Build Updates' e gere a build da versão 1.0.0.",
          "Suba config.version para 1.0.1, troque algum diálogo, gere build 1.0.1.",
          "Sirva o conteúdo de /dists/sakura-cafe-1.0.1 com 'python -m http.server 8000'.",
          "No jogo 1.0.0, configure updater.url='http://localhost:8000/' e adicione o botão 'Buscar atualização'.",
          "Clique no botão — o jogo deve baixar só o que mudou e reiniciar na 1.0.1.",
        ]}
        verify="Após o reinicio, config.version no console (Shift+O) imprime '1.0.1' e o diálogo trocado aparece."
      />

      <OutputBlock label="checklist de produção" type="info">
{`[ ] HTTPS válido (Let's Encrypt) — HTTP é bloqueado em alguns OS
[ ] CDN (Cloudflare/CloudFront) na frente do bucket — economiza banda
[ ] Versão semântica em config.version (1.2.3) — facilita changelog
[ ] DLCs com 'add=' — não força usuário a baixar conteúdo opcional
[ ] auto_check em thread — nunca bloqueia o main menu
[ ] Tela de progresso clara com botão Cancelar
[ ] Backup local da versão antiga até confirmação de DONE
[ ] Mensagem clara se updater.can_update() == False (mobile/web)`}
      </OutputBlock>

      <AlertBox type="warning" title="Mobile e Web NÃO podem usar updater">
        Em Android/iOS o update DEVE passar pela Play Store/App Store
        (política das lojas). No Web build, não existe disco
        persistente. Detecte com{" "}
        <code>{`if not updater.can_update(): hide o botão`}</code>.
      </AlertBox>

      <AlertBox type="danger" title="Assinatura ECDSA: NÃO perca a chave privada">
        Cada projeto Ren'Py gera um par de chaves ECDSA
        (<code>game/saves/keys/</code>). A chave PRIVADA assina os
        manifestos; a PÚBLICA verifica. Se você perder a privada, o
        jogador não consegue mais aplicar updates no jogo já instalado —
        precisa reinstalar do zero. <strong>Faça backup criptografado</strong>.
      </AlertBox>

      <AlertBox type="success" title="Próximo passo">
        Próximo: <strong>Downloader</strong> — baixar assets grandes sob
        demanda (vídeos, packs de idioma) sem incluí-los no build base.
        Ideal para mobile e Web onde tamanho importa.
      </AlertBox>
    </PageContainer>
  );
}
