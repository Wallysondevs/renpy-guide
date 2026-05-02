import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function ScreenOptimization() {
  return (
    <PageContainer
      title="Screen Optimization — performance que segura 60 FPS"
      subtitle="Screens são re-avaliados sempre que algo muda. Se você fizer Python pesado dentro de um for, varrer 200 itens do inventário ou recriar transforms a cada frame, o FPS afunda. Veja as 9 técnicas oficiais para manter o Sakura Café fluido até em Android antigo."
      difficulty="avancado"
      timeToRead="17 min"
      prompt="screens/optimization"
    >
      <AlertBox type="info" title="Por que screens podem ficar lentos?">
        O Ren'Py usa um modelo <strong>imediato</strong>: o screen é uma
        função que retorna a árvore de displayables a cada interação. Se
        nada mudou, a engine reusa a árvore (cache). Se UMA variável usada
        no screen muda, ele <strong>re-roda inteiro</strong>. Em screens
        complexos (HUD com inventário, status, mapa), isso pode custar
        milissegundos por frame.
      </AlertBox>

      <h2>1. Diagnóstico: descobrindo screens lentos</h2>
      <p>
        Antes de otimizar, MEÇA. Ren'Py tem um profiler embutido. Aperte{" "}
        <kbd>Shift+G</kbd> em modo developer para abrir o gráfico de FPS, e
        ative o profile por screen via <code>config.profile_screens</code>.
      </p>

      <CodeBlock
        title="game/options.rpy"
        language="python"
        code={`# Ative SOMENTE em desenvolvimento
init python:
    if config.developer:
        config.profile_screens = True
        config.developer = True

# Mostra contador de FPS no canto
define config.profile = True`}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        user="dev"
        host="vn-studio"
        lines={[
          {
            comment: "Saída do profiler ao abrir o HUD do café",
            cmd: "renpy.exe . --profile",
            out: `screen hud_cafe analysis:
    update 4.21 ms (38.2%)   ← DEMORA, otimizar
    render 1.08 ms
    place  0.42 ms

screen inventario analysis:
    update 0.11 ms
    render 0.09 ms

Total frame time: 11.4 ms (87 fps)`,
            outType: "info",
          },
        ]}
      />

      <h2>2. Regra #1 — não rode Python pesado dentro do screen</h2>

      <CodeBlock
        title="game/screens.rpy — RUIM"
        language="python"
        code={`screen hud_cafe():
    # ❌ Esse list comprehension RODA TODO FRAME enquanto o HUD existe
    $ ingredientes_disponiveis = [i for i in todos_ingredientes if i.estoque > 0]
    $ total_calorias = sum(i.cal for i in pedidos_atuais)

    vbox:
        for ing in ingredientes_disponiveis:
            text ing.nome
        text "Calorias: [total_calorias]"`}
      />

      <CodeBlock
        title="game/screens.rpy — BOM"
        language="python"
        code={`# Pré-computa em variável persistida — só recalcula quando estoque muda
default ingredientes_disponiveis = []
default total_calorias = 0

init python:
    def atualizar_estoque():
        store.ingredientes_disponiveis = [i for i in todos_ingredientes if i.estoque > 0]
        store.total_calorias = sum(i.cal for i in pedidos_atuais)

screen hud_cafe():
    vbox:
        for ing in ingredientes_disponiveis:
            text ing.nome
        text "Calorias: [total_calorias]"`}
      />

      <h2>3. Regra #2 — use <code>vbox</code>/<code>hbox</code> em vez de <code>vpgrid</code> quando possível</h2>

      <CommandTable
        title="Custo relativo dos containers de layout"
        variations={[
          {
            cmd: "vbox / hbox",
            desc: "O mais barato. Usa quando os filhos são poucos (até ~50).",
            output: "Recomendado para HUD com 5-10 botões.",
          },
          {
            cmd: "fixed",
            desc: "Cada filho com xpos/ypos absolutos. Barato.",
            output: "Recomendado para overlay com 2-5 elementos posicionados.",
          },
          {
            cmd: "grid C R",
            desc: "Tamanho fixo. Renderiza tudo. Cuidado com grids grandes.",
            output: "OK para tabuleiro 8x8, RUIM para inventário 10x20.",
          },
          {
            cmd: "vpgrid",
            desc: "Virtualizado: só renderiza o que está visível com scroll.",
            output: "Use SEMPRE para listas com 30+ itens.",
          },
          {
            cmd: "viewport",
            desc: "Container com scroll. Combine com vbox para listas longas.",
            output: "Lista de saves, dicionário de personagens.",
          },
        ]}
      />

      <CodeBlock
        title="game/screens.rpy — inventário grande"
        language="python"
        code={`# ❌ RUIM: grid renderiza os 200 itens mesmo fora da tela
screen inventario_ruim():
    grid 10 20:
        for item in inventario:
            imagebutton idle item.icon

# ✅ BOM: vpgrid só renderiza o que cabe na viewport
screen inventario_otimizado():
    vpgrid:
        cols 10
        spacing 4
        draggable True
        mousewheel True
        scrollbars "vertical"
        xsize 800 ysize 600

        for item in inventario:
            imagebutton idle item.icon
`}
      />

      <h2>4. Regra #3 — <code>use</code> em vez de incluir tudo num só screen</h2>
      <p>
        Quebrar um screen monstro em sub-screens via <code>use</code>{" "}
        permite que o Ren'Py invalide só a parte que mudou. Se só o
        contador de café mudou, a engine não precisa re-renderizar a barra
        de XP nem o mapa do café.
      </p>

      <CodeBlock
        title="game/screens.rpy"
        language="python"
        code={`# ❌ Tudo num screen só — qualquer var dispara redraw geral
screen hud_pesado():
    text "Café: [cafes_pedidos]"
    text "Dinheiro: [dinheiro]"
    text "Afeição Sakura: [afeicao_sakura]"
    text "Hora: [hora_atual]"

# ✅ Quebrado em sub-screens — invalidação fina
screen hud_leve():
    use stats_cafes()
    use stats_dinheiro()
    use stats_afeicao()
    use stats_hora()

screen stats_cafes():
    text "Café: [cafes_pedidos]"

screen stats_dinheiro():
    text "Dinheiro: [dinheiro]"

screen stats_afeicao():
    text "Afeição Sakura: [afeicao_sakura]"

screen stats_hora():
    text "Hora: [hora_atual]"
`}
      />

      <AlertBox type="warning" title="use vs include — ambos existem">
        <code>use outro_screen</code> compõe o outro screen no atual,
        permitindo passar parâmetros. <code>include</code> não existe como
        keyword: para <em>injetar</em> o conteúdo sem reuso, prefira{" "}
        <code>use</code> mesmo. A diferença prática: <code>use</code> cria
        um sub-escopo de cache, isolando re-renders.
      </AlertBox>

      <h2>5. Regra #4 — predição com <code>prefer_screen_to_show</code></h2>

      <p>
        Se você sabe que o jogador vai abrir o inventário em breve, peça
        para o Ren'Py pre-carregar:
      </p>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`label antes_inventario:
    # Pré-carrega imagens e textos do screen inventario antes da abertura
    $ renpy.start_predict_screen("inventario")

    s "Vou ver o que tenho na bolsa..."

    # Quando finalmente mostra, já está em RAM
    call screen inventario

    # Limpa a predição (libera RAM)
    $ renpy.stop_predict_screen("inventario")`}
      />

      <h2>6. Regra #5 — evite criar novos transforms a cada frame</h2>

      <CodeBlock
        title="game/screens.rpy"
        language="python"
        code={`# ❌ Cria um Transform NOVO a cada update do screen — anti-cache
screen sakura_pulsando():
    add "sakura feliz" at Transform(zoom=1.0 + (renpy.get_game_runtime() % 1.0))

# ✅ Define o transform FORA, reutiliza
transform pulsa:
    zoom 1.0
    ease 0.4 zoom 1.06
    ease 0.4 zoom 1.0
    repeat

screen sakura_pulsando_bom():
    add "sakura feliz" at pulsa`}
      />

      <h2>7. Regra #6 — <code>showif</code> em vez de <code>if</code></h2>
      <p>
        <code>if x:</code> recalcula a árvore se a condição muda — caro.{" "}
        <code>showif x:</code> mantém o displayable sempre na árvore mas
        muda só a visibilidade — barato e permite transições.
      </p>

      <CodeBlock
        title="game/screens.rpy"
        language="python"
        code={`screen hud_dia_noite():
    # Lua aparece à noite, sol durante o dia — alterna ao longo do jogo
    showif eh_noite:
        add "images/ui/lua.png" at fade_in
    showif not eh_noite:
        add "images/ui/sol.png" at fade_in`}
      />

      <h2>8. Regra #7 — image cache do screen</h2>

      <CodeBlock
        title="game/options.rpy"
        language="python"
        code={`# Cache de imagens (em MB) — aumente p/ jogos com muitos sprites
define config.image_cache_size = 256

# Predição de imagens — quantos statements a frente o Ren'Py adivinha
define config.predict_statements = 4

# Predição de screens declarados
define config.predict_screen_statements = 5`}
      />

      <h2>9. Regra #8 — <code>renpy.cache_pin</code> para assets críticos</h2>

      <CodeBlock
        title="game/init.rpy"
        language="python"
        code={`init python:
    # Imagens que NUNCA devem sair do cache (UI do café)
    renpy.cache_pin("images/ui/textbox_sakura.png")
    renpy.cache_pin("images/ui/btn_choice_idle.png")
    renpy.cache_pin("images/ui/btn_choice_hover.png")

    # Para liberar mais tarde:
    # renpy.cache_unpin("images/ui/textbox_sakura.png")`}
      />

      <h2>10. Regra #9 — não use <code>action</code> com lambda</h2>

      <CodeBlock
        title="game/screens.rpy"
        language="python"
        code={`# ❌ Lambda cria função NOVA toda vez — quebra cache de Action
screen ruim():
    textbutton "+1" action (lambda: setattr(store, "x", store.x + 1))

# ✅ Function() com referência — Action reutilizável
init python:
    def incrementar_x():
        store.x += 1

screen bom():
    textbutton "+1" action Function(incrementar_x)

# ✅ ALTERNATIVA OFICIAL: SetVariable
screen melhor():
    textbutton "+1" action SetVariable("x", x + 1)`}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        user="dev"
        host="vn-studio"
        lines={[
          {
            comment: "antes da otimização",
            cmd: "renpy.exe . --profile",
            out: `Frame time: 22 ms  (45 fps)
Screens slow: hud_cafe (8.1ms), inventario (5.2ms)`,
            outType: "warning",
          },
          {
            comment: "depois das 9 regras aplicadas",
            cmd: "renpy.exe . --profile",
            out: `Frame time: 9 ms   (110 fps)
Screens slow: nenhum acima de 2ms.`,
            outType: "success",
          },
        ]}
      />

      <OutputBlock label="checklist de otimização" type="info">
{`[ ] Profilei com Shift+G e config.profile_screens = True
[ ] Sem list comprehension dentro de screen
[ ] vpgrid em listas com 30+ itens
[ ] Quebrei o HUD em sub-screens com 'use'
[ ] start_predict_screen para telas pesadas previsíveis
[ ] Transforms são definidos fora, reutilizados via 'at'
[ ] showif em vez de if quando faz sentido
[ ] cache_pin nos assets sempre presentes
[ ] image_cache_size ajustado pro tamanho do projeto
[ ] Sem lambda em action — usar Function/SetVariable`}
      </OutputBlock>

      <PracticeBox
        title="Reduza o frame time do HUD do café em 50%"
        goal="Pegar um screen monstro com 4 leituras pesadas e dividir em 4 sub-screens via use."
        steps={[
          "Crie um screen 'hud_cafe' com 4 textos: cafes pedidos, dinheiro, afeição, hora.",
          "Ative config.profile_screens = True em options.rpy.",
          "Rode o jogo, pressione Shift+G, anote o tempo do hud_cafe.",
          "Divida em 4 sub-screens: stats_cafes, stats_dinheiro, stats_afeicao, stats_hora.",
          "No hud_cafe principal use 'use stats_cafes()' etc.",
          "Rode de novo, anote o tempo: deve ter caído pela metade ou mais.",
        ]}
        verify="O tempo de update do hud_cafe principal cai abaixo de 2ms; cada sub-screen é re-avaliada só quando sua variável muda."
      >
        <CodeBlock
          title="game/screens.rpy (versão otimizada)"
          language="python"
          code={`screen hud_cafe():
    vbox xalign 1.0 yalign 0.0 spacing 4 padding (16, 12):
        use stats_cafes()
        use stats_dinheiro()
        use stats_afeicao()
        use stats_hora()

screen stats_cafes():
    text "Café: [cafes_pedidos]"

screen stats_dinheiro():
    text "$ [dinheiro]"

screen stats_afeicao():
    text "Sakura: [afeicao_sakura]/100"

screen stats_hora():
    text "[hora_atual]:00"
`}
        />
      </PracticeBox>

      <AlertBox type="danger" title="Não otimize prematuramente">
        Se o seu screen renderiza em &lt; 1ms, NÃO PERCA TEMPO refatorando.
        Performance só importa onde dói: HUD sempre visível, inventário com
        muitos itens, mapas, batalhas. Para a tela de save e o menu de
        crédito, código simples e legível ganha do ultra-otimizado.
      </AlertBox>
    </PageContainer>
  );
}
