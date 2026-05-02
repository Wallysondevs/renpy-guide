import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function CDD() {
  return (
    <PageContainer
      title="CDD — Creator-Defined Displayables"
      subtitle="Quando os displayables prontos do Ren'Py (Image, Solid, Frame, Composite) não bastam, você cria os seus subclassando renpy.Displayable. Implementa render(), event() e visit() — e ganha um displayable que se comporta como qualquer outro."
      difficulty="avancado"
      timeToRead="20 min"
      prompt="python/cdd"
    >
      <AlertBox type="info" title="Quando você PRECISA de um CDD?">
        Quando quer desenhar algo que muda em tempo real e não é uma
        imagem estática: barra de temperatura do café, mini-mapa do
        salão, gráfico de afeição da Sakura, partículas customizadas,
        canvas para mini-jogo. A doc oficial mostra a API mas não dá
        exemplo prático — aqui você sai com um CDD funcional.
      </AlertBox>

      <h2>1. A API mínima — 3 métodos</h2>

      <CommandTable
        title="Métodos que você pode (ou deve) implementar"
        variations={[
          {
            cmd: "render(width, height, st, at)",
            desc: "OBRIGATÓRIO. Devolve um Render com a aparência atual. st = tempo desde o show, at = tempo absoluto.",
            output: "return renpy.Render(w, h)",
          },
          {
            cmd: "event(ev, x, y, st)",
            desc: "Trata mouse/teclado. Retorne valor para 'finalizar' a interaction; None para continuar.",
            output: "if ev.type == MOUSEBUTTONDOWN: return True",
          },
          {
            cmd: "visit()",
            desc: "Lista de displayables filhos (para preload e predição).",
            output: "return [self.imagem_filha]",
          },
          {
            cmd: "per_interact()",
            desc: "Chamado a cada nova interaction (fala, menu).",
            output: "self.t0 = renpy.get_time()",
          },
          {
            cmd: "renpy.redraw(self, delay)",
            desc: "Pede para a engine chamar render() de novo em N segundos (animar).",
            output: "renpy.redraw(self, 0)  # ASAP",
          },
        ]}
      />

      <h2>2. Esqueleto vazio</h2>

      <CodeBlock
        title="game/cdd_base.rpy"
        language="python"
        code={`init python:
    class MeuDisplayable(renpy.Displayable):
        def __init__(self, **kwargs):
            super().__init__(**kwargs)

        def render(self, width, height, st, at):
            # st = tempo desde que o displayable apareceu
            # at = tempo absoluto da animação
            r = renpy.Render(width, height)
            # ... desenhar nele ...
            return r

        def event(self, ev, x, y, st):
            return None  # None = não consome o evento

        def visit(self):
            return []  # nenhum filho neste exemplo
`}
      />

      <h2>3. CDD Real: barra de temperatura do café</h2>
      <p>
        Vamos construir um CDD que desenha um termômetro vertical. A
        cor vai do azul (frio) ao vermelho (fervendo) baseado em uma
        variável global <code>temp_cafe</code>.
      </p>

      <CodeBlock
        title="game/displayables/termometro.rpy"
        language="python"
        code={`init python:
    import pygame_sdl2 as pygame

    class TermometroCafe(renpy.Displayable):
        """Barra vertical 60x300 que mostra temp_cafe (0-100)."""

        def __init__(self, largura=60, altura=300, **kwargs):
            super().__init__(**kwargs)
            self.largura = largura
            self.altura = altura

        def render(self, width, height, st, at):
            r = renpy.Render(self.largura, self.altura)
            canvas = r.canvas()

            # Pega valor atual da temperatura (0-100) no store
            temp = max(0, min(100, getattr(store, "temp_cafe", 25)))

            # Interpola cor: azul (0) → branco (50) → vermelho (100)
            if temp < 50:
                t = temp / 50.0
                r_, g_, b_ = int(80 + t*175), int(160 + t*95), 255
            else:
                t = (temp - 50) / 50.0
                r_, g_, b_ = 255, int(255 - t*180), int(255 - t*230)

            # Borda branca
            canvas.rect(
                (255, 255, 255, 255),
                (0, 0, self.largura, self.altura),
                1,
            )
            # Preenchimento de baixo pra cima
            cheia = int(self.altura * temp / 100.0)
            canvas.rect(
                (r_, g_, b_, 230),
                (2, self.altura - cheia, self.largura - 4, cheia - 2),
            )

            # Pede redraw em 50ms (animação suave)
            renpy.redraw(self, 0.05)
            return r

        def visit(self):
            return []
`}
      />

      <h2>4. Usando o CDD no script</h2>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`default temp_cafe = 25

# Declara como image — agora 'termometro' vira um displayable nomeado
image termometro = TermometroCafe(largura=60, altura=300)

label cena_aquecer:
    scene bg cozinha
    show termometro at Position(xpos=0.92, ypos=0.5, xanchor=0.5, yanchor=0.5)
    show sakura concentrada at right

    s "Vou aquecer a água..."
    $ temp_cafe = 40
    pause 1.0

    s "Mais um pouco..."
    $ temp_cafe = 70
    pause 1.0

    s "Pronto! Temperatura ideal."
    $ temp_cafe = 95
    pause 1.5

    hide termometro
    return
`}
      />

      <AlertBox type="warning" title="canvas() vs blit() vs subpixel_blit()">
        <p>
          <code>render.canvas()</code> dá uma API tipo Pygame (rect,
          circle, line, polygon). Para colocar OUTRO displayable
          (imagem, sprite) dentro do seu, use <code>render.blit()</code>:
        </p>
        <CodeBlock
          language="python"
          code={`def render(self, w, h, st, at):
    r = renpy.Render(800, 600)
    sprite_render = renpy.render(self.sprite_filho, 800, 600, st, at)
    r.blit(sprite_render, (100, 50))
    return r`}
        />
      </AlertBox>

      <h2>5. CDD Interativo — clicável</h2>
      <p>
        O <code>event()</code> recebe eventos pygame brutos. Retorne
        algo para terminar a interaction (útil em <code>renpy.call_screen</code>):
      </p>

      <CodeBlock
        title="game/displayables/botao_xicara.rpy"
        language="python"
        code={`init python:
    import pygame_sdl2 as pygame

    class XicaraClicavel(renpy.Displayable):
        def __init__(self, sprite_path, **kwargs):
            super().__init__(**kwargs)
            self.sprite = renpy.displayable(sprite_path)
            self.hovering = False

        def render(self, w, h, st, at):
            r = renpy.Render(220, 220)
            child = renpy.render(self.sprite, 220, 220, st, at)
            zoom = 1.1 if self.hovering else 1.0

            r.zoom(zoom, zoom)
            r.blit(child, (0, 0))
            return r

        def event(self, ev, x, y, st):
            dentro = 0 <= x <= 220 and 0 <= y <= 220
            if dentro != self.hovering:
                self.hovering = dentro
                renpy.redraw(self, 0)

            if ev.type == pygame.MOUSEBUTTONDOWN and ev.button == 1 and dentro:
                renpy.sound.play("audio/sip.ogg")
                return "bebeu"   # encerra a interaction com este valor

            return None

        def visit(self):
            return [self.sprite]
`}
      />

      <CodeBlock
        title="game/script.rpy — usando em call_screen"
        language="python"
        code={`screen escolha_xicara():
    add XicaraClicavel("images/xicara_a.png") xpos 200 ypos 300
    add XicaraClicavel("images/xicara_b.png") xpos 600 ypos 300

label cena_escolha_xicara:
    s "Qual xícara você prefere?"
    $ result = renpy.call_screen("escolha_xicara")
    s "Boa escolha! Você bebeu o [result]."
    return
`}
      />

      <h2>6. Animação contínua: o ciclo render → redraw</h2>
      <p>
        Para animar, devolva <code>renpy.redraw(self, delay)</code>{" "}
        dentro de <code>render()</code>. <code>delay=0</code> = "no
        próximo frame". <code>delay=0.1</code> = "daqui a 100ms".
        Use <code>st</code> (tempo desde show) para calcular o estado.
      </p>

      <CodeBlock
        title="game/displayables/petalas.rpy"
        language="python"
        code={`init python:
    import math, random

    class PetalasCaindo(renpy.Displayable):
        def __init__(self, qtd=12, **kwargs):
            super().__init__(**kwargs)
            self.particulas = [
                {
                    "x": random.uniform(0, 1280),
                    "y0": random.uniform(-300, 0),
                    "vy": random.uniform(40, 90),
                    "amp": random.uniform(20, 60),
                    "freq": random.uniform(0.4, 1.2),
                    "phase": random.uniform(0, math.pi * 2),
                }
                for _ in range(qtd)
            ]

        def render(self, w, h, st, at):
            r = renpy.Render(1280, 720)
            canvas = r.canvas()
            for p in self.particulas:
                y = p["y0"] + p["vy"] * st
                if y > 720:
                    y = (y % 720) - 50
                x = p["x"] + p["amp"] * math.sin(p["phase"] + st * p["freq"])
                canvas.circle((255, 180, 200, 200), (int(x), int(y)), 4)
            renpy.redraw(self, 0.03)
            return r

        def visit(self):
            return []

image petalas = PetalasCaindo(qtd=20)
`}
      />

      <h2>7. Debug e gotchas</h2>

      <Terminal
        path="~/sakura-cafe"
        lines={[
          {
            comment: "lint detecta CDD que esquece de retornar Render",
            cmd: "renpy.sh . lint",
            out: `game/displayables/termometro.rpy:18 render() returned None,
expected a Render. Animation will appear empty.`,
            outType: "error",
          },
          {
            comment: "console (Shift+O) — testar CDD em runtime",
            cmd: 'renpy.show_screen("test", _layer="overlay")',
            out: "(termometro aparece no canto direito)",
            outType: "success",
          },
        ]}
      />

      <OutputBlock label="erros típicos em CDD" type="warning">
{`1. Esquecer renpy.redraw() → animação trava no primeiro frame
2. Criar Render maior que w,h → canto cortado pela engine
3. Usar pygame.draw em vez de canvas() → SDL2 vs SDL1 mismatch
4. Filho não declarado em visit() → preload falha em mobile
5. event() retornando True sempre → menu fica infinito sem clique
6. Estado mutável compartilhado entre saves → não picklável`}
      </OutputBlock>

      <AlertBox type="danger" title="Picklável obrigatório">
        Atributos do CDD vão ser SALVOS no save game. Se você guardar
        um <code>pygame.Surface</code> direto (não picklável), o save
        quebra. Guarde só o <em>caminho</em> da imagem; reconstrua na
        hora do render.
      </AlertBox>

      <h2>8. CDD vs DynamicDisplayable</h2>
      <p>
        Para casos simples (imagem que muda baseada em variável),
        prefira <code>DynamicDisplayable</code> — é uma função, sem
        classe:
      </p>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`init python:
    def expressao_sakura(st, at):
        if temp_cafe > 80:
            return Image("images/sakura_feliz.png"), 0.1
        elif temp_cafe > 40:
            return Image("images/sakura_neutra.png"), 0.1
        else:
            return Image("images/sakura_triste.png"), 0.1

image sakura_dinamica = DynamicDisplayable(expressao_sakura)

# No script: show sakura_dinamica at right
`}
      />

      <PracticeBox
        title="Crie um medidor de afeição visual"
        goal="CDD que desenha 5 corações (cheios/vazios) baseado em variável afeicao_sakura (0-5)."
        steps={[
          "Crie game/displayables/coracoes.rpy",
          "init python: class MedidorAfeicao(renpy.Displayable):",
          "No __init__ aceite tamanho=40 e cor=(255,80,120,255)",
          "No render: itere 5 vezes, desenhando círculos preenchidos se i < afeicao_sakura, vazios caso contrário",
          "Pede renpy.redraw(self, 0.2) para refletir mudanças",
          "Em script.rpy: image medidor = MedidorAfeicao(); show medidor at Position(xpos=0.05, ypos=0.05)",
          "Mude $ afeicao_sakura += 1 em uma fala e veja atualizar.",
        ]}
        verify="O medidor aparece no canto superior esquerdo. Cada vez que afeicao_sakura aumenta, mais um coração fica preenchido."
      >
        <CodeBlock
          title="game/displayables/coracoes.rpy (gabarito)"
          language="python"
          code={`init python:
    class MedidorAfeicao(renpy.Displayable):
        def __init__(self, tam=40, cor=(255, 80, 120, 255), **kw):
            super().__init__(**kw)
            self.tam = tam
            self.cor = cor

        def render(self, w, h, st, at):
            r = renpy.Render(self.tam * 5 + 20, self.tam + 10)
            c = r.canvas()
            af = max(0, min(5, getattr(store, "afeicao_sakura", 0)))
            for i in range(5):
                x = i * self.tam + self.tam // 2 + 5
                y = self.tam // 2 + 5
                if i < af:
                    c.circle(self.cor, (x, y), self.tam // 2 - 4)
                else:
                    c.circle(self.cor, (x, y), self.tam // 2 - 4, 2)
            renpy.redraw(self, 0.2)
            return r

        def visit(self):
            return []`}
        />
      </PracticeBox>

      <AlertBox type="success" title="O que vem a seguir">
        Você dominou displayables custom. O próximo passo lógico são os{" "}
        <strong>Creator-Defined Statements</strong> (CDS) — invente sua
        própria sintaxe <code>.rpy</code> tipo <code>pedido s "café"</code>!
      </AlertBox>
    </PageContainer>
  );
}
