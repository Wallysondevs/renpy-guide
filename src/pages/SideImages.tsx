import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function SideImages() {
  return (
    <PageContainer
      title="Side Images — retrato lateral durante o diálogo"
      subtitle="O 'icon-set' que aparece no canto inferior esquerdo do textbox enquanto a personagem fala — usado para mostrar a expressão atual sem ocupar a cena com o sprite inteiro."
      difficulty="intermediario"
      timeToRead="14 min"
      prompt="interface/side-images"
    >
      <AlertBox type="info" title="Por que existem side images?">
        Quando o foco da cena é um sprite, mas duas personagens estão falando,
        usar Side Image deixa claro <em>quem</em> está dizendo cada linha — sem
        precisar mostrar o segundo sprite no centro. É a marca registrada das
        VNs japonesas modernas (Steins;Gate, Persona 5, FATE).
      </AlertBox>

      <h2>1. Convenção de nomes</h2>
      <p>
        O Ren'Py procura automaticamente uma imagem chamada{" "}
        <code>side &lt;nome&gt; &lt;atributos&gt;</code> sempre que uma fala
        acontece, baseando-se no atributo do personagem. Para isso o{" "}
        <code>Character</code> precisa ter <code>image="nome"</code> declarado.
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy — declaração com side image"
        code={`## O parâmetro image="sakura" diz ao Ren'Py para procurar
## "side sakura <atributo>" sempre que ela falar.
define s = Character("Sakura", color="#ff86b0", image="sakura")
define y = Character("Yuki",   color="#7fc8ff", image="yuki")
define a = Character("Akira",  color="#a5d96a", image="akira")
`}
      />

      <CodeBlock
        language="python"
        title="game/images.rpy — registrando as side images"
        code={`## Side images de Sakura (4 expressões)
image side sakura sorrindo = "images/side/sakura_sorrindo.png"
image side sakura triste   = "images/side/sakura_triste.png"
image side sakura surpresa = "images/side/sakura_surpresa.png"
image side sakura corada   = "images/side/sakura_corada.png"

## Side images de Yuki
image side yuki neutra  = "images/side/yuki_neutra.png"
image side yuki feliz   = "images/side/yuki_feliz.png"
image side yuki brava   = "images/side/yuki_brava.png"

## Side images de Akira
image side akira normal = "images/side/akira_normal.png"
image side akira rindo  = "images/side/akira_rindo.png"
`}
      />

      <h2>2. Como o Ren'Py escolhe a side image</h2>
      <p>
        Toda vez que <code>show sakura sorrindo</code> roda, o Ren'Py atualiza
        os atributos atuais de Sakura para <code>["sorrindo"]</code>. Quando ela
        fala em seguida, o motor procura{" "}
        <code>side sakura sorrindo</code> e exibe automaticamente. Não precisa
        mais nada no script.
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy — em uso"
        code={`label cap1_cafe:
    scene bg cafe_dia with fade

    show sakura sorrindo at center
    s "Bem-vindo ao Sakura Café! Sente-se onde quiser."
    ## ↳ aparece "side sakura sorrindo" no canto do textbox

    show sakura corada
    s "...d-desculpa, eu falei muito rápido?"
    ## ↳ a side image trocou junto, sem precisar declarar

    hide sakura
    show yuki neutra at right
    y "Eu já estou pronta para pedir."
    ## ↳ agora aparece "side yuki neutra"`}
      />

      <OutputBlock label="resolução de imagem (mecanismo interno)" type="info">
{`fala chamada    : s "Bem-vindo!"
character image : "sakura"
atributo atual  : "sorrindo"   (último show sakura X)
busca           : side sakura sorrindo
fallback 1      : side sakura
fallback 2      : (nada — sem side image)`}
      </OutputBlock>

      <h2>3. Tamanho e posicionamento recomendados</h2>
      <CommandTable
        title="Especificações típicas para 1080p"
        variations={[
          { cmd: "Resolução", desc: "Largura x altura da side image.", output: "350×420 px (cabeça e ombros)" },
          { cmd: "Formato", desc: "Recomendado.", output: "PNG-32 com canal alpha" },
          { cmd: "Posição", desc: "Onde aparece no textbox padrão.", output: "xalign 0.0, yalign 1.0 (canto inferior esquerdo)" },
          { cmd: "Margem do nome", desc: "gui.name_xpos precisa abrir espaço.", output: "name_xpos 380 quando há side image" },
          { cmd: "Margem do diálogo", desc: "gui.dialogue_xpos abre espaço também.", output: "dialogue_xpos 402" },
        ]}
      />

      <h2>4. Integrando com Layered Images</h2>
      <p>
        Quando você usa <code>layeredimage</code> (ver página{" "}
        <em>LayeredImages</em>), pode aproveitar as mesmas camadas para a side
        image — basta criar um <code>layeredimage side sakura</code>:
      </p>

      <CodeBlock
        language="python"
        title="game/images.rpy — side layered (reaproveita expressões)"
        code={`layeredimage side sakura:

    always:
        "images/side/sakura_base.png"

    group expression auto:
        attribute sorrindo default:
            "images/side/exp_sorrindo.png"
        attribute corada:
            "images/side/exp_corada.png"
        attribute triste:
            "images/side/exp_triste.png"

    group acessorio:
        attribute oculos:
            "images/side/acc_oculos.png"
`}
      />

      <h2>5. Customizando a screen 'say' para acomodar a side image</h2>
      <CodeBlock
        language="python"
        title="game/screens.rpy — screen say com SideImage()"
        code={`screen say(who, what):
    style_prefix "say"

    window:
        id "window"

        ## Side image desenhada DENTRO da window do textbox.
        if not renpy.variant("small"):
            add SideImage() xalign 0.0 yalign 1.0 xoffset -20

        if who is not None:
            window:
                id "namebox"
                style "namebox"
                text who id "who"

        text what id "what"
`}
      />

      <h2>6. Trocando a side image via tag</h2>
      <p>
        Em momentos especiais (closeup, brinde, etc.), você pode forçar uma
        side image diferente sem trocar o sprite principal — útil para imitar
        um contracampo:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy — tag inline para sobrescrever"
        code={`label cena_brinde:
    show sakura sorrindo at left
    show yuki feliz   at right

    s "Pelo nosso primeiro mês juntos!"
    y "Pelo Sakura Café!"

    ## Closeup só nos olhos da Sakura, mas ela continua no sprite.
    s @ corada surpresa "...obrigada por estar aqui."
    ## ↳ '@ corada surpresa' altera atributos APENAS para esta linha`}
      />

      <PracticeBox
        title="Adicionar side image para a Sakura em 4 expressões"
        goal="A side image trocar automaticamente quando você usar 'show sakura X'."
        steps={[
          "Coloque 4 PNGs de retrato (350×420) em game/images/side/.",
          "Crie game/images.rpy com as 4 declarações 'image side sakura ...'.",
          "No script.rpy, troque o define de Sakura para incluir image=\"sakura\".",
          "Adicione 'show sakura sorrindo' antes da 1ª fala da Sakura.",
          "Rode renpy.exe . e verifique no canto inferior esquerdo.",
        ]}
      >
        <CodeBlock
          language="python"
          title="game/images.rpy"
          code={`image side sakura sorrindo = "images/side/sakura_sorrindo.png"
image side sakura corada   = "images/side/sakura_corada.png"
image side sakura triste   = "images/side/sakura_triste.png"
image side sakura surpresa = "images/side/sakura_surpresa.png"`}
        />
      </PracticeBox>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          { comment: "lint detecta side images sem fallback", cmd: "renpy.exe . lint", out: `Lint is checking sakura-cafe...
images.rpy: warning: 'side sakura' has 4 attributes but no plain 'side sakura' fallback.
Lint took 0.4 seconds.`, outType: "warning" },
          { comment: "rodar e testar", cmd: "renpy.exe .", out: "(janela do jogo abre)", outType: "success" },
        ]}
      />

      <AlertBox type="warning" title="Esqueci do image= no Character()">
        Esse é o erro mais comum: declarou as imagens <code>side sakura X</code>{" "}
        mas a side image nunca aparece. Verifique se o{" "}
        <code>Character("Sakura", image="sakura")</code> tem o parâmetro{" "}
        <code>image</code>. Sem ele, o Ren'Py não tem como fazer a ligação.
      </AlertBox>

      <AlertBox type="success" title="Otimização: use WebP para side images">
        Side images aparecem em quase toda fala — somam centenas de transições.
        Convertê-las para <code>.webp</code> reduz o tamanho final do build em
        30-60% sem perda perceptível. O Ren'Py 8 lê WebP nativamente.
      </AlertBox>
    </PageContainer>
  );
}
