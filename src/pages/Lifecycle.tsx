import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Lifecycle() {
  return (
    <PageContainer
      title="Lifecycle — vida de uma execução Ren'Py"
      subtitle="Da tela preta inicial até o jogador clicar 'Sair': presplash, init python, splashscreen, main_menu, start, save/load, callbacks. Onde colocar cada coisa para não dar erro."
      difficulty="avancado"
      timeToRead="18 min"
      prompt="lifecycle/visao-geral"
    >
      <AlertBox type="info" title="A doc oficial não tem este diagrama">
        Você acha pedaços espalhados em "Building Distributions",
        "Persistent Data" e "Configuration Variables", mas nunca um
        fluxograma completo do que roda quando. Errar a ORDEM significa
        bug do tipo "minha variável é None no menu", "meu áudio toca
        antes do logo aparecer" ou "save corrompido". Vamos mapear tudo.
      </AlertBox>

      <h2>1. Diagrama de execução completo</h2>

      <OutputBlock label="ordem de execução do Ren'Py — do clique no exe até o gameplay" type="info">
{`┌─────────────────────────────────────────────────────────────┐
│  EXE / .sh / .app  (binário do Ren'Py + seu game/)         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │  1.  PRESPLASH  (PNG/WebP)       │ ← presplash.png na raiz
        │      Tela estática, 0-2s         │   do projeto. Some sozinha
        └──────────────────────────────────┘   quando engine inicia.
                           │
                           ▼
        ┌──────────────────────────────────┐
        │  2.  INIT PYTHON  (-1, 0, +1...) │ ← init python early:
        │      Carrega TODOS os .rpy       │   init -1 python:
        │      Define classes, configs     │   init python:
        └──────────────────────────────────┘   init 999 python:
                           │
                           ▼
        ┌──────────────────────────────────┐
        │  3.  define / image / transform  │ ← roda em prioridade
        │      Catálogo de assets          │   ANTES dos labels.
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │  4.  default <variável>          │ ← roda 1x quando o jogo
        │      (cria persistent.X também)  │   começa do zero.
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │  5.  SPLASHSCREEN (label opcional) │ ← label splashscreen:
        │     Tipicamente: logo studio, AVISO  │   Roda ANTES do menu.
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │  6.  MAIN_MENU  (screen)         │ ← screen main_menu():
        │      Start | Load | Prefs | Sair │
        └──────────────────────────────────┘
                           │
              ┌────────────┴───────────┐
              ▼                        ▼
   ┌──────────────────┐    ┌──────────────────┐
   │  7a. label start │    │  7b. Load save   │
   │      Novo jogo   │    │      Continua    │
   └────────┬─────────┘    └────────┬─────────┘
            │                       │
            │  config.start_callbacks│ config.after_load_callbacks
            ▼                       ▼
        ┌──────────────────────────────────┐
        │  8.  GAME LOOP                   │
        │      • show / hide / scene       │
        │      • say / menu                │
        │      • play music / sound        │
        │      • screens (HUD, save UI)    │
        │      • rollback / save / load    │
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │  9.  return ao menu principal    │ ← fim do label start.
        │      OU MainMenu() action        │
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │  10. QUIT                        │ ← config.quit_callbacks
        │      Salva persistent, fecha SDL │
        └──────────────────────────────────┘`}
      </OutputBlock>

      <h2>2. Init priorities — o detalhe que ninguém ensina</h2>
      <p>
        Você pode ter <strong>vários</strong> blocos <code>init python:</code>{" "}
        em arquivos diferentes. Eles rodam em ordem de prioridade
        (número entre <code>init</code> e <code>python</code>). Default = 0.
        Quanto MENOR o número, mais cedo roda.
      </p>

      <CodeBlock
        language="python"
        title="game/early.rpy"
        code={`# Roda ANTES de tudo — útil pra registrar custom statements,
# substituir o startup do Ren'Py, etc.
init python early:
    def custom_text_renderer(t):
        return t.replace("(c)", "©").replace("(tm)", "™")

# Prioridade -10: registra dependências antes de tudo
init -10 python:
    import json
    import os

# Prioridade padrão (0): a maioria do código
init python:
    achievement.register("primeira_xicara")
    config.allow_skipping = True

# Prioridade +999: roda DEPOIS de tudo —
# bom pra validações e setup que depende de outros módulos.
init 999 python:
    # Garante que TODOS os achievements foram registrados
    print("Total de achievements registrados:",
        len(achievement._achievements))
`}
      />

      <CommandTable
        title="Quando usar cada prioridade"
        variations={[
          { cmd: "init python early:", desc: "Antes de tudo. Custom statements, monkey-patch.", output: "Raro. Só pra hacks profundos." },
          { cmd: "init -10 python:", desc: "Imports pesados, setup de logs.", output: "Garante que está pronto pros init 0." },
          { cmd: "init python:", desc: "Padrão. Maioria das classes, configs, registro.", output: "99% do código vai aqui." },
          { cmd: "init 999 python:", desc: "Validações finais, asserts.", output: "Roda depois de TODOS os outros init." },
          { cmd: "default X = Y", desc: "Cria variável Y de jogo (não-persistent).", output: "Roda 1x quando label start começa." },
          { cmd: "define X = Y", desc: "Constante. Roda no init 0 implicitamente.", output: "Não muda durante o jogo." },
        ]}
      />

      <h2>3. Splashscreen — o seu logo de studio</h2>

      <CodeBlock
        language="python"
        title="game/splashscreen.rpy"
        code={`# label especial — Ren'Py procura ANTES de mostrar main_menu
label splashscreen:

    # Logo da Sakura Café Studios
    scene black
    with Pause(0.5)

    show sakura_studios_logo at truecenter:
        alpha 0.0
        ease 1.0 alpha 1.0
        pause 1.5
        ease 0.8 alpha 0.0

    pause 1.0

    # Aviso de conteúdo (opcional, mas profissional)
    show text "Esta visual novel contém cenas românticas\\nRecomendado para maiores de 13 anos." at truecenter
    with dissolve
    pause 2.5
    hide text
    with dissolve

    return  # ← retorna controla pro main_menu
`}
      />

      <h2>4. Hooks de ciclo de vida</h2>

      <CommandTable
        title="config.* callbacks que você pode plugar"
        variations={[
          { cmd: "config.start_callbacks", desc: "Roda quando o jogador clica 'Start' (novo jogo).", output: "Lista de funções: callback(session)" },
          { cmd: "config.after_load_callbacks", desc: "Roda após carregar um save.", output: "Útil pra restaurar HUDs ou recalcular state." },
          { cmd: "config.save_callbacks", desc: "Antes de salvar — sanitize de dados runtime.", output: "Limpe variáveis temporárias aqui." },
          { cmd: "config.quit_callbacks", desc: "Antes de fechar o app.", output: "Flush de logs, save persistent." },
          { cmd: "config.python_callbacks", desc: "Roda a cada interação (frame UI).", output: "Cuidado: muito frequente, performance!" },
          { cmd: "config.statement_callbacks", desc: "Roda antes de cada statement do script.", output: "Debug profundo. NÃO usar em produção." },
          { cmd: "config.label_callback", desc: "Roda quando entra em qualquer label.", output: "Tracking de progresso, analytics." },
          { cmd: "config.start_interact_callbacks", desc: "Início de cada interação (clique).", output: "Auto-save inteligente." },
        ]}
      />

      <h2>5. Exemplo: hook após carregar save</h2>

      <CodeBlock
        language="python"
        title="game/lifecycle.rpy"
        code={`init python:

    def restaurar_hud_apos_load():
        # Mostra o HUD do café se o jogador estava no café quando salvou
        if persistent.local_atual == "cafe":
            renpy.show_screen("hud_cafe")
        # Restaura música ambiente
        if persistent.musica_ativa:
            renpy.music.play(persistent.musica_ativa, loop=True)

    config.after_load_callbacks.append(restaurar_hud_apos_load)


    def antes_de_iniciar_novo_jogo():
        # Reseta variáveis temporárias, prepara analytics
        global afeicao_sakura, afeicao_yuki
        afeicao_sakura = 0
        afeicao_yuki = 0
        renpy.notify("Bem-vindo ao Sakura Café!")

    config.start_callbacks.append(antes_de_iniciar_novo_jogo)


    def cleanup_quit():
        # Flush de logs ou métricas finais
        with open("game/log.txt", "a") as f:
            f.write("Sessão encerrada.\\n")

    config.quit_callbacks.append(cleanup_quit)
`}
      />

      <h2>6. Persistent — o estado que sobrevive entre sessões</h2>
      <p>
        <code>persistent.X</code> é gravado em disco a cada save E ao
        fechar o jogo. É carregado bem cedo (entre etapas 2 e 3 do
        diagrama). Use pra: conquistas, configurações do jogador,
        estatísticas globais, "já viu introdução? sim/não".
      </p>

      <CodeBlock
        language="python"
        title="game/persistent.rpy"
        code={`# Define DEFAULT — usado se persistent.X for None (primeira vez)
default persistent.viu_intro = False
default persistent.idioma = "pt-br"
default persistent.cafes_servidos = 0
default persistent.melhor_pontuacao = 0
default persistent.rotas_completas = []   # ← lista cresce com o tempo

# Em qualquer label
label start:
    if not persistent.viu_intro:
        call introducao
        $ persistent.viu_intro = True   # nunca mais mostra

    jump menu_principal_jogo
`}
      />

      <h2>7. Save / Load — o que entra e o que NÃO entra</h2>

      <Terminal
        path="~/sakura-cafe"
        lines={[
          {
            comment: "ver o que vai pro save",
            cmd: "renpy.list_saved_games()",
            out: `[('1-1', '20260101-120000', 'Capítulo 1 - Café da manhã'),
 ('1-2', '20260101-122500', 'Capítulo 2 - Akira chegou'),
 ('quick_2', '20260101-123100', 'Quick save')]`,
            outType: "info",
          },
        ]}
      />

      <AlertBox type="warning" title="O que NÃO entra no save">
        Tudo definido por <code>define</code>, todos os <code>image</code>,
        <code>transform</code>, classes — nada disso vai pro save.
        Save guarda APENAS variáveis runtime mutáveis (criadas com{" "}
        <code>default</code> ou atribuição) e o ponto exato no script.
        Se você adicionar uma variável nova depois que o jogador salvou,
        ela aparece como o default ao carregar — sem erro.
      </AlertBox>

      <h2>8. Debug do lifecycle no console</h2>

      <Terminal
        path="~/sakura-cafe"
        lines={[
          {
            comment: "abrir console com Shift+O e inspecionar a fase atual",
            cmd: "_in_replay",
            out: "False",
            outType: "info",
          },
          {
            cmd: "renpy.context().info_label",
            out: '"capitulo2"',
            outType: "info",
          },
          {
            cmd: "len(config.start_callbacks)",
            out: "3",
            outType: "info",
          },
          {
            cmd: "len(config.after_load_callbacks)",
            out: "1",
            outType: "info",
          },
        ]}
      />

      <PracticeBox
        title="Hook de auto-save a cada novo capítulo"
        goal="Configurar um config.label_callback que detecta labels começando com 'cap_' e salva automaticamente em 'auto_X'."
        steps={[
          "Em lifecycle.rpy crie a função def auto_save_capitulo(name, abnormal): ...",
          "Dentro, verifique se name.startswith('cap_'), e chame renpy.save(name).",
          "Adicione config.label_callback = auto_save_capitulo.",
          "Crie 2 labels de teste: cap_1 e cap_2.",
          "Rode o jogo e veja em Load se aparecem 2 saves automáticos.",
        ]}
        verify="Após visitar cap_1 e cap_2, abrir o menu Load mostra 2 entradas auto_cap_1 e auto_cap_2."
      >
        <CodeBlock
          language="python"
          title="game/lifecycle.rpy (gabarito)"
          code={`init python:
    def auto_save_capitulo(name, abnormal):
        if name.startswith("cap_"):
            renpy.save("auto_" + name,
                "Auto-save: " + name)

    config.label_callback = auto_save_capitulo

label cap_1:
    s "Bem-vindo ao capítulo 1!"
    return

label cap_2:
    s "Capítulo 2 começa agora."
    return`}
        />
      </PracticeBox>

      <AlertBox type="danger" title="Pegadinha clássica: variável usada em define que muda em runtime">
        <code>define jogador_nome = "Anônimo"</code> NUNCA atualiza no
        save. Se você quer que mude, use <code>default jogador_nome = "Anônimo"</code>.
        Esse é o erro #1 de novatos: jogador renomeia, salva, carrega e
        o nome volta pro default. Sempre <code>default</code> pra runtime.
      </AlertBox>

      <AlertBox type="success" title="Combo lifecycle + achievements">
        Use <code>config.after_load_callbacks</code> pra mostrar a tela
        de conquistas se o jogador desbloqueou alguma desde o último
        save. Marca presença mesmo sem o jogador abrir o menu.
      </AlertBox>
    </PageContainer>
  );
}
