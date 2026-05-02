import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function ATL() {
  return (
    <PageContainer
      title="ATL — Animation and Transformation Language"
      subtitle="Animar sprites: posição, rotação, escala, opacidade. Blocos parallel, block, choice, repeat. Easing functions e exemplos de pulse, shake e flutuação."
      difficulty="intermediario"
      timeToRead="18 min"
      prompt="visual/atl"
    >
      <AlertBox type="info" title="O que é ATL">
        <strong>ATL</strong> (Animation and Transformation Language) é uma
        sub-linguagem do Ren'Py para descrever como uma imagem se move,
        gira, esmaece e transforma ao longo do tempo. É usada dentro de{" "}
        <code>transform</code>, <code>image</code> ou diretamente em{" "}
        <code>show ... at</code>. Tudo declarativo, sem precisar de loop
        Python.
      </AlertBox>

      <h2>1. Estrutura mínima — properties + tempo</h2>

      <CodeBlock
        language="python"
        title="game/transforms.rpy"
        code={`# Transform sem animação — só posição
transform meio:
    xalign 0.5
    yalign 1.0

# Transform com 1 passo: muda em 0.5s para o estado final
transform fade_in:
    alpha 0.0          # estado inicial
    linear 0.5 alpha 1.0   # vai a alpha 1.0 em 0.5s linear

# Movimento em arco
transform entrar_da_esquerda:
    xalign 0.0  yalign 1.0
    ease 0.8 xalign 0.5

# Pulsar — escala que vai e volta, infinito
transform pulsar:
    zoom 1.0
    ease 0.4 zoom 1.08
    ease 0.4 zoom 1.0
    repeat`}
      />

      <h2>2. Properties que você pode animar</h2>

      <CommandTable
        title="Propriedades de transform"
        variations={[
          { cmd: "xpos / ypos", desc: "Posição em pixels (canto superior esquerdo).", output: "xpos 1280 ypos 540" },
          { cmd: "xalign / yalign", desc: "Posição em proporção (0.0 a 1.0). Mais portável.", output: "xalign 0.5 yalign 0.5  → centro" },
          { cmd: "xoffset / yoffset", desc: "Deslocamento adicional em pixels. Bom p/ shake.", output: "xoffset 10 → 10px à direita do âncora" },
          { cmd: "alpha", desc: "Transparência de 0.0 (invisível) a 1.0 (opaco).", output: "alpha 0.5 → 50% transparente" },
          { cmd: "rotate", desc: "Rotação em graus. Negativo = anti-horário.", output: "rotate 15 → inclina 15° à direita" },
          { cmd: "zoom", desc: "Escala uniforme. 1.0 = tamanho original.", output: "zoom 1.5 → 50% maior" },
          { cmd: "xzoom / yzoom", desc: "Escala separada por eixo (espelhar = xzoom -1.0).", output: "xzoom -1 → vira o sprite" },
          { cmd: "crop", desc: "Recorte (left, top, width, height).", output: "crop (0,0,300,400)" },
          { cmd: "additive", desc: "Mistura aditiva (efeito de luz/brilho).", output: "additive 1.0" },
          { cmd: "matrixcolor", desc: "Aplica matriz de cor (filtro sépia, escala de cinza).", output: "matrixcolor TintMatrix('#fcc')" },
        ]}
      />

      <h2>3. Funções de tempo (easing)</h2>

      <CommandTable
        title="Como o valor muda entre estados"
        variations={[
          { cmd: "linear N prop val", desc: "Velocidade constante durante N segundos.", output: "linear 1.0 alpha 1.0" },
          { cmd: "ease N prop val", desc: "Lento → rápido → lento (suavizado).", output: "Ideal para entradas/saídas naturais." },
          { cmd: "easein N prop val", desc: "Começa lento e acelera.", output: "Bom para algo sendo arremessado." },
          { cmd: "easeout N prop val", desc: "Começa rápido e desacelera.", output: "Bom para algo desacelerando." },
          { cmd: "pause N", desc: "Espera N segundos parado.", output: "pause 0.5" },
          { cmd: "warper(N, prop, val)", desc: "Função custom — qualquer warper registrado.", output: "ease_quart(0.5, alpha, 1.0)" },
        ]}
      />

      <h2>4. Blocos: <code>block</code>, <code>parallel</code>, <code>choice</code>, <code>repeat</code></h2>

      <CodeBlock
        language="python"
        title="game/transforms.rpy — blocos"
        code={`# block — agrupa um conjunto que pode ser repetido
transform piscar:
    block:
        ease 0.3 alpha 0.4
        ease 0.3 alpha 1.0
        repeat  # repete o BLOCK indefinidamente

# parallel — duas animações ao mesmo tempo
transform pular_e_brilhar:
    parallel:
        ease 0.4 yoffset -30
        ease 0.4 yoffset 0
    parallel:
        ease 0.4 alpha 1.0
        ease 0.4 alpha 0.7

# choice — escolhe aleatoriamente uma opção a cada execução
transform sussurro:
    choice:
        xoffset -2
    choice:
        xoffset 2
    choice:
        xoffset -1
    pause 0.05
    repeat`}
      />

      <h2>5. Receitas prontas — copie e use</h2>

      <h3>5.1. Sprite pulsando (batimento cardíaco)</h3>

      <CodeBlock
        language="python"
        title="game/transforms.rpy"
        code={`transform batida:
    zoom 1.0
    ease 0.25 zoom 1.06
    ease 0.25 zoom 1.0
    pause 0.2
    ease 0.25 zoom 1.06
    ease 0.25 zoom 1.0
    pause 0.6
    repeat`}
      />

      <h3>5.2. Flutuação (sprite levitando)</h3>

      <CodeBlock
        language="python"
        title="game/transforms.rpy"
        code={`transform flutuar:
    yoffset 0
    ease 1.5 yoffset -8
    ease 1.5 yoffset 0
    repeat`}
      />

      <h3>5.3. Shake (susto / explosão)</h3>

      <CodeBlock
        language="python"
        title="game/transforms.rpy"
        code={`transform tremer:
    block:
        choice:
            xoffset -5  yoffset 3
        choice:
            xoffset 5  yoffset -2
        choice:
            xoffset -3 yoffset -4
        choice:
            xoffset 4  yoffset 5
        pause 0.04
        repeat 14   # 14 repetições = ~0.6s de shake
    xoffset 0
    yoffset 0`}
      />

      <h3>5.4. Entrada cinematográfica</h3>

      <CodeBlock
        language="python"
        title="game/transforms.rpy"
        code={`transform entrada_heroina:
    xalign 0.0  alpha 0.0  zoom 0.85
    parallel:
        ease 0.8 xalign 0.5
    parallel:
        ease 0.8 alpha 1.0
    parallel:
        ease 0.8 zoom 1.0`}
      />

      <h3>5.5. Spin contínuo (logo girando)</h3>

      <CodeBlock
        language="python"
        title="game/transforms.rpy"
        code={`transform girar:
    rotate 0
    linear 4.0 rotate 360
    repeat`}
      />

      <h2>6. Aplicando ATL no script</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label cena_emocao:
    scene bg cafe
    show sakura corada at center

    # Aplica o transform 'batida' à Sakura
    show sakura corada at batida

    s "M-meu coração não para de bater forte..."

    # Trocar para shake durante uma fala de susto
    show yuki braba at tremer
    y "QUEM DEIXOU A PORTA ABERTA?!"

    # Voltar ao normal — passe um Transform 'identity' ou só remova o efeito
    show yuki braba at center
    return`}
      />

      <h2>7. ATL diretamente em <code>image</code></h2>

      <p>
        Você pode embutir ATL na própria declaração da imagem — útil para
        sprites que SEMPRE devem flutuar/girar:
      </p>

      <CodeBlock
        language="python"
        title="game/images.rpy"
        code={`# Item 'chave dourada' que sempre brilha pulsando
image item chave dourada:
    "images/itens/chave dourada.png"
    block:
        ease 0.5 alpha 1.0
        ease 0.5 alpha 0.6
        repeat

# Logo do menu principal que pulsa devagar
image logo_titulo:
    "images/ui/logo.png"
    xalign 0.5  yalign 0.3
    ease 1.5 zoom 1.04
    ease 1.5 zoom 1.0
    repeat`}
      />

      <h2>8. Composição com <code>contains</code></h2>
      <p>
        <code>contains</code> permite animar sub-elementos dentro de um
        Transform — útil para cenas com partículas, múltiplas peças:
      </p>

      <CodeBlock
        language="python"
        title="game/transforms.rpy"
        code={`transform composicao:
    contains:
        "images/efeito/petala1.png"
        ypos 0
        linear 3.0 ypos 1080
        repeat
    contains:
        "images/efeito/petala2.png"
        xpos 200  ypos 0
        linear 4.0 ypos 1080
        repeat`}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        user="dev"
        host="vn-studio"
        lines={[
          {
            comment: "Lint mostra warnings de ATL inválido (ex: ease sem duração)",
            cmd: "renpy.exe . lint",
            out: `game/transforms.rpy:18 'ease' requires a duration.

Statistics:
  Transforms defined: 12
  Transforms used in script: 9
Lint took 0.72s.`,
            outType: "warning",
          },
        ]}
      />

      <PracticeBox
        title="Faça a Sakura aparecer flutuando do nada"
        goal="Combinar fade-in com flutuação contínua para uma entrada mágica."
        steps={[
          "Em transforms.rpy crie 'transform aparecer_flutuando' com alpha 0 inicial.",
          "Use parallel: um lado faz 'ease 1.0 alpha 1.0', o outro faz a flutuação cíclica yoffset.",
          "No bloco principal use 'block: ... repeat' para a flutuação rodar para sempre.",
          "Em script.rpy: 'show sakura neutra at aparecer_flutuando'.",
          "Adicione 2 falas e veja o efeito por uns 5 segundos.",
        ]}
        verify="A Sakura aparece esmaecendo de invisível para visível em ~1s e fica subindo/descendo levemente enquanto fala."
      >
        <CodeBlock
          language="python"
          title="game/transforms.rpy (resposta)"
          code={`transform aparecer_flutuando:
    alpha 0.0  yoffset 0
    parallel:
        ease 1.0 alpha 1.0
    parallel:
        block:
            ease 1.5 yoffset -8
            ease 1.5 yoffset 0
            repeat`}
        />
      </PracticeBox>

      <OutputBlock label="cheat sheet — propriedades mais usadas" type="info">
{`POSIÇÃO       xalign / yalign / xoffset / yoffset
ESCALA        zoom / xzoom / yzoom
TRANSPARÊNCIA alpha (0.0 - 1.0)
ROTAÇÃO       rotate (graus)
TEMPO         linear N | ease N | easein N | easeout N | pause N
ESTRUTURA     block / parallel / choice / repeat / contains`}
      </OutputBlock>

      <AlertBox type="danger" title="Performance: cuidado com 'repeat' em muitos sprites">
        Cada animação ATL infinita custa CPU. Em telas com 6+ sprites
        animados, principalmente em build Web e Android, pode reduzir o
        framerate. Prefira animar só os elementos em foco e desativar os
        loops com <code>show ... at center</code> (sem o transform animado)
        quando o personagem não está em destaque.
      </AlertBox>
    </PageContainer>
  );
}
