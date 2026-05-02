import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Downloader() {
  return (
    <PageContainer
      title="Downloader — assets sob demanda (lazy)"
      subtitle="Baixar packs grandes (voz dublada, CGs HD, packs de idioma) só quando o jogador precisar. Indicador de progresso, retry, integração com renpy.fetch e renpy.start_predict."
      difficulty="avancado"
      timeToRead="18 min"
      prompt="distribuicao/downloader"
    >
      <AlertBox type="info" title="Por que downloader em vez de updater?">
        <p>
          O <code>updater</code> é para <strong>patches do jogo</strong>{" "}
          (corrigir bug, trocar diálogo, adicionar rota — desktop only).
          O downloader é para <strong>assets opcionais</strong>: voz
          dublada (~500MB), texturas 4K, packs de idioma — funciona em
          Web e mobile, e o jogador escolhe se quer baixar.
        </p>
        <p className="mt-2">
          Diferente do updater, não há módulo "downloader" pronto no
          Ren'Py — você monta usando <code>renpy.fetch()</code>,{" "}
          <code>threading</code>, e <code>renpy.start_predict</code>{" "}
          para pré-cache.
        </p>
      </AlertBox>

      <h2>1. Estrutura do pack remoto</h2>

      <OutputBlock label="layout do servidor de assets" type="info">
{`https://cdn.sakura-cafe.dev/packs/
├── manifest.json              # lista de packs disponíveis
├── voice_pt-BR/
│   ├── pack.json              # metadados do pack
│   ├── pack.zip               # 480 MB compactado
│   └── pack.zip.sha256        # checksum
├── voice_jp/
│   ├── pack.json
│   ├── pack.zip               # 520 MB
│   └── pack.zip.sha256
└── cg_4k/
    ├── pack.json
    └── pack.zip               # 1.2 GB`}
      </OutputBlock>

      <CodeBlock
        language="json"
        title="manifest.json (no servidor)"
        code={`{
  "version": 3,
  "packs": [
    {
      "id": "voice_pt-BR",
      "title": "Voz dublada (PT-BR)",
      "size_bytes": 503316480,
      "version": "1.2",
      "url": "https://cdn.sakura-cafe.dev/packs/voice_pt-BR/pack.zip",
      "sha256_url": "https://cdn.sakura-cafe.dev/packs/voice_pt-BR/pack.zip.sha256",
      "required_game_version": "1.0.0"
    },
    {
      "id": "voice_jp",
      "title": "Voz dublada (Japonês)",
      "size_bytes": 545259520,
      "version": "1.0",
      "url": "https://cdn.sakura-cafe.dev/packs/voice_jp/pack.zip",
      "sha256_url": "https://cdn.sakura-cafe.dev/packs/voice_jp/pack.zip.sha256"
    }
  ]
}`}
      />

      <h2>2. Download em chunks com progresso</h2>
      <p>
        <code>renpy.fetch()</code> não tem callback de progresso nativo.
        Para mostrar barra real, faça download em pedaços usando o
        header <code>Range</code>:
      </p>

      <CodeBlock
        language="python"
        title="game/downloader.rpy"
        code={`init python:
    import os, hashlib, threading

    CHUNK = 1024 * 256  # 256 KB por requisição

    class PackDownloader(object):
        def __init__(self, url, dest_path, total_size, on_progress=None):
            self.url = url
            self.dest = dest_path
            self.total = total_size
            self.downloaded = 0
            self.on_progress = on_progress
            self.canceled = False
            self.error = None
            self.done = False

        def cancel(self):
            self.canceled = True

        def _request(self, start, end):
            return renpy.fetch(
                self.url,
                headers={"Range": "bytes={}-{}".format(start, end)},
                timeout=30,
                result="bytes",
            )

        def run(self):
            try:
                # Abre destino
                os.makedirs(os.path.dirname(self.dest), exist_ok=True)
                # Resume: se já existe parcial, retoma
                if os.path.exists(self.dest):
                    self.downloaded = os.path.getsize(self.dest)
                mode = "ab" if self.downloaded > 0 else "wb"

                with open(self.dest, mode) as f:
                    while self.downloaded < self.total:
                        if self.canceled:
                            self.error = "canceled"
                            return

                        end = min(self.downloaded + CHUNK - 1, self.total - 1)
                        data = self._request(self.downloaded, end)
                        f.write(data)
                        self.downloaded += len(data)

                        if self.on_progress:
                            renpy.invoke_in_main_thread(
                                self.on_progress,
                                self.downloaded,
                                self.total,
                            )

                self.done = True
            except Exception as e:
                self.error = str(e)

        def progress(self):
            if self.total == 0:
                return 0.0
            return self.downloaded / float(self.total)`}
      />

      <h2>3. Validar checksum SHA-256</h2>

      <CodeBlock
        language="python"
        title="game/downloader.rpy (continuação)"
        code={`init python:
    def validar_sha256(path, esperado):
        h = hashlib.sha256()
        with open(path, "rb") as f:
            for chunk in iter(lambda: f.read(8192), b""):
                h.update(chunk)
        return h.hexdigest() == esperado.strip().lower()

    def baixar_pack(pack_meta, on_progress=None):
        """Baixa, valida e descompacta um pack."""
        dest_zip = os.path.join(config.basedir, "packs", pack_meta["id"] + ".zip")

        d = PackDownloader(
            pack_meta["url"], dest_zip,
            pack_meta["size_bytes"], on_progress
        )

        thread = threading.Thread(target=d.run, daemon=True)
        thread.start()
        return d  # caller pode monitorar d.progress() e d.done`}
      />

      <h2>4. Tela de download com barra de progresso</h2>

      <CodeBlock
        language="python"
        title="game/screens.rpy"
        code={`screen download_progress(d, pack_meta):
    modal True
    add "#000a"

    frame:
        xalign 0.5 yalign 0.5
        background "#1a1a2e"
        padding (40, 30)
        xsize 600

        vbox spacing 14:
            text pack_meta["title"]:
                size 24 color "#ffaacc"

            text "[d.downloaded / 1048576:>4.1f] MB de [d.total / 1048576:>4.1f] MB"

            bar value AnimatedValue(d.progress(), 1.0, 0.3) range 1.0 xsize 520

            hbox spacing 16 xalign 0.5:
                if d.done:
                    textbutton "Concluído!" action Hide("download_progress")
                elif d.error:
                    text "Erro: [d.error]" color "#ff5555"
                    textbutton "Fechar" action Hide("download_progress")
                else:
                    textbutton "Cancelar" action Function(d.cancel)

    timer 0.4 action Function(renpy.restart_interaction) repeat True`}
      />

      <h2>5. Lista de packs disponíveis (UI)</h2>

      <CodeBlock
        language="python"
        title="game/screens.rpy"
        code={`init python:
    def listar_packs():
        try:
            return renpy.fetch(
                "https://cdn.sakura-cafe.dev/packs/manifest.json",
                result="json", timeout=10,
            )["packs"]
        except renpy.fetch.FetchError:
            return []

screen menu_packs():
    tag menu
    use game_menu(_("Conteúdo Extra")):
        vbox spacing 12:
            $ packs = listar_packs()
            for p in packs:
                hbox spacing 16:
                    text "[p[title]] ([p[size_bytes] / 1048576:>4.0f] MB)":
                        size 18 xsize 380
                    if p["id"] in (persistent.packs_baixados or []):
                        text "✓ Instalado" color "#88ff88"
                    else:
                        textbutton "Baixar"
                            action Function(iniciar_download, p)`}
      />

      <CodeBlock
        language="python"
        title="game/downloader.rpy"
        code={`init python:
    def iniciar_download(pack_meta):
        d = baixar_pack(pack_meta)
        renpy.show_screen("download_progress", d=d, pack_meta=pack_meta)

        # Polling para detectar fim
        def checar():
            if d.done:
                if instalar_pack(d.dest, pack_meta):
                    persistent.packs_baixados = (persistent.packs_baixados or []) + [pack_meta["id"]]
                    renpy.notify("Pack {} instalado!".format(pack_meta["title"]))
                return
            if d.error:
                return
            renpy.timeout(0.5)
            checar()

        threading.Thread(target=checar, daemon=True).start()

    def instalar_pack(zip_path, pack_meta):
        import zipfile
        try:
            target = os.path.join(config.basedir, "game", "packs", pack_meta["id"])
            os.makedirs(target, exist_ok=True)
            with zipfile.ZipFile(zip_path, "r") as z:
                z.extractall(target)
            os.remove(zip_path)
            # força Ren'Py a re-escanear assets
            renpy.loader.cleardirfiles()
            return True
        except Exception as e:
            renpy.log("Falha ao instalar pack: " + str(e))
            return False`}
      />

      <h2>6. Pré-carregar assets (predict)</h2>
      <p>
        Para assets pequenos (sprites, BGs da próxima cena),{" "}
        <code>renpy.start_predict()</code> faz cache em background sem
        download HTTP — só pré-carrega do disco para a memória de vídeo,
        evitando travadas no <code>show</code>.
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label cap2_inicio:
    # pré-carrega tudo da próxima cena 5s antes de mostrar
    $ renpy.start_predict("bg cafe_noite")
    $ renpy.start_predict("sakura noturna_feliz")
    $ renpy.start_predict("yuki noturna_brava")
    $ renpy.start_predict_screen("hud_pedido")

    pause 5.0

    scene bg cafe_noite with fade
    show sakura noturna_feliz at left
    show yuki noturna_brava at right
    s "Já é tarde, Yuki..."
    return`}
      />

      <h2>7. API completa para downloader custom</h2>

      <CommandTable
        title="Funções e helpers usados"
        variations={[
          { cmd: "renpy.fetch(url, headers={'Range':'bytes=0-1023'})", desc: "Download parcial — base do progresso real.", output: "bytes do chunk" },
          { cmd: "renpy.invoke_in_main_thread(fn, *args)", desc: "Executa fn no thread principal (UI).", output: "—" },
          { cmd: "renpy.start_predict(image)", desc: "Pré-carrega imagem em background (não baixa rede).", output: "—" },
          { cmd: "renpy.stop_predict(image)", desc: "Cancela predict.", output: "—" },
          { cmd: "renpy.start_predict_screen(name)", desc: "Pré-prepara screen.", output: "—" },
          { cmd: "renpy.loader.cleardirfiles()", desc: "Força re-scan de assets do disco.", output: "—" },
          { cmd: "renpy.loader.add_archive(path)", desc: "Carrega .rpa adicional em runtime.", output: "—" },
          { cmd: "renpy.timeout(N)", desc: "Agenda restart_interaction em N segundos.", output: "—" },
          { cmd: "hashlib.sha256(data).hexdigest()", desc: "Calcula checksum (validar download).", output: '"a1b2c3..."' },
        ]}
      />

      <h2>8. Estratégia de retry e backoff</h2>

      <CodeBlock
        language="python"
        title="game/downloader.rpy"
        code={`init python:
    import time

    def fetch_com_retry(url, max_tentativas=4, **kw):
        delay = 1.0
        for tentativa in range(1, max_tentativas + 1):
            try:
                return renpy.fetch(url, **kw)
            except renpy.fetch.FetchError as e:
                if tentativa == max_tentativas:
                    raise
                # backoff exponencial: 1s, 2s, 4s, 8s...
                renpy.log("Tentativa {} falhou: {}. Repete em {}s".format(
                    tentativa, e, delay
                ))
                time.sleep(delay)
                delay *= 2`}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Sobe um servidor local para testar download",
            cmd: "python -m http.server 8000 --directory ./packs_assets",
            out: `Serving HTTP on 0.0.0.0 port 8000 ...
127.0.0.1 - - [04/Apr/2026 14:32:11] "GET /manifest.json HTTP/1.1" 200 -
127.0.0.1 - - [04/Apr/2026 14:32:14] "GET /voice_pt-BR/pack.zip HTTP/1.1" 206 -
127.0.0.1 - - [04/Apr/2026 14:32:14] "GET /voice_pt-BR/pack.zip HTTP/1.1" 206 -
127.0.0.1 - - [04/Apr/2026 14:32:15] "GET /voice_pt-BR/pack.zip HTTP/1.1" 206 -`,
            outType: "info",
          },
          {
            comment: "No console do jogo (Shift+O)",
            cmd: 'd = baixar_pack({"id":"teste", "url":"http://localhost:8000/test.zip", "size_bytes":4096000})',
            out: `<PackDownloader at 0x7f3...>`,
            outType: "default",
          },
          {
            comment: "Acompanhe o progresso",
            cmd: "d.progress()",
            out: `0.4275`,
            outType: "success",
          },
        ]}
      />

      <PracticeBox
        title="Pack de voz baixado sob demanda"
        goal="Implementar download em chunks com progresso, validação SHA-256 e instalação automática de um ZIP de teste."
        steps={[
          "Suba 'python -m http.server 8000' em uma pasta com test.zip (~5MB).",
          "Em game/downloader.rpy crie a classe PackDownloader (copie do exemplo).",
          "No menu principal, adicione um botão 'Testar download' que chama iniciar_download().",
          "Mostre a screen download_progress com barra real subindo de 0% a 100%.",
          "Após terminar, o ZIP deve ser descompactado em game/packs/teste/ e o jogo notificar 'Pack instalado!'.",
        ]}
        verify="A barra evolui de 0% até 100% suavemente, depois aparece a notificação e o conteúdo do ZIP está em game/packs/teste/."
      />

      <OutputBlock label="quando usar cada API" type="info">
{`updater.Updater()                — patch do jogo principal (desktop only)
PackDownloader (renpy.fetch)     — assets grandes opcionais (Web/mobile/desktop)
renpy.start_predict()            — assets já presentes no disco; cache em RAM/GPU
renpy.loader.add_archive()       — carregar .rpa novo em runtime
zipfile.ZipFile().extractall()   — descompactar pack baixado`}
      </OutputBlock>

      <AlertBox type="warning" title="Server precisa suportar Range requests">
        Para download em chunks funcionar, o servidor TEM que responder
        com HTTP <strong>206 Partial Content</strong> ao header{" "}
        <code>Range</code>. Nginx, Apache, S3, R2 e Cloudflare suportam
        nativamente. Se o servidor responder 200 para tudo, o download
        cai no plano B: baixar inteiro de uma vez (sem barra real).
      </AlertBox>

      <AlertBox type="danger" title="Cuidado com diretórios persistentes em mobile">
        No Android, escrever em <code>config.basedir</code> NÃO é
        garantido — depende da política do dispositivo. Use{" "}
        <code>config.savedir</code> para conteúdo gravável persistente.
        No iOS, o sandbox é ainda mais restritivo. No Web, NÃO há disco
        — os packs precisam ir para <code>renpy.loader</code> em RAM
        usando <code>add_archive()</code> com bytes em memória.
      </AlertBox>

      <AlertBox type="success" title="Você terminou a seção Network!">
        Com Fetch + Screenshot + Updater + Downloader, o Sakura Café
        agora tem leaderboard online, share de fotos, patches automáticos
        e packs de voz sob demanda. Próxima seção:{" "}
        <strong>Plataformas Extras</strong> (iOS, ChromeOS, Raspberry
        Pi, IAP, Gestures).
      </AlertBox>
    </PageContainer>
  );
}
