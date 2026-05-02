import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Historia() {
  return (
    <PageContainer
      title="História — das VNs japonesas ao Ren'Py moderno"
      subtitle="De Yu-No e Higurashi nos anos 1990 ao boom indie de Doki Doki Literature Club e VA-11 HALL-A. Como o Ren'Py virou padrão da cena VN ocidental e por que nada conseguiu destroná-lo desde 2003."
      difficulty="iniciante"
      timeToRead="14 min"
      prompt="comece-aqui/historia"
    >
      <AlertBox type="info" title="Por que aprender história importa">
        Ler a evolução das VNs te ajuda a entender por que o Ren'Py funciona do
        jeito que funciona. As decisões de design (textbox embaixo, sprites no
        meio, menu de escolha clicável) não vêm do nada — vêm de 30 anos de
        convenção japonesa. E os games modernos (DDLC, VA-11 HALL-A) só foram
        possíveis porque o Ren'Py democratizou o que antes só engines
        proprietárias japonesas faziam.
      </AlertBox>

      <h2>1. As raízes japonesas (1980-1995)</h2>
      <p>
        O gênero Visual Novel nasceu no Japão como derivado dos{" "}
        <strong>jogos de aventura em texto</strong> dos anos 1980. Os
        computadores PC-88 e PC-98 da NEC eram caros e rodavam jogos com pouco
        gráfico, muito diálogo e escolhas estilo livro-jogo. Foi nesse
        ecossistema que estúdios como Koei, ELF e Leaf começaram a misturar
        narrativa, sprites de personagens e trilha sonora em obras híbridas.
      </p>

      <p>
        O termo “Visual Novel” se cristalizou com <strong>Yu-No: A Girl Who
        Chants Love at the Bound of this World</strong> (ELF, 1996) e com o
        sucesso da Leaf, que lançou a série <em>Leaf Visual Novel
        Series</em> — a primeira a usar o nome “visual novel” na própria caixa
        do jogo. Eram títulos adultos, complexos, com sistemas de fluxograma
        para múltiplos finais. Tudo escrito em engines proprietárias,
        japonesas, inacessíveis para indies.
      </p>

      <CommandTable
        title="Marcos da era pioneira"
        variations={[
          { cmd: "1992", desc: "Otogirisō (Chunsoft) — primeiro 'sound novel', avô direto da VN.", output: "Plataforma: Super Famicom. Texto sobre paisagens estáticas + música." },
          { cmd: "1996", desc: "Yu-No (ELF) — populariza o termo 'visual novel'.", output: "PC-98. Sistema de paralelismo de mundos com fluxograma visível." },
          { cmd: "1998", desc: "Tsukihime (TYPE-MOON) — doujin VN free, vira lenda.", output: "Inicia o universo Nasu (Fate/stay night)." },
          { cmd: "2002", desc: "Higurashi no Naku Koro ni (07th Expansion).", output: "Doujin VN de horror, vira anime, manga, jogos. Mostra que indies podem fazer VN." },
          { cmd: "2004", desc: "Fate/stay night (TYPE-MOON).", output: "Marco do gênero — sprites, dublagem, 3 rotas, 60h de leitura." },
          { cmd: "2005", desc: "School Days (0verflow).", output: "Famoso pelos finais explícitos. Inova com cinemáticas animadas." },
        ]}
      />

      <h2>2. O nascimento do Ren'Py (2003)</h2>
      <p>
        Em julho de 2003, <strong>Tom "PyTom" Rothamel</strong> — programador
        americano e fã de Visual Novels — publicou a primeira versão do
        Ren'Py. O nome vem de <strong>Ren'ai</strong> (恋愛, “romance” em
        japonês) + <strong>Python</strong>. A motivação era simples: jogos
        japoneses incríveis estavam presos em engines proprietárias japonesas,
        traduzidas amadoramente, sem ferramentas para fãs criarem as suas
        próprias VNs em inglês.
      </p>

      <p>
        Ren'Py começou como um motor minimalista para rodar uma VN específica
        chamada <em>Moonlight Walks</em>, mas rapidamente cresceu. A combinação
        de licença <strong>MIT</strong>, sintaxe simples (<em>renpy script</em>{" "}
        em cima de Python), suporte multiplataforma desde o início (Windows,
        Mac, Linux) e documentação em inglês de qualidade fez com que
        praticamente toda VN ocidental indie a partir de 2008 escolhesse
        Ren'Py.
      </p>

      <CodeBlock
        language="python"
        title="trecho representativo de uma VN dos anos 2000 em Ren'Py"
        code={`# Estilo clássico Ren'Py — script.rpy
init python:
    config.window_title = "Moonlight Walks"

define m = Character("Marie", color="#aaccff")

label start:

    scene bg park_night
    with fade

    "A lua estava cheia naquela noite."

    show marie smile at center
    with dissolve

    m "Vamos caminhar mais um pouco?"

    menu:
        "Aceitar":
            $ amizade += 1
            jump cena_lago
        "Ir para casa":
            jump cena_casa`}
      />

      <h2>3. A virada indie ocidental (2010-2017)</h2>
      <p>
        Por mais de uma década, o Ren'Py viveu na cena <em>otome</em> e
        <em> dating sim</em> em inglês com público fiel mas pequeno. Foi em
        2014-2017 que VNs ocidentais explodiram para o mainstream — e a quase
        totalidade delas usava Ren'Py. Três títulos ilustram a virada:
      </p>

      <CommandTable
        title="VNs ocidentais que viraram fenômeno (todas em Ren'Py)"
        variations={[
          {
            cmd: "Long Live the Queen (2012)",
            desc: "Hanako Games. Educar uma rainha adolescente — gerenciar stats + escolhas com 41 finais.",
            output: "Vendeu 1M+ no Steam. Provou que VN com mecânicas de RPG vendia para público pop.",
          },
          {
            cmd: "Analogue: A Hate Story (2012)",
            desc: "Christine Love. Sci-fi feminista com puzzles de hacking.",
            output: "Aclamado pela imprensa indie (Rock Paper Shotgun, Polygon). Sequência: Hate Plus.",
          },
          {
            cmd: "VA-11 HALL-A (2016)",
            desc: "Sukeban Games (Venezuela). Cyberpunk + bartender simulator. Versão original em Ren'Py, depois portada para GameMaker.",
            output: "Eleito uma das melhores VNs ocidentais de todos os tempos. Trilha sonora vendeu mais que muito jogo.",
          },
          {
            cmd: "Doki Doki Literature Club! (2017)",
            desc: "Team Salvato. Free no itch.io e Steam. Rompe a quarta parede de forma psicológica.",
            output: "20+ milhões de downloads. Maior VN indie da história. Ganhou prêmios IGF.",
          },
        ]}
      />

      <p>
        Doki Doki em particular merece uma menção: foi o primeiro grande hit
        viral de uma VN feita em Ren'Py por uma equipe pequena (Dan Salvato +
        artistas). O fato de ter sido distribuída de graça no itch.io,
        combinada com o twist meta que se aproveita de mexer nos próprios
        arquivos <code>.rpy</code> e <code>.chr</code>, mostrou ao mundo que
        Ren'Py não era só uma engine — era uma plataforma para experimentar
        narrativa.
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/ddlc-clone"
        lines={[
          {
            comment: "DDLC mexia nestes arquivos para o efeito 'corrupção'",
            cmd: "ls -la characters/",
            out: `monika.chr      → 'arquivo de personagem' (na verdade, lê/escreve em runtime!)
sayori.chr
natsuki.chr
yuri.chr`,
            outType: "info",
          },
          {
            comment: "renpy.exe . lint num projeto típico de 2017",
            cmd: "renpy.exe . lint",
            out: `Ren'Py 6.99.12 lint report
The game contains 22 menus, 1,847 dialogue blocks, 87,124 words.
Lint took 4.18 seconds.`,
            outType: "muted",
          },
        ]}
      />

      <h2>4. A era moderna — Ren'Py 7 e 8 (2018-hoje)</h2>
      <p>
        O Ren'Py 7 (2018) trouxe suporte completo a Python 2 estável. O Ren'Py
        8 (2022) finalmente migrou para <strong>Python 3</strong>, modernizando
        o motor sem quebrar quase nenhuma VN antiga. Hoje, em 2025, a versão
        estável é a <strong>8.x</strong>, com features incríveis:
      </p>

      <ul>
        <li><strong>Web build</strong> nativo (HTML5 + WebAssembly) — joga no navegador.</li>
        <li><strong>Android build</strong> via RAPT — APK e AAB para Play Store.</li>
        <li><strong>iOS build</strong> via projeto Xcode (precisa de Mac).</li>
        <li><strong>Layered Images</strong> — montar sprites por camadas (expressão + roupa + acessório) automaticamente.</li>
        <li><strong>Live2D</strong> — integração oficial com sprites animados estilo VTuber.</li>
        <li><strong>Self-Voicing</strong> — leitor de tela acessível para deficientes visuais.</li>
        <li><strong>Translate em tempo real</strong> via <code>renpy.translate</code> com gettext.</li>
      </ul>

      <h2>5. Ren'Py vs concorrentes</h2>
      <p>
        O Ren'Py não é a única engine de VN, mas é a mais usada por uma
        margem larga. Aqui está a comparação direta com os principais
        concorrentes em 2025:
      </p>

      <CommandTable
        title="Comparação: engines de Visual Novel em 2025"
        variations={[
          {
            cmd: "Ren'Py 8.x",
            desc: "Open-source MIT, Python, terminal-based, multiplataforma (PC/Mac/Linux/Web/Android/iOS).",
            output: "Grátis. Comunidade gigante. Curva: 2-3 dias para o básico. Melhor custo-benefício do mercado.",
          },
          {
            cmd: "TyranoBuilder",
            desc: "Comercial (~ U$ 15), drag-and-drop visual, baseado em TyranoScript (JS).",
            output: "Bom para quem tem alergia a código. Limitado em customização. Comunidade pequena.",
          },
          {
            cmd: "TyranoScript",
            desc: "Versão script do TyranoBuilder, gratuita. JS + tags HTML-like.",
            output: "Forte no Japão. Documentação majoritariamente em japonês. Web-first." ,
          },
          {
            cmd: "Naninovel",
            desc: "Asset comercial do Unity (~ U$ 130). Roda VN dentro do Unity.",
            output: "Indicada se você JÁ usa Unity. Se não, é trocar uma engine por duas.",
          },
          {
            cmd: "VN Maker (Degica)",
            desc: "Discontinuado em 2020. Era da família RPG Maker, focado em VN.",
            output: "Não use mais. Sem suporte. Histórico para fins comparativos." ,
          },
          {
            cmd: "Visual Novel Maker (própria)",
            desc: "Engine pequena baseada em RPG Maker MV. Comunidade quase morta.",
            output: "Não recomendada para projetos novos.",
          },
          {
            cmd: "Suika2 (jp)",
            desc: "Open-source japonesa, leve, baseada em C. Cresceu muito desde 2022.",
            output: "Boa para portar VNs antigas. Documentação em japonês." ,
          },
          {
            cmd: "BGE (Twine)",
            desc: "Twine é hipertexto, não VN — mas muita gente confunde.",
            output: "Use só se a sua VN for 99% texto sem sprites." ,
          },
        ]}
      />

      <OutputBlock label="por que Ren'Py vence em 2025" type="success">
{`+ Licença MIT — vende sem royalty.
+ Comunidade ativa (Discord, fórum lemmasoft, /r/renpy).
+ Documentação completa em renpy.org/doc — em inglês decente.
+ Build para 7 plataformas com 1 clique.
+ Funciona em PC fraco — não exige GPU dedicada.
+ Tom Rothamel ainda mantém o motor pessoalmente após 22 anos.
+ Suporte oficial a Live2D e screen reader.
+ 90%+ das VNs indie ocidentais usam — você nunca fica sozinho.

- Lint às vezes solta warnings vagos.
- Live preview de mudanças no script exige reload manual.
- iOS build é chato (Mac + Xcode + provisioning profile).`}
      </OutputBlock>

      <h2>6. A cena brasileira</h2>
      <p>
        O Brasil tem uma cena pequena mas crescente de VN. Estúdios como{" "}
        <strong>Lobo Cinzento Games</strong> (autores de várias jams),{" "}
        <strong>Kitsune Games</strong> e desenvolvedores solo no itch.io
        publicam regularmente em PT-BR. Eventos como a <strong>BIG
        Festival</strong> (Brazil's Independent Games Festival), a{" "}
        <strong>Brasil Game Show</strong> e jams como a <strong>Game Maker's
        Toolkit Jam</strong> têm tido VNs brasileiras competindo de igual para
        igual com produções gringas.
      </p>

      <p>
        O Ren'Py também tem uma comunidade lusófona discreta no Discord oficial
        e em servidores brasileiros de game dev. A documentação ainda não tem
        tradução PT-BR oficial — mais um motivo para guias como este existirem.
      </p>

      <PracticeBox
        title="Explorar uma VN clássica para se inspirar"
        goal="Jogar pelo menos 30 minutos de uma VN feita em Ren'Py para sentir as convenções de UI, ritmo e narrativa."
        steps={[
          "Acesse https://store.steampowered.com/app/698780/Doki_Doki_Literature_Club/ e baixe Doki Doki Literature Club (gratuito).",
          "Alternativa: baixe 'The Question' (vem com o SDK do Ren'Py) — uma mini-VN de 10 minutos feita pelo PyTom como exemplo.",
          "Jogue prestando atenção em: como a textbox aparece, como os menus são apresentados, como as transições entre cenas funcionam.",
          "Anote 3 elementos de UI que você quer replicar na sua VN.",
          "Depois, abra a pasta de instalação e olhe os arquivos .rpa (arquivos compactados de VN) — tudo isso veio de scripts .rpy iguais aos que você vai escrever.",
        ]}
        verify="Você consegue descrever, com suas palavras, como as escolhas afetam a história e por que a textbox fica embaixo."
      />

      <AlertBox type="warning" title="Sobre Doki Doki Literature Club">
        A obra contém temas pesados (depressão, automutilação, suicídio).
        Existe um aviso na tela inicial. Se isso é gatilho para você, escolha
        outra VN — Long Live the Queen e VA-11 HALL-A são alternativas
        excelentes e mais leves.
      </AlertBox>

      <h2>7. Por que isso tudo importa para você</h2>
      <p>
        Você está prestes a entrar em uma tradição de 30+ anos de narrativa
        interativa, com ferramentas que estudantes de programação no Japão dos
        anos 90 só sonhavam em ter. O Ren'Py é, hoje, a porta mais fácil que
        existe para criar uma VN: instala em 2 minutos, primeiro “Olá mundo” em
        5, primeiro projeto rodável em 1 hora. Aproveite que o caminho está
        pavimentado.
      </p>

      <AlertBox type="success" title="Próximo passo">
        Vá direto para a página <strong>Instalação</strong> e baixe o Ren'Py
        8.x do site oficial (renpy.org). Em menos de 10 minutos você terá a
        engine instalada e o tutorial oficial rodando.
      </AlertBox>
    </PageContainer>
  );
}
