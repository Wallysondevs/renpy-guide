import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function ComeceAqui() {
  return (
    <PageContainer
      title="Comece Aqui — para quem nunca programou"
      subtitle="O que é uma engine, o que é Python, como funciona uma Visual Novel e qual é o fluxo de trabalho com o Ren'Py — escrito para quem nunca abriu um editor de código antes."
      difficulty="iniciante"
      timeToRead="15 min"
      prompt="comece-aqui/introducao"
    >
      <AlertBox type="info" title="Esta página foi escrita para você">
        Se você abriu este guia e pensou “eu não sei programar, será que dou
        conta?” — sim, dá. Ren'Py é, de longe, a engine mais amigável para
        narrativa interativa. A primeira fala da sua VN aparece na tela em
        menos de 5 minutos a partir da instalação. Vamos juntos.
      </AlertBox>

      <h2>1. O que é uma engine?</h2>
      <p>
        Uma <strong>game engine</strong> é uma caixa de ferramentas pronta que
        cuida da parte chata para você: desenhar imagens na tela, tocar
        músicas, salvar o progresso, ler o teclado e o mouse, fazer botões
        funcionarem. Sem engine, você teria que escrever do zero milhares de
        linhas de código de gráficos, áudio e input antes mesmo de digitar a
        primeira fala da sua história.
      </p>

      <p>
        O <strong>Ren'Py</strong> é uma engine especializada em{" "}
        <strong>Visual Novels</strong> e jogos narrativos. Em vez de te dar
        ferramentas para criar um shooter 3D ou um jogo de plataforma, ele
        oferece exatamente o que VN precisa: uma <em>textbox</em> embaixo, um{" "}
        <em>sprite</em> de personagem no meio, um <em>background</em> atrás,
        botões de menu, sistema de save/load, dublagem por linha, suporte a
        múltiplos idiomas e build pronto para PC, web e Android.
      </p>

      <CommandTable
        title="Engines populares — para você situar o Ren'Py"
        variations={[
          { cmd: "Unity", desc: "Engine 3D/2D genérica usada em quase tudo. Curva de aprendizado alta.", output: "Hollow Knight, Cuphead, Cities: Skylines." },
          { cmd: "Unreal Engine 5", desc: "AAA gráfico. Exige PC potente e equipe técnica.", output: "Fortnite, Black Myth: Wukong." },
          { cmd: "Godot", desc: "Engine 2D/3D open-source. Boa para indies que querem flexibilidade.", output: "Cassette Beasts, Brotato." },
          { cmd: "RPG Maker", desc: "Especializada em JRPGs estilo Final Fantasy clássico.", output: "OMORI, To the Moon, Yume Nikki." },
          { cmd: "Ren'Py", desc: "Especializada em Visual Novels e narrativa interativa.", output: "Doki Doki Literature Club, Long Live the Queen, VA-11 HALL-A (versão original)." },
          { cmd: "TyranoBuilder", desc: "Concorrente comercial do Ren'Py — drag-and-drop, paga.", output: "Mais visual, menos flexível." },
        ]}
      />

      <h2>2. O que é Python (e por que isso importa)?</h2>
      <p>
        Por baixo do capô, o Ren'Py é escrito em <strong>Python</strong> — uma
        das linguagens de programação mais populares do mundo, conhecida
        justamente por ser fácil de ler. A boa notícia: você <strong>não
        precisa</strong> aprender Python para começar. O Ren'Py inventou uma
        “linguagem amiga” em cima do Python chamada <strong>Renpy
        Script</strong>, com arquivos <code>.rpy</code>. Essa linguagem é tão
        simples que se parece com um roteiro de teatro.
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy — a sua primeira VN"
        code={`# Define a personagem Sakura — cor de nome rosa
define s = Character("Sakura", color="#ffaacc")

# A história começa aqui
label start:

    scene bg cafe
    with fade

    "Era uma manhã tranquila no Café das Cerejeiras."

    show sakura happy at center
    with dissolve

    s "Bem-vinde! Você é o(a) novo(a) atendente, certo?"

    s "Espero que a gente se dê bem!"

    return`}
      />

      <p>
        Leu esse trecho? Você já entende mais Ren'Py do que pensa. <code>scene</code>{" "}
        troca o cenário de fundo. <code>show</code> faz a personagem aparecer.{" "}
        <code>s "..."</code> é uma fala da Sakura. <code>return</code> termina a
        cena. Não tem mistério.
      </p>

      <p>
        Quando o seu jogo crescer e você quiser contadores de afeição, sistemas
        de inventário ou mini-games, aí você usa Python “de verdade” em blocos{" "}
        <code>init python:</code> ou inline com <code>$ variavel = 10</code>.
        Mas isso vem depois — só quando você precisar.
      </p>

      <h2>3. Como funciona uma Visual Novel?</h2>
      <p>
        Toda VN, do Higurashi ao Doki Doki Literature Club, segue a mesma
        anatomia básica:
      </p>

      <OutputBlock label="anatomia visual de uma cena de VN" type="info">
{`┌─────────────────────────────────────────────────┐
│                                                 │  ← BACKGROUND (BG)
│                                                 │     ex: bg_cafe.png
│              ╔════════════╗                     │
│              ║            ║                     │  ← SPRITE
│              ║   sakura   ║                     │     ex: sakura_happy.png
│              ║   happy    ║                     │
│              ║            ║                     │
│              ╚════════════╝                     │
│                                                 │
├─────────────────────────────────────────────────┤
│ Sakura                                          │  ← NAMEBOX (quem fala)
├─────────────────────────────────────────────────┤
│                                                 │  ← TEXTBOX (fala atual)
│ Bem-vinde! Você é o(a) novo(a)                  │
│ atendente, certo?                          ▼    │  ← clique para avançar
└─────────────────────────────────────────────────┘
                                                  
              ♪ trilha sonora tocando ♪          ← AUDIO (channel "music")`}
      </OutputBlock>

      <h3>3.1 O ciclo de uma cena</h3>
      <ol>
        <li>O jogador clica → próxima fala aparece.</li>
        <li>Em pontos chave, um <strong>menu</strong> com escolhas surge.</li>
        <li>A escolha pode mudar uma variável (<code>afeicao_sakura += 1</code>).</li>
        <li>Em outro ponto, um <code>if</code> verifica essa variável e desvia para um final ou outro.</li>
        <li>Em qualquer momento, o jogador pode salvar, carregar, ou voltar com o botão de rollback.</li>
      </ol>

      <h2>4. O fluxo de trabalho no Ren'Py — 4 passos</h2>
      <CommandTable
        title="O ciclo do(a) desenvolvedor(a) Ren'Py"
        variations={[
          { cmd: "1. Abrir o Launcher", desc: "Janela principal do Ren'Py SDK. Lista os seus projetos.", output: "Veja a tela com 'Tutorial', 'The Question' e os seus projetos." },
          { cmd: "2. Editar script.rpy", desc: "Clicar 'Open Project Folder' e mexer no game/script.rpy com o editor (Atom/VSCode/Editra).", output: "Esse arquivo é o coração da sua VN." },
          { cmd: "3. Run Project", desc: "Botão grande no Launcher. Compila e executa o jogo.", output: "Janela do jogo abre. Você joga, fecha, ajusta e roda de novo." },
          { cmd: "4. Build Distribution", desc: "Quando estiver pronto, gera os zips para PC/Mac/Linux/Web/Android.", output: "Pasta dists/ aparece com os instaladores prontos." },
        ]}
      />

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/renpy-8.2.3"
        lines={[
          {
            comment: "rodar o launcher (Linux). No Windows é só clicar 2x em renpy.exe",
            cmd: "./renpy.sh",
            out: `Bootstrapping Ren'Py 8.2.3.24061702...
Loading Ren'Py launcher...
Launcher window opened on display :0`,
            outType: "info",
          },
          {
            comment: "alternativa: rodar direto um projeto sem abrir o launcher",
            cmd: "./renpy.sh ~/projetos/sakura-cafe",
            out: `Loading project: sakura-cafe
Compiling .rpy → .rpyc ... ok
Starting game...`,
            outType: "success",
          },
          {
            comment: "validar o script antes de publicar",
            cmd: "./renpy.sh ~/projetos/sakura-cafe lint",
            out: `Statistics:
The game contains 1 menus, 6 dialogue blocks, 84 words.
Lint took 0.31 seconds.`,
            outType: "muted",
          },
        ]}
      />

      <h2>5. As 5 pastas que você precisa conhecer</h2>
      <p>
        Quando você cria um novo projeto, o Launcher gera uma pasta com a
        seguinte estrutura. Você vai voltar a ela todo santo dia:
      </p>

      <OutputBlock label="estrutura mínima de um projeto Ren'Py" type="default">
{`sakura-cafe/
├── game/                  ← TUDO que é do seu jogo mora aqui
│   ├── script.rpy         ← roteiro principal (você edita 90% do tempo aqui)
│   ├── options.rpy        ← título, versão, ícone, splash
│   ├── screens.rpy        ← visual do menu, save, preferências
│   ├── gui.rpy            ← cores, fontes, tamanhos
│   ├── audio/             ← suas músicas e SFX (.ogg, .opus, .mp3)
│   ├── images/            ← seus BGs e sprites (.png, .jpg, .webp)
│   ├── tl/                ← traduções (gerado automaticamente)
│   └── saves/             ← saves do jogador (não comite no git)
├── renpy/                 ← o motor (não toque)
└── README.html            ← README padrão`}
      </OutputBlock>

      <AlertBox type="warning" title="Nunca mexa fora de game/">
        A pasta <code>renpy/</code> é o próprio motor. Mexer ali quebra o seu
        projeto e força reinstalação do SDK. Tudo o que é seu fica em{" "}
        <code>game/</code> — sempre.
      </AlertBox>

      <h2>6. O editor de código — onde você vai digitar</h2>
      <p>
        Ren'Py vem com um editor pequeno chamado <strong>Editra</strong>, mas
        a maioria da comunidade usa <strong>VSCode</strong> (gratuito,
        Microsoft) ou <strong>Atom</strong> (descontinuado, mas ainda popular).
        Recomendamos VSCode com a extensão{" "}
        <code>renpy</code> (autocompletar, syntax highlight, lint).
      </p>

      <CommandTable
        title="Configurando o editor padrão no Launcher"
        variations={[
          { cmd: "Preferences → Editor → Atom", desc: "Atom Community vem como padrão sugerido. Funciona, mas o Atom acabou.", output: "Não recomendado em 2025." },
          { cmd: "Preferences → Editor → Visual Studio Code", desc: "Recomendado. Instale antes a extensão 'Ren'Py Language' do marketplace.", output: "Autocomplete + ir até definição + lint em tempo real." },
          { cmd: "Preferences → Editor → System Editor", desc: "Usa o que estiver associado ao .rpy no sistema operacional.", output: "Útil se você prefere nvim, Sublime, Notepad++, Cursor etc." },
          { cmd: "Preferences → Editor → None", desc: "Você abre os arquivos manualmente. Útil em servidores headless.", output: "Não tem botão 'edit script' no launcher." },
        ]}
      />

      <PracticeBox
        title="Abrir o tutorial oficial e ler 5 telas"
        goal="Familiarizar-se com a janela do Launcher e ver uma VN rodando dentro dele antes de criar a sua."
        steps={[
          "Abra o Launcher (renpy.exe no Windows, renpy.sh no Linux/Mac, ou clicando duas vezes no app no macOS).",
          "Na lista da esquerda, escolha o projeto chamado 'Tutorial'.",
          "Clique no botão grande 'Launch Project' (verde, no canto superior direito).",
          "A janela do tutorial abre — clique para avançar 5-10 telas. Repare em como o nome do PyTom aparece na textbox e como os menus funcionam.",
          "Feche o tutorial. De volta ao Launcher, escolha 'The Question' e rode também — é uma mini-VN completa de exemplo.",
        ]}
        verify="Você conseguiu ver pelo menos uma fala, um menu de escolha e o efeito de transição. Se sim, parabéns: a sua instalação está funcionando."
      />

      <h2>7. Por onde seguir agora</h2>
      <p>
        Se você chegou até aqui, está pronto(a) para a parte prática. As
        próximas páginas do guia vão te levar pela mão:
      </p>
      <ul>
        <li><strong>Instalação</strong> — baixar e instalar o Ren'Py 8.x no seu sistema.</li>
        <li><strong>Launcher</strong> — tour completo da janela principal.</li>
        <li><strong>Primeiro Projeto</strong> — você vai criar o “MeuPrimeiroVN” do zero e ver a sua primeira fala aparecer.</li>
        <li><strong>Estrutura de Pastas</strong> — anatomia do <code>game/</code> em detalhes.</li>
        <li><strong>Sintaxe Básica</strong> — labels, statements, indentação.</li>
      </ul>

      <AlertBox type="success" title="Boas-vindas oficiais">
        Você acabou de entrar em uma das comunidades indie mais simpáticas do
        mundo. VN é hobby, é arte, é carreira — e existem brasileiros vendendo
        VNs no Steam ganhando muito bem. Comece pequeno, publique algo
        terminado, e itere.
      </AlertBox>
    </PageContainer>
  );
}
