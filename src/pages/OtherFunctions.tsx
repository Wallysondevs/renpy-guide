import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function OtherFunctions() {
  return (
    <PageContainer
      title="Outras funções úteis do renpy.*"
      subtitle="Catálogo das funções e variáveis menos famosas mas extremamente úteis: notify, random, full_restart, invoke_in_new_context, hyperlink, transition, get_image_bounds, scry e mais 20+ utilitários que aparecem em qualquer código avançado."
      difficulty="intermediario"
      timeToRead="15 min"
      prompt="python/utils"
    >
      <AlertBox type="info" title="O 'kit de ferramentas' do Ren'Py">
        Tudo que está em <code>renpy.*</code> é a API pública. A documentação
        oficial é vasta mas dispersa entre 30 páginas. Aqui condensamos as
        20+ funções e variáveis que aparecem em código real de produção,
        com o caso de uso típico do Sakura Café para cada uma.
      </AlertBox>

      <h2>1. Tabela exaustiva — funções utilitárias</h2>

      <CommandTable
        title="Funções renpy.* mais usadas (20+)"
        variations={[
          { cmd: "renpy.notify(msg)", desc: "Mostra notificação flutuante no canto da tela.", output: 'renpy.notify("Receita salva!")' },
          { cmd: "renpy.random.random()", desc: "Float aleatório 0.0-1.0 — controlado pelo seed do save (replay-friendly).", output: "0.4193..." },
          { cmd: "renpy.random.randint(a, b)", desc: "Inteiro aleatório [a, b] — também save-friendly.", output: "renpy.random.randint(1, 6)  # dado" },
          { cmd: "renpy.random.choice(seq)", desc: "Item aleatório da sequência.", output: 'renpy.random.choice(["s","y","a"])' },
          { cmd: "renpy.random.shuffle(seq)", desc: "Embaralha in-place uma lista.", output: "renpy.random.shuffle(cardapio)" },
          { cmd: "renpy.quit()", desc: "Encerra o jogo (volta ao desktop).", output: "—" },
          { cmd: "renpy.full_restart()", desc: "Reinicia: volta ao main_menu sem fechar.", output: "Útil em 'New Game+'" },
          { cmd: "renpy.utter_restart()", desc: "Reinicia recarregando todos os scripts (dev only).", output: "Equivale a Shift+R." },
          { cmd: "renpy.restart_interaction()", desc: "Refaz o frame atual (atualiza screens visíveis).", output: "Após mudar variável que afeta UI." },
          { cmd: "renpy.invoke_in_new_context(fn, *a)", desc: "Roda fn em contexto isolado (pode usar say/menu).", output: 'renpy.invoke_in_new_context(extra_cena)' },
          { cmd: "renpy.call_in_new_context(label)", desc: "Mesmo, mas chama um label.", output: 'renpy.call_in_new_context("tutorial")' },
          { cmd: "renpy.pause(t, hard=False)", desc: "Pausa N segundos. hard=True ignora skip.", output: "renpy.pause(1.5)" },
          { cmd: "renpy.say(who, what, interact=True)", desc: "Equivalente Python de uma fala.", output: 'renpy.say(s, "Olá!")' },
          { cmd: "renpy.input(prompt, default, length)", desc: "Prompt de texto modal.", output: 'nome = renpy.input("Nome?")' },
          { cmd: "renpy.movie_cutscene(file)", desc: "Toca vídeo em tela cheia bloqueando o jogo.", output: 'renpy.movie_cutscene("intro.webm")' },
          { cmd: "renpy.transition(trans)", desc: "Aplica transição na próxima interação.", output: "renpy.transition(dissolve)" },
          { cmd: "renpy.get_image_bounds(name)", desc: "Retorna (x, y, w, h) da imagem na tela.", output: 'renpy.get_image_bounds("sakura happy")' },
          { cmd: "renpy.shown_image_tag(tag)", desc: "Bool: a tag está visível?", output: 'renpy.shown_image_tag("sakura")' },
          { cmd: "renpy.get_say_image_tag()", desc: "Tag do personagem que está falando agora.", output: '"sakura"' },
          { cmd: "renpy.get_screen(name)", desc: "Objeto screen visível ou None.", output: 'renpy.get_screen("hud")' },
          { cmd: "renpy.scene(layer)", desc: "Limpa a layer (equivalente Python de scene).", output: 'renpy.scene("master")' },
          { cmd: "renpy.show(name, at_list=[])", desc: "Equivalente Python de show.", output: 'renpy.show("sakura", at_list=[right])' },
          { cmd: "renpy.hide(tag)", desc: "Esconde por tag.", output: 'renpy.hide("sakura")' },
          { cmd: "renpy.jump(label)", desc: "Salta para label.", output: 'renpy.jump("cap2")' },
          { cmd: "renpy.call(label)", desc: "Chama label como sub-rotina.", output: 'renpy.call("cena_extra")' },
          { cmd: "renpy.hyperlink_styler(target)", desc: "Customiza estilo de hyperlinks {a=}.", output: "—" },
          { cmd: "renpy.scry()", desc: "Olha para o futuro: ScryObject indica se haverá interação.", output: "Usado em skip e auto-forward." },
          { cmd: "renpy.predict_screen(name)", desc: "Pré-carrega assets de uma screen.", output: 'renpy.predict_screen("game_menu")' },
          { cmd: "renpy.exists(filename)", desc: "Bool: arquivo existe em game/?", output: 'renpy.exists("audio/theme.ogg")' },
          { cmd: "renpy.loadable(filename)", desc: "Bool: pode ser carregado pelo Ren'Py?", output: 'renpy.loadable("images/sakura.png")' },
          { cmd: "renpy.list_files(common=False)", desc: "Lista arquivos do projeto.", output: '["script.rpy", "options.rpy", ...]' },
          { cmd: "renpy.version()", desc: "String com a versão da engine.", output: '"Ren\'Py 8.2.3.24061702"' },
        ]}
      />

      <h2>2. Variáveis especiais do store</h2>

      <CommandTable
        title="Variáveis 'mágicas' que o Ren'Py expõe"
        variations={[
          { cmd: "_in_replay", desc: "Bool: está em replay (Image Gallery).", output: "Use para esconder UI durante replay." },
          { cmd: "_skipping", desc: "Bool: jogador está com Ctrl segurado.", output: "Para abortar animações longas." },
          { cmd: "_rollback", desc: "Bool: estamos voltando no tempo.", output: "Não rode side-effects se True." },
          { cmd: "_dismiss_pause", desc: "Bool: jogador pode dispensar pause atual.", output: "" },
          { cmd: "_window", desc: "Bool: a window de say está auto-show?", output: "" },
          { cmd: "_constant", desc: "Marca variáveis que NÃO precisam ir no save (otimização).", output: "default _constant._cache = {}" },
          { cmd: "_preferences", desc: "Objeto com todas as preferências do jogador.", output: "_preferences.text_cps" },
          { cmd: "_game_menu_screen", desc: "Nome da tela atual do menu pausa.", output: '"save"' },
          { cmd: "_return", desc: "Valor de retorno da última call screen.", output: 'jump_target = _return' },
          { cmd: "store.persistent.X", desc: "Persistência entre sessões (até desinstalar).", output: "persistent.melhor_ranking = 999" },
          { cmd: "config.developer", desc: "Bool: modo dev (Shift+O, Shift+D habilitados).", output: 'define config.developer = True' },
        ]}
      />

      <h2>3. Receita: notify estilizado para o café</h2>

      <CodeBlock
        language="python"
        title="game/notify.rpy"
        code={`# Customiza o screen 'notify' nativo
screen notify(message):
    zorder 100
    frame:
        background "#ffaaccdd"
        padding (16, 8)
        align (0.95, 0.05)
        text "[message!t]" color "#1a1a40" size 22

# Uso no script
label cena_pedido:
    s "Aqui está seu café."
    $ renpy.notify("Café servido! +1 gorjeta")
    $ persistent.gorjetas += 1
    return`}
      />

      <h2>4. Receita: minijogo de dado com renpy.random</h2>

      <CodeBlock
        language="python"
        title="game/dado.rpy"
        code={`label dado_sorte:
    "A Akira propõe um jogo de dados — quem tirar maior ganha o último brigadeiro."
    $ meu_dado = renpy.random.randint(1, 6)
    $ akira_dado = renpy.random.randint(1, 6)
    "Você tirou [meu_dado]. Akira tirou [akira_dado]."
    if meu_dado > akira_dado:
        a "Tsk. Levou hoje. Aproveita."
        $ persistent.brigadeiros += 1
    elif meu_dado < akira_dado:
        a "Da próxima vez."
    else:
        "Empate. Repetir?"
        menu:
            "Sim":
                jump dado_sorte
            "Não":
                pass
    return`}
      />

      <h2>5. Receita: cutscene em contexto isolado</h2>
      <p>
        <code>invoke_in_new_context</code> cria um "submundo" onde você pode
        usar <code>say</code>, <code>menu</code> e <code>jump</code> sem
        afetar o estado do jogo principal. Perfeito para tutoriais ou
        flashbacks desconectados.
      </p>

      <CodeBlock
        language="python"
        title="game/tutorial.rpy"
        code={`label tutorial_inventario:
    "Bem-vindo ao tutorial de inventário."
    "Use as setas para navegar."
    "Use Enter para selecionar."
    return

# Em qualquer ponto do jogo
label cena_principal:
    "Você abre a porta do estoque pela primeira vez."
    $ renpy.call_in_new_context("tutorial_inventario")
    "De volta à cena — sem perder o save state."
    return`}
      />

      <h2>6. Receita: pré-carregar assets antes da cena pesada</h2>

      <CodeBlock
        language="python"
        title="game/preload.rpy"
        code={`label antes_da_cena_grande:
    # Pré-carrega para não engasgar
    $ renpy.start_predict("bg sala_principal")
    $ renpy.start_predict("sakura corada")
    $ renpy.start_predict("yuki braba")
    $ renpy.start_predict_screen("hud_grande")

    "Carregando o capítulo final..."
    pause 1.0

    # Quando a cena vier, está tudo na RAM
    scene bg sala_principal
    show sakura corada at left
    show yuki braba at right
    return`}
      />

      <h2>7. Detectando rollback para evitar duplicar side-effects</h2>

      <CodeBlock
        language="python"
        title="game/conquistas.rpy"
        code={`init python:
    def grant_safe(achievement_id):
        if _rollback:
            return  # estamos voltando no tempo, não conta
        if not persistent.achievements.get(achievement_id):
            persistent.achievements[achievement_id] = True
            renpy.notify("Conquista desbloqueada!")

label fim_rota_sakura:
    s "Eu nunca vou esquecer este verão."
    $ grant_safe("rota_sakura_completa")
    return`}
      />

      <Terminal
        path="~/sakura-cafe"
        lines={[
          {
            comment: "Versão atual do engine via console (Shift+O)",
            cmd: "renpy.version()",
            out: "'Ren\\'Py 8.2.3.24061702'",
            outType: "info",
          },
          {
            comment: "Lista todos os arquivos do projeto",
            cmd: "renpy.list_files()[:5]",
            out: `['script.rpy', 'options.rpy', 'screens.rpy', 'gui.rpy', 'tutorial.rpy']`,
            outType: "success",
          },
        ]}
      />

      <PracticeBox
        title="Sistema 'me dê uma dica' usando renpy.random + notify"
        goal="Botão na HUD que sorteia uma dica entre 5 frases pré-definidas e mostra via notify, sem repetir a última."
        steps={[
          "Em init python defina DICAS = [...] com 5 strings.",
          "Crie default ultima_dica = '' para evitar repetição.",
          "Defina função def dica_aleatoria(): que sorteia até diferente da última.",
          "No screen hud, adicione textbutton 'Dica' action Function(dica_aleatoria).",
          "A função deve renpy.notify(escolhida) e atualizar ultima_dica.",
        ]}
        verify="Clicar no botão 5x mostra 5 dicas distintas (no mínimo 4 distintas em sequência)."
      >
        <CodeBlock
          language="python"
          title="game/dicas.rpy (gabarito)"
          code={`init python:
    DICAS = [
        "Pressione Espaço para avançar diálogo.",
        "Ctrl pula textos já lidos.",
        "F5 salva rapidamente.",
        "Tab ativa avanço automático.",
        "Shift+A abre o menu de acessibilidade.",
    ]

    def dica_aleatoria():
        candidatos = [d for d in DICAS if d != store.ultima_dica]
        escolhida = renpy.random.choice(candidatos)
        store.ultima_dica = escolhida
        renpy.notify(escolhida)

default ultima_dica = ""

screen hud():
    textbutton "Dica" action Function(dica_aleatoria) align (0.95, 0.95)`}
        />
      </PracticeBox>

      <OutputBlock label="cheat sheet — onde estas funções vivem" type="info">
{`renpy.random.*       → RNG controlado pelo save (substituir o random do Python)
renpy.notify         → toast UI no canto
renpy.full_restart   → New Game+
renpy.invoke_in_new_context → tutoriais/flashbacks isolados
renpy.start_predict  → pré-carregar assets
_rollback / _skipping → guardas para side-effects
persistent.X         → dados que sobrevivem entre saves`}
      </OutputBlock>

      <AlertBox type="warning" title="Use renpy.random, NÃO random do Python">
        O módulo <code>renpy.random</code> é seedado pelo save: se o jogador
        carregar e refizer escolhas, o resultado é o mesmo. Usar o{" "}
        <code>random</code> do Python puro quebra reprodutibilidade e
        invalida saves em rollback.
      </AlertBox>

      <AlertBox type="success" title="Próximo passo">
        Para organizar Python pesado em arquivos separados (com syntax
        highlighting de Python puro), veja a próxima página{" "}
        <strong>_ren.py — arquivos Python puros</strong>.
      </AlertBox>
    </PageContainer>
  );
}
