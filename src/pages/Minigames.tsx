import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Minigames() {
  return (
    <PageContainer
      title="Minigames — Click the Heart & Quick-Time Events"
      subtitle="Quebre o ritmo da leitura com mini-jogos. Use Screen Language e Python para criar QTEs, alvos clicáveis com timer e puzzles simples — sem precisar de PyGame."
      difficulty="avancado"
      timeToRead="22 min"
      prompt="avancado/minigames"
    >
      <AlertBox type="info" title="Por que adicionar mini-jogos?">
        Quebrar o ritmo passivo da leitura com 30 segundos de interação ativa
        cria <strong>picos de tensão</strong> que o jogador lembra. Em{" "}
        <em>Sakura Café</em> o QTE clássico é "tirar o pedido sem deixar
        cair" — e na rota da Akira, um mini "click the heart" durante uma
        cena romântica. Mini-games em Ren'Py usam apenas Screen Language +
        Python: você não precisa importar PyGame.
      </AlertBox>

      <h2>1. Anatomia de um QTE em Ren'Py</h2>
      <p>
        Todo QTE tem 3 ingredientes: (1) uma <strong>screen</strong> que
        desenha o alvo, (2) um <strong>timer</strong> que conta o tempo
        limite, e (3) duas <strong>actions</strong>: "acertou" e "não
        acertou". O resultado vira uma variável global que o script lê depois.
      </p>

      <CodeBlock
        language="python"
        title="game/minigames/qte_basico.rpy"
        code={`# Variável que o script lê após o QTE
default qte_resultado = None    # "acerto" | "falha" | None

screen qte_clique(tempo=2.0, alvo_pos=(0.5, 0.5)):
    modal True
    zorder 50

    # Fundo escurecido (semi-transparente)
    add "#0008"

    # Aviso no topo
    text "CLIQUE NO CORAÇÃO!" size 42 color "#ffaacc" xalign 0.5 yalign 0.05

    # Barra de tempo
    bar:
        value AnimatedValue(0.0, tempo, tempo)
        range tempo
        xsize 600 ysize 16
        xalign 0.5 yalign 0.12

    # O alvo clicável
    imagebutton:
        idle "images/minigames/heart_idle.png"
        hover "images/minigames/heart_hover.png"
        focus_mask True
        xpos alvo_pos[0] ypos alvo_pos[1]
        anchor (0.5, 0.5)
        action [SetVariable("qte_resultado", "acerto"), Return()]

    # Timer que falha automaticamente após X segundos
    timer tempo action [SetVariable("qte_resultado", "falha"), Return()]

    # ESC = falha imediata (opcional)
    key "game_menu" action [SetVariable("qte_resultado", "falha"), Return()]`}
      />

      <h2>2. Chamando o QTE no script</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label cena_romance_akira:
    scene bg cafe_noite with fade
    show akira blush at center with dissolve
    a "Você... tem algo no rosto."
    a "Posso tirar?"

    # Reseta antes de começar
    $ qte_resultado = None

    # Mostra o QTE com 1.5s de janela
    call screen qte_clique(tempo=1.5, alvo_pos=(0.55, 0.45))

    if qte_resultado == "acerto":
        show akira surprised at center with dissolve
        a "V-você... reagiu rápido. Surpreendente."
        $ somar_afeicao("akira", 8)
    else:
        a "Hum, deixa pra lá."
        a "Você ficou de pedra."
        $ somar_afeicao("akira", -2)

    return`}
      />

      <h2>3. Alvo móvel — coração que se move pela tela</h2>
      <p>
        Para deixar o desafio mais divertido, faça o coração{" "}
        <strong>se mover</strong> usando ATL (Animation and Transformation
        Language). Combine com <code>focus_mask</code> para acertos só na
        área visível do PNG:
      </p>

      <CodeBlock
        language="python"
        title="game/minigames/qte_movel.rpy"
        code={`# Trajetória vai-e-vem horizontal
transform mover_coracao:
    xpos 0.1 ypos 0.4
    linear 1.0 xpos 0.9 ypos 0.6
    linear 1.0 xpos 0.1 ypos 0.4
    repeat

screen qte_movel(tempo=4.0):
    modal True
    zorder 50
    add "#0008"

    text "Pegue antes que suma!" size 36 color "#ffaacc" xalign 0.5 yalign 0.05

    bar:
        value AnimatedValue(0.0, tempo, tempo)
        range tempo
        xsize 600 ysize 14
        xalign 0.5 yalign 0.12

    imagebutton:
        idle "images/minigames/heart_idle.png"
        hover "images/minigames/heart_hover.png"
        at mover_coracao
        focus_mask True
        action [SetVariable("qte_resultado", "acerto"), Return()]

    timer tempo action [SetVariable("qte_resultado", "falha"), Return()]`}
      />

      <h2>4. Mini-game maior — Latte Art (clicar 5 alvos em sequência)</h2>
      <p>
        Esse é um clássico em VNs de café: o jogador clica em{" "}
        <strong>5 pontos numerados</strong> antes do tempo acabar para
        formar o desenho na espuma. Use uma lista de coordenadas e um
        contador:
      </p>

      <CodeBlock
        language="python"
        title="game/minigames/latte_art.rpy"
        code={`default latte_pontos_acertados = 0
default latte_resultado = None

# 5 alvos espalhados (x, y) em coords relativas
define LATTE_ALVOS = [
    (0.30, 0.40),
    (0.50, 0.30),
    (0.70, 0.40),
    (0.40, 0.60),
    (0.60, 0.60),
]

init python:

    def latte_acertar(idx):
        global latte_pontos_acertados, latte_resultado
        if idx == latte_pontos_acertados:  # ordem correta
            latte_pontos_acertados += 1
            renpy.restart_interaction()    # força re-render
            if latte_pontos_acertados >= len(LATTE_ALVOS):
                latte_resultado = "acerto"
                renpy.end_interaction(None)
        else:
            latte_resultado = "ordem_errada"
            renpy.end_interaction(None)


screen mini_latte(tempo=6.0):
    modal True
    zorder 50

    add "images/bg_xicara.png"
    text "Conecte os pontos na ordem!" size 32 color "#fff" xalign 0.5 yalign 0.05

    bar:
        value AnimatedValue(0.0, tempo, tempo)
        range tempo
        xsize 600 ysize 14
        xalign 0.5 yalign 0.10

    text "Próximo: [latte_pontos_acertados + 1] / [len(LATTE_ALVOS)]" size 22 color "#ffaa00" xalign 0.5 yalign 0.92

    for i, (px, py) in enumerate(LATTE_ALVOS):
        if i < latte_pontos_acertados:
            # Já acertado — mostra como check
            add "images/minigames/check.png" xpos px ypos py anchor (0.5, 0.5)
        elif i == latte_pontos_acertados:
            # Próximo — pulsa
            imagebutton:
                idle "images/minigames/dot_pulse.png"
                hover "images/minigames/dot_hover.png"
                xpos px ypos py
                anchor (0.5, 0.5)
                action Function(latte_acertar, i)
        else:
            # Futuro — cinza
            add "images/minigames/dot_gray.png" xpos px ypos py anchor (0.5, 0.5)

    timer tempo action [SetVariable("latte_resultado", "tempo_esgotado"), Return()]


# === Uso no script ===
label cap2_treino_latte:
    scene bg cafe_balcao with fade
    show sakura serious at right with dissolve
    s "Mostra o que você sabe! 6 segundos no relógio."

    $ latte_pontos_acertados = 0
    $ latte_resultado = None
    call screen mini_latte(tempo=6.0)

    if latte_resultado == "acerto":
        s "Não acredito! Primeira tentativa..."
        $ somar_afeicao("sakura", 6)
    elif latte_resultado == "ordem_errada":
        s "A sequência conta! Tem que ir do 1 ao 5."
        $ somar_afeicao("sakura", -1)
    else:
        s "Tempo! Vai precisar treinar mais."
    return`}
      />

      <CommandTable
        title="Funções e propriedades-chave para mini-games"
        variations={[
          {
            cmd: "modal True",
            desc: "Bloqueia cliques fora dos elementos da screen.",
            output: "Sem isso, o jogador clica no diálogo de fundo por engano.",
          },
          {
            cmd: "timer X action ...",
            desc: "Dispara uma action depois de X segundos.",
            output: "Use para limite de tempo, fim automático.",
          },
          {
            cmd: "key 'game_menu' action ...",
            desc: "Captura tecla ESC dentro da screen.",
            output: "Permite cancelar QTE com tecla.",
          },
          {
            cmd: "imagebutton focus_mask True",
            desc: "Cliques só são contabilizados na área NÃO transparente do PNG.",
            output: "Essencial para sprites com bordas irregulares.",
          },
          {
            cmd: "AnimatedValue(start, end, duracao)",
            desc: "Anima um valor (use em bar value).",
            output: "Cria a barra de tempo decrescente.",
          },
          {
            cmd: "renpy.restart_interaction()",
            desc: "Força a screen a re-renderizar após mudança de variável.",
            output: "Útil quando Python muda estado fora de um SetVariable.",
          },
          {
            cmd: "renpy.end_interaction(value)",
            desc: "Equivalente a Return() chamado de Python.",
            output: "Sai da call screen.",
          },
        ]}
      />

      <h2>5. Pontuação acumulada e ranking</h2>

      <CodeBlock
        language="python"
        title="game/minigames/score.rpy"
        code={`default persistent.melhor_latte = 0   # high-score persistente entre saves
default ultimo_score = 0

label fim_latte:
    if latte_resultado == "acerto":
        $ ultimo_score = int(100 * (1 - tempo_gasto / 6.0))   # quanto mais rápido, mais pontos
        if ultimo_score > persistent.melhor_latte:
            $ persistent.melhor_latte = ultimo_score
            "Novo recorde: [ultimo_score] pontos!"
        else:
            "Você fez [ultimo_score] pontos. (Recorde: [persistent.melhor_latte])"
    return`}
      />

      <PracticeBox
        title="Crie seu primeiro QTE 'pegue o copo' (3 minutos)"
        goal="Ter um mini-game funcional sem nenhum asset extra além de uma cor sólida."
        steps={[
          "Crie game/minigames/qte_simples.rpy e cole o código do qte_clique acima.",
          "Substitua os imagebutton.idle/hover por: idle Solid('#ff66aa', xysize=(120,120)) hover Solid('#ff99cc', xysize=(120,120)).",
          "No label start adicione: $ qte_resultado = None / call screen qte_clique(tempo=1.0).",
          "Adicione: if qte_resultado == 'acerto': 'Boa!' else: 'Lento...'",
          "Rode renpy.exe . e tente acertar — depois ajuste o tempo para 0.5 e 3.0.",
        ]}
        verify="O quadrado rosa aparece, sumir após 1s gera 'Lento...' e clicar gera 'Boa!'."
      />

      <h2>6. Testando e debugando</h2>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Pula direto para o label do mini-game (modo developer)",
            cmd: "renpy.exe . --developer",
            out: `Open the in-game console with Shift+O, then:
> jump cap2_treino_latte
... mini-game inicia.`,
            outType: "info",
          },
          {
            comment: "Lint avisa sobre imagens faltando dos mini-games",
            cmd: "renpy.exe . lint",
            out: `game/minigames/latte_art.rpy:42 The image "images/minigames/dot_pulse.png" was not found.
game/minigames/latte_art.rpy:46 The image "images/minigames/dot_gray.png" was not found.

Lint complete. 2 warnings.`,
            outType: "warning",
          },
        ]}
      />

      <OutputBlock label="Sequência típica do jogador no mini Latte" type="success">
{`[6.0s] mini_latte aberto    → próximo: 1/5
[5.4s] clicou no ponto 1    → próximo: 2/5
[4.8s] clicou no ponto 2    → próximo: 3/5
[4.1s] clicou no ponto 3    → próximo: 4/5
[3.3s] clicou no ponto 5    ✗ ordem errada
[3.3s] latte_resultado = 'ordem_errada' → fechou screen
[script] sakura: "A sequência conta!"`}
      </OutputBlock>

      <AlertBox type="warning" title="Acessibilidade: ofereça um 'pular mini-game'">
        Nem todo jogador tem reflexo ou mobilidade para acertar QTEs. Em
        Preferences crie um toggle <code>persistent.skip_minigames</code> e,
        no início de cada label de mini-game, faça:{" "}
        <code>if persistent.skip_minigames: $ qte_resultado = "acerto"; jump
        skip_qte</code>. Isso aumenta drasticamente a aceitação da sua VN.
      </AlertBox>

      <AlertBox type="success" title="Inspirações reais">
        Dê uma olhada em <strong>Va-11 Hall-A</strong> (mini-game de fazer
        drinks) e <strong>Doki Doki Literature Club</strong> (mini-jogo de
        escrever poemas) para ver como mini-games podem ser <em>parte da
        narrativa</em> e não interrupções.
      </AlertBox>
    </PageContainer>
  );
}
