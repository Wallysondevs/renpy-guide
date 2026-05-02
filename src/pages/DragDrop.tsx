import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function DragDrop() {
  return (
    <PageContainer
      title="Drag & Drop — Drag, DragGroup e snap points"
      subtitle="Construir um mini-puzzle de arrastar ingredientes para a xícara no Sakura Café. Drag displayable, DragGroup, snap automático, callbacks e validação do drop correto."
      difficulty="avancado"
      timeToRead="20 min"
      prompt="ui/drag-drop"
    >
      <AlertBox type="info" title="Drag & Drop em Ren'Py">
        O Ren'Py tem o displayable <code>Drag</code> que aceita mouse/touch
        para arrastar QUALQUER coisa pela tela. Quando você junta vários
        Drags em um <code>DragGroup</code>, eles passam a se conhecer:
        Ren'Py te diz qual Drag foi solto sobre qual outro Drag — perfeito
        para puzzles de "encaixar peças". Vamos construir o mini-jogo
        "monte sua xícara" do Sakura Café.
      </AlertBox>

      <h2>1. O Drag mais simples possível</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`screen mover_xicara():
    # Drag arrastável: child = imagem
    drag:
        drag_name "xicara"
        draggable True
        droppable False
        xpos 100 ypos 400
        "images/itens/xicara.png"`}
      />

      <p>
        Esse <code>drag:</code> cria uma <code>Drag()</code> que renderiza
        a imagem da xícara. O jogador clica e arrasta livremente.{" "}
        <code>droppable False</code> = nada pode ser solto ENCIMA dela.
      </p>

      <h2>2. Tabela completa de propriedades de <code>Drag</code></h2>

      <CommandTable
        title="Properties do Drag displayable"
        variations={[
          {
            cmd: "drag_name",
            desc: "Identificador único (string). Aparece em callbacks.",
            output: 'drag_name "ingrediente_acucar"',
          },
          {
            cmd: "draggable",
            desc: "Se o usuário pode pegar e arrastar.",
            output: "draggable True",
          },
          {
            cmd: "droppable",
            desc: "Se outros Drags podem ser soltos sobre ele.",
            output: "droppable True",
          },
          {
            cmd: "drag_raise",
            desc: "Se ao começar arrasto vai pro topo da z-order.",
            output: "drag_raise True (default)",
          },
          {
            cmd: "drag_handle (x,y,w,h)",
            desc: "Sub-área que ativa o drag (resto NÃO pega).",
            output: "drag_handle (0, 0, 100, 30)",
          },
          {
            cmd: "drag_offscreen",
            desc: "Permite arrastar para fora da tela.",
            output: "drag_offscreen True",
          },
          {
            cmd: "dragged",
            desc: "Callback quando soltou o Drag.",
            output: "dragged on_drop",
          },
          {
            cmd: "dropped",
            desc: "Callback quando algo foi solto SOBRE este.",
            output: "dropped on_receive",
          },
          {
            cmd: "drag_joined",
            desc: "Lista de outros Drags que se movem juntos.",
            output: "drag_joined grupo_combo",
          },
          {
            cmd: "snap (x, y, t=0.3)",
            desc: "Anima retorno suave a uma posição.",
            output: ".snap(100, 400, delay=0.3)",
          },
        ]}
      />

      <h2>3. DragGroup — drags que se conhecem</h2>

      <CodeBlock
        language="python"
        title="game/screens.rpy"
        code={`screen mini_xicara():
    # O DragGroup conecta tudo: 4 ingredientes + 1 xícara
    draggroup:
        # ───── XÍCARA (alvo do drop) ─────
        drag:
            drag_name "xicara"
            droppable True
            draggable False
            xpos 540  ypos 380
            "images/puzzle/xicara_vazia.png"

        # ───── INGREDIENTES (arrastáveis) ─────
        drag:
            drag_name "cafe"
            draggable True
            droppable False
            xpos 80  ypos 100
            dragged ingrediente_solto
            "images/puzzle/saco_cafe.png"

        drag:
            drag_name "leite"
            draggable True
            droppable False
            xpos 80  ypos 240
            dragged ingrediente_solto
            "images/puzzle/garrafa_leite.png"

        drag:
            drag_name "acucar"
            draggable True
            droppable False
            xpos 80  ypos 380
            dragged ingrediente_solto
            "images/puzzle/cubo_acucar.png"

        drag:
            drag_name "matcha"
            draggable True
            droppable False
            xpos 80  ypos 520
            dragged ingrediente_solto
            "images/puzzle/po_matcha.png"`}
      />

      <h2>4. Callback — descobrir o que foi solto onde</h2>

      <CodeBlock
        language="python"
        title="game/puzzle.rpy"
        code={`default ingredientes_corretos = ["cafe", "leite", "acucar"]
default ingredientes_na_xicara = []

init python:
    def ingrediente_solto(drags, drop):
        """
        drags = lista de Drags arrastados (geralmente 1)
        drop  = Drag onde foi solto (None se solto no vazio)
        """
        if drop is None:
            # Não soltou em nada → volta animado pra origem
            for d in drags:
                d.snap(d.start_x, d.start_y, delay=0.3)
            return

        if drop.drag_name == "xicara":
            ingrediente = drags[0].drag_name

            if ingrediente in ingredientes_corretos:
                # Acertou! "consome" o ingrediente
                ingredientes_na_xicara.append(ingrediente)
                renpy.sound.play("audio/sfx/plop.ogg")
                renpy.notify(ingrediente.capitalize() + " adicionado!")
                # Encaixa centralizado na xícara
                drags[0].snap(540, 380, delay=0.2)
                drags[0].draggable = False  # trava
            else:
                # Errado: ingrediente que NÃO vai na receita
                renpy.sound.play("audio/sfx/buzz.ogg")
                renpy.notify("Esse não vai nessa bebida!")
                drags[0].snap(drags[0].start_x, drags[0].start_y, 0.3)

            # Verifica se completou a receita
            if set(ingredientes_na_xicara) == set(ingredientes_corretos):
                renpy.show_screen("notify_completou")
                renpy.timeout(1.5)`}
      />

      <h2>5. Detectando fim do puzzle no script</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`define s = Character("Sakura", color="#ffaacc")

label puzzle_xicara:
    scene bg cafe
    show sakura feliz at left

    s "Vamos fazer um café com leite e açúcar?"
    s "Arrasta os ingredientes pra dentro da xícara!"

    # Reset do estado
    $ ingredientes_na_xicara = []

    # Mostra o puzzle e espera 60s ou até completar
    call screen mini_xicara

    # Quando o puzzle desaparece (jogador clicou em "pronto"
    # ou o callback fechou via Return)
    if set(ingredientes_na_xicara) == {"cafe", "leite", "acucar"}:
        s "Perfeito! Esse é o café da casa!"
        $ persistent.aprendeu_receita = True
    else:
        s "Hmm, deixa eu te ajudar..."
    return`}
      />

      <h2>6. Botão "Pronto" e snap manual</h2>

      <CodeBlock
        language="python"
        title="game/screens.rpy"
        code={`screen mini_xicara():
    # ... draggroup acima ...
    draggroup:
        drag drag_name "xicara" droppable True draggable False:
            xpos 540 ypos 380
            "images/puzzle/xicara_vazia.png"
        # ... ingredientes ...

    # Botão para finalizar e voltar ao script
    textbutton _("Pronto") action Return(True):
        xalign 0.5 yalign 0.95
        text_size 28

    textbutton _("Reiniciar") action [
        SetVariable("ingredientes_na_xicara", []),
        Hide("mini_xicara"),
        Show("mini_xicara")]:
        xalign 0.05 yalign 0.95`}
      />

      <h2>7. Snap points — voltar suavemente para origem</h2>
      <p>
        Quando o jogador solta o Drag em local errado, o método{" "}
        <code>.snap(x, y, delay)</code> anima o retorno em{" "}
        <code>delay</code> segundos. Os atributos <code>start_x</code> e{" "}
        <code>start_y</code> são preenchidos automaticamente com a posição
        original.
      </p>

      <CodeBlock
        language="python"
        title="game/puzzle.rpy"
        code={`init python:
    def voltar_origem(drags, drop):
        for d in drags:
            d.snap(d.start_x, d.start_y, delay=0.4)

    def encaixar_em(drags, drop):
        if drop is None:
            voltar_origem(drags, drop)
        else:
            # Centraliza o drag em cima do drop
            drags[0].snap(drop.x, drop.y, delay=0.25)`}
      />

      <h2>8. Drag em GRUPO — peças que andam juntas</h2>
      <p>
        <code>drag_joined</code> recebe uma função que retorna uma lista de
        outros Drags que devem se mover JUNTO com este. Útil para arrastar
        a "bandeja" inteira (xícara + pires + colher):
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy"
        code={`init python:
    def bandeja_completa(drag):
        """ Retorna todos os Drags da bandeja com o offset relativo. """
        bandeja = renpy.get_screen("mini_bandeja")
        return [
            (bandeja.child.get_drag("pires"), 0, 0),
            (bandeja.child.get_drag("xicara"), 30, -20),
            (bandeja.child.get_drag("colher"), 80, -10),
        ]

screen mini_bandeja():
    draggroup:
        drag drag_name "pires" draggable True drag_joined bandeja_completa:
            "images/itens/pires.png" xpos 200 ypos 400
        drag drag_name "xicara" draggable True drag_joined bandeja_completa:
            "images/itens/xicara.png" xpos 230 ypos 380
        drag drag_name "colher" draggable True drag_joined bandeja_completa:
            "images/itens/colher.png" xpos 280 ypos 390`}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        user="dev"
        host="vn-studio"
        lines={[
          {
            comment: "log do puzzle rodando",
            cmd: "renpy.exe . run --debug-drag",
            out: `[DRAG] start: cafe at (80, 100)
[DRAG] move: cafe → (380, 320)
[DRAG] drop: cafe ON xicara → SUCCESS
[DRAG] start: leite at (80, 240)
[DRAG] drop: leite ON xicara → SUCCESS
[DRAG] start: matcha at (80, 520)
[DRAG] drop: matcha ON xicara → INVALID
[DRAG] snap-back: matcha → (80, 520)
[DRAG] start: acucar at (80, 380)
[DRAG] drop: acucar ON xicara → SUCCESS
[PUZZLE] receita completa! show notify`,
            outType: "success",
          },
        ]}
      />

      <PracticeBox
        title="Mini-puzzle: monte um café no Sakura Café"
        goal="Construir o mini-jogo completo: 4 ingredientes arrastáveis, 1 xícara droppable, callback validando a receita correta {café, leite, açúcar} e botão 'Pronto'."
        steps={[
          "Em puzzle.rpy crie default ingredientes_na_xicara = [].",
          "Defina init python def ingrediente_solto(drags, drop): com a lógica do exemplo acima.",
          "Crie screen mini_xicara() com draggroup contendo 1 xícara droppable + 4 ingredientes draggable.",
          "Cada ingrediente arrastável usa dragged ingrediente_solto.",
          "Adicione textbutton 'Pronto' action Return(True) xalign 0.5 yalign 0.95.",
          "Em script.rpy: call screen mini_xicara, depois cheque ingredientes_na_xicara para narrar.",
        ]}
        verify="Arrastar café/leite/açúcar para a xícara mostra notify e encaixa centralizado. Arrastar matchá faz tocar buzz.ogg e voltar pra origem. Ao completar os 3, abre notify de receita pronta."
      >
        <CodeBlock
          language="python"
          title="game/puzzle.rpy (gabarito completo)"
          code={`default ingredientes_na_xicara = []

init python:
    def ingrediente_solto(drags, drop):
        if drop is None:
            for d in drags:
                d.snap(d.start_x, d.start_y, 0.3)
            return
        if drop.drag_name == "xicara":
            ing = drags[0].drag_name
            ok = {"cafe", "leite", "acucar"}
            if ing in ok and ing not in ingredientes_na_xicara:
                ingredientes_na_xicara.append(ing)
                renpy.sound.play("audio/sfx/plop.ogg")
                drags[0].snap(540, 380, 0.2)
                drags[0].draggable = False
                if set(ingredientes_na_xicara) == ok:
                    renpy.notify("Café perfeito! Pode entregar.")
            else:
                renpy.sound.play("audio/sfx/buzz.ogg")
                drags[0].snap(drags[0].start_x, drags[0].start_y, 0.3)

screen mini_xicara():
    draggroup:
        drag drag_name "xicara" droppable True draggable False:
            xpos 540 ypos 380
            "images/puzzle/xicara_vazia.png"
        drag drag_name "cafe" draggable True dragged ingrediente_solto:
            xpos 80 ypos 100  "images/puzzle/cafe.png"
        drag drag_name "leite" draggable True dragged ingrediente_solto:
            xpos 80 ypos 240  "images/puzzle/leite.png"
        drag drag_name "acucar" draggable True dragged ingrediente_solto:
            xpos 80 ypos 380  "images/puzzle/acucar.png"
        drag drag_name "matcha" draggable True dragged ingrediente_solto:
            xpos 80 ypos 520  "images/puzzle/matcha.png"
    textbutton _("Pronto") action Return(True) xalign 0.5 yalign 0.95`}
        />
      </PracticeBox>

      <OutputBlock label="cheatsheet — drag/drop" type="info">
{`Drag(child, drag_name=, draggable=, droppable=,
     dragged=callback, dropped=callback, snap=)

DragGroup([drag1, drag2, ...])  ou screen com 'draggroup:'

callback(drags, drop):
    drags = list[Drag] arrastados
    drop  = Drag soltado SOBRE (None se vazio)

drag.snap(x, y, delay=0.3)        ← anima retorno
drag.start_x / start_y            ← posição inicial
drag.draggable = False            ← trava após acerto`}
      </OutputBlock>

      <AlertBox type="warning" title="Mobile / touch">
        Em build Android, o <code>drag_handle</code> deve ser GRANDE
        (mínimo 80x80px) para acomodar o dedo. Em desktop com mouse,
        20x20px serve. Sempre teste no device alvo antes de fechar
        o puzzle.
      </AlertBox>

      <AlertBox type="success" title="Próximo passo">
        Esse mesmo padrão serve para inventário arrastável (item da
        mochila → personagem), composição de outfit (roupa →
        manequim) ou puzzle de quebra-cabeça (peças → tabuleiro). Veja{" "}
        <strong>Inventario.tsx</strong> para o sistema completo do café.
      </AlertBox>
    </PageContainer>
  );
}
