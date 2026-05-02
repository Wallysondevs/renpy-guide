import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Cenas() {
  return (
    <PageContainer
      title="Cenas — scene, show, hide e posicionamento"
      subtitle="Como montar uma cena: trocar background, posicionar sprites em left/center/right, controlar layers e fazer dois personagens dialogarem na mesma tela."
      difficulty="iniciante"
      timeToRead="16 min"
      prompt="visual/cenas"
    >
      <AlertBox type="info" title="Diferença entre scene, show e hide">
        <strong>scene</strong> limpa TUDO da camada e coloca uma imagem nova
        (geralmente um fundo). <strong>show</strong> adiciona ou substitui
        UMA imagem mantendo o resto. <strong>hide</strong> remove apenas a
        imagem com a tag indicada. É a base de toda direção visual em
        Ren'Py.
      </AlertBox>

      <h2>1. <code>scene</code> — limpa e troca o cenário</h2>
      <p>
        Pense em <code>scene bg cafe</code> como "corte!" no cinema: tudo
        que estava em cena some, e o novo background ocupa o lugar. Use
        sempre que o local da história mudar.
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label cena_intro:
    # Tela preta inicial
    scene black
    with fade

    # Cenário 1 — café de Akihabara, 14h
    scene bg cafe
    with dissolve

    s "Bem-vindo de volta ao Sakura Café."

    # Mudança de cenário: passa o tempo, vão pro parque
    scene bg parque
    with fade

    s "O parque sempre fica lindo nessa hora."
    return`}
      />

      <CommandTable
        title="Variantes do statement scene"
        variations={[
          { cmd: "scene", desc: "Sem argumento — limpa a tela inteira (fica preto).", output: "Útil entre capítulos." },
          { cmd: "scene bg cafe", desc: "Limpa e mostra o background 'bg cafe'.", output: "Forma mais comum." },
          { cmd: "scene bg cafe with fade", desc: "Aplica a transição 'fade' ao mesmo tempo.", output: "Equivale a scene + with fade em uma linha." },
          { cmd: "scene bg cafe onlayer master", desc: "Limpa só a layer 'master' (deixa overlays intactos).", output: "Avançado, raramente necessário." },
          { cmd: "scene black", desc: "Cor sólida pré-definida — equivale a Solid('#000').", output: "Atalho clássico para corte preto." },
        ]}
      />

      <h2>2. <code>show</code> — adicionar ou trocar sprite</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label encontro:
    scene bg escola
    with fade

    # Sakura aparece no centro
    show sakura neutra
    with dissolve

    s "Oi! Tava te procurando."

    # Trocar a expressão — mesma tag 'sakura' substitui
    show sakura feliz
    s "Achei!"

    # Yuki entra à esquerda — tag diferente, soma na cena
    show yuki braba at left
    with moveinleft

    y "Sakura, cadê o caderno que eu te emprestei?"

    # Trocar Sakura para corada
    show sakura corada
    s "A-aah... esqueci na minha mochila..."
    return`}
      />

      <h2>3. Posições — <code>at left</code>, <code>at right</code>, <code>at center</code></h2>

      <CommandTable
        title="Posições pré-definidas no Ren'Py"
        variations={[
          { cmd: "at center", desc: "Centro da tela (default).", output: "Posição padrão para 1 personagem." },
          { cmd: "at left", desc: "Pivô esquerdo — sprite alinhado a ~25% da largura.", output: "Primeiro personagem em diálogo a 2." },
          { cmd: "at right", desc: "Pivô direito — sprite alinhado a ~75% da largura.", output: "Segundo personagem em diálogo a 2." },
          { cmd: "at truecenter", desc: "Centro PERFEITO da tela (50%, 50%).", output: "Cards, títulos e imagens centralizadas." },
          { cmd: "at offscreenleft", desc: "Fora da tela à esquerda — para animar entrada.", output: "Combinado com 'moveinleft'." },
          { cmd: "at offscreenright", desc: "Fora da tela à direita.", output: "Combinado com 'moveinright'." },
        ]}
      />

      <CodeBlock
        language="python"
        title="game/script.rpy — diálogo a três"
        code={`label triangulo:
    scene bg cafe
    show sakura neutra at left
    show yuki neutra at center
    show akira misterioso at right
    with dissolve

    s "Pessoal, temos um problema com o pedido da mesa 4."
    y "Que tipo de problema?"
    a "...você não vai gostar."
    return`}
      />

      <h2>4. <code>hide</code> — remover um sprite</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label saida:
    show sakura neutra at left
    show yuki neutra at center
    show akira misterioso at right

    a "Tenho que ir. Volto amanhã."

    hide akira
    with moveoutright

    s "Tchau, Akira-kun."
    y "Cara estranho..."

    hide sakura
    with dissolve

    y "Bom, hora de voltar pro caixa."
    return`}
      />

      <AlertBox type="warning" title="hide só remove a TAG, não o atributo">
        Se a Sakura estava em <code>show sakura feliz</code>, você usa{" "}
        <code>hide sakura</code> (sem o "feliz"). A tag é a primeira palavra
        — o "endereço" que você usou para registrar o sprite.
      </AlertBox>

      <h2>5. Posições customizadas com <code>transform</code></h2>

      <CodeBlock
        language="python"
        title="game/transforms.rpy"
        code={`# Posições em proporção da tela (0.0 a 1.0)
transform pos_balcao:
    xalign 0.15
    yalign 1.0

transform pos_porta:
    xalign 0.85
    yalign 1.0

transform pos_alto:
    xalign 0.5
    yalign 0.2

# Em pixels exatos (resolução 1920x1080)
transform pos_pixel_419:
    xpos 419
    ypos 720`}
      />

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label cena_balcao:
    scene bg cafe
    show sakura uniforme at pos_balcao
    show yuki neutra at pos_porta
    with dissolve

    y "Cheguei!"
    s "Ah, oi Yuki! Tava te esperando."
    return`}
      />

      <h2>6. Layers (camadas)</h2>
      <p>
        O Ren'Py organiza tudo em camadas empilhadas. Conhecer as 4
        principais te dá controle total de profundidade:
      </p>

      <OutputBlock label="ordem de empilhamento (de baixo p/ cima)" type="info">
{`master    ← sprites e backgrounds (scene/show vão aqui por default)
transient ← efeitos temporários
screens   ← textbox, menus, GUI (sempre visíveis)
overlay   ← timer, indicador de save, ícones extras`}
      </OutputBlock>

      <CommandTable
        title="Manipulando layers"
        variations={[
          { cmd: "show item carta onlayer overlay", desc: "Mostra na layer overlay — fica acima de tudo.", output: "Item visível por cima do textbox." },
          { cmd: "hide item carta onlayer overlay", desc: "Remove apenas dessa layer." },
          { cmd: "scene onlayer master", desc: "Limpa só a master — preserva overlays." },
          { cmd: "renpy.show_layer_at(t, layer='master')", desc: "Aplica um Transform a TODA a layer.", output: "Útil para shake/zoom global." },
        ]}
      />

      <h2>7. Z-order — quem fica na frente?</h2>
      <p>
        Dentro da mesma layer, a ordem dos <code>show</code> determina a
        profundidade: o último mostrado fica por cima. Para forçar uma
        ordem, use <code>zorder</code>:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label trio_zorder:
    scene bg cafe
    show yuki neutra at left zorder 1
    show sakura neutra at center zorder 2  # mais à frente
    show akira misterioso at right zorder 1
    with dissolve

    s "Tô no meio porque sou a heroína."
    return`}
      />

      <h2>8. Cenário típico — conduzindo uma cena inteira</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy — cena completa de café"
        code={`label cena_pedido:
    scene bg cafe
    with fade

    show sakura uniforme at pos_balcao
    with dissolve

    s "Boa tarde! O que vai querer hoje?"

    show akira misterioso at pos_porta
    with moveinright

    a "Café preto, sem açúcar."

    show akira misterioso at center
    with move

    s "Saindo. Quer alguma sobremesa?"

    show sakura corada at pos_balcao

    a "...só o café. Obrigado."

    hide akira
    with moveoutleft

    show sakura neutra at pos_balcao

    s "Hum... esse cara aparece todo dia, no mesmo horário."
    return`}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        user="dev"
        host="vn-studio"
        lines={[
          {
            comment: "Roda o projeto pelo CLI (alternativa ao Launcher)",
            cmd: "renpy.exe .",
            out: `[INFO] Loading scripts...
