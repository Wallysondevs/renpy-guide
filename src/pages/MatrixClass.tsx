import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function MatrixClass() {
  return (
    <PageContainer
      title="Matrix — matrizes 4x4 para transformações"
      subtitle="A classe Matrix é a representação de baixo nível por trás de zoom, rotate e offset. Aprenda quando descer ao Matrix manual em vez de usar transform — projeções 3D, perspective custom e composições impossíveis com ATL puro."
      difficulty="avancado"
      timeToRead="13 min"
      prompt="python/matrix"
    >
      <AlertBox type="info" title="O que é a classe Matrix">
        <code>Matrix</code> é uma matriz 4x4 imutável usada pelo Ren'Py
        (model-based renderer, GL2) para qualquer transformação geométrica.
        Internamente, todo <code>zoom 1.5</code>, <code>rotate 30</code> e{" "}
        <code>xoffset 100</code> que você escreve em ATL é convertido em uma
        Matrix. Em 95% dos casos você nem encosta nela — mas existe um 5%
        (perspective custom, mesh deform, shaders) onde só Matrix resolve.
      </AlertBox>

      <h2>1. Construtores — todas as formas</h2>
      <p>
        Os construtores estáticos retornam matrizes <strong>novas</strong>;
        Matrix é imutável.
      </p>

      <CommandTable
        title="Construtores estáticos de Matrix"
        variations={[
          { cmd: "Matrix.identity()", desc: "Matriz identidade 4x4 (não muda nada).", output: "Matrix de elementos diagonais = 1.0" },
          { cmd: "Matrix.scale(x, y, z)", desc: "Escala em cada eixo. Use 1.0 para 'não mexe'.", output: "Matrix.scale(2, 2, 1) → dobra X e Y" },
          { cmd: "Matrix.rotate(x, y, z)", desc: "Rotação em GRAUS em cada eixo (Euler).", output: "Matrix.rotate(0, 0, 30) → 30° no plano" },
          { cmd: "Matrix.offset(x, y, z)", desc: "Translação em pixels em cada eixo.", output: "Matrix.offset(100, 0, 0) → 100px à direita" },
          { cmd: "Matrix.perspective(w, h, near, far, z)", desc: "Projeção perspectiva. Usado pelo Stage 3D.", output: "Matriz que faz objetos longe ficarem menores." },
          { cmd: "Matrix.screen_projection(w, h)", desc: "Projeção ortográfica padrão Ren'Py.", output: "Mapeia pixels para coordenadas GL." },
          { cmd: "Matrix(values)", desc: "Construtor cru: lista/tupla de 16 floats em ordem de linha.", output: "Matrix([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1])" },
        ]}
      />

      <h2>2. Composição — multiplicar matrizes</h2>
      <p>
        Multiplicar matrizes é como <strong>encadear</strong> transformações.
        A ordem importa: <code>A * B</code> aplica B primeiro, depois A
        (convenção coluna). Em Python use o operador <code>*</code>.
      </p>

      <CodeBlock
        language="python"
        title="game/matrizes.rpy"
        code={`init python:
    # Identidade — ponto de partida
    M = Matrix.identity()

    # 1) escala em 1.5x
    # 2) gira 45°
    # 3) move 100px à direita
    M_completa = (
        Matrix.offset(100, 0, 0)
        * Matrix.rotate(0, 0, 45)
        * Matrix.scale(1.5, 1.5, 1.0)
    )

    # CUIDADO: a ordem é DA DIREITA PRA ESQUERDA na multiplicação
    # Isso significa: primeiro escala, depois rotaciona, depois translada.`}
      />

      <h2>3. Aplicando uma Matrix em um Transform</h2>
      <p>
        Em ATL, a propriedade <code>matrixtransform</code> aceita uma Matrix
        ou uma função que retorna Matrix. É assim que você injeta sua matriz
        manual no pipeline visual:
      </p>

      <CodeBlock
        language="python"
        title="game/transforms.rpy"
        code={`# Tilt 3D constante na xícara da Sakura
transform xicara_tilt:
    matrixtransform Matrix.rotate(15, 0, 0)

# Inclinação dinâmica em tempo de execução
transform xicara_tilt_dinamico(angulo):
    matrixtransform Matrix.rotate(angulo, 0, 0)

# Composta: gira no Y e dá um zoom
transform spin_e_zoom:
    matrixtransform (
        Matrix.rotate(0, 360, 0) * Matrix.scale(1.2, 1.2, 1)
    )
    linear 2.0 matrixtransform Matrix.identity()`}
      />

      <h2>4. Quando usar Matrix em vez de zoom/rotate/offset</h2>

      <CommandTable
        title="ATL puro vs Matrix manual"
        variations={[
          { cmd: "Rotação no plano 2D simples", desc: "Use 'rotate N' do ATL — mais simples.", output: "rotate 30" },
          { cmd: "Rotação no eixo X ou Y (3D)", desc: "Use Matrix.rotate(x, y, 0). ATL não rotaciona em X/Y.", output: "matrixtransform Matrix.rotate(15, 0, 0)" },
          { cmd: "Skew/Shear", desc: "ATL não tem. Use Matrix custom.", output: "Matrix(values) com termos não-diagonais." },
          { cmd: "Perspective em sprite individual", desc: "Stage 3D age na cena toda. Para 1 sprite use Matrix.perspective.", output: "matrixtransform Matrix.perspective(...)" },
          { cmd: "Composição de 5+ transformações em ordem específica", desc: "Multiplique uma vez, aplique uma vez. Performance > ATL.", output: "M = A * B * C * D * E" },
          { cmd: "Mesh deform (warp arbitrário)", desc: "Combinação Matrix + Model.", output: "model.add_mesh_to_render(...)" },
        ]}
      />

      <h2>5. Receita: card 3D girando (efeito menu)</h2>
      <p>
        Vamos animar uma "carta de receita" do café girando no eixo Y para
        revelar o verso. Isso é impossível só com ATL <code>rotate</code> (que
        é 2D). Precisamos de Matrix:
      </p>

      <CodeBlock
        language="python"
        title="game/transforms.rpy"
        code={`init python:
    def rotacao_y(angulo):
        return Matrix.rotate(0, angulo, 0)

transform card_flip:
    matrixtransform rotacao_y(0)
    linear 0.6 matrixtransform rotacao_y(90)
    # No meio da animação, troca a textura para o verso
    on flip:
        action SetField(carta, "frente", False)
    linear 0.6 matrixtransform rotacao_y(180)

label menu_receitas:
    show carta_cafe at card_flip
    pause 1.5
    return`}
      />

      <h2>6. Receita: parallax 3D no balcão do café</h2>

      <CodeBlock
        language="python"
        title="game/cena_balcao.rpy"
        code={`init python:
    def deslocamento_parallax(camada_z, mouse_x):
        # camadas próximas (z grande) movem mais que as distantes
        intensidade = camada_z / 100.0
        deslocamento = (mouse_x - 1280/2) * intensidade
        return Matrix.offset(deslocamento, 0, 0)

# Use em cada camada
transform camada_balcao:
    function lambda t, st: (deslocamento_parallax(20, renpy.get_mouse_pos()[0]), 0.016)

transform camada_parede:
    function lambda t, st: (deslocamento_parallax(2,  renpy.get_mouse_pos()[0]), 0.016)`}
      />

      <h2>7. Acessando elementos individuais</h2>
      <p>
        Você pode ler/usar elementos com <code>matrix.xdx</code>,{" "}
        <code>matrix.ydy</code>, etc. (formato <code>linha letra coluna</code>),
        ou via <code>matrix[i, j]</code>:
      </p>

      <CodeBlock
        language="python"
        title="game/inspecao.rpy"
        code={`init python:
    M = Matrix.scale(2, 3, 1)
    print(M.xdx)   # 2.0  (elemento [0,0])
    print(M.ydy)   # 3.0  (elemento [1,1])
    print(M[0, 3]) # 0.0  (translação X)`}
      />

      <Terminal
        path="~/sakura-cafe"
        lines={[
          {
            comment: "no console (Shift+O), inspeciona uma rotação composta",
            cmd: "Matrix.rotate(0, 0, 90) * Matrix.scale(2, 1, 1)",
            out: `Matrix(  0.0, -1.0, 0.0, 0.0,
        2.0,  0.0, 0.0, 0.0,
        0.0,  0.0, 1.0, 0.0,
        0.0,  0.0, 0.0, 1.0)`,
            outType: "info",
          },
        ]}
      />

      <h2>8. Pegadinha: ordem da multiplicação</h2>
      <p>
        Lembre: <code>A * B * v</code> aplica primeiro B em v, depois A.
        Trocar a ordem produz resultado <strong>diferente</strong>:
      </p>

      <OutputBlock label="diferença visual" type="warning">
{`SCALE(2)  *  ROTATE(45)   →  rotaciona, depois escala 2x  → ovo inclinado
ROTATE(45) *  SCALE(2)    →  escala 2x, depois rotaciona  → ovo grande inclinado
MATEMATICAMENTE diferente porque scale(2)*rotate(45) ≠ rotate(45)*scale(2).`}
      </OutputBlock>

      <PracticeBox
        title="Vire a placa do café (efeito flip horizontal)"
        goal="Animar a placa 'Sakura Café' fazendo flip de 360° no eixo Y, mostrando o verso aos 180°."
        steps={[
          "Crie image placa_frente e placa_verso (PNGs simples).",
          "Defina transform placa_flip que vai de Matrix.rotate(0,0,0) até Matrix.rotate(0,360,0) em 1.6s.",
          "Use uma função em init python para gerar a Matrix.rotate(0, ang, 0).",
          "No script, chame show placa_frente at placa_flip.",
          "Adicione lógica que troca para placa_verso quando ang > 90 e < 270.",
        ]}
        verify="A placa deve girar suavemente, parecendo uma placa real virando para mostrar o outro lado."
      >
        <CodeBlock
          language="python"
          title="game/placa.rpy (gabarito)"
          code={`init python:
    def rot_y(ang): return Matrix.rotate(0, ang, 0)

transform placa_flip:
    matrixtransform rot_y(0)
    linear 1.6 matrixtransform rot_y(360)
    repeat`}
        />
      </PracticeBox>

      <AlertBox type="warning" title="Requer GL2">
        <code>matrixtransform</code> e <code>Matrix.perspective</code> exigem
        que o renderer model-based esteja ativo (<code>config.gl2 = True</code>{" "}
        em <code>options.rpy</code>, padrão em Ren'Py 8+). Em GL legado, esses
        recursos são ignorados.
      </AlertBox>

      <OutputBlock label="cheat sheet — quando descer ao Matrix" type="info">
{`Use ATL puro    → Posição, escala, rotação Z, alpha, transições normais.
Use Matrix      → Rotação X/Y, perspective em 1 sprite, skew, mesh deform.
Composição      → A * B * C  (aplica C primeiro, depois B, depois A).
Aplicação       → matrixtransform M  (dentro de transform).`}
      </OutputBlock>

      <AlertBox type="success" title="Próximo passo">
        Para passar uma Matrix para um shader GLSL custom (uniform mat4), siga
        para <strong>Model-based Rendering</strong>. Lá você vê como conectar
        Matrix ↔ shader.
      </AlertBox>
    </PageContainer>
  );
}
