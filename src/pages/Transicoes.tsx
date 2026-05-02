import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Transicoes() {
  return (
    <PageContainer
      title="Transições — with, dissolve, fade e companhia"
      subtitle="Como suavizar trocas de cena e sprite com transitions integradas, customizar tempos e criar suas próprias com Dissolve(), Fade() e ImageDissolve()."
      difficulty="intermediario"
      timeToRead="14 min"
      prompt="visual/transicoes"
    >
      <AlertBox type="info" title="O que é uma transition">
        Uma <strong>transition</strong> é uma animação curta que liga dois
        estados visuais — antes/depois de um <code>scene</code>,{" "}
        <code>show</code> ou <code>hide</code>. Sem ela, a troca é um corte
        seco; com ela, a cena respira. O statement central é{" "}
        <code>with &lt;nome&gt;</code>.
      </AlertBox>

      <h2>1. Sintaxe — duas formas equivalentes</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label intro:
    # Forma 1 — statement 'with' em linha separada
    scene bg cafe
    show sakura feliz
    with dissolve

    s "Forma 1: aplica a transição às MUDANÇAS desde o último 'with'."

    # Forma 2 — sufixo 'with' na mesma linha
    scene bg parque with fade
    show sakura uniforme with dissolve

    s "Forma 2: aplica APENAS a esta operação."
    return`}
      />

      <AlertBox type="warning" title="Cuidado: 'with' em linha separada agrupa">
        Quando você escreve <code>scene</code> e <code>show</code> seguidos
        e depois <code>with dissolve</code>, a transição é aplicada às DUAS
        operações como uma só. Se quiser que cada uma tenha seu próprio
        ritmo, use o sufixo <code>with</code> em cada linha.
      </AlertBox>

      <h2>2. Transitions integradas no Ren'Py</h2>

      <CommandTable
        title="As 16 transitions que vêm de fábrica"
        variations={[
          { cmd: "fade", desc: "Escurece p/ preto, depois revela. Padrão para mudanças bruscas.", output: "Duração ~1s — boa p/ trocar capítulo." },
          { cmd: "dissolve", desc: "Crossfade simples — uma imagem some enquanto a outra aparece.", output: "Duração 0.5s — uso geral." },
          { cmd: "pixellate", desc: "Pixelização crescente, depois decresce na nova imagem.", output: "Estilo retrô / TV antiga." },
          { cmd: "hpunch", desc: "Sacode horizontalmente — efeito de soco.", output: "Bom para impacto narrativo." },
          { cmd: "vpunch", desc: "Sacode verticalmente.", output: "Para terremoto / tropeção." },
          { cmd: "blinds", desc: "Persiana horizontal abre/fecha.", output: "Estilo apresentação." },
          { cmd: "squares", desc: "Quadradinhos animam a transição.", output: "Estilo Sega Genesis." },
          { cmd: "wipeleft", desc: "Cortina varre da direita p/ a esquerda.", output: "Slide horizontal." },
          { cmd: "wiperight", desc: "Cortina varre da esquerda p/ a direita.", output: "Slide horizontal inverso." },
          { cmd: "wipeup / wipedown", desc: "Cortina varre verticalmente.", output: "Bom p/ revelar de baixo." },
          { cmd: "slideleft", desc: "Imagem nova entra deslizando da direita.", output: "Cinemático." },
          { cmd: "slideright", desc: "Imagem nova entra deslizando da esquerda.", output: "" },
          { cmd: "slideup / slidedown", desc: "Slides verticais.", output: "" },
          { cmd: "moveinleft", desc: "Sprite ENTRA deslizando da esquerda (use em show).", output: "Para personagem que entra em cena." },
          { cmd: "moveinright", desc: "Sprite ENTRA deslizando da direita.", output: "" },
          { cmd: "moveoutleft / moveoutright", desc: "Sprite SAI deslizando (use em hide).", output: "Para personagem que vai embora." },
        ]}
      />

      <h2>3. Customizando tempo — Dissolve, Fade, MoveTransition</h2>
      <p>
        As transitions de fábrica são instâncias prontas de classes. Você
        pode criar variantes com tempos próprios:
      </p>

      <CodeBlock
        language="python"
        title="game/transitions.rpy"
        code={`# Crossfade lento de 2 segundos
define dissolve_lento = Dissolve(2.0)

# Crossfade super rápido de 0.15s
define dissolve_flash = Dissolve(0.15)

# Fade pra preto que demora 1.5s indo + 1.5s voltando, com 0.5s parado no preto
define fade_dramatico = Fade(1.5, 0.5, 1.5)

# Fade pra branco (flashback)
define fade_branco = Fade(0.6, 0.2, 0.6, color="#fff")

# Movimento custom — sprites se reorganizam em 1.2s
define mover_devagar = MoveTransition(1.2)

# Pixelização configurável (steps, duração)
define pixel_pesado = Pixellate(1.0, 8)

# ImageDissolve — usa uma máscara em escala de cinza para definir o padrão
define dissolve_floral = ImageDissolve("images/transitions/floral_mask.png", 1.5)`}
      />

      <CodeBlock
        language="python"
        title="game/script.rpy — usando os customs"
        code={`label flashback:
    # Flash branco para indicar lembrança
    scene bg quarto noite
    with fade_branco

    s "...lembrei."

    # Mistura floral suave para cena de memória
    scene bg parque
    with dissolve_floral

    s "Aquele dia no parque... eu estava com a Sakura."

    # Volta ao presente — corte pixelizado
    scene bg cafe
    with pixel_pesado
    return`}
      />

      <h2>4. <code>with None</code> — desfazer transition pendente</h2>

      <p>
        Às vezes você quer fazer uma série de mudanças invisíveis e só
        depois transicionar para o resultado final. Use <code>with None</code>
        para "limpar" o estado pendente:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label montagem_cena:
    # Tudo isso acontece SEM transition individual
    scene bg cafe
    show sakura uniforme at left
    show yuki neutra at center
    show akira misterioso at right
    with None  # registra o estado mas não anima

    # Agora aplica UMA transition para todo o conjunto
    with dissolve

    s "Cheguei e encontrei todo mundo aqui!"
    return`}
      />

      <h2>5. Transitions específicas de canal</h2>

      <CommandTable
        title="Aplicar transition em apenas uma layer"
        variations={[
          { cmd: "with Dissolve(1.0).layer('master')", desc: "Anima só a layer master.", output: "Não interfere em GUI/textbox." },
          {
            cmd: "renpy.transition(fade, layer='overlay')",
            desc: "Aplica via Python a uma layer específica.",
            output: "Útil dentro de screens.",
          },
          { cmd: "config.window_show_transition = dissolve", desc: "Transition padrão do textbox aparecendo.", output: "Em options.rpy." },
          { cmd: "config.window_hide_transition = dissolve", desc: "Transition padrão do textbox sumindo.", output: "Em options.rpy." },
          { cmd: "config.say_attribute_transition = Dissolve(0.2)", desc: "Anima troca de expressão durante diálogo.", output: "Sakura passa de neutra a feliz suavemente." },
        ]}
      />

      <h2>6. Exemplo completo — sequência cinemática</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy — abertura do capítulo 1"
        code={`define dissolve_lento = Dissolve(2.0)
define fade_branco = Fade(0.4, 0.2, 0.6, color="#fff")

label cap1_abertura:
    # 1. Tela preta
    scene black
    with Pause(1.0)

    # 2. Logo aparece suave
    show titulo
    with dissolve_lento

    pause 2.0

    hide titulo
    with dissolve

    # 3. Flash p/ branco — vai abrir
    scene white with fade_branco

    pause 0.4

    # 4. Café à tarde
    scene bg cafe
    show sakura uniforme at center
    with dissolve_lento

    s "Capítulo 1 — O cliente das tardes de quinta."
    return`}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        user="dev"
        host="vn-studio"
        lines={[
          {
            comment: "Lint avisa se você usou uma transition que não existe",
            cmd: "renpy.exe . lint",
            out: `game/script.rpy:42 'with disolve' is probably a typo of 'dissolve'.

Statistics:
   Image files: 24
   Transitions referenced: 7
Lint completed in 0.84s.`,
            outType: "warning",
          },
        ]}
      />

      <PracticeBox
        title="Crie uma transition floral customizada"
        goal="Definir uma Dissolve longa e usá-la entre dois cenários."
        steps={[
          "Em game/transitions.rpy declare 'define dissolve_floral = Dissolve(1.5)'.",
          "Em script.rpy, no label start, faça 'scene bg cafe with dissolve_floral'.",
          "Adicione uma fala da Sakura.",
          "Em seguida 'scene bg parque with dissolve_floral' e outra fala.",
          "Rode pelo Launcher e observe a passagem suave de 1.5 segundos.",
        ]}
        verify="A troca de cenário deve durar visivelmente mais que o dissolve padrão (0.5s)."
      />

      <OutputBlock label="resumo das transitions mais úteis no dia a dia" type="success">
{`fade        → corte forte entre cenas (cap1 → cap2)
dissolve    → trocar background suavemente
moveinleft  → personagem entrando em cena
moveoutright→ personagem saindo
hpunch      → soco / impacto narrativo
None        → preparar várias mudanças e animar tudo junto`}
      </OutputBlock>

      <AlertBox type="danger" title="Não exagere">
        Trocar transition a cada linha cansa o jogador. Padrão profissional:
        <code>fade</code> entre capítulos, <code>dissolve</code> em mudança
        de local, sem transition entre falas da mesma cena. Reserve efeitos
        chamativos (<code>hpunch</code>, <code>pixellate</code>) para
        momentos com peso emocional.
      </AlertBox>
    </PageContainer>
  );
}
