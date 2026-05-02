import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function AudioFilters() {
  return (
    <PageContainer
      title="Audio Filters — DSP em tempo real"
      subtitle="Aplique Lowpass, Highpass, Reverb, Delay e Crossfade em qualquer canal de áudio do Ren'Py 8.2+ sem pré-processar arquivos. Áudio do café 'abafado' quando a câmera entra na cozinha, eco em cena de sonho da Sakura."
      difficulty="intermediario"
      timeToRead="14 min"
      prompt="audio/audio-filters"
    >
      <AlertBox type="info" title="O que são Audio Filters">
        A partir do Ren'Py <strong>8.2</strong>, o módulo{" "}
        <code>audio.filter</code> aplica DSP (Digital Signal Processing) em
        tempo real sobre qualquer canal de som — música, ambiente, voz —{" "}
        <strong>sem precisar gerar arquivos pré-mixados</strong>. A doc
        oficial mostra a API solta; aqui você vê o pacote completo: ativar,
        compor, animar e remover filtros para situações típicas de uma VN.
      </AlertBox>

      <h2>1. A API mínima — ativar um filtro em um canal</h2>
      <p>
        Toda chamada segue o padrão <code>renpy.music.set_audio_filter(
          canal, filtro
        )</code>. O canal é o mesmo que você usa em <code>play music</code>{" "}
        / <code>play sound</code> / <code>play voice</code>. Passe{" "}
        <code>None</code> para remover.
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy — exemplo mínimo"
        code={`label cena_cozinha:
    scene bg cafe with fade
    play music "audio/jazz_cafe.ogg" fadein 1.0

    s "Vou pegar o pedido na cozinha, já volto."

    # Câmera entra na cozinha — som do café fica ABAFADO (lowpass)
    $ renpy.music.set_audio_filter("music", audio.Lowpass(800))

    scene bg cozinha with fade
    s "Aqui dentro o jazz mal se ouve, abafado pela porta."

    # Sakura volta pro salão — remove o filtro
    $ renpy.music.set_audio_filter("music", None)
    scene bg cafe with fade
    return`}
      />

      <h2>2. Filtros disponíveis — tabela completa</h2>

      <CommandTable
        title="Construtores de audio.filter (Ren'Py 8.2+)"
        variations={[
          {
            cmd: "audio.Lowpass(freq)",
            desc: "Deixa passar SÓ frequências abaixo de freq Hz. Som abafado, atrás de parede.",
            output: "audio.Lowpass(800)  → corta tudo acima de 800Hz",
          },
          {
            cmd: "audio.Highpass(freq)",
            desc: "Deixa passar SÓ frequências acima de freq Hz. Som telefônico, rádio antigo.",
            output: "audio.Highpass(2000) → telefone fixo dos anos 80",
          },
          {
            cmd: "audio.Bandpass(low, high)",
            desc: "Janela: passa só entre low e high Hz. Walkie-talkie, intercom.",
            output: "audio.Bandpass(300, 3400) → linha telefônica",
          },
          {
            cmd: "audio.Reverb(...)",
            desc: "Adiciona reverberação (eco difuso). Igreja vazia, salão grande.",
            output: "audio.Reverb(reverberance=70, damping=50)",
          },
          {
            cmd: "audio.Delay(seconds, decay)",
            desc: "Eco discreto: repete o som N segundos depois com decaimento.",
            output: "audio.Delay(0.35, 0.5) → eco em caverna",
          },
          {
            cmd: "audio.Biquad(type, freq, q, gain)",
            desc: "Filtro biquadrático genérico (lowshelf/highshelf/peaking).",
            output: "audio.Biquad('peaking', 1000, 1.0, 6.0)",
          },
          {
            cmd: "audio.Crossfade(filter1, filter2, t)",
            desc: "Faz fade entre dois filtros em t segundos. Ótimo p/ animar transição.",
            output: "audio.Crossfade(antigo, novo, 1.5)",
          },
          {
            cmd: "audio.Mix(f1, f2, ...)",
            desc: "Combina vários filtros em paralelo (somando saídas).",
            output: "audio.Mix(audio.Reverb(), audio.Delay(0.2, 0.4))",
          },
          {
            cmd: "audio.Sequence(f1, f2, ...)",
            desc: "Encadeia filtros em série (saída de um vira entrada do próximo).",
            output: "audio.Sequence(audio.Highpass(300), audio.Reverb())",
          },
          {
            cmd: "audio.Null()",
            desc: "Filtro identidade. Útil como placeholder ou destino de Crossfade.",
            output: "audio.Null() → som passa sem alteração",
          },
        ]}
      />

      <h2>3. Receita: voz da Sakura ao telefone</h2>
      <p>
        Quando ela liga para o protagonista de outro ambiente, a voz vira
        "telefônica". Aplique <code>Bandpass</code> + leve{" "}
        <code>Distortion</code> via Biquad peaking:
      </p>

      <CodeBlock
        language="python"
        title="game/audio_filters.rpy"
        code={`# Definimos o filtro 1x e reusamos
init python:
    FILTRO_TELEFONE = audio.Sequence(
        audio.Bandpass(300, 3400),         # janela típica de telefonia
        audio.Biquad("peaking", 1500, 2.0, 4.0),  # leve realce metálico
    )

label sakura_liga:
    scene bg quarto noite

    # Liga o filtro APENAS no canal 'voice'
    $ renpy.music.set_audio_filter("voice", FILTRO_TELEFONE)

    voice "audio/voice/sakura_alo.ogg"
    s "Alô? Você ainda está acordado(a)?"

    voice "audio/voice/sakura_saudade.ogg"
    s "Eu... só queria ouvir sua voz antes de dormir."

    # Ela desliga — remove filtro
    $ renpy.music.set_audio_filter("voice", None)
    return`}
      />

      <h2>4. Receita: cena de sonho com reverb + delay</h2>

      <CodeBlock
        language="python"
        title="game/audio_filters.rpy"
        code={`init python:
    FILTRO_SONHO = audio.Mix(
        audio.Reverb(reverberance=80, damping=40, room_scale=100),
        audio.Delay(0.45, 0.55),
    )

label sonho_da_sakura:
    scene bg preto with fade
    play music "audio/musicbox.ogg" fadein 2.0
    $ renpy.music.set_audio_filter("music", FILTRO_SONHO)

    "..."
    s "Onde... onde é que eu estou?"
    s "Tudo parece tão distante, como se eu ouvisse de baixo d'água."

    # Acorda — Crossfade SUAVE de volta ao normal
    $ renpy.music.set_audio_filter(
        "music",
        audio.Crossfade(FILTRO_SONHO, audio.Null(), 1.5),
    )
    scene bg quarto manha with fade
    return`}
      />

      <h2>5. Animando filtros — câmera que se afasta</h2>
      <p>
        Para um efeito gradual (ex.: a porta da cozinha se fechando aos
        poucos), em vez de trocar o filtro de uma vez, use{" "}
        <code>Crossfade</code> para interpolar entre dois estados:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label porta_se_fecha:
    play music "audio/jazz.ogg" fadein 0.5

    # Estado 1: aberto (sem filtro)
    $ ATUAL = audio.Null()
    $ renpy.music.set_audio_filter("music", ATUAL)
    s "A porta começa a se fechar..."

    # Transição em 2s para som abafado
    $ ALVO = audio.Lowpass(600)
    $ renpy.music.set_audio_filter(
        "music", audio.Crossfade(ATUAL, ALVO, 2.0)
    )
    pause 2.5

    # Travamos o estado final p/ próximas transições partirem dele
    $ ATUAL = ALVO
    $ renpy.music.set_audio_filter("music", ATUAL)
    s "Pronto. Agora só ouço o tilintar das xícaras."
    return`}
      />

      <AlertBox type="warning" title="Filtros são LIVE — afetam o que está tocando">
        Mudar o filtro NÃO reinicia a música. O DSP é aplicado sobre o
        buffer de saída em tempo real. Por isso, se você quiser uma "nova
        música filtrada", basta dar <code>play music</code> com o filtro já
        ativo — não precisa carregar 2 arquivos.
      </AlertBox>

      <h2>6. Aplicar a TODOS os canais de uma vez</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`# Helper para passar um filtro em todos canais simultaneamente
init python:
    def set_global_filter(f):
        for canal in ("music", "sound", "voice", "ambient"):
            renpy.music.set_audio_filter(canal, f)

label flashback_sepia_audio:
    # Tudo abafado — efeito de memória
    $ set_global_filter(audio.Lowpass(1200))
    scene bg cafe sepia with fade
    s "Eu me lembro daquele dia como se fosse ontem..."
    return

label volta_presente:
    $ set_global_filter(None)
    scene bg cafe with fade
    return`}
      />

      <h2>7. Debug — ouvir o filtro com o console</h2>

      <Terminal
        path="~/projetos/sakura-cafe"
        user="dev"
        host="vn-studio"
        lines={[
          {
            comment: "abrir console no jogo: Shift+O",
            cmd: 'renpy.music.set_audio_filter("music", audio.Lowpass(500))',
            out: "(música começa a soar abafada imediatamente)",
            outType: "success",
          },
          {
            comment: "remover",
            cmd: 'renpy.music.set_audio_filter("music", None)',
            out: "(volta ao som original)",
            outType: "success",
          },
          {
            comment: "lint detecta uso de filtro em versão antiga",
            cmd: "renpy.sh . lint",
            out: "Audio filters require Ren'Py 8.2 or later. Detected: 8.1.3",
            outType: "warning",
          },
        ]}
      />

      <OutputBlock label="ordem mental — qual filtro pra qual cena" type="info">
{`PAREDE / PORTA FECHADA   → audio.Lowpass(500-900)
SUBAQUÁTICO              → audio.Lowpass(400) + audio.Reverb(60)
TELEFONE / RÁDIO         → audio.Bandpass(300, 3400)
INTERCOM ANTIGO          → Bandpass + Biquad peaking
SALÃO GRANDE / IGREJA    → audio.Reverb(reverberance=80)
CAVERNA / GRUTA          → audio.Delay(0.4, 0.55) + Reverb
SONHO / DEVANEIO         → Reverb + Delay (Mix)
PRESENÇA NORMAL          → audio.Null() ou None`}
      </OutputBlock>

      <PracticeBox
        title="Implemente o efeito 'sino do café'"
        goal="Quando o cliente abre a porta, o sino toca; nesse instante a música deve ficar momentaneamente abafada por 1.5s e depois voltar."
        steps={[
          "Crie game/audio_filters.rpy.",
          "Defina FILTRO_PORTA = audio.Lowpass(700).",
          "Em script.rpy, antes de tocar o sino: set_audio_filter('music', Crossfade(Null, FILTRO_PORTA, 0.3)).",
          "Toque o efeito do sino com play sound.",
          "Pause 1.5s, depois aplique o Crossfade contrário e volte para None.",
        ]}
        verify="Ao apertar o botão de avançar, você deve ouvir o sino e perceber que a música ambiente perde brilho por ~1.5s antes de voltar."
      >
        <CodeBlock
          language="python"
          title="game/audio_filters.rpy (gabarito)"
          code={`init python:
    FILTRO_PORTA = audio.Lowpass(700)

label cliente_entra:
    play music "audio/jazz.ogg"
    $ renpy.music.set_audio_filter(
        "music", audio.Crossfade(audio.Null(), FILTRO_PORTA, 0.3)
    )
    play sound "audio/sino.ogg"
    pause 1.5
    $ renpy.music.set_audio_filter(
        "music", audio.Crossfade(FILTRO_PORTA, audio.Null(), 0.4)
    )
    return`}
        />
      </PracticeBox>

      <AlertBox type="danger" title="Performance e mobile">
        Cada filtro custa CPU em tempo real. Em Android low-end, evite{" "}
        <code>Reverb</code> com <code>room_scale</code> alto e{" "}
        <code>Delay</code> com decay longo. Combine com{" "}
        <code>config.audio_filter_frequency</code> reduzido (default 48000)
        se notar engasgos.
      </AlertBox>

      <AlertBox type="success" title="Próximo passo natural">
        Filtros mexem com o som que JÁ ESTÁ tocando. Para vídeo (chuva na
        janela do café, cinematics) o próximo capítulo é{" "}
        <strong>Movie Displayable</strong>.
      </AlertBox>
    </PageContainer>
  );
}
