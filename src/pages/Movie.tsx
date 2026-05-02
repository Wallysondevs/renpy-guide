import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Movie() {
  return (
    <PageContainer
      title="Movie — vídeo como displayable e cutscene"
      subtitle="Use Movie() para colocar vídeo como background animado, cutscenes em tela cheia e GIFs animados. Formatos VP8/VP9/WEBM, loop, alpha, eventos de fim de cutscene. Chuva na janela do Sakura Café como BG."
      difficulty="intermediario"
      timeToRead="15 min"
      prompt="audio/movie"
    >
      <AlertBox type="info" title="Vídeo no Ren'Py: dois caminhos">
        A doc oficial mistura tudo numa página só. Na prática você usa
        vídeo de DUAS formas distintas:{" "}
        <strong>(1) cutscene fullscreen</strong> com{" "}
        <code>renpy.movie_cutscene()</code> — bloqueia o jogo até terminar;{" "}
        <strong>(2) Movie displayable</strong> — vídeo como qualquer outra
        imagem, em loop, com personagens em cima, alpha, etc.
      </AlertBox>

      <h2>1. Formatos suportados — escolha o certo</h2>

      <CommandTable
        title="Codecs aceitos pelo Ren'Py 8.x"
        variations={[
          {
            cmd: ".webm (VP9)",
            desc: "RECOMENDADO. Ótima compressão, alpha channel funciona, leve em mobile.",
            output: "ffmpeg -i in.mp4 -c:v libvpx-vp9 -pix_fmt yuva420p out.webm",
          },
          {
            cmd: ".webm (VP8)",
            desc: "Mais antigo mas mais compatível. Use se VP9 falhar em algum dispositivo.",
            output: "ffmpeg -i in.mp4 -c:v libvpx out.webm",
          },
          {
            cmd: ".mkv (VP9)",
            desc: "Mesma coisa que .webm na prática. Container Matroska.",
            output: "ffmpeg -i in.mp4 -c:v libvpx-vp9 out.mkv",
          },
          {
            cmd: ".ogv (Theora)",
            desc: "Legado. Funciona em desktop, NÃO funciona em Web/Android modernos.",
            output: "Evitar em projetos novos.",
          },
          {
            cmd: ".mp4 (H.264)",
            desc: "NÃO suportado oficialmente. Pode rodar em desktop por sorte, mas quebra em build.",
            output: "Converta para .webm SEMPRE antes de buildar.",
          },
          {
            cmd: ".gif",
            desc: "Aceito via Movie() — mas SÓ animado se você usa Movie, não como image plain.",
            output: 'image petalas = Movie(play="petalas.gif", loop=True)',
          },
        ]}
      />

      <h2>2. Cutscene em tela cheia — a forma mais simples</h2>
      <p>
        <code>renpy.movie_cutscene()</code> bloqueia o script, mostra o
        vídeo em tela cheia e retorna quando termina (ou quando o jogador
        clica). Ideal para abertura, finais e flashbacks animados.
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label intro_animada:
    # Para o áudio do menu antes
    stop music fadeout 0.5

    # Bloqueia até o vídeo terminar; clique pula
    $ renpy.movie_cutscene("video/abertura_sakura_cafe.webm")

    # Após o vídeo, volta ao fluxo normal
    scene bg cafe with fade
    play music "audio/jazz.ogg" fadein 1.0
    s "E foi assim que eu acabei dono(a) deste café."
    return

label final_rota_yuki:
    # Cutscene de final — sem permitir pular (delay=False)
    $ renpy.movie_cutscene(
        "video/final_yuki.webm",
        delay=False,    # ignora cliques
        stop_music=True,
    )
    return`}
      />

      <h2>3. Movie displayable — vídeo como background animado</h2>
      <p>
        Para chuva na janela do café, fogo na lareira, neve caindo, uma
        animação loopada — declare como uma <code>image</code> normal:
      </p>

      <CodeBlock
        language="python"
        title="game/images.rpy"
        code={`# Background com vídeo loopado
image bg cafe chuva = Movie(
    play="video/chuva_janela.webm",
    loop=True,
    size=(1920, 1080),     # força tamanho do vídeo
)

# Lareira piscando — vídeo PEQUENO sobreposto ao BG estático
image lareira_fogo = Movie(
    play="video/fogo.webm",
    loop=True,
    size=(420, 280),
    mask="video/fogo_mask.webm",   # alpha via mask separada (VP8)
)

# GIF animado — petals caindo
image petalas_caindo = Movie(
    play="images/efeitos/petalas.gif",
    loop=True,
)`}
      />

      <CodeBlock
        language="python"
        title="game/script.rpy — usando como qualquer imagem"
        code={`label cena_chuva:
    # Background animado: as gotas escorrem na janela
    scene bg cafe chuva with fade

    # Sobrepõe a lareira no canto
    show lareira_fogo at Position(xpos=80, ypos=600)

    # E sprite de personagem por cima — Sakura olhando a chuva
    show sakura triste at center with dissolve

    s "Adoro quando chove. O café fica mais aconchegante."

    # Adiciona pétalas voando
    show petalas_caindo at Transform(xalign=0.5, yalign=0.0)
    s "Mas hoje as pétalas caem antes do tempo..."
    return`}
      />

      <h2>4. Vídeo com canal de áudio dedicado</h2>
      <p>
        Por padrão, o áudio do vídeo toca no canal <code>"movie"</code>.
        Você pode redirecionar para tocar a TRILHA do vídeo no canal{" "}
        <code>music</code> (mantendo loop sincronizado), ou silenciar
        completamente:
      </p>

      <CodeBlock
        language="python"
        title="game/images.rpy"
        code={`# Vídeo COM som — usa o canal 'movie' por padrão
image bg festival video = Movie(
    play="video/festival.webm",
    loop=True,
    play_audio=True,          # padrão: toca a trilha do vídeo
)

# Vídeo MUDO — quando você só quer a parte visual
image bg chuva = Movie(
    play="video/chuva.webm",
    loop=True,
    play_audio=False,
)

# Canal próprio para controlar via play/stop
image bg parque vento = Movie(
    play="video/parque.webm",
    loop=True,
    channel="parque_movie",
)`}
      />

      <h2>5. Eventos: detectar fim do vídeo</h2>
      <p>
        <code>movie_cutscene</code> bloqueia o fluxo — mas e se você quiser
        mostrar um vídeo curto e disparar uma ação ao terminar SEM
        bloquear? Use <code>renpy.music.queue</code> com callback ou{" "}
        <code>renpy.show</code> + <code>renpy.pause</code>:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label sakura_pisca_olho:
    # Mostra animação curta da Sakura piscando o olho (1.2s)
    show sakura piscadinha at center
    pause 1.2     # duração do .webm

    # Volta ao sprite estático
    show sakura feliz at center
    s "Pegou? Hoje o especial é torta."
    return

# Onde declarado:
# image sakura piscadinha = Movie(play="video/sakura_piscar.webm", loop=False)`}
      />

      <h2>6. Pré-cache para evitar engasgo</h2>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`# Predição agressiva: o engine começa a decodificar o próximo vídeo
# antes do jogador apertar 'continuar'.
define config.predict_statements = 3

# Em scripts grandes, force preload de cutscenes
init python:
    def precache_intros():
        renpy.start_predict_screen("intro_video")
        renpy.cache_pin("video/abertura_sakura_cafe.webm")`}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        user="dev"
        host="vn-studio"
        lines={[
          {
            comment: "converter MP4 para WEBM VP9 com alpha channel",
            cmd: 'ffmpeg -i intro.mp4 -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 2M -auto-alt-ref 0 -an intro.webm',
            out: `frame= 1245 fps=58 q=0.0 size=    4096kB time=00:00:41.50 bitrate= 808.4kbits/s
video:4023kB audio:0kB subtitle:0kB other streams:0kB
muxing overhead: 1.81%`,
            outType: "success",
          },
          {
            comment: "lint detecta cutscene em formato errado",
            cmd: "renpy.sh . lint",
            out: "game/script.rpy:42 The movie file 'video/intro.mp4' uses an unsupported codec (h264). Convert to .webm/VP9.",
            outType: "warning",
          },
        ]}
      />

      <h2>7. Performance e mobile</h2>

      <OutputBlock label="checklist antes de buildar com vídeo" type="info">
{`✓ Bitrate VP9 ≤ 2 Mbps para mobile (use -b:v 1500k em ffmpeg)
✓ Resolução: nunca maior que a do projeto (1920x1080 ou 1280x720)
✓ Cutscenes longas (>30s) → considere streaming via fetch + cache
✓ Movie BG simultâneos: máximo 2 por cena (RAM e CPU somam)
✓ Em build Web (HTML5) só VP8/VP9 funcionam — H264 NUNCA
✓ Use -an (sem áudio) se a trilha for tocada por play music separado
✓ Audacity ou ffmpeg-normalize p/ deixar o áudio em -16 LUFS uniforme`}
      </OutputBlock>

      <AlertBox type="warning" title="Alpha channel: o detalhe que ninguém conta">
        Para vídeo COM transparência (ex.: o fogo da lareira "vazado") você
        precisa de VP9 com pixel format <code>yuva420p</code> (a letra{" "}
        <strong>'a'</strong> é alpha). VP8 não tem alpha nativo — a doc
        oficial diz "use mask separada". Em 95% dos casos VP9 yuva420p
        resolve direto.
      </AlertBox>

      <PracticeBox
        title="Fundo de chuva animado no café"
        goal="Substituir o background estático do café por um vídeo loopado de chuva caindo na janela, com Sakura sobreposta normalmente."
        steps={[
          "Baixe ou grave um clip de 5-10s da chuva (1280x720 OK).",
          "Converta: ffmpeg -i chuva.mp4 -c:v libvpx-vp9 -an -b:v 1500k chuva.webm",
          "Coloque em game/video/chuva.webm.",
          "Em images.rpy: image bg cafe chuva = Movie(play='video/chuva.webm', loop=True).",
          "Em script.rpy: scene bg cafe chuva with fade, depois show sakura triste, 2 falas.",
        ]}
        verify="Ao rodar o jogo, a janela do café deve ter movimento contínuo de gotas caindo, sem travar entre as falas, e a Sakura deve aparecer por cima sem distorcer."
      >
        <CodeBlock
          language="python"
          title="game/script.rpy (gabarito)"
          code={`image bg cafe chuva = Movie(play="video/chuva.webm", loop=True)

label cena_chuva:
    scene bg cafe chuva with fade
    show sakura triste at center with dissolve
    s "A chuva sempre me lembra daquele dia..."
    s "Quer mais um café enquanto esperamos passar?"
    return`}
        />
      </PracticeBox>

      <AlertBox type="danger" title="Não esqueça do fallback">
        Em desktops antigos sem aceleração de vídeo, Movie() pode falhar
        silenciosamente (tela preta). SEMPRE tenha uma image PNG de
        fallback definida com a mesma tag, e troque dinamicamente se{" "}
        <code>renpy.has_movie()</code> retornar False.
      </AlertBox>

      <AlertBox type="success" title="Próximo passo">
        Quer câmera 3D real (não vídeo gravado) com sprites em
        profundidade? Vai para <strong>3D Stage / parallax</strong>.
      </AlertBox>
    </PageContainer>
  );
}
