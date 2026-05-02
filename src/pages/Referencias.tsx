import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Referencias() {
  return (
    <PageContainer
      title="Referências — onde aprofundar cada tópico"
      subtitle="Documentação oficial, tutorial in-game, código-fonte, livros, canais de YouTube, podcasts, assets gratuitos, fontes japonesas/CJK e leis de copyright que todo dev de VN precisa conhecer."
      difficulty="iniciante"
      timeToRead="16 min"
      prompt="referencias/biblioteca"
    >
      <AlertBox type="info" title="Como usar esta página">
        Esta página é um <strong>índice anotado</strong> — cada link tem uma
        explicação curta de quando faz sentido consultar. Marque-a como
        favorita e volte sempre que travar num tópico específico. Os links são
        verificados periodicamente, mas se algum quebrar, basta procurar pelo
        título no Google: o conteúdo costuma ser republicado.
      </AlertBox>

      <h2>1. Documentação oficial</h2>

      <p>
        A documentação do Ren'Py é mantida pelo próprio Tom Rothamel (PyTom) e
        é a fonte definitiva. Toda função, statement e propriedade está lá.
        Aprenda a navegar por ela — é mais rápido que perguntar no Discord.
      </p>

      <CommandTable
        title="Recursos oficiais (renpy.org)"
        variations={[
          {
            cmd: "renpy.org",
            desc: "Site principal — download da última versão estável e nightly builds.",
            output: "https://www.renpy.org/",
          },
          {
            cmd: "renpy.org/doc/html",
            desc: "Documentação completa em HTML — pesquisável (Ctrl+F na barra lateral).",
            output: "https://www.renpy.org/doc/html/",
          },
          {
            cmd: "renpy.org/doc/html/quickstart.html",
            desc: "Quickstart oficial — passo a passo de 1 hora para fazer sua primeira VN.",
            output: "comece por aqui se nunca abriu o Ren'Py",
          },
          {
            cmd: "renpy.org/doc/html/screens.html",
            desc: "Referência de Screen Language — vbox, hbox, frame, imagebutton, transclude.",
            output: "consultar SEMPRE que customizar GUI",
          },
          {
            cmd: "renpy.org/doc/html/atl.html",
            desc: "Animation and Transformation Language — sintaxe completa de transform/parallel/block.",
            output: "",
          },
          {
            cmd: "renpy.org/doc/html/build.html",
            desc: "Build Distributions — opções de packaging, build.classify, signing.",
            output: "",
          },
          {
            cmd: "renpy.org/doc/html/changelog.html",
            desc: "Changelog detalhado por versão — leia ANTES de atualizar.",
            output: "breaking changes ficam no topo de cada release",
          },
          {
            cmd: "renpy.org/release.html",
            desc: "Histórico de releases com data, mirrors e checksums.",
            output: "",
          },
        ]}
      />

      <h3>Tutorial in-game (esquecido por todos)</h3>

      <p>
        O <strong>melhor</strong> tutorial não é texto: é o jogo "The Question"
        que vem dentro do próprio Launcher. Ele é uma VN funcional que ensina
        Ren'Py enquanto você joga, e o código-fonte está disponível para você
        comparar com o que vê na tela.
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/renpy-8.3.4-sdk"
        lines={[
          { comment: "abre o launcher", cmd: "./renpy.sh", outType: "muted" },
          {
            comment: "no launcher: clique em 'tutorial' na lista de projetos · em seguida 'Launch Project'",
            cmd: "# o jogo abre — ele se chama 'The Question'",
            outType: "info",
          },
          {
            comment: "para ler o código-fonte do tutorial enquanto joga",
            cmd: "ls projects/tutorial/game/*.rpy",
            out: `projects/tutorial/game/script.rpy
projects/tutorial/game/options.rpy
projects/tutorial/game/screens.rpy
projects/tutorial/game/tutorial.rpy
projects/tutorial/game/tutorial_screens.rpy`,
            outType: "info",
          },
          {
            comment: "abre tutorial.rpy no editor configurado (geralmente Atom/VSCode)",
            cmd: "code projects/tutorial/game/tutorial.rpy",
            outType: "muted",
          },
        ]}
      />

      <h2>2. Código-fonte e GitHub</h2>

      <CommandTable
        title="Repositórios essenciais"
        variations={[
          {
            cmd: "github.com/renpy/renpy",
            desc: "Engine principal · Python · MIT license. ~4k stars.",
            output: "issues, PRs, código fonte completo do Ren'Py 8.x",
          },
          {
            cmd: "github.com/renpy/rapt",
            desc: "Ren'Py Android Packaging Tool — gera APK/AAB.",
            output: "consultar se build Android falhar",
          },
          {
            cmd: "github.com/renpy/renios",
            desc: "Ren'Py iOS — empacotamento para iPhone/iPad.",
            output: "requer macOS para buildar",
          },
          {
            cmd: "github.com/renpy/renpyweb",
            desc: "Backend Web (Emscripten) que faz Ren'Py rodar no navegador.",
            output: "",
          },
          {
            cmd: "github.com/renpy/pygame_sdl2",
            desc: "Fork do pygame que o Ren'Py usa internamente.",
            output: "",
          },
        ]}
      />

      <h2>3. Vídeo-aulas (YouTube)</h2>

      <p>
        Vídeo é o formato dominante para aprender Ren'Py em 2025. Estes canais
        têm playlists completas, atualizadas para a versão 8.x:
      </p>

      <CommandTable
        title="Canais YouTube em INGLÊS"
        variations={[
          {
            cmd: "youtube.com/@Cuechan",
            desc: "Cuechan — pioneiro · ~60 vídeos · do 'criar projeto' ao 'sistema de inventário avançado'.",
            output: "playlist 'Ren'Py Visual Novel Tutorials'",
          },
          {
            cmd: "youtube.com/@KochiKun",
            desc: "KochiKun — foco em GUI customization, screens e ATL avançado.",
            output: "ótimo depois que você já fez sua 1ª VN",
          },
          {
            cmd: "youtube.com/@LewdiesPlayhouse",
            desc: "Lewdie — série longa, didática, voltada para autores de VN adulta (mas o conteúdo técnico serve para tudo).",
            output: "",
          },
          {
            cmd: "youtube.com/@VimiTheVN",
            desc: "Vimi — análises e devlogs sobre design narrativo.",
            output: "menos código, mais teoria de roteiro",
          },
          {
            cmd: "youtube.com/@RinmaruGames",
            desc: "Tutoriais curtos (5-10 min) por tópico específico.",
            output: "bom para 'como faço só ISSO?'",
          },
        ]}
      />

      <CommandTable
        title="Canais em PORTUGUÊS"
        variations={[
          {
            cmd: "youtube.com (busca: 'renpy português')",
            desc: "Cena BR é pequena — vídeos esparsos de devs independentes. Combine com canais EN.",
            output: "marque legendas auto em PT nos vídeos em inglês como atalho",
          },
          {
            cmd: "youtube.com/@GameDevBrasil",
            desc: "Canal generalista de gamedev BR — episódios pontuais sobre VN.",
            output: "",
          },
          {
            cmd: "youtube.com/@DevSoutinho",
            desc: "Não é foco em Ren'Py mas tem aulas de Python que ajudam a entender init python.",
            output: "",
          },
        ]}
      />

      <h2>4. Livros e textos longos</h2>

      <p>
        Livros sobre Ren'Py são raros — a engine evolui rápido demais para
        mídia impressa. Mas há leituras essenciais sobre design narrativo
        interativo:
      </p>

      <CommandTable
        title="Leituras recomendadas"
        variations={[
          {
            cmd: "Ren'Py Documentation (PDF)",
            desc: "A própria docs oficial pode ser baixada como PDF de ~600 páginas — bom para offline.",
            output: "renpy.org/doc/Ren'Py.pdf",
          },
          {
            cmd: "'Crafting Interactive Fiction' — Emily Short",
            desc: "Coletânea de ensaios sobre design de IF e VN. Não é técnico, é teórico.",
            output: "emshort.blog/how-to-play",
          },
          {
            cmd: "'The Game Narrative Toolbox' — T. Heussner et al.",
            desc: "Manual prático de roteiro de jogos · cap. sobre branching aplica direto a VNs.",
            output: "ISBN 978-1138787087",
          },
          {
            cmd: "'Visual Novel Database Wiki'",
            desc: "vndb.org tem wiki comunitário com glossário (kinetic novel, sound novel, ADV vs NVL, route, harem).",
            output: "vndb.org/d2",
          },
          {
            cmd: "Lemma Soft Cookbook",
            desc: "Subfórum-livro com 1.000+ receitas de código compartilhadas pela comunidade.",
            output: "lemmasoft.renai.us/forums/viewforum.php?f=51",
          },
        ]}
      />

      <h2>5. Assets gratuitos (arte, áudio, fontes)</h2>

      <AlertBox type="warning" title="Leia a licença ANTES de usar qualquer asset">
        Todo asset gratuito vem com licença. As mais comuns: <code>CC0</code>{" "}
        (uso livre, sem crédito), <code>CC-BY</code> (livre com crédito),{" "}
        <code>CC-BY-SA</code> (crédito + obriga seu jogo a ser CC-BY-SA),{" "}
        <code>OGA-BY 3.0</code> (parecido com CC-BY mas do OpenGameArt). Se a
        licença for <code>NC</code> (Non-Commercial), você NÃO pode vender o
        jogo. <code>SA</code> (Share-Alike) pode "contaminar" sua VN inteira.
      </AlertBox>

      <CommandTable
        title="Bibliotecas de SPRITES e BGs"
        variations={[
          {
            cmd: "opengameart.org",
            desc: "OpenGameArt — milhares de assets, busca por licença e tag 'visual novel'.",
            output: "filtre por 'art type: 2D Art' + 'License: CC0'",
          },
          {
            cmd: "itch.io/game-assets/free/tag-visual-novel",
            desc: "Itch.io game assets — packs específicos de sprites/BGs para VN.",
            output: "muitos são 'pay what you want' com mínimo $0",
          },
          {
            cmd: "vnsprite.com",
            desc: "Coleção pequena mas curada de sprites estilo VN.",
            output: "",
          },
          {
            cmd: "kenney.nl",
            desc: "Kenney — assets CC0 · principalmente para jogos pixel/2D, mas tem UI elements úteis.",
            output: "kenney.nl/assets",
          },
          {
            cmd: "sutemo.itch.io",
            desc: "Sutemo — packs de BGs anime gratuitos amplamente usados em jams.",
            output: "",
          },
        ]}
      />

      <CommandTable
        title="Música e SFX"
        variations={[
          {
            cmd: "freesound.org",
            desc: "Freesound — banco colaborativo · 500k+ SFX · login obrigatório · maioria CC-BY.",
            output: "",
          },
          {
            cmd: "incompetech.com",
            desc: "Kevin MacLeod — música de filme/game CC-BY · usadíssima em VNs indie.",
            output: "crédito: 'Music by Kevin MacLeod (incompetech.com)'",
          },
          {
            cmd: "freemusicarchive.org",
            desc: "FMA — busca por gênero, mood e licença.",
            output: "",
          },
          {
            cmd: "pixabay.com/music",
            desc: "Pixabay — licença Pixabay (uso comercial sem crédito).",
            output: "menos curado, mas zero burocracia",
          },
          {
            cmd: "ocremix.org",
            desc: "OverClocked Remix — remixes de OST de jogos · NÃO use em obra comercial sem permissão.",
            output: "ok para fan game · proibido para venda",
          },
          {
            cmd: "dova-s.jp",
            desc: "Dova-Syndrome — banco japonês gigante · licença permite uso comercial com crédito · ótimo para VNs estilo JP.",
            output: "site em japonês — use Google Translate",
          },
        ]}
      />

      <CommandTable
        title="Fontes (incluindo japonês/CJK)"
        variations={[
          {
            cmd: "fonts.google.com",
            desc: "Google Fonts — todas SIL OFL (uso comercial livre). Filtre por 'Japanese' para CJK.",
            output: "Noto Sans JP, Sawarabi Mincho, Kosugi Maru",
          },
          {
            cmd: "fontsource.org",
            desc: "Mesmas fontes do Google + download direto em .ttf/.woff2 sem CDN.",
            output: "",
          },
          {
            cmd: "fontspace.com",
            desc: "FontSpace — milhares de fontes display estilo manga/anime.",
            output: "ATENÇÃO: filtre por 'Commercial use OK'",
          },
          {
            cmd: "freejapanesefont.com",
            desc: "Coletânea de fontes japonesas livres (kanji incluso).",
            output: "essencial se sua VN tiver tradução JP",
          },
        ]}
      />

      <h2>6. Ferramentas auxiliares</h2>

      <CommandTable
        title="Editores e IDEs para .rpy"
        variations={[
          {
            cmd: "Visual Studio Code + extensão 'Ren'Py Language'",
            desc: "Editor mais popular · syntax highlight · autocomplete · linter.",
            output: "marketplace.visualstudio.com/items?itemName=LuqueDaniel.languague-renpy",
          },
          {
            cmd: "Atom (descontinuado, mas funcional)",
            desc: "Editor padrão histórico do Ren'Py — Launcher abre nele se instalado.",
            output: "",
          },
          {
            cmd: "Editra",
            desc: "Editor leve incluído com o Ren'Py SDK (não precisa instalar separado).",
            output: "se nada mais funcionar, use este",
          },
          {
            cmd: "Sublime Text + 'Ren'Py' package",
            desc: "Ótimo para arquivos grandes (script.rpy de 50k linhas).",
            output: "",
          },
        ]}
      />

      <CommandTable
        title="Conversão e otimização de assets"
        variations={[
          {
            cmd: "ImageMagick (convert)",
            desc: "CLI · converte/redimensiona/comprime imagens em lote.",
            output: "convert sprite.png -resize 1080x -strip -quality 92 sprite_opt.webp",
          },
          {
            cmd: "GIMP",
            desc: "Editor open-source · alternativa ao Photoshop · plugins para batch.",
            output: "",
          },
          {
            cmd: "Krita",
            desc: "Pintura digital open-source · ótimo para desenhar sprites/CGs do zero.",
            output: "",
          },
          {
            cmd: "Audacity",
            desc: "Editor de áudio open-source · cortar voice acting, normalizar volume, exportar OGG.",
            output: "exporta direto em .ogg vorbis (formato preferido do Ren'Py)",
          },
          {
            cmd: "ffmpeg",
            desc: "Canivete suíço de áudio/vídeo. Converte tudo em tudo.",
            output: "ffmpeg -i musica.mp3 -c:a libvorbis -q:a 6 musica.ogg",
          },
        ]}
      />

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe/game/audio"
        lines={[
          {
            comment: "converte todos os WAV de voice em OGG q=5 (~96kbps) para reduzir tamanho",
            cmd: "for f in voice/*.wav; do ffmpeg -i \"$f\" -c:a libvorbis -q:a 5 \"${f%.wav}.ogg\"; done && rm voice/*.wav",
            out: `Input #0, wav, from 'voice/sakura_001.wav':
  Duration: 00:00:02.34, bitrate: 1411 kb/s
Output #0, ogg, to 'voice/sakura_001.ogg':
  Stream #0:0: Audio: vorbis, 44100 Hz, mono, fltp, 96 kb/s
size=      28kB time=00:00:02.34 bitrate=  98.2kbits/s
[...continuação para os outros 47 arquivos...]
done.`,
            outType: "success",
          },
          {
            comment: "comprime sprites em lote com WebP (50-70% menor que PNG)",
            cmd: "for f in images/sprites/*.png; do convert \"$f\" -strip -quality 88 \"${f%.png}.webp\"; done",
            out: "Convertidos 23 arquivos · economia de espaço: 142 MB → 47 MB",
            outType: "success",
          },
        ]}
      />

      <h2>7. Estudos de caso (VNs feitas em Ren'Py)</h2>

      <p>
        Aprenda lendo o código de jogos finalizados. Estes são open-source ou
        têm scripts vazados que ainda servem como referência:
      </p>

      <CommandTable
        title="VNs cujo código você pode estudar"
        variations={[
          {
            cmd: "Doki Doki Literature Club",
            desc: "DDLC · gratuito · arquivos .rpa podem ser desempacotados com unrpa.py para estudar técnica.",
            output: "ddlc.moe · estudo: como manipular renpy.quit, persistent, screens fora do padrão",
          },
          {
            cmd: "Katawa Shoujo",
            desc: "Free · 4 Leaf Studios · obra histórica · script disponível em github.com/4ls/ks.",
            output: "estrutura clássica de roteamento por route",
          },
          {
            cmd: "Long Live the Queen (demo)",
            desc: "Hanako Games · estatísticas + escolha · demo distribuída com fontes.",
            output: "",
          },
          {
            cmd: "VA-11 HALL-A (post-mortem)",
            desc: "Sukeban Games · não é open-source mas dev escreveu artigo detalhado em gamedeveloper.com.",
            output: "",
          },
          {
            cmd: "Tutorial 'The Question' (oficial)",
            desc: "Vem com o SDK · projects/tutorial/game/ · reference oficial e atualizada.",
            output: "abrir do Launcher",
          },
        ]}
      />

      <h2>8. Direito autoral e regras de monetização</h2>

      <AlertBox type="danger" title="Uso de IA generativa em assets">
        Em 2024-2025 mudou o jogo: <strong>Steam exige declaração</strong> de
        uso de IA na ficha do jogo. <strong>Itch.io permite</strong> mas
        recomenda transparência. <strong>Algumas jams</strong> (NaNoRenO entre
        elas) <strong>proíbem</strong> arte 100% gerada por IA. Antes de usar
        Stable Diffusion/Midjourney/NovelAI para sprites/BGs, leia o regulamento
        do canal de distribuição. Vozes IA têm regras ainda mais restritas
        (direitos de imagem do dono da voz original).
      </AlertBox>

      <CommandTable
        title="Recursos sobre licenças e direito"
        variations={[
          {
            cmd: "creativecommons.org/choose",
            desc: "Wizard oficial para escolher a licença CC do SEU jogo (se for open-source).",
            output: "",
          },
          {
            cmd: "tldrlegal.com",
            desc: "Resumos em linguagem simples das licenças mais comuns (MIT, GPL, CC, OFL).",
            output: "leitura de 30 segundos por licença",
          },
          {
            cmd: "renpy.org/doc/html/license.html",
            desc: "Licença do Ren'Py (MIT modificado) — você pode vender jogos feitos com Ren'Py sem royalty.",
            output: "obrigação: incluir o aviso de copyright nos créditos",
          },
          {
            cmd: "Lei 9.610/98 (BR)",
            desc: "Lei brasileira de direito autoral — músicas têm proteção até 70 anos pós-morte do autor.",
            output: "domínio público no Brasil é mais restrito que nos EUA",
          },
          {
            cmd: "DMCA Counter-Notice",
            desc: "Se algum bot do Itch/Steam derrubar seu jogo achando que infringe copyright, você pode contestar.",
            output: "modelo: itch.io/docs/creators/dmca",
          },
        ]}
      />

      <h2>9. Comparativo de engines (para fazer escolha consciente)</h2>

      <CommandTable
        title="Ren'Py vs alternativas (atualizado 2025)"
        variations={[
          {
            cmd: "Ren'Py",
            desc: "Python · open-source MIT · multiplataforma incluindo Web/Android/iOS · sintaxe especializada para VN.",
            output: "padrão da cena indie · maior comunidade · gratuito sem royalty",
          },
          {
            cmd: "TyranoBuilder / TyranoScript",
            desc: "JavaScript · GUI drag-and-drop · proprietário · pago (~US$15 na Steam).",
            output: "menor curva inicial · menos flexível · suporte oficial só EN/JP",
          },
          {
            cmd: "Naninovel (Unity)",
            desc: "Asset para Unity · pago (~US$80) · ideal se você quer MIX de VN com gameplay 3D.",
            output: "exige conhecer Unity/C#",
          },
          {
            cmd: "Inkle (ink + plugin Unity)",
            desc: "Linguagem 'ink' open-source para narrativa ramificada · usada em 80 Days, Heaven's Vault.",
            output: "foco em texto · você cria o visual por fora",
          },
          {
            cmd: "Twine",
            desc: "HTML/JS · zero código possível · ótimo para protótipo de roteiro.",
            output: "exporta jogo como HTML estático · sem áudio nativo",
          },
          {
            cmd: "VN Maker (Degica)",
            desc: "Descontinuado em 2020 · só lista por contexto histórico.",
            output: "não use para projeto novo",
          },
        ]}
      />

      <h2>10. Onde reportar bugs e pedir features</h2>

      <CommandTable
        title="Canais de suporte oficial"
        variations={[
          {
            cmd: "github.com/renpy/renpy/issues",
            desc: "Bug tracker oficial · use template · anexe .rpy mínimo reproduzível.",
            output: "tempo de resposta: dias a semanas (PyTom é uma pessoa só)",
          },
          {
            cmd: "Discord #help",
            desc: "Para dúvidas que não são bug · resposta em minutos.",
            output: "discord.gg/6ckxWYm",
          },
          {
            cmd: "Lemma Soft 'Ren'Py Questions'",
            desc: "Para discussões longas que precisam de busca futura.",
            output: "",
          },
          {
            cmd: "Stack Overflow tag [renpy]",
            desc: "Pequena mas existe · ótima para SEO · responda perguntas para construir reputação.",
            output: "stackoverflow.com/questions/tagged/renpy",
          },
        ]}
      />

      <h2>11. Listinhas para salvar agora</h2>

      <OutputBlock label="bookmarks.md — copie isso para seu navegador" type="info">
{`# Documentação
- https://www.renpy.org/doc/html/                    # docs oficial
- https://www.renpy.org/doc/html/quickstart.html     # comece aqui
- https://www.renpy.org/doc/html/screens.html        # screen language
- https://www.renpy.org/doc/html/atl.html            # animação
- https://www.renpy.org/doc/html/build.html          # build/distribuição

# Comunidade
- https://discord.gg/6ckxWYm                         # discord oficial
- https://lemmasoft.renai.us/forums/                 # fórum histórico
- https://www.reddit.com/r/RenPy/                    # subreddit
- https://itch.io/games/made-with-renpy              # vitrine

# Repositórios
- https://github.com/renpy/renpy                     # engine
- https://github.com/renpy/rapt                      # build android
- https://github.com/renpy/renpyweb                  # build web

# Assets
- https://opengameart.org/                           # arte CC0/CC-BY
- https://freesound.org/                             # SFX
- https://incompetech.com/                           # música Kevin MacLeod
- https://fonts.google.com/                          # fontes (inclusive JP)

# Jams
- https://itch.io/jam/nanoreno-2026                  # nanoreno (março)
- https://spooktoberjam.com/                         # spooktober (outubro)
- https://itch.io/jam/yuri-jam                       # yuri jam (agosto)

# Catálogo
- https://vndb.org/                                  # cadastre sua VN`}
      </OutputBlock>

      <PracticeBox
        title="Montar sua biblioteca pessoal"
        goal="Em 20 minutos, marcar todos os links acima nos favoritos do navegador, baixar a documentação em PDF e criar uma pasta local com 5 assets gratuitos."
        steps={[
          "Crie uma pasta de favoritos chamada 'Ren'Py' e arraste o bloco acima para lá (ou clique link a link).",
          "Baixe a documentação PDF em renpy.org/doc/Ren'Py.pdf — leitura offline em viagem.",
          "Acesse opengameart.org, busque 'visual novel sprite', filtre CC0/CC-BY e baixe 3 sprites de personagem.",
          "Acesse incompetech.com, gênero 'Cinematic', baixe 1 música ambiente e anote na pasta o crédito obrigatório.",
          "Acesse fonts.google.com, baixe Noto Sans JP — útil mesmo se a VN for só PT (caracteres especiais aparecem).",
          "Crie pasta ~/renpy-assets/ com subpastas: sprites/, bg/, music/, sfx/, fonts/, LICENSES.txt.",
        ]}
        verify="Você deve ter um arquivo LICENSES.txt listando cada asset baixado, sua URL de origem e a licença. Sem esse arquivo, daqui a 6 meses você não vai lembrar o que pode ou não usar."
      />

      <h3>Modelo de LICENSES.txt</h3>

      <CodeBlock
        language="markdown"
        title="~/renpy-assets/LICENSES.txt"
        code={`# Licenças dos assets usados em Sakura Café
# Atualizado: 2026-04-15

## Sprites
- sakura_base.png       OpenGameArt user 'AnonArt'   CC0           https://opengameart.org/content/...
- akira_base.png        Itch.io 'sutemo'             CC-BY 4.0     credito: Sutemo · https://sutemo.itch.io/
- yuki_base.png         OpenGameArt user 'Hanako'    CC-BY-SA 3.0  ATENCAO: contamina a VN — ver se vamos manter

## Backgrounds
- bg_cafe_dia.jpg       Pixabay user 'photoMix'      Pixabay       sem credito obrigatorio
- bg_cafe_noite.jpg     Pixabay user 'photoMix'      Pixabay       sem credito obrigatorio
- bg_escola.jpg         Sutemo BG Pack 02            CC-BY 4.0     credito: Sutemo

## Musica
- theme_main.ogg        Kevin MacLeod 'Carefree'     CC-BY 4.0     credito: Music by Kevin MacLeod (incompetech.com)
- bgm_chuva.ogg         Dova-Syndrome user 'Yuyoyuppe'  Dova-S    credito: 楽曲提供 DOVA-SYNDROME (https://dova-s.jp/)

## SFX
- sfx_porta.ogg         Freesound user 'InspectorJ'  CC-BY 3.0     credito: InspectorJ (www.jshaw.co.uk)
- sfx_xicara.ogg        Freesound user 'rich7'       CC0           sem credito obrigatorio

## Fontes
- NotoSansJP-Regular.ttf  Google Fonts                SIL OFL 1.1  uso comercial livre
- KosugiMaru-Regular.ttf  Google Fonts                SIL OFL 1.1  uso comercial livre`}
      />

      <AlertBox type="success" title="Última recomendação">
        Esta página é viva. Sempre que você descobrir um recurso novo que
        valeu a pena, abra um PR no GitHub deste guia ou escreva para a
        comunidade BR — referências boas se acumulam. E lembre-se: o melhor
        recurso de aprendizado de Ren'Py é <strong>fazer uma VN curtinha de
        verdade</strong>. Volte para a página{" "}
        <a href="/projeto-final">Projeto Final — Sakura Café</a> e abra o
        Launcher agora.
      </AlertBox>
    </PageContainer>
  );
}
