import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function ModelRendering() {
  return (
    <PageContainer
      title="Model-based Rendering — shaders, mesh e uniforms"
      subtitle="Quando ATL e Matrix não bastam, desça para o pipeline GL2: escreva shaders GLSL, defina meshes e injete uniforms para criar efeitos próprios — distorção da fumaça da xícara, ondulação na janela do café, água cintilante."
      difficulty="avancado"
      timeToRead="18 min"
      prompt="grafico/model-rendering"
    >
      <AlertBox type="info" title="O que é model-based rendering">
        Desde Ren'Py 7.4, existe um renderer alternativo (ativo por padrão a
        partir do 8.0) chamado <strong>model-based</strong>, baseado em
        OpenGL ES 2.0 / WebGL. Ele expõe um pipeline programável onde você
        pode <strong>escrever shaders GLSL</strong>, alterar a{" "}
        <strong>mesh</strong> (geometria) de qualquer displayable e passar{" "}
        <strong>uniforms</strong> (variáveis para o shader). É o que permite
        os efeitos cinematográficos modernos sem mexer em C.
      </AlertBox>

      <h2>1. Ativando GL2 e checando suporte</h2>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`# Em projetos novos isso já vem assim
init python:
    config.gl2 = True

    # Forçar fallback (debug):
    # config.gl2 = False
    # config.renderer = "gl"`}
      />

      <Terminal
        path="~/sakura-cafe"
        lines={[
          {
            comment: "Verifica em runtime qual renderer está ativo",
            cmd: "renpy.get_renderer_info()",
            out: `{'renderer': 'gl2',
 'resizable': True,
 'additive': True,
 'model': True}`,
            outType: "success",
          },
        ]}
      />

      <h2>2. Shaders padrão que já vêm prontos</h2>
      <p>
        Ren'Py traz alguns shaders embutidos que você ativa só pedindo. Use
        a propriedade <code>shader</code> do transform com o nome do shader.
      </p>

      <CommandTable
        title="Shaders nativos (sem precisar escrever GLSL)"
        variations={[
          { cmd: 'shader "renpy.alpha"', desc: "Aplica alpha multiplicativo (já implícito).", output: "—" },
          { cmd: 'shader "renpy.matrixcolor"', desc: "Aplica matrixcolor via shader (mais rápido).", output: "—" },
          { cmd: 'shader "renpy.solid"', desc: "Cor sólida.", output: "—" },
          { cmd: 'shader "renpy.dissolve"', desc: "Transição dissolve baseada em mapa.", output: "Usado por Dissolve()." },
          { cmd: 'shader "renpy.imagedissolve"', desc: "Dissolve com máscara animada.", output: "Usado por ImageDissolve." },
          { cmd: 'shader "renpy.blur"', desc: "Blur gaussiano.", output: "blur 5" },
          { cmd: 'shader "renpy.flatten"', desc: "Renderiza em texture intermediária (cache).", output: "Para combinar shaders." },
        ]}
      />

      <h2>3. Anatomia de um shader custom</h2>
      <p>
        Um shader Ren'Py é um par <strong>vertex shader</strong> + {" "}
        <strong>fragment shader</strong> em GLSL ES 1.0, registrado via{" "}
        <code>renpy.register_shader()</code> em <code>init python early</code>.
      </p>

      <CodeBlock
        language="python"
        title="game/shaders/wave.rpy"
        code={`init python early:
    renpy.register_shader("cafe.fumaca", variables="""
        uniform sampler2D tex0;
        uniform float u_time;
        uniform float u_amp;
        attribute vec2 a_tex_coord;
        varying vec2 v_tex_coord;
    """, vertex_300="""
        v_tex_coord = a_tex_coord;
    """, fragment_300="""
        vec2 uv = v_tex_coord;
        // distorção horizontal senoidal — fumaça subindo
        uv.x += sin(uv.y * 20.0 + u_time * 3.0) * u_amp;
        gl_FragColor = texture2D(tex0, uv);
    """)`}
      />

      <p>
        Os campos <code>vertex_300</code> e <code>fragment_300</code> são
        snippets que o Ren'Py injeta dentro de um <code>main()</code>{" "}
        gerado. As <code>variables</code> declaram <code>uniform</code>,
        <code>attribute</code> e <code>varying</code> em GLSL.
      </p>

      <h2>4. Aplicando o shader em um transform</h2>

      <CodeBlock
        language="python"
        title="game/transforms.rpy"
        code={`transform fumaca_xicara(amp=0.01):
    shader "cafe.fumaca"
    u_amp amp
    u_time 0.0
    function lambda t, st: (renpy.restart_interaction() or 0.016)
    # 'function' avança u_time a cada frame:
    u_time st`}
      />

      <p>
        Tudo que começa com <code>u_</code>, <code>a_</code> ou{" "}
        <code>v_</code> dentro de um transform vira parâmetro do shader.
        Use o nome literal das uniforms.
      </p>

      <h2>5. Receita: water-distortion na xícara fumegante</h2>

      <CodeBlock
        language="python"
        title="game/shaders/agua.rpy"
        code={`init python early:
    renpy.register_shader("cafe.agua", variables="""
        uniform sampler2D tex0;
        uniform float u_time;
        uniform vec2  u_intensidade;
        attribute vec2 a_tex_coord;
        varying vec2 v_tex_coord;
    """, vertex_300="""
        v_tex_coord = a_tex_coord;
    """, fragment_300="""
        vec2 uv = v_tex_coord;
        uv.x += sin(uv.y * 12.0 + u_time * 1.4) * u_intensidade.x;
        uv.y += cos(uv.x * 10.0 + u_time * 1.1) * u_intensidade.y;
        gl_FragColor = texture2D(tex0, uv);
    """)

transform xicara_quente:
    shader "cafe.agua"
    u_intensidade (0.008, 0.004)
    u_time 0.0
    linear 100.0 u_time 100.0   # tempo monotônico
    repeat

label cena_xicara:
    scene bg cafe
    show xicara_cha at xicara_quente:
        xalign 0.7 yalign 0.6 zoom 0.5
    "Sakura sopra a xícara, vendo o vapor desenhar redemoinhos no ar."
    return`}
      />

      <h2>6. Mesh — quando o quad padrão não basta</h2>
      <p>
        Por padrão todo displayable é um quad (4 vértices). Para efeitos como
        bandeira ondulando ou dobra de papel, você precisa de mais vértices.
        Use <code>mesh True</code> ou <code>mesh (cols, rows)</code>:
      </p>

      <CodeBlock
        language="python"
        title="game/transforms.rpy"
        code={`transform bandeira_vento:
    mesh (10, 6)         # subdividir em 10x6 quadrados
    shader "cafe.fumaca"
    u_amp 0.02
    u_time 0.0
    linear 60.0 u_time 60.0
    repeat`}
      />

      <h2>7. Listando uniforms reservados do Ren'Py</h2>

      <CommandTable
        title="Uniforms automáticas (não precisa setar)"
        variations={[
          { cmd: "u_lod_bias", desc: "Bias de LOD para texturas mipmapped.", output: "" },
          { cmd: "u_time", desc: "Tempo (em segundos) — só se você declarar.", output: "Você ainda precisa atualizar via transform." },
          { cmd: "u_random", desc: "vec4 aleatório por frame.", output: "" },
          { cmd: "u_renpy_dissolve", desc: "Progresso 0.0-1.0 em transições.", output: "" },
          { cmd: "u_model", desc: "Matriz model.", output: "" },
          { cmd: "u_view", desc: "Matriz view.", output: "" },
          { cmd: "u_projection", desc: "Matriz projection.", output: "" },
          { cmd: "tex0, tex1, tex2", desc: "Texturas de entrada (sampler2D).", output: "tex0 sempre é a imagem do displayable." },
        ]}
      />

      <h2>8. Composição: vários shaders no mesmo displayable</h2>

      <CodeBlock
        language="python"
        title="game/transforms.rpy"
        code={`# Encadeie shaders separados por espaço
transform combinado:
    shader [ "renpy.blur", "cafe.fumaca" ]
    blur 2.0
    u_amp 0.01
    u_time 0.0
    linear 60.0 u_time 60.0
    repeat`}
      />

      <h2>9. Debug — Shift+I e console</h2>

      <Terminal
        path="~/sakura-cafe"
        lines={[
          {
            comment: "Em runtime, lista todos shaders registrados (Shift+O)",
            cmd: "list(renpy.gl2.shader.shaders.keys())",
            out: `['renpy.alpha', 'renpy.solid', 'renpy.matrixcolor',
 'renpy.dissolve', 'renpy.imagedissolve', 'renpy.blur',
 'renpy.flatten', 'cafe.fumaca', 'cafe.agua']`,
            outType: "info",
          },
          {
            comment: "Logar erros de compilação GLSL no log.txt",
            cmd: "tail -n 30 game/log.txt",
            out: `Compiling shader cafe.agua...
GLSL compile error in fragment shader:
ERROR: 0:7: 'undeclared identifier' : u_amp`,
            outType: "error",
          },
        ]}
      />

      <PracticeBox
        title="Shader pulsante de cor para o título Sakura Café"
        goal="Criar um shader que oscila a saturação do título entre 0.6 e 1.2 ao longo do tempo, dando um efeito 'respirando'."
        steps={[
          "Em init python early registre 'cafe.pulse' com fragment_300 que recebe u_time e ajusta cor.",
          "Use a fórmula: cor.rgb *= 1.0 + sin(u_time * 2.0) * 0.2.",
          "Crie transform titulo_pulse com shader cafe.pulse, u_time 0.0, linear 100.0 u_time 100.0, repeat.",
          "Aplique no logo do menu principal: add 'logo.png' at titulo_pulse.",
          "Rode o jogo e vá ao menu — o logo deve respirar suavemente.",
        ]}
        verify="O título oscila visualmente em saturação/brilho com período de ~3s, sem quebrar performance."
      >
        <CodeBlock
          language="python"
          title="game/shaders/pulse.rpy (gabarito)"
          code={`init python early:
    renpy.register_shader("cafe.pulse", variables="""
        uniform sampler2D tex0;
        uniform float u_time;
        attribute vec2 a_tex_coord;
        varying vec2 v_tex_coord;
    """, vertex_300="""
        v_tex_coord = a_tex_coord;
    """, fragment_300="""
        vec4 c = texture2D(tex0, v_tex_coord);
        float k = 1.0 + sin(u_time * 2.0) * 0.2;
        gl_FragColor = vec4(c.rgb * k, c.a);
    """)

transform titulo_pulse:
    shader "cafe.pulse"
    u_time 0.0
    linear 100.0 u_time 100.0
    repeat`}
        />
      </PracticeBox>

      <AlertBox type="warning" title="Pegadinhas comuns">
        <p>
          1. <strong>Esqueceu o varying:</strong> Sem{" "}
          <code>varying vec2 v_tex_coord</code> declarado nas{" "}
          <code>variables</code>, o vertex shader não passa coordenada de
          textura — você verá uma textura preta.
        </p>
        <p>
          2. <strong>Web build:</strong> WebGL é mais restrito que GL
          desktop. Sempre teste seu shader no build Web também.
        </p>
        <p>
          3. <strong>Performance:</strong> Cada shader custom adiciona um
          draw call e um pass. Combine quando possível usando{" "}
          <code>renpy.flatten</code>.
        </p>
      </AlertBox>

      <OutputBlock label="cheat sheet — model rendering" type="info">
{`ATIVAR     config.gl2 = True
REGISTRAR  init python early: renpy.register_shader("ns.nome", variables=, vertex_300=, fragment_300=)
USAR       transform x: shader "ns.nome"; u_var valor
TIME       u_time 0.0   →   linear 100.0 u_time 100.0   →   repeat
MESH       mesh (cols, rows) — só quando precisa de geometria fina
DEBUG      Shift+I (style inspector), log.txt para erros de compilação`}
      </OutputBlock>

      <AlertBox type="success" title="Próximo passo">
        Você dominou o pipeline gráfico. Agora vamos para a página{" "}
        <strong>Outras Funções Úteis</strong> com 20+ utilitários do{" "}
        <code>renpy.*</code> que aparecem em código real.
      </AlertBox>
    </PageContainer>
  );
}
