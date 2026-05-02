import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function CharacterCallbacks() {
  return (
    <PageContainer
      title="Character Callbacks — hooks em cada fala"
      subtitle="Character(callback=fn) injeta uma função em todos os eventos de uma fala: begin, show, show_done, slow_done, end. Use para SFX automático por personagem, blink de sprite, animação de boca, log de diálogos."
      difficulty="avancado"
      timeToRead="13 min"
      prompt="python/character-callbacks"
    >
      <AlertBox type="info" title="O que é um callback?">
        Toda vez que um Character fala, o Ren'Py emite uma sequência de
        eventos internos. Você pode "se inscrever" em qualquer um deles
        passando uma função no parâmetro <code>callback=</code>.
        Exemplo prático: <strong>cada vez que o Akira fala, tocar
        SFX "ding"</strong> automaticamente, sem precisar lembrar de
        adicionar <code>play sound</code> em cada linha dele.
      </AlertBox>

      <h2>1. Os 5 eventos disponíveis</h2>

      <CommandTable
        title="event passado para o callback"
        variations={[
          {
            cmd: '"begin"',
            desc: "Antes de QUALQUER coisa: a fala vai começar a renderizar.",
            output: "Inicializar boca animada, abrir balão.",
          },
          {
            cmd: '"show"',
            desc: "Texto aparece na tela (instante 0 do CPS).",
            output: "Tocar SFX 'click' do balão de fala.",
          },
          {
            cmd: '"show_done"',
            desc: "Texto totalmente exibido (após CPS terminar).",
            output: "Parar animação de boca.",
          },
          {
            cmd: '"slow_done"',
            desc: "Slow text terminou (igual show_done para a maioria).",
            output: "Habilitar botão 'continuar'.",
          },
          {
            cmd: '"end"',
            desc: "Jogador clicou para avançar; cleanup final.",
            output: "Fechar balão, salvar log da fala.",
          },
        ]}
      />

      <h2>2. Callback básico — SFX por personagem</h2>

      <CodeBlock
        title="game/callbacks.rpy"
        language="python"
        code={`init python:

    def cb_akira(event, **kwargs):
        # event é a string do evento. **kwargs traz extras (interact, etc)
        if event == "begin":
            renpy.sound.play("audio/sfx_akira_ding.ogg")

    def cb_sakura(event, **kwargs):
        if event == "begin":
            renpy.sound.play("audio/sfx_sino_doce.ogg", channel="sound")

    def cb_yuki(event, **kwargs):
        if event == "begin":
            renpy.sound.play("audio/sfx_brisa.ogg")

# Aplica nos Characters
define a = Character("Akira", color="#ffcc99", callback=cb_akira)
define s = Character("Sakura", color="#ffaacc", callback=cb_sakura)
define y = Character("Yuki", color="#aaccff", callback=cb_yuki)
`}
      />

      <CodeBlock
        title="game/script.rpy — sem mudança no roteiro"
        language="python"
        code={`label cena_balcao:
    a "Cheguei! Tem café?"          # toca ding
    s "Bom dia, Akira!"             # toca sino doce
    y "Vocês acordam tão cedo..."   # toca brisa
    return
`}
      />

      <h2>3. Múltiplos eventos em um único callback</h2>

      <CodeBlock
        title="game/callbacks.rpy"
        language="python"
        code={`init python:

    def cb_sakura_completo(event, **kwargs):
        if event == "begin":
            # Mostra sprite com expressão "falando" (boca aberta)
            renpy.show("sakura falando", at_list=[right])
        elif event == "show_done":
            # Texto completo na tela: volta para sprite "neutra"
            renpy.show("sakura neutra", at_list=[right])
        elif event == "end":
            # Logging para sistema de história
            store.dialogo_log.append(("sakura", store._last_say_what))

define s = Character("Sakura", color="#ffaacc", callback=cb_sakura_completo)
`}
      />

      <AlertBox type="warning" title="store._last_say_what e store._last_say_who">
        O Ren'Py expõe <code>_last_say_what</code> (texto puro da última
        fala) e <code>_last_say_who</code> (Character). Úteis dentro do
        callback no evento <code>end</code> para logar.
      </AlertBox>

      <h2>4. Callbacks globais — <code>config.all_character_callbacks</code></h2>
      <p>
        Para hooks que valem para TODOS os personagens (ex: log universal,
        bip de "skip"), use a lista global em vez de Character por
        Character:
      </p>

      <CodeBlock
        title="game/callbacks.rpy"
        language="python"
        code={`init python:

    def cb_global_log(event, interact=True, **kwargs):
        if event == "end" and interact:
            quem = store._last_say_who
            nome = quem.name if quem else "narrador"
            texto = store._last_say_what
            store.full_log = getattr(store, "full_log", [])
            store.full_log.append({"quem": nome, "texto": texto})

    config.all_character_callbacks.append(cb_global_log)
`}
      />

      <h2>5. Animação de boca (lip-sync simples)</h2>

      <CodeBlock
        title="game/callbacks.rpy"
        language="python"
        code={`init python:
    import threading, time

    class LipSync:
        def __init__(self):
            self.ativo = False

        def start(self, sprite_tag):
            self.ativo = True
            self.tag = sprite_tag
            self._loop()

        def stop(self):
            self.ativo = False
            renpy.show(self.tag + " boca_fechada", at_list=[right])

        def _loop(self):
            if not self.ativo:
                return
            estado = "boca_aberta" if int(time.time() * 8) % 2 == 0 else "boca_fechada"
            renpy.show(self.tag + " " + estado, at_list=[right])
            renpy.restart_interaction()

    lipsync = LipSync()

    def cb_sakura_lip(event, **kwargs):
        if event == "show":
            lipsync.start("sakura")
        elif event in ("slow_done", "end"):
            lipsync.stop()

define s = Character("Sakura", color="#ffaacc", callback=cb_sakura_lip)
`}
      />

      <h2>6. Callback que abre e fecha balão (speech bubble)</h2>

      <CodeBlock
        title="game/callbacks.rpy"
        language="python"
        code={`init python:

    def cb_balao(event, **kwargs):
        if event == "begin":
            renpy.show_screen("balao_dialogo")
            renpy.sound.play("audio/sfx_pop.ogg")
        elif event == "end":
            renpy.hide_screen("balao_dialogo")

screen balao_dialogo():
    frame:
        background "#ffeefd"
        xpos 0.6 ypos 0.2
        padding (12, 8)
        text "(falando)" color "#ff66aa" size 14
`}
      />

      <h2>7. Lista de callbacks — encadeando</h2>
      <p>
        <code>callback=</code> aceita uma LISTA de funções, todas
        chamadas em ordem para cada evento:
      </p>

      <CodeBlock
        title="game/callbacks.rpy"
        language="python"
        code={`init python:

    def cb_log(event, **kw):
        if event == "end":
            print("[LOG]", store._last_say_who.name, ":", store._last_say_what)

    def cb_sfx(event, **kw):
        if event == "begin":
            renpy.sound.play("audio/sfx_ding.ogg")

    def cb_blink(event, **kw):
        if event == "begin":
            renpy.show("sakura piscando")
        elif event == "show_done":
            renpy.show("sakura aberta")

define s = Character(
    "Sakura",
    color="#ffaacc",
    callback=[cb_sfx, cb_blink, cb_log],
)
`}
      />

      <h2>8. Argumentos extras do callback</h2>

      <CommandTable
        title="kwargs que chegam em cada chamada"
        variations={[
          {
            cmd: "interact",
            desc: "True se a fala espera clique do jogador, False se é auto.",
            output: "if interact: ...",
          },
          {
            cmd: "type",
            desc: "Tipo do evento: 'say', 'menu', 'narrator'.",
            output: 'if kw.get("type") == "say": ...',
          },
          {
            cmd: "what",
            desc: "Texto sendo exibido (em 'begin' já chega aqui).",
            output: 'kw.get("what", "")',
          },
          {
            cmd: "who",
            desc: "Character que está falando.",
            output: 'kw.get("who")',
          },
          {
            cmd: "multiple",
            desc: "True se a fala faz parte de um Character(multiple=True).",
            output: "raramente usado",
          },
        ]}
      />

      <h2>9. Debug e gotchas</h2>

      <Terminal
        path="~/sakura-cafe"
        lines={[
          {
            comment: "callback levanta exceção → engine para",
            cmd: "renpy.sh . run",
            out: `Exception: 'Character' object has no attribute 'name'
While running game code:
  File "callbacks.rpy", line 14, in cb_global_log
    nome = quem.name if quem else "narrador"`,
            outType: "error",
          },
          {
            comment: "solução: use getattr com default",
            cmd: "renpy.sh . run",
            out: `nome = getattr(quem, "name", "narrador") or "narrador"`,
            outType: "info",
          },
        ]}
      />

      <OutputBlock label="erros frequentes" type="warning">
{`1. Callback síncrono pesado → trava o frame, jogador vê congelamento
2. Modificar variáveis sem default → rollback inconsistente
3. Tocar SFX em 'show' (todo frame) em vez de 'begin' → spam de áudio
4. Esquecer **kwargs → quebra quando engine adiciona novo arg em update
5. Callback que faz renpy.jump() → pula meio da fala, comportamento estranho
6. Acessar store.x dentro de begin antes de default → AttributeError`}
      </OutputBlock>

      <AlertBox type="danger" title="Não chame renpy.say() dentro de callback">
        Recursão infinita: <code>renpy.say</code> chama o callback que
        chama <code>renpy.say</code>... Use <code>renpy.notify</code>{" "}
        para mostrar uma mensagem secundária sem recursão.
      </AlertBox>

      <PracticeBox
        title="Detector de palavrão com callback"
        goal="Criar callback que detecta palavras feias na fala e mostra um {censurado} via renpy.notify, sem mudar o roteiro."
        steps={[
          "Crie game/callbacks.rpy",
          "Defina lista palavroes = ['droga', 'maldição', 'caraca']",
          "def cb_censura(event, **kw): if event == 'end': verifique store._last_say_what",
          "Para cada palavrão presente, chame renpy.notify('⚠ Palavra censurada: ...')",
          "Adicione em config.all_character_callbacks.append(cb_censura)",
          'No script use: y "Que droga, esqueci as chaves!" e y "Caraca, que frio!"',
        ]}
        verify="Toda vez que um Character usa palavra da lista, aparece notificação no canto da tela. O roteiro original permanece intacto."
      >
        <CodeBlock
          title="game/callbacks.rpy (gabarito)"
          language="python"
          code={`init python:
    palavroes = ["droga", "maldição", "caraca"]

    def cb_censura(event, **kw):
        if event != "end":
            return
        texto = (store._last_say_what or "").lower()
        achados = [p for p in palavroes if p in texto]
        if achados:
            renpy.notify("⚠ Palavra censurada: " + ", ".join(achados))

    config.all_character_callbacks.append(cb_censura)`}
        />
      </PracticeBox>

      <AlertBox type="success" title="Próximo passo">
        Você dominou eventos POR FALA. Para ler/escrever ARQUIVOS
        externos (cardápio JSON, configurações, saves customizados), o
        próximo passo é <strong>File Access</strong>.
      </AlertBox>
    </PageContainer>
  );
}
