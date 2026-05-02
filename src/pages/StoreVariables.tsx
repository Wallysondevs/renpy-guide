import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function StoreVariables() {
  return (
    <PageContainer
      title="Store Variables — default, define, persistent"
      subtitle="A diferença entre default, define e init python: cada uma cria variáveis com timing e comportamento de save/rollback diferentes. Errar isso é o bug #1 das VNs: variável que some no rollback, save corrompido, valor que muda do nada."
      difficulty="avancado"
      timeToRead="16 min"
      prompt="python/store"
    >
      <AlertBox type="info" title="O que é o 'store'?">
        O <strong>store</strong> é o namespace global do jogo: tudo que você
        atribui ao escrever <code>$ x = 5</code> vai parar em{" "}
        <code>store.x</code>. As variáveis do store são as que entram no
        save game, no rollback e no histórico. <strong>Saber QUANDO uma
        variável vai pro store muda completamente o comportamento dela.</strong>
      </AlertBox>

      <h2>1. As 3 formas — comparação direta</h2>

      <CommandTable
        title="default vs define vs init python"
        variations={[
          {
            cmd: "default x = 5",
            desc: "Cria x no store ANTES do start. Vai para o save. Rollback funciona.",
            output: "Use para: variáveis MUTÁVEIS do gameplay (afeição, dinheiro, flags).",
          },
          {
            cmd: "define x = 5",
            desc: "Cria constante. NÃO vai pro save. NÃO sofre rollback. Imutável.",
            output: "Use para: Characters, configs, valores que nunca mudam.",
          },
          {
            cmd: "init python: x = 5",
            desc: "Cria variável Python solta no store. NÃO sofre rollback. VAI no save.",
            output: "Use para: classes, funções, objetos complexos do jogo.",
          },
        ]}
      />

      <h2>2. <code>default</code> — para variáveis do gameplay</h2>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`# CORRETO: variáveis que mudam durante o jogo
default afeicao_sakura = 0
default afeicao_yuki = 0
default afeicao_akira = 0
default cafes_pedidos = 0
default dinheiro = 50
default hora_atual = 8

# Booleanas de progresso
default conheceu_sakura = False
default route_lock_sakura = False
default ending_visto = set()`}
      />

      <p>
        Por baixo dos panos, <code>default x = 5</code> só executa{" "}
        <code>store.x = 5</code> se <code>x</code> ainda não existe. Isso
        quer dizer: ao carregar um save antigo, o valor salvo SUBSTITUI o
        default. Bom para adicionar variáveis novas em updates sem quebrar
        saves.
      </p>

      <AlertBox type="warning" title="default RESPEITA o save">
        Você lança a v1.0 com <code>default afeicao_sakura = 0</code>. Na
        v1.1 muda para <code>default afeicao_sakura = 100</code>. Quem
        carregar save antigo NÃO recebe 100 — fica com o valor que tinha.
        Quem começar jogo novo tem 100. Para ALTERAR variável existente em
        save antigo, use <code>config.after_load_callbacks</code>.
      </AlertBox>

      <h2>3. <code>define</code> — para constantes que nunca mudam</h2>

      <CodeBlock
        title="game/options.rpy"
        language="python"
        code={`# Characters — sempre define, nunca default
define s = Character("Sakura", color="#ffaacc")
define y = Character("Yuki", color="#aaccff")
define a = Character("Akira", color="#ffcc99")
define h = Character("Hana", color="#99ccff")

# Configurações do jogo
define config.name = "Sakura Café"
define config.version = "1.2.0"
define gui.accent_color = "#ff5599"

# Constantes de gameplay
define MAX_AFEICAO = 100
define PRECO_CAFE = 8
define BONUS_VIP = 1.5`}
      />

      <AlertBox type="danger" title="NUNCA mude um define em runtime">
        Como <code>define</code> não vai pro save nem suporta rollback, se
        você tentar <code>$ MAX_AFEICAO = 200</code>, a mudança aplica na
        sessão atual MAS não persiste, e ainda dispara warning no lint. Se
        a constante precisa mudar, era pra ser <code>default</code>.
      </AlertBox>

      <h2>4. <code>init python:</code> — para classes, funções e objetos</h2>

      <CodeBlock
        title="game/init.rpy"
        language="python"
        code={`init python:

    class Pedido:
        def __init__(self, bebida, preco):
            self.bebida = bebida
            self.preco = preco
            self.entregue = False

        def entregar(self):
            self.entregue = True
            store.dinheiro += self.preco

    class Cliente:
        def __init__(self, nome, foto):
            self.nome = nome
            self.foto = foto
            self.pedidos = []

    # Funções utilitárias
    def calcular_gorjeta(pedido, satisfacao):
        return pedido.preco * (satisfacao / 100.0) * 0.2

    def desbloquear_ending(nome):
        store.ending_visto.add(nome)
        renpy.notify("Final '" + nome + "' desbloqueado!")

# Pode até criar instâncias aqui — vão pro save
default cliente_atual = None
default fila_pedidos = []`}
      />

      <h2>5. <code>persistent</code> — entre saves diferentes</h2>
      <p>
        <code>persistent.X</code> é guardado fora do save, em arquivo
        global. Sobrevive entre partidas, novos jogos, até desinstalações
        no Windows. Use para: galeria de CGs desbloqueados, finais vistos,
        idioma escolhido, achievements.
      </p>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`# Inicialização — só roda uma vez por instalação
default persistent.cgs_unlocked = set()
default persistent.endings_vistos = set()
default persistent.lingua = "pt"
default persistent.tutorial_visto = False

label start:
    if not persistent.tutorial_visto:
        call tutorial
        $ persistent.tutorial_visto = True

label cena_kiss:
    scene cg sakura_kiss with fade
    "..."
    $ persistent.cgs_unlocked.add("sakura_kiss")

label final_sakura:
    "..."
    $ persistent.endings_vistos.add("sakura_true")
    $ desbloquear_ending("sakura_true")
    return`}
      />

      <AlertBox type="warning" title="default persistent vs persistent =">
        <code>default persistent.x = []</code> só atribui se ainda não
        existe (preserva o que já tinha entre versões).{" "}
        <code>$ persistent.x = []</code> SOBRESCREVE — perdendo CGs já
        desbloqueados. Sempre prefira <strong>default</strong> na
        inicialização.
      </AlertBox>

      <h2>6. Variáveis especiais do store</h2>

      <CommandTable
        title="Vars que o Ren'Py mantém para você"
        variations={[
          {
            cmd: "_in_replay",
            desc: "True se a cena atual está sendo rejogada (Replay Action).",
            output: "if _in_replay: skip()",
          },
          {
            cmd: "_skipping",
            desc: "True quando o jogador está com Ctrl pressionado (skip).",
            output: "if _skipping: pula a animação longa",
          },
          {
            cmd: "_rollback",
            desc: "True se a engine pode fazer rollback agora.",
            output: "if _rollback: ...",
          },
          {
            cmd: "_game_menu_screen",
            desc: "Nome do screen do game_menu atualmente aberto.",
            output: "save / load / preferences / None",
          },
          {
            cmd: "_window",
            desc: "True se a window do diálogo está sendo mostrada.",
            output: "window show / window hide alteram",
          },
          {
            cmd: "_history_list",
            desc: "Lista das falas anteriores (para screen history).",
            output: "Lista de HistoryEntry.",
          },
        ]}
      />

      <h2>7. Onde declarar — qual arquivo?</h2>

      <OutputBlock label="convenção de organização" type="info">
{`game/options.rpy        →  define config.*, define gui.*, characters
game/script.rpy         →  default das variáveis principais (no topo)
game/init.rpy           →  init python: classes, funções, helpers
game/persistent.rpy     →  default persistent.* (galeria, achievements)
game/screens.rpy        →  default das vars usadas SÓ por screens (ex: page_name_value)`}
      </OutputBlock>

      <h2>8. Erros típicos — pegadinhas que custam horas</h2>

      <h3>Erro 1 — usar variável antes do default</h3>

      <CodeBlock
        title="game/script.rpy — ERRADO"
        language="python"
        code={`label start:
    if afeicao_sakura > 5:   # ❌ NameError: 'afeicao_sakura' is not defined
        s "Que bom te ver de novo!"

# Esquece o default no topo do arquivo
# default afeicao_sakura = 0`}
      />

      <CodeBlock
        title="game/script.rpy — CORRETO"
        language="python"
        code={`# Topo do arquivo — sempre default ANTES do start
default afeicao_sakura = 0

label start:
    if afeicao_sakura > 5:
        s "Que bom te ver de novo!"`}
      />

      <h3>Erro 2 — variável "perdida" no rollback</h3>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`# ❌ Variável criada DENTRO de init python: não sofre rollback
init python:
    contador_clicks = 0  # se mudar, rollback NÃO desfaz

# ✅ Use default
default contador_clicks = 0  # rollback funciona`}
      />

      <h3>Erro 3 — confundir <code>persistent</code> com save normal</h3>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`# Quer guardar a afeição entre saves diferentes? RUIM.
default persistent.afeicao_sakura = 0  # ❌ vai vazar entre runs

# Afeição é POR partida → save normal
default afeicao_sakura = 0  # ✅

# Galeria, achievements, idioma → persistent
default persistent.cgs_unlocked = set()  # ✅`}
      />

      <h2>9. Inspeção em runtime</h2>

      <Terminal
        path="~/projetos/sakura-cafe"
        user="dev"
        host="vn-studio"
        lines={[
          {
            comment: "console (Shift+O) — inspecionar variáveis do store",
            cmd: "afeicao_sakura",
            out: "42",
            outType: "info",
          },
          {
            cmd: "persistent.cgs_unlocked",
            out: "{'sakura_kiss', 'yuki_dance'}",
            outType: "info",
          },
          {
            cmd: "type(s)",
            out: "<class 'store.ADVCharacter'>",
            outType: "info",
          },
          {
            comment: "Variable Viewer (Shift+V) lista todas",
            cmd: "renpy.dump_filename = 'vars.txt'",
            out: "ok",
            outType: "success",
          },
        ]}
      />

      <PracticeBox
        title="Sistema de afeição com 4 personagens + galeria persistente"
        goal="Configurar corretamente as variáveis do gameplay (afeição) com default e a galeria de CGs com persistent."
        steps={[
          "Em script.rpy declare default para afeição de sakura, yuki, akira, hana (todas em 0).",
          "Em options.rpy declare define para cada Character.",
          "Em persistent.rpy declare default persistent.cgs_unlocked = set().",
          "Em script.rpy faça uma cena que incrementa afeicao_sakura += 5 e adiciona 'sakura_intro' aos CGs.",
          "Carregue um save anterior à cena: a afeição volta ao valor salvo, mas o CG continua na galeria.",
        ]}
        verify="Após salvar e carregar, a afeição respeita o save (volta), enquanto persistent.cgs_unlocked se mantém entre saves diferentes."
      >
        <CodeBlock
          title="estrutura final"
          language="python"
          code={`# game/options.rpy
define s = Character("Sakura", color="#ffaacc")
define y = Character("Yuki", color="#aaccff")
define a = Character("Akira", color="#ffcc99")
define h = Character("Hana", color="#99ccff")

# game/script.rpy
default afeicao_sakura = 0
default afeicao_yuki = 0
default afeicao_akira = 0
default afeicao_hana = 0

# game/persistent.rpy
default persistent.cgs_unlocked = set()
default persistent.endings_vistos = set()

# Cena exemplo
label cena_intro_sakura:
    scene cg sakura_intro with fade
    s "Que bom te conhecer!"
    $ afeicao_sakura += 5
    $ persistent.cgs_unlocked.add("sakura_intro")
    return`}
        />
      </PracticeBox>

      <OutputBlock label="cheat sheet — qual usar" type="info">
{`MUTÁVEL no gameplay, vai pro save     →  default
CONSTANTE imutável (Character, conf)  →  define
CLASSE / FUNÇÃO / OBJETO complexo     →  init python:
ENTRE SAVES (galeria, achievements)   →  default persistent.X
INSPECIONAR EM RUNTIME                →  Shift+O (console) ou Shift+V (viewer)`}
      </OutputBlock>

      <AlertBox type="success" title="Próximo passo">
        Com store dominado, o próximo desafio é entender o ciclo de vida do
        jogo: <strong>Lifecycle</strong> mostra quando cada{" "}
        <code>default</code>, <code>init python:</code> e callback é
        executado, e onde colocar cada coisa.
      </AlertBox>
    </PageContainer>
  );
}
