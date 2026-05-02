import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Inventario() {
  return (
    <PageContainer
      title="Sistema de Inventário"
      subtitle="Construa um inventário funcional para sua VN — itens com nome, ícone, descrição e quantidade. Da classe Item em init python até a screen visual com botões clicáveis."
      difficulty="avancado"
      timeToRead="22 min"
      prompt="avancado/inventario"
    >
      <AlertBox type="info" title="Por que um inventário em uma Visual Novel?">
        Em <em>Sakura Café</em> a heroína coleciona <strong>cartões de cliente</strong>,{" "}
        <strong>itens de café</strong> (grãos raros, leite vegetal, xaropes) e{" "}
        <strong>presentes de personagens</strong>. Ter um inventário visível
        amplia a sensação de progresso e permite escolhas como "presentear
        Sakura com a flor que você ganhou no festival". Ren'Py não traz
        inventário pronto — você monta o seu com Python + Screen Language.
      </AlertBox>

      <h2>1. Modelando o item — class Item</h2>
      <p>
        Tudo começa com uma classe Python definida dentro de um bloco{" "}
        <code>init python:</code>. Essa classe vive durante todo o jogo e é
        salva automaticamente nos saves (Ren'Py serializa via <code>pickle</code>).
        Por isso, evite atributos que não podem ser pickled (ex: arquivos
        abertos, sockets).
      </p>

      <CodeBlock
        language="python"
        title="game/inventario.rpy"
        code={`# A definição da classe acontece em init python: para que esteja disponível
# antes do label start. O priority=-1 garante que rode antes de qualquer
# default que use Item.
init -1 python:

    class Item(object):
        """Representa um item carregável pela protagonista."""

        def __init__(self, id, name, icon, desc, stackable=True, value=0):
            self.id = id              # identificador único: "flor_cerejeira"
            self.name = name          # nome exibido: "Flor de Cerejeira"
            self.icon = icon          # caminho do sprite: "images/itens/flor.png"
            self.desc = desc          # descrição longa
            self.stackable = stackable  # se True, soma quantidades
            self.value = value        # preço em ienas (para vender no café)

        def __eq__(self, other):
            return isinstance(other, Item) and self.id == other.id

        def __hash__(self):
            return hash(self.id)

# Catálogo central — defina TODOS os itens aqui para reaproveitar
define ITENS = {
    "flor_cerejeira": Item(
        "flor_cerejeira",
        "Flor de Cerejeira",
        "images/itens/flor_cerejeira.png",
        "Uma pétala perfumada do hanami. Sakura adora.",
        stackable=True,
        value=120,
    ),
    "graos_etiopes": Item(
        "graos_etiopes",
        "Grãos Etíopes",
        "images/itens/graos.png",
        "Grãos raros torrados na hora. Aroma cítrico.",
        value=900,
    ),
    "carta_yuki": Item(
        "carta_yuki",
        "Carta de Yuki",
        "images/itens/carta.png",
        "Yuki te deixou no balcão. Você ainda não abriu.",
        stackable=False,
        value=0,
    ),
    "chave_armario": Item(
        "chave_armario",
        "Chave do Armário",
        "images/itens/chave.png",
        "Abre o armário dos fundos. A Akira pediu pra guardar.",
        stackable=False,
        value=0,
    ),
}`}
      />

      <h2>2. A estrutura do inventário em si</h2>
      <p>
        O inventário é um <code>dict</code> que mapeia <code>id</code> para
        quantidade. Use <code>default</code> (e nunca <code>define</code>) para
        que o estado seja salvo no save game e re-criado a cada nova partida:
      </p>

      <CodeBlock
        language="python"
        title="game/inventario.rpy (continuação)"
        code={`# default = persistido no save, reinicializado em "Novo Jogo".
# define = constante de tempo de compilação, NÃO entra no save.
default inventario = {}     # { "flor_cerejeira": 3, "graos_etiopes": 1 }
default inventario_aberto = False
default item_selecionado = None  # para a tela de detalhes

init python:

    def adicionar_item(item_id, qtd=1):
        """Adiciona qtd ao inventário, respeitando stackable."""
        if item_id not in ITENS:
            raise Exception("Item desconhecido: " + item_id)
        item = ITENS[item_id]
        if not item.stackable and item_id in inventario:
            return False  # já tem, não duplica
        inventario[item_id] = inventario.get(item_id, 0) + qtd
        renpy.notify("Você obteve: " + item.name)
        return True

    def remover_item(item_id, qtd=1):
        if item_id not in inventario:
            return False
        inventario[item_id] -= qtd
        if inventario[item_id] <= 0:
            del inventario[item_id]
        return True

    def tem_item(item_id, qtd=1):
        return inventario.get(item_id, 0) >= qtd`}
      />

      <CommandTable
        title="API do mini-sistema de inventário"
        variations={[
          {
            cmd: "adicionar_item(id, qtd=1)",
            desc: "Adiciona um item ao bag. Notifica via renpy.notify.",
            output: "True se adicionou, False se item único duplicado.",
          },
          {
            cmd: "remover_item(id, qtd=1)",
            desc: "Remove qtd unidades. Apaga a chave se zerar.",
            output: "True se removeu, False se não tinha.",
          },
          {
            cmd: "tem_item(id, qtd=1)",
            desc: "Checa se a protagonista tem o item.",
            output: "Retorna bool — use em condicionais e menus.",
          },
          {
            cmd: "ITENS[id]",
            desc: "Acessa o catálogo global e devolve o objeto Item.",
            output: "Útil para ler .name, .icon, .desc, .value.",
          },
          {
            cmd: "inventario.get(id, 0)",
            desc: "Lê a quantidade atual sem dar KeyError.",
            output: "Retorna int (0 se não tiver).",
          },
        ]}
      />

      <h2>3. Usando no script — entregando e checando itens</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label cap1_festival:
    scene bg festival with fade
    show sakura happy at right with dissolve
    s "Olha o que peguei pra você no hanami!"
    $ adicionar_item("flor_cerejeira", 2)

    s "Guarda direitinho, viu?"

    menu:
        "Aceitar a flor":
            $ afeicao["sakura"] += 5
            s "Que bom que gostou..."
        "Devolver":
            $ remover_item("flor_cerejeira", 2)
            s "Tudo bem... eu fico então."

    # Mais tarde no jogo:
    if tem_item("carta_yuki"):
        y "Vi que você ficou com a carta. Já leu?"
    else:
        y "Eu deixei algo no balcão pra você. Procura lá."

    return`}
      />

      <h2>4. A screen do inventário</h2>
      <p>
        Agora a parte visual. Vamos criar uma <strong>screen</strong> com{" "}
        <code>vbox</code>/<code>hbox</code>, ícones clicáveis, contagem no
        canto e painel lateral de descrição. A screen pode ser chamada com{" "}
        <code>call screen inventario</code> ou colocada como
        <code> overlay </code> sempre visível.
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy"
        code={`screen inventario():
    modal True            # bloqueia cliques no diálogo de fundo
    tag menu              # fecha qualquer outro menu antes de abrir

    # Container principal
    frame:
        background "#1a0a1fe6"
        xfill True
        yfill True
        padding (40, 40)

        vbox:
            spacing 16

            text "Inventário" size 36 color "#ffaacc" font "fonts/sakura.ttf"
            text "Itens carregados pela heroína" size 14 color "#aa88aa"

            null height 12

            # Grade de itens 5 colunas
            grid 5 4:
                spacing 12
                xfill True

                for item_id, qtd in inventario.items():
                    $ item = ITENS[item_id]

                    button:
                        action SetVariable("item_selecionado", item_id)
                        background "#2a1430"
                        hover_background "#4a2050"
                        padding (8, 8)

                        vbox:
                            spacing 4
                            xalign 0.5

                            add item.icon size (64, 64)
                            text item.name size 11 xalign 0.5 color "#ffffff"
                            if item.stackable:
                                text "x[qtd]" size 10 xalign 0.5 color "#ffaa00"

                # Preenche slots vazios com placeholders
                for _ in range(20 - len(inventario)):
                    frame:
                        background "#1a0a1f"
                        xysize (88, 88)

            null height 8

            # Painel de detalhes
            if item_selecionado and item_selecionado in inventario:
                $ sel = ITENS[item_selecionado]
                frame:
                    background "#0e0014"
                    padding (20, 16)
                    xfill True

                    hbox:
                        spacing 16
                        add sel.icon size (96, 96)
                        vbox:
                            spacing 4
                            text sel.name size 22 color "#ffaacc"
                            text sel.desc size 14 color "#dddddd"
                            text "Valor: [sel.value] ienas" size 12 color "#88ff88"

            null height 12

            textbutton "Fechar (esc)" action Return() xalign 1.0

    # Hotkey ESC fecha
    key "game_menu" action Return()`}
      />

      <h2>5. Abrindo a screen e ligando ao botão da textbox</h2>
      <p>
        Você pode abrir o inventário com <code>call screen inventario</code>{" "}
        no script ou colocar um botão fixo no quick menu para o jogador abrir
        a hora que quiser:
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy — quick_menu modificado"
        code={`screen quick_menu():
    zorder 100

    if quick_menu:
        hbox:
            style_prefix "quick"
            xalign 0.5
            yalign 1.0

            textbutton _("Voltar") action Rollback()
            textbutton _("Histórico") action ShowMenu('history')
            textbutton _("Pular") action Skip() alternate Skip(fast=True, confirm=True)
            textbutton _("Auto") action Preference("auto-forward", "toggle")
            textbutton _("Salvar") action ShowMenu('save')
            textbutton _("S Salvar") action QuickSave()
            textbutton _("Carregar") action QuickLoad()
            textbutton _("Pref.") action ShowMenu('preferences')

            # NOSSO BOTÃO
            textbutton _("Bag ([len(inventario)])") action ShowMenu('inventario')`}
      />

      <PracticeBox
        title="Adicione 3 itens no Cap. 1 e mostre o inventário"
        goal="Garantir que adicionar/remover/checar itens e a screen visual funcionem em sequência."
        steps={[
          "Cole inventario.rpy em game/ e crie 4 ícones 64x64 em images/itens/.",
          "No label start adicione: $ adicionar_item('graos_etiopes') e $ adicionar_item('carta_yuki').",
          "Logo depois escreva: e 'Olha minha bag!' e na linha seguinte: call screen inventario.",
          "Rode com renpy.exe . — a Bag deve abrir cheia.",
          "Adicione um menu com escolha 'Beber café' que faz $ remover_item('graos_etiopes') e re-abre a screen.",
        ]}
        verify="A screen abre com 2 itens, ao remover os grãos sobra só a carta."
      />

      <h2>6. Lint e testes finais</h2>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "valida sintaxe e referências de imagens (incluindo dos itens)",
            cmd: "renpy.exe . lint",
            out: `Ren'Py 8.3.3 lint report, generated at: Mon Apr  6 21:42:11 2026

Statistics:
  The game contains 412 dialogue blocks, containing 6,180 words and 38,210 characters.
  The game contains 1 menus, 4 images, and 0 screens.

Lint is not a substitute for thorough testing. Remember to test thoroughly.

Lint took 0.62 seconds.`,
            outType: "success",
          },
          {
            comment: "se um ícone .png estiver faltando, lint avisa:",
            cmd: "renpy.exe . lint",
            out: `game/screens.rpy:121 The image "images/itens/flor_cerejeira.png" was not found.`,
            outType: "warning",
          },
        ]}
      />

      <OutputBlock label="Notificação visual ao adicionar item" type="info">
{`╔════════════════════════════════════╗
║  ✿ Você obteve: Flor de Cerejeira  ║
╚════════════════════════════════════╝
   (notificação aparece 3s no canto superior, animada via renpy.notify)`}
      </OutputBlock>

      <AlertBox type="warning" title="Cuidado com pickle e mudanças na class Item">
        Ao distribuir uma atualização do jogo, se você mudar os atributos de{" "}
        <code>Item</code> (ex: adicionar <code>raridade</code>), os saves
        antigos podem dar erro ao desserializar. Use{" "}
        <code>__setstate__</code> com fallback ou rode uma migração no{" "}
        <code>after_load</code> label para preencher campos novos com valores
        padrão.
      </AlertBox>

      <AlertBox type="success" title="Próximo passo">
        Junte o inventário com o sistema de afeição: presentes específicos
        aumentam pontos de uma personagem. Veja a próxima página{" "}
        <strong>Sistema de Afeição</strong> para o esquema completo.
      </AlertBox>
    </PageContainer>
  );
}
