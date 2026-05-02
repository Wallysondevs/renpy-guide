import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function TransformProperties() {
  return (
    <PageContainer
      title="Transform Properties — referência completa"
      subtitle="TODAS as propriedades de transform: posição, escala, rotação, alpha, blend, blur, perspective, matrixcolor, crop. Tabela exaustiva com exemplo visual de cada — porque a doc oficial só lista nomes sem mostrar o efeito."
      difficulty="intermediario"
      timeToRead="20 min"
      prompt="visual/transform-properties"
    >
      <AlertBox type="info" title="Por que existem TANTAS propriedades">
        Transform é a camada visual entre o Displayable e a tela. Cada
        propriedade ajusta UM aspecto: onde está, qual tamanho, qual
        rotação, qual cor, qual transparência, qual recorte. Combinando
        elas você cria desde "centralizar" até "câmera 3D girando com
        filtro sépia em torno da Sakura". A doc oficial lista 40+
        properties — abaixo, agrupadas e com exemplo de cada.
      </AlertBox>

      <h2>1. Posição absoluta — pixels</h2>

      <CommandTable
        title="Properties de posição em pixels"
        variations={[
          { cmd: "xpos N / ypos N", desc: "Posição em pixels do canto superior esquerdo do displayable.", output: "xpos 100 ypos 540" },
          { cmd: "pos (X, Y)", desc: "Atalho para xpos+ypos.", output: "pos (640, 360)" },
          { cmd: "xoffset N / yoffset N", desc: "Deslocamento adicional após cálculo de pos+anchor.", output: "yoffset -10 → sobe 10px" },
          { cmd: "offset (X, Y)", desc: "Atalho para xoffset+yoffset.", output: "offset (5, -5)" },
        ]}
      />

      <h2>2. Posição proporcional — porcentagem da tela</h2>

      <CommandTable
        title="Properties de alinhamento (0.0 - 1.0)"
        variations={[
          { cmd: "xalign F / yalign F", desc: "Alinha o displayable proporcionalmente. 0.5 = centro.", output: "xalign 0.5 yalign 1.0 → centro embaixo" },
          { cmd: "align (X, Y)", desc: "Atalho para xalign+yalign.", output: "align (1.0, 0.0) → canto superior direito" },
          { cmd: "xanchor F / yanchor F", desc: "Ponto de ancoragem DENTRO do displayable (0.5 = meio).", output: "xanchor 0.5 → centraliza horizontalmente em xpos" },
          { cmd: "anchor (X, Y)", desc: "Atalho.", output: "anchor (0.5, 1.0) → meio-baixo" },
          { cmd: "xcenter F / ycenter F", desc: "Atalho: xpos = F, xanchor = 0.5 (centro fica em F).", output: "xcenter 0.75" },
        ]}
      />

      <AlertBox type="success" title="Macete dos defaults">
        Para sprite de personagem (corpo inteiro) o padrão da comunidade é{" "}
        <code>xanchor 0.5 yanchor 1.0</code> — o pé do personagem fica
        ancorado, então quando você faz <code>yalign 1.0</code> ele "pisa"
        no chão da tela.
      </AlertBox>

      <h2>3. Escala</h2>

      <CommandTable
        title="Properties de zoom"
        variations={[
          { cmd: "zoom F", desc: "Escala uniforme. 1.0 = original. 2.0 = dobro.", output: "zoom 1.5 → 50% maior" },
          { cmd: "xzoom F / yzoom F", desc: "Escala por eixo. xzoom -1.0 espelha horizontalmente.", output: "xzoom -1.0 → espelha o sprite" },
          { cmd: "size (W, H)", desc: "Define o tamanho final em pixels (ignora zoom).", output: "size (400, 600)" },
          { cmd: "fit \"contain\"", desc: "Como ajustar dentro da área (contain | cover | fill | scale-down).", output: "fit \"contain\"" },
          { cmd: "maxsize (W, H)", desc: "Limita o tamanho máximo permitido.", output: "maxsize (1920, 1080)" },
          { cmd: "subpixel True", desc: "Ativa renderização sub-pixel — anti-aliasing extra.", output: "subpixel True" },
        ]}
      />

      <h2>4. Rotação e perspectiva</h2>

      <CommandTable
        title="Properties de rotação 2D/3D"
        variations={[
          { cmd: "rotate F", desc: "Rotação Z em graus (anti-horário em valor negativo).", output: "rotate 15" },
          { cmd: "rotate_pad True", desc: "Adiciona padding para o sprite não cortar ao girar.", output: "rotate_pad True" },
          { cmd: "transform_anchor True", desc: "Usa o anchor como pivô da rotação (em vez do centro).", output: "transform_anchor True" },
          { cmd: "perspective True", desc: "Ativa rendering 3D no displayable (3D Stage).", output: "perspective True" },
          { cmd: "matrixtransform RotateMatrix(0, 30, 0)", desc: "Aplica matriz 4x4 (rotação 3D Y de 30°).", output: "Para flip de carta no eixo Y." },
        ]}
      />

      <h2>5. Cor, alpha e blend modes</h2>

      <CommandTable
        title="Properties de cor"
        variations={[
          { cmd: "alpha F", desc: "Transparência 0.0 (invisível) a 1.0 (opaco).", output: "alpha 0.5" },
          { cmd: "additive F", desc: "Mistura aditiva — clareia tudo abaixo. F = intensidade.", output: "additive 1.0 → efeito brilho/luz" },
          { cmd: "blendmode \"normal\"", desc: "Modo de mistura: normal | add | multiply | min | max.", output: "blendmode \"multiply\" → escurece" },
          { cmd: "matrixcolor TintMatrix(\"#ff8\")", desc: "Aplica matriz de cor (sépia, gray, hue shift).", output: "Ver página Matrixcolor.tsx" },
          { cmd: "shader \"shaders.water\"", desc: "Aplica shader GLSL custom.", output: "shader \"shaders.water\" u_time time" },
          { cmd: "u_<nome> valor", desc: "Uniform passado para o shader.", output: "u_intensity 0.6" },
        ]}
      />

      <h2>6. Recorte e máscara</h2>

      <CommandTable
        title="Properties de crop/mask"
        variations={[
          { cmd: "crop (X, Y, W, H)", desc: "Recorta o displayable a partir das coordenadas.", output: "crop (0, 0, 300, 400)" },
          { cmd: "crop_relative True", desc: "Crop em fração 0-1 em vez de pixels.", output: "crop_relative True; crop (0, 0, 0.5, 1.0)" },
          { cmd: "corner1 (X, Y) / corner2 (X, Y)", desc: "Recorte alternativo por dois cantos.", output: "corner1 (0, 0) corner2 (0.5, 1.0)" },
          { cmd: "blur F", desc: "Aplica desfoque gaussiano com raio F (precisa gl2).", output: "blur 4.0 → desfoca toda a cena" },
        ]}
      />

      <h2>7. Around, angle, radius — coordenadas polares</h2>

      <CommandTable
        title="Movimento orbital (raro, mas poderoso)"
        variations={[
          { cmd: "around (X, Y)", desc: "Define centro de órbita.", output: "around (960, 540) → orbita em torno do centro" },
          { cmd: "angle F", desc: "Ângulo em graus (em torno de 'around').", output: "angle 90 → 90° em sentido anti-horário" },
          { cmd: "radius F", desc: "Distância do centro 'around'.", output: "radius 200 → 200px do centro" },
          { cmd: "alignaround (X, Y)", desc: "Atalho: define around + alinha o pivô.", output: "alignaround (0.5, 0.5)" },
        ]}
      />

      <h2>8. Mesh e shaders avançados</h2>

      <CommandTable
        title="Properties de mesh (model-based rendering)"
        variations={[
          { cmd: "mesh True", desc: "Habilita rendering por mesh (necessário para shaders).", output: "mesh True" },
          { cmd: "mesh_pad (L,T,R,B)", desc: "Padding extra na mesh (evita corte com shader que distorce).", output: "mesh_pad (50, 50, 50, 50)" },
          { cmd: "shader \"shader.name\"", desc: "Shader GLSL registrado em init python.", output: "shader \"sakura.water\"" },
          { cmd: "gl_blend_func (...)", desc: "Override manual do glBlendFunc.", output: "Avançado, raramente usado." },
          { cmd: "gl_color_mask (R,G,B,A)", desc: "Liga/desliga canais de cor.", output: "(True, True, False, True) → sem azul" },
        ]}
      />

      <h2>9. Tudo junto: cena cinematográfica do Sakura Café</h2>

      <CodeBlock
        language="python"
        title="game/transforms.rpy"
        code={`# Cena: Sakura entra orbitando em torno do balcão e fica em foco

transform entrada_dramatica:
    # Estado inicial
    alpha 0.0
    zoom 0.6
    around (960, 700)   # centro do balcão
    radius 600
    angle 0
    matrixcolor TintMatrix("#000")  # totalmente preta

    # Animação paralela
    parallel:
        ease 1.5 alpha 1.0
    parallel:
        ease 1.5 zoom 1.0
    parallel:
        easein 1.5 angle 90
    parallel:
        easeout 1.5 radius 0
    parallel:
        ease 1.5 matrixcolor TintMatrix("#fff")  # cor real
    pause 0.2

    # Pulinho de chegada
    ease 0.2 yoffset -20
    ease 0.2 yoffset 0`}
      />

      <h2>10. Fit, size e maxsize na prática</h2>

      <CodeBlock
        language="python"
        title="game/screens.rpy — retrato responsivo"
        code={`# Mostra retrato da Sakura cabendo sempre em 200x200,
# mantendo proporção, sem distorcer
screen retrato_sakura():
    fixed:
        xsize 200 ysize 200
        add "images/sakura/feliz.png":
            fit "contain"
            xalign 0.5 yalign 0.5
            maxsize (200, 200)`}
      />

      <h2>11. Matrixtransform — flip de carta 3D</h2>

      <CodeBlock
        language="python"
        title="game/transforms.rpy"
        code={`init python:
    def flip_y_matrix(graus):
        return RotateMatrix(0.0, graus, 0.0)

transform virar_carta:
    perspective True
    rotate_pad True
    matrixtransform flip_y_matrix(0)
    linear 0.4 matrixtransform flip_y_matrix(90)
    # No meio do giro, troca a face — escondendo costas
    on hide:
        linear 0.0 alpha 0.0`}
      />

      <h2>12. Blur e blendmode — efeitos atmosféricos</h2>

      <CodeBlock
        language="python"
        title="game/transforms.rpy"
        code={`# Foco rack: BG desfocado, sprite em foco
transform foco_sakura:
    blur 0
    on show:
        ease 0.6 blur 0

transform fundo_desfocado:
    blur 8

# Blend multiply para escurecer cena (modo noturno)
transform modo_noite:
    matrixcolor TintMatrix("#3355aa")
    blendmode "multiply"`}
      />

      <Terminal
        path="~/sakura-cafe"
        lines={[
          {
            comment: "lint detecta uso de blur sem gl2 ativado",
            cmd: "renpy.sh . lint",
            out: `game/transforms.rpy:18 'blur' requires config.gl2 = True.
Add 'define config.gl2 = True' in options.rpy.
1 error reported.`,
            outType: "error",
          },
          {
            comment: "depois de habilitar gl2",
            cmd: "renpy.sh . lint",
            out: `Lint complete. No problems were found.`,
            outType: "success",
          },
        ]}
      />

      <PracticeBox
        title="Sakura entra do nada com efeito completo"
        goal="Combinar zoom + alpha + rotate + matrixcolor numa entrada épica de 2 segundos."
        steps={[
          "Em transforms.rpy crie 'transform entrada_epica'.",
          "Estado inicial: alpha 0.0, zoom 0.4, rotate -15, matrixcolor TintMatrix('#000').",
          "Use parallel para animar simultaneamente: alpha→1.0, zoom→1.0, rotate→0, matrixcolor→TintMatrix('#fff'), tudo em ease 2.0.",
          "Em script.rpy: 'show sakura feliz at entrada_epica'.",
          "Pause 2.0 e adicione uma fala depois.",
        ]}
        verify="A Sakura aparece girando, crescendo, ganhando cor e opacidade simultaneamente em 2 segundos."
      >
        <CodeBlock
          language="python"
          title="transforms.rpy"
          code={`transform entrada_epica:
    alpha 0.0  zoom 0.4  rotate -15
    matrixcolor TintMatrix("#000")
    parallel:
        ease 2.0 alpha 1.0
    parallel:
        ease 2.0 zoom 1.0
    parallel:
        ease 2.0 rotate 0
    parallel:
        ease 2.0 matrixcolor TintMatrix("#fff")`}
        />
      </PracticeBox>

      <OutputBlock label="cheat sheet — agrupado por função" type="info">
{`POSIÇÃO PX     xpos ypos pos xoffset yoffset offset
POSIÇÃO %      xalign yalign align xanchor yanchor anchor xcenter ycenter
ESCALA         zoom xzoom yzoom size fit maxsize subpixel
ROTAÇÃO        rotate rotate_pad transform_anchor perspective matrixtransform
COR/ALPHA      alpha additive blendmode matrixcolor shader u_*
RECORTE        crop crop_relative corner1 corner2 blur
ORBITAL        around angle radius alignaround
MESH           mesh mesh_pad gl_blend_func gl_color_mask`}
      </OutputBlock>

      <AlertBox type="warning" title="Performance: nem tudo é gratuito">
        <code>blur</code>, <code>shader</code>, <code>matrixcolor</code> e{" "}
        <code>matrixtransform</code> exigem <code>config.gl2 = True</code>{" "}
        e custam GPU. Em mobile/web, evite empilhar mais de 2 sprites com
        blur ativo — vai cair de 60fps para 20fps.
      </AlertBox>
    </PageContainer>
  );
}
