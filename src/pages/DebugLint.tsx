import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function DebugLint() {
  return (
    <PageContainer
      title="Debug & Lint — caçando bugs antes do release"
      subtitle="renpy.exe . lint para validar o projeto inteiro, compilação manual de .rpyc, console interativo (Shift+O), modo developer e as mensagens de erro mais comuns explicadas."
      difficulty="intermediario"
      timeToRead="13 min"
      prompt="build/debug-lint"
    >
      <AlertBox type="info" title="A regra de ouro do release">
        <strong>Nunca</strong> publique uma build sem rodar{" "}
        <code>renpy.exe . lint</code> antes. Em 90% dos casos, o lint pega
        pelo menos um erro silencioso (imagem não encontrada, label
        duplicado, fala de personagem não definido) que passaria batido nos
        testes manuais e quebraria o jogo na cena que você nunca jogou.
      </AlertBox>

      <h2>1. <code>lint</code> — o linter oficial do Ren'Py</h2>
      <p>
        O <code>lint</code> percorre TODO o projeto: cada label, cada show,
        cada play, cada referência de imagem ou personagem. Reporta erros
        graves, warnings e estatísticas úteis (quantas palavras de diálogo,
        quantos labels, quantos sprites).
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            cmd: "renpy.exe . lint",
            out: `Ren'Py 8.2.0 lint report, generated 2026-04-25 16:22

game/script.rpy:42 The image 'sakura sleepy' was used in a 'show' statement,
   but is not defined. (Did you mean 'sakura sleeping'?)

game/cap2.rpy:108 The label 'cap2_festival_noite' is defined in cap2.rpy:108
   and again in cap2.rpy:312.

game/cap3.rpy:201 Character 'mei' is used but never defined.
   Suggestion: define m = Character("Mei", color="#ff66aa")

game/options.rpy:18 The image 'gui/window_icon.png' specified in
   config.window_icon does not exist.

game/script.rpy:589 The audio file 'audio/sad_piano.ogg' is played but
   does not exist on disk.

============== Statistics ==============
The game contains 47,212 dialogue blocks, containing 318,442 words and
1,742,901 characters, for an average of 6.7 words and 36.9 characters per
block. The game contains 412 menus, 38 images, and 47 screens.

5 errors were detected. Details have been written above.`,
            outType: "error",
          },
        ]}
      />

      <CommandTable
        title="Tipos de problemas que o lint encontra"
        variations={[
          {
            cmd: "Image used but not defined",
            desc: "Você fez 'show sakura sleepy' mas nunca declarou a imagem.",
            output: "Erro fatal — a cena vai quebrar quando o jogador chegar lá.",
          },
          {
            cmd: "Label defined twice",
            desc: "Dois 'label cap2:' em arquivos diferentes.",
            output: "Erro fatal — Ren'Py escolhe só um, jumps quebram.",
          },
          {
            cmd: "Character used but not defined",
            desc: "Falas com 'm \"Olá\"' mas sem 'define m = Character(...)'.",
            output: "Erro fatal — exception ao chegar na linha.",
          },
          {
            cmd: "Audio file not found",
            desc: "play music \"audio/x.ogg\" e o arquivo não existe.",
            output: "Warning — o jogo continua, mas em silêncio nessa cena.",
          },
          {
            cmd: "Image references missing file",
            desc: "image x = \"images/x.png\" e o PNG não existe.",
            output: "Erro — exception no primeiro show x.",
          },
          {
            cmd: "say after no menu/jump",
            desc: "Diálogo após menu sem jump/return — caminho mortal.",
            output: "Warning — pode causar fluxo inesperado.",
          },
          {
            cmd: "Suspicious word count",
            desc: "Estatística — bloco com >120 palavras (texto pesado).",
            output: "Apenas info, sem ação obrigatória.",
          },
        ]}
      />

      <h3>Lint só de um arquivo específico</h3>
      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            cmd: "renpy.exe . lint game/cap2.rpy",
            out: `Lint scope: game/cap2.rpy only.
2 errors found in this file. (Use full lint to scan all files.)`,
            outType: "warning",
          },
        ]}
      />

      <h2>2. Compilando manualmente — <code>compile</code></h2>
      <p>
        Por padrão o Ren'Py compila <code>.rpy</code> para <code>.rpyc</code>{" "}
        sob demanda. Para forçar compilação completa (útil em CI/CD ou para
        verificar erros sintáticos sem rodar o jogo):
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            cmd: "renpy.exe . compile",
            out: `Compiling game/script.rpy ... done (.rpyc created)
Compiling game/cap1.rpy ... done
Compiling game/cap2.rpy ... done
Compiling game/cap3.rpy ... ERROR

File "game/cap3.rpy", line 88: invalid syntax
    show sakura happi at center
                  ^^^^^
SyntaxError: 'happi' is not a defined attribute of image 'sakura'.

Compilation aborted with 1 error.`,
            outType: "error",
          },
          {
            comment: "Forçar recompilação do zero (apaga .rpyc primeiro)",
            cmd: "renpy.exe . compile --force",
            out: "Removed 47 .rpyc files. Recompiling all .rpy files...",
            outType: "info",
          },
        ]}
      />

      <h2>3. Console interativo — <code>Shift+O</code></h2>
      <p>
        Com <code>config.developer = True</code>, durante o jogo aperte{" "}
        <strong>Shift+O</strong> para abrir um console Python no mesmo
        contexto da cena. Isso muda tudo:
      </p>

      <CodeBlock
        language="python"
        title="exemplos de comandos no console (Shift+O)"
        code={`# Inspecionar variável de afeição
>>> afeicao_sakura
0

# Setar para 50 sem precisar jogar até a confissão
>>> afeicao_sakura = 50
>>> afeicao_sakura
50

# Forçar jump para um label específico (testar o final direto)
>>> renpy.jump("final_sakura_bom")

# Listar todas as imagens definidas
>>> renpy.list_images()
['bg cafe', 'bg cozinha', 'bg festival', 'sakura happy', 'sakura sad', ...]

# Disparar manualmente uma transição
>>> renpy.with_statement(dissolve)

# Ver state completo do jogo (debug profundo)
>>> store.__dict__.keys()
dict_keys(['afeicao_sakura', 'afeicao_akira', 'flag_visitou_cafe', ...])

# Salvar/carregar saves direto
>>> renpy.save("debug-cap3-festival")
>>> renpy.load("quicksave-1")`}
      />

      <CommandTable
        title="Atalhos de developer durante o jogo"
        variations={[
          {
            cmd: "Shift+O",
            desc: "Console Python interativo no contexto atual.",
          },
          {
            cmd: "Shift+R",
            desc: "Reload — recompila e recarrega scripts SEM perder o save.",
          },
          {
            cmd: "Shift+E",
            desc: "Edit script — abre o editor configurado no .rpy da linha atual.",
          },
          {
            cmd: "Shift+I",
            desc: "Image location picker — clique numa imagem e veja o nome dela.",
          },
          {
            cmd: "Shift+D",
            desc: "Developer menu — variable inspector + script jump + image dump.",
          },
          {
            cmd: "Shift+G",
            desc: "Variant menu — força modo touchscreen / mouse.",
          },
          {
            cmd: "F5 / F9",
            desc: "Quicksave / Quickload (úteis em testes).",
          },
          {
            cmd: "Esc",
            desc: "Game menu (testar GUI custom).",
          },
        ]}
      />

      <h2>4. Modo developer — flag essencial</h2>
      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`## Habilita TUDO de debug:
##   - console (Shift+O)
##   - script jump menu (Shift+D)
##   - reload (Shift+R)
##   - image location picker (Shift+I)
##   - mensagens detalhadas no log.txt
##   - traceback completo nos crashes
##
## REGRA DE OURO: deixe True durante desenvolvimento e troque para False
## (ou "auto") antes do build de release.
define config.developer = "auto"

## "auto" detecta: True quando rodando do SDK, False em distribuições.
## É o melhor de dois mundos — você nunca esquece de desativar.`}
      />

      <AlertBox type="danger" title="developer = True em release leak segredos">
        Se você publicar uma build com <code>config.developer = True</code>,
        os jogadores podem abrir Shift+O e dar <code>renpy.jump("final_x")</code>
        — quebrando completamente a experiência narrativa. Pior: dá para
        inspecionar variáveis sensíveis (chaves de DLC, flags de easter eggs).
        Use <code>"auto"</code> ou <code>False</code> em release.
      </AlertBox>

      <h2>5. Lendo o <code>log.txt</code> e <code>traceback.txt</code></h2>
      <p>
        Quando o jogo crasha (no jogador ou no seu PC), o Ren'Py gera dois
        arquivos no diretório do jogo:
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            cmd: "ls -la log.txt traceback.txt",
            out: `-rw-r--r-- 1 dev dev  84212 Apr 25 16:33 log.txt
-rw-r--r-- 1 dev dev   2148 Apr 25 16:33 traceback.txt`,
            outType: "info",
          },
          {
            cmd: "tail -30 traceback.txt",
            out: `I'm sorry, but an uncaught exception occurred.

While running game code:
  File "game/cap2.rpy", line 142, in script
    s "Que dia incrível, [nome_jogador]!"
  File "renpy/exports.py", line 1721, in say
    who(what, *args, **kwargs)
  File "renpy/character.py", line 988, in __call__
    interact = display_say(...)
NameError: Name 'nome_jogador' is not defined.

-- Full Traceback ------------------------------------------------------------
[stack trace de 40 linhas...]

Ren'Py Version: Ren'Py 8.2.0.24061104
Game Version: 1.0.0
Linux-6.5.0-x86_64`,
            outType: "error",
          },
        ]}
      />

      <p>
        O culpado: a variável <code>nome_jogador</code> nunca recebeu valor.
        Conserte com um <code>default nome_jogador = "Você"</code> em{" "}
        <code>script.rpy</code>.
      </p>

      <h2>6. Erros mais comuns (e o conserto)</h2>

      <CommandTable
        title="Cardápio de exceptions Ren'Py"
        variations={[
          {
            cmd: "Image not found",
            desc: "show x — x não foi declarado com 'image x = ...'.",
            output: "Conserto: declare a imagem ou use o caminho direto: scene 'images/x.png'.",
          },
          {
            cmd: "label undefined",
            desc: "jump cap2 — cap2 não existe (ou foi escrito em outro arquivo não carregado).",
            output: "Conserto: confira ortografia + se o arquivo está em game/.",
          },
          {
            cmd: "NameError: 'X' is not defined",
            desc: "Variável usada em $ ou condicional sem 'default X = valor'.",
            output: "Conserto: SEMPRE use default no início de script.rpy.",
          },
          {
            cmd: "AttributeError: 'NoneType' has no 'X'",
            desc: "Acessou .nome em algo que é None.",
            output: "Conserto: verifique se o objeto foi criado antes do uso.",
          },
          {
            cmd: "TypeError: takes N positional args",
            desc: "Chamou função Python com argumentos errados.",
            output: "Conserto: leia a docstring no traceback.",
          },
          {
            cmd: "say after non-text statement",
            desc: "Diálogo no meio de um bloco init python.",
            output: "Conserto: dialog vai em label, não em init python.",
          },
          {
            cmd: "Indentation error",
            desc: "Misturou tabs e espaços, ou indentou errado.",
            output: "Conserto: 4 espaços, NUNCA tabs. Configure seu editor.",
          },
          {
            cmd: "Cannot start audio playback",
            desc: "play music com OGG corrompido ou MP3 com codec não suportado.",
            output: "Conserto: re-encode com 'oggenc -q 4 arquivo.wav'.",
          },
        ]}
      />

      <h2>7. Watchdog — auto-reload em desenvolvimento</h2>
      <p>
        Em vez de fechar e abrir o jogo a cada mudança, ative o auto-reload:
      </p>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`## Ativa o reload automático quando os .rpy mudarem em disco.
## Combinado com Shift+R, fica imperceptível: você salva no editor
## e o jogo já está com a mudança quando você volta para a janela.
init python:
    if config.developer:
        config.autoreload = True
        config.watch_files = True`}
      />

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Você edita game/cap1.rpy e salva — o terminal mostra:",
            cmd: "(jogo rodando em background)",
            noPrompt: true,
            out: `[autoreload] Detected change in game/cap1.rpy. Reloading...
[autoreload] Reload complete in 142 ms. Returning to current statement.`,
            outType: "info",
          },
        ]}
      />

      <h2>8. Output completo do <code>lint</code> em projeto saudável</h2>
      <OutputBlock label="renpy.exe . lint — projeto sem erros" type="success">
{`Ren'Py 8.2.0 lint report, generated 2026-04-25 17:02

============== Statistics ==============
The game contains 47,212 dialogue blocks, containing 318,442 words and
1,742,901 characters, for an average of 6.7 words and 36.9 characters per
block. The game contains 412 menus, 38 images, and 47 screens.

Total characters: 1,742,901 (about 5h45min reading time at 280 WPM)
Total labels: 124
Total say statements with character voice: 4,128
Total transitions: 218
Custom screens: 8 (status, inventory, gallery, splash, ...)

Defined characters: 6 (s, a, m, n, narrator, voice)
Defined images: 38 (with 142 attribute combinations via layered images)

============== Files Scanned ==============
game/script.rpy           412 lines    OK
game/cap1.rpy           1,820 lines    OK
game/cap2.rpy           2,108 lines    OK
game/cap3.rpy           1,594 lines    OK
game/options.rpy           94 lines    OK
game/screens.rpy          612 lines    OK
game/gui.rpy              388 lines    OK

No errors or warnings found. Ready to build distributions.`}
      </OutputBlock>

      <PracticeBox
        title="Workflow completo de release: do lint ao build"
        goal="Garantir que a Sakura Café está 100% pronta para gerar distribuições, sem erros silenciosos."
        steps={[
          "Rode renpy.exe . compile --force para limpar todos os .rpyc antigos.",
          "Rode renpy.exe . lint — corrija TODOS os erros e warnings reportados.",
          "Defina config.developer = \"auto\" em options.rpy (não deixe True hardcoded).",
          "Confira config.name, config.version, build.name e build.classify em options.rpy.",
          "Jogue do início ao fim em pelo menos UMA rota completa, anotando bugs.",
          "Para cada bug encontrado, abra o console (Shift+O) e investigue antes de fechar.",
          "Rode lint mais uma vez após os consertos — deve sair limpo.",
          "Só agora gere as distribuições no Launcher.",
        ]}
        verify="O lint final reporta 'No errors or warnings found' E você jogou de ponta a ponta sem crash."
      />

      <PracticeBox
        title="Provocar e analisar um crash intencional"
        goal="Aprender a ler o traceback.txt na prática, criando um erro de propósito."
        steps={[
          "Em game/script.rpy, adicione uma linha: $ resultado = nome_que_nao_existe + 1",
          "Rode o jogo — vai crashar.",
          "Abra traceback.txt na raiz do projeto.",
          "Identifique: qual a exception (NameError? TypeError?), em qual arquivo e linha.",
          "Compare com a lista de 'erros mais comuns' acima e veja se você consegue identificar o conserto antes de ler.",
          "Conserte (delete a linha) e confirme que o jogo volta a rodar.",
        ]}
        verify="Você consegue olhar para um traceback.txt e em menos de 30 segundos dizer qual é o problema e onde ele está."
      />

      <AlertBox type="success" title="Lint + console = 90% dos bugs resolvidos">
        Devs experientes de Ren'Py raramente abrem debugger externo. O combo
        <code>lint</code> antes do build + console <code>Shift+O</code>{" "}
        durante teste pega quase tudo. Adicione a esses dois o hábito de ler
        <code>log.txt</code> ao final de cada sessão de teste, e você está
        pronto para releases profissionais.
      </AlertBox>
    </PageContainer>
  );
}
