import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Personagens() {
  return (
    <PageContainer
      title="Personagens — define Character()"
      subtitle="Como criar personagens com nome estilizado, cor de fala, prefixo/sufixo, integração com sprites (image attribute), voz por personagem (voice_tag), callbacks e o personagem narrador."
      difficulty="iniciante"
      timeToRead="13 min"
      prompt="linguagem/personagens"
    >
      <AlertBox type="info" title="Personagens são objetos Python">
        Quando você escreve <code>define s = Character("Sakura")</code>{" "}
        está criando um objeto Python da classe{" "}
        <code>Character</code>. A engine usa esse objeto para saber como
        renderizar o nome, qual cor aplicar, quem está falando para fins
        de save/skip e qual sprite mostrar automaticamente.
      </AlertBox>

      <h2>1. O Character mais simples</h2>
      <p>
        A linha mínima para registrar uma personagem precisa de só um
        argumento: o nome que aparece no namebox. Convenção: variável
        com 1 ou 2 letras (ex: <code>s</code> de Sakura,{" "}
        <code>yk</code> de Yuki) para deixar o roteiro limpo.
      </p>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`# Bloco de definições — costuma ficar no topo do script.rpy
define s  = Character("Sakura", color="#ffaacc")
define yk = Character("Yuki",   color="#a0d8ff")
define ak = Character("Akira",  color="#c8a2ff")
define hn = Character("Hana",   color="#ffd27f")
define mei = Character("Mei",   color="#ff9f9f")

# O 'narrador' é um Character vazio: as falas sem variável usam ele.
# Você pode customizar o estilo dele em init python:
# define narrator = Character(None, what_italic=True)

label start:
    "O sol nascia sobre a praça em frente ao café." # narrador
    s "Bom dia! Já vou abrir as portas, viu?"        # Sakura
    yk "Não esquece de acender o forno, Sakura."     # Yuki
    return
`}
      />

      <h2>2. Propriedades visuais — cor, prefixo, sufixo</h2>
      <CommandTable
        title="Argumentos visuais do Character()"
        variations={[
          { cmd: 'color="#ffaacc"', desc: "Cor do NOME no namebox.", output: "Aceita qualquer hex válido." },
          { cmd: 'what_color="#fff"', desc: "Cor do TEXTO da fala.", output: "Default: cor padrão da gui." },
          { cmd: 'what_prefix="— "', desc: "Texto colado ANTES de toda fala desse personagem.", output: "— Bom dia, Yuki." },
          { cmd: 'what_suffix=" ♥"', desc: "Texto ao FINAL de toda fala. Bom para tics verbais.", output: "Bom dia, Yuki ♥" },
          { cmd: 'what_italic=True', desc: "Renderiza toda fala em itálico (ótimo p/ pensamentos).", output: "(itálico)" },
          { cmd: 'what_bold=True', desc: "Renderiza toda fala em negrito.", output: "(negrito)" },
          { cmd: 'what_size=22', desc: "Tamanho fixo de fonte para esse personagem.", output: "(maior/menor)" },
          { cmd: 'window_background="gui/textbox_red.png"', desc: "Troca o textbox quando ESSE personagem fala.", output: "Útil p/ vilão." },
          { cmd: 'kind=nvl', desc: "Faz esse personagem usar modo NVL (tela cheia).", output: "Ver página NVL." },
        ]}
      />

      <CodeBlock
        title="game/script.rpy — variantes visuais"
        language="python"
        code={`# Personagem misterioso: nome em "???" e fala em itálico
define misterioso = Character(
    "???",
    color="#888888",
    what_italic=True,
    what_color="#cccccc",
)

# Pensamento interno do(a) protagonista — sem nome, em itálico
define pensamento = Character(
    None,
    what_italic=True,
    what_prefix="(",
    what_suffix=")",
)

# Personagem com tique verbal — sempre termina com "nya~"
define neko = Character("Neko-chan", color="#ffb3d9", what_suffix=" nya~")

label exemplo:
    misterioso "Eu já te vi antes... em algum lugar."
    pensamento "Por que essa voz me parece familiar?"
    neko "Quer almoçar comigo?"
    return
`}
      />

      <h2>3. image attribute — sprite muda com a fala</h2>
      <p>
        Esta é a feature MAIS poderosa do Character. Quando você passa{" "}
        <code>image="sakura"</code>, qualquer atributo extra após a
        variável da fala é interpretado como atributo da imagem. A
        engine sozinha faz <code>show sakura happy</code> quando você
        escreve <code>s happy "Olá!"</code>.
      </p>

      <CodeBlock
        title="game/script.rpy — image attribute em ação"
        language="python"
        code={`# Define os sprites
image sakura happy = "images/sakura_happy.png"
image sakura sad   = "images/sakura_sad.png"
image sakura angry = "images/sakura_angry.png"

# Personagem amarrado ao tag 'sakura'
define s = Character("Sakura", color="#ffaacc", image="sakura")

label cena:
    scene bg cafe
    show sakura happy at center

    # Sem atributo: mantém o sprite atual
    s "Bem-vindo!"

    # 'sad' é interpretado como atributo: troca para sakura sad
    s sad "Mas... o forno quebrou hoje."

    # Volta para feliz
    s happy "Felizmente o conserto chega amanhã!"

    # Mais de um atributo: combinados na ordem
    s angry "Quem deixou a porta aberta?!"
    return
`}
      />

      <AlertBox type="success" title="Por que isso é maravilhoso">
        Sem <code>image attribute</code>, você precisaria escrever{" "}
        <code>show sakura sad</code> antes de cada linha. Em VNs longas,
        isso polui o roteiro. Com a feature, o tradutor só lê falas
        limpas e a expressão segue o texto.
      </AlertBox>

      <h2>4. voice_tag — dublagem por personagem</h2>
      <p>
        Defina <code>voice_tag</code> para que cada personagem tenha um{" "}
        <em>canal de voz</em> separado. Isso permite ajustar o volume da
        Sakura sem mexer na voz do Akira, e tocar uma voz nova
        interrompendo apenas a do mesmo personagem.
      </p>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`define s = Character("Sakura", color="#ffaacc",
                    voice_tag="sakura_voice")
define ak = Character("Akira", color="#c8a2ff",
                      voice_tag="akira_voice")

label cena:
    voice "voice/sakura_001.ogg"
    s "Bom dia!"

    voice "voice/akira_001.ogg"
    ak "Bom dia. Hoje vai estar lotado."

    # Mute APENAS a voz da Sakura no menu de áudio
    return
`}
      />

      <h2>5. callback — reagir a quem fala</h2>
      <p>
        Cada personagem pode disparar uma função Python a cada evento
        (começo da fala, fim, mostrar nome, etc). Útil para auto-history,
        contagem de falas, ou efeitos sonoros customizados.
      </p>

      <CodeBlock
        title="game/script.rpy — callback de personagem"
        language="python"
        code={`init python:
    falas_sakura = 0

    def callback_sakura(event, **kwargs):
        global falas_sakura
        if event == "begin":
            falas_sakura += 1

define s = Character("Sakura", color="#ffaacc",
                    callback=callback_sakura)

label final:
    "A Sakura falou [falas_sakura] vezes nessa rota."
    return
`}
      />

      <h2>6. ConfigurationCenter — narrador, MC, ADV vs NVL</h2>
      <CommandTable
        title="Padrões de Character() para personagens especiais"
        variations={[
          { cmd: 'Character(None)', desc: "Narrador — sem namebox.", output: 'narrator = Character(None)' },
          { cmd: 'Character("[player_name]")', desc: "Nome dinâmico (interpolado da variável).", output: "Use quando o jogador digita o próprio nome." },
          { cmd: 'Character(None, what_italic=True)', desc: "Pensamento — narrador em itálico.", output: "thought = Character(None, what_italic=True)" },
          { cmd: 'Character("Eu", color="#ffffff")', desc: "Protagonista falando em primeira pessoa.", output: "mc = Character('Eu')" },
          { cmd: 'Character("???", what_italic=True)', desc: "Personagem ainda não revelado.", output: "Trocar para nome real depois." },
          { cmd: 'Character(kind=nvl)', desc: "Diálogo em modo NVL (full screen).", output: "Para narração longa." },
          { cmd: 'Character("Sistema", color="#00ff88", window_background=Solid("#000c"))', desc: "Mensagem de sistema com textbox próprio.", output: "Útil para pop-ups in-universe." },
        ]}
      />

      <h2>7. Trocando o nome de um personagem mid-game</h2>
      <p>
        Cenário clássico: o jogador descobre o nome real do personagem
        misterioso. Use uma variável Python no nome do Character e
        atualize-a com <code>$</code>.
      </p>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`default akira_nome = "???"

define ak = Character("[akira_nome]", color="#c8a2ff")

label revelacao:
    ak "Eu não devia te dizer..."
    ak "Mas meu nome é Akira."
    $ akira_nome = "Akira"
    ak "Agora você sabe."
    return
`}
      />

      <h2>8. Validação com lint</h2>
      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "lint avisa se você usar uma fala de personagem não definido",
            cmd: "renpy.exe . lint",
            out: `game/script.rpy:88 'sk' is not a defined name. Did you mean to use 's'?
1 error reported.`,
            outType: "error",
          },
          {
            comment: "todos definidos corretamente",
            cmd: "renpy.exe . lint",
            out: `Statistics:
  Defined characters: 5 (s, yk, ak, hn, mei)
  Defined images: 38
Lint took 0.27 seconds.`,
            outType: "success",
          },
        ]}
      />

      <OutputBlock label="anatomia visual de uma linha de fala" type="info">
{`    s     happy         "Bem-vindo ao Sakura Café!"
    │      │              │
    │      │              └── string da fala
    │      └── atributo da imagem (combina com 'image=sakura')
    └── variável do Character() definida com 'define'`}
      </OutputBlock>

      <PracticeBox
        title="Defina 3 personagens com cores e expressões"
        goal="Criar Sakura, Yuki e Akira com cores distintas, image attribute, e escrever uma cena onde cada um troca de expressão pelo menos uma vez."
        steps={[
          "Abra game/script.rpy.",
          "No topo, defina os 3 Characters com 'image=' apontando para o tag respectivo.",
          "Defina pelo menos 2 expressões por personagem (ex: sakura happy, sakura sad).",
          "Crie um label 'cena_apresentacao' com scene bg, show inicial e 6 falas alternando os personagens.",
          "Use atributos inline (s sad \"...\") em pelo menos 2 falas.",
          "Rode renpy.exe . lint e corrija qualquer aviso.",
        ]}
        verify="Ao jogar, as expressões devem trocar automaticamente quando você usa o atributo, sem precisar de show explícito."
      >
        <CodeBlock
          title="game/script.rpy (gabarito)"
          language="python"
          code={`define s  = Character("Sakura", color="#ffaacc", image="sakura")
define yk = Character("Yuki",   color="#a0d8ff", image="yuki")
define ak = Character("Akira",  color="#c8a2ff", image="akira")

image sakura happy = "images/sakura_happy.png"
image sakura sad   = "images/sakura_sad.png"
image yuki happy   = "images/yuki_happy.png"
image yuki angry   = "images/yuki_angry.png"
image akira calm   = "images/akira_calm.png"
image akira surprised = "images/akira_surprised.png"

label cena_apresentacao:
    scene bg cafe with fade
    show sakura happy at left
    show yuki happy at center
    show akira calm at right with dissolve

    s "Bem-vindos! Sentem-se onde quiserem."
    yk "Hoje a fila ta gigante, hein."
    ak calm "Eu vim só pelo café gelado."
    s sad "O café gelado acabou..."
    yk angry "Eu AVISEI pra repor desde ontem!"
    ak surprised "Sério??"
    return
`}
        />
      </PracticeBox>

      <AlertBox type="warning" title="Não use acento na variável">
        Variáveis Python (e portanto Characters) não aceitam acentos nem
        caracteres especiais. Use <code>akira</code>, não{" "}
        <code>akirá</code>. O nome EXIBIDO pode ter qualquer caractere
        UTF-8: <code>Character("Akirá", ...)</code> funciona perfeitamente.
      </AlertBox>
    </PageContainer>
  );
}
