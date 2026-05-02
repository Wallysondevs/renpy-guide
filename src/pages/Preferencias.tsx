import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Preferencias() {
  return (
    <PageContainer
      title="Preferências do jogador — preferences.* e persistência"
      subtitle="Como o Ren'Py guarda escolhas do jogador (volume, velocidade de texto, fullscreen, auto-forward, skip) entre sessões. Customizar a tela Preferências, adicionar sliders próprios e fazer um modo 'velocidade de leitura para iniciantes'."
      difficulty="intermediario"
      timeToRead="18 min"
      prompt="config/preferencias"
    >
      <AlertBox type="info" title="O que é preferences vs persistent">
        <strong>preferences.*</strong> = preferências do jogador
        relacionadas à EXPERIÊNCIA (volume, velocidade, idioma). O Ren'Py
        AUTOMATICAMENTE persiste essas variáveis em disco — não precisa
        gravar nada manualmente. <strong>persistent.*</strong> = qualquer
        outro dado que sobrevive entre saves (achievements, skin escolhida,
        rotas zeradas).
      </AlertBox>

      <h2>1. As preferences que o Ren'Py já gerencia</h2>

      <CommandTable
        title="preferences.* embutidas — todas auto-persistidas"
        variations={[
          { cmd: "preferences.text_cps", desc: "Velocidade do texto em chars/segundo (0 = instantâneo).", output: "preferences.text_cps = 30" },
          { cmd: "preferences.afm_time", desc: "Tempo do auto-forward em segundos (0 = desligado).", output: "preferences.afm_time = 15" },
          { cmd: "preferences.afm_enable", desc: "Liga/desliga auto-forward.", output: "preferences.afm_enable = True" },
          { cmd: "preferences.skip_unseen", desc: "Skip pula falas NÃO LIDAS.", output: "preferences.skip_unseen = False" },
          { cmd: "preferences.skip_after_choices", desc: "Continua skip após uma escolha.", output: "preferences.skip_after_choices = True" },
          { cmd: "preferences.music_volume", desc: "Volume música (0.0 a 1.0).", output: "preferences.music_volume = 0.7" },
          { cmd: "preferences.sfx_volume", desc: "Volume efeitos sonoros.", output: "preferences.sfx_volume = 0.8" },
          { cmd: "preferences.voice_volume", desc: "Volume voz dos personagens.", output: "preferences.voice_volume = 1.0" },
          { cmd: "preferences.mute_music / mute_sfx / mute_voice / mute_all", desc: "Mute por canal.", output: "preferences.mute_music = False" },
          { cmd: "preferences.fullscreen", desc: "Tela cheia (True) ou janela.", output: "preferences.fullscreen = True" },
          { cmd: "preferences.gl_powersave", desc: "Modo economia de energia (reduz fps).", output: "preferences.gl_powersave = 'auto'" },
          { cmd: "preferences.gl_framerate", desc: "FPS limite escolhido pelo player.", output: "preferences.gl_framerate = 60" },
          { cmd: "preferences.language", desc: "Idioma escolhido (None = default do config).", output: "preferences.language = 'pt_BR'" },
          { cmd: "preferences.self_voicing", desc: "Self-voicing (TTS) ligado.", output: "preferences.self_voicing = False" },
          { cmd: "preferences.emphasize_audio", desc: "Reduz música quando voice toca.", output: "preferences.emphasize_audio = True" },
          { cmd: "preferences.show_empty_window", desc: "Mostra textbox vazia em narração.", output: "preferences.show_empty_window = True" },
          { cmd: "preferences.voice_sustain", desc: "Sustenta voice na próxima fala.", output: "preferences.voice_sustain = False" },
          { cmd: "preferences.transitions", desc: "Nível de transições (0=off, 1=normal, 2=all).", output: "preferences.transitions = 2" },
        ]}
      />

      <h2>2. Action helpers — Preference()</h2>
      <p>
        Em vez de fazer <code>SetField(preferences, "text_cps", 30)</code>,
        o Ren'Py oferece o atalho <code>Preference()</code> que entende
        nomes humanos:
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy — botões prontos"
        code={`screen prefs_audio():
    vbox spacing 12:
        # SLIDERS
        bar value Preference("music volume")
        bar value Preference("sound volume")
        bar value Preference("voice volume")

        # TOGGLES
        textbutton _("Mute música") action Preference("music mute", "toggle")
        textbutton _("Mute tudo")   action Preference("all mute", "toggle")

        # BOTÃO de teste
        textbutton _("Tocar amostra") action Play("sound", "audio/teste.ogg")

screen prefs_display():
    hbox spacing 16:
        textbutton _("Tela cheia") action Preference("display", "fullscreen")
        textbutton _("Janela")     action Preference("display", "window")

screen prefs_skip():
    vbox spacing 8:
        textbutton _("Skip apenas lidos")  action Preference("skip", "seen")
        textbutton _("Skip tudo (unseen)") action Preference("skip", "all")
        textbutton _("Continuar após escolha") action Preference("after choices", "toggle")

screen prefs_idioma():
    hbox spacing 8:
        textbutton "Português" action Language("pt_BR")
        textbutton "English"   action Language(None)
        textbutton "日本語"     action Language("ja")`}
      />

      <h2>3. Argumentos de Preference() — referência</h2>

      <CommandTable
        title="Preference(nome, [valor])"
        variations={[
          { cmd: "Preference('display','fullscreen')", desc: "Liga fullscreen.", output: "preferences.fullscreen = True" },
          { cmd: "Preference('display','window')", desc: "Modo janela.", output: "preferences.fullscreen = False" },
          { cmd: "Preference('display','toggle')", desc: "Alterna fullscreen.", output: "preferences.fullscreen = !fullscreen" },
          { cmd: "Preference('transitions','all')", desc: "Todas transições ligadas.", output: "preferences.transitions = 2" },
          { cmd: "Preference('transitions','none')", desc: "Desliga transições.", output: "preferences.transitions = 0" },
          { cmd: "Preference('text speed', 30)", desc: "Define cps do texto.", output: "preferences.text_cps = 30" },
          { cmd: "Preference('auto-forward time', 15)", desc: "Define afm em segundos.", output: "preferences.afm_time = 15" },
          { cmd: "Preference('auto-forward','toggle')", desc: "Liga/desliga afm.", output: "preferences.afm_enable = !afm" },
          { cmd: "Preference('music volume', 0.7)", desc: "Volume música.", output: "preferences.music_volume = 0.7" },
          { cmd: "Preference('sound mute','toggle')", desc: "Toggle mute SFX.", output: "preferences.mute_sfx = !mute_sfx" },
          { cmd: "Preference('skip','toggle')", desc: "Liga/desliga skip de unseen.", output: "preferences.skip_unseen = !val" },
          { cmd: "Preference('self voicing','toggle')", desc: "Liga TTS de acessibilidade.", output: "preferences.self_voicing = True" },
        ]}
      />

      <h2>4. Tela COMPLETA de preferências do Sakura Café</h2>

      <CodeBlock
        language="python"
        title="game/screens.rpy"
        code={`screen preferences():
    tag menu

    use game_menu(_("Preferências"), scroll="viewport"):
        vbox spacing 28:

            ##########################################
            # MODO DE EXIBIÇÃO
            ##########################################
            hbox box_wrap True spacing 24:
                vbox:
                    label _("Display")
                    textbutton _("Janela")     action Preference("display","window")
                    textbutton _("Tela cheia") action Preference("display","fullscreen")

                vbox:
                    label _("Rollback")
                    textbutton _("Desabilitar") action Preference("rollback side","disable")
                    textbutton _("Esquerda")    action Preference("rollback side","left")
                    textbutton _("Direita")     action Preference("rollback side","right")

                vbox:
                    label _("Skip")
                    textbutton _("Apenas lidos") action Preference("skip","seen")
                    textbutton _("Tudo")         action Preference("skip","all")
                    textbutton _("Após escolhas") action Preference("after choices","toggle")

            null height 20

            ##########################################
            # SLIDERS — velocidade e auto-forward
            ##########################################
            grid 2 4:
                spacing 16

                label _("Velocidade do texto")
                bar value Preference("text speed")

                label _("Auto-forward")
                bar value Preference("auto-forward time")

                label _("Música")
                bar value Preference("music volume")

                label _("Efeitos")
                bar value Preference("sound volume")

            null height 20

            ##########################################
            # ACESSIBILIDADE
            ##########################################
            hbox spacing 16:
                textbutton _("Self-voicing (TTS)") action Preference("self voicing","toggle")
                textbutton _("Idioma: PT-BR") action Language("pt_BR")
                textbutton _("Idioma: EN")    action Language(None)`}
      />

      <h2>5. Adicionando preferências CUSTOM</h2>
      <p>
        Quer guardar uma preferência sua, tipo "modo iniciante" ou
        "tamanho da fonte"? Use <code>persistent.*</code> — também é
        auto-persistido entre sessões:
      </p>

      <CodeBlock
        language="python"
        title="game/preferencias_custom.rpy"
        code={`# Defaults — só aplicados na PRIMEIRA execução
default persistent.modo_iniciante = False
default persistent.tamanho_fonte = 1.0   # multiplicador
default persistent.legenda_voice = True
default persistent.tema = "diurno"

# Hook: aplica o multiplicador de fonte ao gui
init python:
    def aplicar_tamanho_fonte():
        gui.text_size = int(24 * persistent.tamanho_fonte)
        gui.name_text_size = int(32 * persistent.tamanho_fonte)
        renpy.style.rebuild()

    config.after_load_callbacks.append(aplicar_tamanho_fonte)
    config.start_callbacks.append(aplicar_tamanho_fonte)`}
      />

      <CodeBlock
        language="python"
        title="game/screens.rpy — adicionando widget custom"
        code={`screen prefs_acessibilidade():
    vbox spacing 16:
        label _("Acessibilidade")

        # Modo iniciante: cps 15, mostra dica
        textbutton _("Modo iniciante (texto lento + dicas)") action [
            ToggleField(persistent, "modo_iniciante"),
            If(persistent.modo_iniciante,
               SetField(preferences, "text_cps", 15),
               SetField(preferences, "text_cps", 0))
        ]

        # Slider custom de tamanho da fonte
        label _("Tamanho da fonte")
        bar value FieldValue(persistent, "tamanho_fonte",
                              range=2.0, max_is_zero=False,
                              style="slider", offset=0.5)
        textbutton _("Aplicar"):
            action Function(aplicar_tamanho_fonte)

        # Legendar voz?
        textbutton _("Legendar narração (voz para texto)"):
            action ToggleField(persistent, "legenda_voice")`}
      />

      <h2>6. Onde os arquivos persistem?</h2>

      <OutputBlock label="caminhos de persistência por SO" type="info">
{`Linux:    ~/.renpy/<save_directory>/persistent
macOS:    ~/Library/RenPy/<save_directory>/persistent
Windows:  %APPDATA%\\RenPy\\<save_directory>\\persistent
Android:  /storage/emulated/0/Android/data/<package>/files/saves/persistent
iOS:      <Documents>/<save_directory>/persistent

Os arquivos individuais:
  persistent       ← persistent.* (pickle binário)
  preferences.txt  ← cópia legível das preferences (debug)
  log.txt          ← logs do Ren'Py
  saves/*.save     ← saves do jogador
  saves/auto-1-LT1.save  ← autosave atual`}
      </OutputBlock>

      <h2>7. Resetar preferências</h2>

      <CodeBlock
        language="python"
        title="game/screens.rpy"
        code={`screen prefs_reset():
    vbox spacing 12:
        textbutton _("Restaurar padrões"):
            action Confirm(
                _("Tem certeza? Volume, velocidade e tema voltam ao default."),
                yes=Function(resetar_prefs)
            )

init python:
    def resetar_prefs():
        # Defaults do Ren'Py
        preferences.text_cps         = 0
        preferences.afm_time         = 15
        preferences.afm_enable       = False
        preferences.music_volume     = 1.0
        preferences.sfx_volume       = 1.0
        preferences.voice_volume     = 1.0
        preferences.fullscreen       = False
        preferences.transitions      = 2

        # Custom
        persistent.modo_iniciante = False
        persistent.tamanho_fonte  = 1.0
        persistent.tema           = "diurno"

        renpy.style.rebuild()
        renpy.notify("Preferências restauradas.")`}
      />

      <Terminal
        path="~/.renpy/SakuraCafe-2026"
        lines={[
          {
            comment: "ler valores atuais das preferences (modo console no jogo)",
            cmd: "# SHIFT+O dentro do jogo:",
            out: `>>> preferences.text_cps
30
>>> preferences.music_volume
0.7
>>> persistent.modo_iniciante
True
>>> persistent.tamanho_fonte
1.25`,
            outType: "info",
          },
          {
            comment: "listar arquivos persistidos",
            cmd: "ls -la ~/.renpy/SakuraCafe-2026/",
            out: `total 28
drwxr-xr-x  ─ persistent          (4.2 KB)
drwxr-xr-x  ─ saves/
-rw-r--r--  ─ log.txt             (12 KB)
-rw-r--r--  ─ tracebacks.txt      (0 KB)`,
            outType: "default",
          },
        ]}
      />

      <PracticeBox
        title="Adicione um slider 'velocidade de leitura para iniciantes'"
        goal="Criar um botão único que aplica preset confortável: cps 15, auto-forward 25s, transições reduzidas."
        steps={[
          "Em game/preferencias_custom.rpy adicione 'default persistent.modo_iniciante = False'.",
          "Crie a função preset_iniciante() que seta preferences.text_cps=15, afm_time=25, transitions=1, music_volume=0.5.",
          "Em screens.rpy preferences() adicione um textbutton 'Modo iniciante' que chama [ToggleField(persistent,'modo_iniciante'), Function(preset_iniciante)].",
          "Adicione um botão 'Voltar ao normal' que reseta para defaults.",
          "Verifique entrando numa cena com diálogo: o texto digita devagar e auto-avança em 25s.",
        ]}
        verify="Ao ativar 'Modo iniciante', o texto aparece letra por letra a 15 chars/s e avança sozinho em 25s."
      >
        <CodeBlock
          language="python"
          title="game/preferencias_custom.rpy (gabarito)"
          code={`default persistent.modo_iniciante = False

init python:
    def preset_iniciante():
        preferences.text_cps     = 15
        preferences.afm_time     = 25
        preferences.afm_enable   = True
        preferences.transitions  = 1
        preferences.music_volume = 0.5
        renpy.notify("Modo iniciante ativo!")

    def preset_normal():
        preferences.text_cps     = 0
        preferences.afm_time     = 15
        preferences.afm_enable   = False
        preferences.transitions  = 2
        preferences.music_volume = 1.0
        renpy.notify("Modo normal restaurado.")`}
        />
      </PracticeBox>

      <OutputBlock label="cheat sheet — preferências mais usadas" type="success">
{`VELOCIDADE   preferences.text_cps          (0 = instantâneo)
AUTO         preferences.afm_time + afm_enable
SKIP         preferences.skip_unseen + skip_after_choices
ÁUDIO        music_volume / sfx_volume / voice_volume + mute_*
DISPLAY      fullscreen + gl_framerate + gl_powersave
A11Y         self_voicing + emphasize_audio
IDIOMA       Language("pt_BR") action`}
      </OutputBlock>

      <AlertBox type="warning" title="default funciona UMA vez só">
        <code>default persistent.x = ...</code> só aplica o valor se{" "}
        <code>persistent.x</code> NUNCA existiu. Se você publicou v1.0 e
        depois adicionou um <code>default persistent.tema = "diurno"</code>,
        jogadores que JÁ tinham save vão entrar com{" "}
        <code>persistent.tema = None</code>. Sempre teste{" "}
        <code>if persistent.tema is None: persistent.tema = "diurno"</code>.
      </AlertBox>

      <AlertBox type="success" title="Recapitulando o sistema de configuração">
        <strong>config.*</strong> = técnico (options.rpy, build).{" "}
        <strong>gui.*</strong> = visual (cores, sizes).{" "}
        <strong>preferences.*</strong> = experiência do jogador (volume,
        velocidade), auto-persistido. <strong>persistent.*</strong> =
        unlocks e dados entre saves. Você agora tem TODAS as ferramentas
        de configuração do Ren'Py.
      </AlertBox>
    </PageContainer>
  );
}
