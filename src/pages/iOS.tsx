import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function IOS() {
  return (
    <PageContainer
      title="Build para iOS — Sakura Café no iPhone e iPad"
      subtitle="Como empacotar o jogo para iOS via rapt-ios + Xcode, gerar certificados, ícones, splash, subir no TestFlight e o que NÃO funciona em relação ao Android."
      difficulty="avancado"
      timeToRead="22 min"
      prompt="plataformas/ios"
    >
      <AlertBox type="warning" title="Pré-requisito real: você precisa de um Mac">
        A documentação oficial é vaga, mas o build iOS do Ren'Py
        <strong> só funciona em macOS</strong> porque depende do Xcode (que só
        roda em Mac) e dos toolchains da Apple. Não tem como compilar iOS no
        Windows ou Linux. Você também precisa de uma <strong>conta Apple
        Developer paga (US$ 99/ano)</strong> para subir no TestFlight ou App
        Store. Para testar no seu próprio iPhone como dev, conta gratuita
        funciona, mas o jogo expira em 7 dias.
      </AlertBox>

      <h2>1. Visão geral do pipeline</h2>
      <p>
        O fluxo completo de levar o <strong>Sakura Café</strong> do{" "}
        <code>script.rpy</code> até a App Store envolve três camadas: o
        Launcher do Ren'Py exporta um projeto <strong>rapt-ios</strong> (um
        wrapper Xcode), o Xcode compila esse projeto em um <code>.ipa</code>{" "}
        assinado, e o App Store Connect distribui via TestFlight ou
        publicação final.
      </p>

      <OutputBlock label="pipeline iOS resumido" type="info">
{`game/script.rpy + assets
        │
        ▼ (Launcher → "iOS")
rapt-ios/Sakura_Cafe.xcodeproj
        │
        ▼ (Xcode Build → Archive)
Sakura_Cafe.ipa  (assinado com seu certificado)
        │
        ▼ (Transporter ou Xcode "Distribute")
App Store Connect → TestFlight → App Store`}
      </OutputBlock>

      <h2>2. Instalando o módulo iOS no Ren'Py</h2>
      <p>
        Por padrão o Launcher só vem com Android. Para habilitar iOS, abra o
        Launcher, vá em <strong>"iOS"</strong> dentro de qualquer projeto e
        clique em <strong>"Install iOS Module"</strong>. Ele baixa{" "}
        <code>rapt-ios</code> (~120MB) para{" "}
        <code>~/.renpy/rapt-ios/</code>.
      </p>

      <Terminal
        path="~/Library/Application Support/RenPy/sakura-cafe"
        lines={[
          {
            comment: "Verifica se o módulo iOS foi instalado corretamente",
            cmd: "ls ~/.renpy/rapt-ios/",
            out: `prototype/  buildlib/  toolchain/  Xcode_template/  scripts/
LICENSE.txt  README.md  VERSION.txt`,
            outType: "success",
          },
          {
            comment: "Versão do toolchain iOS embutida",
            cmd: "cat ~/.renpy/rapt-ios/VERSION.txt",
            out: `Ren'Py iOS Module 8.2.3 (built 2026-03-12)
Targets: iOS 13.0+, arm64`,
            outType: "info",
          },
        ]}
      />

      <h2>3. Configurando bundle ID, versão e ícones</h2>
      <p>
        Antes de exportar, abra <code>game/options.rpy</code> e o painel iOS
        do Launcher. O <strong>Bundle Identifier</strong> precisa ser único
        no mundo (ex: <code>com.wallyson.sakuracafe</code>) e bater com o
        que você cadastrar no Apple Developer Portal.
      </p>

      <CodeBlock
        title="game/options.rpy"
        language="python"
        code={`define config.name = _("Sakura Café")
define config.version = "1.0.0"

# IMPORTANTE: build.name vira o nome interno do .ipa e da pasta
define build.name = "SakuraCafe"

# Configurações específicas do iOS — lidas pelo rapt-ios
init python:
    build.classify("game/saves/**", None)         # NÃO inclui saves do dev
    build.classify("**~", None)                   # Ignora backups do editor
    build.classify("**.bak", None)
    build.classify("**/.DS_Store", None)          # Lixo do macOS

    # Tudo abaixo entra no .ipa
    build.classify("game/**.rpy", "all")
    build.classify("game/**.rpyc", "all")
    build.classify("game/**.png", "all")
    build.classify("game/**.ogg", "all")
    build.classify("game/**.webm", "all")`}
      />

      <h2>4. Ícones e Splash — o que a Apple exige</h2>
      <p>
        A Apple é rigorosa: se faltar 1 ícone do conjunto, o build é
        rejeitado. Para o Sakura Café você precisa de 19 PNGs com tamanhos
        exatos (de 20×20 até 1024×1024). O Launcher tem um <strong>"Icon
        Generator"</strong> que recebe 1 PNG 1024×1024 e gera todos.
      </p>

      <CommandTable
        title="Ícones obrigatórios para iOS"
        variations={[
          { cmd: "20x20@1x", desc: "Notification iPad", output: "20×20" },
          { cmd: "20x20@2x", desc: "Notification iPhone/iPad Retina", output: "40×40" },
          { cmd: "20x20@3x", desc: "Notification iPhone Plus/Pro", output: "60×60" },
          { cmd: "29x29@1x", desc: "Settings iPad", output: "29×29" },
          { cmd: "29x29@2x", desc: "Settings Retina", output: "58×58" },
          { cmd: "29x29@3x", desc: "Settings iPhone Plus", output: "87×87" },
          { cmd: "40x40@1x", desc: "Spotlight iPad", output: "40×40" },
          { cmd: "40x40@2x", desc: "Spotlight Retina", output: "80×80" },
          { cmd: "40x40@3x", desc: "Spotlight iPhone Plus", output: "120×120" },
          { cmd: "60x60@2x", desc: "App Icon iPhone", output: "120×120" },
          { cmd: "60x60@3x", desc: "App Icon iPhone Plus", output: "180×180" },
          { cmd: "76x76@2x", desc: "App Icon iPad", output: "152×152" },
          { cmd: "83.5x83.5@2x", desc: "App Icon iPad Pro 12.9″", output: "167×167" },
          { cmd: "1024x1024@1x", desc: "Marketing — App Store", output: "1024×1024 (sem alpha!)" },
        ]}
      />

      <AlertBox type="danger" title="O ícone 1024×1024 NÃO pode ter transparência">
        Se o PNG marketing tiver canal alpha, o upload no App Store Connect
        falha com <code>ITMS-90717</code>. Remova com{" "}
        <code>convert icon.png -background white -alpha remove icon.png</code>.
      </AlertBox>

      <h2>5. Exportando o projeto Xcode</h2>

      <Terminal
        path="~/Library/Application Support/RenPy/sakura-cafe"
        lines={[
          {
            comment: "Pelo Launcher: iOS → Configure → Build (gera Xcode project)",
            cmd: 'renpy.sh launcher ios_build sakura-cafe',
            out: `Building Ren'Py distribution for iOS...
Compiling game scripts (412 .rpy files)... done
Copying assets (320MB)... done
Generating Info.plist... done
Generating LaunchScreen.storyboard... done
Xcode project written to:
  ~/RenpyBuilds/sakura-cafe/SakuraCafe.xcodeproj`,
            outType: "success",
          },
          {
            comment: "Abre o projeto no Xcode",
            cmd: "open ~/RenpyBuilds/sakura-cafe/SakuraCafe.xcodeproj",
            out: "(Xcode abre, projeto SakuraCafe carregado)",
            outType: "muted",
          },
        ]}
      />

      <h2>6. Assinatura: Team, Certificate, Provisioning Profile</h2>
      <p>
        No Xcode, com o projeto aberto, selecione o target{" "}
        <strong>SakuraCafe</strong> → aba <strong>Signing &amp;
        Capabilities</strong>. Marque <em>"Automatically manage signing"</em>{" "}
        e escolha seu Team. Se sua conta Apple Developer está ativa, o Xcode
        baixa o Provisioning Profile sozinho.
      </p>

      <CodeBlock
        title="Xcode → Signing & Capabilities (visualização)"
        language="yaml"
        code={`Target: SakuraCafe
  Bundle Identifier: com.wallyson.sakuracafe
  Team: Wallyson Devs (XXXXXXXXXX)  ← apareceu da conta Developer
  Provisioning Profile: iOS Team Provisioning Profile: com.wallyson.sakuracafe
  Signing Certificate: Apple Development: Wallyson (YYYYY)

Capabilities adicionadas:
  - GameKit (se usar achievements/leaderboards)
  - In-App Purchase (se for monetizar)
  - Push Notifications (se notificar "Sakura está esperando!")`}
      />

      <h2>7. Build, Archive e upload no TestFlight</h2>

      <Terminal
        path="~/RenpyBuilds/sakura-cafe"
        lines={[
          {
            comment: "Build via linha de comando (CI/CD)",
            cmd: `xcodebuild -project SakuraCafe.xcodeproj \\
  -scheme SakuraCafe \\
  -configuration Release \\
  -archivePath build/SakuraCafe.xcarchive \\
  archive`,
            out: `** ARCHIVE SUCCEEDED **
Archive saved to: build/SakuraCafe.xcarchive
Bundle: com.wallyson.sakuracafe (1.0.0 build 1)
Architectures: arm64`,
            outType: "success",
          },
          {
            comment: "Exporta o .ipa pronto para upload",
            cmd: `xcodebuild -exportArchive \\
  -archivePath build/SakuraCafe.xcarchive \\
  -exportOptionsPlist ExportOptions.plist \\
  -exportPath build/`,
            out: `Exported SakuraCafe.ipa (size: 312MB) to build/
2026-04-12 14:21:08.452 xcodebuild[8231]: Done.`,
            outType: "success",
          },
          {
            comment: "Upload no TestFlight via Transporter CLI",
            cmd: 'xcrun altool --upload-app -f build/SakuraCafe.ipa -t ios -u "wallyson@dev.com" -p "@keychain:AC_PASSWORD"',
            out: `Uploading SakuraCafe.ipa...
2026-04-12 14:25:12 [INFO] Validating asset...
2026-04-12 14:27:48 [INFO] Upload successful.
Build will appear in TestFlight in 5–15 minutes (after Apple processing).`,
            outType: "success",
          },
        ]}
      />

      <h2>8. O que NÃO funciona em iOS (vs Android)</h2>

      <CommandTable
        title="Limitações reais — descobertas pela comunidade"
        variations={[
          { cmd: "Live2D Cubism", desc: "Roda, mas FPS cai drasticamente em iPad antigo (A10).", output: "Use sprites estáticos como fallback." },
          { cmd: "renpy.fetch HTTP", desc: "iOS BLOQUEIA HTTP simples (App Transport Security).", output: "Use SOMENTE HTTPS com TLS 1.2+." },
          { cmd: "config.window resizable", desc: "Ignorado — iOS é sempre fullscreen.", output: "Não tente janela." },
          { cmd: "Movie .mkv", desc: "Apenas .webm vp8/vp9 e .mp4 H.264 funcionam.", output: "MKV não roda no iOS — converta com ffmpeg." },
          { cmd: "Persistent global", desc: "Sandboxed em ~/Library/Application Support/.", output: "Saves ficam isolados por instalação." },
          { cmd: "Custom fonts > 8MB", desc: "Memória limitada em iPhone SE (3GB total).", output: "Subset a fonte com pyftsubset." },
          { cmd: "Console (Shift+O)", desc: "Sem teclado físico padrão = inacessível.", output: "Compile com config.developer = False." },
        ]}
      />

      <h2>9. Performance: o que matar para rodar bem</h2>
      <p>
        iPhone SE 2020 (target mínimo razoável) tem 3GB de RAM. Sakura Café
        em 1080p com 4 sprites + parallax 3D engole 1.8GB sozinho. Estratégias:
      </p>

      <CodeBlock
        title="game/options.rpy — modo iOS otimizado"
        language="python"
        code={`init python:
    if renpy.ios:
        # Resolução interna 720p (escala para qualquer tela)
        config.screen_width = 1280
        config.screen_height = 720

        # Desliga model-based rendering pesado
        config.gl2 = True
        config.gl_clear_color = "#000"

        # Predict apenas 1 imagem à frente (default é 2)
        config.predict_statements = 1

        # Compressão de textura agressiva
        config.image_cache_size = 96   # MB (default 200)
        config.cache_surfaces = False

        # Desativa transições caras
        config.default_transition = Dissolve(0.2)`}
      />

      <PracticeBox
        title="Build seu primeiro .ipa do Sakura Café"
        goal="Empacotar o projeto, abrir no Xcode, fazer Archive e instalar via cabo no seu iPhone com conta gratuita."
        steps={[
          "No Mac, abra o Launcher Ren'Py e selecione 'sakura-cafe'.",
          "Clique em 'iOS' → 'Install iOS Module' (espera ~3min).",
          "Configure Bundle ID em iOS → 'Configure': com.SEUNOME.sakuracafe.",
          "Clique 'Build' — gera SakuraCafe.xcodeproj em ~/RenpyBuilds/.",
          "Abra no Xcode, conecte iPhone via USB, selecione seu device como destino.",
          "Em Signing, escolha sua Apple ID gratuita como Team.",
          "Pressione Cmd+R — Xcode compila e instala no iPhone.",
          "Em Ajustes → Geral → Gerenciamento de VPN e Dispositivos, autorize seu certificado dev.",
          "Abra o app no iPhone — Sakura te recebe!",
        ]}
        verify="O ícone do Sakura Café aparece na home do iPhone, abre, mostra o splash 'Sakura Café Studios' e cai no menu principal."
      />

      <h2>10. Submissão para a App Store — checklist final</h2>

      <CommandTable
        title="O que a revisão da Apple checa em VN"
        variations={[
          { cmd: "App Privacy", desc: "Declarar se coleta dado (analytics, crash report).", output: "Em App Store Connect → App Privacy." },
          { cmd: "Age Rating", desc: "VNs românticas geralmente 12+ ou 17+ (cenas sugestivas).", output: "Questionário no Connect." },
          { cmd: "Screenshots 6.7″", desc: "OBRIGATÓRIO 3 prints 1290×2796 (iPhone 15 Pro Max).", output: "Sem letterbox." },
          { cmd: "Screenshots 12.9″ iPad", desc: "Se suportar iPad, 3 prints 2048×2732.", output: "Senão, marque 'iPhone only'." },
          { cmd: "Privacy Policy URL", desc: "Link público — pode ser GitHub Pages.", output: "https://wallysondevs.github.io/sakura-privacy" },
          { cmd: "Suporte URL", desc: "Email ou página de contato.", output: "mailto:wallyson@dev.com" },
        ]}
      />

      <AlertBox type="danger" title="Razões mais comuns de rejeição (Sakura Café-style)">
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li><strong>Guideline 4.0 — Design:</strong> menus muito pequenos para
          tap (botão &lt; 44pt).</li>
          <li><strong>Guideline 5.1.1 — Privacy:</strong> esqueceu de declarar que
          o achievement Steam coleta nada.</li>
          <li><strong>Guideline 1.1 — Objectionable:</strong> rota de romance com
          personagem que parece menor de idade. Sakura precisa ter idade
          declarada (18+) explicitamente.</li>
          <li><strong>Guideline 2.1 — Crashes:</strong> bug ao rotacionar para
          paisagem em iPad. Trave orientação no Info.plist.</li>
        </ul>
      </AlertBox>

      <AlertBox type="success" title="Aprovado! E agora?">
        Após aprovação (~2-3 dias), libere via TestFlight para até 10.000
        beta-testers ou publique direto. Atualizações futuras seguem o mesmo
        ciclo: incremente <code>build.version</code> em <code>options.rpy</code>{" "}
        e <code>CFBundleVersion</code> no Xcode (Apple exige incremento
        monotônico).
      </AlertBox>
    </PageContainer>
  );
}
