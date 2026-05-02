import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function MouseCustom() {
  return (
    <PageContainer
      title="Custom Mouse Cursor — cursor temático e animado"
      subtitle="Trocar o cursor do mouse no Ren'Py: cursor estático único, cursor por contexto (default/say/menu), animação frame-a-frame e cursor de xícara de café para o Sakura Café."
      difficulty="intermediario"
      timeToRead="11 min"
      prompt="lifecycle/mouse-custom"
    >
      <AlertBox type="info" title="config.mouse — o que ninguém te conta">
        A doc oficial dá uma linha sobre <code>config.mouse</code> e some.
        Na real você precisa saber: (1) cursor é PNG com hotspot definido,
        (2) pode ter cursores DIFERENTES por contexto (em diálogo, em menu),
        (3) animação é só uma lista de frames com tempo, (4) o tamanho
        máximo recomendado é 32x32 pra performance.
      </AlertBox>

      <h2>1. Estrutura mínima — um cursor único</h2>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`# config.mouse é um dict: { contexto: [ (imagem, hotspot_x, hotspot_y), ... ] }
# O contexto "default" cobre todas as situações.
define config.mouse = {
    "default": [
        ("gui/mouse/xicara.png", 4, 4),  # arquivo, hotX, hotY
    ],
}
`}
      />

      <p>
        <strong>hotspot</strong> é o pixel exato (x, y) dentro da imagem
        que conta como "o ponteiro". Se sua xícara tem 32x32 e o
        ponteiro fica na alça superior esquerda, hotspot = (4, 4).
        Se errar isso, o jogador clica no botão e nada acontece.
      </p>

      <h2>2. Cursor por contexto</h2>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`define config.mouse = {

    # Cursor padrão — toda hora, exceto onde override
    "default": [
        ("gui/mouse/xicara.png", 4, 4),
    ],

    # Em telas de diálogo (durante say)
    "say": [
        ("gui/mouse/xicara_fumaca.png", 4, 4),
    ],

    # Em menus de escolha (menu: bloco)
    "menu": [
        ("gui/mouse/coracao_rosa.png", 8, 8),
    ],

    # Hover sobre botões interativos
    "hover": [
        ("gui/mouse/xicara_brilho.png", 4, 4),
    ],

    # Pause (clique pra avançar)
    "pause": [
        ("gui/mouse/xicara_pisca.png", 4, 4),
    ],
}
`}
      />

      <CommandTable
        title="Contextos suportados por config.mouse"
        variations={[
          { cmd: '"default"', desc: "Fallback para qualquer situação não coberta.", output: "OBRIGATÓRIO ter este contexto." },
          { cmd: '"say"', desc: "Quando uma fala está sendo exibida.", output: "Útil pra cursor em ícone de balão." },
          { cmd: '"menu"', desc: "Dentro de menu: bloco de escolhas.", output: "Bom pra coração/estrela." },
          { cmd: '"pause"', desc: "Esperando clique para continuar.", output: "Animação pulsante chama atenção." },
          { cmd: '"hover"', desc: "Sobre botão interativo (button hover).", output: "Cursor 'mãozinha' temático." },
          { cmd: '"prompt"', desc: "Em renpy.input(), prompt de texto.", output: "Cursor de digitação, lápis." },
          { cmd: '"gallery"', desc: "Tela de gallery / replay.", output: "Cursor de moldura/foto." },
          { cmd: '"verb"', desc: "Em jogos point-and-click custom.", output: "Lupa, chave, mão de pegar." },
        ]}
      />

      <h2>3. Cursor animado (frame-a-frame)</h2>
      <p>
        Pra animar é só passar uma LISTA com mais de uma tupla, cada uma
        com tempo de duração. O Ren'Py cicla automaticamente.
      </p>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`# Cursor de xícara fumegante — fumaça anima em 4 frames
define config.mouse = {

    "default": [
        ("gui/mouse/xicara_f1.png", 4, 4, 0.15),  # 0.15s
        ("gui/mouse/xicara_f2.png", 4, 4, 0.15),
        ("gui/mouse/xicara_f3.png", 4, 4, 0.15),
        ("gui/mouse/xicara_f4.png", 4, 4, 0.15),
    ],

    # Coração pulsando no menu (3 tamanhos)
    "menu": [
        ("gui/mouse/coracao_pequeno.png", 8, 8, 0.30),
        ("gui/mouse/coracao_medio.png",   8, 8, 0.30),
        ("gui/mouse/coracao_grande.png",  8, 8, 0.30),
        ("gui/mouse/coracao_medio.png",   8, 8, 0.30),
    ],
}
`}
      />

      <AlertBox type="warning" title="Performance: cuidado com FPS">
        Cada frame faz a engine recompor o cursor. Com 8+ frames, você
        pode ver micro-stutter em hardware fraco (Chromebooks, Android).
        Mantenha animação em 4-6 frames com 0.15-0.25s cada. Total do
        ciclo: 0.6-1.2s pra parecer natural.
      </AlertBox>

      <h2>4. Mudar cursor em runtime (Python)</h2>
      <p>
        Você pode trocar o cursor dinamicamente — útil pra "modo
        investigação" ou cenas onde o jogador escolhe ferramenta:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`init python:
    def set_cursor_modo(modo):
        """Troca cursor em runtime baseado em modo de jogo."""
        cursores = {
            "normal":      [("gui/mouse/xicara.png", 4, 4)],
            "investigar":  [("gui/mouse/lupa.png", 12, 12)],
            "pegar":       [("gui/mouse/mao.png", 16, 8)],
            "cozinhar":    [("gui/mouse/colher.png", 4, 28)],
        }
        config.mouse["default"] = cursores[modo]
        renpy.restart_interaction()  # força redraw imediato

