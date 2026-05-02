import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function StatementEquivalents() {
  return (
    <PageContainer
      title="Statement Equivalents — fazendo tudo via Python"
      subtitle="Para cada statement do .rpy (scene, show, hide, say, pause, jump, call, with) existe um equivalente Python (renpy.scene, renpy.show, renpy.hide, renpy.say, renpy.pause, renpy.jump, renpy.call, renpy.with_statement). Quando vale a pena usar."
      difficulty="avancado"
      timeToRead="16 min"
      prompt="python/statement-equivalents"
    >
      <AlertBox type="info" title="Por que existir o equivalente Python?">
        Statements do <code>.rpy</code> são DECLARATIVOS — você escreve no
        roteiro e a engine executa em ordem. Mas e se a Sakura precisa
        mostrar 1 sprite para cada cliente que entrou no café (loop
        dinâmico)? Ou gerar um menu com 30 opções vindas de um JSON?
        Statements não fazem isso. Os equivalentes Python sim.
      </AlertBox>

      <h2>1. A tabela mestra de equivalências</h2>
      <p>
        A documentação oficial espalha esses nomes em 5 páginas. Aqui está
        o mapeamento direto:
      </p>

      <CommandTable
        title="Statement .rpy → função Python"
        variations={[
          {
            cmd: "scene bg cafe",
            desc: "Limpa a layer master e mostra um background.",
            output: "renpy.scene(layer='master')\nrenpy.show('bg cafe')",
          },
          {
            cmd: "show sakura happy at right",
            desc: "Coloca um sprite na tela com transform.",
            output: "renpy.show('sakura happy', at_list=[right])",
          },
          {
            cmd: "hide sakura",
            desc: "Remove o sprite com tag 'sakura'.",
            output: "renpy.hide('sakura')",
          },
          {
            cmd: 's "Bem-vindo ao café!"',
            desc: "Faz o personagem 's' falar.",
            output: 'renpy.say(s, "Bem-vindo ao café!")',
          },
          {
            cmd: "pause 1.5",
            desc: "Pausa 1,5s ou aguarda clique.",
            output: "renpy.pause(1.5)",
          },
          {
            cmd: "jump rota_yuki",
            desc: "Salto incondicional para um label.",
            output: "renpy.jump('rota_yuki')",
          },
          {
            cmd: "call cena_extra",
            desc: "Chama um label como sub-rotina.",
            output: "renpy.call('cena_extra')",
          },
          {
            cmd: "with dissolve",
            desc: "Aplica transição à última mudança visual.",
            output: "renpy.with_statement(dissolve)",
          },
          {
            cmd: 'play music "theme.ogg"',
            desc: "Toca música no canal 'music'.",
            output: 'renpy.music.play("theme.ogg", channel="music")',
          },
          {
            cmd: "stop music fadeout 2.0",
            desc: "Para o canal 'music' com fade-out.",
            output: 'renpy.music.stop(channel="music", fadeout=2.0)',
          },
          {
            cmd: "$ x = 5",
            desc: "Atribuição direta — já É Python.",
            output: "x = 5  (dentro de python:)",
          },
          {
            cmd: "menu:",
            desc: "Mostra escolhas. Equivalente Python aceita lista dinâmica.",
            output: 'renpy.display_menu([("Café",1),("Chá",2)])',
          },
        ]}
      />

      <h2>2. Quando usar Python em vez de statements</h2>
      <p>
        Use o equivalente Python sempre que precisar de <strong>lógica
        dinâmica</strong>: loops, condicionais complexas, geração a partir
        de dados externos. Para uma cena estática (90% do roteiro),
        statements são MELHORES — mais legíveis e o lint/Director
        entendem.
      </p>

      <CodeBlock
        title="game/script.rpy — caso onde Python ganha"
        language="python"
        code={`# CENÁRIO: 5 clientes entram no café um por um.
# Lista vinda de um JSON de configuração da rota.

default clientes_da_manha = [
    {"sprite": "cliente_a", "fala": "Bom dia! Café preto, por favor."},
    {"sprite": "cliente_b", "fala": "Vou querer o especial da casa."},
    {"sprite": "cliente_c", "fala": "Tem chá de jasmim hoje?"},
    {"sprite": "cliente_d", "fala": "Só um copo d'água, obrigado."},
    {"sprite": "cliente_e", "fala": "Cappuccino com canela!"},
]

label cena_movimento_cafe:
    scene bg cafe with fade

    python:
        for c in clientes_da_manha:
            renpy.show(c["sprite"], at_list=[right])
            renpy.with_statement(dissolve)
            renpy.say(narrator, c["fala"])
            renpy.hide(c["sprite"])
            renpy.with_statement(dissolve)

    s "Que manhã movimentada..."
    return
`}
      />

      <AlertBox type="warning" title="Python dentro de label exige bloco python:">
        Você NÃO pode escrever <code>renpy.show(...)</code> direto no
        nível do label — só dentro de <code>python:</code> ou <code>$</code>.
        Use <code>$</code> para uma única linha e <code>python:</code> para
        bloco inteiro.
      </AlertBox>

      <h2>3. Cuidados com <code>renpy.show()</code></h2>
      <p>
        A assinatura completa é mais rica que o statement:
      </p>

      <CodeBlock
        title="game/lib/show_helper.rpy"
        language="python"
        code={`# Assinatura: renpy.show(name, at_list=[], layer='master', what=None,
#                       zorder=0, tag=None, behind=[])

# Equivalente a: show sakura happy at center, right behind yuki
$ renpy.show("sakura happy",
             at_list=[center, right],
             behind=["yuki"])

# Trocar SÓ o sprite, mantendo o transform vivo (preserve transform)
$ renpy.show("sakura happy", what=Image("images/sakura_triste.png"))

# Mostrar em layer custom (ex: layer 'overlay' do HUD)
$ renpy.show("hud_temperatura", layer="overlay")
`}
      />

      <h2>4. Equivalentes para áudio</h2>

      <CommandTable
        title="Áudio: statement vs Python"
        variations={[
          {
            cmd: 'play music "x.ogg" fadein 1.0',
            desc: "Música de fundo com fade-in.",
            output: 'renpy.music.play("x.ogg", fadein=1.0)',
          },
          {
            cmd: 'play sound "ding.ogg"',
            desc: "Efeito sonoro one-shot.",
            output: 'renpy.sound.play("ding.ogg")',
          },
          {
            cmd: 'play voice "v01.ogg"',
            desc: "Linha de voz dublada.",
            output: 'renpy.music.play("v01.ogg", channel="voice")',
          },
          {
            cmd: "queue music ['a.ogg', 'b.ogg']",
            desc: "Empilha próximas músicas.",
            output: 'renpy.music.queue(["a.ogg", "b.ogg"])',
          },
          {
            cmd: "stop music",
            desc: "Para imediatamente o canal music.",
            output: 'renpy.music.stop(channel="music")',
          },
          {
            cmd: "(N/A)",
            desc: "Volume do canal em runtime.",
            output: 'renpy.music.set_volume(0.4, channel="music")',
          },
        ]}
      />

      <h2>5. Gerando um menu dinâmico (impossível com statement)</h2>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`# JSON de receitas do café — pode vir de arquivo via renpy.file()
default cardapio = [
    ("Espresso", "espresso", 8),
    ("Cappuccino", "cappuccino", 12),
    ("Matcha Latte", "matcha", 15),
    ("Café com leite", "cafe_leite", 10),
    ("Frappuccino especial", "frappe", 18),
]

label pedir:
    show sakura happy at right
    s "O que você vai querer hoje?"

    python:
        opcoes = [(f"{nome} (R$ {preco})", chave) for nome, chave, preco in cardapio]
        opcoes.append(("Só observar...", None))
        escolha = renpy.display_menu(opcoes)

    if escolha is None:
        s "Tudo bem! Fique à vontade."
    else:
        $ renpy.say(s, f"Saiu um {escolha}!")
        $ pedidos_feitos.append(escolha)
    return
`}
      />

      <h2>6. <code>renpy.call()</code> com argumentos</h2>
      <p>
        Diferente do statement <code>call</code>, a versão Python aceita
        argumentos posicionais — útil para sub-rotinas reutilizáveis tipo
        "servir bebida X com nível de espuma Y".
      </p>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`label servir_bebida(bebida="café", espuma=False):
    show sakura preparando at center
    s "Preparando seu [bebida]..."
    if espuma:
        s "Capricho na espuma como você gosta."
    show sakura happy
    s "Aqui está! Bom apetite."
    return

label cliente_vip:
    $ renpy.call("servir_bebida", bebida="cappuccino", espuma=True)
    "..." # ao terminar, retorna pra cá
    return
`}
      />

      <h2>7. Verificando o estado da cena via Python</h2>

      <CommandTable
        title="Inspeção do estado em runtime"
        variations={[
          {
            cmd: "renpy.showing(name, layer='master')",
            desc: "True se o sprite está sendo exibido.",
            output: 'if renpy.showing("sakura"): ...',
          },
          {
            cmd: "renpy.get_showing_tags(layer='master')",
            desc: "Set com todas as tags exibidas no layer.",
            output: '{"bg", "sakura", "yuki"}',
          },
          {
            cmd: "renpy.get_image_load_log()",
            desc: "Histórico das últimas imagens carregadas (debug).",
            output: "[(time, name, preload), ...]",
          },
          {
            cmd: "renpy.get_say_attributes()",
            desc: "Atributos da última fala (sakura @happy → ('happy',)).",
            output: '("happy",)',
          },
          {
            cmd: "renpy.last_interact_type()",
            desc: "Tipo da última interação (say, menu, etc).",
            output: '"say"',
          },
          {
            cmd: "renpy.context().current",
            desc: "Label atualmente sendo executado.",
            output: '"cena_movimento_cafe.0"',
          },
        ]}
      />

      <Terminal
        path="~/sakura-cafe"
        lines={[
          {
            comment: "Console interativo (Shift+O em jogo) para testar",
            cmd: 'renpy.show("sakura happy", at_list=[center])',
            out: "(sprite aparece no centro)",
            outType: "success",
          },
          {
            comment: "Inspeciona o que está sendo exibido",
            cmd: "renpy.get_showing_tags()",
            out: "{'bg', 'sakura'}",
            outType: "info",
          },
          {
            comment: "Erro típico ao chamar fora do contexto",
            cmd: "renpy.show('sakura happy')  # em init python:",
            out: "Exception: Cannot call renpy.show outside an interaction.",
            outType: "error",
          },
        ]}
      />

      <h2>8. Anti-padrões comuns</h2>
      <p>
        Não substitua statements por Python apenas para "parecer mais
        programador". Reduz legibilidade, quebra integração com Director
        e atrapalha tradução. Use Python <strong>quando há uma razão
        técnica</strong>:
      </p>

      <OutputBlock label="quando usar Python equivalent" type="info">
{`✓ Loop sobre lista variável (clientes, inventário, NPCs)
✓ Cena montada a partir de JSON/CSV
✓ Sub-rotina parametrizada (servir_bebida(tipo, espuma))
✓ Skipping/replay programático em testes automatizados
✓ Helper que precisa devolver valor (renpy.input)

✗ Cena 100% estática que cabe em statements
✗ "Para parecer mais código" sem ganho funcional
✗ Quando o Director vai precisar editar visualmente`}
      </OutputBlock>

      <PracticeBox
        title="Café da manhã com 3 clientes via loop"
        goal="Mostrar 3 sprites em sequência usando renpy.show + renpy.say em loop, ao invés de copiar/colar 3 vezes."
        steps={[
          "Em script.rpy crie default clientes = [('cliente_a', 'Café!'), ('cliente_b', 'Chá.'), ('cliente_c', 'Água.')]",
          "Crie label movimento_manha:",
          "Use scene bg cafe with fade",
          "Abra um bloco python: e itere com for sprite, fala in clientes:",
          "Dentro do for: renpy.show(sprite, at_list=[right]); renpy.with_statement(dissolve); renpy.say(narrator, fala); renpy.hide(sprite)",
          "Após o loop, return",
        ]}
        verify="Os 3 sprites aparecem um por um, cada um fala sua linha, e somem antes do próximo entrar."
      >
        <CodeBlock
          title="game/script.rpy (gabarito)"
          language="python"
          code={`default clientes = [
    ("cliente_a", "Café preto, sem açúcar."),
    ("cliente_b", "Vou querer o matcha latte."),
    ("cliente_c", "Tem cookie de chocolate?"),
]

label movimento_manha:
    scene bg cafe with fade
    python:
        for sprite, fala in clientes:
            renpy.show(sprite, at_list=[right])
            renpy.with_statement(dissolve)
            renpy.say(narrator, fala)
            renpy.hide(sprite)
            renpy.with_statement(dissolve)
    s "Manhã movimentada hoje."
    return
`}
        />
      </PracticeBox>

      <AlertBox type="success" title="Próximos passos">
        Agora que você sabe como invocar a engine via Python, está pronto
        para criar <strong>Creator-Defined Displayables</strong> (CDD) e{" "}
        <strong>Creator-Defined Statements</strong> (CDS) — extensões
        REAIS da linguagem.
      </AlertBox>
    </PageContainer>
  );
}
