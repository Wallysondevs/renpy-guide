import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function GUI() {
  return (
    <PageContainer
      title="GUI — Customizando a cara da sua VN"
      subtitle="Cores, fontes, textbox, namebox, wallpaper do menu principal e botões — tudo o que faz a sua Visual Novel parar de parecer um projeto template e começar a parecer um produto."
      difficulty="intermediario"
      timeToRead="20 min"
      prompt="interface/gui"
    >
      <AlertBox type="info" title="O arquivo gui.rpy é o seu painel de controle">
        Quando você cria um projeto, o Ren'Py gera <code>game/gui.rpy</code> com
        ~600 linhas comentadas. <strong>Não apague nada</strong> — apenas mude
        os valores. Tudo nele é uma constante <code>gui.algo</code> que o
        <code> screens.rpy</code> consome. Mudou aqui, mudou em toda a VN.
      </AlertBox>

      <h2>1. Anatomia do gui.rpy</h2>
      <p>
        O <code>gui.rpy</code> é dividido em blocos comentados:{" "}
        <strong>cores</strong>, <strong>fontes</strong>,{" "}
        <strong>tamanhos</strong>, <strong>diálogo</strong>,{" "}
        <strong>botões</strong>, <strong>menu principal</strong>,{" "}
        <strong>menu de jogo</strong> e <strong>NVL</strong>. Veja o esqueleto:
      </p>

      <CodeBlock
        language="python"
        title="game/gui.rpy (estrutura, simplificada)"
        code={`################################################################################
## Inicialização
################################################################################

init offset = -2

## Cores ######################################################################
##
## A cor de destaque (accent) define os títulos e botões selecionados.

define gui.accent_color = '#ffaacc'

## A cor do texto idle dos botões.
define gui.idle_color = '#aaaaaa'

## Mais escura quando o jogo precisa enfatizar (ex.: texto desabilitado).
define gui.idle_small_color = '#888888'

## Cor quando o mouse está em cima.
define gui.hover_color = '#ff66aa'

## Cor de texto selecionado (botões de seleção como "Janela").
define gui.selected_color = '#ffffff'

## Cor de texto inserido (entrada de texto).
define gui.insensitive_color = '#aaaaaa7f'

## Cor das barras (música, voz, sfx).
define gui.muted_color = '#3d2030'
define gui.hover_muted_color = '#5a3048'

## Cores do texto dentro do textbox.
define gui.text_color = '#ffffff'
define gui.interface_text_color = '#ffffff'

## Fontes ######################################################################
##
## Fonte principal usada no diálogo.
define gui.text_font = "DejaVuSans.ttf"

## Fonte usada nos nomes de personagens.
define gui.name_text_font = "DejaVuSans-Bold.ttf"

## Fonte usada nos títulos do menu principal.
define gui.interface_text_font = "DejaVuSans.ttf"

## Tamanhos ####################################################################
define gui.text_size = 33
define gui.name_text_size = 45
define gui.interface_text_size = 36
define gui.label_text_size = 45
define gui.notify_text_size = 24
define gui.title_text_size = 75

## Janela do diálogo ###########################################################
define gui.textbox_height = 278
define gui.textbox_yalign = 1.0

## Posição do nome em cima do textbox.
define gui.name_xpos = 360
define gui.name_ypos = 0
define gui.name_xalign = 0.0

## Posição do texto da fala dentro do textbox.
define gui.dialogue_xpos = 402
define gui.dialogue_ypos = 75
define gui.dialogue_width = 1116
`}
      />

      <h2>2. Mudando a paleta de cores</h2>
      <p>
        A cor mais importante é <code>gui.accent_color</code> — ela aparece nos
        títulos, nos botões selecionados, na borda das telas. Para uma VN com a
        Sakura como protagonista, escolha um rosa pastel. Para a Yuki (rota
        gélida), um azul claro. O Ren'Py recarrega o arquivo automaticamente
        quando você salva e clica em <code>Shift+R</code> para reload.
      </p>

      <CodeBlock
        language="python"
        title="game/gui.rpy — paleta Sakura Café"
        code={`## Rosa pastel (Sakura)
define gui.accent_color = '#ff86b0'
define gui.hover_color  = '#ffaecf'
define gui.selected_color = '#ffe0ec'

## Tons de fundo da textbox e dos painéis.
define gui.muted_color = '#3a1d2c'
define gui.hover_muted_color = '#5a2d44'

## Cores de texto.
define gui.text_color = '#fff5f9'
define gui.interface_text_color = '#fff0f6'

## Cor das barras de áudio nas Preferências.
define gui.unscrollable = "hide"
`}
      />

      <CommandTable
        title="As 12 cores que você vai mexer (gui.rpy)"
        variations={[
          { cmd: "gui.accent_color", desc: "Cor primária — títulos, foco, links.", output: "Use a cor mais marcante da heroína." },
          { cmd: "gui.idle_color", desc: "Texto de botões em estado neutro.", output: "Cinza médio (#aaaaaa) é seguro." },
          { cmd: "gui.hover_color", desc: "Texto quando o mouse passa por cima.", output: "Versão clara da accent." },
          { cmd: "gui.selected_color", desc: "Botão selecionado / página atual.", output: "Branco ou accent saturada." },
          { cmd: "gui.insensitive_color", desc: "Botão desabilitado (sem permissão).", output: "Cinza com 50% alpha (#aaaaaa7f)." },
          { cmd: "gui.muted_color", desc: "Cor de fundo das barras vazias (volume).", output: "Tom escuro derivado da accent." },
          { cmd: "gui.hover_muted_color", desc: "Barra com hover.", output: "Tom intermediário." },
          { cmd: "gui.text_color", desc: "Cor do texto do diálogo.", output: "Quase sempre branco puro." },
          { cmd: "gui.interface_text_color", desc: "Cor de textos do menu (Save/Load/etc).", output: "Branco gelo." },
          { cmd: "gui.choice_idle_color", desc: "Texto das escolhas (menu).", output: "Cinza claro." },
          { cmd: "gui.choice_hover_color", desc: "Escolha em hover.", output: "Accent saturada." },
          { cmd: "gui.notify_text_color", desc: "Texto da notificação 'Save em 1'.", output: "Branco." },
        ]}
      />

      <h2>3. Trocando as fontes</h2>
      <p>
        Coloque o <code>.ttf</code> ou <code>.otf</code> dentro de{" "}
        <code>game/fonts/</code> (crie a pasta se não existir). Em seguida,
        aponte <code>gui.text_font</code> e <code>gui.name_text_font</code>:
      </p>

      <CodeBlock
        language="python"
        title="game/gui.rpy — fontes locais"
        code={`## Fonte do diálogo: papel manuscrito (combina com café)
define gui.text_font = "fonts/Quicksand-Regular.ttf"

## Fonte do nome: bold com personalidade
define gui.name_text_font = "fonts/MPLUSRounded1c-Bold.ttf"

## Fonte dos botões e menu
define gui.interface_text_font = "fonts/Quicksand-Medium.ttf"

## Tamanhos um pouco maiores para legibilidade
define gui.text_size = 36
define gui.name_text_size = 48
define gui.interface_text_size = 32
define gui.title_text_size = 96
`}
      />

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          { comment: "estrutura recomendada de fontes", cmd: "ls game/fonts/", out: `MPLUSRounded1c-Bold.ttf
Quicksand-Medium.ttf
Quicksand-Regular.ttf
NotoSansJP-Regular.otf`, outType: "info" },
          { comment: "lint avisa se uma fonte não foi achada", cmd: "renpy.exe . lint", out: `Lint is checking sakura-cafe...
Statistics:
The game contains 312 dialogue blocks, containing 4,218 words and 21,402 characters.
Lint took 0.4 seconds.`, outType: "success" },
        ]}
      />

      <AlertBox type="warning" title="Cuidado com licenças de fonte">
        Nem toda fonte do Google Fonts pode ser embarcada num jogo comercial.
        Quase todas que estão sob <strong>SIL Open Font License (OFL)</strong>{" "}
        podem — Quicksand, Noto Sans JP, M PLUS, Klee One. Já fontes pagas da
        Adobe, Monotype ou MyFonts <strong>não</strong>. Confira sempre o
        arquivo <code>OFL.txt</code> ou <code>LICENSE.txt</code> que vem junto.
      </AlertBox>

      <h2>4. Substituindo o textbox e o namebox</h2>
      <p>
        O Ren'Py procura imagens em <code>game/gui/</code>. As principais são{" "}
        <code>textbox.png</code> (a barra de fala) e <code>namebox.png</code>{" "}
        (a etiqueta com o nome). Resolução padrão: <strong>1920×280</strong>{" "}
        para o textbox e <strong>168×39</strong> para o namebox em projetos
        1080p. Salve com transparência e o Ren'Py monta sozinho.
      </p>

      <OutputBlock label="game/gui/ — assets que você pode substituir" type="info">
{`game/gui/
├── textbox.png            ← faixa do diálogo no rodapé
├── namebox.png            ← caixa com o nome do personagem
├── main_menu.png          ← wallpaper do menu principal
├── game_menu.png          ← wallpaper dos menus internos (Save/Load)
├── window_icon.png        ← ícone da janela do jogo (32x32)
├── overlay/
│   ├── confirm.png        ← fundo do diálogo "Tem certeza?"
│   └── main_menu.png      ← overlay sobre o wallpaper do menu
├── button/
│   ├── choice_idle_background.png
│   ├── choice_hover_background.png
│   ├── slot_idle_background.png
│   └── slot_hover_background.png
├── slider/                ← skin das barras (volume, velocidade)
│   ├── horizontal_idle_bar.png
│   └── horizontal_idle_thumb.png
└── phone/                 ← versões smaller para Android/iOS`}
      </OutputBlock>

      <h2>5. Wallpaper do menu principal</h2>
      <p>
        Substitua <code>game/gui/main_menu.png</code> pela arte que abre a sua
        VN. Resolução: o tamanho do projeto (1920×1080 por padrão). Para uma
        sensação cinemática, escureça com um overlay:
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy — overlay sobre o wallpaper"
        code={`screen main_menu():

    tag menu

    add gui.main_menu_background

    ## Overlay escuro para contrastar com os botões.
    add Solid("#00000080")

    ## Logo do jogo, posicionado em cima.
    add "gui/logo.png" xalign 0.5 ypos 80

    use main_menu_buttons
`}
      />

      <PracticeBox
        title="Trocar a paleta para o tema da Yuki (azul gelo)"
        goal="Editar gui.rpy e ver o menu principal e o textbox mudarem de cor."
        steps={[
          "Abra game/gui.rpy no seu editor.",
          "Localize a seção '## Cores ##' e edite as três variáveis abaixo.",
          "Salve o arquivo.",
          "Volte para a janela do jogo e pressione Shift+R (recarregar script).",
          "Confira o menu principal: o título e os botões devem estar em azul.",
        ]}
      >
        <CodeBlock
          language="python"
          title="game/gui.rpy (apenas as 3 linhas alteradas)"
          code={`define gui.accent_color   = '#7fc8ff'
define gui.hover_color    = '#aee0ff'
define gui.selected_color = '#e6f4ff'`}
        />
      </PracticeBox>

      <h2>6. Backup antes de tudo</h2>
      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          { comment: "antes de mexer pesado, salve uma cópia", cmd: "cp game/gui.rpy game/gui.rpy.bak", outType: "muted" },
          { comment: "agora pode experimentar à vontade", cmd: "diff game/gui.rpy game/gui.rpy.bak", out: `12c12
< define gui.accent_color = '#ff86b0'
---
> define gui.accent_color = '#ffaacc'`, outType: "info" },
        ]}
      />

      <AlertBox type="success" title="Reverteu? cp -f gui.rpy.bak gui.rpy">
        Se algo deu MUITO errado e o jogo não inicia mais, restaure o backup com{" "}
        <code>cp -f game/gui.rpy.bak game/gui.rpy</code>. Outra opção: o
        Launcher tem o botão <strong>Delete Persistent</strong> em
        Preferences — útil quando uma alteração corrompeu um save antigo.
      </AlertBox>

      <h2>7. Regenerar a GUI inteira</h2>
      <p>
        Se você fuçou demais e quer voltar para a GUI default, abra o Launcher
        e clique em <strong>Change/Update GUI</strong>. Ele vai perguntar se
        quer escolher novamente a resolução e a paleta — e regravar{" "}
        <code>gui.rpy</code> e <code>screens.rpy</code> do zero. As suas
        imagens em <code>game/images/</code> e <code>game/audio/</code> ficam
        intactas. Mas o seu trabalho em <code>gui.rpy</code> some — por isso
        sempre faça commit no git antes.
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          { cmd: "git add -A && git commit -m 'gui: paleta sakura'", out: `[main 4f8a2b1] gui: paleta sakura
 1 file changed, 8 insertions(+), 8 deletions(-)`, outType: "success" },
        ]}
      />
    </PageContainer>
  );
}