[INFO] Initialized images: 24
[INFO] Cache size: 64 MB
[INFO] Window opened at 1920x1080`,
            outType: "success",
          },
        ]}
      />

      <PracticeBox
        title="Monte uma cena de 3 personagens no parque"
        goal="Praticar scene + show com 3 tags diferentes em posições left/center/right e fazer um sair com hide."
        steps={[
          "Em script.rpy crie um label novo: 'label cena_parque:'.",
          "Use 'scene bg parque with fade' para abrir o cenário.",
          "Mostre 3 personagens em left, center e right com 'show ... at ...'.",
          "Adicione 4 falas alternando entre eles.",
          "Esconda um deles com 'hide <tag> with dissolve' e finalize com 'return'.",
          "No início de 'label start:' coloque 'jump cena_parque' e rode.",
        ]}
        verify="Os 3 sprites aparecem juntos, dialogam, e um some quando você chamar hide. Sem erro de ImageNotFound."
      />

      <AlertBox type="success" title="Dica de fluxo: planeje em storyboard">
        Antes de programar uma cena longa, faça uma tabela em papel: linha =
        momento, coluna 1 = quem está em cena, coluna 2 = expressões. Isso
        evita esquecer um <code>hide</code> e ficar com sprites
        "fantasmas" sobrando entre cenários.
      </AlertBox>
    </PageContainer>
  );
}
