import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Comunidade() {
  return (
    <PageContainer
      title="Comunidade — onde respiram os dev's de Visual Novel"
      subtitle="Discord oficial, Lemma Soft Forums, /r/renpy, Itch.io, VNDB, NaNoRenO, Kawaii Game Jam, comunidade BR e como começar carreira indie publicando VN."
      difficulty="iniciante"
      timeToRead="14 min"
      prompt="comunidade/onde-encontrar"
    >
      <AlertBox type="info" title="Por que entrar na comunidade ANTES de terminar seu jogo">
        Visual Novel é um meio pequeno, apaixonado e extremamente acolhedor. A
        diferença entre uma VN que ninguém joga e uma que viraliza quase nunca
        é a qualidade do código — é se o autor postou devlogs, mostrou WIP no
        Discord do Ren'Py, participou de uma jam e deixou as primeiras pessoas
        criarem expectativa. Comece a fazer parte HOJE, mesmo com nada pronto.
      </AlertBox>

      <h2>1. Os 4 lugares oficiais (e por que cada um existe)</h2>

      <p>
        A comunidade Ren'Py se espalha por quatro hubs principais. Cada um
        atende a uma necessidade diferente — entender essa divisão evita você
        postar dúvida de bug no lugar de showcase de arte.
      </p>

      <CommandTable
        title="Os 4 hubs oficiais do ecossistema Ren'Py"
        variations={[
          {
            cmd: "discord.gg/6ckxWYm",
            desc: "Discord oficial Ren'Py — chat em tempo real, canais #help, #showcase, #scripting, #art-help. Tom Rothamel (PyTom) participa.",
            output: "~12k membros · respostas em minutos · idioma inglês (canal #other-languages aceita PT)",
          },
          {
            cmd: "lemmasoft.renai.us",
            desc: "Lemma Soft Forums — fórum histórico desde 2003. Discussões longas, devlogs, recrutamento, recursos gratuitos.",
            output: "~50k threads · busca arquivada · ouro para tutoriais antigos que o Discord não preserva",
          },
          {
            cmd: "reddit.com/r/RenPy",
            desc: "Subreddit /r/RenPy — perguntas avulsas, screenshots de progresso, links para devlogs.",
            output: "~30k membros · ótimo para divulgar lançamento e receber feedback rápido",
          },
          {
            cmd: "itch.io/games/made-with-renpy",
            desc: "Itch.io tag 'Made with Ren'Py' — vitrine de mais de 30.000 VNs, comerciais e gratuitas.",
            output: "principal storefront indie · taxa flexível (você define) · suporta jams nativamente",
          },
        ]}
      />

      <h3>Discord — como aproveitar de verdade</h3>

      <p>
        O Discord do Ren'Py é organizado por canais temáticos. Antes de pedir
        ajuda, leia <code>#read-this-first</code> e <code>#faq</code>. Use o
        canal certo, descreva o que tentou e cole o erro completo (não
        screenshot). Para responder mais rápido, sempre inclua versão do Ren'Py
        e sistema operacional.
      </p>

      <CodeBlock
        language="markdown"
        title="modelo de pedido de ajuda no #help"
        code={`**Versão Ren'Py:** 8.3.4
**SO:** Windows 11 / macOS 14 / Ubuntu 24.04
**O que estou tentando fazer:** mostrar 2 sprites lado a lado e fazer dissolve
**Código (mínimo reproduzível):**
\`\`\`renpy
label start:
    scene bg cafe
    show sakura happy at left
    show akira neutral at right
    with dissolve
    s "Bom dia!"
\`\`\`
**Erro completo (copia/cola, NÃO screenshot):**
\`\`\`
File "game/script.rpy", line 4: expected 'image attribute' not found
\`\`\`
**O que já tentei:** rodei \`renpy.exe . lint\`, conferi se as imagens existem em images/.`}
      />

      <h2>2. Lemma Soft Forums — o arquivo histórico</h2>

      <p>
        Antes do Discord existir, todo Ren'Py-dev passava pelo{" "}
        <strong>Lemma Soft</strong>. Lá vivem tutoriais escritos em 2008 que
        ainda funcionam, threads de hits famosos como <em>Katawa Shoujo</em>,{" "}
        <em>Doki Doki Literature Club</em> e <em>Long Live the Queen</em>{" "}
        contando como foram feitos, e a sub-categoria{" "}
        <strong>"We are Recruiting!"</strong> onde você pode formar time.
      </p>

      <CommandTable
        title="Subfóruns mais úteis do Lemma Soft"
        variations={[
          { cmd: "Will Write/Translate for Free", desc: "Roteiristas e tradutores oferecendo trabalho voluntário em troca de portfólio.", output: "ótimo para achar parceria PT-EN" },
          { cmd: "I am offering Art", desc: "Artistas com portfólio público — sprites, BGs, GUI, CGs.", output: "leia preços antes de contatar" },
          { cmd: "Ren'Py Questions and Announcements", desc: "Onde PyTom posta releases. Bugs reportados aqui são vistos pelo core team.", output: "" },
          { cmd: "Ren'Py Cookbook", desc: "Receitas: dia/noite dinâmico, point-and-click, RPG combat, save customizado.", output: "código pronto para copiar" },
          { cmd: "Creator Discussion", desc: "Discussão criativa: enredo, design, marketing, monetização.", output: "" },
          { cmd: "Works in Progress", desc: "Devlogs longos com prints — o lugar para construir hype antes do lançamento.", output: "" },
        ]}
      />

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "abrir o navegador num post específico do Lemma Soft (Linux/macOS)",
            cmd: "xdg-open https://lemmasoft.renai.us/forums/viewforum.php?f=51",
            outType: "muted",
          },
          {
            comment: "buscar threads sobre 'inventory' no fórum",
            cmd: "curl -s 'https://lemmasoft.renai.us/forums/search.php?keywords=inventory&fid[]=51' | grep -oP '<a class=\"topictitle\"[^>]*>\\K[^<]+' | head -10",
            out: `Inventory system with images
Ren'Py Inventory tutorial (2024 update)
Drag & drop inventory screen
Persistent inventory across saves
Cookbook: Simple item collection`,
            outType: "info",
          },
        ]}
      />

      <h2>3. Itch.io — onde sua VN vai morar</h2>

      <p>
        Itch.io é o <strong>Steam dos indies</strong>. É lá que praticamente
        toda VN nasce comercialmente: o autor sobe o build, define preço (de R$
        0 a "pague-o-quanto-quiser"), recebe pagamento via Stripe/PayPal e fica
        com 80–100% (o autor escolhe a taxa da plataforma). Sem aprovação, sem
        burocracia.
      </p>

      <CommandTable
        title="Como subir sua VN ao Itch.io"
        variations={[
          {
            cmd: "Criar conta gratuita",
            desc: "itch.io/register — confirma email e pronto.",
            output: "Sem CNPJ, sem verificação de identidade até US$ 600/ano",
          },
          {
            cmd: "Dashboard → Create new project",
            desc: "Tipo: 'Games' · Classification: 'Visual Novel' · Tags: 'visual novel', 'romance', 'renpy'.",
            output: "tags importam para descoberta — use as 5 mais relevantes",
          },
          {
            cmd: "Pricing",
            desc: "Free / Paid / Name your own price. Você define a taxa do Itch (0% a 100%, padrão 10%).",
            output: "Para 1ª VN, 'Pay what you want' com mínimo $0 maximiza downloads",
          },
          {
            cmd: "Uploads",
            desc: "Sobe os ZIPs gerados pelo Build Distributions: -win.zip, -mac.zip, -linux.tar.bz2 e -web.zip.",
            output: "Marque a versão Web como 'This file will be played in the browser'",
          },
          {
            cmd: "Pagamento",
            desc: "Conecta Stripe (Brasil suportado desde 2023) ou PayPal. Itch repassa direto para você.",
            output: "Você emite a NF — Itch é só intermediador",
          },
        ]}
      />

      <PracticeBox
        title="Subir uma demo de 5 minutos no Itch.io"
        goal="Publicar uma página privada (rascunho) no Itch.io contendo o build Web do tutorial padrão do Ren'Py — para ver todo o fluxo antes de ter um jogo de verdade."
        steps={[
          "Crie um projeto 'tutorial-renpy' no Launcher e faça Build Distributions → marque apenas Web.",
          "Vá em itch.io/login → Upload new project.",
          "Title: 'Meu Teste Ren'Py' · Project URL: tutorial-renpy-teste · Classification: Games.",
          "Em Uploads, suba o arquivo tutorial-1.0-web.zip e marque 'will be played in the browser'.",
          "Em Embed options, ajuste viewport para 1280x720 e clique em 'Save & view page'.",
          "Mantenha visibilidade como 'Draft' — só você verá. Quando for de verdade, mude para 'Public'.",
        ]}
        verify="Abra a URL como anônimo (modo privado). Se aparecer 404, está em Draft = correto. Se aparecer e o jogo rodar no navegador — pronto, você sabe lançar."
      />

      <h2>4. VNDB — a IMDb das Visual Novels</h2>

      <p>
        O <strong>Visual Novel Database</strong> (vndb.org) é o catálogo
        comunitário definitivo: mais de 50.000 VNs registradas, com sinopses,
        screenshots, tags exaustivas, tempo de leitura, idiomas disponíveis,
        rotas, finais, plataformas e notas. Cadastrar sua VN no VNDB faz ela
        aparecer em buscas de fãs do mundo inteiro.
      </p>

      <CommandTable
        title="O que cadastrar e como"
        variations={[
          { cmd: "Crie conta em vndb.org/u/register", desc: "Sem confirmação por email — login imediato.", output: "" },
          { cmd: "Add Visual Novel", desc: "Title (original), Latin title, Alias, Length (Very short < 2h, Short 2-10h, Medium 10-30h, Long 30-50h, Very long > 50h).", output: "" },
          { cmd: "Releases", desc: "Cada plataforma/idioma é um Release separado. Marque engine = Ren'Py.", output: "" },
          { cmd: "Tags", desc: "Use o sistema de tags hierárquico — 'Setting > Café', 'Protagonist > Female', 'Romance > Slow burn'.", output: "tags ajudam recomendação automática" },
          { cmd: "Producer / Staff", desc: "Vincule seu user-page (writer, artist, programmer, composer) — vira seu portfólio público.", output: "" },
        ]}
      />

      <h2>5. Game Jams — a melhor forma de terminar uma VN</h2>

      <p>
        Game Jam é uma corrida criativa: tema é anunciado, você tem prazo curto
        (2 dias a 1 mês) para criar e submeter um jogo. Para Visual Novels,
        as três jams essenciais são:
      </p>

      <CommandTable
        title="Jams de Visual Novel que você precisa conhecer"
        variations={[
          {
            cmd: "NaNoRenO",
            desc: "A jam-mãe das VNs. Acontece todo MARÇO desde 2005. Você tem o mês inteiro para fazer uma VN do zero. ~300 jogos por edição.",
            output: "itch.io/jam/nanoreno-2026 · sem prêmio em dinheiro · prestígio enorme",
          },
          {
            cmd: "Spooktober",
            desc: "Outubro · tema Halloween/horror. Excelente para experimentar gênero diferente.",
            output: "spooktoberjam.com",
          },
          {
            cmd: "Yuri Game Jam",
            desc: "Agosto · romances entre mulheres · comunidade super acolhedora.",
            output: "itch.io/jam/yuri-jam",
          },
          {
            cmd: "Kawaii Game Jam",
            desc: "Bianual · estética cute/slice-of-life · ótima para VNs leves.",
            output: "itch.io/jam/kawaii-jam",
          },
          {
            cmd: "BIGFestival Jam (BR)",
            desc: "Brazilian Independent Games Festival — categoria Visual Novel desde 2022.",
            output: "bigfestival.com.br · única jam grande nacional com curadoria",
          },
        ]}
      />

      <PracticeBox
        title="Inscrever-se na próxima NaNoRenO"
        goal="Estar pronto para participar da próxima edição mensal — mesmo que você submeta uma VN de 15 minutos, a experiência transforma sua produtividade."
        steps={[
          "Abra itch.io/jams e busque 'NaNoRenO' ou 'Visual Novel'.",
          "Clique em 'Join jam' (botão grande no topo da página).",
          "Leia o regulamento: tempo, restrições de assets, se permite reusar código antigo.",
          "Entre no Discord da jam (link sempre na página) — é onde você acha parceiros.",
          "Anote no calendário: 1º de março às 00:00 abre. 31 de março às 23:59 fecha.",
          "Suba sua submissão como rascunho dia 25 — sobra tempo para corrigir bugs no fim.",
        ]}
        verify="Você deve aparecer em itch.io/jam/nanoreno-2026/entries (depois que submeter) e na lista de participantes desde o aceite."
      />

      <h2>6. Comunidade brasileira de VN</h2>

      <p>
        A cena brasileira de Visual Novel é pequena mas crescente. Os pontos
        de encontro principais:
      </p>

      <CommandTable
        title="Comunidades BR para entrar"
        variations={[
          {
            cmd: "Discord 'VN Brasil'",
            desc: "Servidor PT-BR generalista de Visual Novel — recomendações, devs, tradutores.",
            output: "links circulam em /r/visualnovels · busque 'discord vn brasil'",
          },
          {
            cmd: "Discord 'Ren'Py BR'",
            desc: "Foco em Ren'Py em PT, ajuda com erros, compartilhamento de assets.",
            output: "menor (~500 membros) mas todo mundo se conhece",
          },
          {
            cmd: "Subreddit /r/visualnovelsBR",
            desc: "Subreddit brasileiro · indica VNs traduzidas · espaço para devs locais postarem.",
            output: "",
          },
          {
            cmd: "Grupo Telegram 'Tradutores VN BR'",
            desc: "Coletivo que traduz VNs JP/EN para PT-BR — Higurashi, Umineko, Steins;Gate.",
            output: "ótima porta de entrada para conhecer roteiristas",
          },
          {
            cmd: "GameDev Brasil (Discord)",
            desc: "Servidor amplo de gamedev nacional — canal #visual-novel ativo.",
            output: "discord.gg/gamedev-brasil",
          },
        ]}
      />

      <AlertBox type="warning" title="Carreira indie de VN no Brasil — expectativa realista">
        Vender VN como ofício principal no Brasil é raro. A maioria dos
        brasileiros que vivem disso combina: (1) lança em inglês via Itch.io e
        Steam para alcançar mercado global, (2) faz arte/programação freelance
        para outros estúdios entre projetos, (3) usa Patreon/Apoia.se para
        renda recorrente durante o desenvolvimento. Espere 2 a 4 anos para uma
        VN comercial completa render dinheiro consistente. Comece como hobby,
        construa portfólio em jams, depois pense em monetizar.
      </AlertBox>

      <h2>7. Como contribuir com a engine Ren'Py</h2>

      <p>
        Ren'Py é open-source (licença MIT) e o código vive no GitHub em{" "}
        <a href="https://github.com/renpy/renpy" target="_blank" rel="noreferrer">
          github.com/renpy/renpy
        </a>
        . Há quatro formas de contribuir, em ordem de complexidade crescente:
      </p>

      <CommandTable
        title="Formas de contribuir, da mais fácil à mais difícil"
        variations={[
          {
            cmd: "Reportar bug bem documentado",
            desc: "Issue no GitHub com versão, SO, código mínimo reproduzível e log de erro completo.",
            output: "PyTom prioriza issues com .rpy de teste anexado",
          },
          {
            cmd: "Traduzir a engine",
            desc: "Os arquivos de localização ficam em renpy/common/_layout/ e renpy/translate/. Há tradução PT-BR oficial mantida por voluntários.",
            output: "PR direto no GitHub · revisão em ~1 semana",
          },
          {
            cmd: "Melhorar a documentação",
            desc: "Docs em renpy.org/doc são geradas de Sphinx (.rst) no repo. Erros de português, exemplos faltantes, links quebrados — tudo aceita PR.",
            output: "github.com/renpy/renpy/tree/master/sphinx",
          },
          {
            cmd: "PR de código (Python)",
            desc: "Conheça PEP 8, escreva teste, abra PR pequeno e focado. Discuta no Discord #engine-dev antes para alinhar com PyTom.",
            output: "PRs grandes sem discussão prévia tendem a ser rejeitados",
          },
        ]}
      />

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/repos"
        lines={[
          { cmd: "git clone https://github.com/renpy/renpy.git && cd renpy", outType: "muted" },
          {
            cmd: "git log --since='1 month ago' --oneline | head -8",
            out: `a1b2c3d Fix dissolve transition with NVL mode
e4f5g6h Add WebP lossless support to im.Data
i7j8k9l Translate gui defaults to pt_br (thanks @sakura-dev)
m0n1o2p Bump pygame_sdl2 to 2.1.0
q3r4s5t Fix Android build with NDK r26
u6v7w8x Improve renpy.exe . lint output color
y9z0a1b Add Vorbis tag support to MusicRoom
c2d3e4f Update default GUI font to Inter`,
            outType: "info",
          },
          {
            cmd: "git checkout -b fix/typo-pt-br-tutorial && nano translations/pt_br/common.rpy",
            outType: "muted",
          },
          {
            cmd: "git commit -am 'fix(pt_br): corrige tipo no tutorial inicial' && git push origin fix/typo-pt-br-tutorial",
            out: "Pull request: https://github.com/renpy/renpy/pull/4521",
            outType: "success",
          },
        ]}
      />

      <h2>8. Construindo audiência ANTES do lançamento</h2>

      <p>
        Visual Novel é gênero de nicho — você não vence pela quantidade, vence
        pela <em>fidelidade</em>. Os autores que mais convertem fazem
        devlogs constantes desde a primeira semana. Algumas táticas que
        funcionam na cena VN:
      </p>

      <OutputBlock label="checklist de marketing pré-lançamento (12 semanas antes)" type="success">
{`[ -12 sem] Página Itch.io criada como Draft com 1 screenshot e logline
[ -10 sem] Twitter/Bluesky/Mastodon dedicado ao jogo, 2 posts/semana com WIP
[  -8 sem] Devlog #1 no Itch + crosspost no /r/RenPy contando o conceito
[  -6 sem] Trailer de 30 segundos com 3 cenas + música original
[  -5 sem] Press kit (presskit.dev) com logos, screenshots, GIFs, contato
[  -4 sem] Email para 10 jornalistas de indie (@cliffski, RPS, Hardcore Gamer)
[  -3 sem] Página Steam Coming Soon (se for vender por lá — taxa US$100)
[  -2 sem] Demo gratuita liberada · postagem em 5 subreddits relevantes
[  -1 sem] Devlog final + countdown nas redes · convidar streamers/VTubers
[ DAY 0 ] Lança! · Atualiza todas redes · responde TODO comentário
[ +1 sem] Devlog 'Lessons learned' · agradece comunidade · vira a página`}
      </OutputBlock>

      <PracticeBox
        title="Seu primeiro devlog"
        goal="Publicar 1 devlog público sobre uma VN que você ainda não terminou — destrava o medo de mostrar trabalho em andamento."
        steps={[
          "Crie a página da VN no Itch.io (mesmo sem build).",
          "Em Dashboard → Devlog → New post, título: 'Anunciando [Nome]: meu primeiro Ren'Py'.",
          "Conteúdo: 3 parágrafos curtos: (1) o que é, (2) por que está fazendo, (3) o que vem depois.",
          "Anexe 1 screenshot ou wireframe — pode ser do Launcher se não tiver arte.",
          "Compartilhe link no /r/RenPy + Discord oficial canal #showcase + Twitter com hashtag #renpy #visualnovel.",
        ]}
        verify="Você ganhou ao menos 5 comentários ou 10 cliques no Itch (analytics aparece em Dashboard). Mais importante: superou a inércia."
      />

      <h2>9. Contas e canais para seguir AGORA</h2>

      <CommandTable
        title="Pessoas e canais ativos da cena Ren'Py"
        variations={[
          { cmd: "@renpytom (Bluesky/Twitter)", desc: "Tom Rothamel — criador do Ren'Py. Anuncia releases e responde dúvidas técnicas.", output: "" },
          { cmd: "Cuechan (YouTube)", desc: "Canal pioneiro de tutoriais Ren'Py em inglês — mais de 60 vídeos, do básico ao avançado.", output: "youtube.com/@Cuechan" },
          { cmd: "KochiKun (YouTube)", desc: "Tutoriais em inglês com foco em GUI, screens e ATL.", output: "" },
          { cmd: "Lewdie's Ren'Py Tutorials (YouTube)", desc: "Série longa, didática, foco em iniciante.", output: "" },
          { cmd: "Christy Dena (blog)", desc: "Pesquisadora de narrativa interativa — artigos profundos sobre branching.", output: "christydena.com" },
          { cmd: "Emily Short (blog)", desc: "Lenda da interactive fiction · análises críticas de VNs e parser games.", output: "emshort.blog" },
          { cmd: "Visual Novel Conference (anual)", desc: "Conferência online gratuita · palestras gravadas em YouTube.", output: "vnconf.com" },
        ]}
      />

      <AlertBox type="success" title="Próximo passo concreto">
        Não saia desta página sem fazer pelo menos UMA destas três ações: (a)
        entrar no Discord oficial Ren'Py, (b) criar conta no Itch.io e marcar a
        próxima NaNoRenO como interessado, (c) postar no /r/RenPy se
        apresentando como dev iniciante BR. A comunidade vai te receber bem —
        é literalmente o jeito como ela funciona desde 2003.
      </AlertBox>
    </PageContainer>
  );
}
