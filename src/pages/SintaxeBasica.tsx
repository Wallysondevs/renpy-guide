import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function SintaxeBasica() {
  return (
    <PageContainer
      title="Sintaxe básica do .rpy"
      subtitle="A anatomia de um arquivo Ren'Py: indentação obrigatória, comentários, statements (scene, show, hide, jump, call, return, with, play, stop, pause), strings com escape e a forma do bloco de código que vai estruturar TODO o seu jogo."
      difficulty="iniciante"
      timeToRead="14 min"
      prompt="linguagem/sintaxe-basica"
    >
      <AlertBox type="info" title="Ren'Py é Python disfarçado de roteiro">
        Cada arquivo <code>.rpy</code> é uma mistura de DSL própria do Ren'Py
        (statements como <code>scene</code>, <code>show</code>,{" "}
        <code>jump</code>) com Python puro (variáveis, funções, classes
        dentro de <code>init python:</code>). A engine traduz o{" "}
        <code>.rpy</code> em <code>.rpyc</code> (bytecode) e roda em cima
        de um interpretador Python embutido.
      </AlertBox>

      <h2>1. Anatomia de um script.rpy mínimo</h2>
      <p>
        Quando o Launcher cria um projeto novo, ele já gera um{" "}
        <code>game/script.rpy</code> com a estrutura mínima. Toda VN
        começa por um <code>label start:</code> — esse é o ponto de entrada
        que a engine procura ao apertar "Start" no menu principal.
      </p>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`# O caractere '#' inicia um comentário até o fim da linha.
# Ren'Py ignora linhas em branco e comentários.

# Define o personagem Sakura, com nome em rosa pastel.
define s = Character("Sakura", color="#ffaacc")

# 'image' associa um nome curto a um arquivo dentro de game/images/.
image bg cafe = "images/bg_cafe.png"
image sakura happy = "images/sakura_happy.png"

# Ponto de entrada do jogo. A engine SEMPRE procura 'label start:'.
label start:

    # 'scene' troca o background e LIMPA todos os sprites.
    scene bg cafe with fade

    # 'show' adiciona um sprite à tela.
    show sakura happy at right with dissolve

    # Linha de narração (sem personagem definido).
    "O sino da porta toca enquanto você entra no Sakura Café."

    # Linha de diálogo. 's' é o Character definido lá em cima.
    s "Bem-vindo! Sente onde quiser, eu já trago o cardápio."

    # 'pause' sem argumento espera o jogador clicar.
    pause

    # 'hide' remove um sprite. 'with dissolve' faz fade out.
    hide sakura with dissolve

    # 'return' encerra a cena e volta ao menu principal.
    return
`}
      />

      <h2>2. Indentação: 4 espaços, sem exceção</h2>
      <p>
        Ren'Py é como Python: <strong>indentação faz parte da sintaxe</strong>.
        Tudo que pertence a um bloco precisa estar deslocado uniformemente.
        O padrão da comunidade é <strong>4 espaços</strong> (NUNCA misture
        tabs e espaços — o lint quebra).
      </p>

      <CodeBlock
        title="game/script.rpy — bloco aninhado"
        language="python"
        code={`label cap1:
    scene bg escola with fade
    "Era a primeira semana de aula."

    menu:
        "Falar com a Sakura":
            jump cena_sakura
        "Ir direto pra biblioteca":
            jump cena_biblioteca
        "Continuar dormindo":
            "Você fechou os olhos e o sino tocou. Atrasado de novo."
            jump cap2

label cena_sakura:
    show sakura happy at center
    s "Você é o(a) novo(a) da turma, né?"
    return
`}
      />

      <AlertBox type="warning" title="Erro mais comum do iniciante">
        Misturar tabs com espaços. Configure o seu editor (VSCode, Atom,
        Sublime) para "Insert spaces" e "Tab size: 4". Se aparecer{" "}
        <code>IndentationError</code> ao rodar o jogo, abra o arquivo no
        modo "show whitespace" e veja se algum bloco usa tab.
      </AlertBox>

      <h2>3. Comentários</h2>
      <p>
        Ren'Py aceita o mesmo estilo de comentário do Python: tudo após{" "}
        <code>#</code> na mesma linha é ignorado. Use comentários para
        marcar capítulos, deixar lembretes para a tradução ou explicar
        sistemas complexos.
      </p>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`# ============================================================
# CAPÍTULO 2 — A noite do festival
# ============================================================

label cap2:
    # TODO: trocar o BG por um céu estrelado depois do final do dia.
    scene bg festival_dia

    # NOTA TRADUÇÃO: "yatai" = barraca de comida japonesa.
    "As barracas (yatai) começavam a se montar na praça."
`}
      />

      <h2>4. Statements — o vocabulário do Ren'Py</h2>
      <p>
        Cada linha que NÃO é diálogo nem comentário é um{" "}
        <em>statement</em>. Existem cerca de 30 statements oficiais, mas
        os 12 abaixo cobrem 95% de qualquer VN.
      </p>

      <CommandTable
        title="Statements essenciais que aparecem em toda VN"
        variations={[
          {
            cmd: "scene <imagem>",
            desc: "Limpa a tela e coloca um background novo.",
            output: "scene bg cafe with fade",
          },
          {
            cmd: "show <imagem> at <pos>",
            desc: "Adiciona um sprite na tela, sem remover o resto.",
            output: "show sakura happy at right",
          },
          {
            cmd: "hide <imagem>",
            desc: "Remove um sprite da tela.",
            output: "hide sakura with dissolve",
          },
          {
            cmd: "with <transição>",
            desc: "Aplica uma transição à última mudança visual (também sufixo).",
            output: "with fade   |   with Dissolve(1.0)",
          },
          {
            cmd: "play <canal> \"arquivo\"",
            desc: "Toca música ou som no canal indicado (music, sound, voice).",
            output: 'play music "audio/theme.ogg" fadein 1.0',
          },
          {
            cmd: "stop <canal>",
            desc: "Para o áudio do canal, opcionalmente com fade-out.",
            output: "stop music fadeout 2.0",
          },
          {
            cmd: "pause [segundos]",
            desc: "Pausa a cena. Sem argumento espera clique do jogador.",
            output: "pause 1.5",
          },
          {
            cmd: "jump <label>",
            desc: "Salto incondicional para outro label. Não retorna.",
            output: "jump cap2",
          },
          {
            cmd: "call <label>",
            desc: "Chama outro label como sub-rotina. Volta com 'return'.",
            output: "call cena_extra",
          },
          {
            cmd: "return",
            desc: "Encerra o label atual: volta para o caller ou para o menu.",
            output: "return",
          },
          {
            cmd: "menu:",
            desc: "Cria um bloco de escolhas para o jogador.",
            output: 'menu:\n    "Confessar":\n        jump rota_amor',
          },
          {
            cmd: "$ <python>",
            desc: "Executa UMA linha de Python puro (atribuir variável, chamar função).",
            output: "$ afeicao_sakura += 1",
          },
        ]}
      />

      <h2>5. Strings, aspas e caracteres especiais</h2>
      <p>
        Toda fala em Ren'Py é uma string entre aspas duplas. Para usar
        aspas dentro da fala, escape com <code>\"</code>. Quebras de
        linha podem ser representadas por <code>\n</code> ou pela tag{" "}
        <code>{`{w}`}</code> (que pausa esperando clique). Ren'Py aceita
        UTF-8 nativamente — pode escrever em português com acentos sem
        configuração extra.
      </p>

      <CodeBlock
        title="game/script.rpy — strings na prática"
        language="python"
        code={`label exemplo_strings:
    # Aspas duplas dentro do texto: escape com \\"
    "A placa dizia: \\"Aberto até as 22h\\"."

    # Quebra explícita de linha com \\n
    "Linha 1\\nLinha 2 (logo abaixo)"

    # Pausa esperando clique (continua na mesma fala)
    "O silêncio se prolongou.{w} Só o tique do relógio quebrava a tensão."

    # Aspas simples também funcionam — útil quando o texto tem aspas duplas
    'Ela murmurou: "isso não estava no plano".'

    # String multilinha com triplas — preserva quebras
    """
    Caro diário,

    Hoje foi o dia mais estranho da minha vida.
    """
    return
`}
      />

      <h2>6. Tags de texto inline</h2>
      <p>
        Dentro de qualquer string você pode embutir tags entre chaves{" "}
        <code>{`{ }`}</code> para mudar formatação, cor, velocidade ou
        inserir pausas. Toda tag de abertura precisa de fechamento, exceto{" "}
        <code>{`{w}`}</code>, <code>{`{p}`}</code> e <code>{`{nw}`}</code>{" "}
        que são auto-fechadas.
      </p>

      <CommandTable
        title="Tags de texto mais usadas em diálogos"
        variations={[
          { cmd: "{b}negrito{/b}", desc: "Texto em negrito.", output: "negrito" },
          { cmd: "{i}itálico{/i}", desc: "Texto em itálico.", output: "itálico" },
          { cmd: "{u}sublinhado{/u}", desc: "Texto sublinhado.", output: "sublinhado" },
          { cmd: "{s}riscado{/s}", desc: "Texto com strikethrough.", output: "riscado" },
          { cmd: "{color=#ff0066}rosa{/color}", desc: "Pinta o trecho com cor hexadecimal.", output: "rosa" },
          { cmd: "{size=+8}grande{/size}", desc: "Aumenta (ou diminui) o tamanho relativo da fonte.", output: "grande" },
          { cmd: "{w=1.5}", desc: "Pausa 1,5s antes de continuar a mesma fala.", output: "(pausa de 1.5s)" },
          { cmd: "{w}", desc: "Pausa esperando clique do jogador.", output: "(espera clique)" },
          { cmd: "{p=0.5}", desc: "Quebra de parágrafo com pausa.", output: "(\\n + 0.5s)" },
          { cmd: "{cps=20}lento{/cps}", desc: "Define caracteres por segundo (slow text).", output: "20 char/s" },
          { cmd: "{nw}", desc: "Avança automaticamente sem esperar clique.", output: "(no-wait)" },
        ]}
      />

      <h2>7. Como o Ren'Py executa o seu .rpy</h2>
      <p>
        Quando você clica em "Launch Project" no Launcher, esta é a
        sequência exata de passos:
      </p>

      <OutputBlock label="ciclo de execução de uma sessão Ren'Py" type="info">
{`1. Engine carrega TODOS os arquivos .rpy de game/ (ordem alfabética).
2. Roda os blocos 'init python:' e 'init -1 python:' (ordem por prioridade).
3. Resolve 'define', 'image', 'transform' e cria o catálogo do jogo.
4. Mostra a tela de menu principal (definida em screens.rpy).
5. Quando jogador clica "Start", a engine procura 'label start:'.
6. Executa cada statement do bloco até encontrar 'jump', 'call' ou 'return'.
7. 'return' no label start volta para o menu principal.`}
      </OutputBlock>

      <h2>8. Validando seu script: lint</h2>
      <p>
        Antes de rodar uma cena nova, sempre passe o linter. Ele acha
        labels duplicados, imagens não definidas, indentação errada e
        muitas outras armadilhas.
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "valida toda a sintaxe e referências do projeto",
            cmd: "renpy.exe . lint",
            out: `Ren'Py 8.2.3 lint report, generated at: 2026-04-04 14:32:11

Statistics:
  The game contains 412 dialogue blocks, containing 6,421 words.
  The game contains 14 menus, 38 images, and 4 screens.

Lint took 0.42 seconds.
Linting complete. No problems were found.`,
            outType: "success",
          },
          {
            comment: "exemplo de erro: imagem não definida",
            cmd: "renpy.exe . lint",
            out: `game/script.rpy:18 The image 'sakura confused' was not declared.
1 error reported.`,
            outType: "error",
          },
        ]}
      />

      <PracticeBox
        title="Seu primeiro script.rpy do zero"
        goal="Criar um arquivo de cena com 1 background, 1 personagem, 3 falas e usar pelo menos 2 statements diferentes além de diálogo."
        steps={[
          "Crie um projeto novo no Launcher chamado 'pratica-sintaxe' (1280x720).",
          "Abra game/script.rpy no editor (apague o conteúdo padrão).",
          "Defina um Character Sakura com cor #ffaacc.",
          "No label start, faça scene bg cafe (use qualquer placeholder), show sakura happy, 3 falas e return.",
          "Salve, volte ao Launcher e clique 'Launch Project'.",
        ]}
        verify="Se a cena rodar sem erro e você conseguir clicar pelas 3 falas até voltar ao menu principal, o exercício está completo."
      >
        <CodeBlock
          title="game/script.rpy (gabarito)"
          language="python"
          code={`define s = Character("Sakura", color="#ffaacc")

image bg cafe = "images/bg_cafe.png"
image sakura happy = "images/sakura_happy.png"

label start:
    scene bg cafe with fade
    show sakura happy at center with dissolve
    s "Bem-vindo(a) ao Sakura Café!"
    s "Hoje o especial é torta de morango com matcha."
    "Você sente o cheiro doce vindo da cozinha."
    pause
    return
`}
        />
      </PracticeBox>

      <AlertBox type="success" title="Próximo passo natural">
        Agora que você entende a estrutura linha-a-linha, vamos para{" "}
        <strong>Labels e Fluxo</strong>: como uma VN se ramifica em
        capítulos, sub-cenas, retornos e chamadas tipo função.
      </AlertBox>
    </PageContainer>
  );
}
