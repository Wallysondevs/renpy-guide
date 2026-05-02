import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Matrixcolor() {
  return (
    <PageContainer
      title="Matrixcolor — filtros de cor por matriz"
      subtitle="TintMatrix, BrightnessMatrix, SaturationMatrix, ContrastMatrix, HueMatrix, InvertMatrix, ColorizeMatrix, OpacityMatrix. Como criar flashback sépia, cena noturna azulada, modo daltonismo e silhueta — receitas prontas no Sakura Café."
      difficulty="intermediario"
      timeToRead="14 min"
      prompt="visual/matrixcolor"
    >
      <AlertBox type="info" title="O que é matrixcolor">
        <code>matrixcolor</code> é uma propriedade de transform que aplica
        uma <strong>matriz 5×5</strong> sobre cada pixel (RGBA + 1). É a
        forma performática de mudar cor em runtime — em vez de ter 4 PNGs
        da Sakura (normal, sépia, noite, silhueta) você usa 1 PNG e troca
        a matriz. Roda na GPU se <code>config.gl2 = True</code>.
      </AlertBox>

      <h2>1. As 8 matrizes built-in</h2>

      <CommandTable
        title="Matrizes prontas do Ren'Py"
        variations={[
          { cmd: "TintMatrix(\"#hex\")", desc: "Multiplica cada pixel pela cor — escurece + colore.", output: "TintMatrix(\"#ff8866\") → tom alaranjado pôr-do-sol" },
          { cmd: "BrightnessMatrix(F)", desc: "Brilho de -1.0 (preto total) a +1.0 (branco total).", output: "BrightnessMatrix(-0.4) → escurece 40%" },
          { cmd: "SaturationMatrix(F)", desc: "0.0 = preto e branco; 1.0 = original; 2.0 = supersaturado.", output: "SaturationMatrix(0.0) → flashback P&B" },
          { cmd: "ContrastMatrix(F)", desc: "1.0 = original; >1.0 aumenta; <1.0 lava.", output: "ContrastMatrix(1.5) → mais contraste" },
          { cmd: "HueMatrix(graus)", desc: "Rotaciona o hue (0-360°). Útil p/ trocar cor de cabelo/roupa.", output: "HueMatrix(120) → verde vira vermelho" },
          { cmd: "InvertMatrix(F)", desc: "0.0 = original; 1.0 = totalmente invertido (negativo).", output: "InvertMatrix(1.0) → tela negativa" },
          { cmd: "ColorizeMatrix(black, white)", desc: "Mapeia preto→cor1 e branco→cor2 (duotone).", output: "ColorizeMatrix(\"#000033\", \"#ff66aa\") → duotone azul→rosa" },
          { cmd: "OpacityMatrix(F)", desc: "Multiplica o canal alpha (similar a 'alpha' mas via matriz).", output: "OpacityMatrix(0.5)" },
        ]}
      />

      <h2>2. Receita 1 — flashback sépia</h2>

      <CodeBlock
        language="python"
        title="game/transforms.rpy"
        code={`# Sépia clássica: dessatura + tinge de marrom-amarelado
transform flashback_sepia:
    matrixcolor SaturationMatrix(0.2) * TintMatrix("#704214")

# Suavizado para flashback do primeiro encontro Sakura/Akira
transform flashback_suave:
    matrixcolor (
        SaturationMatrix(0.3)
        * TintMatrix("#a08060")
        * BrightnessMatrix(-0.05)
    )`}
      />

      <p>
        Repare na multiplicação: matrizes <strong>combinam</strong> com{" "}
        <code>*</code>. A ordem importa: a matriz à DIREITA é aplicada
        primeiro. Aqui dessatura → tinge → escurece levemente.
      </p>

      <h2>3. Receita 2 — cena noturna azulada</h2>

      <CodeBlock
        language="python"
        title="game/transforms.rpy"
        code={`# Tudo fica frio, escuro e azulado — perfeito para cena no quarto
transform modo_noite:
    matrixcolor (
        TintMatrix("#5577aa")
        * BrightnessMatrix(-0.2)
        * SaturationMatrix(0.7)
    )

# Versão "luar pela janela" — mais azul, contraste alto
transform luar:
    matrixcolor (
        TintMatrix("#3355aa")
        * ContrastMatrix(1.3)
        * BrightnessMatrix(-0.35)
    )`}
      />

      <h2>4. Receita 3 — silhueta (personagem misterioso)</h2>

      <CodeBlock
        language="python"
        title="game/transforms.rpy"
        code={`# Personagem visível só em silhueta preta — usado para spoiler de rota
transform silhueta:
    matrixcolor (
        BrightnessMatrix(-1.0)   # tudo vira preto
        * ContrastMatrix(2.0)
    )

# Silhueta com leve brilho (vilão dramático)
transform silhueta_misteriosa:
    matrixcolor TintMatrix("#000") * OpacityMatrix(1.0)
    add Solid("#ffffff", xsize=400, ysize=600):
        alpha 0.05`}
      />

      <h2>5. Receita 4 — modo daltonismo (acessibilidade)</h2>

      <CodeBlock
        language="python"
        title="game/transforms.rpy — simulações"
        code={`# Daltonismo Protanopia (sem vermelho)
transform daltonismo_protanopia:
    matrixcolor Matrix([
        0.567, 0.433, 0.000, 0.0, 0.0,
        0.558, 0.442, 0.000, 0.0, 0.0,
        0.000, 0.242, 0.758, 0.0, 0.0,
        0.000, 0.000, 0.000, 1.0, 0.0,
    ])

# Daltonismo Deuteranopia (sem verde)
transform daltonismo_deuteranopia:
    matrixcolor Matrix([
        0.625, 0.375, 0.0, 0.0, 0.0,
        0.700, 0.300, 0.0, 0.0, 0.0,
        0.000, 0.300, 0.7, 0.0, 0.0,
        0.000, 0.000, 0.0, 1.0, 0.0,
    ])`}
      />

      <AlertBox type="success" title="Acessibilidade ganha pontos">
        Adicione um toggle em preferences para o jogador escolher.
        Reviewers/imprensa adoram VNs com modos de daltonismo — diferencial
        em festivais como itch.io e Visual Novel Database.
      </AlertBox>

      <h2>6. Receita 5 — duotone "Sakura Café branding"</h2>

      <CodeBlock
        language="python"
        title="game/transforms.rpy — visual de marca"
        code={`# Toda cena vira duotone rosa+creme — identidade visual do café
transform branding_sakura:
    matrixcolor ColorizeMatrix("#3a2030", "#ffeedd")

# Para cenas no flashback do café antigo (sépia + duotone)
transform cafe_antigo:
    matrixcolor (
        ColorizeMatrix("#2a1a10", "#f0d8b0")
        * SaturationMatrix(0.5)
    )`}
      />

      <h2>7. Animar a matriz — transição entre estados</h2>
      <p>
        Você pode interpolar entre matrizes diferentes em transform com{" "}
        <code>linear</code>/<code>ease</code>. Útil para "amanhecer" — sai
        do <code>luar</code> e entra no normal:
      </p>

      <CodeBlock
        language="python"
        title="game/transforms.rpy"
        code={`transform amanhecer:
    matrixcolor TintMatrix("#3355aa") * BrightnessMatrix(-0.3)
    ease 4.0 matrixcolor TintMatrix("#ffeebb") * BrightnessMatrix(0.0)
    ease 2.0 matrixcolor TintMatrix("#ffffff") * BrightnessMatrix(0.0)

label cena_madrugada:
    scene bg quarto noite at amanhecer
    show sakura sonolenta
    s "Mmm... que horas são?"
    pause 4.0
    s "Já é manhã!"
    return`}
      />

      <h2>8. Aplicando em sprite específico</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy — Sakura ao pôr-do-sol"
        code={`transform por_do_sol:
    matrixcolor TintMatrix("#ff9966")

label cena_pds:
    scene bg cafe with fade
    show sakura feliz at center, por_do_sol
    s "O céu está lindo hoje..."
    return`}
      />

      <h2>9. Matriz custom — quando os built-in não bastam</h2>

      <CodeBlock
        language="python"
        title="game/transforms.rpy — matriz totalmente custom"
        code={`# Aumentar só o canal vermelho 30%, sem mexer no resto
transform mais_vermelho:
    matrixcolor Matrix([
        1.3, 0.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 1.0, 0.0,
    ])`}
      />

      <p>
        A matriz é 4×5 (R, G, B, A linhas; R, G, B, A, offset colunas).
        Cada linha define como o canal de saída é calculado a partir dos 4
        canais de entrada + uma constante.
      </p>

      <Terminal
        path="~/sakura-cafe"
        lines={[
          {
            comment: "lint avisa de matrixcolor sem gl2",
            cmd: "renpy.sh . lint",
            out: `game/transforms.rpy:8 'matrixcolor' has no effect when config.gl2 = False.
Add 'define config.gl2 = True' in options.rpy.
1 warning reported.`,
            outType: "warning",
          },
        ]}
      />

      <PracticeBox
        title="Toggle de modo noturno em runtime"
        goal="Criar uma preference 'modo_noite' que aplica matriz azulada em TODAS as cenas quando ativada."
        steps={[
          "Em screens.rpy crie default persistent.modo_noite = False.",
          "Em transforms.rpy crie 'transform tela_noite' com matrixcolor TintMatrix('#5577aa') * BrightnessMatrix(-0.2).",
          "Em options.rpy: config.layer_transforms = {'master': lambda: tela_noite if persistent.modo_noite else None}.",
          "No screen 'preferences' adicione um textbutton 'Modo noturno' que faz ToggleField(persistent, 'modo_noite').",
          "Rode o jogo, ative no menu de prefs, veja todas as cenas escurecerem.",
        ]}
        verify="Ao ativar/desativar a opção, a paleta de cores muda imediatamente em qualquer cena."
      >
        <CodeBlock
          language="python"
          title="resumo"
          code={`default persistent.modo_noite = False

transform tela_noite:
    matrixcolor TintMatrix("#5577aa") * BrightnessMatrix(-0.2)

# em options.rpy
init python:
    def aplicar_filtro_global():
        if persistent.modo_noite:
            return tela_noite
        return None
    config.layer_transforms = {"master": aplicar_filtro_global}`}
        />
      </PracticeBox>

      <OutputBlock label="cheat sheet — combinações úteis" type="info">
{`SÉPIA          SaturationMatrix(0.2) * TintMatrix("#704214")
P&B            SaturationMatrix(0.0)
NOITE AZUL     TintMatrix("#5577aa") * BrightnessMatrix(-0.2)
PÔR-DO-SOL     TintMatrix("#ff9966")
SILHUETA       BrightnessMatrix(-1.0) * ContrastMatrix(2.0)
NEGATIVO       InvertMatrix(1.0)
DUOTONE        ColorizeMatrix("#000033", "#ff66aa")
SUPERSAT       SaturationMatrix(2.0)`}
      </OutputBlock>

      <AlertBox type="danger" title="Performance: 1 matrixcolor por displayable">
        Cada <code>matrixcolor</code> custa um shader pass na GPU. Se você
        aplicar individualmente em 8 sprites, são 8 passes. Prefira aplicar
        no <strong>layer master</strong> via{" "}
        <code>config.layer_transforms</code> — é UM passe sobre toda a tela
        composta.
      </AlertBox>
    </PageContainer>
  );
}
