import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function CustomTextTags() {
  return (
    <PageContainer
      title="Custom Text Tags — inventando suas próprias tags"
      subtitle="config.custom_text_tags e config.self_closing_custom_text_tags: criar tags como {coracao}, {xicara}, {sakura_color}...{/sakura_color} que viram emojis ou trocam estilo. Como funciona o callback e os limites."
      difficulty="avancado"
      timeToRead="14 min"
      prompt="python/custom-text-tags"
    >
      <AlertBox type="info" title="Para que servem?">
        Tags built-in tipo <code>{`{b}`}</code>, <code>{`{color=...}`}</code>{" "}
        cobrem 80% dos casos. Mas e quando você quer escrever{" "}
        <code>"Eu te amo {`{coracao}`}"</code> e que vire literalmente um
        emoji rosa? Ou <code>{`{nome_jogador}`}</code> que pega o nome
        digitado pelo cliente do café? Custom text tags resolvem isso de
        forma limpa, sem polluir cada string com Python.
      </AlertBox>

      <h2>1. Self-closing tag — substituição direta</h2>
      <p>
        A forma mais simples: tag única, sem fechamento, vira um texto
        ou imagem inline. Use <code>config.self_closing_custom_text_tags</code>.
      </p>

      <CodeBlock
        title="game/text_tags.rpy"
        language="python"
        code={`init python:

    def tag_coracao(tag, argument):
        # tag = "coracao", argument = "" (sem '=...')
        return [
            (renpy.TEXT_TEXT, "❤"),
        ]

    def tag_xicara(tag, argument):
        return [
            (renpy.TEXT_TEXT, "☕"),
        ]

    def tag_sakura_emoji(tag, argument):
        return [
            (renpy.TEXT_TEXT, "🌸"),
        ]

    config.self_closing_custom_text_tags["coracao"] = tag_coracao
    config.self_closing_custom_text_tags["xicara"] = tag_xicara
    config.self_closing_custom_text_tags["sakura"] = tag_sakura_emoji
`}
      />

      <CodeBlock
        title="game/script.rpy — usando as tags"
        language="python"
        code={`label cena_confissao:
    show sakura corada at center

    s "Eu... eu gosto muito de você. {coracao}"
    s "Quer dividir um {xicara} comigo amanhã?"
    "Pétalas {sakura} caem suavemente sobre o balcão."
    return
`}
      />

      <h2>2. Tag com argumento</h2>
      <p>
        Permita variações: <code>{`{xicara=grande}`}</code> ou{" "}
        <code>{`{nivel=cheio}`}</code>. O segundo parâmetro do callback
        recebe o que vem após <code>=</code>.
      </p>

      <CodeBlock
        title="game/text_tags.rpy"
        language="python"
        code={`init python:

    def tag_xicara_arg(tag, argument):
        # argument pode ser "", "pequena", "grande", "cheia", "vazia"
        mapa = {
            "": "☕",
            "pequena": "🍵",
            "grande": "🍶",
            "cheia": "☕✨",
            "vazia": "🥛",
        }
        return [(renpy.TEXT_TEXT, mapa.get(argument, "☕"))]

    config.self_closing_custom_text_tags["xicara"] = tag_xicara_arg
`}
      />

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`s "Quer um {xicara=grande} de cappuccino?"
s "Ou prefere um {xicara=pequena} de matcha?"
s "Cuidado, está {xicara=cheia}."
`}
      />

      <h2>3. Tag de abertura/fechamento — <code>config.custom_text_tags</code></h2>
      <p>
        Para tags como <code>{`{glow}...{/glow}`}</code> que afetam um
        TRECHO, use <code>config.custom_text_tags</code>. O callback
        recebe contents (lista de tokens) e retorna nova lista.
      </p>

      <CodeBlock
        title="game/text_tags.rpy"
        language="python"
        code={`init python:

    def tag_sakura_color(tag, argument, contents):
        """Pinta o trecho com a cor da Sakura (rosa pastel)."""
        return [
            (renpy.TEXT_TAG, "color=#ffaacc"),
            *contents,
            (renpy.TEXT_TAG, "/color"),
        ]

    def tag_yuki_color(tag, argument, contents):
        return [
            (renpy.TEXT_TAG, "color=#aaccff"),
            *contents,
            (renpy.TEXT_TAG, "/color"),
        ]

    def tag_grita(tag, argument, contents):
        """Maiusculiza + negrito + tamanho maior."""
        novos = []
        novos.append((renpy.TEXT_TAG, "b"))
        novos.append((renpy.TEXT_TAG, "size=+8"))
        for kind, value in contents:
            if kind == renpy.TEXT_TEXT:
                novos.append((renpy.TEXT_TEXT, value.upper()))
            else:
                novos.append((kind, value))
        novos.append((renpy.TEXT_TAG, "/size"))
        novos.append((renpy.TEXT_TAG, "/b"))
        return novos

    config.custom_text_tags["sakura_color"] = tag_sakura_color
    config.custom_text_tags["yuki_color"] = tag_yuki_color
    config.custom_text_tags["grita"] = tag_grita
`}
      />

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`narrator "{sakura_color}A voz da Sakura ecoava no salão.{/sakura_color}"
y "{grita}NÃO ENCOSTA NA MINHA TORTA!{/grita}"
narrator "Akira: {yuki_color}'tudo bem, calminha aí'{/yuki_color}"
`}
      />

      <h2>4. O retorno é uma lista de tokens</h2>

      <CommandTable
        title="Tipos de token aceitos"
        variations={[
          {
            cmd: "renpy.TEXT_TEXT",
            desc: "Texto literal que aparece na tela.",
            output: '(renpy.TEXT_TEXT, "Olá")',
          },
          {
            cmd: "renpy.TEXT_TAG",
            desc: "Outra tag (built-in ou custom). NÃO inclua chaves.",
            output: '(renpy.TEXT_TAG, "color=#fff")',
          },
          {
            cmd: "renpy.TEXT_PARAGRAPH",
            desc: "Quebra de parágrafo (equivalente a {p}).",
            output: "(renpy.TEXT_PARAGRAPH, None)",
          },
          {
            cmd: "renpy.TEXT_DISPLAYABLE",
            desc: "Insere um displayable inline (ex: imagem, sprite).",
            output: '(renpy.TEXT_DISPLAYABLE, Image("img.png"))',
          },
        ]}
      />

      <h2>5. Tag com displayable inline (emoji custom em PNG)</h2>
      <p>
        Quer usar o emoji da SUA marca (logo do Sakura Café) inline?
        Devolva um displayable:
      </p>

      <CodeBlock
        title="game/text_tags.rpy"
        language="python"
        code={`init python:

    def tag_logo_cafe(tag, argument):
        # 'argument' opcional: tamanho em pixels, default 24
        try:
            tam = int(argument) if argument else 24
        except ValueError:
            tam = 24
        d = Transform("images/ui/logo_pequeno.png", zoom=tam/64.0)
        return [(renpy.TEXT_DISPLAYABLE, d)]

    config.self_closing_custom_text_tags["logo"] = tag_logo_cafe
`}
      />

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`s "Bem-vindo ao {logo} Sakura Café!"
s "Hoje é dia de promoção: 2 cookies por R$ 5 {logo=18}"
`}
      />

      <h2>6. Caso real: <code>{`{nome_jogador}`}</code> dinâmico</h2>
      <p>
        Resolve o nome do jogador (digitado em <code>renpy.input</code>)
        em qualquer lugar do roteiro, sem precisar de interpolação{" "}
        <code>"[nome]"</code>:
      </p>

      <CodeBlock
        title="game/text_tags.rpy"
        language="python"
        code={`init python:

    def tag_nome_jogador(tag, argument):
        nome = getattr(store, "player_name", "viajante")
        # argument controla case: 'maiusc', 'minusc', '' (default)
        if argument == "maiusc":
            nome = nome.upper()
        elif argument == "minusc":
            nome = nome.lower()
        return [(renpy.TEXT_TEXT, nome)]

    config.self_closing_custom_text_tags["jogador"] = tag_nome_jogador
`}
      />

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`default player_name = "Aluno(a)"

label intro:
    $ player_name = renpy.input("Como devo te chamar?", default="Aluno(a)", length=20)

    s "Prazer, {jogador}!"
    s "Sua mesa preferida está livre, {jogador=maiusc}."
    "O sininho da porta toca quando {jogador} se senta."
    return
`}
      />

      <h2>7. Tag combinada com cores via argumento</h2>

      <CodeBlock
        title="game/text_tags.rpy"
        language="python"
        code={`init python:

    cores_personagens = {
        "sakura": "#ffaacc",
        "yuki": "#aaccff",
        "akira": "#ffcc99",
        "hana": "#ccffaa",
        "mei": "#ffccee",
        "rin": "#ccffff",
    }

    def tag_npc_color(tag, argument, contents):
        cor = cores_personagens.get(argument, "#ffffff")
        return [
            (renpy.TEXT_TAG, "color=" + cor),
            *contents,
            (renpy.TEXT_TAG, "/color"),
        ]

    config.custom_text_tags["npc"] = tag_npc_color
`}
      />

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`narrator "{npc=sakura}— Bem-vindo!{/npc} disse a Sakura."
narrator "{npc=yuki}— Ela está atrasada de novo.{/npc} resmungou a Yuki."
narrator "{npc=akira}— Eu trouxe os doces!{/npc} gritou o Akira da porta."
`}
      />

      <h2>8. Lint, debug e gotchas</h2>

      <Terminal
        path="~/sakura-cafe"
        lines={[
          {
            comment: "tag não registrada → lint avisa",
            cmd: "renpy.sh . lint",
            out: `game/script.rpy:14 Unknown text tag '{coracao}'. Did you forget to
register it in config.self_closing_custom_text_tags?

1 warning reported.`,
            outType: "warning",
          },
          {
            comment: "tag de fechamento mal balanceada",
            cmd: "renpy.sh . lint",
            out: `game/script.rpy:22 Tag '{sakura_color}' opened but never closed.`,
            outType: "error",
          },
        ]}
      />

      <OutputBlock label="erros típicos" type="warning">
{`1. Esquecer de registrar em init python: → tag aparece como texto cru
2. Devolver string em vez de lista de tuplas → engine quebra
3. Custom_text_tags vs self_closing — escolher o errado:
   - {tag}        → self_closing_custom_text_tags
   - {tag}...{/}  → custom_text_tags
4. Nome de tag conflitando com builtin (b, i, color, size) → ignora
5. Argument sempre string — converter int/float manualmente
6. Tag aninhada de cor abre mas não fecha → texto inteiro pinta`}
      </OutputBlock>

      <AlertBox type="warning" title="Performance">
        Cada string com tag é re-processada no display. Em loops de 100+
        falas, prefira pré-processar com <code>str.replace()</code> em{" "}
        <code>init python:</code>. Mas para uso normal (até 50 falas/min)
        não tem problema perceptível.
      </AlertBox>

      <PracticeBox
        title="Tag {temp=...} que vira ícone colorido"
        goal="Criar tag self-closing {temp=N} que mostra um termômetro emoji colorido conforme o valor (frio azul, morno amarelo, quente vermelho)."
        steps={[
          "Crie game/text_tags.rpy",
          "Em init python: defina def tag_temp(tag, argument):",
          "Converta argument para int (default 25). Se < 30 → '🥶', 30-70 → '☕', > 70 → '🔥'.",
          "Devolva [(renpy.TEXT_TEXT, emoji)].",
          "Registre em config.self_closing_custom_text_tags['temp'] = tag_temp.",
          'No script: s "Esse café está {temp=85} pelando!" e s "Já está {temp=20}, esfriou."',
        ]}
        verify="As falas mostram o emoji correto baseado no número passado, sem precisar de Python no roteiro."
      >
        <CodeBlock
          title="game/text_tags.rpy (gabarito)"
          language="python"
          code={`init python:
    def tag_temp(tag, argument):
        try:
            v = int(argument) if argument else 25
        except ValueError:
            v = 25
        if v < 30:
            emoji = "🥶"
        elif v <= 70:
            emoji = "☕"
        else:
            emoji = "🔥"
        return [(renpy.TEXT_TEXT, emoji)]

    config.self_closing_custom_text_tags["temp"] = tag_temp`}
        />
      </PracticeBox>

      <AlertBox type="success" title="Próximo passo">
        Tags afetam aparência. Para reagir a EVENTOS de uma fala (toque
        de SFX, callback ao terminar), você precisa de{" "}
        <strong>Character Callbacks</strong>.
      </AlertBox>
    </PageContainer>
  );
}
