import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Rooms() {
  return (
    <PageContainer
      title="Image Gallery, Music Room & Replay"
      subtitle="As 3 'salas extras' clássicas de toda VN: galeria de CGs desbloqueados, music room com a OST inteira e replay de cenas. Liberadas conforme o jogador completa rotas no Sakura Café."
      difficulty="intermediario"
      timeToRead="18 min"
      prompt="extras/rooms"
    >
      <AlertBox type="info" title="Por que existem essas 3 salas">
        Todo otome / VN comercial tem 3 telas extras no menu principal:{" "}
        <strong>Galeria</strong> (CGs especiais que o jogador desbloqueou),{" "}
        <strong>Music Room</strong> (todas as músicas) e{" "}
        <strong>Replay</strong> (rejogar cenas marcantes sem ter que
        começar do zero). Ren'Py vem com classes prontas:{" "}
        <code>Gallery</code>, <code>MusicRoom</code> e o sistema de
        labels de replay.
      </AlertBox>

      <h2>1. Image Gallery — CGs desbloqueados</h2>
      <p>
        A classe <code>Gallery</code> mantém um catálogo de CGs e regras
        de desbloqueio. O jogador vê thumbs (placeholder bloqueado) e ao
        liberar pode clicar para ver fullscreen.
      </p>

      <CodeBlock
        language="python"
        title="game/gallery.rpy"
        code={`init python:
    g = Gallery()

    # ────── Configurações visuais ──────
    g.transition = dissolve
    g.locked_button = "gui/gallery/locked.png"
    g.unlocked_button = "gui/gallery/unlocked.png"
    g.navigation = True

    # ────── CGs da rota Sakura ──────
    g.button("cg_sakura_1")
    g.condition("persistent.unlock_sakura_cg1")
    g.image("images/cg/sakura_cafe_primeira_visita.png")

    g.button("cg_sakura_2")
    g.condition("persistent.unlock_sakura_cg2")
    g.image("images/cg/sakura_chuva.png")
    g.image("images/cg/sakura_chuva_close.png")  # variantes da MESMA cena

    # ────── CGs da rota Yuki ──────
    g.button("cg_yuki_1")
    g.condition("persistent.unlock_yuki_cg1")
    g.image("images/cg/yuki_biblioteca.png")

    # ────── CGs da rota Akira ──────
    g.button("cg_akira_1")
    g.condition("persistent.unlock_akira_cg1")
    g.image("images/cg/akira_telhado.png")

    g.button("cg_akira_2")
    g.condition("persistent.unlock_akira_cg2 or persistent.akira_route_complete")
    g.image("images/cg/akira_promessa.png")`}
      />

      <h2>2. Liberando CGs durante o jogo</h2>
      <p>
        Toda vez que uma cena chave roda, marque a flag persistent. Ren'Py
        salva automaticamente essas variáveis entre runs:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy — cena que libera CG"
        code={`label cena_sakura_chuva:
    scene cg_sakura_chuva
    pause 1.0

    s "Você... também esqueceu o guarda-chuva?"
    s "Vem, divide o meu."

    # libera o CG na galeria
    $ persistent.unlock_sakura_cg2 = True

    # opcional: notifica o jogador
    $ renpy.notify("CG desbloqueado: Chuva no caminho de casa")

    scene bg cafe
    return`}
      />

      <h2>3. Screen da galeria — visual de grade</h2>

      <CodeBlock
        language="python"
        title="game/screens.rpy"
        code={`screen gallery():
    tag menu

    add "gui/gallery/bg.png"

    # Botão de voltar
    textbutton _("Voltar") action ShowMenu("main_menu") xpos 40 ypos 40

    # Grid 3x3 com os botões da galeria
    grid 3 3:
        spacing 24
        xalign 0.5  yalign 0.5

        # Cada add chama g.make_button(name, idle, hover)
        add g.make_button("cg_sakura_1",
            "gui/gallery/sakura_1_idle.png",
            "gui/gallery/sakura_1_hover.png",
            xalign=0.5, yalign=0.5)

        add g.make_button("cg_sakura_2",
            "gui/gallery/sakura_2_idle.png",
            "gui/gallery/sakura_2_hover.png")

        add g.make_button("cg_yuki_1",
            "gui/gallery/yuki_1_idle.png",
            "gui/gallery/yuki_1_hover.png")

        add g.make_button("cg_akira_1",
            "gui/gallery/akira_1_idle.png",
            "gui/gallery/akira_1_hover.png")

        add g.make_button("cg_akira_2",
            "gui/gallery/akira_2_idle.png",
            "gui/gallery/akira_2_hover.png")

        # Slots vazios (placeholder)
        null
        null
        null
        null`}
      />

      <h2>4. Adicionando "Galeria" ao menu principal</h2>

      <CodeBlock
        language="python"
        title="game/screens.rpy"
        code={`screen navigation():
    vbox:
        style_prefix "navigation"
        xpos gui.navigation_xpos
        yalign 0.5
        spacing gui.navigation_spacing

        if main_menu:
            textbutton _("Iniciar") action Start()
        else:
            textbutton _("Histórico") action ShowMenu("history")
            textbutton _("Salvar") action ShowMenu("save")

        textbutton _("Carregar") action ShowMenu("load")
        textbutton _("Preferências") action ShowMenu("preferences")

        if main_menu:
            # Só aparece se PELO MENOS 1 CG estiver liberado
            if g.unlocked_count() > 0:
                textbutton _("Galeria") action ShowMenu("gallery")
            if mr.unlocked_count() > 0:
                textbutton _("Music Room") action ShowMenu("music_room")
            textbutton _("Sobre") action ShowMenu("about")
            textbutton _("Sair") action Quit(confirm=not main_menu)`}
      />

      <h2>5. Music Room — toda a OST</h2>

      <CodeBlock
        language="python"
        title="game/music_room.rpy"
        code={`init python:
    mr = MusicRoom(fadeout=2.0, fadein=1.0)

    # Adiciona faixas — sempre desbloqueadas (always_unlocked=True)
    # ou condicionais via persistent.X
    mr.add("audio/music/tema_principal.ogg",
        always_unlocked=True)

    mr.add("audio/music/cafe_dia.ogg",
        always_unlocked=True)

    mr.add("audio/music/sakura_theme.ogg",
        always_unlocked=False)  # libera ao tocar a 1a vez

    mr.add("audio/music/yuki_theme.ogg",
        always_unlocked=False)

    mr.add("audio/music/akira_battle.ogg",
        always_unlocked=False)

    mr.add("audio/music/credits_song.ogg",
        always_unlocked=False)`}
      />

      <p>
        A faixa fica desbloqueada AUTOMATICAMENTE quando ela toca pela
        primeira vez via <code>play music "audio/music/X.ogg"</code>{" "}
        durante o jogo. Não precisa de flag manual.
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy — screen music_room"
        code={`screen music_room():
    tag menu
    add "gui/musicroom/bg.png"

    textbutton _("Voltar") action ShowMenu("main_menu") xpos 40 ypos 40

    vbox:
        xalign 0.5  yalign 0.5
        spacing 8

        text "♪ Sakura Café — OST" size 36 color "#ffaacc" xalign 0.5
        null height 20

        textbutton "01. Tema Principal" action mr.Play("audio/music/tema_principal.ogg")
        textbutton "02. Café Durante o Dia" action mr.Play("audio/music/cafe_dia.ogg")

        if persistent.music_unlocked_sakura:
            textbutton "03. Sakura's Theme" action mr.Play("audio/music/sakura_theme.ogg")
        else:
            textbutton "03. ???" action NullAction() text_color "#666"

        if persistent.music_unlocked_yuki:
            textbutton "04. Yuki's Theme" action mr.Play("audio/music/yuki_theme.ogg")
        else:
            textbutton "04. ???" action NullAction() text_color "#666"

        null height 20

        hbox:
            spacing 16
            xalign 0.5
            textbutton "▶ Play All" action mr.PlayAll()
            textbutton "⏹ Stop" action mr.Stop()
            textbutton "⏭ Próxima" action mr.Next()`}
      />

      <h2>6. Replay — rejogar cenas marcantes</h2>
      <p>
        Replay é simplesmente <code>renpy.call_replay(label)</code>:
        chama um label como se fosse uma cena nova, com{" "}
        <code>_in_replay = True</code> setado para você poder pular
        partes que dependem de variáveis do save real.
      </p>

      <CodeBlock
        language="python"
        title="game/replay.rpy"
        code={`# ────── Labels marcados como replayable ──────
label sakura_confissao:
    scene bg parque
    show sakura corada at center
    s "Eu... eu queria te dizer uma coisa há semanas."
    s "Você quer ser meu(minha) namorado(a)?"

    if not _in_replay:
        # Lógica que SÓ roda fora do replay (relacionamento real)
        $ persistent.sakura_confessou = True
        $ afeicao_sakura += 10
    return

label yuki_briga:
    scene bg escola
    show yuki braba
    y "Não fala mais comigo!"
    return

# Defaults para liberar nos screens
default persistent.replay_sakura_confissao = False
default persistent.replay_yuki_briga = False`}
      />

      <CodeBlock
        language="python"
        title="game/screens.rpy — screen de replay"
        code={`screen replay_room():
    tag menu
    add "gui/replay/bg.png"

    textbutton _("Voltar") action ShowMenu("main_menu") xpos 40 ypos 40

    vbox:
        xalign 0.5  yalign 0.5
        spacing 12

        text "Replay de Cenas" size 36 color "#ffaacc" xalign 0.5

        if persistent.replay_sakura_confissao:
            textbutton "Sakura — A Confissão (Cap. 5)":
                action Replay("sakura_confissao",
                    locked=False, scope={})
        else:
            textbutton "??? Bloqueada" action NullAction()

        if persistent.replay_yuki_briga:
            textbutton "Yuki — A Briga (Cap. 3)":
                action Replay("yuki_briga", locked=False, scope={})
        else:
            textbutton "??? Bloqueada" action NullAction()`}
      />

      <h2>7. Marcando o replay no momento certo</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label cap5_sakura:
    # ... outras coisas
    call sakura_confissao

    # Libera o replay no menu
    $ persistent.replay_sakura_confissao = True
    $ renpy.notify("Replay desbloqueado: A Confissão")
    return`}
      />

      <h2>8. Tabela de Actions úteis</h2>

      <CommandTable
        title="Actions para Gallery / MusicRoom / Replay"
        variations={[
          {
            cmd: "g.Toggle()",
            desc: "Liga/desliga slideshow automático na galeria.",
            output: "textbutton 'Slideshow' action g.Toggle()",
          },
          {
            cmd: "g.Next() / g.Previous()",
            desc: "Navega entre CGs liberados.",
            output: "textbutton '>' action g.Next()",
          },
          {
            cmd: "mr.Play(filename)",
            desc: "Toca uma faixa específica (e libera se never tocada).",
            output: 'mr.Play("audio/music/sakura.ogg")',
          },
          {
            cmd: "mr.RandomPlay()",
            desc: "Toca aleatoriamente entre as desbloqueadas.",
            output: "shuffle automático",
          },
          {
            cmd: "Replay(label, scope={})",
            desc: "Reexecuta um label fora da timeline normal.",
            output: 'Replay("sakura_confissao")',
          },
          {
            cmd: "_in_replay",
            desc: "Variável True dentro de uma replay session.",
            output: "if not _in_replay: $ flag = True",
          },
        ]}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        user="dev"
        host="vn-studio"
        lines={[
          {
            comment: "checando estado dos persistent flags",
            cmd: "renpy.exe . dump_persistent",
            out: `unlock_sakura_cg1     = True
unlock_sakura_cg2     = True
unlock_yuki_cg1       = False
unlock_akira_cg1      = True
unlock_akira_cg2      = False
music_unlocked_sakura = True
music_unlocked_yuki   = False
replay_sakura_confissao = True
replay_yuki_briga     = False

[Gallery] 3 / 5 CGs desbloqueados
[MusicRoom] 4 / 6 faixas desbloqueadas
[Replay] 1 / 2 cenas disponíveis`,
            outType: "info",
          },
        ]}
      />

      <PracticeBox
        title="Adicionar Galeria, Music Room e 1 Replay ao Sakura Café"
        goal="Ter os 3 menus extras funcionais com ao menos 2 itens cada e visíveis no menu principal só após desbloqueio."
        steps={[
          "Crie game/gallery.rpy declarando 2 CGs com persistent.unlock_X.",
          "Crie game/music_room.rpy com 3 faixas (1 always_unlocked, 2 condicionais).",
          "Em game/script.rpy, marque persistent.unlock_X = True ao executar a cena correspondente.",
          "Adicione no screen navigation() if g.unlocked_count() > 0: textbutton 'Galeria'.",
          "Crie 1 label 'cena_replay_demo' e botão Replay(...) num screen replay_room().",
        ]}
        verify="No 1º run não aparecem botões. Após jogar a cena, ao voltar ao menu principal os botões 'Galeria' e 'Music Room' aparecem e abrem suas telas com os itens desbloqueados."
      >
        <CodeBlock
          language="python"
          title="game/extras.rpy (gabarito mínimo)"
          code={`init python:
    g = Gallery()
    g.button("cg1")
    g.condition("persistent.unlock_cg1")
    g.image("images/cg/cafe_primeiro_dia.png")

    mr = MusicRoom(fadeout=1.0)
    mr.add("audio/music/tema.ogg", always_unlocked=True)
    mr.add("audio/music/sakura.ogg")  # libera ao tocar

label cena_demo:
    scene bg cafe
    s "Hoje é seu primeiro dia!"
    $ persistent.unlock_cg1 = True
    $ renpy.notify("CG liberado!")
    return

screen gallery():
    tag menu
    textbutton _("Voltar") action ShowMenu("main_menu") xpos 40 ypos 40
    add g.make_button("cg1",
        "gui/locked.png", "gui/cg1_thumb.png",
        xalign=0.5, yalign=0.5)`}
        />
      </PracticeBox>

      <OutputBlock label="resumo das 3 salas" type="info">
{`GALLERY    Gallery() + g.button + g.condition + g.image
            screen gallery() com g.make_button
            persistent.unlock_X = True nas cenas

MUSIC ROOM  MusicRoom() + mr.add(file, always_unlocked=)
            libera SOZINHA quando música toca via 'play music'
            screen music_room() com textbutton mr.Play(...)

REPLAY      label normal + Replay("nome", scope={})
            'if not _in_replay:' para gates lógicos
            persistent.replay_X = True após executar 1ª vez`}
      </OutputBlock>

      <AlertBox type="success" title="Bônus: galeria com áudio">
        Cada CG pode ter <code>g.image(img, music="audio/X.ogg")</code> —
        ao abrir a CG fullscreen, toca a música daquela cena. Cria uma
        imersão muito maior na hora de relembrar.
      </AlertBox>
    </PageContainer>
  );
}
