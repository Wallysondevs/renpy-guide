import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Imagens() {
  return (
    <PageContainer
      title="Imagens — sprites, backgrounds e nomes mágicos"
      subtitle="Como o Ren'Py descobre, nomeia e desenha sprites de personagens e cenários. Convenção de nomes, formatos suportados, organização da pasta images/ e cache de memória."
      difficulty="iniciante"
      timeToRead="14 min"
      prompt="visual/imagens"
    >
      <AlertBox type="info" title="O que é uma 'imagem' no Ren'Py">
        Toda figura que aparece na tela — fundo, personagem, item, ícone — é
        uma <strong>imagem</strong>. O Ren'Py não desenha pixel a pixel: ele
        recebe um arquivo PNG/JPG/WebP, dá um <em>nome</em> a ele e depois
        você usa esse nome no script. É como apelidar fotos do seu álbum.
      </AlertBox>

      <h2>1. A pasta <code>game/images/</code></h2>
      <p>
        Quando o Launcher cria um projeto novo, ele já vem com uma pasta{" "}
        <code>game/images/</code> vazia. Tudo que você jogar lá dentro vira
        uma imagem disponível — desde que o nome do arquivo siga a
        convenção. Vamos olhar a estrutura típica do projeto Sakura Café:
      </p>

      <OutputBlock label="árvore — game/images/ do projeto Sakura Café" type="info">
{`game/images/
├── bg/
│   ├── bg cafe.png            ← fundo do café
│   ├── bg escola.png          ← sala de aula
│   ├── bg parque.png          ← parque ao entardecer
│   └── bg quarto noite.png    ← quarto da Sakura à noite
├── sakura/
│   ├── sakura neutra.png
│   ├── sakura feliz.png
│   ├── sakura triste.png
│   ├── sakura corada.png
│   └── sakura uniforme.png    ← variação de roupa
├── yuki/
│   ├── yuki neutra.png
│   ├── yuki braba.png
│   └── yuki rindo.png
├── akira/
│   ├── akira misterioso.png
│   └── akira sorrindo.png
└── itens/
    ├── carta.png
    └── chave dourada.png`}
      </OutputBlock>

      <AlertBox type="warning" title="O nome do arquivo VIRA o nome no script">
        Se o arquivo se chama <code>sakura feliz.png</code>, no script você
        usa <code>show sakura feliz</code>. Espaço no nome do arquivo
        equivale a um <em>atributo</em>. Use letras minúsculas, sem acentos,
        sem caractere especial. Underscore (<code>_</code>) também é tratado
        como espaço pelo Ren'Py 8.x.
      </AlertBox>

      <h2>2. Declaração explícita com <code>image</code></h2>
      <p>
        O auto-discovery acima funciona, mas para ter controle total —
        principalmente para backgrounds e personagens com lógica especial —
        você declara as imagens explicitamente em <code>script.rpy</code>{" "}
        (ou em um arquivo dedicado <code>images.rpy</code>):
      </p>

      <CodeBlock
        language="python"
        title="game/images.rpy"
        code={`# ─────────────────────────────────────────────
# Backgrounds
# ─────────────────────────────────────────────
image bg cafe          = "images/bg/bg cafe.png"
image bg escola        = "images/bg/bg escola.png"
image bg parque        = "images/bg/bg parque.png"
image bg quarto noite  = "images/bg/bg quarto noite.png"

# ─────────────────────────────────────────────
# Sakura — 5 expressões
# ─────────────────────────────────────────────
image sakura neutra    = "images/sakura/sakura neutra.png"
image sakura feliz     = "images/sakura/sakura feliz.png"
image sakura triste    = "images/sakura/sakura triste.png"
image sakura corada    = "images/sakura/sakura corada.png"
image sakura uniforme  = "images/sakura/sakura uniforme.png"

# ─────────────────────────────────────────────
# Yuki — 3 expressões
# ─────────────────────────────────────────────
image yuki neutra = "images/yuki/yuki neutra.png"
image yuki braba  = "images/yuki/yuki braba.png"
image yuki rindo  = "images/yuki/yuki rindo.png"

# ─────────────────────────────────────────────
# Akira — 2 expressões
# ─────────────────────────────────────────────
image akira misterioso = "images/akira/akira misterioso.png"
image akira sorrindo   = "images/akira/akira sorrindo.png"

# ─────────────────────────────────────────────
# Itens (mostrados como overlay no inventário)
# ─────────────────────────────────────────────
image item carta        = "images/itens/carta.png"
image item chave dourada = "images/itens/chave dourada.png"`}
      />

      <p>
        Repare no padrão <code>&lt;tag&gt; &lt;atributo1&gt; &lt;atributo2&gt;</code>.
        A primeira palavra é a <strong>tag</strong> (identidade da imagem —
        é o que o Ren'Py usa para decidir se deve substituir um sprite ou
        adicionar um novo). As demais são atributos.
      </p>

      <h2>3. Convenção de nomes — tag, atributo e substituição</h2>

      <CommandTable
        title="Como o Ren'Py interpreta o nome da imagem"
        variations={[
          {
            cmd: "image bg cafe",
            desc: "Tag = 'bg', atributo = 'cafe'. Backgrounds usam tag única 'bg'.",
            output: "scene bg cafe → troca o background atual",
          },
          {
            cmd: "image sakura feliz",
            desc: "Tag = 'sakura'. Mostrar 'sakura triste' depois SUBSTITUI a anterior.",
            output: "show sakura feliz; show sakura triste → 1 sprite na tela.",
          },
          {
            cmd: "image yuki braba",
            desc: "Tag = 'yuki'. Diferente de 'sakura' — coexistem na tela.",
            output: "show sakura feliz at left; show yuki braba at right → 2 sprites.",
          },
          {
            cmd: "image sakura uniforme corada",
            desc: "Multi-atributo. Combina 'uniforme' (roupa) + 'corada' (expressão).",
            output: "show sakura uniforme corada → busca o arquivo combinando os 2.",
          },
          {
            cmd: "image side sakura feliz",
            desc: "Prefixo 'side' = side image (ícone ao lado da fala).",
            output: "Mostrada automaticamente quando Sakura fala.",
          },
        ]}
      />

      <h2>4. Formatos de arquivo suportados</h2>

      <CommandTable
        title="Formatos aceitos pelo Ren'Py 8.x"
        variations={[
          {
            cmd: ".png",
            desc: "Padrão para sprites. Suporta transparência alpha.",
            output: "Use SEMPRE em personagens — fundo precisa ser transparente.",
          },
          {
            cmd: ".jpg / .jpeg",
            desc: "Sem transparência, mas arquivo menor. Bom para backgrounds.",
            output: "Use em fundos sólidos sem alpha (céu, paredes).",
          },
          {
            cmd: ".webp",
            desc: "Compressão moderna, suporta alpha. Recomendado em builds Web.",
            output: "Equilíbrio: 30-40% menor que PNG sem perder alpha.",
          },
          {
            cmd: ".avif",
            desc: "Formato novo, suportado a partir do Ren'Py 8.2.",
            output: "Use só se o build alvo for desktop atualizado.",
          },
          {
            cmd: ".gif",
            desc: "Aceito mas SEM animação — só primeiro frame. Para animar use ATL.",
            output: "Para sprite animado, prefira sequência PNG + ATL.",
          },
        ]}
      />

      <AlertBox type="success" title="Tamanhos recomendados">
        Defina a resolução do projeto em <code>options.rpy</code> (padrão{" "}
        <code>1920x1080</code>). <strong>Backgrounds</strong>: exatamente o
        tamanho da tela (1920x1080).{" "}
        <strong>Sprites de personagem (corpo inteiro)</strong>: altura igual
        à da tela, largura ~600-900px.{" "}
        <strong>Side images (busto)</strong>: 300-400px de lado.{" "}
        <strong>Itens / ícones</strong>: 64-256px. Sempre exporte com fundo
        transparente em PNG.
      </AlertBox>

      <h2>5. Onde uso essas imagens? — preview com <code>scene</code> e <code>show</code></h2>

      <CodeBlock
        language="python"
        title="game/script.rpy — uso básico das imagens"
        code={`label start:
    # Troca o background — só pode haver 1 'bg' por vez
    scene bg cafe
    with fade

    # Mostra a Sakura no centro com expressão neutra
    show sakura neutra
    with dissolve

    s "Bem-vindo ao Sakura Café! É a primeira vez aqui?"

    # Mesma tag 'sakura' → SUBSTITUI a expressão
    show sakura feliz
    s "Que bom que você veio! Vou te mostrar o cardápio."

    # Outra tag 'akira' → soma na cena
    show akira misterioso at right
    a "Hum... interessante."

    # Esconde só a Akira
    hide akira
    with dissolve

    # Troca cenário — sprites NÃO precisam ser escondidos antes
    scene bg parque
    show sakura uniforme
    with fade

    s "Adoro o parque ao entardecer..."
    return`}
      />

      <h2>6. Cache, memória e <code>image_cache_size</code></h2>
      <p>
        O Ren'Py mantém imagens descomprimidas em RAM para não ler do disco
        toda vez. Em projetos grandes (50+ sprites), o cache pode crescer.
        Você ajusta em <code>options.rpy</code>:
      </p>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`# Tamanho do cache em MB (default 64). Aumente p/ VNs com muitos sprites.
define config.image_cache_size = 128

# Pré-carrega imagens prováveis para evitar engasgos
define config.predict_statements = 2`}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        user="dev"
        host="vn-studio"
        lines={[
          {
            comment: "Listar imagens detectadas pelo Ren'Py (modo console)",
            cmd: "renpy.exe . lint",
            out: `Lint statistics:
The game contains 1 ending.
Total Words: 4218
Total Dialogue blocks: 312
Total Menus: 12

Statistics:
   Image files: 24
   Sound files: 8
   Music files: 5
Lint took 0.91 seconds.`,
            outType: "success",
          },
        ]}
      />

      <h2>7. Solid, Frame e imagens dinâmicas</h2>
      <p>
        Nem toda imagem precisa ser um arquivo. O Ren'Py oferece geradores:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`# Cor sólida — útil para tela preta de transição
image bg preto = Solid("#000")
image bg rosa  = Solid("#ffaacc")

# Frame — imagem com bordas que escalam (para textboxes custom)
image moldura = Frame("images/ui/moldura.png", 12, 12)

# Texto como imagem (raro, mas existe)
image titulo = Text("Sakura Café", size=72, color="#fff")

label intro:
    scene bg preto
    with fade
    show titulo at truecenter
    pause 2.0
    hide titulo
    scene bg cafe
    with dissolve
    return`}
      />

      <PracticeBox
        title="Adicione 3 expressões para a Sakura"
        goal="Importar 3 PNGs de personagem, declarar as imagens e exibir cada uma com diálogo."
        steps={[
          "Crie a pasta game/images/sakura/ se ainda não existir.",
          "Coloque 3 arquivos PNG (qualquer placeholder serve): sakura neutra.png, sakura feliz.png, sakura triste.png.",
          "Em game/script.rpy adicione as 3 declarações 'image sakura ... = ...'.",
          "Dentro de 'label start:' use 'show sakura neutra', uma fala, depois 'show sakura feliz' com outra fala.",
          "Rode pelo Launcher (botão Launch Project) e veja a substituição do sprite.",
        ]}
        verify="O sprite da Sakura deve trocar visualmente entre as falas, sem você precisar 'hide' explícito."
      >
        <CodeBlock
          language="python"
          title="game/script.rpy (trecho mínimo)"
          code={`image sakura neutra = "images/sakura/sakura neutra.png"
image sakura feliz  = "images/sakura/sakura feliz.png"
image sakura triste = "images/sakura/sakura triste.png"

define s = Character("Sakura", color="#ffaacc")

label start:
    scene bg cafe
    show sakura neutra
    s "Bem-vindo!"
    show sakura feliz
    s "Que alegria te ver!"
    show sakura triste
    s "...mas tenho algo a confessar."
    return`}
        />
      </PracticeBox>

      <AlertBox type="danger" title="Pegadinha: nomes com acento ou maiúsculas">
        Não use <code>Sakura Feliz.png</code> nem <code>sakura_feliz.png</code>
        misturando com <code>sakura feliz.png</code>. Em Windows o sistema é
        case-insensitive, mas em Linux (build do servidor de itch.io ou
        Android) é case-SENSITIVE — sua VN vai quebrar com{" "}
        <code>ImageNotFoundError</code>. Padrão de ouro: tudo minúsculo,
        sem acento, separando atributos por espaço.
      </AlertBox>
    </PageContainer>
  );
}
