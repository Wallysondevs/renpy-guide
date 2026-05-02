import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Text() {
  return (
    <PageContainer
      title="Text Tags & Tipografia avançada"
      subtitle="Tudo de texto no Ren'Py: tags inline (b, i, color, size, font, cps, w, p, nw, fast, ruby), fontes custom (TTF), alinhamento, texto vertical e ligaduras — com a Sakura falando em cursiva e o Akira em monospace."
      difficulty="intermediario"
      timeToRead="16 min"
      prompt="texto/text-tags"
    >
      <AlertBox type="info" title="O que a doc oficial não diz claramente">
        Ren'Py renderiza TODO o texto com SDL_ttf — então sua tipografia
        depende do <strong>arquivo TTF/OTF</strong> escolhido. Se a fonte
        não tem o glifo (ex.: nenhum kanji em Roboto), aparece um quadrado{" "}
        <code>□</code>. Para evitar isso, usamos{" "}
        <code>config.font_replacement_map</code> e{" "}
        <code>style.default.font</code> — mostro tudo abaixo no contexto do
        Sakura Café (que mistura PT-BR, hiragana e ícones).
      </AlertBox>

      <h2>1. As 11 tags inline que você usa todo dia</h2>
      <p>
        Tag de texto é qualquer trecho entre chaves dentro de uma string.
        Toda tag aberta precisa ser fechada (com a barra), exceto as 3
        auto-fechadas: <code>{`{w}`}</code>, <code>{`{p}`}</code> e{" "}
        <code>{`{nw}`}</code>. Você pode aninhar à vontade — Ren'Py resolve
        de dentro para fora.
      </p>

      <CommandTable
        title="Tags fundamentais para diálogo"
        variations={[
          { cmd: "{b}...{/b}", desc: "Negrito do trecho.", output: "s \"Estou {b}exausta{/b} hoje.\"" },
          { cmd: "{i}...{/i}", desc: "Itálico — usado p/ pensamento ou ênfase.", output: "s \"{i}(Será que ele percebeu?){/i}\"" },
          { cmd: "{u}...{/u}", desc: "Sublinhado.", output: "s \"O nome do café é {u}Sakura{/u}.\"" },
          { cmd: "{s}...{/s}", desc: "Riscado (strikethrough).", output: "s \"Hoje é {s}terça{/s} quarta.\"" },
          { cmd: "{color=#hex}...{/color}", desc: "Cor hexadecimal do trecho.", output: "s \"Especial: {color=#ff66aa}matcha latte{/color}.\"" },
          { cmd: "{size=±N}...{/size}", desc: "Tamanho relativo (+10) ou absoluto (=32).", output: "s \"{size=+12}OFERTA!{/size}\"" },
          { cmd: "{font=arquivo.ttf}...{/font}", desc: "Troca de fonte para o trecho.", output: "s \"{font=cursive.ttf}Sakura{/font} Café\"" },
          { cmd: "{cps=N}...{/cps}", desc: "Caracteres por segundo (slow text).", output: "y \"{cps=8}E-eu... preciso te contar...{/cps}\"" },
          { cmd: "{w=N}", desc: "Pausa N segundos no meio da fala.", output: "s \"Espere...{w=1.0} ouviu isso?\"" },
          { cmd: "{p=N}", desc: "Quebra de parágrafo + pausa.", output: "s \"Café pronto!{p=0.4}Aqui está.\"" },
          { cmd: "{nw}", desc: "No-wait: avança sem esperar clique.", output: "s \"Já volto!{nw}\"" },
        ]}
      />

      <h2>2. Tags raras que SALVAM em momentos chave</h2>

      <CommandTable
        title="Tags avançadas"
        variations={[
          { cmd: "{fast}", desc: "Renderiza instantaneamente o que vier antes (pula slow text).", output: "s \"Espere{w=1.5}{fast} CUIDADO!\"" },
          { cmd: "{rb}base{/rb}{rt}furigana{/rt}", desc: "Ruby text (furigana japonês).", output: "{rb}桜{/rb}{rt}さくら{/rt}" },
          { cmd: "{outlinecolor=#000}...{/outlinecolor}", desc: "Cor do contorno (precisa style.outlines definido).", output: "Útil em legenda sobre BG claro." },
          { cmd: "{a=label}...{/a}", desc: "Hyperlink interno (call/jump).", output: "{a=cardapio}Ver cardápio{/a}" },
          { cmd: "{space=N}", desc: "Espaço em branco horizontal de N px.", output: "Sakura{space=20}Café" },
          { cmd: "{vspace=N}", desc: "Espaço vertical entre linhas (em px).", output: "Linha 1{vspace=12}Linha 2" },
          { cmd: "{alpha=0.5}...{/alpha}", desc: "Transparência do trecho.", output: "s \"{alpha=0.4}(sussurrando){/alpha}\"" },
          { cmd: "{plain}...{/plain}", desc: "Reseta TODOS estilos do trecho.", output: "{b}{i}forte{plain}normal{/plain}{/i}{/b}" },
          { cmd: "{k=N}...{/k}", desc: "Kerning (espaçamento entre letras).", output: "{k=4}S A K U R A{/k}" },
          { cmd: "{art=N}...{/art}", desc: "Alternative ruby (overhead).", output: "Para anotações cima/baixo." },
        ]}
      />

      <h2>3. Fontes custom — TTF/OTF na pasta <code>game/gui/</code></h2>
      <p>
        A doc oficial diz "ponha o TTF em qualquer lugar do projeto" —
        verdade, mas a convenção da comunidade é{" "}
        <code>game/gui/fonts/</code>. Depois você referencia pelo caminho
        relativo a <code>game/</code>:
      </p>

      <OutputBlock label="árvore de fontes do Sakura Café" type="info">
{`game/gui/fonts/
├── DejaVuSans.ttf           ← fallback latino (já vem com o Ren'Py)
├── SakuraScript.ttf         ← cursiva rosa para Sakura
├── JetBrainsMono.ttf        ← monospace tech para Akira
├── NotoSansJP-Regular.otf   ← suporte a kana/kanji
└── EmojiSymbols.ttf         ← ☕ ❤ 🌸 e outros símbolos`}
      </OutputBlock>

      <CodeBlock
        language="python"
        title="game/options.rpy — fonte padrão do jogo"
        code={`# Fonte default de TODOS os textos (textbox, menus, narração)
define gui.text_font = "gui/fonts/DejaVuSans.ttf"
define gui.name_text_font = "gui/fonts/SakuraScript.ttf"
define gui.interface_text_font = "gui/fonts/DejaVuSans.ttf"

# Tamanho base (será multiplicado por size= das tags)
define gui.text_size = 28
define gui.name_text_size = 36

# Substituições automáticas: se um glifo não existir na default,
# Ren'Py usa a alternativa. Crucial p/ misturar PT-BR + japonês.
define config.font_replacement_map = {
    ("gui/fonts/DejaVuSans.ttf", False, False):
        ("gui/fonts/NotoSansJP-Regular.otf", False, False),
}`}
      />

      <h2>4. Sakura cursiva, Akira monospace — por personagem</h2>
      <p>
        Cada Character pode forçar a fonte do nome E da fala via{" "}
        <code>what_font</code> e <code>who_font</code>:
      </p>

      <CodeBlock
        language="python"
        title="game/characters.rpy"
        code={`define s = Character(
    "Sakura",
    color="#ffaacc",
    who_font="gui/fonts/SakuraScript.ttf",
    who_size=40,
    what_font="gui/fonts/DejaVuSans.ttf",
)

define a = Character(
    "Akira",
    color="#9ecbff",
    who_font="gui/fonts/JetBrainsMono.ttf",
    what_font="gui/fonts/JetBrainsMono.ttf",
    what_size=24,
)

define y = Character("Yuki", color="#aaccff")
define h = Character("Hana", color="#c5f0a4")
define m = Character("Mei",  color="#ffcc99")
define r = Character("Rin",  color="#d4a5ff")

label start:
    scene bg cafe with fade
    s "Bem-vindo ao café! Hoje o especial é {color=#ff66aa}torta de matcha{/color}."
    a "stdout: pedido recebido. {i}(café preto, sem açúcar){/i}"
    return`}
      />

      <AlertBox type="warning" title="Pegadinha: fonte sem o glifo">
        Se você usar <code>SakuraScript.ttf</code> e ela não tiver letras
        com acento (ã, é, ç), aparece <code>□</code> em "café". Solução:
        sempre tenha um <strong>fallback</strong> via{" "}
        <code>config.font_replacement_map</code> ou rode a fonte pelo{" "}
        <a href="https://fontforge.org/" target="_blank" rel="noreferrer">FontForge</a>{" "}
        para gerar o subset com latino estendido.
      </AlertBox>

      <h2>5. Alinhamento e text_align</h2>

      <CodeBlock
        language="python"
        title="game/screens.rpy — alinhamento da textbox"
        code={`# style.say_dialogue controla a fala dentro do balão
style say_dialogue:
    text_align 0.0       # 0.0 esquerda, 0.5 centro, 1.0 direita
    line_spacing 4
    line_leading 0
    justify False        # True = justificado (espaços esticados)
    first_indent 0
    rest_indent 0
    color "#ffffff"

# Para o NOME do personagem (acima da fala)
style say_label:
    text_align 0.0
    bold True

# Texto vertical (raro, usado em poesias japonesas)
style poema_vertical:
    vertical True
    line_overlap_split 4`}
      />

      <h2>6. Slow text e CPS — controle de ritmo</h2>
      <p>
        CPS (caracteres por segundo) controla a velocidade do "typewriter".
        O jogador pode override em <code>preferences.text_cps</code>, mas
        você pode forçar momentos específicos:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy — ritmo dramático"
        code={`label confissao_yuki:
    scene bg quarto noite
    show yuki corada at center
    y "{cps=10}E-eu... sempre quis te dizer...{w=0.8}"
    y "{cps=10}que eu...{w=1.2}{cps=40}TE AMO!{/cps}"
    y "{nw}"
    pause 1.0
    y "Pronto. Falei.{w=0.5}{fast} Já pode rir."
    return`}
      />

      <h2>7. Ruby text (furigana) — texto japonês explicado</h2>
      <p>
        Em VNs com termos japoneses, ruby text mostra a leitura em hiragana
        acima do kanji. Útil no Sakura Café quando aparece um menu em
        japonês:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy — furigana"
        code={`label cardapio_jp:
    scene bg cafe
    "No cardápio japonês: {rb}抹茶{/rb}{rt}まっちゃ{/rt} (matcha)"
    "Especial: {rb}桜餅{/rb}{rt}さくらもち{/rt} — bolinho de cerejeira"
    s "Eu adoro {rb}苺{/rb}{rt}いちご{/rt} no shortcake!"
    return`}
      />

      <AlertBox type="info" title="Ruby precisa de espaço vertical">
        Ative em screens.rpy: <code>style.say_dialogue.ruby_style = style.ruby_style</code>{" "}
        e defina <code>style.ruby_style.size = 14</code>. Sem isso o
        furigana some (renderiza fora do balão).
      </AlertBox>

      <h2>8. Ligaduras, kerning e tipografia profissional</h2>

      <CodeBlock
        language="python"
        title="game/options.rpy — qualidade tipográfica"
        code={`# Antialiasing forte (subpixel) — texto mais nítido em LCD
define config.font_hinting = "auto"   # auto | normal | light | mono | none
define config.font_transforms = []

# Ligaduras (fi, fl) — ative se a fonte suportar
define style.default.kerning = 0
define style.default.line_spacing = 4

# Hinting forçado para telas pequenas (mobile)
init python:
    if renpy.android:
        config.font_hinting = "mono"`}
      />

      <Terminal
        path="~/sakura-cafe"
        lines={[
          {
            comment: "lint detecta tag de fonte apontando p/ arquivo inexistente",
            cmd: "renpy.sh . lint",
            out: `game/script.rpy:42 The font 'gui/fonts/SakuraScript.ttf' was not found.
1 error reported.`,
            outType: "error",
          },
          {
            comment: "depois de adicionar o TTF",
            cmd: "renpy.sh . lint",
            out: `Statistics:
  The game uses 4 distinct fonts.
  Total glyphs covered: 8,124 (PT-BR + JP + emoji).
Lint complete. No problems.`,
            outType: "success",
          },
        ]}
      />

      <PracticeBox
        title="Sakura cursiva + Akira monospace lado a lado"
        goal="Cada personagem fala com sua tipografia distinta — visual reforça a personalidade."
        steps={[
          "Baixe SakuraScript.ttf (cursiva) e JetBrainsMono.ttf — coloque em game/gui/fonts/.",
          "Em characters.rpy redefina s e a com who_font/what_font como mostrado na seção 4.",
          "Crie um label 'cena_dupla' com 4 falas alternadas entre s e a.",
          "Use {color=#ff66aa} numa fala da Sakura para destacar o nome de uma sobremesa.",
          "Rode renpy.sh . e veja o contraste visual.",
        ]}
        verify="O nome 'Sakura' aparece em script cursivo rosa, e 'Akira' em monospace azulado, durante toda a cena."
      >
        <CodeBlock
          language="python"
          title="game/script.rpy (gabarito)"
          code={`label cena_dupla:
    scene bg cafe with fade
    show sakura feliz at left
    show akira misterioso at right
    s "Hoje temos {color=#ff66aa}torta de morango{/color}!"
    a "log: pedido_unico = 1"
    s "{i}Por que você fala como um terminal?{/i}"
    a "{cps=15}Porque sou previsível.{/cps}"
    return`}
        />
      </PracticeBox>

      <AlertBox type="success" title="Resumo executável">
        Tags inline para efeitos pontuais. Fonte custom via{" "}
        <code>gui.text_font</code> ou por <code>Character(who_font=...)</code>.{" "}
        <code>config.font_replacement_map</code> para fallback automático. CPS
        controla ritmo. Ruby para japonês. Sempre rode <code>lint</code>{" "}
        depois de mudar fontes.
      </AlertBox>
    </PageContainer>
  );
}
