import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Stage3D() {
  return (
    <PageContainer
      title="3D Stage — câmera, perspectiva e parallax"
      subtitle="Posicione layers em planos 3D, mova a câmera, gere parallax real entre balcão, Sakura e parede do café. Tudo via transform com perspective True, sem GLSL puro."
      difficulty="avancado"
      timeToRead="16 min"
      prompt="visual/stage-3d"
    >
      <AlertBox type="info" title="Por que 3D Stage existe">
        VNs sempre foram 2D planas. O <strong>3D Stage</strong> (Ren'Py
        7.4+, refinado no 8.x) deixa cada <em>layer</em> ter coordenada{" "}
        <strong>Z</strong> e a câmera se mover em XYZ + rotação. O
        resultado: parallax real (balcão se mexe mais que parede), zoom
        com profundidade verossímil, e câmera "passeando" pela cena do
        Sakura Café.
      </AlertBox>

      <h2>1. Pré-requisitos: GL2 e perspective</h2>
      <p>
        3D Stage só funciona com o renderer <strong>GL2</strong> ativado
        (padrão no Ren'Py 8.x) e com{" "}
        <code>config.perspective</code> ativado nos layers que vão receber
        profundidade.
      </p>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`# Garante GL2 (já é o default no Ren'Py 8.x)
define config.gl2 = True

# Cada layer pode ter sua perspectiva. Ative só nos que precisam.
# Tupla: (near, distance, far) em "unidades 3D"
define config.perspective = (100, 1024, 100000)

# Define quais layers terão profundidade
define config.layers = ["master", "transient", "screens", "overlay"]
init python:
    # Marca o 'master' como 3D-aware
    config.layer_clipping["master"] = (0, 0, config.screen_width, config.screen_height)`}
      />

      <h2>2. Coordenadas 3D em transforms</h2>
      <p>
        Qualquer transform pode ganhar <code>zpos</code> (profundidade) e{" "}
        <code>perspective True</code>. Quanto MAIOR o zpos, mais{" "}
        <strong>longe</strong> o objeto está da câmera.
      </p>

      <CodeBlock
        language="python"
        title="game/transforms.rpy"
        code={`# Plano de fundo: parede do café (LONGE)
transform plano_parede:
    perspective True
    zpos -800       # negativo = atrás da câmera neutra

# Plano médio: Sakura no balcão
transform plano_sakura:
    perspective True
    zpos -200

# Primeiro plano: balcão e xícara em cima
transform plano_balcao:
    perspective True
    zpos 100        # positivo = à frente, perto da câmera`}
      />

      <h2>3. A câmera — show camera</h2>
      <p>
        Em vez de mover sprites, você move a <strong>câmera</strong> e
        TUDO se mexe junto com parallax automático. O statement{" "}
        <code>camera</code> equivale a <code>show camera</code>.
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy — câmera passeando"
        code={`label cena_3d_cafe:
    # Posiciona cada plano antes
    scene bg parede_cafe at plano_parede
    show balcao at plano_balcao
    show sakura uniforme at plano_sakura

    # Câmera começa centralizada, ligeiramente afastada
    camera:
        perspective True
        xpos 0  ypos 0  zpos 0
        rotate 0

    s "Bem-vindo ao Sakura Café! Vou te mostrar tudo aqui."

    # Move a câmera 200 px à direita em 2s — parallax acontece sozinho
    camera:
        perspective True
        ease 2.0 xpos 200

    s "À sua direita fica a área dos doces. Olha que vitrine."

    # Câmera se aproxima da Sakura (zoom in via zpos)
    camera:
        perspective True
        ease 1.5 xpos 0  zpos 300

    show sakura corada
    s "E... esse aqui é o seu lugar. Sente, por favor."
    return`}
      />

      <h2>4. Properties 3D — tabela completa</h2>

      <CommandTable
        title="Properties extras quando perspective=True"
        variations={[
          {
            cmd: "perspective True",
            desc: "Liga o pipeline 3D para esse displayable. SEM isso, zpos vira só offset 2D.",
            output: "Obrigatório no transform e na camera.",
          },
          {
            cmd: "zpos N",
            desc: "Profundidade. <0 atrás, 0 plano da câmera, >0 à frente.",
            output: "zpos -500 → bem ao fundo (parallax fraco)",
          },
          {
            cmd: "zzoom True",
            desc: "Aplica perspectiva no tamanho — coisas distantes ficam menores.",
            output: "Sem isso, parallax mexe SÓ horizontal.",
          },
          {
            cmd: "matrixtransform Matrix.rotate(...)",
            desc: "Rotaciona o sprite em 3D (eixo X tilta, Y gira, Z roda no plano).",
            output: "matrixtransform Matrix.rotate(0, 30, 0)",
          },
          {
            cmd: "u_lod_bias",
            desc: "Bias do level-of-detail; ajuda quando mipmap fica blurry.",
            output: "u_lod_bias -0.5 → texturas mais nítidas em zoom out",
          },
          {
            cmd: "blur N",
            desc: "Desfoca em N pixels. Combine com zpos para depth-of-field manual.",
            output: "blur 6 → leve bokeh em planos distantes",
          },
        ]}
      />

      <h2>5. Receita: parallax horizontal (mouse-look)</h2>
      <p>
        Câmera segue levemente o mouse para dar a sensação de "estou ali".
        O efeito que TODO mundo elogia em VNs modernas:
      </p>

      <CodeBlock
        language="python"
        title="game/transforms.rpy — câmera mouse-look"
        code={`init python:
    def camera_mouse(t, st):
        # Posição do mouse normalizada (-1 a 1)
        x, y = renpy.get_mouse_pos()
        nx = (x / config.screen_width) * 2 - 1
        ny = (y / config.screen_height) * 2 - 1
        # Move câmera SUTIL (max 40px X, 20px Y)
        return Transform(xpos=nx * 40, ypos=ny * 20, perspective=True)

transform camera_segue_mouse:
    function camera_mouse`}
      />

      <CodeBlock
        language="python"
        title="game/script.rpy — ativando o mouse-look"
        code={`label entra_no_cafe:
    scene bg parede_cafe at plano_parede
    show balcao at plano_balcao
    show sakura uniforme at plano_sakura

    # Aplica o mouse-look à câmera
    camera at camera_segue_mouse
    s "Mexe o mouse, vai ver o efeito de profundidade."
    return`}
      />

      <h2>6. Tilt / shake 3D em momentos de tensão</h2>

      <CodeBlock
        language="python"
        title="game/transforms.rpy"
        code={`# Tremor da câmera (terremoto, susto)
transform camera_tremer:
    perspective True
    block:
        choice:
            xpos -8  ypos 4
        choice:
            xpos 6  ypos -3
        choice:
            xpos -4 ypos -6
        pause 0.04
        repeat 12
    xpos 0  ypos 0

# Tilt dramático (notícia chocante)
transform camera_tilt_drama:
    perspective True
    ease 0.6 matrixtransform Matrix.rotate(0, 0, 8)
    pause 1.5
    ease 0.6 matrixtransform Matrix.rotate(0, 0, 0)`}
      />

      <h2>7. Layers múltiplas com perspective independente</h2>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`# Crie um layer 'cenario3d' que reage à câmera, e mantenha 'screens' 2D
define config.layers = ["master", "cenario3d", "transient", "screens", "overlay"]
define config.layer_transforms = {
    "cenario3d": [Transform(perspective=True)],
}

# UI (pontuação, balão de fala) NÃO afeta a profundidade
define config.layer_clipping = {
    "screens": (0, 0, config.screen_width, config.screen_height),
}`}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        user="dev"
        host="vn-studio"
        lines={[
          {
            comment: "verificar se GL2 está ativo (lint não pega isso, use console)",
            cmd: "renpy.sh . --command=info",
            out: `Ren'Py 8.2.3
Renderer: GL2
GL Vendor: NVIDIA Corporation
GL Version: 4.6.0 NVIDIA 535.54.03
Perspective layers: master, cenario3d`,
            outType: "success",
          },
          {
            comment: "se aparecer 'GL', você está em GL1 — 3D Stage NÃO funciona",
            cmd: "renpy.sh . --command=info",
            out: `Ren'Py 8.2.3
Renderer: GL    ← problema!
Hint: force GL2 with config.gl2 = True`,
            outType: "warning",
          },
        ]}
      />

      <OutputBlock label="cheat-sheet — quando usar 3D Stage" type="info">
{`✓ Cena com 3+ planos (BG, NPC, jogador, item) e câmera passeando
✓ Mouse-look sutil (parallax que o jogador "percebe sem perceber")
✓ Zoom dramático em close de personagem (zpos negativo na câmera)
✓ Tilt cinematográfico em flashbacks
✗ NÃO use para shake simples — basta xoffset/yoffset 2D
✗ NÃO use em cenas de menu / inventário (overhead à toa)
✗ NÃO funciona em GL1 nem em ANGLE/DirectX antigo`}
      </OutputBlock>

      <PracticeBox
        title="Câmera dolly-in na Sakura"
        goal="Quando o protagonista olha para a Sakura pela primeira vez, a câmera deve se aproximar dela em ~1.5s, dando ênfase emocional."
        steps={[
          "Em transforms.rpy crie plano_parede (zpos -600), plano_sakura (zpos -100), plano_balcao (zpos 80) — todos com perspective True.",
          "Posicione cada elemento da cena com 'show ... at plano_X'.",
          "Inicie a câmera em xpos 0 zpos 0.",
          "Use 'camera: perspective True ease 1.5 zpos 250' para aproximar.",
          "Adicione duas falas em volta para sentir o tempo da câmera.",
        ]}
        verify="Durante a fala, a Sakura deve aparentar 'crescer' suavemente enquanto a parede do fundo cresce MENOS — esse é o parallax/dolly real do 3D Stage."
      >
        <CodeBlock
          language="python"
          title="game/script.rpy (gabarito)"
          code={`transform plano_parede:
    perspective True
    zpos -600

transform plano_sakura:
    perspective True
    zpos -100

transform plano_balcao:
    perspective True
    zpos 80

label primeiro_olhar:
    scene bg parede_cafe at plano_parede
    show balcao at plano_balcao
    show sakura uniforme at plano_sakura

    camera:
        perspective True
        xpos 0  zpos 0

    s "Você é o(a) novo(a) cliente, certo?"

    camera:
        perspective True
        ease 1.5 zpos 250

    show sakura corada at plano_sakura
    s "..."
    s "Bom... seja muito bem-vindo(a)."
    return`}
        />
      </PracticeBox>

      <AlertBox type="warning" title="Pegadinha: Z e zpos NÃO são pixels">
        zpos é uma "unidade 3D" arbitrária baseada na sua{" "}
        <code>config.perspective</code>. Mude o segundo valor da tupla
        (distância da câmera) e TODO seu projeto reescala. Comece com{" "}
        <code>(100, 1024, 100000)</code>, ajuste depois.
      </AlertBox>

      <AlertBox type="danger" title="Performance em mobile">
        Cada plano com perspective=True vira 1 draw call extra. Em
        smartphones low-end (4GB RAM, GPU integrada), limite a{" "}
        <strong>4 planos simultâneos</strong>. Acima disso o framerate cai
        para 25-30 fps.
      </AlertBox>

      <AlertBox type="success" title="Próximo passo">
        Para personagens vivos (piscando, respirando, com física de
        cabelo), o salto natural é <strong>Live2D Cubism</strong>.
      </AlertBox>
    </PageContainer>
  );
}
