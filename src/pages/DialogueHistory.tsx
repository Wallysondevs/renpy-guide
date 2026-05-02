import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function DialogueHistory() {
  return (
    <PageContainer
      title="Dialogue History — janela de histórico de falas"
      subtitle="A screen 'history' do Ren'Py: como customizar visual, voltar para falas anteriores, replayar voz, controlar tamanho do buffer e estilizar no padrão Sakura Café."
      difficulty="intermediario"
      timeToRead="14 min"
      prompt="lifecycle/dialogue-history"
    >
      <AlertBox type="info" title="History é uma screen built-in mas EDITÁVEL">
        Por padrão, apertar <code>H</code> ou clicar com a roda do mouse
        abre o histórico das últimas 250 falas. A screen <code>history</code>{" "}
        já existe em <code>screens.rpy</code> — você abre o arquivo e
        edita. A doc oficial menciona <code>_history_list</code> e para
        por aí. Vamos ver TUDO: estilizar visual, mostrar avatar do
        personagem, replayar voz e expandir o buffer.
      </AlertBox>

      <h2>1. A screen padrão — onde fica</h2>
      <p>
        Quando o Launcher cria um projeto, ele copia uma screen{" "}
        <code>history</code> em <code>game/screens.rpy</code>. Procure por{" "}
        <code>screen history()</code> — está lá perto da screen{" "}
        <code>save</code>.
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy (versão padrão simplificada)"
        code={`screen history():
    tag menu

    # ATENÇÃO: prediction = False é IMPORTANTE.
    # Sem isso, o Ren'Py tenta predizer renders dessa screen e
    # consome RAM com 250 entradas de histórico. Lerda tudo.
    predict False

    use game_menu(_("História"), scroll="vpgrid"):
        style_prefix "history"

        for h in _history_list:
            window:
                # Quem falou (vazio em narração)
                has fixed:
                    yfit True

                if h.who:
                    label h.who:
                        style "history_name"
                        substitute False
                        if "color" in h.who_args:
                            text_color h.who_args["color"]

                $ what = renpy.filter_text_tags(
                    h.what, allow=gui.history_allow_tags)
                text what:
                    substitute False

        if not _history_list:
            label _("Sem histórico de diálogo.")
`}
      />

      <h2>2. Estrutura de <code>_history_list</code></h2>
      <p>
        <code>_history_list</code> é uma lista global do Ren'Py com objetos
        do tipo <code>HistoryEntry</code>. Cada entrada tem:
      </p>

      <CommandTable
        title="Atributos de uma HistoryEntry"
        variations={[
          { cmd: "h.who", desc: "Nome do personagem (string já renderizada).", output: '"Sakura"  |  "" (narração)' },
          { cmd: "h.what", desc: "Texto da fala (com tags Ren'Py).", output: '"Bem-vindo ao Sakura Café!"' },
          { cmd: "h.who_args", desc: "Dict de args do Character (color, kind...).", output: '{"color": "#ffaacc"}' },
          { cmd: "h.what_args", desc: "Dict de args da fala (interact, etc).", output: "{}" },
          { cmd: "h.kind", desc: "Tipo da entrada — 'say' (default) ou 'adv', 'nvl'.", output: '"say"' },
          { cmd: "h.voice", desc: "Objeto VoiceInfo se a fala teve voice.", output: "VoiceInfo(filename='vo/sakura_001.ogg')" },
          { cmd: "h.rollback_identifier", desc: "ID interno usado p/ voltar para essa fala.", output: "12345" },
          { cmd: "h.show_args", desc: "Args extras do show statement.", output: "{}" },
        ]}
      />

      <h2>3. Configurando o tamanho do buffer</h2>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`# Quantas falas o histórico guarda. Default = 250.
# Quanto maior, mais RAM consome. Para VN curta, 100 basta.
define config.history_length = 500

# (avançado) o que SALVAR de cada entrada de histórico — útil
# se você quer customizar a serialização dentro do save.
define config.history_callbacks = []

# Tags permitidas dentro do history (segurança contra HTML estranho)
define gui.history_allow_tags = {"b", "i", "color", "size"}
`}
      />

      <h2>4. Customização visual no estilo Sakura Café</h2>
      <p>
        Vamos transformar o history padrão (chato, branco, sem visual) em
        algo temático: balões rosa pastel, avatar do personagem na lateral,
        timestamp e botão de replay de voz.
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy — history customizado"
        code={`# Mapeia tag -> avatar pequeno
define gui.history_avatars = {
    "Sakura": "images/avatares/sakura_av.png",
    "Yuki":   "images/avatares/yuki_av.png",
    "Akira":  "images/avatares/akira_av.png",
}

screen history():
    tag menu
    predict False

    use game_menu(_("Histórico do Sakura Café"), scroll="vpgrid"):
        style_prefix "history"

        vbox spacing 14:
            for i, h in enumerate(_history_list):
                frame:
                    xfill True
                    background ("#ffaacc15" if i % 2 == 0 else "#aaccff10")
                    padding (16, 12)

                    hbox spacing 12:

                        # Avatar do personagem
                        $ av = gui.history_avatars.get(h.who, None)
                        if av:
                            add av zoom 0.5 yalign 0.0
                        else:
                            null width 56

                        vbox xfill True spacing 4:

                            # Nome + botão de voz
                            hbox spacing 8:
                                if h.who:
                                    text "[h.who]":
                                        size 16 bold True
                                        color h.who_args.get("color", "#fff")

                                # Botão de replay de voz (se houver)
                                if h.voice:
                                    textbutton "🔊":
                                        action Play("voice", h.voice.filename)
                                        text_size 12

                            # Texto da fala
                            $ what = renpy.filter_text_tags(
                                h.what, allow=gui.history_allow_tags)
                            text what:
                                substitute False
                                color "#eee"

            if not _history_list:
                text _("Sem histórico de diálogo ainda.")
`}
      />

      <h2>5. Voltar para uma fala antiga (rollback ancorado)</h2>
      <p>
        Você pode adicionar um botão "voltar até aqui" usando{" "}
        <code>RollbackToIdentifier(h.rollback_identifier)</code>:
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy — entrada com botão de retorno"
        code={`for h in _history_list:
    frame:
        hbox:
            vbox:
                text h.who
                text h.what

            textbutton _("↩ Voltar para esta fala"):
                action RollbackToIdentifier(h.rollback_identifier)
                sensitive renpy.rollback_to_identifier_checkpoint(
                    h.rollback_identifier, force=False)
`}
      />

      <AlertBox type="warning" title="Cuidado: rollback perde escolhas">
        Voltar para uma fala antes de um <code>menu</code> faz o jogador
        perder as variáveis modificadas depois. Em rotas românticas isso
        pode ser usado pra "ver outra escolha sem fazer save". Decida se
        quer permitir ou marcar a sensibilidade do botão para False após
        certos pontos críticos.
      </AlertBox>

      <h2>6. Filtrar o que entra no histórico</h2>
      <p>
        Nem toda fala precisa entrar. Use o parâmetro <code>history</code>{" "}
        do Character pra desabilitar:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`# Personagem CUJAS falas NÃO entram no histórico
# (útil pra narração sussurrada, descrição de UI, debug)
define narrador_oculto = Character(None, what_color="#888",
    history=False)

# Override pontual: fala que NÃO vai pro histórico
label exemplo:
    s "Esta fala normal entra no histórico."
    narrador_oculto "(esta linha NÃO entra)"

    # Sintaxe alternativa: passar history=False direto na fala
    s "Esta fala SUMIRÁ do histórico." (history=False)
    return
`}
      />

      <h2>7. Limpar o histórico programaticamente</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`# Limpa o buffer todo (útil entre capítulos pra não vazar spoiler)
label cap2:
    $ _history_list = []
    "Capítulo 2 — Uma semana depois..."
    return

# Apagar só as últimas N entradas
init python:
    def trim_history(n):
        global _history_list
        _history_list = _history_list[:-n] if n < len(_history_list) else []
`}
      />

      <Terminal
        path="~/sakura-cafe"
        lines={[
          {
            comment: "depurando o tamanho atual do histórico no console (Shift+O)",
            cmd: "len(_history_list)",
            out: "247",
            outType: "info",
          },
          {
            comment: "ver a última entrada",
            cmd: "vars(_history_list[-1])",
            out: `{'who': 'Sakura',
 'what': 'Já está pronto! Cuidado, café quente.',
 'who_args': {'color': '#ffaacc'},
 'voice': VoiceInfo(filename='vo/sakura_087.ogg'),
 'rollback_identifier': 18742,
 'kind': 'say'}`,
            outType: "success",
          },
        ]}
      />

      <PracticeBox
        title="History com timestamp e ícone de capítulo"
        goal="Adicionar à direita de cada entrada um pequeno texto cinza com 'Cap. X' baseado em uma variável persistent.cap_atual."
        steps={[
          "Crie default cap_atual = 1.",
          "Em cada label de capítulo, atualize $ cap_atual = X no início.",
          "Modifique screen history() para guardar essa info usando um config.history_callbacks.",
          "Mostre 'Cap. X' à direita do nome do personagem na hbox.",
          "Teste rodando do começo de 2 capítulos diferentes e abrindo o histórico.",
        ]}
        verify="Cada entrada do histórico deve mostrar de qual capítulo ela é. Em entradas do cap 1, aparece 'Cap. 1'."
      >
        <CodeBlock
          language="python"
          title="game/script.rpy (gabarito parcial)"
          code={`default cap_atual = 1

init python:
    def stamp_cap(history):
        history.cap = cap_atual
    config.history_callbacks.append(stamp_cap)

# Na screen:
#     text "Cap. [h.cap]" size 11 color "#888"
`}
        />
      </PracticeBox>

      <OutputBlock label="resumo dos hooks" type="info">
{`config.history_length     = tamanho do buffer (default 250)
config.history_callbacks  = lista de funções que rodam ao salvar entrada
gui.history_allow_tags    = tags permitidas no texto renderizado
_history_list             = lista global das entradas (manipulável)
HistoryEntry.rollback_identifier = ID p/ voltar com RollbackToIdentifier`}
      </OutputBlock>

      <AlertBox type="success" title="Combo prático">
        Junte history customizado + voice replay + botão de rollback e
        você tem o "modo nostalgia" — jogadores adoram. Em VNs longas
        (Sakura Café tem 6 rotas) isso vira recurso de retenção poderoso.
      </AlertBox>
    </PageContainer>
  );
}
