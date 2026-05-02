import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Splashscreen() {
  return (
    <PageContainer
      title="Splashscreen — abertura do jogo"
      subtitle="O label splashscreen, presplash.png/webp para Android e iOS, animações iniciais com fade. Logo 'Sakura Café Studios' antes do menu principal, sem que o jogador veja tela preta."
      difficulty="iniciante"
      timeToRead="12 min"
      prompt="visual/splashscreen"
    >
      <AlertBox type="info" title="Splash existe em DOIS níveis">
        Iniciantes confundem. <strong>Pre-splash</strong> é a imagem
        ESTÁTICA mostrada pelo SO enquanto a engine ainda nem carregou
        (arquivo <code>presplash.png</code>). <strong>Splashscreen</strong>{" "}
        é o label Ren'Py que roda DEPOIS da engine subir, antes do menu
        principal — e pode ter vídeo, fade, música. Você vai querer os
        DOIS para uma abertura profissional.
      </AlertBox>

      <h2>1. Pre-splash — a primeira imagem do executável</h2>
      <p>
        Quando o jogador clica no ícone do jogo, antes de aparecer a
        janela do Ren'Py, o SO mostra a <strong>presplash</strong>. Sem
        ela, o jogador vê tela preta por 1-3 segundos.
      </p>

      <OutputBlock label="onde colocar — game/" type="info">
{`game/
├── presplash.png       ← desktop (Windows / Linux / macOS)
├── presplash.webp      ← alternativa moderna (Android prefere)
├── android-presplash.png   ← OPCIONAL: específico Android (override)
└── ios-presplash.png       ← OPCIONAL: específico iOS`}
      </OutputBlock>

      <AlertBox type="warning" title="Tamanho recomendado da presplash">
        Use a MESMA resolução do projeto (geralmente 1920x1080). Em mobile
        a engine reescala automaticamente, mas se você fornecer{" "}
        <code>android-presplash.png</code> em 1080x1920 (vertical), fica
        perfeito sem barras pretas.
      </AlertBox>

      <h2>2. Splashscreen label — animação real</h2>
      <p>
        O label <code>splashscreen</code> é especial: se ele existir, o
        Ren'Py o executa DEPOIS de carregar tudo e ANTES de mostrar o
        main menu. Use para logos animados, aviso de epilepsia, créditos
        de engine.
      </p>

      <CodeBlock
        language="python"
        title="game/splashscreen.rpy"
        code={`label splashscreen:
    scene bg preto
    with Pause(0.3)

    # Logo do estúdio aparece com fade
    show logo_estudio at truecenter
    with Dissolve(1.0)
    pause 1.8

    # Logo some
    hide logo_estudio
    with Dissolve(0.8)
    pause 0.3

    # Logo do jogo aparece
    show logo_jogo at truecenter
    with Dissolve(1.2)
    pause 2.0
    hide logo_jogo
    with Dissolve(0.6)

    return  # devolve ao fluxo normal: cai no main menu`}
      />

      <CodeBlock
        language="python"
        title="game/images.rpy — declarações da splash"
        code={`image bg preto = Solid("#000")
image logo_estudio = "images/splash/logo_studios.png"
image logo_jogo = "images/splash/logo_sakura_cafe.png"`}
      />

      <h2>3. Splash com áudio — jingle do estúdio</h2>

      <CodeBlock
        language="python"
        title="game/splashscreen.rpy"
        code={`label splashscreen:
    scene bg preto
    play sound "audio/jingle_estudio.ogg"

    show logo_estudio at truecenter
    with Dissolve(1.0)
    pause 2.5
    hide logo_estudio with Dissolve(0.5)

    # Pequena pausa antes do logo principal
    pause 0.4

    # Logo principal com música tema baixinho começando
    play music "audio/tema_principal.ogg" fadein 2.0
    show logo_jogo at truecenter
    with Dissolve(1.2)
    pause 2.5
    hide logo_jogo with Dissolve(0.6)
    return`}
      />

      <h2>4. Splash com vídeo (cutscene de abertura)</h2>

      <CodeBlock
        language="python"
        title="game/splashscreen.rpy"
        code={`label splashscreen:
    # Cutscene full-screen — bloqueia até terminar OU jogador clicar
    $ renpy.movie_cutscene("video/abertura_sakura_cafe.webm")

    # Após o vídeo, fade rápido para o menu
    scene bg preto
    with Pause(0.2)
    return`}
      />

      <h2>5. Variáveis de configuração relacionadas</h2>

      <CommandTable
        title="config.* da abertura"
        variations={[
          {
            cmd: "config.window_title",
            desc: "Título da janela do executável.",
            output: 'define config.window_title = "Sakura Café"',
          },
          {
            cmd: "config.name",
            desc: "Nome interno do projeto. Usado em saves e dist.",
            output: 'define config.name = "SakuraCafe"',
          },
          {
            cmd: "config.window_icon",
            desc: "Ícone da janela (PNG 256x256, fundo transparente).",
            output: 'define config.window_icon = "images/icone.png"',
          },
          {
            cmd: "config.main_menu_music",
            desc: "Música que toca ao chegar no menu principal.",
            output: 'define config.main_menu_music = "audio/menu.ogg"',
          },
          {
            cmd: "config.skipsplash",
            desc: "Se True, pula o label splashscreen (útil em DEV).",
            output: "define config.skipsplash = config.developer",
          },
          {
            cmd: "config.start_scene_black",
            desc: "Se True, começa cada label em tela preta automática.",
            output: "Geralmente False — a splash já cuida disso.",
          },
          {
            cmd: "build.android_splash",
            desc: "Imagem de splash NATIVA Android (override do presplash).",
            output: "1080x1920 PNG",
          },
        ]}
      />

      <h2>6. Skip da splash em DEV</h2>
      <p>
        Você NÃO quer ver 5 segundos de logo toda vez que clica em "Launch
        Project" durante o desenvolvimento. Truque clássico:
      </p>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`# Pula a splash inteira quando estiver em modo developer
define config.skipsplash = config.developer

# Versão alternativa: pula só se variável de ambiente DEV=1
init python:
    import os
    if os.environ.get("RENPY_DEV"):
        config.skipsplash = True`}
      />

      <h2>7. Aviso de epilepsia / faixa etária</h2>
      <p>
        Se o jogo tem flashes ou conteúdo +18, MUITAS lojas exigem uma
        tela de aviso antes do menu. Coloque na splash:
      </p>

      <CodeBlock
        language="python"
        title="game/splashscreen.rpy"
        code={`label splashscreen:
    scene bg preto

    # Aviso de epilepsia (5s ou clique)
    show text \"\"\"Este jogo contém luzes piscantes e cenas de fogo.
Não é recomendado para pessoas com fotossensibilidade.\"\"\":
        text_align 0.5  xalign 0.5  yalign 0.5  size 38  color "#fff"
    with Dissolve(0.8)
    pause 5.0
    hide text with Dissolve(0.5)

    # Aviso de faixa etária
    show logo_classificacao at truecenter
    with Dissolve(0.8)
    pause 3.0
    hide logo_classificacao with Dissolve(0.5)

    # Logo do estúdio
    show logo_estudio at truecenter
    with Dissolve(1.0)
    pause 2.0
    hide logo_estudio with Dissolve(0.6)
    return`}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        user="dev"
        host="vn-studio"
        lines={[
          {
            comment: "verificar se a presplash existe e tem tamanho correto",
            cmd: "file game/presplash.png && identify game/presplash.png",
            out: `game/presplash.png: PNG image data, 1920 x 1080, 8-bit/color RGB, non-interlaced
game/presplash.png PNG 1920x1080 1920x1080+0+0 8-bit sRGB 412KB`,
            outType: "success",
          },
          {
            comment: "build Android — confere se a presplash foi embutida",
            cmd: "renpy.sh launcher distribute android",
            out: `Building android APK...
Embedded: game/presplash.png (1920x1080)
Embedded: game/android-presplash.png (1080x1920)
APK size: 84.3 MB
Build complete: build/sakura_cafe-1.0-android.apk`,
            outType: "success",
          },
        ]}
      />

      <OutputBlock label="ordem de execução completa" type="info">
{`1. SO carrega o executável → mostra presplash.png (instantâneo)
2. Engine Ren'Py inicializa → janela abre, presplash some
3. Engine roda 'init python:' e 'init -1 python:'
4. Engine carrega assets (images, audio)
5. Engine procura 'label splashscreen:' → executa se existir
6. Splashscreen termina (return) → entra no main menu
7. Jogador clica "Start" → engine busca 'label start:'`}
      </OutputBlock>

      <PracticeBox
        title="Sua splash com 2 logos e fade"
        goal="Criar uma abertura: presplash estática, label splashscreen com logo do estúdio (2s), logo do jogo (2s), depois entra no menu."
        steps={[
          "Coloque presplash.png em game/ (1920x1080).",
          "Adicione images/splash/logo_studios.png e logo_sakura_cafe.png.",
          "Crie game/splashscreen.rpy com o label splashscreen.",
          "Use scene bg preto, show logo, with Dissolve(1.0), pause 2.0, hide, repita pro segundo logo.",
          "Termine com return e teste com Launch Project.",
        ]}
        verify="Ao iniciar o jogo, a tela do desktop deve mostrar a presplash imediatamente, depois a janela abre, os 2 logos aparecem com fade, e só então o menu principal fica visível."
      >
        <CodeBlock
          language="python"
          title="game/splashscreen.rpy (gabarito)"
          code={`image bg preto = Solid("#000")
image logo_estudio = "images/splash/logo_studios.png"
image logo_jogo = "images/splash/logo_sakura_cafe.png"

label splashscreen:
    scene bg preto
    with Pause(0.3)

    show logo_estudio at truecenter
    with Dissolve(1.0)
    pause 2.0
    hide logo_estudio with Dissolve(0.6)
    pause 0.3

    show logo_jogo at truecenter
    with Dissolve(1.0)
    pause 2.0
    hide logo_jogo with Dissolve(0.6)
    return`}
        />
      </PracticeBox>

      <AlertBox type="danger" title="Pegadinha: clique pula a splash inteira">
        Por padrão, qualquer clique durante a splash (em <code>pause</code>)
        avança imediatamente. Para FORÇAR o jogador a esperar (logo de
        publisher contratual), use <code>pause N hard</code> ou{" "}
        <code>renpy.pause(N, hard=True)</code>.
      </AlertBox>

      <AlertBox type="warning" title="Web build e tempo de carregamento">
        Em build Web (HTML5), o presplash não aparece — o navegador mostra
        a barra de loading do Ren'Py. Dê uma logo dentro do{" "}
        <code>splashscreen</code> para compensar a sensação de "travou".
      </AlertBox>

      <AlertBox type="success" title="Conclui T002">
        Áudio com filtros, vídeo, 3D Stage, Live2D e splash — você cobriu
        toda a parte de mídia avançada do Ren'Py. O próximo bloco é{" "}
        <strong>Estilos, GUI e Configuração</strong>.
      </AlertBox>
    </PageContainer>
  );
}
