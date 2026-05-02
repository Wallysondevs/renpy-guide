import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Styles() {
  return (
    <PageContainer
      title="Styles — o sistema de aparência do Ren'Py"
      subtitle="Como o Ren'Py decide a cor, fonte, padding e borda de TODO componente visual. Herança de styles, take, prefixos hover_/selected_/insensitive_ e o nome reservado de cada peça da UI (button, button_text, say_label, frame, etc.)."
      difficulty="intermediario"
      timeToRead="20 min"
      prompt="ui/styles"
    >
      <AlertBox type="info" title="A doc oficial diz 'use styles' — mas não diz POR ONDE começar">
        <strong>Style</strong> é uma "ficha de aparência" nomeada. Quando
        você cria um botão na tela <code>screen main_menu</code>, o Ren'Py
        olha o style chamado <code>button</code> para descobrir cor de
        fundo, padding, fonte e cor do texto. Se você quer trocar a cara
        de TODOS os botões do jogo de uma vez só, mexe no style{" "}
        <code>button</code>. Se quer mudar SÓ um, cria um style novo
        herdando de <code>button</code> e aplica nele.
      </AlertBox>

      <h2>1. As 3 formas de declarar um style</h2>
      <p>
        Existem três sintaxes diferentes — todas válidas, mas com uso
        distinto. Vamos ver as três aplicadas ao Sakura Café:
      </p>

      <CodeBlock
        language="python"
        title="game/styles.rpy"
        code={`# ───────────────────────────────────────────────
# 1. style block — sintaxe declarativa (preferida)
# ───────────────────────────────────────────────
style sakura_btn:
    background "#ffaacc"
    hover_background "#ff77aa"
    insensitive_background "#cccccc"
    padding (20, 10)
    xsize 240
    color "#fff"

# 2. herança com 'is' — copia tudo do style pai
style sakura_btn_text is button_text:
    color "#5a1a3a"
    font "fonts/Mochiy.ttf"
    size 24
    hover_color "#fff"

# 3. atribuição direta — menos legível, raramente usada
init python:
    style.sakura_input.background = "#ffe6f0"
    style.sakura_input.color = "#5a1a3a"
    style.sakura_input.size = 22`}
      />

      <h2>2. Os styles "reservados" do Ren'Py</h2>
      <p>
        Cada widget de Screen Language tem um style padrão com o MESMO
        nome do widget. Mexer nesses nomes afeta o jogo inteiro — bom
        para um tema global, perigoso se você não quer efeito cascata.
      </p>

      <CommandTable
        title="Styles reservados mais usados"
        variations={[
          { cmd: "default", desc: "Style raiz — pai de TODOS. Mexer aqui afeta o jogo inteiro.", output: "style default: font 'fonts/Mochiy.ttf'" },
          { cmd: "say_label", desc: "Nome do personagem na caixa de fala (ex: 'Sakura').", output: "style say_label: color '#ffaacc' size 28" },
          { cmd: "say_dialogue", desc: "Texto da fala em si.", output: "style say_dialogue: color '#fff' size 22" },
          { cmd: "say_window", desc: "A 'caixa' atrás do diálogo.", output: "style say_window: background 'gui/textbox.png'" },
          { cmd: "button", desc: "Style base de qualquer textbutton/imagebutton.", output: "style button: padding (16, 8)" },
          { cmd: "button_text", desc: "Texto dentro de um button.", output: "style button_text: color '#ffaacc'" },
          { cmd: "menu_choice_button", desc: "Botões do bloco menu: do .rpy.", output: "style menu_choice_button: hover_background '#ff77aa'" },
          { cmd: "frame", desc: "Style do widget frame (containers visuais).", output: "style frame: background Frame('gui/frame.png',12,12)" },
          { cmd: "input", desc: "Caixa de entrada de texto (renpy.input).", output: "style input: color '#5a1a3a'" },
          { cmd: "vscrollbar / hscrollbar", desc: "Barra de rolagem.", output: "style vscrollbar: thumb 'gui/scrollbar.png'" },
          { cmd: "nvl_window", desc: "Caixa do modo NVL (tela cheia de texto).", output: "style nvl_window: background '#000a'" },
          { cmd: "main_menu_frame", desc: "Frame do menu principal.", output: "style main_menu_frame: background 'gui/main_menu.png'" },
        ]}
      />

      <h2>3. Herança e <code>is</code></h2>
      <p>
        A palavra-chave <code>is</code> faz o style novo herdar TUDO do
        style pai e só sobrescrever o que você listar. É o recurso mais
        importante para manter consistência: defina um botão padrão e
        derive variantes (perigoso, premium, desabilitado).
      </p>

      <CodeBlock
        language="python"
        title="game/styles.rpy — hierarquia de botões do café"
        code={`# Pai — botão padrão do café
style cafe_btn is button:
    background "#ffaacc"
    hover_background "#ff77aa"
    insensitive_background "#999"
    padding (24, 12)
    xsize 280
    color "#fff"

# Variantes que herdam de cafe_btn
style cafe_btn_premium is cafe_btn:
    background "#d4af37"      # dourado
    hover_background "#f5c542"

style cafe_btn_perigo is cafe_btn:
    background "#c0392b"      # vermelho
    hover_background "#e74c3c"

style cafe_btn_text is button_text:
    font "fonts/Mochiy.ttf"
    size 22
    color "#fff"
    insensitive_color "#cccccc"`}
      />

      <h2>4. Aplicando style num screen</h2>

      <CodeBlock
        language="python"
        title="game/screens.rpy"
        code={`screen escolha_pedido():
    vbox:
        xalign 0.5
        yalign 0.5
        spacing 12

        # Usa o style 'cafe_btn' (herda 'cafe_btn_text' p/ texto)
        textbutton "Café com leite" action Jump("pedido_cafe") style "cafe_btn"

        # Variante premium herdada
        textbutton "Combo VIP (R$ 29)" action Jump("pedido_vip") style "cafe_btn_premium"

        # Variante perigo
        textbutton "Cancelar" action Return() style "cafe_btn_perigo"`}
      />

      <h2>5. Prefixos de estado: hover_, selected_, insensitive_, idle_</h2>
      <p>
        QUALQUER property aceita um prefixo que indica o estado em que
        deve ser aplicada. É assim que você muda a cor de um botão no
        hover sem ter dois styles separados.
      </p>

      <CommandTable
        title="Prefixos de estado das properties"
        variations={[
          { cmd: "idle_*", desc: "Estado padrão (mouse longe).", output: "idle_color '#ffaacc'" },
          { cmd: "hover_*", desc: "Mouse em cima.", output: "hover_color '#fff'" },
          { cmd: "selected_*", desc: "Botão selecionado/ativo (toggle, abas).", output: "selected_background '#ff77aa'" },
          { cmd: "selected_idle_*", desc: "Selecionado E sem hover.", output: "selected_idle_background '#d4669a'" },
          { cmd: "selected_hover_*", desc: "Selecionado COM hover.", output: "selected_hover_background '#ffaacc'" },
          { cmd: "insensitive_*", desc: "Botão desabilitado (sensitive False).", output: "insensitive_color '#666'" },
          { cmd: "activate_*", desc: "Frame em que é clicado (1 frame).", output: "activate_background '#fff'" },
        ]}
      />

      <CodeBlock
        language="python"
        title="game/styles.rpy — exemplo completo de estados"
        code={`style botao_cardapio:
    background "#ffaacc"
    hover_background "#ff77aa"
    selected_background "#a8336c"
    selected_hover_background "#bf3f7e"
    insensitive_background "#888"
    padding (16, 8)

style botao_cardapio_text:
    color "#fff"
    hover_color "#ffe6f0"
    selected_color "#ffd700"
    insensitive_color "#bbb"
    font "fonts/Mochiy.ttf"
    size 20`}
      />

      <h2>6. <code>take</code> e <code>clear</code> — copiar/limpar properties</h2>
      <p>
        Dois statements pouco documentados mas muito úteis. <code>take</code>{" "}
        copia properties específicas de outro style. <code>clear</code>{" "}
        REMOVE uma property, voltando ao default.
      </p>

      <CodeBlock
        language="python"
        title="game/styles.rpy"
        code={`# Style de referência
style modelo:
    color "#ffaacc"
    size 28
    bold True
    italic True
    background "#000a"

# Usa color e size do 'modelo', mas NÃO o background
style titulo_secao:
    take color from modelo
    take size from modelo
    bold False

# Limpa property que veio do pai
style botao_simples is button:
    clear background    # remove o background herdado
    padding (8, 4)`}
      />

      <h2>7. Onde declarar styles?</h2>
      <p>
        Convenção da comunidade: crie um arquivo dedicado{" "}
        <code>game/styles.rpy</code> com todos os styles globais do jogo.
        Para componentes específicos de uma tela, declare logo antes do{" "}
        <code>screen</code> que os usa, no mesmo arquivo.
      </p>

      <OutputBlock label="estrutura recomendada" type="info">
{`game/
├── gui.rpy          ← variáveis globais (cores, tamanhos)
├── screens.rpy      ← screens reservados (say, choice, etc.)
├── styles.rpy       ← styles globais do jogo
├── ui/
│   ├── menu_principal.rpy   ← screen + styles do main menu
│   ├── inventario.rpy        ← screen + styles do inventário
│   └── cardapio.rpy          ← screen + styles do cardápio do café`}
      </OutputBlock>

      <h2>8. Customizando a caixa de diálogo do Sakura Café</h2>
      <p>
        Vamos ao caso real: trocar a textbox padrão por uma caixa rosa
        pastel com borda em pétalas de sakura. Três passos: estilizar o
        background (<code>say_window</code>), o nome (<code>say_label</code>) e
        o texto (<code>say_dialogue</code>).
      </p>

      <CodeBlock
        language="python"
        title="game/styles.rpy — tema sakura café"
        code={`# Caixa atrás da fala
style say_window:
    background Frame("gui/textbox_sakura.png", 40, 40, 40, 40)
    xpadding 60
    ypadding 30
    yalign 1.0
    ysize 220

# Nome do personagem
style say_label:
    font "fonts/Mochiy.ttf"
    size 32
    color "#ffaacc"
    outlines [(2, "#5a1a3a", 0, 0)]

# Texto da fala
style say_dialogue:
    font "fonts/Mochiy.ttf"
    size 24
    color "#5a1a3a"
    line_leading 4
    line_spacing 6

# Indicador "clique para continuar"
style say_thought is say_dialogue:
    italic True
    color "#a8336c"`}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "lint avisa quando um style usa property inexistente",
            cmd: "renpy.exe . lint",
            out: `game/styles.rpy:18 style 'cafe_btn' has unknown property 'colour' (did you mean 'color'?)
1 warning reported.`,
            outType: "warning",
          },
          {
            comment: "abrir o Style Inspector dentro do jogo",
            cmd: "# pressione SHIFT+I com o jogo rodando",
            out: `Style: button
  background: '#ffaacc'  (from cafe_btn)
  padding: (24, 12)      (from cafe_btn)
  color: '#fff'          (from cafe_btn_text)
  Inheritance: cafe_btn → button → default`,
            outType: "info",
          },
        ]}
      />

      <PracticeBox
        title="Crie um botão 'Pedir café' com 4 estados visuais"
        goal="Aplicar idle, hover, selected e insensitive em um único style derivado de 'button'."
        steps={[
          "Em game/styles.rpy crie 'style cafe_btn is button' com background rosa e padding (20,10).",
          "Adicione hover_background mais escuro, selected_background dourado, insensitive_background cinza.",
          "Crie 'style cafe_btn_text is button_text' com color branco e hover_color amarelo.",
          "Em game/screens.rpy crie 'screen teste()' com 3 textbuttons: 1 normal, 1 com sensitive False, 1 com action SetVariable.",
          "Adicione 'show screen teste' em label start e rode o jogo.",
        ]}
        verify="Os 3 botões devem ter aparência distinta e o desabilitado fica cinza com texto opaco."
      >
        <CodeBlock
          language="python"
          title="game/styles.rpy + screens.rpy (gabarito)"
          code={`style cafe_btn is button:
    background "#ffaacc"
    hover_background "#ff77aa"
    selected_background "#d4af37"
    insensitive_background "#888"
    padding (20, 10)

style cafe_btn_text is button_text:
    color "#fff"
    hover_color "#ffd700"
    insensitive_color "#bbb"

screen teste():
    vbox xalign 0.5 yalign 0.5 spacing 10:
        textbutton "Pedir café" action NullAction() style "cafe_btn"
        textbutton "Indisponível" action NullAction() sensitive False style "cafe_btn"
        textbutton "Confirmar" action SetVariable("ok", True) style "cafe_btn"`}
        />
      </PracticeBox>

      <AlertBox type="warning" title="Cuidado: mexer em 'default' afeta TUDO">
        Se você fizer <code>style default: font "fonts/Mochiy.ttf"</code>,
        a fonte muda em todo o jogo — inclusive no menu de save, nas
        preferências e até nos avisos de erro. Isso é desejável para
        unificar a tipografia, mas se algum widget ficar "errado",
        verifique se herdou algo do <code>default</code> sem você
        perceber.
      </AlertBox>

      <AlertBox type="success" title="Próximo passo">
        Estes são os <em>nomes</em> dos styles. Para a lista completa
        das <strong>properties</strong> (background, padding, color,
        font, line_spacing, kerning, outlines, etc.) que cada style
        aceita, vá para a página{" "}
        <strong>StyleProperties</strong>.
      </AlertBox>
    </PageContainer>
  );
}
