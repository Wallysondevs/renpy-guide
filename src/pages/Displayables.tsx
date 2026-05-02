import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Displayables() {
  return (
    <PageContainer
      title="Displayables — tudo é desenhável"
      subtitle="O conceito mais central do Ren'Py: sprite, BG, botão, texto, tudo é Displayable. Image, Solid, Frame, Composite, Crop, Position, AlphaMask, Drag, Movie, ParameterizedText, Null — quando usar cada um e como montar um HUD do café."
      difficulty="intermediario"
      timeToRead="17 min"
      prompt="visual/displayables"
    >
      <AlertBox type="info" title="Conceito-chave">
        Um <strong>Displayable</strong> é qualquer objeto que sabe se
        desenhar. Quando você faz <code>show sakura feliz</code>, o Ren'Py
        envolve o PNG em um <code>Image</code> displayable. Quando faz{" "}
        <code>image bg preto = Solid("#000")</code>, está criando um
        <code>Solid</code> displayable. Tudo na tela é Displayable — é por
        isso que você consegue empilhar, transformar e animar QUALQUER
        coisa do mesmo jeito.
      </AlertBox>

      <h2>1. Os 10 displayables built-in que você deve conhecer</h2>

      <CommandTable
        title="Displayables nativos"
        variations={[
          { cmd: "Image(\"path.png\")", desc: "Carrega arquivo de imagem do disco.", output: "Image(\"images/sakura.png\")" },
          { cmd: "Solid(\"#hex\", xsize, ysize)", desc: "Retângulo de cor sólida (ou gradiente).", output: "Solid(\"#000\", xsize=1920, ysize=1080)" },
          { cmd: "Frame(img, l, t, r, b)", desc: "Imagem com bordas que escalam (9-slice).", output: "Frame(\"caixa.png\", 12, 12, 12, 12)" },
          { cmd: "Composite((w,h), (x,y), d, ...)", desc: "Empilha displayables em uma única figura.", output: "HUD: fundo + ícones + texto" },
          { cmd: "Crop((x,y,w,h), d)", desc: "Recorta um retângulo de outro displayable.", output: "Crop((0,0,300,400), Image(\"sprite.png\"))" },
          { cmd: "Position(d, xpos=, ypos=)", desc: "Posiciona um displayable dentro de um container.", output: "Position(d, xalign=0.5, yalign=1.0)" },
          { cmd: "AlphaMask(d, mask)", desc: "Usa outro displayable como máscara alpha.", output: "AlphaMask(foto, mascara_circular)" },
          { cmd: "Drag(d, drag_name=)", desc: "Torna o displayable arrastável pelo mouse.", output: "Drag(Image(\"item.png\"))" },
          { cmd: "Movie(play=\"bg.webm\")", desc: "Reproduz vídeo como displayable.", output: "Movie(play=\"chuva_loop.webm\", size=(1920,1080))" },
          { cmd: "ParameterizedText()", desc: "Texto cujo conteúdo vem em runtime via interpolação.", output: "Útil em telas de placar/notify." },
          { cmd: "Null(width=, height=)", desc: "Espaço invisível com tamanho — para layouts.", output: "Null(width=20, height=10)" },
        ]}
      />

      <h2>2. <code>Image</code> — o mais comum (e quando precisa criar manualmente)</h2>
      <p>
        99% das vezes você usa <code>image sakura feliz = "..."</code> e
        pronto. Mas em código Python (init/screens) você cria manualmente:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`init python:
    # Image() é só um wrapper — equivalente ao 'image' statement
    sprite_sakura = Image("images/sakura/feliz.png")

    # útil dentro de loops para gerar coleções dinâmicas
    expressoes = {
        nome: Image(f"images/sakura/{nome}.png")
        for nome in ["neutra", "feliz", "triste", "corada"]
    }`}
      />

      <h2>3. <code>Solid</code> — telas pretas, overlays e barras</h2>

      <CodeBlock
        language="python"
        title="game/screens.rpy"
        code={`# Tela preta para fade-out manual
image bg preto = Solid("#000000")

# Overlay rosa translúcido — efeito "amanhecer"
image overlay sunrise = Solid("#ffaacc66")  # alpha em hex (66 = 40%)

# Barra de progresso simples
screen barra_xp(valor):
    frame:
        xalign 0.5 ypos 50
        xsize 400 ysize 20
        background "#333"
        add Solid("#ffaacc", xsize=int(400 * valor), ysize=20)`}
      />

      <h2>4. <code>Frame</code> — caixas que escalam sem deformar (9-slice)</h2>
      <p>
        A doc oficial só mostra a sintaxe, mas o pulo do gato é entender
        que Frame é a base de TODA caixa de diálogo, botão e painel
        customizado:
      </p>

      <CodeBlock
        language="python"
        title="game/gui.rpy — textbox custom do Sakura Café"
        code={`# Frame(arquivo, left, top, right, bottom)
# Os 4 números dizem onde estão as bordas que NÃO devem esticar.
# O miolo do PNG vai ser repetido/esticado para preencher.

image textbox_sakura = Frame(
    "gui/textbox_rosa.png",  # PNG 600x150 com bordas arredondadas
    24, 24, 24, 24,           # 24px de cada lado fica preservado
    tile=False,               # False = stretch | True = repeat
)

# Botão com hover diferente
image btn_idle  = Frame("gui/btn_rosa.png", 12, 12)
image btn_hover = Frame("gui/btn_rosa_hover.png", 12, 12)

style button_background:
    background "btn_idle"
    hover_background "btn_hover"`}
      />

      <h2>5. <code>Composite</code> — montar HUD em uma figura só</h2>
      <p>
        Em vez de declarar 5 imagens e dar <code>show</code> em cada uma,
        você junta tudo num Composite. Exemplo: HUD do café com fundo +
        ícone xícara + texto "café: 12":
      </p>

      <CodeBlock
        language="python"
        title="game/displayables.rpy — HUD compactado"
        code={`init python:
    def hud_cafe(qtd):
        return Composite(
            (220, 60),                                # tamanho final
            (0, 0),    Frame("gui/hud_bg.png", 8, 8, xsize=220, ysize=60),
            (10, 10),  Image("gui/icone_xicara.png"),
            (60, 18),  Text(f"Cafés servidos: {qtd}",
                           size=22, color="#fff"),
        )

# uso direto em um screen
screen hud:
    add hud_cafe(persistent.cafes_servidos)`}
      />

      <AlertBox type="success" title="Por que Composite vale o trabalho">
        Performance: 1 só blit em vez de N. E o resultado é tratado como
        UMA imagem — você pode aplicar transform, ATL, transition no HUD
        inteiro de uma vez.
      </AlertBox>

      <h2>6. <code>Crop</code> e <code>Position</code> — recorte cirúrgico</h2>

      <CodeBlock
        language="python"
        title="game/displayables.rpy"
        code={`# Recortar só o rosto da Sakura para usar como side image
image side sakura = Crop(
    (180, 0, 360, 360),                # (x, y, largura, altura)
    Image("images/sakura/corpo.png"),
)

# Posicionar uma flor exatamente nas coordenadas do balcão
image flor_balcao = Position(
    Image("images/itens/sakura_petala.png"),
    xpos=720, ypos=540, xanchor=0.5, yanchor=1.0,
)`}
      />

      <h2>7. <code>AlphaMask</code> — efeito de retrato circular</h2>
      <p>
        AlphaMask combina dois displayables: o conteúdo e a máscara. Onde
        a máscara é opaca, mostra o conteúdo. Útil para retratos circulares
        no roster de personagens:
      </p>

      <CodeBlock
        language="python"
        title="game/displayables.rpy — retratos circulares"
        code={`# Máscara circular (PNG 200x200 com círculo branco no preto)
image mask_circle = "gui/mask_circle.png"

image retrato_sakura = AlphaMask(
    Image("images/sakura/feliz.png"),
    "mask_circle",
)

image retrato_yuki = AlphaMask(
    Image("images/yuki/neutra.png"),
    "mask_circle",
)

# Em um screen de seleção de personagem
screen escolha_rota:
    hbox:
        spacing 30
        xalign 0.5 yalign 0.5
        imagebutton idle "retrato_sakura" action Jump("rota_sakura")
        imagebutton idle "retrato_yuki"   action Jump("rota_yuki")`}
      />

      <h2>8. <code>Drag</code> — itens arrastáveis (mini-puzzles)</h2>

      <CodeBlock
        language="python"
        title="game/screens.rpy — montar uma xícara"
        code={`screen montar_cafe:
    draggroup:
        drag:
            drag_name "leite"
            droppable False
            xpos 100 ypos 600
            child "images/leite.png"
        drag:
            drag_name "acucar"
            droppable False
            xpos 250 ypos 600
            child "images/acucar.png"
        drag:
            drag_name "xicara"
            draggable False
            droppable True
            xpos 800 ypos 400
            child "images/xicara_vazia.png"
            dropped Function(combinar_ingrediente)`}
      />

      <h2>9. <code>Movie</code> — vídeo como displayable</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy — chuva animada na janela"
        code={`image bg cafe_chuva = Movie(
    play="bg/chuva_janela.webm",
    size=(1920, 1080),
    loop=True,
)

label cena_chuva:
    scene bg cafe_chuva with fade
    s "Adoro o som da chuva no café..."
    return`}
      />

      <h2>10. <code>Null</code> e <code>ParameterizedText</code></h2>

      <CodeBlock
        language="python"
        title="game/screens.rpy"
        code={`# Null — espaço invisível para empurrar conteúdo
screen exemplo_null:
    hbox:
        text "Esquerda"
        add Null(width=200)   # 200px de espaço vazio
        text "Direita"

# ParameterizedText — texto que aceita parâmetros em runtime
init python:
    placar = ParameterizedText(
        size=32, color="#fff", xalign=0.5,
    )

# usado em screen
screen placar_cafe:
    add placar(text="Cafés: %d" % persistent.cafes_servidos)`}
      />

      <Terminal
        path="~/sakura-cafe"
        lines={[
          {
            comment: "lint avisa quando um displayable referencia arquivo inexistente",
            cmd: "renpy.sh . lint",
            out: `game/displayables.rpy:14 Composite references missing image 'gui/hud_bg.png'.
1 warning reported.`,
            outType: "warning",
          },
        ]}
      />

      <PracticeBox
        title="HUD do café com 3 ícones"
        goal="Montar um HUD fixo no canto: ícone de xícara + contador, ícone de coração + afeição da Sakura, ícone de relógio + hora do dia."
        steps={[
          "Crie 3 PNGs 32x32 em gui/icones/ (xicara.png, coracao.png, relogio.png).",
          "Em displayables.rpy crie a função hud_completo(cafes, afeicao, hora) usando Composite.",
          "Em screens.rpy crie o screen 'hud_jogo' que faz add hud_completo(...).",
          "Em options.rpy adicione: config.overlay_screens = ['hud_jogo'].",
          "Rode o jogo e verifique que o HUD aparece em TODA cena.",
        ]}
        verify="Ao avançar diálogos, o HUD permanece no canto superior direito mostrando os 3 contadores."
      >
        <CodeBlock
          language="python"
          title="displayables.rpy + screens.rpy"
          code={`init python:
    def hud_completo(cafes, afeicao, hora):
        return Composite(
            (260, 80),
            (0, 0),    Frame("gui/hud_bg.png", 8, 8, xsize=260, ysize=80),
            (10, 10),  Image("gui/icones/xicara.png"),
            (50, 16),  Text(str(cafes),    size=22, color="#fff"),
            (100, 10), Image("gui/icones/coracao.png"),
            (140, 16), Text(str(afeicao),  size=22, color="#ffaacc"),
            (190, 10), Image("gui/icones/relogio.png"),
            (220, 16), Text(hora,           size=22, color="#fff"),
        )

screen hud_jogo:
    zorder 100
    add hud_completo(
        persistent.cafes_servidos or 0,
        store.afeicao_sakura or 0,
        store.hora_atual or "08:00",
    ) xalign 1.0 yalign 0.0`}
        />
      </PracticeBox>

      <AlertBox type="warning" title="Cuidado: Movie em mobile">
        <code>Movie</code> displayable é caro em Android/iOS. Para BGs
        animados em mobile, prefira sequência PNG via ATL (mostrado em{" "}
        ATL.tsx) ou o futuro <code>Movie(scale_audio=True)</code> do Ren'Py
        8.4. Webm com VP9 é o melhor codec para builds desktop.
      </AlertBox>
    </PageContainer>
  );
}
