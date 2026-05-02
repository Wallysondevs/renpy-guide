import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Audio() {
  return (
    <PageContainer
      title="Áudio — música, efeitos e canais"
      subtitle="Trilha sonora, efeitos sonoros, canais nativos (music, sound, voice), fade in/out, fila, mixers e formatos suportados pelo Ren'Py 8.x. Tudo o que você precisa para deixar sua VN com som de jogo de verdade."
      difficulty="iniciante"
      timeToRead="14 min"
      prompt="audio-e-voz/audio"
    >
      <AlertBox type="info" title="Por que som importa numa Visual Novel">
        Uma VN sem trilha sonora é uma sequência de slides bonitos. O áudio é
        o que faz o jogador sentir o silêncio do café antes da Sakura abrir a
        porta, ou o coração disparar quando a Akira finalmente fala. Esta
        página cobre <strong>todos</strong> os comandos de áudio do Ren'Py —
        do <code>play music</code> mais simples até canais customizados com
        <code>register_channel</code>.
      </AlertBox>

      <h2>1. Os três canais nativos</h2>
      <p>
        O Ren'Py vem com três canais de áudio prontos para usar. Cada canal
        toca uma coisa por vez, com seu próprio volume (mixer) e
        comportamento padrão de loop:
      </p>

      <CommandTable
        title="Canais nativos do Ren'Py"
        variations={[
          {
            cmd: "music",
            desc: "Trilha sonora de fundo. Por padrão faz LOOP infinito até você dar stop ou trocar.",
            output: "Mixer: music · Loop: True · Sobrevive ao reload (não corta no jump)",
          },
          {
            cmd: "sound",
            desc: "Efeitos sonoros pontuais (sino da porta, suspiro, gota d'água). NÃO faz loop.",
            output: "Mixer: sfx · Loop: False · Curto, dispara e termina",
          },
          {
            cmd: "voice",
            desc: "Voice acting. Liga automaticamente com a próxima linha de diálogo.",
            output: "Mixer: voice · Loop: False · Sincronizado com 'voice' statement",
          },
        ]}
      />

      <h2>2. Tocando música — play, stop, queue</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label start:
    scene bg cafe
    with fade

    # toca a trilha do café em loop, com fade-in suave de 1.5s
    play music "audio/cafe_jazz.ogg" fadein 1.5

    s "Bem-vindo(a) ao Sakura Café!"
    s "Espero que goste do nosso jazz."

    # quando a Sakura sai, baixa o volume da música
    play music "audio/cafe_jazz.ogg" volume 0.4

    "Sakura desaparece atrás do balcão. A música parece mais distante agora."

    # reset para o volume padrão
    play music "audio/cafe_jazz.ogg" volume 1.0

    # silêncio total com fadeout de 2s
    stop music fadeout 2.0

    "Por um momento, só o tique-taque do relógio."

    # tocar uma faixa nova depois da próxima — queue
    play music "audio/menu_calmo.ogg"
    queue music "audio/menu_intenso.ogg"

    return`}
      />

      <AlertBox type="warning" title="Cuidado com o caminho">
        Os arquivos vão dentro de <code>game/audio/</code> (ou qualquer
        subpasta). O Ren'Py procura <strong>sempre</strong> a partir de{" "}
        <code>game/</code>, então você escreve apenas{" "}
        <code>"audio/cafe_jazz.ogg"</code>, sem barra inicial. Se errar o
        caminho, o lint vai apontar e o jogo silenciosamente não toca nada.
      </AlertBox>

      <h2>3. Efeitos sonoros (sound)</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label cena_porta:
    scene bg cafe
    with dissolve

    # som curto, dispara e morre
    play sound "audio/sfx/sino_porta.ogg"

    show sakura surpresa at right
    with moveinright

    s "Ah! Mais um cliente!"

    # vários efeitos em sequência usando o canal 'sound2' (ver seção 6)
    play sound "audio/sfx/passos.ogg"
    pause 0.6
    play sound "audio/sfx/xicara.ogg"

    s "Quer um cappuccino?"
    return`}
      />

      <h2>4. Volume, fadein e fadeout</h2>

      <CommandTable
        title="Sintaxe completa do play / stop"
        variations={[
          {
            cmd: 'play music "trilha.ogg"',
            desc: "Toca imediatamente, em loop (canal music).",
            output: "Substitui qualquer música anterior no mesmo canal.",
          },
          {
            cmd: 'play music "trilha.ogg" fadein 2.0',
            desc: "Sobe o volume de 0 a 100% em 2 segundos (efeito 'liga rádio').",
            output: "Útil para começar capítulos sem susto.",
          },
          {
            cmd: 'play music "trilha.ogg" fadeout 1.5 fadein 1.5',
            desc: "Cross-fade — música anterior some enquanto a nova entra.",
            output: "Transição suave entre cenas (manhã → tarde).",
          },
          {
            cmd: 'play music "trilha.ogg" volume 0.5',
            desc: "Toca a 50% do volume. Aceita 0.0 a 1.0.",
            output: "Não substitui o mixer global; é multiplicador local.",
          },
          {
            cmd: "stop music",
            desc: "Para imediatamente.",
            output: "Corte seco — bom para impacto dramático.",
          },
          {
            cmd: "stop music fadeout 2.0",
            desc: "Fade out de 2 segundos antes do silêncio.",
            output: "Padrão para final de capítulo.",
          },
          {
            cmd: 'queue music "trilha2.ogg"',
            desc: "Enfileira sem parar a atual; toca quando a primeira terminar.",
            output: "Útil para playlists sequenciais.",
          },
          {
            cmd: 'queue music ["a.ogg", "b.ogg", "c.ogg"]',
            desc: "Enfileira várias faixas de uma vez (lista Python).",
            output: "Tocam na ordem dada, sem repetir.",
          },
          {
            cmd: 'play music "trilha.ogg" loop',
            desc: "Força loop (já é o default em music, útil em sound).",
            output: "Em sound, faz o efeito ficar repetindo (chuva, vento).",
          },
          {
            cmd: 'play music "trilha.ogg" noloop',
            desc: "Toca uma vez e silencia.",
            output: "Útil para jingles e cinemáticas.",
          },
        ]}
      />

      <h2>5. Apelidos de áudio (audio.NOME)</h2>
      <p>
        Em vez de digitar o caminho completo do arquivo toda hora, defina{" "}
        <strong>apelidos</strong>. Isso facilita trocar a faixa depois sem
        precisar achar e substituir em 200 linhas:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`# define no início do arquivo (fora de qualquer label)
define audio.tema_sakura = "audio/sakura_theme.ogg"
define audio.tema_akira  = "audio/akira_theme.ogg"
define audio.tema_cafe   = "audio/cafe_jazz.ogg"
define audio.sino_porta  = "audio/sfx/sino_porta.ogg"
define audio.xicara      = "audio/sfx/xicara.ogg"

label start:
    play music tema_cafe fadein 1.5
    "Você empurra a porta."
    play sound sino_porta

    show sakura happy
    play music tema_sakura fadeout 1.0 fadein 1.5
    s "Bom dia! Quer um café?"
    return`}
      />

      <AlertBox type="success" title="Por que isso é poderoso">
        Trocar a música tema da Sakura inteira agora é uma linha só — você
        edita <code>audio.tema_sakura</code> e toda a VN passa a usar a nova
        faixa. Esse é o padrão profissional usado em estúdios de VN.
      </AlertBox>

      <h2>6. Canais customizados — register_channel</h2>
      <p>
        Quer tocar dois efeitos sonoros simultâneos? Ou um som ambiente
        contínuo (chuva, ventilador) em paralelo com a música? Crie um canal
        novo:
      </p>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`init python:
    # canal para som ambiente (chuva, vento), com loop, mixer 'sfx'
    renpy.music.register_channel(
        "ambiente",
        mixer="sfx",
        loop=True,
        stop_on_mute=True,
    )

    # canal para um segundo SFX paralelo (gritos, latidos, etc.)
    renpy.music.register_channel(
        "sound2",
        mixer="sfx",
        loop=False,
    )`}
      />

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label cena_chuva:
    scene bg parque_chuva
    with fade

    play ambiente "audio/amb/chuva_forte.ogg" fadein 3.0
    play music   "audio/melancolia.ogg" fadein 2.0

    "A chuva não para. Você procura abrigo embaixo da marquise."

    show yuki triste
    y "Achei que ia ser um dia bom..."

    # trovão pontual no canal sound2, sem cortar nem chuva nem música
    play sound2 "audio/sfx/trovao.ogg"
    pause 0.4

    y "Ai!"

    stop ambiente fadeout 2.0
    stop music fadeout 1.5
    return`}
      />

      <h2>7. Mixers e configurações de áudio</h2>
      <p>
        Cada canal pertence a um <strong>mixer</strong> — um grupo de volume
        controlado pelo jogador no menu de preferências. O Ren'Py vem com 3
        mixers padrão:
      </p>

      <CommandTable
        title="Mixers padrão"
        variations={[
          { cmd: "music", desc: "Volume da trilha sonora.", output: "Slider 'Música' no menu de preferências." },
          { cmd: "sfx", desc: "Volume dos efeitos sonoros.", output: "Slider 'Efeitos sonoros'." },
          { cmd: "voice", desc: "Volume das vozes (dublagem).", output: "Slider 'Voz'." },
        ]}
      />

      <CodeBlock
        language="python"
        title="game/options.rpy — definindo volumes iniciais"
        code={`init python:
    # volume inicial de cada mixer (0.0 a 1.0)
    config.default_music_volume = 0.7
    config.default_sfx_volume   = 0.85
    config.default_voice_volume = 1.0

    # quanto tempo o fade automático leva ao trocar de música
    config.fade_music = 0.5

    # se o jogador clicar mute, para tudo (default True)
    config.has_music = True
    config.has_sound = True
    config.has_voice = True`}
      />

      <h2>8. Formatos suportados</h2>
      <p>
        O Ren'Py 8 aceita praticamente qualquer formato moderno. A escolha
        certa muda <strong>muito</strong> o tamanho final do build:
      </p>

      <CommandTable
        title="Formatos de áudio"
        variations={[
          {
            cmd: ".ogg (Vorbis)",
            desc: "PADRÃO recomendado para música longa. Open-source, ótima compressão.",
            output: "~1 MB por minuto a 128 kbps. Use isso por default.",
          },
          {
            cmd: ".opus",
            desc: "Sucessor do Vorbis. Qualidade superior em bitrates baixos. Suporte a partir do Ren'Py 7.4.",
            output: "~600 KB por minuto a 96 kbps — IDEAL para web/Android.",
          },
          {
            cmd: ".mp3",
            desc: "Funciona, mas não é mais 100% livre de patentes em algumas distros.",
            output: "Prefira OGG/Opus quando possível.",
          },
          {
            cmd: ".wav",
            desc: "Sem compressão — tamanho gigante. Só para SFX MUITO curtos (<1s).",
            output: "Um WAV de 3 minutos = ~30 MB. Não use para música.",
          },
          {
            cmd: ".flac",
            desc: "Sem perdas. Só faz sentido se você for masterizar audiophile.",
            output: "Tamanho ~5x maior que OGG sem ganho perceptível em VN.",
          },
        ]}
      />

      <h2>9. Inspecionando áudio com lint</h2>
      <p>
        O <code>renpy.exe . lint</code> avisa quando você referencia um
        arquivo que não existe ou está com nome errado. Sempre rode antes de
        publicar:
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Validar áudio (e o resto do projeto)",
            cmd: "renpy.exe . lint",
            out: `Ren'Py 8.2.3 lint report, generated 2026-04-25 14:22