label minigame_cozinha:
    scene bg cozinha
    $ set_cursor_modo("cozinha")
    "Misture os ingredientes na ordem certa..."

    # ... minigame ...

    $ set_cursor_modo("normal")  # volta ao default
    return
`}
      />

      <h2>5. Cursor sumindo durante cutscenes</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`# Esconder cursor durante uma cena cinematográfica
label cutscene_chuva:
    $ renpy.set_mouse_pos(-100, -100)   # tira da tela
    config.mouse_hide_time = 0           # nunca esconde por timeout

    scene bg cafe_chuva
    "A chuva começou a cair forte sobre o telhado do café."
    pause 3.0
    return
`}
      />

      <h2>6. Hover-state diferente por screen (não só por contexto)</h2>
      <p>
        Para ter cursor diferente <strong>SÓ</strong> sobre um botão
        específico (não global), use a propriedade <code>mouse</code> da
        screen language:
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy"
        code={`screen menu_principal_cafe():
    frame:
        xalign 0.5  yalign 0.5
        vbox spacing 16:

            # Botão normal — usa cursor global
            textbutton "Iniciar":
                action Start()

            # Botão com cursor especial só no hover
            textbutton "Galeria de CGs":
                action ShowMenu("gallery")
                mouse "gallery"   # ← muda pra contexto 'gallery'

            textbutton "Cozinhar":
                action Jump("minigame_cozinha")
                mouse "verb"
`}
      />

      <h2>7. Auto-hide do cursor</h2>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`# Cursor some após X segundos parado (para não atrapalhar leitura)
# Default = 30s. Coloque 5 pra "modo cinema" agressivo.
define config.mouse_hide_time = 5

# Para NUNCA esconder (acessibilidade), use None
# define config.mouse_hide_time = None
`}
      />

      <Terminal
        path="~/sakura-cafe"
        lines={[
          {
            comment: "validar que os arquivos do cursor existem",
            cmd: "renpy.sh . lint",
            out: `Statistics:
  Mouse cursors defined: 6
  All cursor files found.
Lint took 0.3s.`,
            outType: "success",
          },
          {
            comment: "se algum PNG estiver faltando",
            cmd: "renpy.sh . lint",
            out: `game/options.rpy:12 Mouse cursor file 'gui/mouse/xicara.png' not found.
1 error reported.`,
            outType: "error",
          },
        ]}
      />

      <h2>8. Cursor diferente em build mobile vs desktop</h2>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`init python:
    if renpy.variant("mobile") or renpy.variant("touch"):
        # Em touch não faz sentido cursor — desabilita
        config.mouse = None
    else:
        config.mouse = {
            "default": [("gui/mouse/xicara.png", 4, 4)],
            "menu":    [("gui/mouse/coracao.png", 8, 8)],
        }
`}
      />

      <PracticeBox
        title="Cursor xícara animado + coração no menu"
        goal="Configurar 2 contextos: 'default' com xícara fumegante 4 frames e 'menu' com coração pulsando 3 frames."
        steps={[
          "Crie a pasta game/gui/mouse/ e coloque 4 PNGs xicara_f1..f4.png (32x32) e 3 PNGs coracao_p/m/g.png (32x32).",
          "Em options.rpy adicione o dict config.mouse com os 2 contextos.",
          "Defina config.mouse_hide_time = 8 pra cursor sumir mais rápido em leitura.",
          "Rode pelo Launcher e teste: passe o mouse na tela (xícara anima), abra um menu de escolha (vira coração).",
          "Bonus: faça um botão custom no menu_principal com mouse='verb' usando uma lupa.",
        ]}
        verify="Cursor xícara solta fumaça em loop. Em menu de escolha, vira coração que pulsa. Após 8s parado, some."
      >
        <CodeBlock
          language="python"
          title="game/options.rpy (gabarito)"
          code={`define config.mouse = {
    "default": [
        ("gui/mouse/xicara_f1.png", 4, 4, 0.15),
        ("gui/mouse/xicara_f2.png", 4, 4, 0.15),
        ("gui/mouse/xicara_f3.png", 4, 4, 0.15),
        ("gui/mouse/xicara_f4.png", 4, 4, 0.15),
    ],
    "menu": [
        ("gui/mouse/coracao_p.png", 8, 8, 0.30),
        ("gui/mouse/coracao_m.png", 8, 8, 0.30),
        ("gui/mouse/coracao_g.png", 8, 8, 0.30),
    ],
    "verb": [
        ("gui/mouse/lupa.png", 12, 12),
    ],
}

define config.mouse_hide_time = 8`}
        />
      </PracticeBox>

      <OutputBlock label="cheat sheet — config.mouse" type="info">
{`FORMATO        { contexto: [ (img, hot_x, hot_y[, dur_seg]) , ... ] }
TAMANHO IDEAL  32x32 PNG com alpha
HOTSPOT        coordenada do "ponteiro" dentro do PNG
ANIMAÇÃO       lista com 2+ frames; cada um com duração em segundos
CONTEXTOS      default | say | menu | hover | pause | prompt | gallery | verb
RUNTIME        config.mouse["default"] = [...]; renpy.restart_interaction()
ESCONDER       config.mouse_hide_time = N (segundos) ou None
MOBILE         config.mouse = None`}
      </OutputBlock>

      <AlertBox type="success" title="Toque final">
        Custom cursor é detalhe pequeno mas que jogadores ADORAM. Em
        review do Steam você lê coisas como "o cursor de xícara fumegante
        me ganhou logo de cara". Vale o esforço de 30 minutos abrindo o
        Aseprite e fazendo seus 4 frames.
      </AlertBox>
    </PageContainer>
  );
}
