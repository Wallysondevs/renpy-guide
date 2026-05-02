import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function LayeredImages() {
  return (
    <PageContainer
      title="Layered Images — sprites montados em camadas"
      subtitle="Construir um personagem como um Lego: base + roupas + expressões + acessórios. Reduz drasticamente o número de PNGs e permite combinatórias do tipo 'sakura uniforme corada com óculos'."
      difficulty="avancado"
      timeToRead="20 min"
      prompt="visual/layered-images"
    >
      <AlertBox type="info" title="Por que usar Layered Images">
        Imagine que a Sakura tem 5 expressões × 3 roupas × 2 estados de
        acessório = <strong>30 PNGs</strong>. Com Layered Images você
        exporta apenas <strong>5 + 3 + 2 = 10</strong> camadas e o Ren'Py
        monta a combinação dinamicamente. Resultado: pasta menor, atualizar
        uma roupa não reexporta tudo, e você pode até desbloquear roupas no
        meio da história.
      </AlertBox>

      <h2>1. Estrutura básica de um <code>layeredimage</code></h2>

      <CodeBlock
        language="python"
        title="game/sakura.rpy"
        code={`layeredimage sakura:

    # Camada SEMPRE visível (base do corpo)
    always:
        "images/sakura/base.png"

    # Grupo de roupas — escolhe UMA por vez
    group roupa:
        attribute uniforme default:
            "images/sakura/roupa_uniforme.png"
        attribute kimono:
            "images/sakura/roupa_kimono.png"
        attribute pijama:
            "images/sakura/roupa_pijama.png"

    # Grupo de expressões — escolhe UMA por vez
    group expressao:
        attribute neutra default:
            "images/sakura/expr_neutra.png"
        attribute feliz:
            "images/sakura/expr_feliz.png"
        attribute triste:
            "images/sakura/expr_triste.png"
        attribute corada:
            "images/sakura/expr_corada.png"

    # Acessório opcional — pode estar ON ou OFF
    attribute oculos:
        "images/sakura/oculos.png"`}
      />

      <h2>2. Como usar no script</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label cena_layered:
    scene bg cafe

    # Defaults (uniforme + neutra) — sem precisar listar
    show sakura
    s "Bem-vindo ao café!"

    # Trocar só a expressão — mantém uniforme
    show sakura feliz
    s "Pronto pra estudar?"

    # Mudar roupa
    show sakura kimono feliz
    s "Hoje é o festival! Tô usando kimono."

    # Adicionar acessório (atributo opcional)
    show sakura kimono feliz oculos
    s "Achei meus óculos novos!"

    # Tirar acessório usando '-'
    show sakura -oculos
    s "Ai, melhor sem óculos no festival."
    return`}
      />

      <CommandTable
        title="Estatutos de show com layered image"
        variations={[
          { cmd: "show sakura", desc: "Usa todos os defaults dos grupos.", output: "= sakura uniforme neutra" },
          { cmd: "show sakura feliz", desc: "Troca só atributos especificados; mantém demais.", output: "= sakura uniforme feliz" },
          { cmd: "show sakura kimono", desc: "Troca a roupa; mantém expressão atual.", output: "= sakura kimono <expressao_atual>" },
          { cmd: "show sakura oculos", desc: "Adiciona atributo opcional sem grupo.", output: "Sakura ganha óculos." },
          { cmd: "show sakura -oculos", desc: "Remove atributo opcional.", output: "Tira os óculos." },
          { cmd: "show sakura kimono feliz oculos", desc: "Combina explicitamente vários atributos.", output: "Roupa + expressão + acessório." },
        ]}
      />

      <h2>3. Atributos com condições (<code>if_any</code>, <code>if_all</code>, <code>if_not</code>)</h2>

      <p>
        Quer que uma camada apareça apenas quando combinada com outra? Use
        condições:
      </p>

      <CodeBlock
        language="python"
        title="game/sakura.rpy"
        code={`layeredimage sakura:
    always:
        "images/sakura/base.png"

    group roupa:
        attribute uniforme default:
            "images/sakura/roupa_uniforme.png"
        attribute kimono:
            "images/sakura/roupa_kimono.png"

    # Avental SÓ aparece se estiver com uniforme
    attribute avental:
        if_all "uniforme":
            "images/sakura/avental.png"

    # Tiara SÓ aparece se NÃO estiver de pijama
    attribute tiara:
        if_not "pijama":
            "images/sakura/tiara.png"

    # Sapato muda conforme a roupa
    group sapato auto:
        # 'auto' busca arquivos sapato_<roupa>.png automaticamente
        # → sapato_uniforme.png, sapato_kimono.png, sapato_pijama.png`}
      />

      <h2>4. <code>group ... auto</code> — descoberta automática</h2>

      <p>
        Quando você tem MUITOS arquivos seguindo um padrão, use{" "}
        <code>auto</code> e o Ren'Py descobre tudo sozinho:
      </p>

      <CodeBlock
        language="python"
        title="game/yuki.rpy"
        code={`layeredimage yuki:
    always:
        "images/yuki/base.png"

    # 'auto' procura arquivos no formato yuki_<grupo>_<atributo>.png
    group expressao auto

    # Equivale a:
    # - se houver yuki_expressao_neutra.png → atributo 'neutra'
    # - se houver yuki_expressao_braba.png → atributo 'braba'
    # - se houver yuki_expressao_rindo.png → atributo 'rindo'

    group acessorio auto`}
      />

      <OutputBlock label="árvore esperada para o yuki com 'auto'" type="info">
{`game/images/yuki/
├── base.png
├── yuki_expressao_neutra.png
├── yuki_expressao_braba.png
├── yuki_expressao_rindo.png
├── yuki_acessorio_chapeu.png
└── yuki_acessorio_brincos.png`}
      </OutputBlock>

      <h2>5. Integração com <code>Character(image=...)</code></h2>

      <p>
        Quando você define a personagem com <code>image="sakura"</code>, o
        Ren'Py detecta atributos passados ao falar:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`define s = Character("Sakura", color="#ffaacc", image="sakura")

label dialogo_atributo:
    scene bg cafe
    show sakura
    s "Olá!"

    # Trocar a expressão NA HORA da fala — sintaxe 'speaker atributo "fala"'
    s feliz "Que bom que você veio!"
    s corada "M-mas... eu não esperava você tão cedo..."
    s triste oculos "Ah, já vai embora?"
    return`}
      />

      <AlertBox type="success" title="Combinado com side images">
        Se você também tem <code>image side sakura</code>, a side image
        herda os atributos automaticamente. A Sakura aparece no ícone ao
        lado da fala com a MESMA expressão que está na cena. Veja a página{" "}
        <em>Side Images</em>.
      </AlertBox>

      <h2>6. Animar uma camada com ATL</h2>

      <p>
        Cada camada pode ter ATL próprio — útil para olhos piscando ou
        franja balançando:
      </p>

      <CodeBlock
        language="python"
        title="game/sakura.rpy"
        code={`layeredimage sakura:
    always:
        "images/sakura/base.png"

    # Olhos piscando (atributo automático sempre ativo)
    always:
        block:
            "images/sakura/olhos_abertos.png"
            pause 3.0
            "images/sakura/olhos_fechados.png"
            pause 0.12
            repeat

    group expressao:
        attribute neutra default:
            "images/sakura/boca_neutra.png"
        attribute feliz:
            "images/sakura/boca_feliz.png"
        attribute triste:
            "images/sakura/boca_triste.png"`}
      />

      <h2>7. Transição automática entre atributos</h2>

      <p>
        Para que a troca de expressão dissolva suavemente em vez de cortar,
        use <code>config.say_attribute_transition</code>:
      </p>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`# Crossfade de 0.2s entre atributos quando a personagem fala
define config.say_attribute_transition = Dissolve(0.2)

# Ou somente para mudanças entre o MESMO grupo:
define config.say_attribute_transition_layer = "master"`}
      />

      <h2>8. Exemplo completo — Sakura com 60 combinações</h2>

      <CodeBlock
        language="python"
        title="game/sakura_completa.rpy"
        code={`layeredimage sakura:
    # Base sempre visível
    always:
        "images/sakura/base.png"

    # ROUPAS (5 opções)
    group roupa:
        attribute uniforme default:
            "images/sakura/roupa_uniforme.png"
        attribute kimono:
            "images/sakura/roupa_kimono.png"
        attribute pijama:
            "images/sakura/roupa_pijama.png"
        attribute casual:
            "images/sakura/roupa_casual.png"
        attribute avental:
            "images/sakura/roupa_avental.png"

    # EXPRESSÕES (6 opções)
    group expressao:
        attribute neutra default:
            "images/sakura/expr_neutra.png"
        attribute feliz:
            "images/sakura/expr_feliz.png"
        attribute triste:
            "images/sakura/expr_triste.png"
        attribute corada:
            "images/sakura/expr_corada.png"
        attribute braba:
            "images/sakura/expr_braba.png"
        attribute surpresa:
            "images/sakura/expr_surpresa.png"

    # ACESSÓRIOS opcionais (combinam livremente)
    attribute oculos:
        "images/sakura/oculos.png"

    attribute laco:
        if_not "pijama":
            "images/sakura/laco.png"

    # Total possível: 5 × 6 × 2² = 120 combinações com apenas 15 PNGs!`}
      />

      <CodeBlock
        language="python"
        title="game/script.rpy — usando todas as combinações"
        code={`define s = Character("Sakura", color="#ffaacc", image="sakura")

label dia_completo:
    # Manhã — pijama
    scene bg quarto noite
    show sakura pijama neutra
    s "Mmm... que sono..."
    s pijama feliz "Bom dia!"

    # Vai pra escola
    scene bg escola
    show sakura uniforme neutra laco
    s feliz laco "Oi pessoal!"

    # Depois do colégio — café
    scene bg cafe
    show sakura uniforme avental
    s feliz "Bem-vindo ao Sakura Café!"

    # Festival à noite
    scene bg parque
    show sakura kimono surpresa oculos
    s surpresa "Que linda essa lua!"
    return`}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        user="dev"
        host="vn-studio"
        lines={[
          {
            comment: "Lint detecta atributos referenciados que não existem",
            cmd: "renpy.exe . lint",
            out: `game/script.rpy:128 'show sakura kimino' — atributo 'kimino' não existe. Você quis dizer 'kimono'?

Layered images:
   sakura: 5 roupas, 6 expressões, 2 acessórios = 120 combinações
   yuki:   3 roupas, 4 expressões = 12 combinações
Lint took 0.93s.`,
            outType: "warning",
          },
        ]}
      />

      <PracticeBox
        title="Crie um layered image para a Yuki"
        goal="Praticar a sintaxe de layeredimage com 1 always, 1 group de roupas e 1 group de expressões."
        steps={[
          "Crie game/yuki.rpy com 'layeredimage yuki:'.",
          "Adicione 'always:' apontando para images/yuki/base.png.",
          "Crie 'group roupa:' com 2 atributos (uniforme default, casual).",
          "Crie 'group expressao:' com 3 atributos (neutra default, braba, rindo).",
          "Em script.rpy use 'show yuki braba' e depois 'show yuki casual rindo'.",
          "Rode pelo Launcher e veja a Yuki montada dinamicamente.",
        ]}
        verify="Sem precisar de PNGs combinados (yuki_uniforme_braba.png), o Ren'Py monta as 6 combinações com apenas 6 arquivos."
      />

      <AlertBox type="danger" title="Pegadinha: alinhamento das camadas">
        Todas as camadas precisam ter <strong>o mesmo tamanho</strong>{" "}
        (largura × altura) e os elementos precisam estar nas mesmas
        coordenadas dentro do PNG. Se a boca está em (240, 380) na
        expressão neutra, ela tem que estar em (240, 380) em todas as
        outras expressões. Use sempre a opção "Export As" do Photoshop /
        GIMP / Krita mantendo o canvas inteiro.
      </AlertBox>
    </PageContainer>
  );
}
