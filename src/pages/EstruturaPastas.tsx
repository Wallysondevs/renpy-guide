import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function EstruturaPastas() {
  return (
    <PageContainer
      title="Estrutura de pastas de um projeto Ren'Py"
      subtitle="Anatomia completa de um projeto: o que vai em game/, em audio/, em images/, em tl/, em saves/. Quem deve ir para o git, o que deve ser ignorado, e como organizar para um time."
      difficulty="iniciante"
      timeToRead="14 min"
      prompt="setup/estrutura-pastas"
    >
      <p>
        Quando o Launcher cria um projeto, ele monta uma estrutura de pastas
        bem específica. Saber o que cada pasta faz é a diferença entre achar
        um asset em 5 segundos e perder 20 minutos procurando. Esta página é
        o seu mapa permanente.
      </p>

      <h2>1. A árvore completa</h2>

      <OutputBlock label="árvore de um projeto Ren'Py recém-criado + organizado" type="info">
{`sakura-cafe/
├── game/                       ← TUDO que faz parte do jogo mora aqui
│   ├── audio/                  ← música, SFX, voice
│   │   ├── music/
│   │   │   ├── theme_sakura.ogg
│   │   │   └── tema_cafe.ogg
│   │   ├── sound/
│   │   │   ├── sino.ogg
│   │   │   └── click.ogg
│   │   └── voice/
│   │       └── sakura/
│   │           ├── sakura_001.ogg
│   │           └── sakura_002.ogg
│   ├── images/                 ← sprites e backgrounds
│   │   ├── bg/
│   │   │   ├── bg_cafe_dia.png
│   │   │   ├── bg_cafe_noite.png
│   │   │   └── bg_escola.png
│   │   └── sakura/
│   │       ├── sakura_neutra.png
│   │       ├── sakura_feliz.png
│   │       └── sakura_triste.png
│   ├── gui/                    ← assets visuais do menu (textbox.png etc)
│   │   ├── textbox.png
│   │   ├── namebox.png
│   │   ├── main_menu.png
│   │   └── button/
│   ├── tl/                     ← traduções (i18n)
│   │   ├── english/
│   │   └── japanese/
│   ├── script.rpy              ← roteiro principal
│   ├── options.rpy             ← config.name, version, save_directory
│   ├── screens.rpy             ← telas (say, choice, main_menu, preferences)
│   ├── gui.rpy                 ← cores, fontes, tamanhos
│   ├── images.rpy              ← (opcional) declarações 'image ...' centralizadas
│   ├── characters.rpy          ← (opcional) seus 'define s = Character(...)'
│   └── *.rpyc                  ← compilados (gerados — NÃO versionar)
├── cache/                      ← cache de fontes e imagens (NÃO versionar)
├── saves/                      ← saves do jogador (NÃO versionar)
├── log.txt                     ← log da última execução (NÃO versionar)
├── traceback.txt               ← stack trace do último crash
└── .gitignore                  ← criado por você`}
      </OutputBlock>

      <h2>2. A pasta <code>game/</code> — o coração do projeto</h2>
      <p>
        Tudo que o jogador precisa para rodar o jogo está dentro de{" "}
        <code>game/</code>. Quando você empacota uma distribuição, é o
        conteúdo desta pasta + a engine que vão para o <code>.zip</code>.
        Qualquer arquivo solto na raiz do projeto (fora de <code>game/</code>)
        é ignorado pelo build.
      </p>

      <CommandTable
        title="Os arquivos .rpy padrão criados pelo template"
        variations={[
          {
            cmd: "script.rpy",
            desc: "Roteiro principal — labels, diálogos, scenes, jumps. É o que o jogador 'lê'.",
            output: "Você passa 90% do tempo aqui.",
          },
          {
            cmd: "options.rpy",
            desc: "Configurações globais: nome do jogo, versão, ícone, save_directory, splashscreen.",
            output: "config.name, config.version, config.window_icon, config.save_directory.",
          },
          {
            cmd: "screens.rpy",
            desc: "Definições das telas (Screen Language): say, choice, navigation, preferences, save/load.",
            output: "Customize aqui o textbox, o menu de pause, a tela de saves.",
          },
          {
            cmd: "gui.rpy",
            desc: "Variáveis visuais: gui.accent_color, gui.text_font, gui.text_size, gui.choice_button_width.",
            output: "Ajustes finos sem mexer nas screens.",
          },
          {
            cmd: "images.rpy (opcional)",
            desc: "Bom lugar para concentrar todas as declarações 'image bg ...' e 'image sakura ...'.",
            output: "Mantém o script.rpy enxuto. Não é obrigatório.",
          },
          {
            cmd: "characters.rpy (opcional)",
            desc: "Concentra os 'define X = Character(...)' de cada personagem.",
            output: "Facilita encontrar e ajustar cores de nome.",
          },
        ]}
      />

      <h2>3. A pasta <code>audio/</code> — três canais clássicos</h2>
      <p>
        Não é obrigatório criar subpastas <code>music/</code>,{" "}
        <code>sound/</code>, <code>voice/</code>, mas é uma convenção quase
        universal porque os três canais padrão do Ren'Py têm exatamente esses
        nomes. Use <code>.ogg</code> sempre que possível (tem suporte nativo
        e licença livre, diferente do MP3).
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy — referenciando arquivos de audio"
        code={`label start:
    play music "audio/music/theme_sakura.ogg" fadein 1.0
    scene bg cafe
    s "Bem vindo ao Café Aurora."

    play sound "audio/sound/sino.ogg"
    "Um sininho toca quando alguém entra."

    voice "audio/voice/sakura/sakura_001.ogg"
    s "Hoje temos um especial de matcha."`}
      />

      <h2>4. A pasta <code>images/</code> — convenção de nomes</h2>
      <p>
        O Ren'Py descobre imagens automaticamente: se você nomear um arquivo
        como <code>sakura_feliz.png</code>, ele já cria a imagem chamada{" "}
        <code>sakura feliz</code> (underscore vira espaço). Você pode usar
        diretamente <code>show sakura feliz</code> no script sem ter
        declarado nada. Mas eu recomendo declarar mesmo assim — fica mais
        explícito.
      </p>

      <CommandTable
        title="Convenção de nomes (recomendada pela comunidade)"
        variations={[
          { cmd: "bg_<lugar>_<tempo>.png", desc: "Backgrounds: bg_cafe_dia.png, bg_escola_chuva.png.", output: "Vira: image bg cafe dia, image bg escola chuva." },
          { cmd: "<personagem>_<expressao>.png", desc: "Sprites: sakura_feliz.png, akira_serio.png.", output: "Vira: image sakura feliz, image akira serio." },
          { cmd: "<personagem>_<roupa>_<expressao>.png", desc: "Quando há trocas de roupa: sakura_uniforme_feliz.png.", output: "Combine com layered images para gerar combinações automaticamente." },
          { cmd: "cg_<cena>.png", desc: "CGs (cenas especiais com a heroína inteira na tela).", output: "cg_primeiro_beijo.png, cg_amanhecer_praia.png." },
          { cmd: "fx_<efeito>.webm", desc: "Efeitos animados (chuva, fogos).", output: "Ren'Py 8 toca .webm como Movie." },
          { cmd: "logo_studio.png", desc: "Logos da splashscreen.", output: "Mostre antes do main menu com 'splashscreen'." },
        ]}
      />

      <h2>5. A pasta <code>gui/</code> — assets do menu</h2>
      <p>
        Aqui ficam os <strong>PNGs</strong> que compõem a interface: o
        textbox onde aparecem as falas, o namebox onde aparece o nome do
        personagem, os botões do menu principal, o frame do menu de save. Se
        você quer mudar a "cara" do jogo sem editar código, basta substituir
        esses PNGs mantendo o mesmo nome.
      </p>

      <OutputBlock label="conteúdo padrão de game/gui/" type="info">
{`gui/
├── textbox.png            (1280x278)  caixa onde aparecem as falas
├── namebox.png            (240x60)    caixa onde aparece o nome
├── main_menu.png          (1280x720)  fundo do menu principal
├── game_menu.png          (1280x720)  fundo do menu pause/save/load
├── overlay/
│   ├── main_menu.png
│   └── game_menu.png
├── button/
│   ├── choice_idle_background.png
│   ├── choice_hover_background.png
│   ├── slot_idle_background.png
│   └── slot_hover_background.png
├── slider/
│   ├── horizontal_idle_bar.png
│   └── horizontal_hover_thumb.png
├── window_icon.png        (256x256)   ícone que aparece na barra de título
└── phone.png              (1280x720)  variante mobile (opcional)`}
      </OutputBlock>

      <h2>6. A pasta <code>tl/</code> — traduções</h2>
      <p>
        Tradução (i18n) gera uma pasta por idioma alvo. O comando{" "}
        <code>renpy.sh . translate english</code> escaneia todo o{" "}
        <code>script.rpy</code> e cria <code>tl/english/script.rpy</code>{" "}
        com cada fala em formato traduzível. Você não toca nesta pasta à
        mão — é totalmente gerada.
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "gerar a base de tradução para inglês",
            cmd: "../../renpy-sdk/renpy.sh . translate english",
            out: `Generating translation files for language 'english'.
Translated 47 dialogue blocks.
Output written to game/tl/english/`,
            outType: "success",
          },
          {
            cmd: "tree game/tl",
            out: `game/tl
├── None              ← strings comuns (UI)
│   └── common.rpy
└── english
    ├── script.rpy    ← suas falas para traduzir
    └── common.rpym   ← strings genéricas (Yes/No, Save, Load)`,
            outType: "info",
          },
        ]}
      />

      <h2>7. As pastas que NÃO devem ir para o git</h2>

      <CommandTable
        title="O que ignorar no .gitignore"
        variations={[
          {
            cmd: "*.rpyc",
            desc: "Bytecode compilado dos .rpy. Regerado a cada execução.",
            output: "Versionar causa conflito de merge horrível.",
          },
          {
            cmd: "*.rpa",
            desc: "Arquivos empacotados (gerados pelo build).",
            output: "São o resultado do build, não a fonte.",
          },
          {
            cmd: "cache/",
            desc: "Cache de fontes pré-renderizadas e blits.",
            output: "Pode pesar 200+ MB sem motivo.",
          },
          {
            cmd: "saves/",
            desc: "Saves do desenvolvedor.",
            output: "Não tem por que outro dev ter os mesmos saves.",
          },
          {
            cmd: "log.txt / traceback.txt",
            desc: "Log e stack trace da última execução.",
            output: "Mudam toda vez que você roda o jogo." ,
          },
          {
            cmd: "*.bak / *.~",
            desc: "Backups que o launcher faz automaticamente.",
            output: "Podem chegar a centenas de cópias.",
          },
          {
            cmd: "tmp/",
            desc: "Temporários do build.",
            output: "Sem valor depois de encerrar o launcher.",
          },
        ]}
      />

      <CodeBlock
        language="bash"
        title=".gitignore (template recomendado)"
        code={`# Compilados Ren'Py
*.rpyc
*.rpymc
*.rpa

# Estado de execução
cache/
saves/
log.txt
errors.txt
traceback.txt

# Backups e temporários
*.bak
*~
tmp/

# Builds gerados
dists/
*-dists/

# Editores
.vscode/
.idea/
*.swp
.DS_Store
Thumbs.db

# Persistent local
persistent`}
      />

      <h2>8. Onde os saves do jogador realmente moram</h2>
      <p>
        Atenção: a pasta <code>saves/</code> dentro do projeto é só usada
        durante o desenvolvimento. Em produção, o Ren'Py grava saves do
        jogador em um diretório do SO baseado em{" "}
        <code>config.save_directory</code> (definido no{" "}
        <code>options.rpy</code>):
      </p>

      <CommandTable
        title="Local físico dos saves por sistema operacional"
        variations={[
          { cmd: "Linux", desc: "$XDG_DATA_HOME/RenPy/<save_directory>/", output: "~/.local/share/RenPy/sakura-cafe-1/" },
          { cmd: "Windows", desc: "%APPDATA%\\RenPy\\<save_directory>\\", output: "C:\\Users\\dev\\AppData\\Roaming\\RenPy\\sakura-cafe-1\\" },
          { cmd: "macOS", desc: "~/Library/RenPy/<save_directory>/", output: "/Users/dev/Library/RenPy/sakura-cafe-1/" },
          { cmd: "Android", desc: "Internal storage isolado por package.", output: "/data/data/com.studio.sakuracafe/files/saves/" },
        ]}
      />

      <h2>9. Onde os builds saem</h2>
      <p>
        Quando você clica em <em>Build Distributions</em> no Launcher, ele
        gera os arquivos finais em uma pasta IRMÃ ao seu projeto chamada{" "}
        <code>&lt;projeto&gt;-dists/</code>:
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos"
        lines={[
          {
            cmd: "ls",
            out: "sakura-cafe/  sakura-cafe-dists/",
            outType: "info",
          },
          {
            cmd: "ls sakura-cafe-dists/",
            out: `Sakura-Cafe-1.0.0-pc.zip       (Windows + Linux x86_64)
Sakura-Cafe-1.0.0-mac.zip      (macOS universal)
Sakura-Cafe-1.0.0-android.apk
Sakura-Cafe-1.0.0-web.zip`,
            outType: "success",
          },
          {
            cmd: "du -sh sakura-cafe-dists/*",
            out: `184M    Sakura-Cafe-1.0.0-pc.zip
142M    Sakura-Cafe-1.0.0-mac.zip
92M     Sakura-Cafe-1.0.0-android.apk
68M     Sakura-Cafe-1.0.0-web.zip`,
            outType: "info",
          },
        ]}
      />

      <PracticeBox
        title="Reorganizar um projeto bagunçado"
        goal="Pegar o projeto 'meu-primeiro-vn' criado anteriormente e dividir o script em arquivos menores."
        steps={[
          "Dentro de game/, crie um arquivo characters.rpy.",
          "Mova as linhas 'define s = Character(...)' do script.rpy para characters.rpy.",
          "Crie um arquivo images.rpy e mova as linhas 'image bg ... = ...' para lá.",
          "Salve tudo, volte ao Launcher e clique em Force Recompile.",
          "Rode o jogo — deve continuar funcionando idêntico, mesmo com o script.rpy menor.",
          "No terminal, rode '../../renpy-sdk/renpy.sh . lint' e confirme 'No problems found'.",
        ]}
        verify="O jogo abre normalmente, o lint passa sem warnings, e seu script.rpy ficou com só os labels e diálogos."
      />

      <AlertBox type="info" title="Ren'Py carrega TODOS os .rpy de game/ automaticamente">
        Não existe "import" ou "include". Qualquer arquivo <code>.rpy</code>{" "}
        dentro de <code>game/</code> é compilado e suas declarações ficam
        globais. Por isso você pode dividir <code>script.rpy</code> em vários
        arquivos (capitulo01.rpy, capitulo02.rpy) sem precisar declarar
        nada — basta usar <code>jump capitulo02</code> de qualquer lugar.
      </AlertBox>

      <AlertBox type="warning" title="Cuidado com nomes de arquivo conflitantes">
        Se você tem <code>script.rpy</code> e <code>script.rpyc</code> com
        timestamps incompatíveis (porque copiou de outro lugar), o Ren'Py
        pode usar o <code>.rpyc</code> antigo. Quando algo "está estranho",
        clique em <em>Force Recompile</em> no Launcher (ou apague todos os{" "}
        <code>.rpyc</code> manualmente).
      </AlertBox>
    </PageContainer>
  );
}
