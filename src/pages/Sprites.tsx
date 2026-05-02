import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Sprites() {
  return (
    <PageContainer
      title="Sprites — partículas e SpriteManager"
      subtitle="Não confunda com sprite de personagem. Sprite + SpriteManager é o sistema de partículas do Ren'Py: pétalas de sakura caindo, neve, fogo. Exemplo COMPLETO de pétalas no café."
      difficulty="avancado"
      timeToRead="20 min"
      prompt="ui/sprites"
    >
      <AlertBox type="warning" title="Atenção: 'Sprite' não é o que você pensa">
        Em Ren'Py, <strong>"sprite"</strong> coloquialmente significa o
        PNG do personagem (Sakura, Akira). MAS a CLASSE Python{" "}
        <code>renpy.Sprite</code> e <code>renpy.SpriteManager</code> são
        outra coisa: um sistema de <strong>partículas</strong>{" "}
        otimizado, capaz de rodar centenas de elementos por frame sem
        engasgar. É com isso que você faz pétalas caindo, neve, fagulhas.
      </AlertBox>

      <h2>1. Por que SpriteManager em vez de muitos <code>show</code>?</h2>
      <p>
        Imagine 80 pétalas de sakura caindo na cena do café. Se você
        usar <code>show petala</code> 80 vezes, o Ren'Py cria 80
        displayables independentes — cada um passa pelo pipeline de
        render, transform, ATL. <strong>Trava.</strong> O SpriteManager
        renderiza tudo num único batch, deixando a cena fluida.
      </p>

      <CommandTable
        title="Quando usar cada abordagem"
        variations={[
          {
            cmd: "show + ATL",
            desc: "Até 5-10 elementos animados.",
            output: "Banner do menu, 1 raio caindo.",
          },
          {
            cmd: "ParticleBurst",
            desc: "Sistema legado simples (Particles class).",
            output: "Confetti rápido em final feliz.",
          },
          {
            cmd: "SpriteManager",
            desc: "Centenas de elementos. Otimizado e custom.",
            output: "Pétalas, neve, chuva, fogo.",
          },
          {
            cmd: "Movie() loop",
            desc: "Vídeo pré-renderizado em loop.",
            output: "Quando a animação é COMPLEXA demais p/ Sprite.",
          },
        ]}
      />

      <h2>2. Anatomia: Sprite + SpriteManager</h2>

      <CodeBlock
        language="python"
        title="game/particles.rpy — esqueleto"
        code={`init python:
    import math
    import random

    class PetalaSakura(renpy.Displayable):
        """ Container que cria/atualiza um SpriteManager de pétalas. """

        def __init__(self, total=60, **kw):
            super().__init__(**kw)
            self.total = total
            self.sm = renpy.SpriteManager(update=self.atualizar)
            self.petalas = []
            # Imagens das pétalas (variar dá realismo)
            self.imgs = [
                "images/efeito/petala1.png",
                "images/efeito/petala2.png",
                "images/efeito/petala3.png",
            ]
            for _ in range(total):
                self._spawn()

        def _spawn(self):
            """ Cria 1 pétala com posição/velocidade aleatórias. """
            img = renpy.displayable(random.choice(self.imgs))
            sp = self.sm.create(img)
            sp.x = random.uniform(0, 1920)
            sp.y = random.uniform(-200, 0)
            # velocidade horizontal e vertical (pixels por segundo)
            sp.vx = random.uniform(-30, 30)
            sp.vy = random.uniform(60, 140)
            sp.rot = random.uniform(0, 360)
            sp.vrot = random.uniform(-90, 90)  # rotação por seg
            sp.osc = random.uniform(0, math.pi * 2)
            self.petalas.append(sp)

        def atualizar(self, st):
            """ Chamado pelo SM em CADA frame. st = tempo em segundos. """
            for sp in self.petalas:
                # Avanço linear
                sp.x = sp.x + sp.vx * (1 / 60.0)
                sp.y = sp.y + sp.vy * (1 / 60.0)
                # Oscila lateralmente como folha caindo
                sp.x = sp.x + math.sin(st * 2 + sp.osc) * 0.6
                # Rotação contínua (não tem effect direto, mas guardamos)
                sp.rot = (sp.rot + sp.vrot * (1 / 60.0)) % 360
                # Reciclagem: passou da tela, volta lá em cima
                if sp.y > 1100:
                    sp.x = random.uniform(0, 1920)
                    sp.y = -50
                    sp.osc = random.uniform(0, math.pi * 2)
            # Retorna o tempo até o próximo update (1/60 = 60fps)
            return 1.0 / 60.0

        def render(self, width, height, st, at):
            return renpy.render(self.sm, width, height, st, at)

        def visit(self):
            return [self.sm]`}
      />

      <h2>3. Usando no script — overlay sobre o background</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`# Declara a partícula como uma image — fica disponível para 'show'
image petalas_sakura = PetalaSakura(total=80)

label cena_cafe_primavera:
    scene bg cafe with fade

    # Coloca as pétalas como overlay (acima do bg, abaixo dos sprites)
    show petalas_sakura behind sakura

    show sakura feliz at center
    s "Adoro quando as cerejeiras florescem na frente do café..."
    s "Olha as pétalas caindo!"

    pause 4.0

    # Tira as pétalas
    hide petalas_sakura with dissolve

    s "Pena que dura tão pouco."
    return`}
      />

      <h2>4. Variações: neve, chuva, confete</h2>

      <CodeBlock
        language="python"
        title="game/particles.rpy — Neve"
        code={`init python:
    class Neve(renpy.Displayable):
        def __init__(self, total=120, vento=10, **kw):
            super().__init__(**kw)
            self.sm = renpy.SpriteManager(update=self.tick)
            self.flocos = []
            for _ in range(total):
                sp = self.sm.create("images/efeito/floco.png")
                sp.x = random.uniform(0, 1920)
                sp.y = random.uniform(-1080, 0)
                sp.vy = random.uniform(40, 120)
                sp.tam = random.uniform(0.3, 1.0)
                self.flocos.append(sp)
            self.vento = vento

        def tick(self, st):
            for sp in self.flocos:
                sp.x = sp.x + self.vento * (1/60.0)
                sp.y = sp.y + sp.vy * (1/60.0) * sp.tam
                if sp.y > 1100:
                    sp.x = random.uniform(0, 1920)
                    sp.y = -20
            return 1/60.0

        def render(self, w, h, st, at):
            return renpy.render(self.sm, w, h, st, at)

        def visit(self):
            return [self.sm]`}
      />

      <CodeBlock
        language="python"
        title="game/particles.rpy — Confete (festa de aniversário)"
        code={`init python:
    class Confete(renpy.Displayable):
        def __init__(self, **kw):
            super().__init__(**kw)
            self.sm = renpy.SpriteManager(update=self.tick)
            self.peças = []
            cores = ["images/efeito/conf_rosa.png",
                     "images/efeito/conf_amarelo.png",
                     "images/efeito/conf_azul.png",
                     "images/efeito/conf_verde.png"]
            for _ in range(150):
                sp = self.sm.create(random.choice(cores))
                # Lançamento radial do centro (festa)
                ang = random.uniform(0, math.pi * 2)
                vel = random.uniform(200, 500)
                sp.x = 960
                sp.y = 540
                sp.vx = math.cos(ang) * vel
                sp.vy = math.sin(ang) * vel - 200  # boost pra cima
                self.peças.append(sp)

        def tick(self, st):
            dt = 1/60.0
            for sp in self.peças:
                sp.x = sp.x + sp.vx * dt
                sp.y = sp.y + sp.vy * dt
                sp.vy = sp.vy + 600 * dt  # gravidade
                # Quando sai da tela, recicla no centro
                if sp.y > 1100:
                    ang = random.uniform(0, math.pi * 2)
                    vel = random.uniform(200, 500)
                    sp.x = 960
                    sp.y = 540
                    sp.vx = math.cos(ang) * vel
                    sp.vy = math.sin(ang) * vel - 200
            return dt

        def render(self, w, h, st, at):
            return renpy.render(self.sm, w, h, st, at)

        def visit(self):
            return [self.sm]

image confete = Confete()`}
      />

      <h2>5. Burst único (não ciclar) — explosão de fagulhas</h2>

      <CodeBlock
        language="python"
        title="game/particles.rpy"
        code={`init python:
    class FagulhasBurst(renpy.Displayable):
        """ Aparece, gera 60 fagulhas, some sozinha em ~2s. """
        def __init__(self, x=960, y=540, **kw):
            super().__init__(**kw)
            self.sm = renpy.SpriteManager(update=self.tick)
            self.x_orig = x
            self.y_orig = y
            self.pieces = []
            for _ in range(60):
                sp = self.sm.create("images/efeito/fagulha.png")
                sp.x = x
                sp.y = y
                ang = random.uniform(0, math.pi * 2)
                vel = random.uniform(150, 400)
                sp.vx = math.cos(ang) * vel
                sp.vy = math.sin(ang) * vel
                sp.life = random.uniform(0.8, 2.0)
                sp.born = 0
                self.pieces.append(sp)
            self.start = None

        def tick(self, st):
            if self.start is None:
                self.start = st
            elapsed = st - self.start
            dt = 1/60.0
            for sp in self.pieces:
                sp.x = sp.x + sp.vx * dt
                sp.y = sp.y + sp.vy * dt
                sp.vy = sp.vy + 500 * dt  # gravidade
            if elapsed > 2.5:
                # Pede pro Ren'Py "esquecer" esse displayable
                renpy.restart_interaction()
                return None  # para o loop
            return dt

        def render(self, w, h, st, at):
            return renpy.render(self.sm, w, h, st, at)

        def visit(self):
            return [self.sm]`}
      />

      <CodeBlock
        language="python"
        title="game/script.rpy — uso do burst"
        code={`label momento_magico:
    scene bg cafe
    show sakura corada at center
    s "Ele me chamou pra sair... eu não acredito!"

    # Dispara fagulhas no centro
    show expression FagulhasBurst(x=960, y=400) as fagulhas
    pause 0.5
    play sound "audio/sfx/sparkle.ogg"
    pause 2.5
    hide fagulhas
    return`}
      />

      <h2>6. Performance — quantas partículas posso criar?</h2>

      <OutputBlock label="benchmark Sakura Café (notebook i5 10ª)" type="info">
{`SpriteManager     | 60 sprites | 200 sprites | 500 sprites
─────────────────────────────────────────────────────────
Pétalas (texture) |   60 fps   |   60 fps    |  58 fps
Confete (rotate)  |   60 fps   |   55 fps    |  38 fps
Burst com física  |   60 fps   |   45 fps    |  22 fps

ATL show repetido | 60 sprites | 200 sprites | 500 sprites
─────────────────────────────────────────────────────────
Mesma cena        |   30 fps   |    8 fps    |  TRAVA`}
      </OutputBlock>

      <h2>7. SpriteManager + ignore_time</h2>
      <p>
        Por padrão o SM passa <code>st</code> (shown time) — útil para
        animações cíclicas. Se passar <code>ignore_time=True</code>, ele
        usa <code>None</code>, evitando re-render quando só posições mudam.
      </p>

      <CodeBlock
        language="python"
        title="game/particles.rpy"
        code={`# Para partículas que NÃO dependem de tempo absoluto
self.sm = renpy.SpriteManager(update=self.tick, ignore_time=True)

# Para fade-in de cada partícula com base na sua "idade"
self.sm = renpy.SpriteManager(update=self.tick)  # st é importante`}
      />

      <h2>8. Tabela de atributos do <code>Sprite</code></h2>

      <CommandTable
        title="Atributos do objeto retornado por sm.create()"
        variations={[
          { cmd: "sp.x / sp.y", desc: "Posição em pixels.", output: "sp.x = 100" },
          { cmd: "sp.zorder", desc: "Ordem de desenho (maior = na frente).", output: "sp.zorder = 5" },
          { cmd: "sp.events", desc: "Se recebe eventos de mouse.", output: "sp.events = True" },
          { cmd: "sp.child", desc: "Re-atribuir para trocar imagem em runtime.", output: 'sp.child = renpy.displayable("nova.png")' },
          { cmd: "sp.destroy()", desc: "Remove o sprite do manager.", output: "sp.destroy()" },
          { cmd: "sm.create(d)", desc: "Cria novo sprite com displayable d.", output: 'sp = self.sm.create("petala.png")' },
        ]}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        user="dev"
        host="vn-studio"
        lines={[
          {
            comment: "Lint avisa se imagens das partículas faltam",
            cmd: "renpy.exe . lint",
            out: `game/particles.rpy:18 Image 'images/efeito/petala1.png' not found.
game/particles.rpy:19 Image 'images/efeito/petala2.png' not found.

Statistics:
  Particle systems: 4
  SpriteManagers active: 0 (rodam em runtime)
Lint took 0.78s.`,
            outType: "warning",
          },
        ]}
      />

      <PracticeBox
        title="Faça pétalas de sakura caírem na cena do café"
        goal="Implementar a classe PetalaSakura completa, declarar como image, mostrar em cena com 60 pétalas e tirar com hide ao mudar de cena."
        steps={[
          "Coloque 3 PNGs de pétala (ou use o mesmo 3x) em images/efeito/petalaN.png.",
          "Em particles.rpy crie a classe PetalaSakura(renpy.Displayable) com sm, _spawn, atualizar(st), render, visit.",
          "No __init__ chame _spawn 60 vezes; em atualizar incremente x,y, oscila com sin, recicla quando y>1100.",
          "Declare image petalas_sakura = PetalaSakura(total=60).",
          "Em script.rpy: scene bg cafe; show petalas_sakura behind sakura; show sakura feliz; falas; hide petalas_sakura.",
        ]}
        verify="Ao rodar a cena, ~60 pétalas aparecem caindo de cima pra baixo, oscilando lateralmente. Framerate >55 fps. Ao 'hide' as pétalas somem com dissolve."
      >
        <CodeBlock
          language="python"
          title="game/particles.rpy (gabarito mínimo funcional)"
          code={`init python:
    import math, random

    class PetalaSakura(renpy.Displayable):
        def __init__(self, total=60, **kw):
            super().__init__(**kw)
            self.sm = renpy.SpriteManager(update=self.tick)
            self.lst = []
            imgs = ["images/efeito/petala1.png",
                    "images/efeito/petala2.png",
                    "images/efeito/petala3.png"]
            for _ in range(total):
                sp = self.sm.create(random.choice(imgs))
                sp.x = random.uniform(0, 1920)
                sp.y = random.uniform(-200, 0)
                sp.vx = random.uniform(-30, 30)
                sp.vy = random.uniform(60, 140)
                sp.osc = random.uniform(0, 6.28)
                self.lst.append(sp)

        def tick(self, st):
            for sp in self.lst:
                sp.x += sp.vx / 60.0 + math.sin(st * 2 + sp.osc) * 0.5
                sp.y += sp.vy / 60.0
                if sp.y > 1100:
                    sp.x = random.uniform(0, 1920)
                    sp.y = -50
            return 1/60.0

        def render(self, w, h, st, at):
            return renpy.render(self.sm, w, h, st, at)

        def visit(self):
            return [self.sm]

image petalas_sakura = PetalaSakura(total=60)`}
        />
      </PracticeBox>

      <AlertBox type="danger" title="Vazamento de memória">
        Se você criar um SpriteManager DENTRO de uma função chamada em
        loop (ex: dentro de <code>screen</code>), o Ren'Py vai instanciar
        TODO frame e nunca limpar. SEMPRE crie no <code>init python:</code>{" "}
        ou em <code>__init__</code> de uma classe declarada como{" "}
        <code>image</code>.
      </AlertBox>

      <AlertBox type="success" title="Próximo passo">
        Combine partículas com <strong>matrixcolor</strong> para fazer
        pétalas brancas virarem cor-de-rosa quando o pôr-do-sol bate, ou
        com <strong>shaders</strong> para distorção de calor sobre uma
        xícara fumegante.
      </AlertBox>
    </PageContainer>
  );
}
