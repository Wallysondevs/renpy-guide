import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function MultipleDialogue() {
  return (
    <PageContainer
      title="Multiple Dialogue — falas atômicas em sequência"
      subtitle="O parâmetro 'multiple' do Character: como dizer N falas seguidas SEM voltar pro renderer entre elas. Útil pra duetos, monólogos rápidos e cenas de discussão no Sakura Café."
      difficulty="intermediario"
      timeToRead="12 min"
      prompt="lifecycle/multiple-dialogue"
    >
      <AlertBox type="info" title="O problema que multiple resolve">
        Em uma cena onde Sakura e Yuki falam ao mesmo tempo, ou um
        personagem dispara 3 falas curtas em sequência, o Ren'Py por
        padrão renderiza uma POR vez — o jogador clica entre elas.
        Com <code>multiple=N</code> o Ren'Py agrupa N falas em UM bloco
        atômico que renderiza junto, sem clique no meio. A doc oficial
        nem dá exemplo decente, então vamos ao real.
      </AlertBox>

      <h2>1. Sintaxe básica</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`# multiple=2 → "este Character só aparece em pares de fala"
define s = Character("Sakura", color="#ffaacc", multiple=2)
define y = Character("Yuki",   color="#aaccff", multiple=2)

label discussao_calorosa:
    scene bg cafe
    show sakura braba at left
    show yuki braba at right

    # As DUAS falas abaixo aparecem JUNTAS na mesma textbox.
    # O jogador clica 1x e ambas somem.
    s "Foi VOCÊ que esqueceu o forno ligado!"
    y "Eu?! Você que estava cuidando da torta!"

    return
`}
      />

      <h2>2. Como o Ren'Py renderiza</h2>
      <p>
        Quando 2 (ou mais) Characters declarados com <code>multiple=N</code>{" "}
        aparecem em sequência, a engine espera receber N falas antes de
        chamar o renderer. A textbox padrão mostra os nomes empilhados
        ou lado a lado (depende de como você customiza a screen{" "}
        <code>say</code>).
      </p>

      <CommandTable
        title="Variações de uso"
        variations={[
          {
            cmd: "Character('X', multiple=2)",
            desc: "Sempre agrupa em pares de 2 falas.",
            output: "2 falas → 1 textbox renderizada uma vez.",
          },
          {
            cmd: "Character('X', multiple=3)",
            desc: "Trio: 3 falas seguidas viram 1 bloco atômico.",
            output: "Ideal para coro de personagens (3 amigos rindo).",
          },
          {
            cmd: "fala (multiple=2)",
            desc: "Override pontual numa fala específica.",
            output: 's "Ah!" (multiple=2)',
          },
          {
            cmd: "Misturar multiple e single",
            desc: "Fala normal QUEBRA o agrupamento — clique acontece.",
            output: "s 'A'; n 'narração'; s 'B' → 2 cliques.",
          },
        ]}
      />

      <h2>3. Customizar a screen <code>say</code> para multiple</h2>
      <p>
        A screen <code>say</code> padrão só mostra UM personagem por vez.
        Pra suportar visual de "duas caixas lado a lado", você customiza:
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy"
        code={`screen say(who, what, multiple=None):
    style_prefix "say"

    if multiple is None:
        # Comportamento padrão (1 personagem)
        window:
            id "window"
            if who is not None:
                window:
                    id "namebox"
                    style "namebox"
                    text who id "who"
            text what id "what"
    else:
        # multiple = (índice, total). Ex: (1, 2) = primeira de duas.
        $ idx, total = multiple
        window:
            id "multi_window_" + str(idx)
            xfill False
            xsize 600
            xalign (0.0 if idx == 0 else 1.0)   # esquerda/direita
            yalign 0.95
            yoffset (-160 if idx == 0 else -20)

            vbox:
                if who is not None:
                    text who size 20 bold True
                text what size 18

    if not renpy.variant("small"):
        add SideImage() xalign 0.0 yalign 1.0
`}
      />

      <h2>4. Receita: monólogo rápido (3 falas seguidas)</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`# Define um Character pra "pensamentos" da Sakura — multiple=3
define sk_pensa = Character("Sakura (pensando)",
    color="#ffaaccaa",
    italic=True,
    multiple=3)

label decisao_dificil:
    scene bg cafe
    show sakura corada at center

    # Os 3 pensamentos abaixo aparecem JUNTOS na mesma caixa.
    # Visual: monólogo em itálico, como um stream of consciousness.
    sk_pensa "Devo dizer agora?"
    sk_pensa "E se ele não sentir o mesmo?"
    sk_pensa "Não, é melhor esperar mais um pouco..."

    # Aqui o jogador clica 1x e tudo segue.
    s "...desculpa, o que você disse mesmo?"
    return
`}
      />

      <h2>5. Receita: dueto de personagens cantando</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`define s = Character("Sakura", color="#ffaacc", multiple=2)
define y = Character("Yuki",   color="#aaccff", multiple=2)

label musica_no_cafe:
    scene bg cafe noite
    show sakura cantando at left
    show yuki cantando at right
    play music "audio/song_duo.ogg" fadein 1.0

    # Versos do dueto — as DUAS frases aparecem juntas
    s "🎵 As estrelas brilham sobre o café 🎵"
    y "🎵 E nossas vozes ecoam até de manhã 🎵"

    s "🎵 Cantamos por quem partiu 🎵"
    y "🎵 E por quem ainda vai chegar 🎵"

    stop music fadeout 2.0
    return
`}
      />

      <AlertBox type="warning" title="multiple=2 mas só 1 fala? Erro!">
        Se você declarou <code>multiple=2</code> mas dispara só 1 fala
        antes de quebrar (com <code>scene</code>, <code>menu</code>,
        narração comum), o Ren'Py espera o segundo "match" e pode travar
        a UI. Se for usar <code>multiple</code>, garanta que SEMPRE há N
        falas em sequência. Para flexibilidade, use override pontual{" "}
        <code>(multiple=2)</code> só onde precisar.
      </AlertBox>

      <h2>6. Detectando posição da fala (idx, total)</h2>
      <p>
        Dentro da screen <code>say</code>, o parâmetro <code>multiple</code>{" "}
        chega como tupla <code>(índice_zero_based, total)</code>. Isso
        permite alinhar a primeira fala à esquerda e a segunda à direita,
        ou colorir diferente:
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy — alinhar baseado em multiple"
        code={`screen say(who, what, multiple=None):
    if multiple is not None:
        $ idx, total = multiple
        $ pos_x = 0.05 + (0.9 * idx / max(total - 1, 1))

        frame:
            xanchor 0.5  yalign 0.92
            xpos pos_x
            xsize 400
            background Frame("gui/bubble.png", 20, 20)
            padding (16, 12)

            vbox:
                text who color who_args.get("color", "#fff") bold True
                text what
    else:
        use say_default(who, what)
`}
      />

      <h2>7. Casos onde multiple atrapalha</h2>

      <CommandTable
        title="Quando NÃO usar multiple"
        variations={[
          {
            cmd: "Diálogo normal 1-pra-1",
            desc: "Não precisa. Use Character() comum.",
            output: "multiple só faz sentido em sequências fixas.",
          },
          {
            cmd: "Antes de menu/jump/return",
            desc: "Quebra o agrupamento. A primeira fala fica órfã.",
            output: "Erro silencioso ou texto duplicado.",
          },
          {
            cmd: "Em rotas com escolha do jogador",
            desc: "Jogador não pode 'voltar' no meio do bloco multiple.",
            output: "Não dá rollback granular dentro do multiple.",
          },
          {
            cmd: "Com voice por fala",
            desc: "As 2 vozes tocam ao MESMO tempo se você não controlar.",
            output: "Use voice queue manualmente.",
          },
        ]}
      />

      <Terminal
        path="~/sakura-cafe"
        lines={[
          {
            comment: "verificando no console se uma fala está em modo multiple",
            cmd: "renpy.get_say_attributes()",
            out: `('multiple', (0, 2))   # primeira de duas`,
            outType: "info",
          },
          {
            comment: "lint detectando multiple desbalanceado",
            cmd: "renpy.sh . lint",
            out: `game/script.rpy:42 Character 's' declared with multiple=2,
but only 1 sequential say statement before scene change.
This will block input.

1 warning reported.`,
            outType: "warning",
          },
        ]}
      />

      <PracticeBox
        title="Trio de cumprimentos atômico"
        goal="Fazer Sakura, Yuki e Akira cumprimentarem o jogador em UMA única tela (sem cliques entre as 3 falas)."
        steps={[
          "Defina os 3 Characters com multiple=3.",
          "No label inicio, mostre os 3 sprites lado a lado.",
          "Faça 3 falas em sequência (sk, yk, ak).",
          "Verifique que o jogador clica 1 vez só pra avançar todas.",
          "Bonus: customize screen say pra mostrar 3 caixas em coluna.",
        ]}
        verify="As 3 falas aparecem simultaneamente na tela e somem juntas com 1 clique."
      >
        <CodeBlock
          language="python"
          title="game/script.rpy (gabarito)"
          code={`define sk = Character("Sakura", color="#ffaacc", multiple=3)
define yk = Character("Yuki",   color="#aaccff", multiple=3)
define ak = Character("Akira",  color="#ffcc99", multiple=3)

label inicio:
    scene bg cafe
    show sakura feliz at left
    show yuki rindo  at center
    show akira sorrindo at right

    sk "Bem-vindo ao Sakura Café!"
    yk "Esperamos que goste do nosso atendimento!"
    ak "Hoje o especial é torta de morango."

    return`}
        />
      </PracticeBox>

      <OutputBlock label="resumo de quando usar" type="success">
{`USAR multiple quando:
  ✓ Personagens cantam/falam em uníssono
  ✓ Monólogo interno em N pensamentos rápidos
  ✓ Cenas dramáticas com sobreposição de vozes
  ✓ Coro de NPCs ("BOM DIA!")

NÃO usar quando:
  ✗ Diálogo normal 1-pra-1
  ✗ Há menu/jump/return entre falas
  ✗ Cada fala precisa de rollback individual`}
      </OutputBlock>

      <AlertBox type="success" title="Combo com Bubble">
        Se você usa <strong>Speech Bubbles</strong>, o multiple combina
        perfeitamente: 2 balões aparecem ao mesmo tempo, um sobre cada
        personagem. Veja a página <code>Bubble</code> pra montar o visual.
      </AlertBox>
    </PageContainer>
  );
}
