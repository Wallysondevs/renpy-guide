import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Bubble() {
  return (
    <PageContainer
      title="Speech Bubbles — balões de fala estilo mangá"
      subtitle="Como ativar Character(bubble=True), posicionar balões sobre os sprites, customizar visual e ter Akira e Sakura discutindo em balões simultâneos no Sakura Café."
      difficulty="intermediario"
      timeToRead="16 min"
      prompt="ui/bubble"
    >
      <AlertBox type="info" title="O que são Speech Bubbles">
        A partir do <strong>Ren'Py 8.x</strong>, qualquer{" "}
        <code>Character()</code> pode falar dentro de um{" "}
        <strong>balão flutuante</strong> em vez da textbox tradicional. É o
        visual clássico de mangá: um balão saindo da boca da personagem,
        com a "calda" apontando para o sprite. Ótimo para cenas casuais
        no Sakura Café onde várias personagens discutem ao mesmo tempo.
      </AlertBox>

      <h2>1. Ativando o balão em 1 linha</h2>
      <p>
        Basta adicionar o parâmetro <code>kind=bubble</code> ao{" "}
        <code>Character()</code>. A documentação oficial só diz "use
        kind=bubble" — mas na prática você precisa de um{" "}
        <strong>image tag</strong> para o Ren'Py saber sobre QUAL sprite
        ancorar o balão. Sem isso o balão fica em posição aleatória.
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`# Personagens falam em balões — note 'kind=bubble'
define s = Character("Sakura", kind=bubble, color="#ffaacc",
    image="sakura")
define a = Character("Akira", kind=bubble, color="#ffcc99",
    image="akira")
define y = Character("Yuki", kind=bubble, color="#aaccff",
    image="yuki")

label cena_balao:
    scene bg cafe
    show sakura feliz at left
    show akira misterioso at right

    s "Akira-kun, você quer experimentar o especial do dia?"
    a "Que especial?"
    s "Torta de morango com matcha! Eu mesma fiz."
    a "...hmm. Aceito."`}
      />

      <h2>2. Onde o balão aparece — posicionamento automático</h2>
      <p>
        O Ren'Py procura uma <strong>tag de imagem</strong> visível com o
        mesmo nome de <code>image=</code> do Character. Se Sakura tem{" "}
        <code>image="sakura"</code> e há um <code>show sakura feliz</code>{" "}
        em tela, o balão se ancora automaticamente sobre ela. Caso o
        sprite não esteja visível, o balão usa a área default do screen{" "}
        <code>bubble</code>.
      </p>

      <CommandTable
        title="Parâmetros do Character() para bubbles"
        variations={[
          {
            cmd: "kind=bubble",
            desc: "Habilita o modo balão (em vez da textbox).",
            output: 'define s = Character("Sakura", kind=bubble)',
          },
          {
            cmd: 'image="sakura"',
            desc: "Tag da imagem onde o balão se ancora.",
            output: "Procura 'sakura' nas imagens visíveis",
          },
          {
            cmd: "color=#ffaacc",
            desc: "Cor do nome (se o balão exibir).",
            output: "Texto com tom rosa pastel",
          },
          {
            cmd: "what_color=#fff",
            desc: "Cor do texto da fala dentro do balão.",
            output: "Fala em branco puro",
          },
          {
            cmd: "what_size=22",
            desc: "Tamanho da fonte da fala.",
            output: "22 pixels — bom para mobile",
          },
          {
            cmd: "callback=meu_cb",
            desc: "Função chamada em begin/show/end de cada fala.",
            output: "Útil para SFX a cada balão",
          },
        ]}
      />

      <h2>3. O screen <code>bubble</code> — onde a mágica acontece</h2>
      <p>
        Por baixo dos panos, cada fala em balão renderiza o screen{" "}
        <code>bubble</code> definido em <code>screens.rpy</code>. Este é o
        screen padrão que vem no template — você pode customizar
        livremente:
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy — screen bubble custom"
        code={`screen bubble(who, what):
    window:
        id "window"
        style_prefix "bubble"

        # Define a área do balão usando a área do say-bubble do Character
        background Frame("gui/bubble.png", 55, 55, 55, 95)
        xysize (480, None)
        padding (40, 30, 40, 50)

        # Posicionamento dinâmico vindo do Character.bubble_who_area
        at transform:
            xpos persistent.bubble_x or 0.5
            ypos persistent.bubble_y or 0.3
            xanchor 0.5

        vbox:
            spacing 6
            if who is not None:
                text who id "who" style "bubble_who"
            text what id "what" style "bubble_what"

style bubble_who is say_label:
    color "#ff6699"
    size 18
    bold True

style bubble_what is say_dialogue:
    color "#222"
    size 22
    text_align 0.5
    layout "subtitle"`}
      />

      <h2>4. Posicionamento manual por personagem</h2>
      <p>
        Para cada Character você pode fixar uma área padrão usando{" "}
        <code>properties</code> ou definindo um screen específico. A
        forma mais prática é registrar coordenadas em uma tabela e
        ler no screen:
      </p>

      <CodeBlock
        language="python"
        title="game/bubbles.rpy"
        code={`# Mapeia tag → posição preferencial do balão (xalign, yalign)
default bubble_pos = {
    "sakura": (0.25, 0.15),
    "akira":  (0.75, 0.15),
    "yuki":   (0.50, 0.10),
}

# Helper: retorna (xalign, yalign) com base na imagem visível
init python:
    def bubble_anchor(who):
        for tag, pos in bubble_pos.items():
            if renpy.showing(tag):
                return pos
        return (0.5, 0.2)

# Use o helper no screen bubble
screen bubble(who, what):
    $ pos = bubble_anchor(getattr(who, "image_tag", None) if who else None)
    window:
        background Frame("gui/bubble.png", 55, 55, 55, 95)
        xalign pos[0]
        yalign pos[1]
        xysize (480, None)
        padding (40, 30, 40, 50)
        vbox:
            if who:
                text who.name style "bubble_who"
            text what style "bubble_what"`}
      />

      <h2>5. Múltiplos balões simultâneos</h2>
      <p>
        Documentação oficial diz "use multiple=N para falas em
        sequência atomicamente" — mas na prática, para Akira e Sakura
        DISCUTINDO em balões VISÍVEIS ao mesmo tempo, você precisa
        mostrá-los como <strong>screens persistentes</strong>:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy — discussão simultânea"
        code={`screen balao_fixo(tag, texto, x, y, cor="#222"):
    window:
        background Frame("gui/bubble.png", 55, 55, 55, 95)
        xalign x  yalign y
        xysize (440, None)
        padding (36, 24, 36, 44)
        text texto color cor size 22 text_align 0.5

label discussao:
    scene bg cafe
    show sakura feliz at left
    show akira misterioso at right

    # Mostra os DOIS balões juntos
    show screen balao_fixo("sakura",
        "Você sempre pede só café preto!", 0.22, 0.18, "#a55")
    show screen balao_fixo("akira",
        "Cafeína é insumo de combate.", 0.78, 0.18, "#225")
    pause 3.0

    hide screen balao_fixo
    return`}
      />

      <h2>6. Customização visual — fundo, calda e sombra</h2>
      <p>
        O balão é só um <code>Frame</code> com PNG. Para ter aquele visual
        clássico com "calda" apontando para o personagem, exporte um PNG
        com a calda já desenhada e use <code>Frame</code> com bordas
        que NÃO incluam a área da calda:
      </p>

      <OutputBlock label="anatomia do PNG do balão" type="info">
{`gui/bubble.png   →   480 x 200 px

╔════════════════════════════╗   ← borda superior (35px)
║                            ║
║   área expansível (texto)  ║   ← Frame escala o miolo
║                            ║
╠════════════════════════════╣   ← borda inferior (35px)
            \\ \\ \\               ← CALDA (60px) — fica fixa fora do Frame
             \\_\\
                
Frame("gui/bubble.png", 55, 55, 55, 95)
                       │   │   │   │
                       L   T   R   B (px de borda fixa)`}
      </OutputBlock>

      <CodeBlock
        language="python"
        title="game/styles.rpy — sombra e borda extra"
        code={`style bubble_window:
    background Frame("gui/bubble.png", 55, 55, 55, 95)
    padding (40, 30, 40, 50)
    # Sombra suave atrás do balão
    foreground Frame("gui/bubble_shadow.png", 60, 60, 60, 100)
    # Cor da borda interna se quiser variar por personagem
    outlines [(2, "#000", 0, 0)]`}
      />

      <h2>7. SFX a cada balão — usando callback</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`init python:
    def bubble_sfx(event, interact=True, **kw):
        if event == "begin":
            renpy.sound.play("audio/sfx/pop.ogg",
                channel="sound", relative_volume=0.4)

define s = Character("Sakura", kind=bubble, image="sakura",
    callback=bubble_sfx)
define a = Character("Akira", kind=bubble, image="akira",
    callback=bubble_sfx)`}
      />

      <h2>8. Voltando ao modo textbox no meio do jogo</h2>
      <p>
        Se a cena exige um momento mais "sério" (confissão, flashback),
        crie 2 versões do mesmo Character e troque conforme o tom:
      </p>

      <CodeBlock
        language="python"
        title="game/characters.rpy"
        code={`# Sakura casual (balão) e Sakura emocional (textbox)
define s = Character("Sakura", kind=bubble, image="sakura",
    color="#ffaacc")
define s_serious = Character("Sakura", color="#ffaacc")

label confissao:
    scene bg quarto noite
    show sakura corada
    s "Hoje no café foi divertido, né?"
    s "Akira nem reclamou da minha torta!"

    # Muda o tom — usa a versão sem balão
    s_serious "Mas... eu queria te dizer uma coisa."
    s_serious "Você ainda volta amanhã?"
    return`}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        user="dev"
        host="vn-studio"
        lines={[
          {
            comment: "lint avisa se o image= do Character não existe",
            cmd: "renpy.exe . lint",
            out: `game/characters.rpy:7 Character 's' has image="sakura"
but no image with that tag was defined.

Statistics:
  Bubble characters: 4
  Regular characters: 2
Lint took 0.61s.`,
            outType: "warning",
          },
        ]}
      />

      <PracticeBox
        title="Akira e Sakura discutindo sobre o cardápio"
        goal="Criar 2 personagens em modo bubble, posicioná-los nos lados opostos da tela e fazer um diálogo de 6 falas alternadas, com SFX 'pop' a cada balão."
        steps={[
          "Em characters.rpy defina s e a com kind=bubble e image= apontando para os sprites.",
          "Crie a função bubble_sfx em init python: que toca audio/sfx/pop.ogg em event=='begin'.",
          "Passe callback=bubble_sfx para os Characters.",
          "Em script.rpy: scene bg cafe, show sakura feliz at left, show akira misterioso at right.",
          "Escreva 6 falas alternadas s/a sobre 'café puro vs com leite'.",
        ]}
        verify="Cada fala deve mostrar um balão no lado correto, com som 'pop' no início, e o balão da fala anterior some quando aparece o próximo."
      >
        <CodeBlock
          language="python"
          title="game/script.rpy (gabarito)"
          code={`init python:
    def bubble_sfx(event, **kw):
        if event == "begin":
            renpy.sound.play("audio/sfx/pop.ogg", channel="sound")

define s = Character("Sakura", kind=bubble, image="sakura",
    callback=bubble_sfx, color="#ffaacc")
define a = Character("Akira", kind=bubble, image="akira",
    callback=bubble_sfx, color="#ffcc99")

label discussao_cardapio:
    scene bg cafe
    show sakura feliz at left
    show akira misterioso at right

    s "Café com leite combina com torta de morango!"
    a "Café puro destaca o sabor do morango."
    s "Você sempre escolhe o mais amargo possível!"
    a "É uma questão de princípio."
    s "Princípio?! É só café!"
    a "Exatamente. E você está estragando."
    return`}
        />
      </PracticeBox>

      <AlertBox type="warning" title="Não funciona em NVL mode">
        Speech bubbles e <strong>NVL</strong> são modos mutuamente
        exclusivos. Se a cena entrou em modo NVL com{" "}
        <code>nvl clear</code>, todas as falas usam a tela cheia
        independente do <code>kind=bubble</code>. Saia do NVL com{" "}
        <code>nvl_narrator</code> ou troque o Character antes.
      </AlertBox>

      <AlertBox type="success" title="Próximo passo">
        Agora que tem balões funcionando, veja{" "}
        <strong>TextInput</strong> para receber input do jogador (nome
        do cliente, pedido custom) e mostrar dentro de um balão também.
      </AlertBox>
    </PageContainer>
  );
}
