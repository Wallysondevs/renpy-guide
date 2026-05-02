import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Skins() {
  return (
    <PageContainer
      title="Skins do Launcher Ren'Py"
      subtitle="Trocar o visual do PRÓPRIO Launcher (não do jogo) — fundo escuro, cor de destaque rosa pastel, fonte custom. Útil pra estúdio que quer passar identidade visual logo na hora de abrir o programa."
      difficulty="intermediario"
      timeToRead="10 min"
      prompt="tooling/skins"
    >
      <AlertBox type="info" title="Skin do LAUNCHER, não do jogo">
        Esta página NÃO é sobre customizar a UI do seu jogo (isso é{" "}
        <strong>GUI</strong> e <strong>Styles</strong>). É sobre mudar o
        visual da janela <em>onde você cria/lança projetos</em> — o Launcher
        é, ele mesmo, um jogo Ren'Py com tema próprio que pode ser sobrescrito.
      </AlertBox>

      <h2>1. Onde ficam as skins do Launcher</h2>

      <CodeBlock
        language="bash"
        title="estrutura interna do Launcher"
        code={`renpy-8.3.0-sdk/
└── launcher/
    ├── game/
    │   ├── script.rpy           ← código do Launcher (label start)
    │   ├── theme.rpy            ← cores e fontes ATUAIS
    │   ├── theme_light.rpy      ← skin "light" (padrão)
    │   ├── theme_dark.rpy       ← skin "dark"
    │   ├── theme_sakura.rpy     ← (criada por VOCÊ)
    │   ├── images/              ← logos e ícones
    │   └── gui/
    └── ...`}
      />

      <h2>2. Selecionando uma skin existente</h2>
      <p>
        Abra o Launcher → <strong>Preferences</strong> → role até{" "}
        <strong>"Theme"</strong> e escolha entre as opções existentes
        (light, dark, sakura). A mudança é instantânea e reinicia o Launcher
        automaticamente.
      </p>

      <Terminal
        path="~/renpy-8.3.0-sdk"
        lines={[
          {
            comment: "Lista todos os temas instalados no Launcher",
            cmd: "ls launcher/game/theme_*.rpy",
            out: `launcher/game/theme_light.rpy
launcher/game/theme_dark.rpy
launcher/game/theme_sakura.rpy`,
            outType: "info",
          },
          {
            comment: "Seleciona um tema via CLI sem abrir o Launcher",
            cmd: 'renpy.sh launcher --theme sakura',
            out: "Launcher reaberto com theme: sakura",
            outType: "success",
          },
        ]}
      />

      <h2>3. Anatomia de uma skin</h2>
      <p>
        Skins do Launcher são arquivos Python/Ren'Py simples que
        sobrescrevem variáveis de cor e fonte. Não precisa recompilar nada
        do SDK — basta o arquivo estar em <code>launcher/game/</code> e
        começar com <code>theme_</code>.
      </p>

      <CodeBlock
        language="python"
        title="launcher/game/theme_sakura.rpy"
        code={`# Skin "Sakura Café" — paleta rosa pastel para o Launcher.

init -100 python:
    THEME_NAME = "sakura"
    THEME_LABEL = _("Sakura Café (rosa pastel)")

    # Cores principais
    BACKGROUND        = "#fff5fa"      # rosa claríssimo
    PANEL             = "#ffe6f0"      # rosa pastel
    HOVER             = "#ff66aa"      # rosa vibrante
    ACCENT            = "#ffaacc"      # rosa principal
    TEXT              = "#553344"      # marrom escuro (alto contraste)
    TEXT_DIM          = "#996677"
    TEXT_INSENSITIVE  = "#cc99aa"
    DANGER            = "#cc3366"
    SUCCESS           = "#66cc99"

    # Fontes
    MAIN_FONT         = "fonts/SakuraSans-Regular.ttf"
    MAIN_FONT_BOLD    = "fonts/SakuraSans-Bold.ttf"
    MAIN_FONT_SIZE    = 16

    # Imagens
    LOGO              = "images/logo_sakura.png"
    BACKGROUND_IMAGE  = "images/bg_pattern_sakura.png"`}
      />

      <h2>4. Variáveis que VOCÊ pode sobrescrever</h2>

      <CommandTable
        title="API de skin do Launcher"
        variations={[
          { cmd: "BACKGROUND", desc: "Cor de fundo da janela do Launcher.", output: '"#fff5fa"' },
          { cmd: "PANEL", desc: "Painéis laterais (lista de projetos).", output: '"#ffe6f0"' },
          { cmd: "ACCENT", desc: "Cor principal de botões e destaques.", output: '"#ffaacc"' },
          { cmd: "HOVER", desc: "Cor quando o mouse passa por cima de botões.", output: '"#ff66aa"' },
          { cmd: "TEXT", desc: "Cor do texto principal.", output: '"#553344"' },
          { cmd: "TEXT_DIM", desc: "Texto secundário (sub-labels, hints).", output: '"#996677"' },
          { cmd: "TEXT_INSENSITIVE", desc: "Texto desabilitado (botão off).", output: '"#cc99aa"' },
          { cmd: "DANGER / SUCCESS", desc: "Cores semânticas para alertas.", output: '"#cc3366" / "#66cc99"' },
          { cmd: "MAIN_FONT", desc: "Caminho TTF da fonte principal.", output: '"fonts/SakuraSans-Regular.ttf"' },
          { cmd: "MAIN_FONT_SIZE", desc: "Tamanho base do texto do Launcher.", output: "16" },
          { cmd: "LOGO", desc: "Imagem do logo no topo.", output: '"images/logo_sakura.png"' },
          { cmd: "BACKGROUND_IMAGE", desc: "Imagem de fundo (padrão repetido).", output: '"images/bg_pattern_sakura.png"' },
        ]}
      />

      <h2>5. Adicionando ativos à skin</h2>
      <p>
        Coloque imagens em <code>launcher/game/images/</code> e fontes em{" "}
        <code>launcher/game/fonts/</code>. Use formatos otimizados (WebP,
        TTF/WOFF). Tamanhos sugeridos:
      </p>

      <OutputBlock label="dimensões recomendadas" type="info">
{`logo_sakura.png         → 256×64 px (PNG com transparência)
bg_pattern_sakura.png   → 256×256 px (tile que repete)
favicon                 → herda automaticamente do logo
fontes                  → Regular + Bold (não precisa Italic)`}
      </OutputBlock>

      <h2>6. Testando a skin localmente</h2>

      <Terminal
        path="~/renpy-8.3.0-sdk"
        lines={[
          {
            comment: "Reabre o Launcher já com a skin nova",
            cmd: "./renpy.sh launcher --theme sakura",
            out: "Launcher reiniciado em theme: sakura",
            outType: "success",
          },
          {
            comment: "Caso algo dê erro, força recarga e roda lint do próprio Launcher",
            cmd: "./renpy.sh launcher lint",
            out: `Statistics:
  The launcher project compiled successfully.
Lint took 0.21s. No problems found.`,
            outType: "success",
          },
          {
            comment: "Erro real: variável faltando na skin",
            cmd: "./renpy.sh launcher",
            out: `NameError: name 'PANEL' is not defined
  File "launcher/game/theme_sakura.rpy", line 14
Fix: declare PANEL no init -100 python.`,
            outType: "error",
          },
        ]}
      />

      <h2>7. Distribuindo a skin para a equipe</h2>
      <p>
        Empacote APENAS os arquivos novos da skin e mande para os colegas
        descompactarem dentro do <code>launcher/game/</code> deles:
      </p>

      <CodeBlock
        language="bash"
        title="empacotando a skin"
        code={`cd ~/renpy-8.3.0-sdk/launcher/game

# Cria tarball com a skin + assets
tar czf ~/skin-sakura-1.0.tar.gz \\
    theme_sakura.rpy \\
    images/logo_sakura.png \\
    images/bg_pattern_sakura.png \\
    fonts/SakuraSans-Regular.ttf \\
    fonts/SakuraSans-Bold.ttf

# Envie skin-sakura-1.0.tar.gz por Discord/email/etc.
# Quem receber:
cd ~/renpy-8.3.0-sdk/launcher/game
tar xzf ~/skin-sakura-1.0.tar.gz`}
      />

      <h2>8. Skin "Sakura Café modo noite" (exemplo completo)</h2>

      <CodeBlock
        language="python"
        title="launcher/game/theme_sakura_noite.rpy"
        code={`init -100 python:
    THEME_NAME  = "sakura_noite"
    THEME_LABEL = _("Sakura Café — modo noite")

    BACKGROUND        = "#1a0e14"      # quase preto, com tom rosado
    PANEL             = "#2a1a22"
    HOVER             = "#ff66aa"
    ACCENT            = "#ffaacc"
    TEXT              = "#fff5fa"
    TEXT_DIM          = "#cc99aa"
    TEXT_INSENSITIVE  = "#664455"
    DANGER            = "#ff5577"
    SUCCESS           = "#88ddaa"

    MAIN_FONT      = "fonts/SakuraSans-Regular.ttf"
    MAIN_FONT_BOLD = "fonts/SakuraSans-Bold.ttf"
    MAIN_FONT_SIZE = 16

    LOGO             = "images/logo_sakura_noite.png"
    BACKGROUND_IMAGE = "images/bg_pattern_noite.png"`}
      />

      <PracticeBox
        title="Crie a skin Sakura Café Pastel"
        goal="Aplicar uma skin rosa pastel ao Launcher do Ren'Py."
        steps={[
          "Crie launcher/game/theme_sakura.rpy com o bloco init -100 python: das variáveis acima.",
          "Coloque o logo (256×64 PNG) em launcher/game/images/logo_sakura.png.",
          "(Opcional) adicione uma fonte TTF em launcher/game/fonts/.",
          "Rode './renpy.sh launcher lint' e confirme zero erros.",
          "Selecione a skin em Preferences → Theme → Sakura Café.",
        ]}
        verify="Ao reabrir o Launcher, o fundo está rosa claríssimo, os botões rosa pastel e o logo do Sakura Café aparece no topo."
      />

      <AlertBox type="warning" title="Cuidado ao mexer no SDK">
        Skins ficam dentro de <code>renpy-8.x.x/launcher/game/</code> — se
        você atualizar o SDK para uma versão nova, suas skins podem ser
        sobrescritas. Mantenha um <code>~/skins-renpy/</code> versionado no
        git e re-aplique com um script após cada update do SDK.
      </AlertBox>

      <CodeBlock
        language="bash"
        title="scripts/reaplicar_skins.sh"
        code={`#!/usr/bin/env bash
# Re-aplica todas as skins do estúdio depois de atualizar o SDK
SDK="$HOME/renpy-8.3.0-sdk/launcher/game"
SKINS="$HOME/skins-renpy"

cp "$SKINS"/theme_*.rpy            "$SDK/"
cp -r "$SKINS"/images/*            "$SDK/images/"
cp -r "$SKINS"/fonts/*             "$SDK/fonts/" 2>/dev/null || true

echo "✅ Skins reaplicadas em $SDK"`}
      />

      <AlertBox type="success" title="Resumindo o ciclo de vida do Sakura Café Studio">
        Você já viu agora o ciclo completo: <strong>Template projects</strong>{" "}
        cria projeto, <strong>CLI</strong> compila/lint/build,{" "}
        <strong>Editor Integration</strong> escreve, <strong>Automated
        Testing</strong> valida, e <strong>Skins</strong> deixa até o Launcher
        com cara de Sakura Café. Isso fecha o ferramental do Ren'Py.
      </AlertBox>
    </PageContainer>
  );
}
