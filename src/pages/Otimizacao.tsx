import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Otimizacao() {
  return (
    <PageContainer
      title="Otimização — VN leve, fluida e bonita"
      subtitle="Compactação de imagens com ImageMagick, predict_image / predict_screen, image cache, formatos de áudio recomendados e os anti-padrões mais comuns que travam Visual Novels."
      difficulty="intermediario"
      timeToRead="15 min"
      prompt="build/otimizacao"
    >
      <AlertBox type="info" title="Otimização vem POR ÚLTIMO, mas vem">
        Não otimize antes do jogo estar completo — você gasta tempo polindo
        coisas que vão mudar. Mas antes do release final, passe meio dia
        nessas técnicas: dá para reduzir o tamanho da Sakura Café de 800 MB
        para 250 MB sem perda perceptível de qualidade.
      </AlertBox>

      <h2>1. Por onde começa o peso de uma VN?</h2>
      <CommandTable
        title="Distribuição típica de tamanho em uma VN de 8h"
        variations={[
          {
            cmd: "Imagens (PNG)",
            desc: "Sprites, backgrounds, CG events. Geralmente 60-75% do total.",
            output: "Maior alvo de otimização — sempre comece por aqui.",
          },
          {
            cmd: "Áudio (OGG/MP3)",
            desc: "Trilha + SFX + voice acting. 15-30% sem voice, até 70% com voice.",
            output: "Voice acting é o maior vilão escondido.",
          },
          {
            cmd: "Engine + Python",
            desc: "Fixos ~80 MB independente do tamanho do jogo.",
            output: "Não compensa otimizar — você não controla.",
          },
          {
            cmd: "Scripts .rpyc",
            desc: "Praticamente nada (~1 MB para 50.000 linhas).",
            output: "Não se preocupe.",
          },
          {
            cmd: "Vídeos (WebM)",
            desc: "Se você tem cinematics — fácil passa de 50% sozinho.",
            output: "Geralmente vale cortar ou reduzir bitrate.",
          },
        ]}
      />

      <h2>2. Compactação de imagens — ImageMagick</h2>
      <p>
        O Ren'Py aceita PNG, JPG, WebP e AVIF. PNG é lossless (perfeito) mas
        gigante. WebP no modo lossless é ~30% menor que PNG mantendo qualidade
        idêntica. Para backgrounds que não têm transparência, JPG q=85 é
        suficiente.
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe/game/images"
        lines={[
          {
            comment: "Antes — checar peso atual",
            cmd: "du -sh bg/ sprites/",
            out: `412M    bg/
286M    sprites/`,
            outType: "warning",
          },
          {
            comment: "PNG -> PNG otimizado (remove metadata, reduz paleta) — LOSSLESS",
            cmd: "find bg/ -name '*.png' -exec convert {} -strip -define png:compression-level=9 {} \\;",
            out: "(processando 47 backgrounds, ~3 minutos)",
            outType: "muted",
          },
          {
            comment: "Background sem alpha vira JPG q=85 — LOSSY mas imperceptível",
            cmd: `find bg/ -name '*.png' -exec sh -c 'convert "$1" -quality 85 -strip "\${1%.png}.jpg"' _ {} \\;`,
            outType: "muted",
          },
          {
            comment: "Sprites COM transparência -> WebP lossless (mantém alpha perfeito)",
            cmd: "find sprites/ -name '*.png' -exec cwebp -lossless -m 6 {} -o {}.webp \\;",
            out: "Saved file sakura_happy.png.webp (842 KB -> 488 KB, -42%)",
            outType: "success",
          },
          {
            comment: "Resultado",
            cmd: "du -sh bg/ sprites/",
            out: `124M    bg/
164M    sprites/`,
            outType: "success",
          },
        ]}
      />

      <CommandTable
        title="Tabela de decisão: que formato usar?"
        variations={[
          {
            cmd: "BG sem efeitos",
            desc: "Background sólido (café, sala de aula).",
            output: "JPG q=85 — economia de 70% vs PNG.",
          },
          {
            cmd: "BG com transparência",
            desc: "Sobreposição (chuva, rede de cabelo).",
            output: "WebP lossless — mantém alpha, -30%.",
          },
          {
            cmd: "Sprite de personagem",
            desc: "Tem que ter alpha perfeito.",
            output: "WebP lossless OU PNG-8 (se estilo flat).",
          },
          {
            cmd: "CG events",
            desc: "Imagens cheias de detalhe que aparecem 1x.",
            output: "WebP lossy q=90 — quase imperceptível.",
          },
          {
            cmd: "Ícones GUI",
            desc: "Pequenos PNGs de menus.",
            output: "PNG-8 com paleta (16 cores) — minúsculos.",
          },
          {
            cmd: "AVIF",
            desc: "Mais novo, ainda menor que WebP.",
            output: "Cuidado — Ren'Py 8 suporta mas é lento para decodificar em mobile.",
          },
        ]}
      />

      <h2>3. Predição: o segredo do scrolling fluido</h2>
      <p>
        O Ren'Py carrega imagens sob demanda — quando uma cena pesada aparece
        de repente, há um <strong>stutter</strong> de meio segundo. O conserto
        é avisar antecipadamente o que está prestes a aparecer:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy — predição manual de assets"
        code={`label cap1_cafe:
    scene bg cafe with fade
    show sakura uniform happy at center

    s "Bem-vinda ao Sakura Café! Posso te mostrar a casa?"

    ## Predizer cena seguinte ENQUANTO o jogador lê o diálogo atual.
    ## Quando ele clicar, o engine já tem tudo carregado — zero stutter.
    $ renpy.predict_scene("bg cozinha")
    $ renpy.predict_show("sakura uniform pointing")
    $ renpy.predict_show("akira casual surprised")

    s "Por aqui é a cozinha. O Akira está terminando de fazer o pão de mel."

    scene bg cozinha with dissolve
    show sakura uniform pointing at left
    show akira casual surprised at right`}
      />

      <h3><code>config.predict_statements</code> — predição automática</h3>
      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`## Quantos statements à frente o engine deve "pré-ler" para predizer assets.
## Default = 2. Aumente em VNs com muitos sprites.
define config.predict_statements = 30

## Predizer também as screens chamadas (status, inventário)
define config.predict_screens = True

## Predição em paralelo (mais memória, mas mais fluido)
define config.gl2_predict = True`}
      />

      <h2>4. Image cache — o coração da fluidez</h2>
      <p>
        O Ren'Py mantém um cache de imagens descomprimidas em RAM. Tamanho
        default é 96 MB no PC, 24 MB em mobile. VN com muitos sprites grandes
        precisa de mais — mas cuidado para não esgotar a RAM do celular:
      </p>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`init python:
    ## Cache de 256 MB no PC (suficiente para 50 sprites HD em RAM)
    config.image_cache_size = 256

    ## Mobile: limite a 64 MB para não estourar em devices baratos
    if renpy.android or renpy.ios:
        config.image_cache_size = 64

    ## Quantas imagens manter em cache (LRU — least recently used)
    config.image_cache_size_mb = config.image_cache_size`}
      />

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Verificar uso de cache em runtime — abre o console (Shift+O)",
            cmd: 'renpy.show_screen("_image_cache")',
            out: `Image cache: 198 MB / 256 MB (77%)
Predicted: 12 images (sakura, akira, bg cafe, bg cozinha, ...)
LRU eviction: 3 in last minute (bg parque, bg ferrovia, bg festival)
FPS: 60 (target 60)`,
            outType: "info",
          },
        ]}
      />

      <h2>5. Áudio — formato e bitrate certos</h2>
      <CommandTable
        title="Formatos suportados pelo Ren'Py"
        variations={[
          {
            cmd: "OGG Vorbis q=4",
            desc: "Padrão clássico, qualidade ótima.",
            output: "~128 kbps — bom para música, peso médio.",
          },
          {
            cmd: "Opus 96kbps",
            desc: "Mais novo, 30% menor que OGG na mesma qualidade.",
            output: "Recomendado para web e mobile.",
          },
          {
            cmd: "MP3",
            desc: "Funciona, mas Ren'Py prefere OGG.",
            output: "Use só se já tiver os arquivos prontos.",
          },
          {
            cmd: "WAV",
            desc: "PCM puro — gigante.",
            output: "NUNCA distribua. Converta tudo antes do build.",
          },
          {
            cmd: "OPUS para voice acting",
            desc: "Voice fica intelegível em 32 kbps mono.",
            output: "Diferença: 4 KB/segundo vs 16 KB/s do OGG q=4.",
          },
        ]}
      />

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe/game/audio"
        lines={[
          {
            comment: "Converter WAV (15 MB) para OGG Vorbis q=4 (1.5 MB)",
            cmd: "for f in *.wav; do oggenc -q 4 \"$f\" -o \"${f%.wav}.ogg\" && rm \"$f\"; done",
            out: `Encoding theme.wav -> theme.ogg [done]
Encoding rain.wav -> rain.ogg [done]
Encoding piano.wav -> piano.ogg [done]
Saved 87 MB across 12 tracks.`,
            outType: "success",
          },
          {
            comment: "Voice em Opus mono 32k (perfeito para diálogos)",
            cmd: "for f in voice/*.wav; do opusenc --bitrate 32 --downmix-mono \"$f\" \"${f%.wav}.opus\"; done",
            out: "Encoded 1247 voice lines. Saved 1.2 GB -> 142 MB (88% redução)",
            outType: "success",
          },
        ]}
      />

      <h2>6. Anti-padrões comuns (e o conserto)</h2>

      <h3>❌ <code>with None</code> desnecessário</h3>
      <CodeBlock
        language="python"
        title="game/script.rpy — ANTES (ruim)"
        code={`scene bg cafe
with None
show sakura happy
with None
s "Olá!"
with None
hide sakura
with None`}
      />
      <CodeBlock
        language="python"
        title="DEPOIS (bom)"
        code={`## with None força um redraw imediato — só use quando precisar SINCRONIZAR
## múltiplas mudanças visuais. Para mudanças simples, deixe o Ren'Py decidir.
scene bg cafe
show sakura happy
s "Olá!"
hide sakura`}
      />

      <h3>❌ Sprites em resolução absurda</h3>
      <AlertBox type="warning" title="A regra dos 1.5×">
        Se sua VN roda em 1920×1080, sprites de personagem em até{" "}
        <strong>1.5× a altura final</strong> (ex: 1620 px) já são suficientes.
        Sprite de 4096 px é desperdício — o engine reduz na hora e o jogador
        nunca vê a diferença, mas você paga 4× em RAM e disco.
      </AlertBox>

      <h3>❌ Áudio em loop sem <code>fadein/fadeout</code></h3>
      <CodeBlock
        language="python"
        title="ruim — corte abrupto"
        code={`play music "audio/theme.ogg"
# ... 50 linhas de diálogo ...
stop music
play music "audio/sad.ogg"`}
      />
      <CodeBlock
        language="python"
        title="bom — transição suave (e barata)"
        code={`play music "audio/theme.ogg" fadein 1.5
# ...
play music "audio/sad.ogg" fadein 2.0 fadeout 1.5`}
      />

      <h3>❌ Carregar imagens dinamicamente em <code>$ renpy.show()</code></h3>
      <CodeBlock
        language="python"
        title="ruim — engine não pode predizer"
        code={`$ renpy.show("sakura_" + emocao_atual)`}
      />
      <CodeBlock
        language="python"
        title="bom — define a imagem antes, predição funciona"
        code={`image sakura happy = "sprites/sakura_happy.png"
image sakura sad = "sprites/sakura_sad.png"
image sakura angry = "sprites/sakura_angry.png"

show sakura expression [emocao_atual]`}
      />

      <h2>7. Profiling — descobrindo o gargalo real</h2>
      <p>
        Não chute. Meça. O Ren'Py tem ferramentas de profiling embutidas:
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Rodar com profiling de imagens — gera log detalhado",
            cmd: "renpy.exe . --profile-image-cache",
            out: `Image cache profile (last 5 minutes):
  Hits: 14823 (98.2%)
  Misses: 273 (1.8%) — STUTTER risk
  Top miss assets:
    1. bg festival_noite.png (8 misses, 312 KB each)
    2. akira formal_smile.png (4 misses, 218 KB each)
    3. cg_beijo_sakura.png (3 misses, 1.4 MB each)
  Recommendation: predict these assets earlier.`,
            outType: "info",
          },
          {
            comment: "Profiling de FPS",
            cmd: "renpy.exe . --profile",
            out: `Frame profile (60 fps target):
  Average frame time: 12.3 ms (81 fps actual)
  Worst frame: 34 ms (event scene cap2_festival)
  Slowest function: render_text (4.2 ms — caused by huge font on textbox)
  Recommendation: pre-bake text shadows or reduce font size.`,
            outType: "info",
          },
        ]}
      />

      <h2>8. Inicialização rápida — menos espera no boot</h2>
      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`init python:
    ## Não pré-carregar audio na inicialização (carrega quando tocar)
    config.preload_audio = False

    ## Skip splash screen do Ren'Py (logo "powered by Ren'Py")
    config.developer = False  ## em release apenas
    config.has_splashscreen = False

    ## Reduzir log de runtime (escreve menos no log.txt)
    config.log_enable = False

    ## Saves comprimidos (50% menores, leitura idêntica)
    config.save_format = "gzip"`}
      />

      <OutputBlock label="comparativo de tempo de boot — Sakura Café" type="info">
{`Setup padrão:                  4.2 segundos até o menu principal
+ predict_statements=30:       4.4 segundos (gasta carregando)
+ image_cache_size=256:        4.1 segundos (mais RAM, mesmo boot)
+ preload_audio=False:         2.8 segundos (-33%)
+ has_splashscreen=False:      2.1 segundos (-25%)
+ assets em WebP:              1.7 segundos (-19%)
TOTAL OTIMIZADO:               1.7 segundos (vs 4.2 — 60% mais rápido)`}
      </OutputBlock>

      <PracticeBox
        title="Reduzindo o tamanho da Sakura Café em 50%"
        goal="Aplicar compactação de imagens e áudio para cortar pelo menos metade do peso final do build."
        steps={[
          "Meça o tamanho atual: du -sh game/ — anote o número.",
          "Backup completo da pasta game/ antes de qualquer conversão (cp -r game game-backup).",
          "Converta todos os WAVs para OGG q=4 com oggenc, deletando os WAVs originais.",
          "Converta backgrounds sem alpha (folder bg/) para JPG q=85.",
          "Converta sprites com transparência (folder sprites/) para WebP lossless.",
          "Atualize as referências em script.rpy se necessário (Ren'Py aceita extensões diferentes, mas confira).",
          "Rode renpy.exe . lint para garantir que tudo ainda é encontrado.",
          "Meça de novo: du -sh game/ — calcule a redução percentual.",
        ]}
        verify="Se a redução foi maior que 40% e o jogo abre normalmente sem 'image not found', a otimização foi um sucesso."
      />

      <PracticeBox
        title="Habilitando profiling e identificando gargalos"
        goal="Rodar o jogo com --profile-image-cache durante 5 minutos e gerar um relatório de gargalos."
        steps={[
          "Rode: renpy.exe . --profile-image-cache > profile.log 2>&1",
          "Jogue normalmente por 5 minutos, passando por pelo menos 3 cenas diferentes.",
          "Saia do jogo e abra profile.log no editor.",
          "Procure pela seção 'Top miss assets' — esses são os arquivos que causam stutter.",
          "Para cada miss, adicione um $ renpy.predict_scene() ou predict_show() umas 2-3 falas antes de a cena aparecer.",
          "Rode novamente o profile e confirme que misses caíram.",
        ]}
        verify="Hit rate acima de 99% e zero misses para os assets que você predisse manualmente."
      />

      <AlertBox type="success" title="Equilíbrio é tudo">
        Otimizar demais é tão ruim quanto não otimizar. Não converta sprites
        importantes para WebP lossy se a perda for visível, não force cache
        gigante em mobile, não predija 100 imagens à frente. Foque nos 20% de
        ações que dão 80% do ganho — geralmente: WebP nos sprites, OGG no
        áudio, predict_statements em 30 e image_cache_size em 256.
      </AlertBox>
    </PageContainer>
  );
}
