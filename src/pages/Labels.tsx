import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Labels() {
  return (
    <PageContainer
      title="Labels, jumps e calls — fluxo da VN"
      subtitle="Como capítulos, sub-cenas, retornos e chamadas se conectam. Diferença entre 'jump' e 'call', labels locais (.dot), parâmetros e o ciclo de retorno ao menu principal."
      difficulty="iniciante"
      timeToRead="12 min"
      prompt="linguagem/labels"
    >
      <AlertBox type="info" title="Pense em labels como capítulos de um livro">
        Cada <code>label</code> é um ponto nomeado no roteiro. Você navega
        entre eles com <code>jump</code> (vai e não volta) ou{" "}
        <code>call</code> (vai e volta como sub-rotina). É a mesma ideia
        do <em>goto</em> da informática, só que aqui é a forma{" "}
        <strong>idiomática</strong> de estruturar a história.
      </AlertBox>

      <h2>1. Sintaxe básica do label</h2>
      <p>
        Um label começa com a palavra <code>label</code>, seguida de um
        nome único, dois pontos, e um bloco indentado. O nome deve ser
        em snake_case, sem acentos, sem espaços. O label{" "}
        <code>start</code> é o ÚNICO obrigatório — é o ponto de entrada
        do jogo.
      </p>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`label start:
    scene bg escola with fade
    "Primeiro dia de aula no colégio Hanazono."
    jump cap1


label cap1:
    "Você se senta na carteira da janela."
    s "Olha só, o sol bate bem aqui."
    jump cap2


label cap2:
    "A sineta tocou."
    return
`}
      />

      <h2>2. jump vs call — a diferença que muda tudo</h2>
      <p>
        <code>jump</code> é uma transferência <strong>definitiva</strong>:
        você sai do label atual e nunca mais volta. Já <code>call</code>{" "}
        empilha o ponto atual e roda o label-alvo como uma sub-rotina;
        quando esse label encontra <code>return</code>, a execução volta
        para a linha logo após o <code>call</code>.
      </p>

      <CommandTable
        title="Comparativo: jump vs call vs return"
        variations={[
          {
            cmd: "jump <label>",
            desc: "Salto incondicional. NÃO retorna.",
            output: "Use entre capítulos, rotas e finais.",
          },
          {
            cmd: "call <label>",
            desc: "Vai ao label e empilha o retorno.",
            output: "Use para cenas reutilizáveis (ex: tutorial, gallery).",
          },
          {
            cmd: "call <label>(arg1, arg2)",
            desc: "Como call, mas passa argumentos posicionais.",
            output: "Útil para cenas parametrizáveis.",
          },
          {
            cmd: "return",
            desc: "Sai do label. Se foi chamado por call: volta ao caller. Senão: volta ao menu principal.",
            output: "É como o 'fim' do capítulo.",
          },
          {
            cmd: "return <valor>",
            desc: "Retorna um valor para quem chamou — disponível em _return.",
            output: "$ resultado = _return",
          },
        ]}
      />

      <CodeBlock
        title="game/script.rpy — jump faz capítulos lineares"
        language="python"
        code={`label start:
    "Cap. 1"
    jump cap2

label cap2:
    "Cap. 2"
    jump cap3

label cap3:
    "Cap. 3 — fim."
    return  # volta ao menu principal
`}
      />

      <CodeBlock
        title="game/script.rpy — call reutiliza uma cena"
        language="python"
        code={`label start:
    "Início da história."
    call cena_tutorial   # vai pro tutorial...
    "Voltou! Agora segue a história normal."
    return


label cena_tutorial:
    "Aperte ESPAÇO para avançar."
    "Aperte CTRL para passar rápido."
    "Aperte S para abrir o menu de save."
    return  # volta para a linha após 'call cena_tutorial'
`}
      />

      <h2>3. Labels locais — o ponto (.dot)</h2>
      <p>
        Labels que começam com ponto (ex: <code>.fim</code>) são{" "}
        <strong>locais</strong>: só existem dentro do label "pai" mais
        próximo. Isso ajuda a evitar colisão de nomes em cenas extensas.
      </p>

      <CodeBlock
        title="game/script.rpy — labels locais com .dot"
        language="python"
        code={`label cap_festival:
    "Você chegou no festival."

    menu:
        "Ir pra barraca de takoyaki":
            jump .takoyaki
        "Ir pra roda gigante":
            jump .roda_gigante

label .takoyaki:
    "O cheiro de polvo grelhado é irresistível."
    jump .fim

label .roda_gigante:
    "A vista lá de cima é incrível."
    jump .fim

label .fim:
    "A noite acabou. Você voltou para casa."
    return


label outra_cena:
    # Daqui você precisa do nome COMPLETO para acessar:
    # jump cap_festival.takoyaki
    return
`}
      />

      <h2>4. Diagrama mental do fluxo</h2>
      <OutputBlock label="fluxo de uma VN com 1 escolha e 2 finais" type="info">
{`        ┌───────────────┐
        │  label start  │
        └───────┬───────┘
                │
                ▼
        ┌───────────────┐
        │   menu:       │
        │  "Confessar"  │   "Calar a boca"
        └───┬───────────┴────────┬──────┘
            │ jump rota_sakura   │ jump rota_amizade
            ▼                    ▼
   ┌────────────────┐   ┌────────────────┐
   │ rota_sakura    │   │ rota_amizade   │
   │   ...cena...   │   │   ...cena...   │
   │   return       │   │   return       │
   └────────┬───────┘   └────────┬───────┘
            │                    │
            └────────► menu principal ◄────────┘`}
      </OutputBlock>

      <h2>5. Labels com parâmetros</h2>
      <p>
        Você pode tratar um label como uma função: passar argumentos,
        usar valores defaults e até receber um valor de retorno. Isso é
        ouro para cenas reutilizáveis (ex: uma cena de "ganhar item" que
        recebe o nome do item como argumento).
      </p>

      <CodeBlock
        title="game/script.rpy — label parametrizado"
        language="python"
        code={`label start:
    call ganhar_item("Chave Dourada")
    call ganhar_item("Pingente da Sakura")
    "Continuando a história..."
    return


label ganhar_item(nome_item, raridade="comum"):
    centered "Você obteve: [nome_item] ([raridade])"
    play sound "audio/item_get.ogg"
    pause 0.8
    return
`}
      />

      <h2>6. Labels especiais que o Ren'Py reconhece</h2>
      <CommandTable
        title="Labels reservados — a engine os chama automaticamente"
        variations={[
          { cmd: "label start:", desc: "Ponto de entrada quando o jogador clica 'Start'.", output: "OBRIGATÓRIO." },
          { cmd: "label main_menu:", desc: "Sobrescreve o comportamento do menu principal.", output: "Raro, só para customizações pesadas." },
          { cmd: "label after_load:", desc: "Roda logo APÓS um carregamento de save.", output: "Reativar música, restaurar estado, etc." },
          { cmd: "label splashscreen:", desc: "Cena de logo/abertura ANTES do menu principal.", output: "Aparece só na 1ª vez por sessão." },
          { cmd: "label quit:", desc: "Roda quando o jogador fecha o jogo.", output: "Útil para salvar persistente." },
          { cmd: "label before_main_menu:", desc: "Permite trocar o background do menu principal dinamicamente.", output: "Mostrar BG diferente conforme progresso." },
        ]}
      />

      <h2>7. Rodando seu script com lint</h2>
      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "valida labels — pega referência a label inexistente",
            cmd: "renpy.exe . lint",
            out: `game/script.rpy:42 The label 'rota_skura' is not defined.
                  Hint: did you mean 'rota_sakura'?
1 error reported.`,
            outType: "error",
          },
          {
            comment: "depois de corrigir o typo",
            cmd: "renpy.exe . lint",
            out: `Statistics:
  The game contains 12 labels and 8 menu choices.
Lint took 0.31 seconds.
Linting complete. No problems were found.`,
            outType: "success",
          },
        ]}
      />

      <AlertBox type="warning" title="Cuidado: jump dentro de call não retorna">
        Se um label foi chamado por <code>call</code> e dentro dele você
        usa <code>jump</code> para sair, o stack de retorno fica órfão.
        O próximo <code>return</code> vai voltar para o caller original
        e pode causar comportamento inesperado. Use{" "}
        <code>return</code> dentro de cenas chamadas por{" "}
        <code>call</code>; reserve <code>jump</code> para a estrutura
        principal da história.
      </AlertBox>

      <PracticeBox
        title="Cena de festival com 2 labels que pulam entre si"
        goal="Criar um pequeno fluxo onde o jogador escolhe entre 2 atividades, cada uma é um label, e ambas terminam num label de fim comum."
        steps={[
          "Crie um arquivo game/festival.rpy ao lado do script.rpy.",
          "Defina o label cap_festival com um menu de 2 opções.",
          "Crie 2 labels locais (.barraca e .palco), cada um com 2 falas.",
          "Ambos jump para .fim, que escreve 'A noite acabou.' e return.",
          "Rode o jogo e teste cada caminho.",
        ]}
        verify="Você deve conseguir jogar a partir de cap_festival, escolher uma opção, ler as falas, ver 'A noite acabou.' e voltar ao menu."
      >
        <CodeBlock
          title="game/festival.rpy (gabarito)"
          language="python"
          code={`label cap_festival:
    scene bg festival_noite with fade
    "As lanternas de papel brilhavam acima da praça."

    menu:
        "Ir na barraca de yakisoba":
            jump .barraca
        "Assistir o show da banda no palco":
            jump .palco

label .barraca:
    "O molho doce do yakisoba escorria do hashi."
    "Você dividiu o prato com a Yuki."
    jump .fim

label .palco:
    "A guitarra abriu a noite com um riff agudo."
    "A Hana puxou você pra perto do palco."
    jump .fim

label .fim:
    "A noite acabou — e você sentiu que tinha valido a pena."
    return
`}
        />
      </PracticeBox>

      <AlertBox type="success" title="Próximo passo">
        Agora que o fluxo da VN está claro, vamos definir as{" "}
        <strong>personagens</strong>: cores, fontes, tags de voz e
        atributos automáticos.
      </AlertBox>
    </PageContainer>
  );
}
