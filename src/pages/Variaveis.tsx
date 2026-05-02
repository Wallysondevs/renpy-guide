import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Variaveis() {
  return (
    <PageContainer
      title="Variáveis em Ren'Py — default, define e blocos Python"
      subtitle="Variáveis guardam estados da sua VN: pontos de afeição, flags de cenas vistas, nome do(a) protagonista, inventário. Aqui você aprende quando usar default, define, $ e init python — e por que confundir isso quebra o save."
      difficulty="iniciante"
      timeToRead="14 min"
      prompt="logica/variaveis"
    >
      <AlertBox type="info" title="Por que variáveis importam tanto numa VN">
        Sem variáveis, sua VN é uma estrada reta: começo, meio, fim. Com elas
        você ganha <strong>memória</strong> — Sakura lembra que você esqueceu o
        aniversário dela, Akira só revela o segredo se você visitou o parque
        antes, o final muda se sua afeição com Yuki passa de 50. Toda mecânica
        de rota, escolha e reatividade nasce de uma variável bem colocada.
      </AlertBox>

      <h2>1. As três formas de criar uma variável</h2>
      <p>
        Ren'Py separa o que é <em>estado mutável do jogador</em> (entra no
        save) do que é <em>constante do jogo</em> (não entra no save). Errar
        essa distinção é o motivo nº 1 de bugs do tipo &quot;carreguei o save
        antigo e a Sakura virou outra pessoa&quot;.
      </p>

      <CommandTable
        title="default vs define vs $ — quando usar cada um"
        variations={[
          {
            cmd: "default x = 0",
            desc: "Cria uma variável que entra no save. Use para TUDO que muda durante o jogo (pontos, flags, inventário).",
            output: "Inicializada quando o jogador clica em 'Novo Jogo'.",
          },
          {
            cmd: "define x = 0",
            desc: "Cria uma constante que NÃO entra no save. Use para configurações que nunca mudam (cores, nomes de personagens).",
            output: "Avaliada uma única vez no boot do jogo.",
          },
          {
            cmd: "$ x = x + 1",
            desc: "Executa uma única linha Python no meio do script .rpy. Atalho rápido para alterar variáveis.",
            output: "Equivalente a um bloco 'python:' de uma linha.",
          },
          {
            cmd: "init python:",
            desc: "Bloco Python executado no boot, antes do start. Use para definir classes, funções e estruturas complexas.",
            output: "Roda antes de qualquer label, bom para classes Item/Personagem.",
          },
          {
            cmd: "python:",
            desc: "Bloco Python executado no fluxo da história (dentro de um label). Use para lógica de várias linhas.",
            output: "Roda quando a execução chegar nele.",
          },
        ]}
      />

      <h2>2. default — o que entra no save</h2>
      <p>
        Toda variável que muda em runtime precisa nascer com{" "}
        <code>default</code>. Coloque essas linhas no topo do{" "}
        <code>script.rpy</code>, fora de qualquer label:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`# === Estado do jogador (entra no save) ===
default afeicao_sakura = 0
default afeicao_akira = 0
default afeicao_yuki = 0

default flag_visitou_cafe = False
default flag_pegou_chave = False
default cenas_vistas = set()

default nome_protagonista = "Hana"
default inventario = []
default dia_atual = 1

label start:
    "Bem-vinda ao Sakura Café, [nome_protagonista]."
    $ afeicao_sakura += 5
    "Sakura sorri pra você. (Afeição agora: [afeicao_sakura])"
    return`}
      />

      <AlertBox type="warning" title="Nunca atribua sem 'default' antes">
        Se você fizer <code>$ afeicao_sakura = 0</code> direto no{" "}
        <code>label start:</code> sem ter um <code>default</code> antes, o save
        do jogador pode carregar com a variável <em>indefinida</em> e seu jogo
        crasha com <code>NameError: afeicao_sakura</code>. Sempre declare com
        <code> default</code> no topo.
      </AlertBox>

      <h2>3. define — constantes que nunca mudam</h2>
      <p>
        Personagens, cores, fontes, listas de capítulos: tudo isso é{" "}
        <code>define</code>. Como não muda, o Ren'Py nem se preocupa em salvar.
      </p>

      <CodeBlock
        language="python"
        title="game/personagens.rpy"
        code={`# === Personagens (constantes) ===
define s = Character("Sakura", color="#ffaacc", what_prefix='"', what_suffix='"')
define a = Character("Akira",  color="#7fb8ff")
define y = Character("Yuki",   color="#c8a6ff")
define narr = Character(None,  what_italic=True, what_color="#cccccc")

# === Configurações do jogo ===
define config.name = "Sakura Café"
define config.version = "1.0.0"
define gui.accent_color = "#ff6f9d"

# === Listas estáticas ===
define LISTA_DOCES = ["bolo de morango", "macaron", "matcha latte", "dorayaki"]
define HORA_ABERTURA = 7
define HORA_FECHAMENTO = 22`}
      />

      <h2>4. $ — Python inline no meio do script</h2>
      <p>
        Para alterar uma variável no fluxo da história, use{" "}
        <code>$</code> seguido de uma linha Python. É o jeito mais comum de
        somar afeição, ligar flags e fazer cálculos rápidos:
      </p>

      <CodeBlock
        language="python"
        title="game/cena_cafe.rpy"
        code={`label cena_cafe:
    scene bg cafe with dissolve
    show sakura happy at right
    s "Você veio! Trouxe seu doce favorito."

    $ afeicao_sakura += 10
    $ flag_visitou_cafe = True
    $ cenas_vistas.add("cafe_manha")
    $ inventario.append("biscoito de matcha")

    s "Tem [len(inventario)] coisinha(s) na sua bolsa agora."
    s "E você visitou o café [cenas_vistas|length] vez(es)."

    if afeicao_sakura >= 30:
        s "Sabe... eu fico feliz quando você passa aqui."

    return`}
      />

      <AlertBox type="info" title="Interpolando variáveis no diálogo">
        Use <code>[variavel]</code> dentro de strings de diálogo para
        interpolar valores. Funciona com qualquer expressão:
        <code> [afeicao_sakura]</code>, <code>[len(inventario)]</code>,
        <code> [nome_protagonista.upper()]</code>. Para mostrar um colchete
        literal, escape com <code>[[</code>.
      </AlertBox>

      <h2>5. python: e init python: — blocos completos</h2>
      <p>
        Quando você precisa de várias linhas Python (classe, função, lógica
        complexa), abra um bloco. <code>init python:</code> roda no boot,{" "}
        <code>python:</code> roda no fluxo da história.
      </p>

      <CodeBlock
        language="python"
        title="game/sistemas.rpy"
        code={`# Roda UMA vez no boot, antes do start.
init python:
    class Doce:
        def __init__(self, nome, preco, sabor):
            self.nome = nome
            self.preco = preco
            self.sabor = sabor

        def __repr__(self):
            return f"{self.nome} ({self.sabor}) — R$ {self.preco:.2f}"

    def calcular_gorjeta(total, percentual=0.1):
        return round(total * percentual, 2)

    CARDAPIO = [
        Doce("Bolo de Morango", 12.00, "doce"),
        Doce("Matcha Latte",     9.50, "amargo"),
        Doce("Dorayaki",         7.00, "doce"),
    ]

label cena_pedido:
    # Bloco python no meio do label
    python:
        pedido = [CARDAPIO[0], CARDAPIO[2]]
        total = sum(d.preco for d in pedido)
        gorjeta = calcular_gorjeta(total)

    s "Seu pedido somou R$ [total:.2f], com gorjeta de R$ [gorjeta:.2f]."
    return`}
      />

      <h2>6. Tipos comuns e como usá-los</h2>

      <CommandTable
        title="Tipos Python que você usará todo dia"
        variations={[
          {
            cmd: "int",
            desc: "Inteiros — pontos de afeição, dia atual, contador.",
            output: "default afeicao = 0  →  $ afeicao += 5",
          },
          {
            cmd: "float",
            desc: "Decimais — preços, multiplicadores.",
            output: "default preco = 9.50",
          },
          {
            cmd: "bool",
            desc: "Verdadeiro/falso — flags de cenas vistas, itens encontrados.",
            output: "default flag_pegou_chave = False",
          },
          {
            cmd: "str",
            desc: "Texto — nome do protagonista, mensagens.",
            output: 'default nome = "Hana"',
          },
          {
            cmd: "list",
            desc: "Lista ordenada — inventário, histórico de escolhas.",
            output: "default inventario = []  →  $ inventario.append('chave')",
          },
          {
            cmd: "set",
            desc: "Conjunto sem repetição — cenas já vistas, achievements.",
            output: "default cenas = set()  →  $ cenas.add('cafe_manha')",
          },
          {
            cmd: "dict",
            desc: "Dicionário chave→valor — afeição por personagem em uma estrutura só.",
            output: 'default afeicao = {"sakura": 0, "akira": 0}',
          },
        ]}
      />

      <h2>7. persistent — dados entre saves diferentes</h2>
      <p>
        Algumas coisas precisam sobreviver mesmo quando o jogador começa um
        Novo Jogo: galerias desbloqueadas, finais alcançados, achievements.
        Para isso existe <code>persistent</code>:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`default persistent.unlocked_gallery = set()
default persistent.finais_vistos = set()
default persistent.partidas_terminadas = 0

label final_sakura:
    scene bg final_sakura with fade
    s "Eu te amo. Sempre te amei."
    $ persistent.finais_vistos.add("sakura")
    $ persistent.partidas_terminadas += 1
    $ persistent.unlocked_gallery.add("cg_beijo_sakura")
    "FIM — Rota Sakura"
    return`}
      />

      <h2>8. Inspecionar e debugar variáveis</h2>
      <p>
        Para investigar o estado atual durante o desenvolvimento, ative o modo
        developer no <code>options.rpy</code> e use o console (Shift+O):
      </p>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`define config.developer = True`}
      />

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Rodar a VN no modo desenvolvimento",
            cmd: "renpy.exe . run",
            out: "Ren'Py 8.2.3 — Sakura Café iniciando em modo developer",
            outType: "success",
          },
          {
            comment: "Dentro do jogo: pressione Shift+O para abrir o console",
            cmd: "# Console interativo",
            outType: "muted",
            noPrompt: true,
          },
          {
            cmd: "afeicao_sakura",
            out: "25",
            outType: "info",
          },
          {
            cmd: "inventario",
            out: "['biscoito de matcha', 'chave do depósito']",
            outType: "info",
          },
          {
            cmd: "afeicao_sakura = 50",
            out: "(força a variável para 50 — útil para testar finais)",
            outType: "warning",
          },
        ]}
      />

      <OutputBlock label="saída de: renpy.exe . lint (validação estática)" type="info">
{`Ren'Py 8.2.3 lint report
========================
game/script.rpy:14 The variable 'afeicao_sakra' is assigned but never read. Did you mean 'afeicao_sakura'?
game/cena_cafe.rpy:7 Use of variable 'flag_visitao_cafe' that has not been defined with 'default'.

Statistics:
  3 .rpy files, 482 statements, 24 dialogue lines.
  2 warnings, 0 errors.`}
      </OutputBlock>

      <AlertBox type="warning" title="default vs define — o erro mais comum">
        Se você usar <code>define afeicao = 0</code> e depois fizer{" "}
        <code>$ afeicao += 1</code>, vai funcionar... até o jogador salvar e
        carregar. No load, a variável volta para 0 porque{" "}
        <code>define</code> não entra no save. Resultado: a afeição reseta
        misteriosamente. <strong>Regra:</strong> se a variável muda durante o
        jogo, é <code>default</code>.
      </AlertBox>

      <PracticeBox
        title="Sistema de afeição com 3 personagens"
        goal="Criar variáveis de afeição para Sakura, Akira e Yuki, somar pontos em uma cena e mostrar os valores ao jogador."
        steps={[
          "No topo do script.rpy, declare três variáveis com default afeicao_X = 0.",
          "Crie um label chamado primeira_cena que mostre uma fala de cada personagem.",
          "Após cada fala, use $ afeicao_X += 5 para somar pontos.",
          "No final da cena, exiba uma fala do narrador interpolando os três valores: 'Afeição: Sakura [afeicao_sakura], Akira [afeicao_akira], Yuki [afeicao_yuki]'.",
          "Rode renpy.exe . lint para garantir que nada ficou sem default.",
        ]}
        verify="Salve o jogo no meio da cena, recarregue e veja se os valores persistem corretamente."
      />
    </PageContainer>
  );
}
