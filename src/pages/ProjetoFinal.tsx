import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function ProjetoFinal() {
  return (
    <PageContainer
      title="Projeto Final — Sakura Café"
      subtitle="Uma Visual Novel completa, rodável, com 2 personagens romanceáveis, sistema de afeição, 3 finais condicionais, GUI customizada e build para PC, Web e Android. Use como base do seu próprio jogo."
      difficulty="avancado"
      timeToRead="60 min"
      prompt="projetos/sakura-cafe"
    >
      <AlertBox type="success" title="O que você vai construir aqui">
        Uma VN curta porém COMPLETA chamada <strong>Sakura Café</strong>. Você
        é um(a) novo(a) atendente em um café temático em Akihabara. Conhece
        duas pessoas marcantes — <strong>Sakura</strong>, a barista vintage de
        olhos cor-de-rosa, e <strong>Akira</strong>, o cliente misterioso que
        sempre senta na mesa do canto. Suas escolhas durante 4 dias de trabalho
        decidem qual dos três finais você desbloqueia: <em>Rota Sakura</em>,{" "}
        <em>Rota Akira</em> ou <em>Rota Amizade</em>.
      </AlertBox>

      <h2>1. Sinopse e tom narrativo</h2>
      <p>
        <strong>Sakura Café</strong> é uma slice-of-life romântica leve,
        ambientada em uma cafeteria temática real-fictícia em Akihabara,
        Tóquio. O ritmo é calmo, com humor cotidiano e momentos sentimentais.
        O jogo dura entre 25 e 40 minutos por rota, e foi pensado para servir
        de <strong>esqueleto pedagógico</strong>: você pode trocar nomes,
        cenários e arte, e ainda ter um jogo coerente.
      </p>
      <p>
        A protagonista (genderless por padrão — chamada apenas de "você") foi
        contratada para o turno da tarde. Ao longo de 4 capítulos curtos, ela
        observa e interage com Sakura e Akira. Cada interação adiciona ou
        retira pontos numa variável invisível chamada <code>afeicao</code>.
        Ao fim do dia 4, o jogo compara os pontos e dispara o final
        correspondente.
      </p>

      <h3>1.1. Estrutura narrativa em 4 dias</h3>
      <CommandTable
        title="Capítulos do Sakura Café"
        variations={[
          {
            cmd: "label dia1",
            desc: "Apresentação. Você conhece Sakura no balcão e Akira na mesa do canto. Primeira escolha define o tom.",
            output: "Resultado: +1 sakura ou +1 akira ou +0 (neutro).",
          },
          {
            cmd: "label dia2",
            desc: "Você assume o caixa. Sakura ensina a tirar o espresso perfeito. Akira deixa um livro esquecido — devolve hoje ou amanhã?",
            output: "Resultado: +2 sakura (aceitar lição) ou +2 akira (correr atrás dele).",
          },
          {
            cmd: "label dia3",
            desc: "Festival de cerejeiras no parque ao lado. Convite duplo: Sakura quer companhia para o turno extra, Akira aparece com 2 ingressos.",
            output: "Resultado: +3 da pessoa escolhida, OU +1 e +1 se você tentar ficar bem com ambos.",
          },
          {
            cmd: "label dia4",
            desc: "Encerramento. Conversa íntima decisiva. O jogo soma os pontos e pula para o final.",
            output: "Final Sakura (≥5), Final Akira (≥5), ou Final Amizade (ambos abaixo de 5).",
          },
        ]}
      />

      <h2>2. Estrutura de pastas do projeto</h2>
      <p>
        Crie um projeto novo no Launcher chamado <code>sakura-cafe</code> com
        resolução <code>1920x1080</code> e template{" "}
        <em>Visual Novel</em>. A pasta <code>game/</code> ficará assim:
      </p>

      <OutputBlock label="árvore de pastas — sakura-cafe/" type="info">
{`sakura-cafe/
├── game/
│   ├── script.rpy            ← cérebro do jogo (toda a história)
│   ├── characters.rpy        ← define s, a, n (Sakura, Akira, Narrador)
│   ├── variables.rpy         ← default afeicao = {...}
│   ├── routes.rpy            ← labels final_sakura, final_akira, final_amizade
│   ├── screens_extra.rpy     ← screen status_afeicao customizada
│   ├── options.rpy           ← config.name = "Sakura Café", versão, build
│   ├── gui.rpy               ← cores rosa/lavanda do projeto
│   ├── audio/
│   │   ├── theme.ogg                  ← tema principal (loop café)
│   │   ├── sakura_theme.ogg           ← tema da Sakura (piano leve)
│   │   ├── akira_theme.ogg            ← tema do Akira (violão acústico)
│   │   ├── festival.ogg               ← festival de cerejeiras
│   │   ├── ending_warm.ogg            ← finais felizes
│   │   ├── sfx_door_bell.ogg          ← sino da porta
│   │   ├── sfx_cup.ogg                ← xícara batendo no pires
│   │   └── sfx_footsteps.ogg          ← passos
│   ├── images/
│   │   ├── bg_cafe_dia.png            ← café de dia
│   │   ├── bg_cafe_noite.png          ← café à noite
│   │   ├── bg_parque.png              ← parque com cerejeiras
│   │   ├── bg_estacao.png             ← estação Akihabara
│   │   ├── bg_quarto.png              ← quarto da/o protagonista
│   │   ├── sakura_neutra.png
│   │   ├── sakura_feliz.png
│   │   ├── sakura_triste.png
│   │   ├── sakura_corada.png
│   │   ├── akira_neutro.png
│   │   ├── akira_sorrindo.png
│   │   ├── akira_pensativo.png
│   │   └── logo.png
│   └── tl/                            ← traduções (gerado por renpy ... translate)
└── README.md
`}
      </OutputBlock>

      <AlertBox type="info" title="Sobre as imagens">
        Os arquivos <code>.png</code> acima são apenas referências de
        <em> placeholder</em>. Você pode substituí-los por arte que comprou,
        gerou ou desenhou — desde que respeite as licenças. Quando o projeto
        roda sem as imagens, o Ren'Py mostra um quadrado rosa com o nome do
        arquivo, o que é ótimo para testar o roteiro antes da arte ficar
        pronta.
      </AlertBox>

      <h2>3. Definindo as personagens — characters.rpy</h2>
      <p>
        Cada personagem ganha uma cor distinta no nome para o jogador
        identificar quem fala mesmo de relance. Sakura usa rosa, Akira usa
        azul-meia-noite, e o narrador fica cinza claro.
      </p>

      <CodeBlock
        language="python"
        title="game/characters.rpy"
        code={`# characters.rpy — todas as personagens do Sakura Café
# Cores escolhidas para combinar com o tema rosa/lavanda do gui.rpy

define s = Character(
    "Sakura",
    color="#ff8fb1",
    image="sakura",
    voice_tag="sakura",
    what_prefix='"',
    what_suffix='"',
)

define a = Character(
    "Akira",
    color="#7aa6ff",
    image="akira",
    voice_tag="akira",
    what_prefix='"',
    what_suffix='"',
)

# Narrador — sem nome visível, texto em itálico claro
define n = Character(
    None,
    what_color="#dcd6e6",
    what_italic=True,
)

# Voz interna do(a) protagonista
define eu = Character(
    "Você",
    color="#c8b6ff",
    what_prefix='(',
    what_suffix=')',
)

# Side images — apareceriam no canto inferior esquerdo durante a fala
image side sakura neutra = "images/sakura_neutra.png"
image side sakura feliz = "images/sakura_feliz.png"
image side sakura triste = "images/sakura_triste.png"
image side sakura corada = "images/sakura_corada.png"

image side akira neutro = "images/akira_neutro.png"
image side akira sorrindo = "images/akira_sorrindo.png"
image side akira pensativo = "images/akira_pensativo.png"
`}
      />

      <h2>4. Variáveis de estado — variables.rpy</h2>
      <p>
        A engine precisa lembrar seus pontos entre saves. Tudo que muda
        durante o jogo entra como <code>default</code>. Tudo que NUNCA muda
        (constantes) entra como <code>define</code>.
      </p>

      <CodeBlock
        language="python"
        title="game/variables.rpy"
        code={`# variables.rpy — estado mutável do jogo
# Use 'default' para tudo que pode mudar e ser salvo no save.

default afeicao = {"sakura": 0, "akira": 0}
default flag_devolveu_livro = False
default flag_aceitou_licao_espresso = False
default flag_foi_festival_com_sakura = False
default flag_foi_festival_com_akira = False
default rota_atual = "neutra"   # "sakura" / "akira" / "amizade"

# Persistente — sobrevive ENTRE jogos diferentes (galeria, finais desbloqueados)
default persistent.final_sakura_unlocked = False
default persistent.final_akira_unlocked = False
default persistent.final_amizade_unlocked = False

# Cores dos status (usadas pela screen status_afeicao)
define COR_SAKURA = "#ff8fb1"
define COR_AKURA  = "#7aa6ff"
define COR_NEUTRA = "#dcd6e6"

init python:
    def somar_afeicao(personagem, valor):
        """Helper para somar pontos com clamp 0..10."""
        atual = afeicao.get(personagem, 0)
        afeicao[personagem] = max(0, min(10, atual + valor))

    def decidir_rota():
        """Compara os pontos e devolve a string da rota."""
        s = afeicao.get("sakura", 0)
        a = afeicao.get("akira", 0)
        if s >= 5 and s > a:
            return "sakura"
        if a >= 5 and a > s:
            return "akira"
        return "amizade"
`}
      />

      <h2>5. O coração do jogo — script.rpy</h2>
      <p>
        Este é o arquivo mais importante. Ele liga todas as cenas, dispara
        músicas, abre menus e entrega os 3 finais. Leia com calma — está
        comentado linha-a-linha para servir de gabarito do seu próprio jogo.
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`# =========================================================================
#  Sakura Café — script.rpy
#  Este arquivo é o ponto de entrada. O Ren'Py começa SEMPRE em "label start".
# =========================================================================

label start:

    # --- Tela inicial / abertura ---
    scene black with fade
    play music "audio/theme.ogg" fadein 2.0

    n "Akihabara, primavera. O cheiro de café recém-moído escapa pela porta entreaberta."
    n "Você entra pela primeira vez no {b}Sakura Café{/b} — não como cliente, mas como funcionário."

    scene bg cafe dia with dissolve
    pause 0.6

    play sound "audio/sfx_door_bell.ogg"
    n "Um sininho discreto anuncia sua chegada. Atrás do balcão de madeira escura, alguém ergue os olhos."

    jump dia1


# =========================================================================
#  DIA 1 — Apresentações
# =========================================================================
label dia1:

    scene bg cafe dia
    show sakura neutra at center with dissolve

    s "Você deve ser a pessoa nova. Eu sou Sakura, gerente do turno da tarde."
    s "Bem-vindo(a) ao Sakura Café! Aqui o cardápio é simples, mas o sorriso é obrigatório."
    show sakura feliz with dissolve
    s "Pode pendurar a mochila ali atrás. O avental rosa é seu."

    eu "(Os olhos dela são literalmente cor-de-rosa? Ou é a luz?)"

    n "Enquanto você amarra o avental, o sino toca de novo."
    play sound "audio/sfx_door_bell.ogg"

    scene bg cafe dia with None
    show akira neutro at right with dissolve

    a "Mesa de sempre, Sakura."
    show sakura neutra at left with dissolve
    s "Akira, esse é meu reforço novo. Trate com carinho."

    a "..."
    show akira pensativo with dissolve
    a "Bem-vindo(a). Só me chame quando o café terminar."

    n "Ele se senta na mesa do canto, abre um livro grosso e ignora o mundo."

    menu:
        "Como você reage à recepção dele?"

        "Cumprimentar Akira com um sorriso e dizer que vai trazer o café":
            $ somar_afeicao("akira", 1)
            eu "(Talvez ele só seja tímido. Vou tentar.)"
            show akira neutro with dissolve
            a "...obrigado."

        "Pedir para a Sakura te ensinar a máquina de espresso primeiro":
            $ somar_afeicao("sakura", 1)
            show sakura feliz with dissolve
            s "Adorei a iniciativa! Vem cá, deixa eu te mostrar a Marzocco."

        "Ficar quieto(a) e observar o movimento":
            eu "(Melhor não atrapalhar ninguém no primeiro dia.)"

    n "O turno passa rápido. Quando você se dá conta, o sol já está laranja na vitrine."

    jump dia2


# =========================================================================
#  DIA 2 — A lição do espresso e o livro esquecido
# =========================================================================
label dia2:

    scene bg cafe dia with fade
    play music "audio/sakura_theme.ogg" fadein 2.0

    show sakura neutra at center with dissolve
    s "Hoje você assume o caixa. Eu fico na máquina."
    s "Mas... se quiser aprender a tirar um espresso de verdade, depois te ensino."

    menu:
        "Aceitar a lição de espresso":
            $ somar_afeicao("sakura", 2)
            $ flag_aceitou_licao_espresso = True
            show sakura feliz with dissolve
            s "Que bom! É sério, isso vai mudar como você toma café para sempre."
            s "Repare: 18 gramas de pó, 25 segundos de extração, crema cor de avelã."
            eu "(Ela está literalmente brilhando enquanto explica.)"

        "Agradecer mas dizer que prefere observar":
            show sakura neutra with dissolve
            s "Tudo bem! O convite fica de pé."

    n "Algumas horas depois, Akira se levanta apressado e sai sem fechar a conta da água com gás."
    play sound "audio/sfx_door_bell.ogg"
    n "Em cima da mesa, ele esqueceu um livro grosso de capa azul."

    show akira pensativo at right with dissolve
    a "..."
    hide akira with dissolve

    menu:
        "Correr atrás dele agora — talvez ainda esteja na esquina":
            $ somar_afeicao("akira", 2)
            $ flag_devolveu_livro = True
            scene bg estacao with fade
            play sound "audio/sfx_footsteps.ogg"

            show akira neutro at center with dissolve
            a "Você correu até aqui só por causa de um livro?"
            eu "(Está sem fôlego, mas valeu a pena.)"
            eu "Você estava lendo poesia da era Heian. Achei que faria falta."
            show akira sorrindo with dissolve
            a "Ninguém nunca tinha reparado no que eu lia."
            a "Obrigado. De verdade."

        "Guardar o livro no balcão e devolver amanhã":
            n "Você anota um bilhete e prende com fita-crepe na capa."
            eu "(Amanhã ele vem buscar.)"

    jump dia3


# =========================================================================
#  DIA 3 — Festival das Cerejeiras
# =========================================================================
label dia3:

    scene bg cafe dia with fade
    play music "audio/theme.ogg" fadein 1.5

    show sakura neutra at left with dissolve
    s "Hoje começa o festival no parque. O café fica aberto até mais tarde — vou precisar de companhia no turno extra."

    show akira neutro at right with dissolve
    a "Eu... tenho dois ingressos para a apresentação de koto às oito."
    show akira pensativo with dissolve
    a "Se você quiser ir."

    show sakura triste with dissolve
    s "Akira, que oportuno."

    eu "(Os dois olhando para mim ao mesmo tempo. Respira.)"

    menu:
        "Ficar com a Sakura no turno extra":
            $ somar_afeicao("sakura", 3)
            $ flag_foi_festival_com_sakura = True
            hide akira with dissolve
            show sakura feliz with dissolve
            s "Sério? Obrigada. A gente fecha às onze e ainda dá tempo de ver os últimos fogos."

            scene bg cafe noite with fade
            play music "audio/sakura_theme.ogg" fadein 2.0
            show sakura corada at center with dissolve
            s "Olha pela janela. As pétalas estão caindo direto na vidraça."
            s "É... meio mágico, não é?"
            eu "(É. E não é só a janela.)"

        "Aceitar o ingresso do Akira":
            $ somar_afeicao("akira", 3)
            $ flag_foi_festival_com_akira = True
            hide sakura with dissolve
            show akira sorrindo with dissolve
            a "Ótimo. Encontro você na entrada leste, oito em ponto."

            scene bg parque with fade
            play music "audio/festival.ogg" fadein 2.0
            show akira neutro at center with dissolve
            a "A cerejeira do meio tem mais de cem anos. Meu avô vinha aqui com a minha avó."
            show akira pensativo with dissolve
            a "Eu não conto isso para qualquer pessoa."
            eu "(O coração acelera mais que devia.)"

        "Tentar ir nos dois — ajudar a Sakura até as 19h e correr para o festival":
            $ somar_afeicao("sakura", 1)
            $ somar_afeicao("akira", 1)
            n "Você passa o dia tentando agradar os dois. Termina exausto(a) e sem realmente curtir nem o café nem o festival."
            eu "(Talvez na próxima eu escolha melhor.)"

    jump dia4


# =========================================================================
#  DIA 4 — A conversa decisiva
# =========================================================================
label dia4:

    scene bg cafe noite with fade
    play music "audio/theme.ogg" fadein 1.5

    n "Última noite da semana. O café está vazio."

    if flag_foi_festival_com_sakura:
        show sakura corada at center with dissolve
        s "Sobre ontem... obrigada por ter ficado."
        s "Eu queria perguntar uma coisa, mas perdi a coragem três vezes hoje."
        menu:
            "Pergunta agora então":
                $ somar_afeicao("sakura", 2)
                show sakura feliz with dissolve
                s "Você... toparia sair comigo numa folga? Sem ser café, sem ser trabalho?"
                eu "Sim."
            "Sorrir e não pressionar":
                $ somar_afeicao("sakura", 1)

    elif flag_foi_festival_com_akira:
        show akira sorrindo at center with dissolve
        a "Eu não falo muito, mas ontem eu falei com você por duas horas seguidas."
        a "Isso foi raro. Eu queria que se repetisse."
        menu:
            "Sentar ao lado dele e abrir o livro junto":
                $ somar_afeicao("akira", 2)
                a "..."
                a "Que bom."
            "Sorrir e dizer 'amanhã, na mesa do canto'":
                $ somar_afeicao("akira", 1)

    else:
        show sakura neutra at left with dissolve
        show akira neutro at right with dissolve
        s "Foi uma boa primeira semana com você por aqui."
        a "Concordo."
        n "Os três conversam sobre música, livros e clientes estranhos. A noite passa leve, sem peso de escolha."

    # --- Decisão de rota ---
    $ rota_atual = decidir_rota()

    if rota_atual == "sakura":
        jump final_sakura
    elif rota_atual == "akira":
        jump final_akira
    else:
        jump final_amizade
`}
      />

      <h2>6. Os três finais — routes.rpy</h2>
      <p>
        Cada final tem o mesmo esqueleto: trilha sentimental, uma cena
        íntima, um diálogo de fechamento e o registro no <code>persistent</code>
        para a galeria de finais desbloqueados.
      </p>

      <CodeBlock
        language="python"
        title="game/routes.rpy"
        code={`# routes.rpy — os três finais condicionais

# ----------------------------- ROTA SAKURA -------------------------------
label final_sakura:
    scene bg parque with fade
    play music "audio/ending_warm.ogg" fadein 2.5

    show sakura corada at center with dissolve
    s "Eu sabia que ia gostar de você desde o sininho do primeiro dia."
    s "Mas não imaginei que ia ficar assim... feliz."

    eu "Eu também não."

    show sakura feliz with dissolve
    s "Vamos abrir um café juntos um dia? Pequeno, com piano de fundo?"
    eu "Vamos."

    n "As pétalas caem devagar. Ninguém precisa dizer mais nada."

    $ persistent.final_sakura_unlocked = True

    scene black with fade
    centered "{size=+10}{color=#ff8fb1}Final A — Doce Espresso{/color}{/size}"
    pause 3.0
    return


# ------------------------------ ROTA AKIRA -------------------------------
label final_akira:
    scene bg cafe noite with fade
    play music "audio/ending_warm.ogg" fadein 2.5

    show akira sorrindo at center with dissolve
    a "Eu trouxe um livro novo. É de poesia contemporânea."
    a "Pensei em ler em voz alta — se você não rir."

    eu "Não vou rir."

    show akira neutro with dissolve
    a "{i}'A xícara entre nós dois esfriou,{w=0.4}{nw}"
    extend "{i} mas o café continuou quente nas palavras.'{/i}"

    n "Ele fecha o livro devagar. Pela primeira vez, sustenta o seu olhar."

    $ persistent.final_akira_unlocked = True

    scene black with fade
    centered "{size=+10}{color=#7aa6ff}Final B — A Mesa do Canto{/color}{/size}"
    pause 3.0
    return


# ----------------------------- ROTA AMIZADE ------------------------------
label final_amizade:
    scene bg cafe dia with fade
    play music "audio/theme.ogg" fadein 2.5

    show sakura feliz at left with dissolve
    show akira sorrindo at right with dissolve

    s "Selfie com o time inteiro?"
    a "...só uma."

    eu "Combinado: a gente tira a foto, mas o Akira escolhe o filtro."

    n "A campainha toca. Outro cliente entra. A semana termina onde começou — com café, livros e gente boa."

    $ persistent.final_amizade_unlocked = True

    scene black with fade
    centered "{size=+10}{color=#dcd6e6}Final C — Mesma Mesa, Outra Xícara{/color}{/size}"
    pause 3.0
    return
`}
      />

      <h2>7. Tela de status — screens_extra.rpy</h2>
      <p>
        Uma barrinha discreta no canto superior direito mostra ao jogador
        como está sua relação com cada personagem. É overlay — aparece em
        todas as cenas exceto nos finais.
      </p>

      <CodeBlock
        language="python"
        title="game/screens_extra.rpy"
        code={`# screens_extra.rpy — overlay de status do(a) protagonista

screen status_afeicao():
    zorder 50
    frame:
        background "#1a1029cc"
        xalign 1.0
        yalign 0.0
        xmargin 12
        ymargin 12
        xpadding 14
        ypadding 10

        vbox:
            spacing 6
            text "Afeição" size 14 color "#dcd6e6"

            hbox:
                spacing 6
                text "Sakura" size 12 color COR_SAKURA
                bar:
                    value AnimatedValue(value=afeicao["sakura"], range=10, delay=0.4)
                    xmaximum 110
                    ymaximum 10

            hbox:
                spacing 6
                text "Akira " size 12 color COR_AKURA
                bar:
                    value AnimatedValue(value=afeicao["akira"], range=10, delay=0.4)
                    xmaximum 110
                    ymaximum 10

# Mostra a screen automaticamente a partir do início, exceto nos finais
init python:
    config.overlay_screens.append("status_afeicao")
`}
      />

      <h2>8. Customização visual — gui.rpy</h2>
      <p>
        Trocas mínimas no <code>gui.rpy</code> deixam o tema rosa-lavanda
        condizente com o café. Edite só estas linhas — o resto pode ficar
        como está.
      </p>

      <CodeBlock
        language="python"
        title="trecho de game/gui.rpy"
        code={`# Cores principais — tema Sakura Café
define gui.accent_color = '#ff8fb1'
define gui.idle_color = '#cdb6d6'
define gui.idle_small_color = '#a695b3'
define gui.hover_color = '#ffd1e0'
define gui.selected_color = '#ffffff'
define gui.insensitive_color = '#6a5d75'

define gui.muted_color = '#705f86'
define gui.hover_muted_color = '#8c7ba1'

# Fontes
define gui.text_font = "DejaVuSans.ttf"
define gui.name_text_font = "DejaVuSans-Bold.ttf"
define gui.interface_text_font = "DejaVuSans.ttf"

# Textbox semi-transparente lavanda
define gui.textbox_height = 220
define gui.textbox_yalign = 1.0

# Tamanho do texto base
define gui.text_size = 28
define gui.name_text_size = 32
`}
      />

      <h2>9. Trilha sonora sugerida (royalty-free)</h2>
      <CommandTable
        title="Faixas para baixar e renomear como audio/*.ogg"
        variations={[
          {
            cmd: "theme.ogg",
            desc: "Loop calmo de café — Lo-fi piano. Sugestão: Kevin MacLeod 'Carefree'.",
            output: "Fonte: incompetech.com (CC-BY 4.0)",
          },
          {
            cmd: "sakura_theme.ogg",
            desc: "Piano leve com cordas — clima romântico-suave.",
            output: "Fonte: pixabay.com/music (Pixabay License)",
          },
          {
            cmd: "akira_theme.ogg",
            desc: "Violão dedilhado, melancólico, levemente jazz.",
            output: "Fonte: freemusicarchive.org (CC-BY 4.0)",
          },
          {
            cmd: "festival.ogg",
            desc: "Koto + flauta shakuhachi — clima de festival japonês.",
            output: "Fonte: opengameart.org (CC0)",
          },
          {
            cmd: "ending_warm.ogg",
            desc: "Piano emotivo para os finais felizes.",
            output: "Fonte: pixabay.com/music (Pixabay License)",
          },
          {
            cmd: "sfx_door_bell.ogg",
            desc: "Sininho de porta de loja.",
            output: "Fonte: freesound.org (CC-BY 3.0)",
          },
          {
            cmd: "sfx_cup.ogg",
            desc: "Xícara de porcelana batendo no pires.",
            output: "Fonte: freesound.org (CC0)",
          },
          {
            cmd: "sfx_footsteps.ogg",
            desc: "Passos correndo em piso de cerâmica.",
            output: "Fonte: freesound.org (CC0)",
          },
        ]}
      />

      <AlertBox type="warning" title="Atenção a licenças de música">
        Mesmo músicas "grátis" exigem crédito. Sempre cole a URL da faixa, o
        nome do autor e a licença em <code>game/credits.rpy</code> ou no
        <code> README</code>. Se você for vender no Steam ou Play Store,
        verifique se a licença permite uso comercial — Pixabay e CC0 sim,
        algumas CC-BY-NC NÃO.
      </AlertBox>

      <h2>10. Rodando o projeto pela primeira vez</h2>
      <p>
        Com a pasta <code>sakura-cafe/</code> montada, abra o Launcher,
        clique em <em>Refresh</em> e selecione o projeto. Antes de tudo,
        rode o <code>lint</code> para checar que não há referência quebrada
        a personagem ou imagem.
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Validar todo o projeto (sintaxe, imagens, áudios)",
            cmd: "renpy.exe . lint",
            out: `Statistics:

The game contains 132 menus, 1849 words and 287 lines of dialogue.
The game contains 14 screens.

Lint is not a substitute for thorough testing.
Remember to update Ren'Py before releasing. New releases fix bugs and improve compatibility.`,
            outType: "success",
          },
          {
            comment: "Rodar a janela do jogo direto pelo CLI",
            cmd: "renpy.exe .",
            out: "Janela do Sakura Café abre em 1920x1080. Música 'theme.ogg' começa a tocar.",
            outType: "info",
          },
          {
            comment: "Compilar .rpy em .rpyc para distribuição",
            cmd: "renpy.exe . compile",
            out: `Compiling script.rpy ... done.
Compiling characters.rpy ... done.
Compiling routes.rpy ... done.
Compiling screens_extra.rpy ... done.`,
            outType: "success",
          },
        ]}
      />

      <PracticeBox
        title="Coloque o jogo de pé em 15 minutos"
        goal="Rodar o Sakura Café com placeholders e ver os 3 finais funcionando."
        steps={[
          "Abra o Launcher → New → nomeie 'sakura-cafe' → resolução 1920x1080.",
          "Substitua os 5 arquivos .rpy gerados pelos códigos desta página (script, characters, variables, routes, screens_extra).",
          "Edite o gui.rpy aplicando as cores rosa-lavanda do bloco 8.",
          "Crie pastas vazias /audio e /images dentro de game/ — o Ren'Py vai mostrar quadrados rosa no lugar das imagens, sem crashar.",
          "No Launcher, clique em 'Lint' e corrija qualquer erro vermelho antes de rodar.",
          "Clique em Launch Project e jogue até o final — escolhendo 'corra atrás dele' e 'aceite o ingresso' você desbloqueia o final Akira.",
        ]}
        verify="Ao terminar, o título 'Final B — A Mesa do Canto' aparece em azul. Reabra o jogo e a barrinha 'Akira' começa em 0 — mas no menu principal a galeria mostra o final desbloqueado (lendo persistent.final_akira_unlocked)."
      />

      <h2>11. Build para PC — Windows / Mac / Linux</h2>
      <p>
        O Launcher tem um botão grande chamado <em>Build Distributions</em>.
        Clique, marque os 3 sistemas e aguarde. A saída cai em{" "}
        <code>~/renpy-projects/sakura-cafe-dists/</code>.
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Build pela linha de comando (sem abrir Launcher)",
            cmd: "renpy.exe launcher distribute sakura-cafe",
            out: `Building distributions for sakura-cafe...
  - sakura-cafe-1.0-pc.zip      (148 MB) [windows + linux]
  - sakura-cafe-1.0-mac.zip     (152 MB)
  - sakura-cafe-1.0-market.zip  (149 MB) [steam/itch]
Done. Outputs in ~/renpy-projects/sakura-cafe-dists/`,
            outType: "success",
          },
          {
            comment: "Listar o que foi gerado",
            cmd: "ls -lh ~/renpy-projects/sakura-cafe-dists/",
            out: `total 596M
-rw-r--r-- 1 dev dev 148M Jun 14 21:02 sakura-cafe-1.0-pc.zip
-rw-r--r-- 1 dev dev 152M Jun 14 21:03 sakura-cafe-1.0-mac.zip
-rw-r--r-- 1 dev dev 149M Jun 14 21:03 sakura-cafe-1.0-market.zip
-rw-r--r-- 1 dev dev 147M Jun 14 21:04 sakura-cafe-1.0-linux.tar.bz2`,
            outType: "info",
          },
        ]}
      />

      <h2>12. Build para Web (HTML5) — itch.io</h2>
      <p>
        Ren'Py exporta para Web com <code>renpy.exe . web</code>. O resultado
        é uma pasta com <code>index.html</code> + assets, pronta para subir
        no itch.io marcando "This file will be played in the browser".
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            cmd: "renpy.exe . web_build",
            out: `Building web distribution for sakura-cafe...
Compressing audio with vorbis (quality 4) ...
Compressing images to WebP (quality 80) ...
Output: ~/renpy-projects/sakura-cafe-dists/sakura-cafe-1.0-web.zip (62 MB)`,
            outType: "success",
          },
          {
            comment: "Testar localmente antes de subir",
            cmd: "cd ~/renpy-projects/sakura-cafe-dists/web && python3 -m http.server 8000",
            out: `Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
127.0.0.1 - - [14/Jun/2026 21:18:42] "GET /index.html HTTP/1.1" 200 -`,
            outType: "info",
          },
        ]}
      />

      <AlertBox type="warning" title="Web build é mais leve mas tem armadilhas">
        O navegador NÃO suporta áudio MP3 em todas as plataformas — converta
        tudo para OGG. Saves ficam no <em>localStorage</em>, então um usuário
        que limpa o cache perde tudo. E vídeo (movie) só funciona em formato
        WebM/VP9. Quando em dúvida, rode <code>renpy.exe . web_build</code>
        com a flag <code>--lint</code> e leia os warnings.
      </AlertBox>

      <h2>13. Build para Android — RAPT e Play Store</h2>
      <p>
        Para Android você precisa do RAPT (Ren'Py Android Packaging Tool),
        que vem junto com o SDK. Configure uma vez seu <em>keystore</em> e
        depois é só pedir o build.
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Configurar Android pela primeira vez (1 vez por máquina)",
            cmd: "renpy.exe launcher android_build install_sdk",
            out: `Installing Android SDK + JDK 17 + RAPT (~1.6 GB)...
[####################] 100%
SDK pronto em ~/.renpy/rapt/`,
            outType: "info",
          },
          {
            comment: "Configurar o projeto (keystore, ícone, package name)",
            cmd: "renpy.exe launcher android_build configure sakura-cafe",
            out: `Package: com.seunome.sakuracafe
Version code: 1
Permissions: INTERNET (para abrir links externos)
Keystore: ~/.android/sakura-keystore.jks (criado agora)`,
            outType: "info",
          },
          {
            comment: "Buildar APK + AAB (Play Store exige AAB)",
            cmd: "renpy.exe launcher android_build build sakura-cafe --bundle",
            out: `Building Sakura Café for Android...
  Compiling Python code...
  Packaging assets (148 MB → 92 MB com compressão)...
  Signing with sakura-keystore.jks ...
  ✓ sakura-cafe-1.0-release.apk
  ✓ sakura-cafe-1.0-release.aab
Saída: ~/renpy-projects/sakura-cafe-dists/android/`,
            outType: "success",
          },
          {
            comment: "Instalar APK direto no celular plugado via USB",
            cmd: "adb install -r ~/renpy-projects/sakura-cafe-dists/android/sakura-cafe-1.0-release.apk",
            out: `Performing Streamed Install
Success`,
            outType: "success",
          },
        ]}
      />

      <PracticeBox
        title="Suba o Sakura Café no itch.io e jogue do celular"
        goal="Disponibilizar a sua VN para 3 amigos testarem por link público em menos de 1 hora."
        steps={[
          "Crie conta gratuita em itch.io.",
          "Clique em Upload new project → Title 'Sakura Café (demo)'.",
          "Faça o web_build e suba o ZIP marcando 'This file will be played in the browser'.",
          "Defina viewport 1280x720, aba Embed Options.",
          "Marque Visibility → Restricted (só quem tem o link vê).",
          "Copie o link e mande no Discord para 3 amigos. Peça feedback honesto sobre os 3 finais.",
        ]}
        verify="Os amigos conseguem abrir o link e ouvir a música 'theme.ogg' na tela inicial. Pedir para um deles desbloquear o Final C (amizade) sem nenhuma orientação prévia."
      />

      <h2>14. Próximos passos — usar isto como base do seu jogo</h2>
      <p>
        O esqueleto pronto deste capítulo é{" "}
        <strong>genérico de propósito</strong>. Para virar o seu jogo:
      </p>
      <ul>
        <li>
          <strong>Renomeie</strong> as personagens em{" "}
          <code>characters.rpy</code> e procure-substitua os identificadores{" "}
          <code>s</code> e <code>a</code> nos diálogos. O VS Code com Find &
          Replace em pasta resolve em 30 segundos.
        </li>
        <li>
          <strong>Adicione um terceiro romance</strong> criando{" "}
          <code>"hana": 0</code> no dicionário <code>afeicao</code>, novo
          define <code>h = Character(...)</code>, e copie um label de rota
          como <code>final_hana</code>.
        </li>
        <li>
          <strong>Estenda para 7 dias</strong> duplicando <code>dia2</code> e{" "}
          <code>dia3</code>; o sistema de afeição já lida com clamps de 0 a
          10.
        </li>
        <li>
          <strong>Plugue um inventário</strong> seguindo a página{" "}
          <em>Inventário</em> deste guia: dá para entregar presentes que
          mudam o ganho de afeição.
        </li>
        <li>
          <strong>Internacionalize</strong> com{" "}
          <code>renpy.exe . translate english</code> e adicione legenda em
          inglês — útil para vender na Steam global.
        </li>
      </ul>

      <AlertBox type="success" title="Você terminou o guia inteiro de Ren'Py">
        Se você chegou até aqui, jogou seu próprio Sakura Café e fez o build
        para Web, parabéns: você passou de leitor para desenvolvedor de
        Visual Novel. O próximo passo é abrir o seu projeto pessoal — pode
        ser uma versão do Sakura Café com seus amigos como personagens, ou
        algo totalmente novo. Compartilhe o resultado na comunidade
        lemmasoft, marca a hashtag <em>#renpy</em> no Bluesky/Twitter e
        venha contar como foi.
      </AlertBox>
    </PageContainer>
  );
}
