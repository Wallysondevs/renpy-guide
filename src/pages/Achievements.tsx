import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Achievements() {
  return (
    <PageContainer
      title="Achievements (Conquistas) — local + Steam"
      subtitle="Sistema de conquistas do Ren'Py: registrar, conceder, verificar, persistir e sincronizar com Steam. Conquistas progressivas (ex.: servir 100 cafés) e exemplo completo do Sakura Café."
      difficulty="intermediario"
      timeToRead="16 min"
      prompt="lifecycle/achievements"
    >
      <AlertBox type="info" title="O módulo achievement já vem pronto">
        A doc oficial diz "use <code>achievement.register()</code>" e
        para por aí. Na prática você precisa registrar TODAS as conquistas
        no <code>init</code>, persistir o estado em <code>persistent</code>,
        opcionalmente vincular ao Steam (<em>steamapi</em>) e mostrar uma
        notificação visual. Vamos cobrir tudo no contexto do Sakura Café:
        "Primeira xícara servida", "Rota da Yuki completa", "Mestre Barista
        (servir 100 cafés)".
      </AlertBox>

      <h2>1. O ciclo de vida de uma conquista</h2>
      <p>
        Toda conquista passa por 3 momentos: <strong>register</strong>{" "}
        (declarar que ela existe — feito 1 vez no init),{" "}
        <strong>grant</strong> (conceder ao jogador) e <strong>has</strong>{" "}
        (perguntar se já tem). Tudo isso é local por padrão. Para Steam,
        você só precisa configurar o <code>app_id</code> e o Ren'Py
        sincroniza automaticamente.
      </p>

      <CodeBlock
        language="python"
        title="game/achievements.rpy"
        code={`# ---------------------------------------------------------------
# REGISTRO — roda 1x quando o jogo inicia
# ---------------------------------------------------------------
init python:
    # Conquista simples: bool (true/false)
    achievement.register("primeira_xicara",
        stat_max=None, stat_modulo=0)

    achievement.register("rota_yuki_completa")
    achievement.register("rota_sakura_completa")
    achievement.register("rota_akira_completa")

    # Conquista PROGRESSIVA: precisa de stat_max e stat_modulo.
    # stat_modulo=10 = só sincroniza com Steam a cada 10 unidades
    # (evita flood de chamadas pra API).
    achievement.register("mestre_barista",
        stat_max=100, stat_modulo=10)

    # Final secreto — só aparece quando desbloqueado
    achievement.register("final_verdadeiro")
`}
      />

      <h2>2. Concedendo a conquista no script</h2>
      <p>
        Use <code>$ achievement.grant("nome")</code> no momento exato em
        que o jogador faz a ação. O Ren'Py garante idempotência — chamar
        2x não duplica nem dá erro.
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`define s = Character("Sakura", color="#ffaacc")
define y = Character("Yuki", color="#aaccff")

label primeiro_pedido:
    scene bg cafe
    show sakura feliz at center
    s "Aqui está seu primeiro café! Espero que goste."

    # Concede a conquista de boas-vindas
    $ achievement.grant("primeira_xicara")
    $ renpy.notify("🏆 Conquista: Primeira xícara servida!")

    return

label fim_rota_yuki:
    scene bg parque
    show yuki rindo at center
    y "Obrigada por me escolher..."

    $ achievement.grant("rota_yuki_completa")
    $ renpy.notify("🏆 Conquista: Rota da Yuki completa!")

    # Verifica se completou as 3 rotas pra desbloquear o final secreto
    $ all_routes = (
        achievement.has("rota_yuki_completa") and
        achievement.has("rota_sakura_completa") and
        achievement.has("rota_akira_completa")
    )

    if all_routes:
        $ achievement.grant("final_verdadeiro")
        $ renpy.notify("✨ Final verdadeiro desbloqueado!")

    return
`}
      />

      <h2>3. Conquistas progressivas (cumulativas)</h2>
      <p>
        Para "servir 100 cafés" você não chama <code>grant</code> 100 vezes
        — usa <code>progress(name, completed)</code>. O Ren'Py mantém o
        contador em <code>persistent</code> e dispara a conquista
        automaticamente quando atinge <code>stat_max</code>.
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`default persistent.cafes_servidos = 0

label servir_cafe:
    s "Aqui está, mais um cappuccino fresquinho ☕"

    # Incrementa o contador
    $ persistent.cafes_servidos += 1

    # Atualiza o progresso da conquista
    $ achievement.progress("mestre_barista",
        persistent.cafes_servidos)

    # Notifica o jogador a cada 25
    if persistent.cafes_servidos % 25 == 0:
        $ renpy.notify(
            "☕ {} cafés servidos! Continue assim.".format(
                persistent.cafes_servidos))

    return
`}
      />

      <h2>4. Tabela de funções do módulo achievement</h2>

      <CommandTable
        title="API completa de achievement.*"
        variations={[
          {
            cmd: "achievement.register(name, stat_max=None, stat_modulo=0)",
            desc: "Declara que uma conquista existe. Chame no init python:.",
            output: "Sem retorno. Erro se chamado fora do init.",
          },
          {
            cmd: "achievement.grant(name)",
            desc: "Concede a conquista. Idempotente — chamar 2x é seguro.",
            output: "Salva em persistent + sincroniza com Steam se ativo.",
          },
          {
            cmd: "achievement.has(name)",
            desc: "Retorna True se o jogador já tem a conquista.",
            output: "True | False",
          },
          {
            cmd: "achievement.clear(name)",
            desc: "Remove a conquista (útil em debug).",
            output: "Sem retorno.",
          },
          {
            cmd: "achievement.clear_all()",
            desc: "Reseta TODAS as conquistas — perigoso, só pra QA.",
            output: "Sem retorno.",
          },
          {
            cmd: "achievement.progress(name, completed)",
            desc: "Atualiza barra de progresso. Quando completed >= stat_max, grant é automático.",
            output: "Sem retorno.",
          },
          {
            cmd: "achievement.sync()",
            desc: "Força sincronização com Steam (normalmente automática).",
            output: "True se sincronizou.",
          },
        ]}
      />

      <h2>5. Integração com Steam (steamapi)</h2>
      <p>
        Se o seu jogo vai pra Steam, basta configurar o{" "}
        <code>steam_appid.txt</code> na raiz do projeto e o Ren'Py
        carrega o módulo <code>steamapi</code> automaticamente. As
        conquistas precisam estar criadas no painel do Steam com{" "}
        <strong>exatamente o mesmo ID</strong> usado no <code>register</code>.
      </p>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`# Configuração Steam
define config.steam_appid = 1234567   # ID do seu jogo no Steam

# (opcional) achievements customizados — só os que precisam de logic extra
init python:
    if achievement.steam_position is not None:
        # Move o popup de achievement do Steam pro canto inferior direito
        achievement.steam_position = "bottom_right"
`}
      />

      <Terminal
        path="~/sakura-cafe"
        lines={[
          {
            comment: "verifica se o steamapi carregou no init",
            cmd: "renpy.sh . run",
            out: `Ren'Py 8.3.0
Loading steam api... OK
Steam app id: 1234567
Steam achievements: 5 registered, 2 unlocked.
Game running.`,
            outType: "success",
          },
          {
            comment: "se faltar steam_appid.txt",
            cmd: "renpy.sh . run",
            out: `Ren'Py 8.3.0
Steam api: steam_appid.txt not found.
Achievements running in LOCAL mode (persistent only).`,
            outType: "warning",
          },
        ]}
      />

      <h2>6. Tela de galeria de conquistas custom</h2>
      <p>
        O Ren'Py não tem tela de conquistas pronta. Você cria uma com
        screen language usando <code>achievement.has()</code> para cada uma:
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy"
        code={`screen achievements_gallery():
    tag menu
    use game_menu(_("Conquistas"), scroll="viewport"):
        vbox spacing 12:

            $ entradas = [
                ("primeira_xicara", "Primeira xícara",
                 "Sirva o primeiro café do jogo."),
                ("rota_sakura_completa", "Rota da Sakura",
                 "Termine a rota romântica da Sakura."),
                ("rota_yuki_completa", "Rota da Yuki",
                 "Termine a rota romântica da Yuki."),
                ("rota_akira_completa", "Rota do Akira",
                 "Termine a rota romântica do Akira."),
                ("mestre_barista", "Mestre Barista",
                 "Sirva 100 cafés ao longo do jogo."),
                ("final_verdadeiro", "Final verdadeiro",
                 "??? Desbloqueie todas as 3 rotas."),
            ]

            for ach_id, nome, desc in entradas:
                $ unlocked = achievement.has(ach_id)
                frame:
                    background ("#ffaacc20" if unlocked else "#33333350")
                    padding (12, 12)
                    hbox spacing 12:
                        if unlocked:
                            text "🏆" size 32
                        else:
                            text "🔒" size 32
                        vbox:
                            text nome size 18 bold True
                            text desc size 14 color "#aaa"
                            if ach_id == "mestre_barista" and not unlocked:
                                text "Progresso: {}/100".format(
                                    persistent.cafes_servidos or 0
                                ) size 12 color "#ffaacc"
`}
      />

      <h2>7. Pop-up visual ao desbloquear</h2>
      <p>
        O <code>renpy.notify()</code> é simples mas básico. Para uma
        notificação caprichada (ícone + título + descrição) use uma{" "}
        <code>screen</code> chamada com <code>renpy.show_screen()</code>:
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy"
        code={`screen achievement_popup(nome, desc, icon="🏆"):
    zorder 200
    frame:
        xalign 1.0  yalign 0.05
        xoffset -20  yoffset 20
        background "#1a1a2e"
        padding (16, 12)
        hbox spacing 10:
            text icon size 32
            vbox:
                text "Conquista desbloqueada!" size 11 color "#ffaacc"
                text nome size 16 bold True
                text desc size 12 color "#ccc"

    timer 3.0 action Hide("achievement_popup")

# Helper: usar em vez de renpy.notify
init python:
    def grant_with_popup(ach_id, nome, desc):
        if not achievement.has(ach_id):
            achievement.grant(ach_id)
            renpy.show_screen("achievement_popup",
                nome=nome, desc=desc)
`}
      />

      <PracticeBox
        title="Sistema de conquistas progressivo"
        goal="Implementar 'Mestre Barista' (servir 50 cafés) com barra de progresso visível na tela e notificação ao bater múltiplos de 10."
        steps={[
          "Em achievements.rpy registre 'mestre_barista' com stat_max=50, stat_modulo=10.",
          "Crie default persistent.cafes_servidos = 0.",
          "Faça label servir_cafe que incrementa persistent.cafes_servidos e chama achievement.progress.",
          "Crie screen barra_progresso que mostra 'X/50 cafés' usando bar value persistent.cafes_servidos range 50.",
          "Em script.rpy chame call servir_cafe 5 vezes seguidas e veja a barra preencher.",
        ]}
        verify="Ao bater 50 cafés, a notificação aparece automaticamente e achievement.has('mestre_barista') retorna True."
      >
        <CodeBlock
          language="python"
          title="game/script.rpy (gabarito)"
          code={`init python:
    achievement.register("mestre_barista", stat_max=50, stat_modulo=10)

default persistent.cafes_servidos = 0

screen barra_progresso():
    frame:
        xalign 0.5  yalign 0.95
        background "#000000aa"
        padding (16, 8)
        vbox:
            text "Mestre Barista: [persistent.cafes_servidos]/50"
            bar value persistent.cafes_servidos range 50 xsize 300

label servir_cafe:
    show screen barra_progresso
    "Servindo café..."
    $ persistent.cafes_servidos += 1
    $ achievement.progress("mestre_barista", persistent.cafes_servidos)
    if persistent.cafes_servidos % 10 == 0:
        $ renpy.notify("☕ {} cafés!".format(persistent.cafes_servidos))
    return`}
        />
      </PracticeBox>

      <OutputBlock label="ordem de carregamento de achievements" type="info">
{`1. options.rpy define config.steam_appid (se houver)
2. init python: registra TODAS as conquistas (achievement.register)
3. persistent.* é carregado do disco (estado anterior)
4. Steam api sincroniza estado local <-> remoto
5. Jogo começa. Cada achievement.grant() salva e sincroniza.
6. persistent é gravado a cada save automático ou manual.`}
      </OutputBlock>

      <AlertBox type="warning" title="Pegadinha: nunca registre achievement fora do init">
        Se chamar <code>achievement.register</code> dentro de um label
        normal, o estado fica inconsistente e o Steam pode rejeitar a
        sincronização. SEMPRE dentro de <code>init python:</code>.
      </AlertBox>

      <AlertBox type="success" title="Próximo: Dialogue History">
        Conquistas resolvem retenção. Agora vamos ver como a janela de{" "}
        <strong>histórico de diálogo</strong> funciona — outro recurso
        que jogadores adoram revisitar.
      </AlertBox>
    </PageContainer>
  );
}
