import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Build() {
  return (
    <PageContainer
      title="Build & Distribuição — empacotando sua VN"
      subtitle="Do Launcher ao .zip pronto para o itch.io: como gerar distribuições para Windows, macOS e Linux, classificar arquivos com build.classify, assinar binários e mandar a Sakura Café para o mundo."
      difficulty="intermediario"
      timeToRead="14 min"
      prompt="build/distribuicoes"
    >
      <AlertBox type="info" title="O Ren'Py faz o trabalho duro por você">
        Diferente de Unity ou Godot, gerar distribuições no Ren'Py é
        literalmente um clique. O SDK já vem com o Python embutido para cada
        plataforma — você não precisa instalar nada extra para empacotar uma
        build Windows a partir do Linux, ou uma build Mac a partir do Windows.
        Tudo é cross-build de fábrica.
      </AlertBox>

      <h2>1. Visão geral: o que é uma "distribuição"?</h2>
      <p>
        Quando o seu jogo está rodando no Launcher, ele está sendo executado
        pelo SDK em modo desenvolvimento — com console, ferramentas de debug e
        os <code>.rpy</code> em texto puro. Uma <strong>distribuição</strong> é
        a versão fechada que o jogador instala: contém o engine compilado, os
        scripts já transformados em <code>.rpyc</code>, os assets empacotados
        em <code>.rpa</code> e o executável da plataforma alvo.
      </p>

      <CommandTable
        title="Tipos de distribuição que o Ren'Py 8 gera"
        variations={[
          {
            cmd: "PC: Windows/Linux/Mac",
            desc: "Pacote único universal — roda nas três plataformas. Recomendado para itch.io.",
            output: "SakuraCafe-1.0-pc.zip (~150 MB)",
          },
          {
            cmd: "Windows",
            desc: "Apenas o launcher .exe + libs Win — menor download para usuário Windows.",
            output: "SakuraCafe-1.0-win.zip (~90 MB)",
          },
          {
            cmd: "Linux",
            desc: "Inclui binário ELF x86_64 (sh launcher).",
            output: "SakuraCafe-1.0-linux.tar.bz2 (~85 MB)",
          },
          {
            cmd: "Macintosh",
            desc: "Bundle .app universal (arm64 + x86_64) já assinado para o Gatekeeper aceitar localmente.",
            output: "SakuraCafe-1.0-mac.zip (~110 MB)",
          },
          {
            cmd: "Market",
            desc: "Pacote para Steam — sem o updater interno, sem instaladores.",
            output: "SakuraCafe-1.0-market.zip",
          },
          {
            cmd: "Web",
            desc: "HTML5 + WASM — joga no navegador (ver página WebAndroid).",
            output: "SakuraCafe-1.0-web.zip",
          },
          {
            cmd: "Android / iOS",
            desc: "Requer setup adicional (RAPT/RAPK). Coberto na próxima página.",
            output: "SakuraCafe-1.0-release.apk",
          },
        ]}
      />

      <h2>2. Build pelo Launcher (o jeito visual)</h2>
      <p>
        Abra o Ren'Py Launcher, selecione o projeto <strong>Sakura Café</strong>{" "}
        na lista da esquerda e clique em <code>Build Distributions</code>. A
        janela de build aparece com checkboxes para cada plataforma. Marque{" "}
        <em>PC: Windows/Linux/Mac</em>, <em>Macintosh</em> e{" "}
        <em>Web</em>, depois clique em <code>Build</code>.
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "O Launcher chama isto por baixo dos panos",
            cmd: "renpy.exe launcher distribute sakura-cafe --package pc --package mac --package web",
            out: `I 04-25 14:32:01 distribute.py:142 Building distributions for sakura-cafe...
I 04-25 14:32:02 distribute.py:218 Scanning game/ for assets (1283 files, 412 MB)
I 04-25 14:32:04 distribute.py:301 Compiling .rpy -> .rpyc (37 scripts)
I 04-25 14:32:05 distribute.py:355 Packing archive game/scripts.rpa (8.2 MB)
I 04-25 14:32:08 distribute.py:355 Packing archive game/images.rpa (118.4 MB)
I 04-25 14:32:14 distribute.py:355 Packing archive game/audio.rpa (84.6 MB)
I 04-25 14:32:21 distribute.py:512 Building SakuraCafe-1.0-pc.zip ...
I 04-25 14:33:02 distribute.py:512 Building SakuraCafe-1.0-mac.zip ...
I 04-25 14:33:48 distribute.py:512 Building SakuraCafe-1.0-web.zip ...
I 04-25 14:34:11 distribute.py:780 Done. 3 packages in dists/ (total 412 MB)`,
            outType: "success",
          },
        ]}
      />

      <p>
        Os arquivos finais ficam em <code>~/projetos/sakura-cafe/dists/</code>.
        É só compactar e subir.
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe/dists"
        lines={[
          {
            cmd: "ls -lh",
            out: `total 412M
-rw-r--r-- 1 dev dev 152M Apr 25 14:33 SakuraCafe-1.0-pc.zip
-rw-r--r-- 1 dev dev 116M Apr 25 14:33 SakuraCafe-1.0-mac.zip
-rw-r--r-- 1 dev dev 144M Apr 25 14:34 SakuraCafe-1.0-web.zip`,
            outType: "info",
          },
        ]}
      />

      <h2>3. Configurando o build no <code>options.rpy</code></h2>
      <p>
        Antes de empacotar de verdade, configure metadados básicos. Tudo isso
        vai virar o nome do <code>.zip</code>, a janela do executável e o ID
        usado pelos saves persistentes:
      </p>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`## Identificação do jogo --------------------------------
define config.name = _("Sakura Café")
define config.version = "1.0.0"

## Texto de "About" no menu principal --------------------
define gui.about = _p("""
    Uma Visual Novel sobre amizade, café e segundas chances.
    Roteiro: Yuki Tanaka
    Arte: Mei Aoyama
    Música: Rin Composer
    Engine: Ren'Py 8.2
""")

## Identificador único para saves (não mude depois!) -----
define build.name = "SakuraCafe"

## Ícone do executável Windows / Mac ---------------------
define config.window_icon = "gui/window_icon.png"

## Saves persistentes — namespace -----------------------
define config.save_directory = "SakuraCafe-1638492110"`}
      />

      <AlertBox type="warning" title="Cuidado com build.name e save_directory">
        Esses dois valores não devem mudar depois que a primeira pessoa baixar
        a 1.0. Se mudarem, os saves dela viram lixo (o Ren'Py procura saves em{" "}
        <code>~/RenPy/&lt;save_directory&gt;</code> e o jogador perde o
        progresso). Defina-os UMA vez e deixe quietos para sempre.
      </AlertBox>

      <h2>4. Classificando arquivos com <code>build.classify</code></h2>
      <p>
        Por padrão o Ren'Py inclui tudo da pasta <code>game/</code> em todas as
        builds. Isso inflao distribuição com PSDs, sketches, READMEs internos e
        notas de roteiro. Use <code>build.classify</code> para definir o que
        entra em qual pacote (ou exclui de todos):
      </p>

      <CodeBlock
        language="python"
        title="game/options.rpy — bloco init python"
        code={`init python:
    ## Excluir totalmente do build final ----------------
    build.classify("**.psd", None)
    build.classify("**.kra", None)
    build.classify("**.bak", None)
    build.classify("**.xcf", None)
    build.classify("**/.DS_Store", None)
    build.classify("**/Thumbs.db", None)
    build.classify("game/scripts/_dev_notes.txt", None)

    ## Tudo de game/ vai para "all" (universal) --------
    build.classify("game/**.rpy", "all")
    build.classify("game/**.rpyc", "all")
    build.classify("game/**.png", "all")
    build.classify("game/**.jpg", "all")
    build.classify("game/**.ogg", "all")

    ## Voice acting só na build PC (peso alto) ---------
    build.classify("game/voice/**", "pc mac linux")

    ## Empacotar imagens em archive (mais rápido p/ HDD)
    build.archive("images", "all")
    build.classify("game/images/**", "images")

    build.archive("audio", "all")
    build.classify("game/audio/**", "audio")`}
      />

      <CommandTable
        title="Grupos de build padrão do Ren'Py"
        variations={[
          {
            cmd: "all",
            desc: "Vai para qualquer distribuição que contenha o jogo (basicamente todas).",
          },
          {
            cmd: "windows",
            desc: "Só na build Windows.",
          },
          {
            cmd: "mac",
            desc: "Só na build macOS.",
          },
          {
            cmd: "linux",
            desc: "Só na build Linux.",
          },
          {
            cmd: "pc",
            desc: "Atalho para windows + linux.",
          },
          {
            cmd: "web",
            desc: "Só na build HTML5/WASM.",
          },
          {
            cmd: "android",
            desc: "Só na APK / AAB.",
          },
          {
            cmd: "None",
            desc: "Excluído de todas as builds (segundo argumento Python None).",
          },
        ]}
      />

      <h2>5. Estrutura interna de uma build PC</h2>
      <p>
        Curiosos podem descompactar o <code>.zip</code> e olhar — vai entender
        muito sobre como o engine pensa:
      </p>

      <OutputBlock label="unzip -l SakuraCafe-1.0-pc.zip | head -30" type="info">
{`SakuraCafe-1.0-pc/
├── SakuraCafe.exe              # launcher Windows (gera o processo Python)
├── SakuraCafe.sh               # launcher Linux/Mac shell
├── SakuraCafe.py               # script bootstrap em Python
├── README.html                 # readme público (opcional)
├── lib/
│   ├── py3-windows-x86_64/     # Python 3.11 + libs nativas Win64
│   ├── py3-linux-x86_64/       # Python 3.11 + libs ELF Linux
│   └── py3-mac-universal/      # Python 3.11 universal (arm64+x86_64)
├── renpy/                      # código-fonte do engine
│   ├── audio/  display/  exports.py  ...
│   └── common/                 # screens, gui base, traduções engine
└── game/
    ├── script.rpyc             # scripts COMPILADOS (sem .rpy plain)
    ├── images.rpa              # archive empacotado (todos os PNGs)
    ├── audio.rpa               # archive empacotado (todas as OGGs)
    └── gui/                    # imagens da interface (textbox, namebox, ...)`}
      </OutputBlock>

      <AlertBox type="info" title="Os .rpy somem na build final?">
        Sim. Por padrão o build envia apenas <code>.rpyc</code> (bytecode
        compilado). Se quiser distribuir o código-fonte para mods, adicione{" "}
        <code>build.include_old_themes = False</code> e{" "}
        <code>build.classify("game/**.rpy", "all")</code> manualmente.
      </AlertBox>

      <h2>6. Assinando binários (opcional, mas recomendado)</h2>
      <p>
        Sem assinatura digital, o Windows mostra o aviso <em>"SmartScreen
        impediu um aplicativo não reconhecido"</em> e o macOS recusa abrir
        ("desenvolvedor não verificado"). Para evitar isso:
      </p>

      <h3>Windows — code signing</h3>
      <CodeBlock
        language="bash"
        title="terminal — assinatura SignTool (após gerar a build)"
        code={`# Você precisa de um certificado EV ou OV de uma CA (Sectigo, DigiCert, ~$200/ano)
signtool sign /f minha-chave.pfx /p SENHA \\
  /tr http://timestamp.digicert.com /td sha256 /fd sha256 \\
  dists/SakuraCafe-1.0-pc/SakuraCafe.exe

# Verificar
signtool verify /pa /v SakuraCafe.exe`}
      />

      <h3>macOS — notarization</h3>
      <CodeBlock
        language="bash"
        title="terminal — codesign + notarytool (Apple Developer ID, $99/ano)"
        code={`# 1. Assinar o .app
codesign --deep --force --options=runtime \\
  --sign "Developer ID Application: Seu Nome (TEAMID)" \\
  dists/SakuraCafe-1.0-mac/SakuraCafe.app

# 2. Empacotar em .zip para enviar à Apple
cd dists/SakuraCafe-1.0-mac
ditto -c -k --keepParent SakuraCafe.app SakuraCafe.zip

# 3. Submeter à notarização
xcrun notarytool submit SakuraCafe.zip \\
  --apple-id "voce@email.com" \\
  --team-id TEAMID --password APP_SPECIFIC_PASS \\
  --wait

# 4. Grampear o ticket no .app
xcrun stapler staple SakuraCafe.app`}
      />

      <AlertBox type="warning" title="Vale a pena pagar por assinatura?">
        Para um VN indie de jam: não. O usuário aceita o aviso uma vez. Para
        uma VN comercial em loja própria fora da Steam (Steam assina por
        você): vale, melhora muito a taxa de conversão de download → instalado.
      </AlertBox>

      <h2>7. Updater interno (Web Updater)</h2>
      <p>
        Se você publica fora da Steam/itch.io, o Ren'Py tem um sistema próprio
        de updates. No Launcher: <code>Build &gt; Add From Web</code>, gera os
        arquivos de update no <code>dists/sakura-cafe-updates/</code>, e você
        sobe num servidor HTTP qualquer (S3, Netlify, GitHub Pages):
      </p>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`## URL onde o updater vai procurar updates
define updater.url = "https://updates.sakuracafe.dev/"

## Permite ao jogador chamar o updater do menu principal
define config.has_autosave = True
define build.directory_name = "SakuraCafe-1.0"`}
      />

      <PracticeBox
        title="Sua primeira distribuição PC"
        goal="Gerar a build PC universal da Sakura Café e descompactar para conferir o tamanho final."
        steps={[
          "Abra o Launcher e selecione o projeto sakura-cafe.",
          "Em options.rpy, defina config.name, config.version e build.name conforme mostrado acima.",
          "Adicione um bloco init python com pelo menos 3 build.classify(..., None) para excluir .psd, .bak e _dev_notes.",
          "Clique em Build Distributions, marque apenas 'PC: Windows/Linux/Mac' e clique Build.",
          "Abra a pasta dists/ e descompacte o .zip em uma pasta de teste.",
          "Rode SakuraCafe.exe (Windows) ou ./SakuraCafe.sh (Linux/Mac) e confirme que o jogo abre.",
        ]}
        verify="Se o tamanho final ficou abaixo de 500 MB e o jogo abre sem erros, está perfeito. Se passou de 1 GB, revise build.classify e adicione exclusões para PSDs/sketches."
      />

      <h2>8. Comparativo de tamanhos típicos</h2>
      <CommandTable
        title="Tamanho médio de distribuição por tipo de VN"
        variations={[
          {
            cmd: "Kinetic novel curta (1h)",
            desc: "5 sprites, 3 BGs, 2 músicas, sem voice.",
            output: "PC zip: ~80 MB",
          },
          {
            cmd: "VN comum (8h)",
            desc: "12 sprites com 4 expressões cada, 15 BGs, 25 tracks.",
            output: "PC zip: ~250 MB",
          },
          {
            cmd: "VN com voice acting (8h)",
            desc: "Mesmo conteúdo + 4000 linhas dubladas em OGG q=4.",
            output: "PC zip: ~1.2 GB",
          },
          {
            cmd: "VN AAA tipo Steins;Gate",
            desc: "+ vídeos pré-renderizados, dual audio JP/EN.",
            output: "PC zip: 3-5 GB",
          },
        ]}
      />

      <PracticeBox
        title="Excluindo arquivos pesados de desenvolvimento"
        goal="Reduzir o tamanho da distribuição em pelo menos 30% removendo arquivos que não vão para o jogador."
        steps={[
          "Liste tudo da pasta game/ que pesa mais que 5 MB com: du -ah game/ | sort -h | tail -20",
          "Identifique candidatos óbvios: PSDs, sketches em alta resolução, WAVs sem comprimir, vídeos brutos.",
          "Adicione build.classify(\"game/_psd/**\", None) para cada pasta de desenvolvimento.",
          "Mova WAVs para a pasta /sketches/ (excluída do build) e mantenha apenas as versões OGG comprimidas em /audio/.",
          "Rode o build novamente e compare o novo tamanho.",
        ]}
        verify="Compare dists/SakuraCafe-1.0-pc.zip antes e depois. A redução típica é de 30-60%."
      />

      <AlertBox type="success" title="Pronto para distribuir!">
        Com o <code>.zip</code> em mãos, você está a um upload de distância de
        ter a sua VN no mundo. Próxima parada: itch.io (web), Google Play
        (Android) e Steam (com o steamworks SDK). Tudo isso na próxima página.
      </AlertBox>
    </PageContainer>
  );
}
