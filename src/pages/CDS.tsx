import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function CDS() {
  return (
    <PageContainer
      title="CDS — Creator-Defined Statements"
      subtitle={`Inventar sua própria sintaxe Ren'Py: usar python early para registrar parser, lexer e executor. Transformar 'pedido s "café com leite"' automaticamente em 's "Vou querer um café com leite"' + sfx + tracker.`}
      difficulty="avancado"
      timeToRead="22 min"
      prompt="python/cds"
    >
      <AlertBox type="info" title="Por que inventar statement?">
        Quando o mesmo PADRÃO se repete 50+ vezes no roteiro, vale criar
        um statement só seu. Em vez de copiar 4 linhas a cada pedido no
        Sakura Café, você escreve <code>pedido s "café com leite"</code>{" "}
        e a engine expande para fala, soma no contador e toca SFX.
        Reduz erro de copy-paste, deixa o roteiro LEGÍVEL.
      </AlertBox>

      <h2>1. Como funciona — pipeline interno</h2>
      <p>
        Quando o Ren'Py compila um <code>.rpy</code>, ele faz parse linha
        por linha. Você pode injetar um parser custom ANTES (com{" "}
        <code>python early</code>) que reconhece sua sintaxe e devolve
        callbacks de execução, lint e predict.
      </p>

      <OutputBlock label="pipeline de um statement custom" type="info">
{`.rpy lido →
  python early registra parser →
    parser bate na linha "pedido s \\"café com leite\\"" →
      parse() devolve dict {char:"s", item:"café com leite"} →
        execute(dict) roda em runtime →
          equivale a 4 linhas de roteiro`}
      </OutputBlock>

      <h2>2. API mínima de <code>renpy.register_statement</code></h2>

      <CommandTable
        title="Argumentos de register_statement"
        variations={[
          {
            cmd: "name",
            desc: "Palavra que dispara o statement (ex: 'pedido', 'sfx').",
            output: '"pedido"',
          },
          {
            cmd: "parse=fn(lex)",
            desc: "Recebe lexer; retorna estrutura de dados (dict).",
            output: "def parse(l): ...",
          },
          {
            cmd: "execute=fn(p)",
            desc: "Roda em tempo de execução. Recebe o que parse() devolveu.",
            output: "def execute(p): renpy.say(...)",
          },
          {
            cmd: "lint=fn(p)",
            desc: "Validação no 'renpy lint'. Use renpy.error() para reportar.",
            output: "def lint(p): assert p['char']",
          },
          {
            cmd: "predict=fn(p)",
            desc: "Lista de imagens/áudio para preload.",
            output: "return ['audio/ding.ogg']",
          },
          {
            cmd: "warp=fn(p)",
            desc: "Quanto tempo o warp considera para skip (segundos).",
            output: "return 0.5",
          },
          {
            cmd: "translation_strings=fn(p)",
            desc: "Strings traduzíveis (extraídas pelo translator).",
            output: "yield p['item']",
          },
          {
            cmd: "block=True/False/'possible'",
            desc: "Aceita bloco aninhado (com :)?",
            output: "block=True",
          },
        ]}
      />

      <h2>3. Statement completo: <code>pedido</code></h2>

      <CodeBlock
        title="game/statements/pedido.rpy"
        language="python"
        code={`python early:

    def parse_pedido(lex):
        # Espera: pedido <char> "<item>"
        char = lex.simple_expression()        # ex: 's' ou 'sakura'
        if char is None:
            lex.error("Esperava o personagem antes do item.")
        item = lex.string()                   # string entre aspas
        if item is None:
            lex.error("Esperava string com o nome do item.")
        return {"char": char, "item": item}

    def execute_pedido(p):
        # Em runtime, monta a fala formatada
        char_obj = getattr(store, p["char"])  # resolve 's' → Character Sakura
        renpy.sound.play("audio/sfx_ding.ogg")
        renpy.say(char_obj, "Vou querer um " + p["item"] + ", por favor!")
        # Tracking: incrementa contador global
        store.pedidos_feitos = getattr(store, "pedidos_feitos", 0) + 1
        store.cardapio_log = getattr(store, "cardapio_log", []) + [p["item"]]

    def lint_pedido(p):
        if not p["item"]:
            renpy.error("'pedido' precisa de um nome de item não-vazio.")

    def predict_pedido(p):
        return ["audio/sfx_ding.ogg"]

    renpy.register_statement(
        "pedido",
        parse=parse_pedido,
        execute=execute_pedido,
        lint=lint_pedido,
        predict=predict_pedido,
    )
`}
      />

      <CodeBlock
        title="game/script.rpy — usando o novo statement"
        language="python"
        code={`define s = Character("Sakura", color="#ffaacc")
define y = Character("Yuki", color="#aaccff")

default pedidos_feitos = 0
default cardapio_log = []

label cena_balcao:
    scene bg cafe
    show sakura happy at right
    "A Sakura te entrega o cardápio."

    pedido s "café com leite"
    pedido s "fatia de torta de morango"
    pedido y "matcha latte"

    s "Pronto! [pedidos_feitos] pedidos anotados."
    return
`}
      />

      <AlertBox type="warning" title="Por que python early?">
        <code>init python:</code> roda APÓS o parser ler todos os
        arquivos. Statements custom precisam estar registrados ANTES do
        parser bater nas linhas que os usam. <code>python early:</code>{" "}
        roda antes do parse — única opção.
      </AlertBox>

      <h2>4. Lexer — o que dá pra extrair</h2>

      <CommandTable
        title="Métodos úteis do objeto 'lex' em parse()"
        variations={[
          {
            cmd: "lex.string()",
            desc: 'String entre aspas (simples ou duplas). None se não houver.',
            output: '"café com leite"',
          },
          {
            cmd: "lex.word()",
            desc: "Identificador alfanumérico (não palavras-chave).",
            output: '"cappuccino"',
          },
          {
            cmd: "lex.simple_expression()",
            desc: "Expressão Python simples (var, atributo, chamada).",
            output: '"sakura.afeicao + 1"',
          },
          {
            cmd: "lex.integer()",
            desc: "Inteiro literal. None se não for número.",
            output: "42",
          },
          {
            cmd: "lex.float()",
            desc: "Float literal.",
            output: "1.5",
          },
          {
            cmd: "lex.keyword('com')",
            desc: "Aceita a palavra exata; True/False.",
            output: "True (consome 'com')",
          },
          {
            cmd: "lex.match(r'pattern')",
            desc: "Regex match no que sobrou da linha.",
            output: '"#ffaacc"',
          },
          {
            cmd: "lex.error(msg)",
            desc: "Aborta parse com mensagem amigável.",
            output: "raise ParseError",
          },
          {
            cmd: "lex.expect_eol()",
            desc: "Garante fim de linha (sem lixo extra).",
            output: "pass / erro",
          },
          {
            cmd: "lex.subblock_lexer()",
            desc: "Lexer p/ bloco aninhado quando block=True.",
            output: "iterar linha por linha",
          },
        ]}
      />

      <h2>5. Statement com bloco aninhado</h2>
      <p>
        Para sintaxe rica tipo <code>cardapio: ...</code>, use{" "}
        <code>block=True</code> e itere o sub-bloco no parse.
      </p>

      <CodeBlock
        title="game/statements/cardapio.rpy"
        language="python"
        code={`python early:

    def parse_cardapio(lex):
        lex.expect_block("cardapio")
        items = []
        sublex = lex.subblock_lexer()
        while sublex.advance():
            nome = sublex.string()
            sublex.keyword("por")
            preco = sublex.integer()
            items.append({"nome": nome, "preco": preco})
        return {"items": items}

    def execute_cardapio(p):
        opcoes = [(f"{i['nome']} (R$ {i['preco']})", i) for i in p["items"]]
        opcoes.append(("Só observar...", None))
        escolha = renpy.display_menu(opcoes)
        if escolha:
            store.ultimo_pedido = escolha
            renpy.say(store.s, f"Saiu um {escolha['nome']}!")

    renpy.register_statement(
        "cardapio",
        parse=parse_cardapio,
        execute=execute_cardapio,
        block=True,
    )
`}
      />

      <CodeBlock
        title="game/script.rpy — usando bloco"
        language="python"
        code={`label balcao:
    show sakura happy at right
    s "Olha o que temos hoje:"

    cardapio:
        "espresso" por 8
        "cappuccino" por 12
        "matcha latte" por 15
        "torta de morango" por 18

    s "Boa escolha!"
    return
`}
      />

      <h2>6. Statement com keyword: <code>sfx</code></h2>

      <CodeBlock
        title="game/statements/sfx.rpy"
        language="python"
        code={`python early:

    def parse_sfx(lex):
        nome = lex.word()              # ex: 'sino', 'porta', 'xicara'
        volume = 1.0
        if lex.keyword("vol"):
            volume = lex.float() or 1.0
        lex.expect_eol()
        return {"nome": nome, "volume": volume}

    def execute_sfx(p):
        path = f"audio/sfx_{p['nome']}.ogg"
        renpy.sound.set_volume(p["volume"])
        renpy.sound.play(path)

    def predict_sfx(p):
        return [f"audio/sfx_{p['nome']}.ogg"]

    def lint_sfx(p):
        path = f"audio/sfx_{p['nome']}.ogg"
        if not renpy.loadable(path):
            renpy.error(f"SFX não encontrado: {path}")

    renpy.register_statement(
        "sfx",
        parse=parse_sfx,
        execute=execute_sfx,
        predict=predict_sfx,
        lint=lint_sfx,
    )
`}
      />

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`label entrada:
    sfx sino
    "O sino da porta tilinta."
    sfx porta vol 0.5
    "A porta range baixinho."
    sfx xicara
    s "Aceita um café enquanto espera?"
    return
`}
      />

      <h2>7. Lint robusto — pegue erros antes do jogador</h2>

      <Terminal
        path="~/sakura-cafe"
        lines={[
          {
            comment: "lint roda TODOS os lint() registrados",
            cmd: "renpy.sh . lint",
            out: `game/script.rpy:42 SFX não encontrado: audio/sfx_xilofone.ogg
game/script.rpy:88 'pedido' precisa de um nome de item não-vazio.

2 errors reported. Lint took 0.84s.`,
            outType: "error",
          },
          {
            comment: "após corrigir",
            cmd: "renpy.sh . lint",
            out: `Statistics:
  Custom statements found: 14 'pedido', 6 'cardapio', 23 'sfx'.

Lint complete. No problems were found.`,
            outType: "success",
          },
        ]}
      />

      <h2>8. Translation — não esqueça do PT-BR/EN</h2>
      <p>
        Strings dentro do seu statement NÃO são traduzidas
        automaticamente. Use <code>translation_strings</code> para
        listar o que sai pro translator:
      </p>

      <CodeBlock
        title="game/statements/pedido.rpy — adicionando translation"
        language="python"
        code={`def translation_strings_pedido(p):
    yield "Vou querer um " + p["item"] + ", por favor!"

renpy.register_statement(
    "pedido",
    parse=parse_pedido,
    execute=execute_pedido,
    lint=lint_pedido,
    predict=predict_pedido,
    translation_strings=translation_strings_pedido,
)
`}
      />

      <h2>9. Gotchas frequentes</h2>

      <OutputBlock label="problemas comuns ao criar CDS" type="warning">
{`1. Usar 'init python:' em vez de 'python early:' → linha não compila
2. Esquecer lex.expect_eol() → ignora silenciosamente erros de digitação
3. Acessar 'store.x' antes do default → AttributeError em runtime
4. Statement com nome que conflita com builtin (show, hide) → quebra parser
5. predict() retornando string em vez de lista → erro só em mobile
6. execute() mutável sem default → save quebra ao rollback`}
      </OutputBlock>

      <AlertBox type="danger" title="Rollback friendly">
        Se seu <code>execute</code> muda variáveis, certifique-se de que
        elas estão em <code>default</code> (não <code>define</code>) —
        senão o rollback do Ren'Py não consegue voltar ao estado
        anterior e o jogador fica preso em estado inválido.
      </AlertBox>

      <PracticeBox
        title="Crie o statement 'narrar'"
        goal='Inventar `narrar 2.0 "texto..."` que mostra a frase mais devagar (cps reduzido) e pausa N segundos depois.'
        steps={[
          "Crie game/statements/narrar.rpy",
          "Em python early defina parse_narrar(lex): pegue lex.float() para tempo, lex.string() para texto.",
          "Execute: use renpy.say(narrator, texto, cb_args={'cps':10}) e renpy.pause(p['tempo']).",
          "Lint: garanta texto não vazio e tempo > 0.",
          "Registre com renpy.register_statement('narrar', parse=..., execute=..., lint=...).",
          'Use no script: narrar 1.5 "O silêncio do café era denso." e veja a fala lenta.',
        ]}
        verify="A frase aparece em câmera lenta (cps baixo) e a engine espera mais 1.5s antes de avançar."
      >
        <CodeBlock
          title="game/statements/narrar.rpy (gabarito)"
          language="python"
          code={`python early:

    def parse_narrar(lex):
        tempo = lex.float()
        texto = lex.string()
        lex.expect_eol()
        return {"tempo": tempo, "texto": texto}

    def execute_narrar(p):
        renpy.say(None, "{cps=12}" + p["texto"] + "{/cps}")
        renpy.pause(p["tempo"])

    def lint_narrar(p):
        if not p["texto"]:
            renpy.error("'narrar' precisa de texto.")
        if p["tempo"] is None or p["tempo"] <= 0:
            renpy.error("'narrar' precisa de tempo > 0.")

    renpy.register_statement(
        "narrar",
        parse=parse_narrar,
        execute=execute_narrar,
        lint=lint_narrar,
    )`}
        />
      </PracticeBox>

      <AlertBox type="success" title="Próximo passo">
        Statements custom alteram a SINTAXE. As <strong>Custom Text Tags</strong>{" "}
        alteram o que aparece DENTRO de uma string. Veja como criar{" "}
        <code>{`{coracao}`}</code>, <code>{`{xicara}`}</code> e tags de
        emoji do café.
      </AlertBox>
    </PageContainer>
  );
}
