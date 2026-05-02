import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function ColorClass() {
  return (
    <PageContainer
      title="Color — manipular cores em Python no Ren'Py"
      subtitle="A classe Color() do Ren'Py converte hex/HSV/RGB, interpola, ajusta brilho/saturação/matiz e devolve uma cor pronta para usar em qualquer transform, style ou TintMatrix. É o canivete suíço para gerar paletas dinâmicas."
      difficulty="intermediario"
      timeToRead="14 min"
      prompt="python/color"
    >
      <AlertBox type="info" title="Por que existe a classe Color">
        Em Ren'Py você passa cor como string (<code>"#ffaacc"</code>) ou tupla
        (<code>(255, 170, 204, 255)</code>) na maioria dos lugares. Mas quando
        você precisa <strong>calcular</strong> a cor (interpolar entre dois
        tons, escurecer 20%, gerar uma paleta procedural), precisa de uma
        classe — e essa classe é <code>Color</code>. Ela mora em{" "}
        <code>renpy.color.Color</code> mas é exposta global no namespace do
        store, então você usa direto.
      </AlertBox>

      <h2>1. Criando uma Color — todas as formas</h2>
      <p>
        O construtor é polimórfico: aceita string hex, tupla RGB(A), outra
        Color, ou kwargs <code>hsv=</code>/<code>hls=</code>. Toda Color
        guarda internamente RGBA float (0.0 - 1.0) e expõe <code>.hexcode</code>,{" "}
        <code>.rgb</code>, <code>.rgba</code>, <code>.hsv</code>,{" "}
        <code>.hls</code>, <code>.alpha</code>.
      </p>

      <CodeBlock
        language="python"
        title="game/cores.rpy"
        code={`init python:
    # 1. A partir de hex (com ou sem #, com ou sem alpha)
    rosa = Color("#ffaacc")
    rosa_alpha = Color("#ffaacc80")     # 50% transparente
    azul = Color("aaccff")              # sem # também vale

    # 2. A partir de tupla RGB ou RGBA (0-255)
    laranja = Color((255, 204, 153))
    laranja_t = Color((255, 204, 153, 200))

    # 3. A partir de outra Color (cópia)
    rosa2 = Color(rosa)

    # 4. A partir de HSV (matiz 0-1, saturação 0-1, valor 0-1)
    sakura_petala = Color(hsv=(0.95, 0.30, 1.00))

    # 5. A partir de HLS (matiz, lightness, saturation)
    cafe_quente = Color(hls=(0.05, 0.35, 0.80))`}
      />

      <h2>2. Propriedades de leitura</h2>

      <CommandTable
        title="O que você consegue extrair de uma Color"
        variations={[
          { cmd: "c.hexcode", desc: "String '#rrggbbaa' (sempre com alpha).", output: "Color('#ffaacc').hexcode → '#ffaaccff'" },
          { cmd: "c.rgb", desc: "Tupla (r, g, b) com floats 0.0-1.0.", output: "(1.0, 0.667, 0.8)" },
          { cmd: "c.rgba", desc: "Tupla (r, g, b, a) com floats 0.0-1.0.", output: "(1.0, 0.667, 0.8, 1.0)" },
          { cmd: "c.hsv", desc: "Tupla (h, s, v) com floats 0.0-1.0.", output: "(0.93, 0.33, 1.0)" },
          { cmd: "c.hls", desc: "Tupla (h, l, s) com floats 0.0-1.0.", output: "(0.93, 0.83, 1.0)" },
          { cmd: "c.alpha", desc: "Alpha float 0.0-1.0.", output: "1.0" },
          { cmd: "tuple(c)", desc: "Tupla (r, g, b, a) inteiros 0-255 — formato Pygame.", output: "(255, 170, 204, 255)" },
        ]}
      />

      <h2>3. Métodos de transformação — devolvem nova Color</h2>
      <p>
        Toda operação retorna uma <strong>nova</strong> instância (Color é
        imutável). Encadeie à vontade.
      </p>

      <CommandTable
        title="Operações que produzem cores derivadas"
        variations={[
          { cmd: "c.interpolate(other, fraction)", desc: "Mistura linear entre c e other (0.0 = c, 1.0 = other).", output: "rosa.interpolate(azul, 0.5) → cor intermediária" },
          { cmd: "c.interpolate_hsv(other, fr)", desc: "Mistura no espaço HSV (transição mais natural de matiz).", output: "Útil para arco-íris contínuo." },
          { cmd: "c.interpolate_hls(other, fr)", desc: "Mistura no espaço HLS.", output: "Idem, com lightness." },
          { cmd: "c.tint(fraction)", desc: "Mistura com branco (clareia). 0.0 = igual, 1.0 = branco.", output: "rosa.tint(0.4) → rosa pastel" },
          { cmd: "c.shade(fraction)", desc: "Mistura com preto (escurece).", output: "rosa.shade(0.5) → rosa escuro" },
          { cmd: "c.opacity(fraction)", desc: "Multiplica o alpha pela fração.", output: "rosa.opacity(0.5) → 50% transparente" },
          { cmd: "c.multiply_alpha(fraction)", desc: "Sinônimo de opacity().", output: "Idem." },
          { cmd: "c.replace_hue(h)", desc: "Substitui o H mantendo S e V.", output: "rosa.replace_hue(0.5) → ciano" },
          { cmd: "c.replace_saturation(s)", desc: "Substitui o S.", output: "rosa.replace_saturation(0.0) → cinza" },
          { cmd: "c.replace_value(v)", desc: "Substitui o V (HSV).", output: "rosa.replace_value(0.5) → rosa escuro" },
          { cmd: "c.replace_lightness(l)", desc: "Substitui o L (HLS).", output: "rosa.replace_lightness(0.2) → marrom-rosa" },
          { cmd: "c.replace_hsv_saturation(s)", desc: "Idem replace_saturation, explícito.", output: "—" },
          { cmd: "c.rotate_hue(amount)", desc: "Soma 'amount' (0.0-1.0) ao matiz, com wrap.", output: "rosa.rotate_hue(0.5) → ciano-esverdeado" },
          { cmd: "c + c2 / c - c2", desc: "Soma/subtração componente a componente (clamp 0-255).", output: "rosa + Color('#001000') → mais verde" },
          { cmd: "c * scalar", desc: "Multiplica RGB pelo escalar (escurece/clareia).", output: "rosa * 0.7 → 70% do brilho" },
        ]}
      />

      <h2>4. Receita: pintar a Sakura com tom de pôr-do-sol</h2>
      <p>
        Vamos gerar dinamicamente uma cor de "pôr-do-sol" interpolando entre
        rosa-quente e laranja-âmbar conforme o jogador avança no relógio do
        café (hora interna do jogo). Usaremos a cor resultante em um{" "}
        <code>matrixcolor TintMatrix(...)</code>.
      </p>

      <CodeBlock
        language="python"
        title="game/sakura_cores.rpy"
        code={`define s = Character("Sakura", color="#ffaacc")

init python:
    # Paleta-base
    AURORA = Color("#ff6688")
    AMBAR  = Color("#ffb060")
    NOITE  = Color("#1a1a40")

    def cor_do_ceu(hora):
        # 17h = AURORA, 19h = AMBAR, 21h = NOITE
        if hora <= 17:
            return AURORA
        if hora <= 19:
            t = (hora - 17) / 2.0
            return AURORA.interpolate(AMBAR, t)
        t = min((hora - 19) / 2.0, 1.0)
        return AMBAR.interpolate(NOITE, t)

default hora_atual = 18

transform tinta_por_do_sol(cor):
    matrixcolor TintMatrix(cor)

label cena_por_do_sol:
    scene bg cafe
    show sakura neutra at center

    $ cor = cor_do_ceu(hora_atual)
    show sakura neutra at tinta_por_do_sol(cor)

    s "O sol pintou tudo de [cor.hexcode]..."
    return`}
      />

      <h2>5. Gerando paletas procedurais</h2>
      <p>
        Combinando <code>rotate_hue</code> com <code>interpolate</code>, você
        gera N variações de uma cor-base (útil para pintar copos de café de
        cores diferentes para cada cliente):
      </p>

      <CodeBlock
        language="python"
        title="game/paleta_copos.rpy"
        code={`init python:
    def paleta_copos(base, n):
        """Gera N cores espaçadas no matiz a partir da cor-base."""
        return [ base.rotate_hue(i / float(n)) for i in range(n) ]

    CORES_COPOS = paleta_copos(Color("#ffaacc"), 6)
    # → [rosa, amarelo, verde-limão, ciano, azul, magenta]

screen vitrine_copos():
    hbox spacing 20 align (0.5, 0.5):
        for cor in CORES_COPOS:
            add Solid(cor, xysize=(80, 120))`}
      />

      <Terminal
        path="~/sakura-cafe"
        lines={[
          {
            comment: "verifica no console (Shift+O em runtime) qualquer Color",
            cmd: 'Color("#ffaacc").interpolate(Color("#1a1a40"), 0.5).hexcode',
            out: "'#8c627eff'",
            outType: "success",
          },
          {
            comment: "rotacionar matiz em meia volta",
            cmd: 'Color("#ffaacc").rotate_hue(0.5).hexcode',
            out: "'#aaffddff'",
            outType: "success",
          },
        ]}
      />

      <h2>6. Color como argumento de TintMatrix / Solid / Frame</h2>

      <CodeBlock
        language="python"
        title="game/usos.rpy"
        code={`# Solid aceita Color direto
image fundo_noturno = Solid(Color("#1a1a40"))

# Frame aceita Color
image caixa = Frame(Solid(Color("#ffaacc40")), 10, 10)

# matrixcolor com TintMatrix usa Color
transform sepia:
    matrixcolor TintMatrix(Color("#a08060"))

# Em style: passe .rgb ou hexcode
style my_btn_text:
    color Color("#ffaacc").shade(0.2).hexcode`}
      />

      <h2>7. Comparação e igualdade</h2>
      <p>
        Color implementa <code>__eq__</code> baseado nos componentes RGBA
        inteiros (0-255). Use isso para checar tema vigente:
      </p>

      <CodeBlock
        language="python"
        title="game/tema.rpy"
        code={`init python:
    TEMA_DIA   = Color("#fff8f0")
    TEMA_NOITE = Color("#1a1a40")

    def eh_noite():
        return persistent.cor_fundo == TEMA_NOITE

default persistent.cor_fundo = TEMA_DIA`}
      />

      <PracticeBox
        title="Gerador de tom da pele para o blush da Sakura"
        goal="Criar uma função que recebe a cor da pele base e retorna a cor do blush (mais saturada e levemente rosa)."
        steps={[
          "Em init python defina blush_de(pele: Color) -> Color.",
          "Pegue o matiz da pele e desloque 0.02 no sentido rosa (rotate_hue).",
          "Aumente saturação para no mínimo 0.45 com replace_saturation.",
          "Reduza levemente o V/lightness com shade(0.1).",
          "Teste com Color('#ffeed8') (pele clara) e Color('#a07050') (pele escura).",
        ]}
        verify="Em ambos os casos a cor retornada deve ser visivelmente mais 'rosada' que a pele de entrada e funcionar como blush em TintMatrix."
      >
        <CodeBlock
          language="python"
          title="game/blush.rpy (gabarito)"
          code={`init python:
    def blush_de(pele):
        c = pele.rotate_hue(0.02)
        h, s, v = c.hsv
        c = c.replace_saturation(max(s, 0.45))
        return c.shade(0.1)

    BLUSH_SAKURA = blush_de(Color("#ffeed8"))
    BLUSH_AKIRA  = blush_de(Color("#a07050"))`}
        />
      </PracticeBox>

      <OutputBlock label="cheat sheet — Color em 8 linhas" type="info">
{`CRIAR        Color("#ffaacc")  |  Color((r,g,b,a))  |  Color(hsv=(h,s,v))
LER          .hexcode .rgb .rgba .hsv .hls .alpha
CLAREAR      c.tint(0.3)         (mistura com branco)
ESCURECER    c.shade(0.3)        (mistura com preto)
TRANSPARÊNCIA c.opacity(0.5)
INTERPOLAR   c.interpolate(c2, t)         |  .interpolate_hsv()
SUBSTITUIR   .replace_hue(h) .replace_saturation(s) .replace_value(v)
ROTACIONAR   c.rotate_hue(0.5)   (matiz oposto)`}
      </OutputBlock>

      <AlertBox type="warning" title="Color NÃO é Color do Pygame">
        O <code>Color</code> do Ren'Py é uma classe própria (<code>renpy.color.Color</code>),
        não confundir com <code>pygame.Color</code>. Internamente ele é
        compatível com tuplas RGBA, mas os métodos descritos aqui (interpolate,
        tint, shade, etc.) são exclusivos do Ren'Py.
      </AlertBox>

      <AlertBox type="success" title="Próximo passo">
        Quando precisar de transformações geométricas além de cor (escala,
        rotação, projeção), você precisa de matrizes. Veja a página{" "}
        <strong>Matrix — matrizes manuais</strong> a seguir.
      </AlertBox>
    </PageContainer>
  );
}
