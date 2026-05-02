import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function AutomatedTesting() {
  return (
    <PageContainer
      title="Testes automatizados (testcase / testsuite)"
      subtitle="A doc oficial menciona testcase em meia página. Aqui você vai ver como rodar a rota inteira da Sakura sem clicar uma única vez, capturar regressões antes do build e integrar com CI."
      difficulty="avancado"
      timeToRead="16 min"
      prompt="qa/automated-testing"
    >
      <AlertBox type="info" title="Por que automatizar testes em uma VN?">
        Visual novel parece um meio onde "tudo é roteiro linear, não tem o que
        testar". <strong>Errado.</strong> Quando o Sakura Café tem 8 rotas, 14
        finais, 200+ variáveis de afeição, 3 minigames e 6 idiomas, basta um{" "}
        <code>jump rota_yuki</code> mal escrito num <code>if</code> para um
        final inteiro virar tela branca. <code>testcase</code> + <code>testsuite</code>{" "}
        deixam o Ren'Py jogar sozinho enquanto você toma café.
      </AlertBox>

      <h2>1. O conceito: "robô que clica por você"</h2>
      <p>
        Um <code>testcase</code> é um bloco que diz ao Ren'Py "faça essa
        sequência de ações como se fosse um jogador", e um <code>testsuite</code>{" "}
        agrupa vários testcases. As ações disponíveis cobrem: clicar
        (<code>click</code>), apertar tecla (<code>type</code>), esperar
        (<code>pause</code>), pular avançando (<code>advance</code>), ir para
        um label específico (<code>run</code>), e <code>assert</code> para
        validar estado interno.
      </p>

      <CodeBlock
        language="python"
        title="game/tests/test_rota_sakura.rpy"
        code={`# Define um testcase chamado 'sakura_happy_end'
testcase sakura_happy_end:
    # Vai do menu principal até o label 'start' como se clicasse "Iniciar"
    run start

    # Avança 50 falas (clique-avançar)
    advance 50

    # Quando chegar no menu de escolha, escolhe a 1ª opção (Falar com Sakura)
    "Falar com a Sakura"

    advance 200

    # Escolhe "Confessar"
    "Confessar"

    advance 80

    # Asserts: a essa altura o jogador DEVE estar no final feliz
    assert _return is None
    assert persistent.endings_unlocked["sakura_happy"] == True
    assert afeicao_sakura >= 80`}
      />

      <h2>2. Anatomia de um arquivo de testes</h2>
      <p>
        Crie a pasta <code>game/tests/</code> e dentro dela um ou mais
        arquivos <code>.rpy</code>. O Ren'Py NÃO carrega esses arquivos no
        jogo normal — eles só são executados quando você roda{" "}
        <code>renpy.sh projeto test &lt;nome&gt;</code>. Isso evita que o
        testcase polua a build de distribuição.
      </p>

      <CodeBlock
        language="python"
        title="game/tests/_helpers.rpy"
        code={`# Helpers reaproveitáveis em vários testcases.

# Pula o splash e cinemática inicial (24 falas) e cai direto na escolha 1
testcase ir_para_primeira_escolha:
    run start
    advance 24

# Reseta variáveis de afeição (útil entre testes)
init python:
    def reset_afeicao():
        store.afeicao_sakura = 0
        store.afeicao_yuki = 0
        store.afeicao_akira = 0
        store.cafes_servidos = 0`}
      />

      <h2>3. Comandos disponíveis dentro de <code>testcase</code></h2>

      <CommandTable
        title="Vocabulário do testcase"
        variations={[
          { cmd: "run <label>", desc: "Inicia a execução a partir de um label.", output: "run start" },
          { cmd: "advance N", desc: "Clica avançar N vezes (cada clique é uma fala).", output: "advance 50" },
          { cmd: '"Texto da escolha"', desc: "Quando aparecer um menu, seleciona a opção pelo texto.", output: '"Falar com a Sakura"' },
          { cmd: "click <screen> <id>", desc: "Clica em um botão específico de um screen.", output: 'click main_menu "start_button"' },
          { cmd: "type \"texto\"", desc: "Digita texto em um input ativo.", output: 'type "Wallyson"' },
          { cmd: "pause N", desc: "Espera N segundos reais (útil para animações).", output: "pause 0.5" },
          { cmd: "until <expr>", desc: "Avança até uma expressão Python virar verdadeira.", output: "until afeicao_sakura >= 50" },
          { cmd: "assert <expr>", desc: "Falha o teste se a expressão for falsa.", output: "assert score == 100" },
          { cmd: "label <nome>", desc: "Marca um ponto no testcase para reuso.", output: "label depois_do_capitulo_1" },
          { cmd: "stop", desc: "Encerra o testcase com sucesso (não conta como falha).", output: "stop" },
        ]}
      />

      <h2>4. Rodando os testes pela linha de comando</h2>

      <Terminal
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Executa um testcase específico",
            cmd: "renpy.sh . test sakura_happy_end",
            out: `Ren'Py 8.3.0 Test Runner
Loading project: sakura-cafe
Running testcase: sakura_happy_end
[advance 50] OK
[choice "Falar com a Sakura"] OK
[advance 200] OK
[choice "Confessar"] OK
[advance 80] OK
[assert _return is None] OK
[assert persistent.endings_unlocked['sakura_happy']] OK
[assert afeicao_sakura >= 80] OK

Result: PASSED in 4.21s`,
            outType: "success",
          },
          {
            comment: "Roda TODOS os testcases definidos no projeto",
            cmd: "renpy.sh . test all",
            out: `[1/4] sakura_happy_end ......... PASSED  (4.21s)
[2/4] sakura_bad_end ........... PASSED  (3.88s)
[3/4] yuki_route_full .......... FAILED  (5.10s)
       AssertionError at game/tests/test_yuki.rpy:34
       assert afeicao_yuki >= 90
       Got: afeicao_yuki = 72
[4/4] minigame_pedido .......... PASSED  (2.04s)

3 passed, 1 failed in 15.23s`,
            outType: "warning",
          },
        ]}
      />

      <h2>5. Caso real: testar TODAS as 8 rotas em um loop</h2>
      <p>
        A doc oficial não mostra isso, mas você pode gerar testcases via
        Python iterando sobre uma lista de rotas. Útil quando o jogo cresce e
        você não quer copiar/colar testcase por personagem.
      </p>

      <CodeBlock
        language="python"
        title="game/tests/test_todas_rotas.rpy"
        code={`# Para cada personagem, valida que a rota fecha sem crash e desbloqueia ending

init python:
    rotas = [
        ("sakura", 80, "sakura_happy"),
        ("yuki",   85, "yuki_happy"),
        ("akira",  75, "akira_happy"),
        ("hana",   90, "hana_happy"),
        ("mei",    70, "mei_happy"),
        ("rin",    80, "rin_happy"),
    ]

# Não dá para gerar testcases com loop diretamente, mas dá para
# usar 'until' + persistent.flag setado pelo final.
testcase rota_sakura_completa:
    $ reset_afeicao()
    $ persistent.endings_unlocked = {}
    run start
    until persistent.endings_unlocked.get("sakura_happy", False)
    assert afeicao_sakura >= 80

testcase rota_yuki_completa:
    $ reset_afeicao()
    $ persistent.endings_unlocked = {}
    run start
    until persistent.endings_unlocked.get("yuki_happy", False)
    assert afeicao_yuki >= 85`}
      />

      <h2>6. Modo "fuzz" — quase um jogador aleatório</h2>
      <p>
        Para descobrir crashes em escolhas que você nem se lembra de existir,
        Ren'Py tem o modo de teste aleatório: ele clica/escolhe ao acaso por X
        minutos. Excelente para fuzzing antes do release.
      </p>

      <Terminal
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Roda 5 minutos clicando aleatoriamente",
            cmd: "renpy.sh . test random --duration 300",
            out: `Random tester started.
[T+0:23] Choice menu: 4 options. Picked option 2.
[T+1:47] Choice menu: 3 options. Picked option 1.
[T+2:55] Reached label: cap2_yuki
[T+4:12] Reached label: rota_yuki_amargo
[T+4:55] Game over screen reached. Restarting from start.

Random test ended. 0 crashes, 14 endings reached.`,
            outType: "info",
          },
        ]}
      />

      <h2>7. Integração com CI (GitHub Actions)</h2>

      <CodeBlock
        language="yaml"
        title=".github/workflows/test.yml"
        code={`name: Ren'Py Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Baixar Ren'Py SDK
        run: |
          wget -q https://www.renpy.org/dl/8.3.0/renpy-8.3.0-sdk.tar.bz2
          tar xjf renpy-8.3.0-sdk.tar.bz2

      - name: Lint
        run: ./renpy-8.3.0-sdk/renpy.sh sakura-cafe lint

      - name: Rodar testes
        run: ./renpy-8.3.0-sdk/renpy.sh sakura-cafe test all

      - name: Distribuir builds (só em tag)
        if: startsWith(github.ref, 'refs/tags/')
        run: ./renpy-8.3.0-sdk/renpy.sh sakura-cafe distribute`}
      />

      <h2>8. Boas práticas que economizam noite mal-dormida</h2>

      <OutputBlock label="checklist de testes Ren'Py" type="info">
{`✔ Sempre resetar persistent + variáveis no início do testcase.
✔ Usar 'until' em vez de 'advance N' grandes (mais robusto a mudanças).
✔ Asserts no FINAL, não no meio (falha cedo polui logs).
✔ Um arquivo por personagem/rota — facilita git blame.
✔ Rodar 'test all' no pre-commit hook (~30s para 10 rotas).
✔ Modo random 5min antes de cada release.
✔ Comparar saving/loading: salvar no meio do testcase, recarregar e seguir.`}
      </OutputBlock>

      <AlertBox type="warning" title="Limitação importante">
        Testcases <strong>não funcionam</strong> com minigames customizados
        que dependem de input frame-a-frame (ex.: ritmo musical). Para esses
        casos, exponha um modo "auto-win" controlado por flag de debug:{" "}
        <code>{`if config.developer or store._test_mode: minigame_score = 100`}</code>.
      </AlertBox>

      <PracticeBox
        title="Crie um teste que roda do menu até o final feliz da Sakura"
        goal="Ter um arquivo game/tests/test_sakura.rpy que passa em menos de 10s e quebra se alguma escolha for renomeada."
        steps={[
          "Crie a pasta game/tests/ no projeto sakura-cafe.",
          "Adicione test_sakura.rpy com um testcase chamado 'sakura_happy_end'.",
          "Use 'run start', vários 'advance', e 2-3 escolhas pelo texto.",
          "Adicione um helper init python: 'reset_afeicao()' que zera variáveis.",
          "Rode 'renpy.sh sakura-cafe test sakura_happy_end' e veja o resultado.",
        ]}
        verify="O terminal imprime 'Result: PASSED' e o tempo total fica abaixo de 10 segundos."
      >
        <CodeBlock
          language="python"
          title="game/tests/test_sakura.rpy (gabarito)"
          code={`init python:
    def reset_afeicao():
        store.afeicao_sakura = 0
        store.persistent.endings_unlocked = {}

testcase sakura_happy_end:
    $ reset_afeicao()
    run start
    advance 30
    "Falar com a Sakura"
    advance 80
    "Confessar"
    until persistent.endings_unlocked.get("sakura_happy", False)
    assert afeicao_sakura >= 80
    stop`}
        />
      </PracticeBox>

      <AlertBox type="success" title="Resumo">
        Em projeto pequeno, 1 testcase por rota já economiza horas de
        regressão manual. Em projeto grande (50+ horas de jogo), os testes
        passam a ser o ÚNICO caminho viável para mudar coisas sem medo.
      </AlertBox>
    </PageContainer>
  );
}
