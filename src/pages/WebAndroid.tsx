import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function WebAndroid() {
  return (
    <PageContainer
      title="Web & Android — publicando além do PC"
      subtitle="Build HTML5 para itch.io, build APK assinado para Google Play, geração de keystore, RAPT (Ren'Py Android Packaging Tool) e os custos reais de cada loja."
      difficulty="avancado"
      timeToRead="18 min"
      prompt="build/web-android"
    >
      <AlertBox type="info" title="Por que ir além do PC?">
        Pesquisa do itch.io de 2024 mostra que <strong>VNs jogadas no
        navegador</strong> recebem em média 4× mais cliques que builds
        desktop, e Android é o segundo maior mercado de VN comercial atrás do
        PC. Estar nesses dois canais multiplica o alcance da Sakura Café.
      </AlertBox>

      <h2>1. Build Web (HTML5 + WebAssembly)</h2>
      <p>
        Desde o Ren'Py 8, o build Web usa <strong>Emscripten</strong> para
        rodar Python no navegador via WASM. O resultado é uma pasta com{" "}
        <code>index.html</code>, <code>game.wasm</code> e os assets — sobe em
        qualquer servidor estático.
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Primeiro instale o Web Distribution add-on no Launcher",
            cmd: "renpy.exe launcher install_web",
            out: `Downloading web.zip (24.8 MB)...
Extracting to /opt/renpy-8.2/web/...
Web distribution support installed.`,
            outType: "success",
          },
          {
            comment: "Agora gere a build",
            cmd: "renpy.exe launcher distribute sakura-cafe --package web",
            out: `I 04-25 15:11:02 distribute.py:142 Building web distribution...
I 04-25 15:11:14 web.py:88 Optimizing PNGs for web (lossless)
I 04-25 15:11:42 web.py:106 Converting OGG -> Opus 96kbps for streaming
I 04-25 15:12:18 web.py:201 Compiling .rpyc -> wasm-compatible bytecode
I 04-25 15:12:55 distribute.py:780 Done. dists/SakuraCafe-1.0-web.zip (144 MB)`,
            outType: "success",
          },
          {
            cmd: "unzip -l dists/SakuraCafe-1.0-web.zip | head -10",
            out: `Archive:  dists/SakuraCafe-1.0-web.zip
SakuraCafe-1.0-web/
SakuraCafe-1.0-web/index.html       (8.4 KB)
SakuraCafe-1.0-web/web.wasm         (32.1 MB)
SakuraCafe-1.0-web/renpy.js         (412 KB)
SakuraCafe-1.0-web/game.zip         (109 MB)
SakuraCafe-1.0-web/icon.png
SakuraCafe-1.0-web/progress.css`,
            outType: "info",
          },
        ]}
      />

      <h3>Testando localmente</h3>
      <p>
        Você não pode abrir <code>index.html</code> direto no navegador (CORS
        bloqueia o WASM via <code>file://</code>). Suba um servidor HTTP
        simples:
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe/dists/SakuraCafe-1.0-web"
        lines={[
          {
            cmd: "python3 -m http.server 8000",
            out: `Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
127.0.0.1 - - [25/Apr/2026 15:15:32] "GET / HTTP/1.1" 200 -
127.0.0.1 - - [25/Apr/2026 15:15:32] "GET /web.wasm HTTP/1.1" 200 -
127.0.0.1 - - [25/Apr/2026 15:15:34] "GET /game.zip HTTP/1.1" 200 -`,
            outType: "info",
          },
        ]}
      />

      <p>
        Agora abra <code>http://localhost:8000</code> no Chrome ou Firefox. A
        Sakura Café vai aparecer com uma barra de progresso enquanto baixa o
        WASM e os assets, depois entra no menu principal normalmente.
      </p>

      <h3>Otimizações específicas para web</h3>
      <CodeBlock
        language="python"
        title="game/options.rpy — bloco de configuração web"
        code={`init python:
    ## Reduzir resolução das imagens NA build web (mantém PC alto)
    build.classify("game/images/bg/**.png", "all")
    build.classify("game/images/bg/web/**.jpg", "web")

    ## Excluir voice acting do build web (peso alto demais para mobile data)
    build.classify("game/voice/**", "pc mac linux")

    ## Forçar formato Opus (50% menor que OGG Vorbis)
    define config.web_audio_format = "opus"

    ## Pré-carregar assets em ordem de uso (evita stutter no primeiro diálogo)
    define config.predict_statements = 30`}
      />

      <h2>2. Publicando no itch.io</h2>
      <p>
        O itch.io aceita o ZIP web como upload direto e roda no navegador. É a
        forma mais barata e rápida de ter sua VN no ar:
      </p>

      <CommandTable
        title="Passo a passo no itch.io"
        variations={[
          {
            cmd: "1. Criar conta",
            desc: "Acesse itch.io/register — gratuito.",
            output: "Você ganha 0% de taxa por padrão (modelo opcional 0-30%).",
          },
          {
            cmd: "2. Create New Project",
            desc: "Tipo: HTML, Kind of project: HTML.",
            output: "Marque 'This file will be played in the browser'.",
          },
          {
            cmd: "3. Upload do ZIP",
            desc: "Arraste SakuraCafe-1.0-web.zip — o itch descompacta sozinho.",
            output: "Aceita arquivos até 1 GB no plano grátis.",
          },
          {
            cmd: "4. Embed options",
            desc: "Resolution: 1920x1080 (ou 1280x720 para baixar mais rápido).",
            output: "Marque 'Mobile friendly' se sua GUI for responsiva.",
          },
          {
            cmd: "5. Pricing",
            desc: "Free, Paid (mínimo $1) ou No payments (donations).",
            output: "Itch fica com 10% por padrão (você ajusta de 0 a 100%).",
          },
          {
            cmd: "6. Publish",
            desc: "Status: Public ou Restricted (link secreto para playtesters).",
            output: "URL final: sakura-studio.itch.io/sakura-cafe",
          },
        ]}
      />

      <AlertBox type="success" title="Butler: subir builds via CLI">
        O <code>butler</code> (CLI oficial do itch) é maravilhoso para CI/CD.
        Após instalar e fazer login: <code>butler push dists/SakuraCafe-1.0-web.zip seu-user/sakura-cafe:web</code>{" "}
        — sobe a build em segundos e cria um channel "web" automaticamente.
      </AlertBox>

      <h2>3. Build Android — o setup do RAPT</h2>
      <p>
        RAPT (<em>Ren'Py Android Packaging Tool</em>) baixa o NDK do Android,
        configura o JDK e gera APK/AAB. É um download grande (~2 GB no
        primeiro uso) mas só precisa fazer uma vez.
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Pré-requisitos: JDK 17 e Python 3.11",
            cmd: "java --version && python3 --version",
            out: `openjdk 17.0.10 2024-01-16
Python 3.11.7`,
            outType: "info",
          },
          {
            comment: "Instalar suporte Android pelo Launcher",
            cmd: "renpy.exe launcher android_install",
            out: `Downloading Android SDK (1.2 GB)...
Downloading Android NDK (823 MB)...
Downloading JDK companion (124 MB)...
Setting up RAPT in /opt/renpy-8.2/rapt/...
Accepting Android SDK licenses...
RAPT installed successfully.`,
            outType: "success",
          },
        ]}
      />

      <h3>Configurando metadados Android</h3>
      <p>
        No Launcher, clique em <code>Android &gt; Configure</code>. Vai
        perguntar:
      </p>

      <OutputBlock label="ren'py launcher → android configure" type="info">
{`Application Name: Sakura Café
Package Name: com.sakurastudio.sakuracafe
        (formato Java reverso, MINÚSCULAS, sem traços, único na Play Store)
Version: 1.0.0
Numeric Version: 1
        (Play Store usa esse número para detectar updates — incremente sempre)
Orientation: Landscape (ou Sensor para girar livre)
Permissions: [x] Internet [ ] Vibrate [ ] Read External Storage
Expansion APK: No (apenas se ultrapassar 150 MB no AAB)`}
      </OutputBlock>

      <h3>Gerando o keystore (assinatura Android)</h3>
      <p>
        A Play Store exige que todo APK seja assinado com a mesma chave
        privada para sempre — perdeu a chave, perdeu o app. Faça backup
        triplo do <code>.keystore</code>:
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Gerar keystore (válido por 25 anos — exigência Google)",
            cmd: `keytool -genkey -v -keystore sakura-release.keystore -alias sakura -keyalg RSA -keysize 2048 -validity 9125`,
            out: `Enter keystore password: ********
Re-enter new password: ********
What is your first and last name? Yuki Tanaka
What is the name of your organizational unit? Sakura Studio
What is the name of your organization? Sakura Studio
What is the name of your City or Locality? São Paulo
What is the name of your State or Province? SP
What is the two-letter country code for this unit? BR
Is CN=Yuki Tanaka, OU=Sakura Studio, O=Sakura Studio, L=São Paulo, ST=SP, C=BR correct? yes
Generating 2,048 bit RSA key pair and self-signed certificate (SHA384withRSA) with a validity of 9,125 days
[Storing sakura-release.keystore]`,
            outType: "success",
          },
          {
            comment: "BACKUP em local seguro AGORA — não no repositório!",
            cmd: "cp sakura-release.keystore ~/Drive-Pessoal/keystores/",
            outType: "warning",
          },
        ]}
      />

      <AlertBox type="danger" title="Perdeu o keystore = perdeu o app">
        Se você perder a senha ou o arquivo <code>.keystore</code>, NUNCA mais
        consegue publicar uma atualização do mesmo app. Você precisa criar um
        novo <code>package_name</code> e fazer todos os jogadores baixarem do
        zero. Backup em 3 lugares: drive pessoal, drive físico e gerenciador
        de senhas. Adicione <code>*.keystore</code> ao <code>.gitignore</code>.
      </AlertBox>

      <h3>Gerando o APK / AAB</h3>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "AAB (Android App Bundle) — formato exigido pela Play Store desde 2021",
            cmd: "renpy.exe launcher android_build sakura-cafe release_bundle",
            out: `I 04-25 16:08:12 android.py:201 Building Android App Bundle...
I 04-25 16:08:14 android.py:288 Compiling Python sources for arm64-v8a + armeabi-v7a
I 04-25 16:09:02 android.py:355 Packing assets into base.aab/assets/
I 04-25 16:09:48 android.py:412 Signing with sakura-release.keystore
I 04-25 16:09:51 android.py:480 zipalign + apksigner verify -> OK
I 04-25 16:09:52 android.py:512 Done: dists/sakura-cafe-release.aab (118 MB)`,
            outType: "success",
          },
          {
            comment: "APK (sideload, distribuição fora da Play Store)",
            cmd: "renpy.exe launcher android_build sakura-cafe release",
            out: `I 04-25 16:10:14 android.py:201 Building APK release...
I 04-25 16:11:02 android.py:512 Done: dists/sakura-cafe-release.apk (132 MB)`,
            outType: "success",
          },
          {
            comment: "Instalar diretamente no device conectado via ADB",
            cmd: "adb install dists/sakura-cafe-release.apk",
            out: `Performing Streamed Install
Success`,
            outType: "success",
          },
        ]}
      />

      <h2>4. Publicando na Google Play</h2>

      <CommandTable
        title="Custos e burocracia da Play Store"
        variations={[
          {
            cmd: "Conta Google Play Console",
            desc: "Pagamento único de US$ 25 para criar conta de desenvolvedor.",
            output: "Pago via cartão internacional. Aceita CNPJ ou CPF.",
          },
          {
            cmd: "Verificação de identidade (2024+)",
            desc: "Selfie + documento — leva 2-7 dias.",
            output: "Sem isso, app fica preso em rascunho.",
          },
          {
            cmd: "Política de privacidade",
            desc: "URL pública obrigatória, mesmo que só diga 'não coletamos nada'.",
            output: "Use generator: app-privacy-policy-generator.firebaseapp.com",
          },
          {
            cmd: "Classificação etária",
            desc: "IARC questionário — VNs românticas geralmente saem T (Teen) ou M (Mature).",
            output: "Resposta em 1 hora.",
          },
          {
            cmd: "Screenshots obrigatórios",
            desc: "Mínimo 2 por categoria: phone, 7\" tablet, 10\" tablet.",
            output: "Resolução: 16:9 ou 9:16 PNG/JPG.",
          },
          {
            cmd: "Ícone de alta resolução",
            desc: "512x512 PNG (loja) + 1024x500 (feature graphic).",
            output: "O ícone do app dentro do AAB já vem do Ren'Py.",
          },
          {
            cmd: "Taxa por venda",
            desc: "Google fica com 15% (primeiro $1M/ano) ou 30% (acima).",
            output: "Free apps não pagam taxa.",
          },
          {
            cmd: "Tempo de revisão",
            desc: "Primeira submissão: 3-7 dias. Updates: minutos a 24h.",
            output: "Categorias 'romance' às vezes vão para revisão manual.",
          },
        ]}
      />

      <h2>5. iOS — uma palavra honesta</h2>
      <AlertBox type="warning" title="iOS é caro e sofrido">
        Ren'Py 8 suporta iOS via Xcode, mas o caminho exige: Mac com macOS
        Sonoma, Apple Developer Program (US$ 99/ano), Xcode 15+, certificados
        provisionados, TestFlight, e revisão notoriamente picky da App Store
        (recusas comuns: "VN parece app de chat fake", "imagens pixel art
        violam diretrizes"). A maioria dos devs indie de VN PULA iOS e foca em
        PC + Web + Android. Considere bem o ROI antes de investir.
      </AlertBox>

      <PracticeBox
        title="Sua primeira build Web rodando localmente"
        goal="Gerar a build web da Sakura Café e jogar no Chrome em http://localhost:8000."
        steps={[
          "No Launcher, clique em Android &gt; Install Web Support (caso ainda não tenha).",
          "Selecione o projeto sakura-cafe e clique Build Distributions.",
          "Marque APENAS 'Web' e clique Build. Espere 2-5 minutos.",
          "No terminal: cd dists/SakuraCafe-1.0-web && python3 -m http.server 8000",
          "Abra Chrome em http://localhost:8000 e jogue o início da Sakura Café.",
          "Abra o DevTools (F12) e veja se há warnings de WASM ou assets faltando.",
        ]}
        verify="Se a tela do menu principal carrega em menos de 30 segundos numa conexão local e você consegue clicar em 'Iniciar', a build web está funcional."
      />

      <PracticeBox
        title="Gerar APK debug e instalar no celular"
        goal="Compilar um APK debug (sem keystore real) e instalar via ADB no seu celular Android."
        steps={[
          "Habilite no celular: Configurações > Sobre > tocar 7× em 'Número da versão' e depois Opções do Desenvolvedor > Depuração USB.",
          "Conecte o celular via USB e rode: adb devices — deve aparecer com 'device' ao lado.",
          "No Launcher, configure o pacote: com.exemplo.sakuracafe.",
          "Clique Android > Build > Debug. Espere ~3 minutos.",
          "adb install dists/sakura-cafe-debug.apk",
          "Abra o app pelo gaveta de aplicativos no celular.",
        ]}
        verify="Se o ícone Sakura Café aparece no celular e o jogo abre em landscape com toque funcionando, está perfeito."
      />

      <h2>6. Plataformas extras (resumo rápido)</h2>
      <CommandTable
        title="Outras lojas que aceitam Ren'Py"
        variations={[
          {
            cmd: "Steam",
            desc: "Steamworks SDK + Direct ($100 único). Maior alcance comercial.",
            output: "Use o build 'market' (sem updater interno).",
          },
          {
            cmd: "GOG",
            desc: "Curado, exige aprovação prévia. Fica com 30%.",
            output: "Bom para VNs ocidentais retrô.",
          },
          {
            cmd: "DLsite (Japão)",
            desc: "Mercado japonês — exige tradução JP e versão all-ages + 18+.",
            output: "Maior plataforma de VN comercial do mundo.",
          },
          {
            cmd: "Amazon App Store",
            desc: "Aceita o mesmo APK da Play Store, taxa 20%.",
            output: "Alcance Fire tablets e Kindle Fire.",
          },
          {
            cmd: "F-Droid",
            desc: "Loja Android open-source — exige APK assinado por eles.",
            output: "Apenas para VNs FOSS sem assets proprietários.",
          },
        ]}
      />

      <AlertBox type="info" title="Estratégia de lançamento recomendada">
        <strong>Fase 1 (semana 1):</strong> itch.io web grátis + tweet de
        anúncio. Coleta feedback inicial. <strong>Fase 2 (mês 1):</strong>{" "}
        publica no Google Play (US$ 2,99) — testa monetização. <strong>Fase 3
        (mês 3):</strong> abre página Steam Coming Soon, faz wishlist farming
        em jams. <strong>Fase 4 (mês 6):</strong> lança Steam com versão
        ampliada (rotas extras, voice). Esse é o playbook clássico de VN
        indie de sucesso.
      </AlertBox>
    </PageContainer>
  );
}
