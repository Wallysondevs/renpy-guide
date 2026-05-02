import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function StyleProperties() {
  return (
    <PageContainer
      title="Style Properties — referência exaustiva"
      subtitle="Todas as properties que um style aceita: layout (xpos, padding, margin, xsize), texto (font, size, color, italic, line_spacing, kerning), interativas (hover_*, selected_*, insensitive_*) e visuais (background, foreground, outlines, hover_sound)."
      difficulty="intermediario"
      timeToRead="22 min"
      prompt="ui/style-properties"
    >
      <AlertBox type="info" title="A doc oficial lista por categoria — aqui está em UMA tabela só">
        Quando você abre a documentação oficial em "Style Properties",
        ela quebra em ~8 páginas separadas (position, text, button,
        bar, etc.). Na prática você quer um lugar só para consultar.
        Esta página é esse lugar — todas as properties úteis com
        exemplo aplicado ao Sakura Café.
      </AlertBox>

      <h2>1. Properties de POSIÇÃO e LAYOUT</h2>

      <CommandTable
        title="Position properties — onde o widget aparece e quanto espaço ocupa"
        variations={[
          { cmd: "xpos / ypos", desc: "Posição absoluta em pixels (canto superior esquerdo do pai).", output: "xpos 100 ypos 540" },
          { cmd: "xalign / yalign", desc: "Posição relativa 0.0–1.0. Mais portável entre resoluções.", output: "xalign 0.5 yalign 0.5  → centro" },
          { cmd: "xanchor / yanchor", desc: "Ponto de ancoragem dentro do próprio widget.", output: "xanchor 0.5  → centra horizontalmente" },
          { cmd: "xoffset / yoffset", desc: "Deslocamento ADICIONAL em pixels após posicionar.", output: "yoffset -10  → 10px acima" },
          { cmd: "xsize / ysize", desc: "Tamanho FIXO em pixels. Conflita com 'xfill'.", output: "xsize 280 ysize 60" },
          { cmd: "xmaximum / ymaximum", desc: "Limite máximo de tamanho.", output: "xmaximum 500" },
          { cmd: "xminimum / yminimum", desc: "Limite mínimo de tamanho.", output: "xminimum 200" },
          { cmd: "xfill / yfill", desc: "Se True, expande para preencher o pai.", output: "xfill True  → ocupa toda largura" },
          { cmd: "area", desc: "Atalho para (x, y, w, h) de uma vez.", output: "area (100, 540, 280, 60)" },
        ]}
      />

      <h2>2. Properties de PADDING / MARGIN / SPACING</h2>

      <CommandTable
        title="Espaçamento interno e externo"
        variations={[
          { cmd: "padding", desc: "Tupla (esq, topo, dir, baixo) ou (h, v) ou n único.", output: "padding (20, 10)  → 20px lat, 10px vert" },
          { cmd: "xpadding / ypadding", desc: "Padding por eixo.", output: "xpadding 16" },
          { cmd: "left_padding / right_padding / top_padding / bottom_padding", desc: "Padding individual por lado.", output: "left_padding 24" },
          { cmd: "margin", desc: "Espaço EXTERNO entre o widget e o pai.", output: "margin (8, 4)" },
          { cmd: "xmargin / ymargin", desc: "Margin por eixo.", output: "ymargin 12" },
          { cmd: "spacing", desc: "Espaço entre filhos de vbox/hbox/grid.", output: "spacing 16" },
          { cmd: "box_spacing", desc: "Spacing num side (caixa lateral).", output: "box_spacing 8" },
        ]}
      />

      <h2>3. Properties de FONTE e TEXTO</h2>

      <CommandTable
        title="Tudo sobre tipografia"
        variations={[
          { cmd: "font", desc: "Caminho do TTF/OTF dentro de game/.", output: "font 'fonts/Mochiy.ttf'" },
          { cmd: "size", desc: "Tamanho da fonte em pixels.", output: "size 24" },
          { cmd: "color", desc: "Cor do texto. String hex ou tuple.", output: "color '#5a1a3a'" },
          { cmd: "bold", desc: "Negrito (True/False).", output: "bold True" },
          { cmd: "italic", desc: "Itálico (True/False).", output: "italic True" },
          { cmd: "underline", desc: "Sublinhado.", output: "underline True" },
          { cmd: "strikethrough", desc: "Riscado.", output: "strikethrough True" },
          { cmd: "line_spacing", desc: "Espaço EXTRA entre linhas em pixels.", output: "line_spacing 6" },
          { cmd: "line_leading", desc: "Espaço acima da primeira linha.", output: "line_leading 4" },
          { cmd: "kerning", desc: "Espaço entre letras (positivo afasta).", output: "kerning 1.5" },
          { cmd: "justify", desc: "Justifica texto (alinha às duas margens).", output: "justify True" },
          { cmd: "text_align", desc: "Alinhamento horizontal: 0.0 esq, 0.5 centro, 1.0 dir.", output: "text_align 0.5" },
          { cmd: "outlines", desc: "Lista [(largura, cor, xoff, yoff)] — contorno.", output: "outlines [(2, '#000', 0, 0)]" },
          { cmd: "antialias", desc: "Suaviza bordas (True por default).", output: "antialias True" },
          { cmd: "first_indent", desc: "Indentação da primeira linha em px.", output: "first_indent 32" },
          { cmd: "rest_indent", desc: "Indentação das demais linhas.", output: "rest_indent 0" },
          { cmd: "language", desc: "'unicode', 'eastasian', 'korean-with-spaces' — quebra de linha.", output: "language 'unicode'" },
          { cmd: "min_width", desc: "Largura mínima do bloco de texto em px.", output: "min_width 400" },
          { cmd: "newline_indent", desc: "Se True, \\n também aplica first_indent.", output: "newline_indent True" },
          { cmd: "vertical", desc: "Texto vertical (japonês tradicional).", output: "vertical True" },
        ]}
      />

      <h2>4. Properties VISUAIS — background, foreground, hover_sound</h2>

      <CommandTable
        title="Aparência do widget"
        variations={[
          { cmd: "background", desc: "Displayable de fundo (cor, imagem, Frame, Solid).", output: "background '#ffaacc' | Frame('gui/box.png',12,12)" },
          { cmd: "foreground", desc: "Displayable POR CIMA do conteúdo (overlay).", output: "foreground 'gui/glow.png'" },
          { cmd: "hover_background", desc: "Background no hover (qualquer prefixo serve).", output: "hover_background '#ff77aa'" },
          { cmd: "selected_background", desc: "Background quando selecionado.", output: "selected_background '#d4af37'" },
          { cmd: "insensitive_background", desc: "Background quando desabilitado.", output: "insensitive_background '#888'" },
          { cmd: "hover_sound", desc: "Som tocado no hover (channel 'sound').", output: "hover_sound 'audio/hover.ogg'" },
          { cmd: "activate_sound", desc: "Som tocado no clique.", output: "activate_sound 'audio/click.ogg'" },
          { cmd: "modal", desc: "Bloqueia interação com widgets atrás.", output: "modal True" },
          { cmd: "focus_mask", desc: "Region clicável (True usa alpha do background).", output: "focus_mask True" },
          { cmd: "mouse", desc: "Tipo de cursor no hover ('default','dragging','pencil').", output: "mouse 'pencil'" },
          { cmd: "alt", desc: "Texto alternativo p/ self-voicing (acessibilidade).", output: "alt 'Botão Pedir Café'" },
        ]}
      />

      <h2>5. Properties de BAR (sliders, progress)</h2>

      <CommandTable
        title="Customizar barras (volume, leitura, vida)"
        variations={[
          { cmd: "left_bar / right_bar", desc: "Displayable da parte preenchida e da vazia.", output: "left_bar Solid('#ffaacc')  right_bar Solid('#444')" },
          { cmd: "left_gutter / right_gutter", desc: "Espaço fixo nas pontas da barra.", output: "left_gutter 4 right_gutter 4" },
          { cmd: "bar_vertical", desc: "Barra vertical em vez de horizontal.", output: "bar_vertical True" },
          { cmd: "bar_invert", desc: "Inverte direção do preenchimento.", output: "bar_invert True" },
          { cmd: "thumb", desc: "Displayable do 'puxador' do slider.", output: "thumb 'gui/slider_thumb.png'" },
          { cmd: "thumb_offset", desc: "Deslocamento do thumb em px.", output: "thumb_offset 0" },
          { cmd: "thumb_shadow", desc: "Sombra do thumb.", output: "thumb_shadow 'gui/shadow.png'" },
          { cmd: "unscrollable", desc: "Comportamento quando barra não rola: 'hide','insensitive'.", output: "unscrollable 'hide'" },
        ]}
      />

      <h2>6. Properties de WINDOW / FRAME</h2>

      <CodeBlock
        language="python"
        title="game/styles.rpy — caixa de diálogo do Sakura Café"
        code={`style say_window:
    background Frame("gui/textbox.png", 40, 40, 40, 40)
    xpadding 60
    ypadding 30
    yalign 1.0
    ysize 220
    xfill True

style say_label:
    font "fonts/Mochiy.ttf"
    size 30
    color "#ffaacc"
    bold True
    outlines [(2, "#5a1a3a", 0, 0), (4, "#000a", 2, 2)]
    xpos 60
    yoffset -8

style say_dialogue:
    font "fonts/Mochiy.ttf"
    size 24
    color "#5a1a3a"
    line_leading 4
    line_spacing 8
    kerning 0.5
    text_align 0.0
    justify False
    rest_indent 0
    outlines []`}
      />

      <h2>7. Properties RARAS mas que salvam o dia</h2>

      <CommandTable
        title="Properties que ninguém lembra mas resolvem casos específicos"
        variations={[
          { cmd: "ruby_style", desc: "Style aplicado ao furigana ({rt}...{/rt}).", output: "ruby_style style.ruby" },
          { cmd: "altruby_style", desc: "Estilo do bopomofo (chinês).", output: "altruby_style style.altruby" },
          { cmd: "adjust_spacing", desc: "Recalcula spacing por dpi (True default).", output: "adjust_spacing False" },
          { cmd: "drop_shadow", desc: "Sombra atrás do texto (lista de offsets).", output: "drop_shadow [(2, 2)]" },
          { cmd: "drop_shadow_color", desc: "Cor da sombra de texto.", output: "drop_shadow_color '#000a'" },
          { cmd: "hyperlink_functions", desc: "Funções (style, on_click, on_hover) p/ {a=...} tags.", output: "hyperlink_functions custom_link_funcs" },
          { cmd: "slow_cps", desc: "CPS específico para esse style (override do global).", output: "slow_cps 30" },
          { cmd: "slow_cps_multiplier", desc: "Multiplica o slow_cps base.", output: "slow_cps_multiplier 0.5" },
          { cmd: "slow_abortable", desc: "Se False, jogador NÃO pode pular o slow text aqui.", output: "slow_abortable False" },
          { cmd: "axis", desc: "Eixos variáveis em fonts variable (Ren'Py 8.3+).", output: "axis {'wght': 700}" },
          { cmd: "instance", desc: "Instância nomeada de variable font.", output: "instance 'Bold'" },
        ]}
      />

      <h2>8. Cheat sheet visual: aplicando 20 properties em UM botão</h2>

      <CodeBlock
        language="python"
        title="game/styles.rpy — botão completo do café"
        code={`style botao_pedir:
    # POSIÇÃO
    xalign 0.5
    yalign 0.95
    yoffset -20
    # TAMANHO
    xsize 320
    ysize 70
    # ESPAÇAMENTO
    padding (24, 12)
    margin (0, 8)
    # VISUAL
    background Frame("gui/btn_idle.png", 16, 16)
    hover_background Frame("gui/btn_hover.png", 16, 16)
    insensitive_background Frame("gui/btn_off.png", 16, 16)
    activate_background Frame("gui/btn_press.png", 16, 16)
    # SOM
    hover_sound "audio/hover.ogg"
    activate_sound "audio/click.ogg"
    # CURSOR + ACESSIBILIDADE
    mouse "pencil"
    alt "Pedir café com leite"
    focus_mask True

style botao_pedir_text:
    # FONTE
    font "fonts/Mochiy.ttf"
    size 26
    color "#fff"
    hover_color "#ffd700"
    insensitive_color "#bbb"
    # TEXTO
    bold True
    outlines [(2, "#5a1a3a", 0, 0)]
    text_align 0.5
    line_spacing 2
    kerning 1.0`}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Style Inspector mostra de onde cada property veio",
            cmd: "# pressione SHIFT+I no jogo, clique em qualquer botão",
            out: `Inspecting widget at (640, 980)
Style: botao_pedir
  background     : Frame('gui/btn_idle.png', 16, 16)   [from botao_pedir]
  xsize          : 320                                  [from botao_pedir]
  padding        : (24, 12)                             [from botao_pedir]
  hover_sound    : 'audio/hover.ogg'                    [from botao_pedir]
  Inheritance: botao_pedir → button → default`,
            outType: "info",
          },
        ]}
      />

      <PracticeBox
        title="Crie um label de NOTÍCIA com sombra, contorno e fonte custom"
        goal="Aplicar pelo menos 8 properties de texto em um único style aplicado ao nome do café no menu principal."
        steps={[
          "Em game/styles.rpy crie 'style titulo_cafe' (sem herdar de nada).",
          "Adicione font, size 64, color #ffaacc, bold True.",
          "Adicione outlines com 2 contornos (um interno preto e um externo magenta).",
          "Adicione kerning 2 e line_spacing 4.",
          "Em screens.rpy use 'text \"Sakura Café\" style \"titulo_cafe\"' dentro do main_menu.",
        ]}
        verify="O título aparece grande, com fonte custom e duplo contorno visível."
      >
        <CodeBlock
          language="python"
          title="game/styles.rpy (gabarito)"
          code={`style titulo_cafe:
    font "fonts/Mochiy.ttf"
    size 64
    color "#ffaacc"
    bold True
    italic False
    kerning 2.0
    line_spacing 4
    text_align 0.5
    outlines [(2, "#5a1a3a", 0, 0), (4, "#000a", 3, 3)]
    drop_shadow [(0, 4)]
    drop_shadow_color "#0008"`}
        />
      </PracticeBox>

      <OutputBlock label="resumo: categorias de properties" type="info">
{`POSIÇÃO         xpos ypos xalign yalign xanchor yanchor xoffset yoffset
TAMANHO         xsize ysize xmaximum ymaximum xfill yfill area
ESPAÇO          padding margin spacing box_spacing left_padding ...
TEXTO           font size color bold italic underline kerning line_spacing
                outlines drop_shadow text_align justify first_indent
VISUAL          background foreground hover_background selected_background
INTERAÇÃO       hover_sound activate_sound mouse focus_mask alt
BAR             left_bar right_bar thumb bar_vertical unscrollable
RUBY            ruby_style altruby_style
SLOW TEXT       slow_cps slow_abortable slow_cps_multiplier`}
      </OutputBlock>

      <AlertBox type="warning" title="Property errada NÃO dá erro — só é ignorada">
        Se você escrever <code>colour</code> em vez de <code>color</code>,
        o Ren'Py NÃO crasha — o style fica sem cor e usa o default. SEMPRE
        rode <code>renpy.exe . lint</code> que ele acusa property
        desconhecida com sugestão de correção.
      </AlertBox>

      <AlertBox type="success" title="Próximo">
        Agora que você conhece todas as properties, vá para{" "}
        <strong>AdvancedGUI</strong> aprender a usar variáveis globais
        (<code>gui.text_color</code>, <code>gui.accent_color</code>) que
        deixam o jogo trocar de TEMA inteiro alterando 5 linhas só.
      </AlertBox>
    </PageContainer>
  );
}
