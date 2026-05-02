import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function DeveloperTools() {
  return (
    <PageContainer
      title="Developer Tools — atalhos Shift+letra"
      subtitle="Console interativo, Variable Viewer, Style Inspector, Image Location Picker, Reload em tempo real, Director — tudo o que faz o desenvolvimento de uma VN ser dezenas de vezes mais rápido. Os atalhos só funcionam com config.developer = True."
      difficulty="iniciante"
      timeToRead="11 min"
      prompt="ferramentas/dev-tools"
    >
      <AlertBox type="info" title="Como ativar">
        Em <code>game/options.rpy</code> defina{" "}
        <code>define config.developer = True</code> (ou
        <code> "auto"</code>, que liga automaticamente quando rodando do
        Launcher). Depois disso, todos os <strong>Shift+letra</strong>{" "}
        abaixo passam a funcionar dentro do jogo. No build de produção
        SEMPRE deixe <code>False</code>.
      </AlertBox>

      <h2>1. Tabela completa dos atalhos Shift+letra</h2>

      <CommandTable
        title="Atalhos developer (config.developer = True)"
        variations={[
          {
            cmd: "Shift+O",
            desc: "Abre o Console interativo (Python REPL dentro do jogo).",
            output: "Avalia expressões, modifica state ao vivo, jump para qualquer label.",
          },
          {
            cmd: "Shift+V",
            desc: "Variable Viewer — lista todas as variáveis de store.",
            output: "Mostra valores atuais, filtra por nome.",
          },
          {
            cmd: "Shift+I",
            desc: "Style Inspector — clica em qualquer elemento e vê style aplicado.",
            output: "Útil para descobrir por que o botão está com padding errado.",
          },
          {
            cmd: "Shift+R",
            desc: "Reload — recarrega scripts .rpy SEM fechar o jogo.",
            output: "Mantém posição da cena; mudou texto? Apareceu no ato.",
          },
          {
            cmd: "Shift+D",
            desc: "Abre o menu Developer (Director, Theme Test, Image Location...).",
            output: "Hub central de todas as ferramentas.",
          },
          {
            cmd: "Shift+E",
            desc: "Abre o editor configurado no .rpy da linha atual.",
            output: "Pula direto para o arquivo+linha do diálogo em tela.",
          },
          {
            cmd: "Shift+G",
            desc: "Toggle FPS / Performance Graph overlay.",
            output: "Mostra fps, frame time, gc, GPU.",
          },
          {
            cmd: "Shift+P",
            desc: "Profiler — abre análise de uso CPU/screens/transforms.",
            output: "Lista screens lentos e Python pesado em frame.",
          },
          {
            cmd: "Shift+S",
            desc: "Screenshot — salva PNG da tela em screenshot0001.png.",
            output: "Funciona em produção também (sem developer).",
          },
          {
            cmd: "Shift+A",
            desc: "Accessibility menu — abre prefs de TTS, contraste, fonte.",
            output: "Mesmo em produção. Importante para certificação App Store.",
          },
          {
            cmd: "Shift+F",
            desc: "Toggle fullscreen.",
            output: "Funciona em qualquer build.",
          },
          {
            cmd: "Shift+M",
            desc: "Mute/unmute áudio.",
            output: "Atalho universal.",
          },
          {
            cmd: "Shift+Click",
            desc: "Image Location Picker — clica num ponto e mostra coords + cor.",
            output: "Útil para posicionar focus rings, hotspots de imagemap.",
          },
        ]}
      />

      <h2>2. Console (Shift+O) — o canivete suíço</h2>
      <p>
        O Console é um Python REPL completo rodando dentro do contexto do
        jogo. Você consegue inspecionar e MODIFICAR qualquer coisa em tempo
        real:
      </p>

      <OutputBlock label="Console — Shift+O — Sakura Café" type="info">
{`>>> persistent.cafes_servidos
27

>>> persistent.cafes_servidos = 999
>>> achievement.grant("barista_dedicado")
True

>>> # Pula direto para a rota da Yuki
>>> renpy.jump("rota_yuki_cap3")

>>> # Vê a Character Sakura
>>> s
<Character u'Sakura'>

>>> # Mostra todas as imagens carregadas
>>> renpy.list_images()
['bg cafe', 'bg cafe noite', 'sakura happy', 'sakura corada', ...]

>>> # Força recarregar uma imagem específica do disco
>>> renpy.scene()
>>> renpy.show("sakura corada", at_list=[center])
>>> renpy.say(s, "Tô testando aqui!")`}
      </OutputBlock>

      <p>
        Comandos especiais do Console (não são Python):
      </p>

      <CommandTable
        title="Magic commands do console"
        variations={[
          { cmd: "clear", desc: "Limpa a tela do console.", output: "(linhas anteriores somem)" },
          { cmd: "exit", desc: "Fecha o console (mesmo que ESC).", output: "—" },
          { cmd: "help", desc: "Lista comandos disponíveis.", output: "—" },
          { cmd: "load <slot>", desc: "Carrega um save slot.", output: "load 1-1" },
          { cmd: "save <slot>", desc: "Salva no slot.", output: "save quicktest" },
          { cmd: "jump <label>", desc: "Atalho para renpy.jump.", output: "jump cap2" },
          { cmd: "call <label>", desc: "Atalho para renpy.call.", output: "call cena_extra" },
          { cmd: "watch <expr>", desc: "Adiciona expressão ao Variable Viewer.", output: "watch persistent.afeicao_sakura" },
          { cmd: "unwatch <expr>", desc: "Remove watch.", output: "unwatch ..." },
          { cmd: "stack", desc: "Mostra call stack atual.", output: "—" },
        ]}
      />

      <h2>3. Variable Viewer (Shift+V)</h2>
      <p>
        Lista todas as variáveis de <code>store</code> com valor atual. Você
        pode filtrar e adicionar <em>watches</em> para acompanhar como o valor
        muda durante a cena:
      </p>

      <CodeBlock
        title="game/script.rpy — variáveis sob watch"
        language="python"
        code={`default afeicao_sakura = 0
default afeicao_yuki = 0
default cafes_servidos = 0
default rota_atual = "neutra"

label cap1:
    # Aperta Shift+V — vê:
    # afeicao_sakura: 0
    # afeicao_yuki:   0
    # cafes_servidos: 0
    # rota_atual:     'neutra'

    s "Posso te trazer um café?"
    menu:
        "Sim, por favor.":
            $ afeicao_sakura += 2
            $ cafes_servidos += 1
            # Shift+V agora mostra: afeicao_sakura: 2, cafes_servidos: 1
        "Não, obrigado.":
            $ afeicao_sakura -= 1`}
      />

      <h2>4. Style Inspector (Shift+I)</h2>
      <p>
        Clica em qualquer botão / texto / barra na tela e o inspector abre
        mostrando:
      </p>

      <OutputBlock label="Style Inspector — botão 'Continuar' do menu" type="info">
{`Element:    button (id="continue_button")
Style:      navigation_button is button
Properties:
  background      Frame("gui/btn_idle.png", 12, 12)
  hover_background Frame("gui/btn_hover.png", 12, 12)
  xpadding        20
  ypadding        8
  font            "fonts/sakura.ttf"
  text_color      #ffaacc
  text_hover_color #ffffff

Inheritance chain:
  button → navigation_button → continue_button

Defined at:
  game/screens.rpy:142`}
      </OutputBlock>

      <h2>5. Reload (Shift+R) — workflow ouro</h2>
      <p>
        Talvez o atalho mais transformador. Você está testando a cena 3 do
        cap 5. Editou o texto. Em vez de fechar o jogo e reabrir:
      </p>

      <Terminal
        path="dentro do jogo"
        user="dev"
        host="sakura-cafe"
        lines={[
          {
            comment: "Edita o .rpy no editor e salva (sem fechar o jogo)",
            cmd: "Shift+R",
            out: `[INFO] Reloading game...
[INFO] Recompiling 3 changed .rpy files...
[INFO] Reload complete (in 0.42s).
[INFO] Returned to current statement.`,
            outType: "success",
          },
        ]}
      />

      <p>
        A cena recarrega na linha exata onde você estava, com o novo texto.
        Funciona até com mudanças em <code>screens.rpy</code> e
        <code> options.rpy</code>.
      </p>

      <AlertBox type="warning" title="Reload tem limites">
        Mudanças em <code>init python:</code> top-level, novos
        <code> default</code> ou novos Characters podem não recarregar — em
        casos extremos, feche e reabra. Se ver <code>RestartException</code>{" "}
        no console, é hora do restart completo.
      </AlertBox>

      <h2>6. Image Location Picker (Shift+Click)</h2>
      <p>
        Coloque o jogo em qualquer cena e dê <kbd>Shift</kbd>+click num
        ponto. Aparece um popup:
      </p>

      <OutputBlock label="Image Location Picker" type="info">
{`Position: (640, 460)   |   Color: #ffd6cc
xalign: 0.500          |   yalign: 0.426

Use this in your script:
  show sakura happy:
      xpos 640
      ypos 460

Or as alignment:
  show sakura happy at Position(xalign=0.5, yalign=0.426)`}
      </OutputBlock>

      <p>
        Útil para posicionar hotspots em imagemap (cardápio interativo do
        café), focus rings em CG, e calibrar <code>focus</code> em screens.
      </p>

      <h2>7. Profiler (Shift+P)</h2>

      <OutputBlock label="Profiler — Shift+P" type="warning">
{`SCREEN PROFILE (last 60 frames)
  cardapio_cafe       avg 12.4ms  max 28.1ms  ⚠ slow
  navigation          avg  0.8ms  max  1.2ms
  quick_menu          avg  0.6ms  max  0.9ms
  hud_termometro      avg  3.1ms  max  4.5ms

PYTHON PROFILE
  recalcular_cardapio  called 60x  avg 8.2ms  ⚠ called every frame!

Tip: move expensive Python out of screen with @renpy.pure
or cache result in a default variable.`}
      </OutputBlock>

      <h2>8. Performance overlay (Shift+G)</h2>
      <p>
        HUD permanente no canto da tela mostrando FPS, frame time, GC pauses,
        VRAM. Vital para validar performance em Steam Deck e Android:
      </p>

      <OutputBlock label="Performance overlay" type="success">
{`FPS: 60.0 | Frame: 16.2ms | GPU: 8.1ms | GC: 0ms
Cache: img 124/256MB  audio 8/32MB
Sprites onscreen: 4   Layers active: 3`}
      </OutputBlock>

      <h2>9. Acessar via menu Developer (Shift+D)</h2>

      <OutputBlock label="Menu Developer (Shift+D)" type="info">
{`╔══════════════════════════════════════╗
║         DEVELOPER MENU               ║
╠══════════════════════════════════════╣
║  → Console                  (Shift+O)║
║  → Variable Viewer          (Shift+V)║
║  → Style Inspector          (Shift+I)║
║  → Theme Test                        ║
║  → Director                          ║
║  → Image Location Picker             ║
║  → Filename List                     ║
║  → Reload Game              (Shift+R)║
║  → Force Recompile                   ║
║  → Force Predict                     ║
╚══════════════════════════════════════╝`}
      </OutputBlock>

      <h2>10. Habilitar dev mode SOMENTE em build local</h2>

      <CodeBlock
        title="game/options.rpy"
        language="python"
        code={`# Modo "auto": developer ON quando rodando pelo SDK/Launcher,
# OFF quando empacotado para distribuição. Recomendado.
define config.developer = "auto"

# Forçar via env var (útil para QA testar build de produção):
init python:
    import os
    if os.environ.get("SAKURA_DEBUG_HUD") == "1":
        config.developer = True
        config.console = True   # libera Shift+O explicitamente`}
      />

      <h2>11. Testar atalhos no Sakura Café</h2>

      <CodeBlock
        title="game/script.rpy — cena para testar tudo"
        language="python"
        code={`default afeicao_sakura = 0

label teste_devtools:
    scene bg cafe with fade
    show sakura happy at center

    s "Aperte Shift+V — você deve ver afeicao_sakura: 0"
    pause

    $ afeicao_sakura += 5
    s "Agora deve mostrar: 5. (Verifique no Variable Viewer.)"
    pause

    s "Aperte Shift+O e digite: persistent.cafes_servidos = 100"
    pause

    s "Shift+I e clique em mim — vê meu style?"
    pause

    s "Shift+R recarrega tudo. Edite essa fala e dê Shift+R."
    pause

    return`}
      />

      <PracticeBox
        title="Crie um workflow rápido com os 3 atalhos essenciais"
        goal="Editar uma fala, recarregar, validar via Variable Viewer e console — sem fechar o jogo nenhuma vez."
        steps={[
          "Em options.rpy, defina config.developer = 'auto'.",
          "Rode o jogo, navegue até qualquer fala da Sakura.",
          "Mude o texto da fala no editor (NÃO feche o jogo) e salve o .rpy.",
          "No jogo aperte Shift+R — confirme que o texto novo aparece.",
          "Aperte Shift+V — confira pelo menos 3 variáveis listadas.",
          "Aperte Shift+O e digite: persistent.cafes_servidos = 50.",
          "Saia do console (ESC), aperte Shift+V, confirme o novo valor.",
        ]}
        verify="Você editou, recarregou e mutou state, tudo sem fechar o jogo nem 1 vez."
      />

      <AlertBox type="danger" title="Antes de publicar: DESLIGUE">
        Build final do Sakura Café <strong>não pode</strong> ter
        <code> config.developer = True</code>. Caso contrário, jogador aperta
        Shift+O, abre console e mata seu balanceamento. Use{" "}
        <code>"auto"</code> ou explicitamente <code>False</code>.
      </AlertBox>

      <AlertBox type="success" title="Próximo passo">
        Em <strong>Director Tool</strong> você verá como usar o atalho
        Shift+D para criar cenas inteiras visualmente, sem digitar uma
        linha de <code>.rpy</code> — perfeito para artistas e roteiristas
        do time.
      </AlertBox>
    </PageContainer>
  );
}
