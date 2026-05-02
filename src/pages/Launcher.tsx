import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Launcher() {
  return (
    <PageContainer
      title="O Launcher — seu painel de controle"
      subtitle="Tour completo pelo Launcher do Ren'Py: criar projeto, abrir pasta, escolher editor, mudar o diretório de projetos, rodar lint e build de distribuição."
      difficulty="iniciante"
      timeToRead="12 min"
      prompt="setup/launcher"
    >
      <p>
        O Launcher é a primeira coisa que abre quando você executa{" "}
        <code>renpy.sh</code> ou <code>renpy.exe</code>. Ele <strong>é uma
        Visual Novel feita em Ren'Py</strong> — você está olhando para um
        projeto que mora em <code>~/renpy-sdk/launcher/</code>. Isso significa
        que tudo que você aprender aqui também serve para customizar telas do
        seu jogo.
      </p>

      <AlertBox type="info" title="O Launcher É Ren'Py rodando Ren'Py">
        Quando você clica em <em>Launch Project</em>, o Launcher chama uma
        nova instância da engine apontando para o projeto-alvo. É por isso
        que você pode ter o Launcher aberto e o jogo rodando ao mesmo tempo,
        em janelas separadas. Inception literalmente.
      </AlertBox>

      <h2>1. Painel principal — anatomia da janela</h2>
      <p>
        Ao abrir o Launcher você vê três áreas: a <strong>lista de projetos
        </strong> à esquerda, o <strong>painel de ações</strong> à direita
        (Launch, Script, Build, etc.), e o rodapé com versão da engine,
        editor selecionado e idioma. Cada elemento aqui dispara um comando
        equivalente que você poderia chamar pela linha de comando.
      </p>

      <OutputBlock label="layout do Launcher" type="info">
{`┌──────────────────────────────────────────────────────────────────┐
│  Ren'Py 8.3.7.24061608                                  [PT-BR ▾]│
├──────────────────┬───────────────────────────────────────────────┤
│  PROJECTS        │   sakura-cafe                                 │
│ ▸ launcher       │   ─────────────────────────────────────       │
│ ▸ the_question   │   [ Launch Project ]   [ script.rpy ]         │
│ ▸ tutorial       │   [ options.rpy ]      [ gui.rpy ]            │
│ ▸ sakura-cafe ●  │                                               │
│                  │   ACTIONS                                     │
│  + Create New    │   • Open Directory   ▸ game / images / audio  │
│  ↻ Refresh       │   • Edit File        ▸ all script files       │
│                  │   • Generate         ▸ images.rpy, gui.rpy    │
│                  │   • Force Recompile                            │
│                  │   • Delete Persistent                         │
│                  │   • Build Distributions                       │
│                  │   • Android / Web                             │
├──────────────────┴───────────────────────────────────────────────┤
│  Editor: VSCode ▾   Projects directory: ~/projetos   Preferences │
└──────────────────────────────────────────────────────────────────┘`}
      </OutputBlock>

      <h2>2. Criar um novo projeto</h2>
      <p>
        Clique em <strong>+ Create New Project</strong>. Um wizard guia por 4
        passos: nome interno (sem acentos, sem espaços), nome humano (pode
        ter qualquer coisa, é o que aparece na barra do jogo), resolução
        padrão e tema do GUI. Depois disso o Launcher copia o template para
        a pasta de projetos e já abre o novo projeto selecionado.
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/renpy-sdk"
        lines={[
          {
            comment: "equivalente CLI: criar projeto a partir do template",
            cmd: "./renpy.sh launcher distribute --create sakura-cafe",
            out: `Creating project 'sakura-cafe' in /home/dev/projetos
Copying template (1280x720, GUI 'Bubble').
Generating game/script.rpy
Generating game/options.rpy
Generating game/gui.rpy
Generating game/screens.rpy
Project created successfully.`,
            outType: "success",
          },
          {
            cmd: "ls ~/projetos/sakura-cafe",
            out: "game/  cache/  saves/",
            outType: "info",
          },
        ]}
      />

      <h2>3. Botões de ação — o que cada um faz</h2>

      <CommandTable
        title="Botões da coluna direita do Launcher"
        variations={[
          {
            cmd: "Launch Project",
            desc: "Abre uma nova instância da engine rodando o jogo selecionado.",
            output: "Equivale a: ./renpy.sh sakura-cafe",
          },
          {
            cmd: "script.rpy",
            desc: "Abre o arquivo principal de script no editor configurado.",
            output: "Atalho para edit_file → game/script.rpy",
          },
          {
            cmd: "options.rpy",
            desc: "Abre as opções globais (config.name, version, save_directory).",
            output: "Edita game/options.rpy",
          },
          {
            cmd: "gui.rpy",
            desc: "Customização visual (cores, fontes, tamanhos do textbox).",
            output: "Edita game/gui.rpy",
          },
          {
            cmd: "Open Directory ▸ game",
            desc: "Abre a pasta game/ no gerenciador de arquivos do sistema.",
            output: "xdg-open / explorer.exe / open",
          },
          {
            cmd: "Force Recompile",
            desc: "Apaga todos os .rpyc e força recompilação de cada .rpy.",
            output: "Útil quando algo está em estado inconsistente após edição manual.",
          },
          {
            cmd: "Delete Persistent",
            desc: "Apaga o arquivo persistent (variáveis que sobrevivem entre saves).",
            output: "Resetar 'unlocked_gallery' e flags globais durante testes.",
          },
          {
            cmd: "Lint",
            desc: "Validador estático: indentação, labels não usados, imagens faltando.",
            output: "Equivale a: ./renpy.sh sakura-cafe lint",
          },
          {
            cmd: "Build Distributions",
            desc: "Empacota .zip / .tar.bz2 para Win/Mac/Linux dentro de dists/.",
            output: "Saída em ~/projetos/sakura-cafe-dists/",
          },
          {
            cmd: "Android / Web",
            desc: "Atalhos para os complementos RAPT (Android) e Web Build.",
            output: "Pede download adicional na primeira vez (~150 MB cada).",
          },
        ]}
      />

      <h2>4. Mudar o diretório de projetos</h2>
      <p>
        Por padrão o Launcher procura projetos em uma pasta dentro do próprio
        SDK, o que é ruim — se você atualiza a engine, perde a referência.
        Mude para uma pasta sua, fora do SDK. Vá em{" "}
        <strong>Preferences → Projects Directory</strong> e selecione
        algo como <code>~/projetos</code> (Linux/Mac) ou{" "}
        <code>D:\VN\</code> (Windows).
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~"
        lines={[
          {
            comment: "criar uma pasta organizada antes",
            cmd: "mkdir -p ~/projetos && ls -la ~/projetos",
            out: `total 8
drwxr-xr-x 2 dev dev 4096 Apr  4 10:42 .
drwxr-xr-x 8 dev dev 4096 Apr  4 10:42 ..`,
            outType: "info",
          },
          {
            comment: "agora pelo Launcher: Preferences ▸ Projects Directory ▸ /home/dev/projetos",
            cmd: "echo 'Projects directory atualizado para ~/projetos'",
            outType: "success",
          },
        ]}
      />

      <AlertBox type="warning" title="Não deixe projetos dentro do SDK">
        Se sua pasta de projetos for <code>renpy-sdk/projects/</code>, ao
        atualizar a engine para 8.4 você terá que copiar tudo manualmente. E
        ao tentar empacotar, o build pode acidentalmente incluir a engine
        inteira no zip do jogo. Pasta separada, sempre.
      </AlertBox>

      <h2>5. Escolhendo o editor de código</h2>
      <p>
        Por padrão o Launcher oferece <strong>Editra</strong> (ele baixa
        sozinho na primeira vez), mas é fraco. Você quer um destes:
      </p>

      <CommandTable
        title="Editores recomendados para escrever .rpy"
        variations={[
          {
            cmd: "Visual Studio Code",
            desc: "O mais popular. Instale a extensão 'Ren'Py Language' do LuqueDaniel.",
            output: "Highlight de syntax, autocomplete de Character/jump/label, snippets.",
          },
          {
            cmd: "Atom (legacy)",
            desc: "Editor descontinuado pelo GitHub mas ainda funciona.",
            output: "Pacote 'language-renpy' fornece highlight básico.",
          },
          {
            cmd: "Editra",
            desc: "Editor que vem embutido com o Launcher; só recomendado se nada mais funciona.",
            output: "Sem autocomplete sério. Útil só para edição rápida no Windows.",
          },
          {
            cmd: "JetBrains PyCharm",
            desc: "Para quem já usa PyCharm em outros projetos Python.",
            output: "Sem plugin oficial, mas Python highlighting cobre ~80% do .rpy.",
          },
          {
            cmd: "Sublime Text",
            desc: "Pacote 'Renpy' no Package Control adiciona suporte.",
            output: "Performance excelente em arquivos com 10k+ linhas.",
          },
        ]}
      />

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "instalar a extensão do VSCode pela linha de comando",
            cmd: "code --install-extension LuqueDaniel.languague-renpy",
            out: `Installing extensions...
Extension 'LuqueDaniel.languague-renpy' v2.4.1 was successfully installed.`,
            outType: "success",
          },
          {
            comment: "abrir o projeto inteiro no VSCode",
            cmd: "code ~/projetos/sakura-cafe",
            outType: "muted",
          },
        ]}
      />

      <p>
        Depois de instalar o editor, volte ao Launcher → <strong>Preferences
        → Editor</strong> e selecione <em>Visual Studio Code</em> (ou{" "}
        <em>System Editor</em> para usar o que estiver associado a{" "}
        <code>.rpy</code> no SO). Agora os botões "script.rpy" e "options.rpy"
        do Launcher abrem direto no VSCode.
      </p>

      <h2>6. Rodando o jogo com saída de log</h2>
      <p>
        Quando o jogo dá problema, o Launcher mostra "An exception has
        occurred" — mas a stack trace de verdade fica no log. Sempre tenha
        um terminal aberto rodando a engine pela CLI durante o desenvolvimento:
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/renpy-sdk"
        lines={[
          {
            comment: "modo desenvolvedor com console (Shift+O abre o console no jogo)",
            cmd: "./renpy.sh ~/projetos/sakura-cafe",
            out: `[INFO] Loading project from /home/dev/projetos/sakura-cafe
[INFO] Compiling game/script.rpy
[INFO] Compiling game/options.rpy
[INFO] Compiling game/screens.rpy
[INFO] Compiling game/gui.rpy
[INFO] Window 1280x720 OpenGL OK.
[INFO] Audio: 4 channels (music, sound, voice, ambient).
[INFO] Game ready.`,
            outType: "success",
          },
          {
            comment: "se houver erro, ele aparece aqui ANTES da janela cair",
            cmd: "./renpy.sh ~/projetos/sakura-cafe 2>&1 | tee debug.log",
            out: `File "game/script.rpy", line 14: expected statement.
    s "Olá!
       ^
Ren'Py Version: Ren'Py 8.3.7.24061608`,
            outType: "error",
          },
        ]}
      />

      <h2>7. Preferences avançadas</h2>

      <CodeBlock
        language="ini"
        title="~/.renpy/preferences.cfg (criado automaticamente)"
        code={`# Configurações globais do LAUNCHER (não confundir com o jogo)
projects_directory = /home/dev/projetos
editor = Visual Studio Code
language = pt_br
hardware_video = True
text_size = 22
window_size = 1280x720
auto_open_directory = False
backup_steps = 100
update_channel = stable

# Cache do tutorial — apague para baixar de novo
tutorial_seen = 1`}
      />

      <PracticeBox
        title="Configurar um workspace limpo"
        goal="Deixar o Launcher apontando para uma pasta de projetos própria, com VSCode como editor padrão."
        steps={[
          "Crie a pasta ~/projetos (Linux/Mac) ou D:\\VN (Windows).",
          "Abra o Launcher e vá em Preferences → Projects Directory.",
          "Selecione a pasta criada e clique em Continue.",
          "Volte em Preferences → Editor e escolha Visual Studio Code (instale antes pelo site oficial se preciso).",
          "Crie um projeto-teste chamado 'hello-world' com Create New Project.",
          "Clique em script.rpy — deve abrir direto no VSCode com a syntax já colorida.",
        ]}
        verify="Ao clicar em qualquer arquivo .rpy do Launcher, ele abre no VSCode em uma nova aba (não no Editra)."
      />

      <AlertBox type="success" title="Atalho útil: rodar projeto sem o Launcher">
        Depois que você está confortável com a CLI, abra o jogo direto:{" "}
        <code>./renpy.sh ~/projetos/sakura-cafe</code>. É mais rápido que
        passar pelo Launcher e o output do log fica no seu terminal —
        perfeito para iterar.
      </AlertBox>
    </PageContainer>
  );
}