game/script.rpy:42 Audio file 'audio/sakura_themee.ogg' is not loadable.
game/script.rpy:88 Audio file 'audio/cafe_jaz.ogg' is not loadable.

Statistics:
  Words of dialogue: 1842
  Audio files: 7 (1 missing!)
  Image files: 14

Lint is not a substitute for thorough testing.`,
            outType: "warning",
          },
        ]}
      />

      <OutputBlock label="Saída ideal — sem warnings" type="success">
{`Ren'Py 8.2.3 lint report, generated 2026-04-25 14:30

Statistics:
  Words of dialogue: 1842
  Audio files: 8
  Image files: 14

Lint is not a substitute for thorough testing.`}
      </OutputBlock>

      <h2>10. Boas práticas</h2>
      <ul>
        <li>
          <strong>Normalize todos os áudios para -14 LUFS</strong> (use
          ferramentas como Audacity ou ffmpeg-loudnorm). Sem isso, uns sons
          ficam estourando enquanto outros ficam inaudíveis.
        </li>
        <li>
          Mantenha <strong>SFX mono</strong> (mais leve) e{" "}
          <strong>música stereo</strong>.
        </li>
        <li>
          Bitrate sugerido: <strong>96 kbps Opus</strong> ou{" "}
          <strong>128 kbps OGG Vorbis</strong> para música; SFX podem ficar a
          64 kbps sem perda perceptível.
        </li>
        <li>
          Sempre use <strong>fadein/fadeout</strong> entre cenas — corte seco
          incomoda o jogador.
        </li>
        <li>
          Crie <strong>apelidos</strong> com <code>define audio.X</code>{" "}
          desde a primeira linha de código.
        </li>
      </ul>

      <PracticeBox
        title="Adicionar trilha e dois SFX ao primeiro café"
        goal="Fazer o jogador entrar no Sakura Café com música ambiente, ouvir o sino da porta e a xícara batendo no balcão."
        steps={[
          "Crie a pasta game/audio/ e dentro dela coloque cafe_jazz.ogg, sino_porta.ogg e xicara.ogg (qualquer arquivo serve para teste).",
          "No topo do script.rpy, defina os apelidos com define audio.tema_cafe, audio.sino_porta e audio.xicara.",
          "Em label start, use play music tema_cafe fadein 1.5 antes do primeiro diálogo.",
          "Adicione play sound sino_porta logo depois da fala 'Você empurra a porta.'",
          "Antes da fala da Sakura sobre o cappuccino, dispare play sound xicara e dê pause 0.4.",
          "Rode renpy.exe . lint para garantir que todos os caminhos estão corretos.",
        ]}
        verify="Ao iniciar o jogo, a música deve subir suavemente, o sino tocar quando a porta abrir e a xícara tilintar antes da Sakura falar do cappuccino."
      />

      <AlertBox type="warning" title="Direitos autorais — leia antes de publicar">
        Música tem dono. Não use trilhas do Spotify, anime ou jogos sem
        licença explícita — sua VN pode ser removida do itch.io ou Steam por
        DMCA. Use bibliotecas livres como{" "}
        <strong>OpenGameArt.org</strong>, <strong>Free Music Archive</strong>,{" "}
        <strong>Incompetech (Kevin MacLeod)</strong> com atribuição correta,
        ou compre na <strong>AudioJungle</strong>. Sempre guarde a licença
        em <code>game/audio/CREDITS.txt</code>.
      </AlertBox>

      <PracticeBox
        title="Cross-fade entre tema do café e tema da Sakura"
        goal="Quando a Sakura entra em cena, a trilha do café some suavemente e o tema dela toma conta."
        steps={[
          "Mantenha o play music tema_cafe fadein 1.5 no início.",
          "Quando aparecer show sakura happy, adicione na linha seguinte: play music tema_sakura fadeout 1.5 fadein 2.0.",
          "Teste: a transição deve ser perceptível mas suave, sem corte abrupto.",
          "Quando a Sakura sair, volte com play music tema_cafe fadeout 1.5 fadein 1.5.",
        ]}
        verify="A música muda junto com a presença da personagem — esse é o truque clássico de VN para criar identidade musical de personagem."
      />
    </PageContainer>
  );
}
