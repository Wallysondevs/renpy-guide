import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function TextShaders() {
  return (
    <PageContainer
      title="Text Shaders — texto que tremula, brilha e glita"
      subtitle="Recurso do Ren'Py 8.3+: aplicar shaders GLSL diretamente em texto. wave, jitter, rainbow, glitch built-in + como criar shader custom para o título 'Sakura Café' tremular como pétalas ao vento."
      difficulty="avancado"
      timeToRead="15 min"
      prompt="visual/text-shaders"
    >
      <AlertBox type="info" title="Quando o Ren'Py adicionou isso">
        Text shaders chegaram no <strong>Ren'Py 8.3</strong> (2024). Antes,
        para fazer texto tremular você precisava de displayable customizado
        com Composite/ATL — feio e caro. Agora basta uma tag inline ou um
        shader registrado. Requer <code>config.gl2 = True</code> (que já é
        o padrão desde 8.0).
      </AlertBox>

      <h2>1. Os 4 shaders built-in</h2>

      <CommandTable
        title="Shaders de texto prontos para usar"
        variations={[
          { cmd: "{shader=text.wave}...{/shader}", desc: "Texto ondula em senoide vertical (como bandeira).", output: "{shader=text.wave}Sakura Café{/shader}" },
          { cmd: "{shader=text.jitter}...{/shader}", desc: "Cada caractere treme aleatoriamente (efeito ansiedade/medo).", output: "{shader=text.jitter}M-medo!{/shader}" },
          { cmd: "{shader=text.rainbow}...{/shader}", desc: "Hue rotativo nos caracteres (arco-íris animado).", output: "{shader=text.rainbow}LEVEL UP!{/shader}" },
          { cmd: "{shader=text.glitch}...{/shader}", desc: "Distorção tipo glitch CRT/TV antiga.", output: "{shader=text.glitch}ERR0R{/shader}" },
        ]}
      />

      <h2>2. Uso direto no diálogo</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label cena_emocoes:
    scene bg cafe with fade
    show sakura corada at center

    # Sakura nervosa — texto tremendo
    s "{shader=text.jitter}E-eu... eu não sei o que dizer...{/shader}"

    # Akira misterioso — glitch como se fosse uma IA
    show akira misterioso
    a "{shader=text.glitch}Sis-tema c-comprometido.{/shader}"

    # Sakura recebendo elogio — rainbow
    s "{shader=text.rainbow}OBRIGADA!!!{/shader}"

    # Texto do narrador balançando como bandeira
    "{shader=text.wave}O sino do café tocou suavemente.{/shader}"
    return`}
      />

      <h2>3. Aplicar globalmente em um Character</h2>

      <CodeBlock
        language="python"
        title="game/characters.rpy"
        code={`# Akira SEMPRE fala em glitch (personagem fantasma/IA)
define a = Character(
    "Akira",
    color="#9ecbff",
    what_prefix="{shader=text.glitch}",
    what_suffix="{/shader}",
)

# Sakura quando corada usa wave
define s_corada = Character(
    "Sakura",
    color="#ff66aa",
    what_prefix="{shader=text.wave}",
    what_suffix="{/shader}",
)`}
      />

      <h2>4. Parâmetros (uniforms) dos shaders built-in</h2>
      <p>
        Os shaders aceitam parâmetros via uniforms. Você passa após o nome
        do shader, separados por espaço:
      </p>

      <CommandTable
        title="Uniforms dos shaders built-in"
        variations={[
          { cmd: "text.wave u_amplitude=10.0", desc: "Amplitude da onda em pixels (default 4.0).", output: "{shader=text.wave u_amplitude=20.0}grande{/shader}" },
          { cmd: "text.wave u_frequency=2.0", desc: "Frequência da onda (Hz).", output: "u_frequency=0.5 → onda lenta" },
          { cmd: "text.jitter u_intensity=2.0", desc: "Intensidade do jitter (px máx).", output: "u_intensity=5.0 → tremor forte" },
          { cmd: "text.rainbow u_speed=1.5", desc: "Velocidade da rotação de hue.", output: "u_speed=0.3 → arco-íris devagar" },
          { cmd: "text.glitch u_density=0.3", desc: "Densidade de bandas glitch (0-1).", output: "u_density=0.8 → muito glitch" },
        ]}
      />

      <CodeBlock
        language="python"
        title="game/script.rpy — controle fino"
        code={`s "{shader=text.wave u_amplitude=12.0 u_frequency=1.5}sussurrando ao vento{/shader}"
a "{shader=text.glitch u_density=0.6}sis-sis-sistema falhando{/shader}"
"{shader=text.rainbow u_speed=2.0}NOVO RECORDE!{/shader}"`}
      />

      <h2>5. Criando shader custom — pétalas de Sakura</h2>
      <p>
        Aqui o pulo do gato: o título "Sakura Café" no menu principal
        tremular como se fossem pétalas ao vento. Vamos escrever um shader
        GLSL próprio:
      </p>

      <CodeBlock
        language="python"
        title="game/shaders.rpy"
        code={`init python:
    renpy.register_shader(
        "text.sakura_petals",

        # Variáveis de entrada (uniforms)
        variables="""
            uniform float u_time;
            uniform float u_intensity;
            uniform vec4 u_pink;
        """,

        # Vertex shader — desloca cada vértice em senoide
        vertex_300="""
            float wave_x = sin(u_time * 1.5 + a_position.y * 0.05) * u_intensity;
            float wave_y = cos(u_time * 2.0 + a_position.x * 0.03) * u_intensity * 0.5;
            gl_Position.x += wave_x;
            gl_Position.y += wave_y;
        """,

        # Fragment shader — mistura cor rosa pulsante
        fragment_300="""
            vec4 cor = gl_FragColor;
            float pulse = (sin(u_time * 1.2) + 1.0) * 0.5;
            cor.rgb = mix(cor.rgb, u_pink.rgb, pulse * 0.4);
            gl_FragColor = cor;
        """,
    )`}
      />

      <h2>6. Usando o shader custom</h2>

      <CodeBlock
        language="python"
        title="game/screens.rpy — título do menu"
        code={`screen main_menu():
    add "gui/main_menu_bg.png"

    text "Sakura Café":
        xalign 0.5 yalign 0.25
        size 96
        font "gui/fonts/SakuraScript.ttf"
        color "#ffffff"

        # Aplica nosso shader custom
        shader "text.sakura_petals"
        u_time time                   # 'time' é variável built-in
        u_intensity 8.0
        u_pink (1.0, 0.6, 0.7, 1.0)   # rosa em float (0-1)`}
      />

      <h2>7. Anatomia do shader: uniforms, vertex, fragment</h2>

      <OutputBlock label="estrutura de um text shader" type="info">
{`renpy.register_shader(
    "namespace.nome",

    variables = "uniform <tipo> <nome>;"
              + "uniform vec4 u_outro;"
              + ...

    vertex_300  = """ código GLSL ES 3.0 — roda por VÉRTICE """
    fragment_300= """ código GLSL ES 3.0 — roda por PIXEL    """

    # Opcionais para WebGL legacy
    vertex_30   = """ ... """
    fragment_30 = """ ... """
)

# Variáveis especiais que o Ren'Py preenche automaticamente:
#   u_time        → segundos desde início da cena
#   u_random      → vec4 com 4 floats aleatórios
#   u_lod_bias    → bias de mip-mapping
#   gl_Position   → posição do vértice (vertex)
#   gl_FragColor  → cor final do pixel (fragment)
#   v_tex_coord   → UV da textura no fragment`}
      </OutputBlock>

      <h2>8. Shader de hover (botões do café)</h2>

      <CodeBlock
        language="python"
        title="game/shaders.rpy"
        code={`init python:
    renpy.register_shader(
        "text.cafe_hover",
        variables="""
            uniform float u_time;
            uniform float u_active;
        """,
        fragment_300="""
            vec4 cor = gl_FragColor;
            float pulse = (sin(u_time * 4.0) + 1.0) * 0.5;
            cor.rgb += vec3(0.3, 0.1, 0.2) * pulse * u_active;
            gl_FragColor = cor;
        """,
    )

# Botão que pulsa rosa no hover
screen menu_pedido():
    textbutton "Pedir café":
        action Jump("pedir_cafe")
        text_shader "text.cafe_hover"
        text_u_time time
        text_u_active 0.0
        hover_text_u_active 1.0`}
      />

      <h2>9. Combinando shader com outras tags</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`# Shader + cor + tamanho
s "{size=+20}{color=#ff66aa}{shader=text.wave}Sakura Café{/shader}{/color}{/size}"

# Shader em parte do texto, resto normal
s "Bem-vindo ao {shader=text.rainbow}Sakura Café{/shader}, o melhor da cidade!"

# Aninhar shaders NÃO funciona — apenas o mais externo se aplica
# {shader=text.wave}{shader=text.jitter}NAO{/shader}{/shader}  ← ERRADO`}
      />

      <Terminal
        path="~/sakura-cafe"
        lines={[
          {
            comment: "lint detecta shader não registrado",
            cmd: "renpy.sh . lint",
            out: `game/script.rpy:18 The text shader 'text.borboleta' is not registered.
Make sure renpy.register_shader('text.borboleta', ...) is called in init python.
1 error reported.`,
            outType: "error",
          },
          {
            comment: "verificar versão do Ren'Py",
            cmd: "renpy.sh --version",
            out: "Ren'Py 8.3.7",
            outType: "success",
          },
        ]}
      />

      <PracticeBox
        title="Título 'Sakura Café' tremulando no menu"
        goal="Criar shader text.sakura_petals e aplicar no título do main_menu, com tempo animado e cor rosa pulsante."
        steps={[
          "Crie game/shaders.rpy com o renpy.register_shader('text.sakura_petals', ...) da seção 5.",
          "Em game/screens.rpy, dentro de screen main_menu(), substitua o text 'Sakura Café' pelo bloco da seção 6.",
          "Garanta config.gl2 = True em options.rpy.",
          "Rode 'renpy.sh . lint' — não deve ter erros.",
          "Rode o jogo e observe o título do menu se mexendo suavemente.",
        ]}
        verify="O título 'Sakura Café' do menu principal balança continuamente como se fossem pétalas no vento, com leve pulsar rosa."
      >
        <CodeBlock
          language="python"
          title="game/shaders.rpy + screens.rpy"
          code={`# game/shaders.rpy
init python:
    renpy.register_shader(
        "text.sakura_petals",
        variables="""
            uniform float u_time;
            uniform float u_intensity;
            uniform vec4 u_pink;
        """,
        vertex_300="""
            gl_Position.x += sin(u_time * 1.5 + a_position.y * 0.05) * u_intensity;
            gl_Position.y += cos(u_time * 2.0 + a_position.x * 0.03) * u_intensity * 0.5;
        """,
        fragment_300="""
            vec4 cor = gl_FragColor;
            float pulse = (sin(u_time * 1.2) + 1.0) * 0.5;
            cor.rgb = mix(cor.rgb, u_pink.rgb, pulse * 0.4);
            gl_FragColor = cor;
        """,
    )

# game/screens.rpy (dentro do main_menu)
text "Sakura Café":
    xalign 0.5 yalign 0.25 size 96 color "#fff"
    font "gui/fonts/SakuraScript.ttf"
    shader "text.sakura_petals"
    u_time time
    u_intensity 8.0
    u_pink (1.0, 0.6, 0.7, 1.0)`}
        />
      </PracticeBox>

      <AlertBox type="warning" title="Compatibilidade Web/Mobile">
        Shaders de texto exigem WebGL 2.0 no build Web e OpenGL ES 3.0 no
        Android. Cobertura é &gt;95% em 2025, mas para builds antigos
        adicione fallbacks com <code>vertex_30</code>/<code>fragment_30</code>.
        Em iOS funciona via Angle desde Ren'Py 8.2.
      </AlertBox>

      <AlertBox type="success" title="Por que isso é game-changer">
        Antes você precisava criar 50 frames PNG de "Sakura Café" tremulando
        e exibir como Movie — pesava 4MB e travava. Agora 1 string + 20
        linhas GLSL e roda nativamente na GPU em 60fps mesmo no celular
        básico.
      </AlertBox>
    </PageContainer>
  );
}
