import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Dialogos() {
  return (
    <PageContainer
      title="Diálogos & tags de texto"
      subtitle="Linhas de fala, narração, extend, pausas {w}, slow text {cps}, formatação {b}/{i}/{color}/{size}, interpolação de variáveis [nome] e todas as tags inline que você vai usar todo dia."
      difficulty="iniciante"
      timeToRead="14 min"
      prompt="linguagem/dialogos"
    >
      <AlertBox type="info" title="Diálogo é o coração da VN">
        Em uma Visual Novel, 90% do tempo o jogador está lendo. Dominar
        as tags de texto e o ritmo das pausas é o que diferencia uma
        cena que <em>respira</em> de uma cena que <em>despeja</em> texto.
      </AlertBox>

      <h2>1. As três formas de uma linha de texto</h2>
      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`define s = Character("Sakura", color="#ffaacc")

label exemplos:
    # 1) Narração — string solta, sem variável de personagem
    "O sol da tarde batia nas mesas do café."

    # 2) Diálogo — variável (Character) + string
    s "Aceita um café gelado?"

    # 3) Diálogo com atributo de imagem (se Character tem image=)
    s happy "Está fresco, recém-feito!"
    return
`}
      />

      <h2>2. extend — continuar a fala anterior</h2>
      <p>
        <code>extend</code> faz a próxima fala se juntar à anterior na
        mesma "caixa", como se o personagem continuasse falando após
        uma reação. Útil para mudar emoção sem fechar o textbox.
      </p>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`label cena:
    s happy "Bom dia!"
    s sad extend " ...hoje o forno quebrou."
    # Aparece como UMA fala única no histórico:
    # "Bom dia! ...hoje o forno quebrou."
    # Mas a expressão troca de happy para sad no meio.
    return
`}
      />

      <h2>3. Pausas e ritmo — {`{w}`}, {`{p}`}, {`{nw}`}</h2>
      <CommandTable
        title="Tags de tempo dentro de uma fala"
        variations={[
          { cmd: "{w}", desc: "Pausa esperando clique. Continua a MESMA fala.", output: '"Eu... {w}preciso te contar uma coisa."' },
          { cmd: "{w=2.0}", desc: "Pausa por 2 segundos automaticamente.", output: '"Espera...{w=2.0} ouviu isso?"' },
          { cmd: "{p}", desc: "Quebra de PARÁGRAFO + espera clique.", output: 'Texto longo dividido em blocos.' },
          { cmd: "{p=1.0}", desc: "Quebra + pausa 1s automática.", output: 'Bom para narração descritiva.' },
          { cmd: "{nw}", desc: "No-wait: avança para a próxima linha SEM esperar clique.", output: 's "Tchau!"{nw}' },
          { cmd: "{fast}", desc: "Termina a animação de digitação imediatamente daqui em diante.", output: 'Útil em ressalva: "Sério?{fast}"' },
        ]}
      />

      <CodeBlock
        title="game/script.rpy — usando o ritmo a favor"
        language="python"
        code={`label confissao:
    s "Eu... {w}preciso te dizer uma coisa."
    s "{w=1.0}Eu... {w=0.6}gosto de você."
    s sad "Mas se isso atrapalhar nossa amizade,{w} eu finjo que nunca falei."

    # Diálogo automático no fim — sem clique
    s "Tchau!"{nw}
    hide sakura with dissolve
    "Ela saiu correndo da padaria."
    return
`}
      />

      <h2>4. Slow text — {`{cps}`}</h2>
      <p>
        <code>{`{cps=N}`}</code> define a velocidade em{" "}
        <em>caracteres por segundo</em>. Use valores menores para deixar
        a fala mais dramática (sussurro, choro, hesitação) e maiores
        para fala apressada/animada.
      </p>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`label drama:
    # Sussurro lento
    s "{cps=8}eu... estou com medo.{/cps}"

    # Animação rápida (como se gritasse)
    s "{cps=60}AHHH NÃO NÃO NÃO!!{/cps}"

    # cps=0 mostra o texto INSTANTÂNEO
    s "{cps=0}(cartaz iluminado)  CAFÉ ABERTO  {/cps}"
    return
`}
      />

      <h2>5. Formatação visual — bold, italic, color, size</h2>
      <CommandTable
        title="Tags de aparência (todas precisam de fechamento)"
        variations={[
          { cmd: "{b}negrito{/b}", desc: "Negrito.", output: "negrito" },
          { cmd: "{i}itálico{/i}", desc: "Itálico — bom para pensamento, ênfase.", output: "itálico" },
          { cmd: "{u}sublinhado{/u}", desc: "Sublinhado.", output: "sublinhado" },
          { cmd: "{s}riscado{/s}", desc: "Strikethrough — bom para erro corrigido.", output: "riscado" },
          { cmd: "{color=#ff0066}rosa{/color}", desc: "Cor inline (qualquer hex).", output: "rosa" },
          { cmd: "{color=#33ff88}verde{/color}", desc: "Cor inline alternativa.", output: "verde" },
          { cmd: "{size=+8}grande{/size}", desc: "Aumenta a fonte (delta relativo).", output: "grande" },
          { cmd: "{size=-4}pequeno{/size}", desc: "Diminui a fonte.", output: "pequeno" },
          { cmd: "{size=32}fixo{/size}", desc: "Tamanho absoluto em pixels.", output: "32px" },
          { cmd: "{font=fonts/comic.ttf}quirky{/font}", desc: "Troca a fonte para um trecho.", output: "Carrega de game/fonts/" },
          { cmd: "{outlinecolor=#000}contornado{/outlinecolor}", desc: "Cor do contorno (se a fonte usa outline).", output: "—" },
          { cmd: "{alpha=0.5}semi{/alpha}", desc: "Transparência do trecho (0.0–1.0).", output: "—" },
          { cmd: "{=tag_estilo}custom{/=tag_estilo}", desc: "Aplica um style customizado definido em screens.rpy.", output: "Avançado." },
        ]}
      />

      <CodeBlock
        title="game/script.rpy — combinando tags"
        language="python"
        code={`label estiloso:
    s "Eu disse que era {b}{color=#ff3366}URGENTE{/color}{/b}!"
    s "(em pensamento) {i}por que ele nunca escuta?{/i}"
    s "{size=+10}{color=#33ff88}LIBERADO!{/size}{/color}"
    s "{font=fonts/handwritten.ttf}escrito à mão{/font}"
    return
`}
      />

      <AlertBox type="warning" title="Ordem de fechamento importa">
        As tags se aninham como HTML: a última aberta é a primeira a
        fechar. <code>{`{b}{i}texto{/i}{/b}`}</code> ✅ —{" "}
        <code>{`{b}{i}texto{/b}{/i}`}</code> ❌. O lint do Ren'Py reclama
        de tags malformadas.
      </AlertBox>

      <h2>6. Interpolação — variáveis no meio do texto</h2>
      <p>
        Use <strong>colchetes</strong> <code>[ ]</code> para interpolar
        variáveis Python diretamente na fala. Funciona com strings,
        números, listas, e qualquer expressão simples.
      </p>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`default player_name = "Você"
default afeicao_sakura = 0

label exemplo:
    s "Bom dia, [player_name]!"

    # Expressão entre [ ] — pode chamar atributos
    s "Sua afeição comigo está em [afeicao_sakura] pontos."

    # Formatação numérica estilo Python
    s "Hoje vendemos [vendas:.2f] reais."

    # Atributos de objetos
    s "O time vencedor é [partida.vencedor.nome]."
    return
`}
      />

      <h2>7. Diálogos especiais</h2>
      <CommandTable
        title="Comandos de diálogo além das falas comuns"
        variations={[
          { cmd: "centered \"texto\"", desc: "Texto centralizado em tela cheia, sem textbox.", output: 'Bom para "Capítulo 1", "Fim".' },
          { cmd: 'nvl "texto"', desc: "Linha em modo NVL (texto preenche a tela).", output: "Ver página NVL." },
          { cmd: "voice \"audio.ogg\"", desc: "Toca a voz dessa LINHA específica.", output: "Antes da fala correspondente." },
          { cmd: "$ renpy.say(s, \"texto\")", desc: "Equivalente em Python — usado em código dinâmico.", output: "Útil para falas geradas." },
          { cmd: "window show", desc: "Força mostrar o textbox (mesmo sem fala).", output: "Para narração com BG." },
          { cmd: "window hide", desc: "Esconde o textbox até próxima fala.", output: "Bom em transições." },
        ]}
      />

      <CodeBlock
        title="game/script.rpy — diálogos especiais"
        language="python"
        code={`label cap1:
    centered "{size=+30}Capítulo 1\\nO sino do Sakura Café{/size}"

    scene bg cafe with fade
    window show

    "O calor da manhã despertava aos poucos."

    voice "voice/sakura_001.ogg"
    s "Bom dia! Já vou abrir as portas."

    window hide
    "Ela sumiu na cozinha."
    return
`}
      />

      <h2>8. Strings multilinha e escape</h2>
      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`label exemplos:
    # Aspas dentro: escape com \\"
    s "Ela me disse: \\"até amanhã\\" e foi embora."

    # Quebra de linha explícita: \\n
    "Linha 1\\nLinha 2 (logo abaixo)"

    # Barra invertida literal: \\\\
    "Caminho: C:\\\\arquivos\\\\save.bin"

    # String de bloco com triplas — preserva quebras
    """
    Caro diário,

    Hoje aconteceu algo importante.
    """
    return
`}
      />

      <h2>9. Visualizando o textbox no jogo</h2>
      <OutputBlock label="anatomia da tela durante uma fala" type="info">
{`╔══════════════════════════════════════════════════════════╗
║                                                          ║
║                  [ background = bg cafe ]                ║
║                                                          ║
║                  [ sprite = sakura happy ]               ║
║                                                          ║
║                                                          ║
║   ┌───────────┐                                          ║
║   │  Sakura   │  ← namebox (cor = Character.color)       ║
║   ├───────────┴──────────────────────────────────────┐   ║
║   │                                                  │   ║
║   │  Bem-vindo ao Sakura Café! ▮                     │   ║
║   │                                                  │   ║
║   └──────────────────────────────────────────────────┘   ║
║                                              ← textbox    ║
╚══════════════════════════════════════════════════════════╝`}
      </OutputBlock>

      <h2>10. Validação</h2>
      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "lint pega tag mal fechada",
            cmd: "renpy.exe . lint",
            out: `game/script.rpy:54 Mismatched {color=#ff0066}...{/b} tag.
1 error reported.`,
            outType: "error",
          },
          {
            comment: "tudo certo",
            cmd: "renpy.exe . lint",
            out: `Statistics:
  The game contains 412 dialogue blocks, containing 6,421 words.
Lint took 0.39 seconds.
Linting complete. No problems were found.`,
            outType: "success",
          },
        ]}
      />

      <PracticeBox
        title="Cena dramática com pausas, ênfase e cor"
        goal="Escrever uma cena de 8 falas onde a Sakura confessa um sentimento. Use pelo menos 1 {w}, 1 {cps}, 1 {color}, 1 {b} e 1 extend."
        steps={[
          "Crie um label 'confissao' em game/script.rpy.",
          "Coloque um scene bg parque com fade.",
          "Escreva 8 falas alternando narração e Sakura.",
          "Use {w=1.0} em uma hesitação, {cps=8} em um sussurro, {color=#ff3366} em uma palavra-chave, {b} em uma palavra forte e extend para mudar expressão no meio de uma fala.",
          "Termine com hide sakura with dissolve e return.",
          "Rode renpy.exe . lint e jogue a cena.",
        ]}
        verify="A cena deve ter ritmo: pausas sentidas, palavras destacadas e a transição de expressão no meio da fala via extend."
      >
        <CodeBlock
          title="game/script.rpy (gabarito)"
          language="python"
          code={`label confissao:
    scene bg parque_tarde with fade
    show sakura nervosa at center with dissolve

    "O vento balançava as cerejeiras."
    s "Eu... {w=1.0}preciso te falar uma coisa."
    s "{cps=8}eu gosto de você.{/cps}"
    s sad "{w=0.5}Não precisa responder agora se não quiser."
    s feliz extend " só queria que você {b}soubesse{/b}."
    "Você sentiu o coração disparar."
    s "Aquele {color=#ff3366}rosa{/color} das cerejeiras nunca pareceu tão vivo."
    "Ela sorriu e foi embora — sem esperar resposta."

    hide sakura with dissolve
    return
`}
        />
      </PracticeBox>

      <AlertBox type="success" title="Próximo passo">
        Com diálogo dominado, partimos para o visual:{" "}
        <strong>Imagens</strong>, <strong>Cenas</strong> e{" "}
        <strong>Transições</strong> — o lado pictórico da VN.
      </AlertBox>
    </PageContainer>
  );
}
