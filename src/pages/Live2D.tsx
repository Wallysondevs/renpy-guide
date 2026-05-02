import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Live2D() {
  return (
    <PageContainer
      title="Live2D Cubism — sprites animados de verdade"
      subtitle="Importar modelo .model3.json no Ren'Py 8.x: expressões, motions, lip-sync, física de cabelo. Substitua o sprite estático da Sakura por um Live2D que pisca, respira e reage à fala."
      difficulty="avancado"
      timeToRead="18 min"
      prompt="visual/live2d"
    >
      <AlertBox type="info" title="O que é Live2D no contexto de uma VN">
        <strong>Live2D Cubism</strong> é um formato de personagem em
        camadas 2D animáveis: cada parte (cabelo, olho, boca) tem
        deformadores que respondem a parâmetros (piscar, abrir boca,
        inclinar cabeça). Ren'Py 8.x suporta NATIVAMENTE arquivos{" "}
        <code>.model3.json</code> — você cola na pasta certa e ele vira um
        displayable como qualquer image.
      </AlertBox>

      <h2>1. Estrutura de arquivos esperada</h2>
      <p>
        O exportador do Cubism Editor cria uma pasta com vários arquivos.
        Ren'Py espera um <code>.model3.json</code> que aponta para
        textura(s), motion files e expressões.
      </p>

      <OutputBlock label="game/live2d/sakura/ — estrutura típica" type="info">
{`game/live2d/sakura/
├── sakura.model3.json          ← arquivo principal (aponta tudo)
├── sakura.moc3                 ← geometria binária
├── sakura.physics3.json        ← física (cabelo, peito balançando)
├── sakura.cdi3.json            ← display info (opcional)
├── textures/
│   ├── texture_00.png          ← atlas
│   └── texture_01.png
├── motions/
│   ├── idle.motion3.json       ← respirar (loop)
│   ├── feliz.motion3.json
│   ├── triste.motion3.json
│   └── corada.motion3.json
└── expressions/
    ├── piscar.exp3.json
    ├── boca_aberta.exp3.json
    └── corada.exp3.json`}
      </OutputBlock>

      <h2>2. Declarando o Live2D como image</h2>

      <CodeBlock
        language="python"
        title="game/live2d.rpy"
        code={`# Sintaxe básica: Live2D(caminho_pasta, base, **kwargs)
# - 'base' é a altura em pixels que o personagem ocupa na tela.
image sakura live2d = Live2D(
    "live2d/sakura",            # pasta com o .model3.json
    base=1.0,                   # 1.0 = altura da tela
    zoom=0.85,                  # ajuste fino
    loop=True,                  # idle motion em loop
    default_fade=0.5,           # crossfade entre motions
)

# Yuki — versão mais alta no enquadramento
image yuki live2d = Live2D(
    "live2d/yuki",
    base=1.0,
    zoom=0.9,
    loop=True,
    default_fade=0.4,
)`}
      />

      <h2>3. Trocando expressão e motion no script</h2>
      <p>
        Live2D usa <strong>atributos</strong> da imagem para escolher
        qual motion/expression tocar. O nome do atributo precisa bater
        com o do arquivo (sem extensão).
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label cena_live2d:
    scene bg cafe with fade

    # Mostra a Sakura idle (respirando)
    show sakura live2d at center with dissolve
    s "Olha que diferente! Eu pisco, respiro, balanço o cabelo."

    # Troca pra motion 'feliz' — atributo extra
    show sakura live2d feliz
    s "Quando você me responde algo legal, fico assim!"

    # Combina motion 'triste' com expression 'corada'
    show sakura live2d triste corada
    s "M-mas se você me elogia, eu fico envergonhada também..."

    # Volta ao idle (sem atributos extras)
    show sakura live2d
    s "Vamos pedir alguma coisa?"
    return`}
      />

      <h2>4. Properties do construtor — tabela</h2>

      <CommandTable
        title="Argumentos importantes do Live2D()"
        variations={[
          {
            cmd: 'path="live2d/sakura"',
            desc: "Pasta com o .model3.json. Pode ser relativa a game/ ou absoluta.",
            output: "Live2D(\"live2d/sakura\", ...)",
          },
          {
            cmd: "base=1.0",
            desc: "Fração da altura da tela ocupada pelo personagem (0.0-1.0).",
            output: "base=0.8 → personagem ocupa 80% da altura",
          },
          {
            cmd: "zoom=0.9",
            desc: "Escala adicional sobre o base. Útil p/ ajuste fino sem reescalar texturas.",
            output: "zoom=1.2 → 20% maior",
          },
          {
            cmd: "loop=True",
            desc: "Motion idle (primeira da lista) toca em loop infinito.",
            output: "loop=False → para no fim do motion",
          },
          {
            cmd: "default_fade=0.5",
            desc: "Crossfade entre motions, em segundos. Suaviza transição.",
            output: "default_fade=0.0 → corte seco",
          },
          {
            cmd: "fade=True",
            desc: "Aplica o default_fade automaticamente em show / hide.",
            output: "fade=False p/ controle manual via with",
          },
          {
            cmd: "aliases={'happy':'feliz'}",
            desc: "Mapeia atributos do script para nomes do .motion3.json.",
            output: "show sakura live2d happy → toca feliz.motion3.json",
          },
          {
            cmd: "motions=['idle', 'feliz']",
            desc: "Lista explícita de motions a registrar. SEM isso, todos da pasta são usados.",
            output: "Útil p/ economizar memória em modelos grandes",
          },
          {
            cmd: "nonexclusive=['piscar', 'respirar']",
            desc: "Motions que tocam SOBREPOSTOS ao motion principal (camadas).",
            output: "Permite piscar enquanto fala motion 'triste'",
          },
          {
            cmd: "seamless=['idle']",
            desc: "Motions sem fade no fim — encadeiam perfeitamente em loop.",
            output: "Idle de respiração sem 'pulinho' no loop",
          },
        ]}
      />

      <h2>5. Lip-sync — boca seguindo a voz</h2>
      <p>
        Para a boca abrir/fechar conforme a voz toca, o modelo precisa ter
        o parâmetro <code>ParamMouthOpenY</code> exposto. Ren'Py liga
        isso automaticamente se você usar o canal <code>"voice"</code>:
      </p>

      <CodeBlock
        language="python"
        title="game/live2d.rpy"
        code={`define s = Character(
    "Sakura",
    color="#ffaacc",
    image="sakura live2d",
    voice_tag="sakura",
)

# Liga lip-sync: amplitude da voice → ParamMouthOpenY
init python:
    renpy.live2d.lipsync = "voice"   # qualquer audio no canal voice mexe a boca

label cena_voz:
    scene bg cafe
    show sakura live2d at center
    voice "audio/voice/sakura_alo.ogg"
    s "Olha! Minha boca acompanha o áudio agora!"
    return`}
      />

      <h2>6. Motion fading e easing manual</h2>
      <p>
        Em momentos dramáticos, você quer controlar a transição motion-a-
        motion sem o fade padrão (que pode parecer abrupto):
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label revelacao_sakura:
    show sakura live2d feliz
    s "Eu tenho uma coisa importante pra te contar..."

    # Transição lenta de 1.5s entre 'feliz' e 'triste'
    show sakura live2d triste with Fade(1.5, 0, 0)

    s "É que... eu vou embora amanhã."

    # Crossfade explícito via expression overlay (corada NÃO substitui motion)
    show sakura live2d triste corada
    s "Mas pode ser que eu volte... se você me esperar."
    return`}
      />

      <h2>7. Hide com fade out</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`# hide live2d com fade out custom
hide sakura live2d with Dissolve(0.8)

# Para suprimir o motion idle quando ela não está em foco mas continua na tela:
show sakura live2d at Transform(alpha=0.4) zorder 1`}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        user="dev"
        host="vn-studio"
        lines={[
          {
            comment: "validar a pasta Live2D — lista motions e expressions encontrados",
            cmd: "renpy.sh . live2d_dump live2d/sakura",
            out: `Live2D model: live2d/sakura/sakura.model3.json
  Textures: 2 (texture_00.png, texture_01.png)
  Physics: sakura.physics3.json
  Motions detected:
    - idle (loops, 4.2s)
    - feliz (3.0s)
    - triste (3.5s)
    - corada (2.8s)
  Expressions:
    - piscar
    - boca_aberta
    - corada
  Parameters: 36 (incluindo ParamMouthOpenY → lipsync OK)`,
            outType: "success",
          },
          {
            comment: "erro típico: .moc3 ausente",
            cmd: "renpy.sh . lint",
            out: `live2d/sakura: file 'sakura.moc3' not found.
Live2D model could not be loaded.`,
            outType: "error",
          },
        ]}
      />

      <h2>8. Custos de performance</h2>

      <OutputBlock label="benchmarks reais (laptop i5 8GB, GPU integrada)" type="info">
{`1 modelo Live2D em idle           → 60 fps estável
2 modelos simultâneos             → 50-55 fps
3 modelos com lipsync ativo       → 40-45 fps
4+ modelos                        → 30 fps ou menos

MOBILE (Android mid-range, Snapdragon 7xx):
1 modelo                          → 50-60 fps
2 modelos                         → 35-45 fps
3+                                → não recomendado

CONCLUSÃO: para diálogo a 2 (Sakura + Yuki) use Live2D só na que está
falando ATIVAMENTE. A outra fica como sprite estático.`}
      </OutputBlock>

      <PracticeBox
        title="Sakura Live2D piscando e falando"
        goal="Importar um modelo Live2D em game/live2d/sakura/, declarar a image, mostrar com lipsync ativo durante 3 falas."
        steps={[
          "Coloque os arquivos do modelo (incluindo .moc3 e .model3.json) em game/live2d/sakura/.",
          "Em game/live2d.rpy declare image sakura live2d = Live2D('live2d/sakura', base=1.0, zoom=0.9, loop=True).",
          "Adicione renpy.live2d.lipsync = 'voice' em init python.",
          "Defina o Character s com image='sakura live2d' e voice_tag='sakura'.",
          "Em script.rpy, mostre 'show sakura live2d at center', toque voice e 3 falas.",
        ]}
        verify="Ao rodar a cena, a Sakura deve piscar sozinha (idle), respirar e mexer a boca durante a voice. Sem voice, idle continua sozinho."
      >
        <CodeBlock
          language="python"
          title="game/live2d.rpy (gabarito)"
          code={`init python:
    renpy.live2d.lipsync = "voice"

image sakura live2d = Live2D(
    "live2d/sakura",
    base=1.0,
    zoom=0.9,
    loop=True,
    default_fade=0.4,
)

define s = Character(
    "Sakura",
    color="#ffaacc",
    image="sakura live2d",
    voice_tag="sakura",
)

label start:
    scene bg cafe with fade
    show sakura live2d at center with dissolve
    voice "audio/voice/sakura_alo.ogg"
    s "Olá! Agora eu pisco e respiro de verdade!"
    voice "audio/voice/sakura_pedido.ogg"
    s "Quer pedir alguma coisa? Eu trago num instante."
    voice "audio/voice/sakura_obrigada.ogg"
    s "Obrigada por me visitar... volte sempre, tá?"
    return`}
        />
      </PracticeBox>

      <AlertBox type="warning" title="Licença do Cubism">
        Modelos Live2D criados no Cubism Editor têm{" "}
        <strong>licença gratuita até X visualizações/mês</strong>. Se sua
        VN passar do limite (verificar termos atuais da Live2D Inc.), você
        precisa de licença comercial. Sempre cheque antes de comercializar
        no Steam.
      </AlertBox>

      <AlertBox type="danger" title="Builds Web e Mobile">
        Live2D em build Web (HTML5) funciona MAS exige WebGL2 e
        baixa-performance em alguns navegadores móveis. Sempre teste no
        navegador alvo antes de prometer suporte. Em Android, embarque o
        APK com OBB se o modelo passar de 100MB.
      </AlertBox>

      <AlertBox type="success" title="Próximo passo">
        Personagem Live2D pronto. Para a abertura do jogo (logo "Sakura
        Café Studios" antes do menu) vá para <strong>Splashscreen</strong>.
      </AlertBox>
    </PageContainer>
  );
}
