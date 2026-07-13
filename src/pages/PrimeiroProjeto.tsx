import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function PrimeiroProjeto() {
  return (
    <PageContainer
      title="Seu primeiro projeto — 'Olá, Sakura!'"
      subtitle="Crie um projeto novo no Launcher, escolha resolução e template, escreva sua primeira fala em script.rpy e veja a heroína dizer 'olá' em menos de 10 minutos."
      difficulty="iniciante"
      timeToRead="15 min"
      prompt="setup/primeiro-projeto"
    >
      <p>
        Esta página é o seu <strong>"Hello World" da Visual Novel</strong>.
        Você vai criar um projeto chamado <code>meu-primeiro-vn</code>,
        escolher resolução, abrir o <code>script.rpy</code> e fazer a
        personagem Sakura dar bom dia. No fim você terá um jogo rodável que
        você pode mostrar para um amigo.
      </p>

      <h2>1. Criando o projeto pelo Launcher</h2>
      <p>
        Abra o Launcher e clique em <strong>+ Create New Project</strong>. O
        wizard tem 4 telas — vamos passar por todas.
      </p>

      <h3>Tela 1 — Nome interno</h3>
      <p>
        Digite <code>meu-primeiro-vn</code>. Esse vai ser o nome da pasta no
        sistema de arquivos. Use <strong>somente</strong> letras minúsculas,
        números, hífens e underline. Sem acento, sem espaço, sem cedilha.
        Esse nome aparece em logs e nos arquivos de save.
      </p>

      <h3>Tela 2 — Resolução padrão</h3>

      <CommandTable
        title="Qual resolução escolher?"
        variations={[
          {
            cmd: "1280x720 (HD)",
            desc: "Padrão histórico do Ren'Py. Sprites de 1500-1800 px de altura ficam ótimos.",
            output: "Recomendado para iniciantes. Roda em qualquer máquina e sprites de banco gratuito vêm nesse tamanho.",
          },
          {
            cmd: "1920x1080 (Full HD)",
            desc: "Padrão moderno. Exige sprites em 2200 px+ e arte de fundo de 1920x1080.",
            output: "Use se você tem arte HD ou se vai vender comercialmente em 2026+.",
          },
          {
            cmd: "1600x900",
            desc: "Meio termo — escala bem para 16:9 sem ficar pesado.",
            output: "Bom para projetos solo com arte gerada por IA.",
          },
          {
            cmd: "800x600 (4:3)",
            desc: "Estilo retrô (Tsukihime, Higurashi originais).",
            output: "Só se você quer um visual deliberadamente nostálgico.",
          },
        ]}
      />

      <p>
        Para este tutorial, escolha <strong>1280x720</strong> — bom suficiente
        para qualquer máquina e fácil de achar arte gratuita do tamanho certo.
      </p>

      <h3>Tela 3 — Template de GUI</h3>
      <p>
        O Launcher oferece dois templates principais: <em>Visual Novel</em>{" "}
        (ADV: textbox no rodapé, padrão) e <em>Question</em> (estilo quiz com
        múltipla escolha sempre visível). Para uma VN normal, escolha{" "}
        <strong>Visual Novel</strong>.
      </p>

      <h3>Tela 4 — Tema visual</h3>
      <p>
        Vão aparecer 4-6 paletas (Bubble, Pink, Blue, Crimson, etc). Escolha
        a que mais combinar com o clima do seu jogo — você pode mudar tudo
        depois em <code>gui.rpy</code>. Para o nosso projeto, pegue{" "}
        <em>Bubble</em>.
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos"
        lines={[
          {
            comment: "depois do wizard, o Launcher gerou:",
            cmd: "ls -la meu-primeiro-vn/",
            out: `total 16
drwxr-xr-x 4 dev dev 4096 Apr  4 11:02 .
drwxr-xr-x 6 dev dev 4096 Apr  4 11:02 ..
drwxr-xr-x 4 dev dev 4096 Apr  4 11:02 game
drwxr-xr-x 2 dev dev 4096 Apr  4 11:02 cache
drwxr-xr-x 2 dev dev 4096 Apr  4 11:02 saves`,
            outType: "info",
          },
          {
            cmd: "ls meu-primeiro-vn/game/",
            out: `audio/   gui/   gui.rpy   images/   options.rpy   screens.rpy   script.rpy`,
            outType: "info",
          },
        ]}
      />

      <AlertBox type="info" title="O Ren'Py já criou um jogo jogável!">
        Antes mesmo de você editar nada, clique em <em>Launch Project</em> no
        Launcher. Vai abrir uma janela mostrando "You created a new Ren'Py
        game" com a Eileen (mascote) explicando o que fazer. Esse é o
        conteúdo padrão do <code>script.rpy</code> — vamos sobrescrevê-lo.
      </AlertBox>

      <h2>2. Editando seu primeiro script.rpy</h2>
      <p>
        No Launcher clique em <strong>script.rpy</strong>. Vai abrir no seu
        editor o arquivo gerado pelo template. Apague todo o conteúdo e cole
        o código abaixo:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`# script.rpy — meu primeiro VN
# Linhas começando com # são comentários e não são executadas.

# 1. Definir personagens
define s = Character("Sakura", color="#ffaacc")
define narrador = Character(None, kind=nvl)

# 2. Definir imagens (não precisamos das imagens reais ainda;
#    o Ren'Py vai mostrar uma cor sólida quando o arquivo não existir)
image bg quarto = "#1a1a2e"
image bg cafe = "#2d1b4e"

# 3. O label 'start' é OBRIGATÓRIO — é onde o jogo começa
label start:
    scene bg quarto with fade

    "É uma manhã ensolarada. O despertador toca."

    s "Bom dia! Eu sou a Sakura."
    s "Bem-vindo ao seu primeiro Visual Novel feito em Ren'Py."

    "Você decide responder."

    s "Vamos tomar um café juntos?"

    scene bg cafe with dissolve

    s "O café da esquina é o meu favorito."
    s "Um dia eu te conto a história desse lugar..."

    "{i}Continua...{/i}"

    return`}
      />

      <p>
        Esse script tem 5 elementos fundamentais que você vai repetir em
        toda VN:
      </p>

      <ol>
        <li><strong>define s = Character(...)</strong> — declara um personagem com cor de nome rosa.</li>
        <li><strong>image bg ... = "..."</strong> — registra uma imagem de fundo (aqui usei códigos hex como placeholder; depois trocaremos por PNGs reais).</li>
        <li><strong>label start:</strong> — todo jogo começa neste label. É o "main()" do Ren'Py.</li>
        <li><strong>scene bg quarto with fade</strong> — limpa a tela e mostra o fundo "quarto" com transição fade.</li>
        <li><strong>s "Olá"</strong> — Sakura diz "Olá". Falas sem personagem (entre aspas) são narração.</li>
      </ol>

      <h2>3. Rodando seu jogo pela primeira vez</h2>
      <p>
        Salve o arquivo (Ctrl+S no editor) e volte ao Launcher. Clique em{" "}
        <strong>Launch Project</strong>. Em ~2 segundos o jogo abre e você vê
        sua narração aparecer no textbox.
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/meu-primeiro-vn"
        lines={[
          {
            comment: "ou rode pela CLI para ver o log",
            cmd: "../../renpy-sdk/renpy.sh .",
            out: `[INFO] Ren'Py 8.3.7.24061608 starting up.
[INFO] Compiling game/script.rpy ... ok (0.04s)
[INFO] Compiling game/options.rpy ... ok (0.01s)
[INFO] Compiling game/gui.rpy ... ok (0.02s)
[INFO] Window 1280x720 OpenGL OK.
[INFO] Audio backend ready (4 channels).
[INFO] Game ready — entering label 'start'.`,
            outType: "success",
          },
          {
            comment: "validar que não há erro de sintaxe ANTES de testar",
            cmd: "../../renpy-sdk/renpy.sh . lint",
            out: `Lint is mostly used to check Ren'Py scripts for errors.
Statistics:
The game contains 7 dialogue blocks, totalling 47 words.
Lint took 0.12s.

OK. (No problems found.)`,
            outType: "success",
          },
        ]}
      />

      <p>
        Clique pelo jogo: cada clique avança uma fala. Quando chegar em "Continua..."
        e clicar de novo, o jogo retorna ao menu principal (graças ao{" "}
        <code>return</code>).
      </p>

      <AlertBox type="warning" title="Indentação importa MUITO no Ren'Py">
        Tudo dentro de um <code>label</code> precisa ser indentado com{" "}
        <strong>exatamente 4 espaços</strong>. Misturar tabs com espaços
        causa <em>IndentationError</em>. Configure seu editor para "Insert
        spaces" e tab = 4 antes de começar.
      </AlertBox>

      <h2>4. Adicionando uma escolha (menu)</h2>
      <p>
        Toda VN de verdade tem escolhas. Vamos adicionar um <code>menu</code>{" "}
        onde o jogador decide se aceita ou recusa o convite da Sakura:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy — versão com menu"
        code={`label start:
    scene bg quarto with fade

    s "Bom dia! Vamos tomar um café juntos?"

    menu:
        "Vamos!":
            jump aceita
        "Hoje não, obrigado.":
            jump recusa

label aceita:
    scene bg cafe with dissolve
    s "Que ótimo! Eu adoro esse cafezinho da esquina."
    s "Obrigada por vir comigo."
    "{i}Fim do prólogo — rota Sakura desbloqueada.{/i}"
    return

label recusa:
    s "Tudo bem, fica para outro dia então."
    s "A gente se vê na escola, ok?"
    "{i}Fim do prólogo — rota amizade desbloqueada.{/i}"
    return`}
      />

      <h2>5. Customizando o título do jogo</h2>
      <p>
        Quando você abre o jogo, a barra de título mostra "A Ren'Py Game".
        Vamos consertar isso editando <code>options.rpy</code>:
      </p>

      <CodeBlock
        language="python"
        title="game/options.rpy (trecho)"
        code={`define config.name = _("Café com Sakura")
define gui.show_name = True
define config.version = "0.1.0"
define gui.about = _("Meu primeiro Visual Novel feito com Ren'Py.\\nFeito por: Você!\\nAbril/2026")

# Pasta onde os saves são gravados (~/.renpy/<save_directory>/)
define config.save_directory = "cafe-com-sakura-1"

# Ativar modo desenvolvedor durante a fase de testes
define config.developer = True`}
      />

      <h2>6. Comandos úteis durante o desenvolvimento</h2>

      <CommandTable
        title="Atalhos in-game (com developer = True)"
        variations={[
          { cmd: "Shift + R", desc: "Recarrega o jogo do label atual após edição.", output: "Sem precisar fechar e abrir." },
          { cmd: "Shift + O", desc: "Abre o console interativo do Ren'Py.", output: "Avalia expressões Python ao vivo." },
          { cmd: "Shift + D", desc: "Abre o menu Developer (image location, variable viewer, etc).", output: "Inspecionar estado do jogo em tempo real." },
          { cmd: "Shift + E", desc: "Abre o script.rpy do label atual no editor.", output: "Edita exatamente onde você está." },
          { cmd: "F", desc: "Toggle fullscreen.", output: "Atalho universal." },
          { cmd: "S", desc: "Tira screenshot em screenshot0001.png.", output: "Salva na raiz do projeto." },
        ]}
      />

      <PracticeBox
        title="Sua primeira fala personalizada"
        goal="Modificar o script.rpy para adicionar uma personagem nova chamada Yuki e fazer ela trocar uma fala com a Sakura."
        steps={[
          "Abra game/script.rpy no editor.",
          "Logo abaixo da linha 'define s = Character(...)' adicione: define y = Character(\"Yuki\", color=\"#aaccff\")",
          "Dentro do label aceita, depois da fala da Sakura no café, adicione: y \"Oi gente! Posso me sentar com vocês?\"",
          "Adicione uma resposta da Sakura: s \"Claro Yuki, senta aqui!\"",
          "Salve o arquivo (Ctrl+S).",
          "No jogo aberto, pressione Shift+R para recarregar — você não precisa fechar nada.",
          "Avance até o café e veja a Yuki entrando em cena com nome em azul.",
        ]}
        verify="Você verá 'Yuki' aparecendo em azul no textbox e a fala dela rolando logo após a da Sakura."
      />

      <h2>7. Conferindo o que existe na pasta agora</h2>

      <OutputBlock label="estado da pasta após edição" type="info">
{`meu-primeiro-vn/
├── game/
│   ├── audio/             (vazio por enquanto)
│   ├── gui/               (assets do GUI: textbox.png, etc)
│   ├── images/            (vazio)
│   ├── tl/                (traduções — vazio)
│   ├── gui.rpy            (cores e fontes)
│   ├── options.rpy        (config.name, version)
│   ├── screens.rpy        (telas: say, choice, main_menu)
│   ├── script.rpy         (SUA HISTÓRIA — você editou esse)
│   ├── script.rpyc        (compilado — gerado automaticamente)
│   ├── options.rpyc
│   ├── gui.rpyc
│   └── screens.rpyc
├── cache/                 (cache de imagens)
└── saves/                 (saves do jogador — apague para resetar)`}
      </OutputBlock>

      <AlertBox type="success" title="Parabéns! Você fez sua primeira VN">
        O que você acabou de criar — mesmo que minimalista — já tem todos os
        elementos essenciais de uma Visual Novel: personagens, cenário,
        diálogos, narração, escolhas e múltiplas rotas. Daqui para frente é
        só sofisticar: sprites de verdade, música, mais escolhas e um sistema
        de afeição. Tudo isso vem nas próximas páginas do guia.
      </AlertBox>
    </PageContainer>
  );
}
