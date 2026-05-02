import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function Condicionais() {
  return (
    <PageContainer
      title="Condicionais — if, elif, else e ramificação de história"
      subtitle="Como usar if/elif/else dentro de labels, em escolhas de menu e em screens. Aqui sua VN ganha rotas, cenas opcionais e finais condicionais — sem virar uma árvore impossível de manter."
      difficulty="iniciante"
      timeToRead="13 min"
      prompt="logica/condicionais"
    >
      <AlertBox type="info" title="A ferramenta que cria 'rotas'">
        Toda VN com mais de um final usa condicionais. O <code>if</code>{" "}
        decide qual cena tocar, qual final mostrar, qual escolha aparece no
        menu. Dominar <code>if/elif/else</code> é dominar o esqueleto
        narrativo do seu jogo.
      </AlertBox>

      <h2>1. Sintaxe básica de if/elif/else</h2>
      <p>
        Igual ao Python: indentação de 4 espaços, dois pontos no final, sem
        chaves. As condições aceitam qualquer expressão Python (comparações,
        operadores lógicos, chamadas de função).
      </p>

      <CodeBlock
        language="python"
        title="game/cena_final.rpy"
        code={`label cena_final:
    scene bg cafe_noite with fade

    if afeicao_sakura >= 60:
        s "Eu... eu não quero que você vá embora."
        jump final_sakura

    elif afeicao_akira >= 60:
        a "Vamos tomar um chá amanhã? Só nós dois."
        jump final_akira

    elif afeicao_sakura >= 30 and afeicao_akira >= 30:
        narr "Você ganhou dois grandes amigos hoje."
        jump final_amizade

    else:
        narr "O café fechou. Você foi embora sozinho(a)."
        jump final_neutro`}
      />

      <h2>2. Operadores de comparação e lógicos</h2>

      <CommandTable
        title="Operadores que você usa em condições"
        variations={[
          { cmd: "==", desc: "Igual a", output: "if dia_atual == 7:" },
          { cmd: "!=", desc: "Diferente de", output: "if escolha != 'fugir':" },
          { cmd: ">  >=", desc: "Maior / maior ou igual", output: "if afeicao >= 50:" },
          { cmd: "<  <=", desc: "Menor / menor ou igual", output: "if dinheiro < preco:" },
          { cmd: "and", desc: "E lógico — todas precisam ser verdadeiras", output: "if afeicao_s >= 30 and flag_cafe:" },
          { cmd: "or", desc: "OU lógico — pelo menos uma verdadeira", output: "if dia == 6 or dia == 7:" },
          { cmd: "not", desc: "Negação", output: "if not flag_pegou_chave:" },
          { cmd: "in", desc: "Pertence a uma coleção", output: 'if "chave" in inventario:' },
          { cmd: "not in", desc: "Não pertence", output: 'if "sakura" not in cenas_vistas:' },
        ]}
      />

      <h2>3. Condicionais dentro de menus de escolha</h2>
      <p>
        Você pode mostrar ou esconder uma escolha de menu com base em uma
        condição. Use a sintaxe <code>&quot;Texto da escolha&quot; if condicao:</code>:
      </p>

      <CodeBlock
        language="python"
        title="game/cena_confissao.rpy"
        code={`label cena_confissao:
    scene bg parque_noite with dissolve
    show sakura blush at center

    s "Você... queria me dizer alguma coisa?"

    menu:
        "Pedir desculpas":
            $ afeicao_sakura -= 5
            jump cena_neutra

        "Confessar meus sentimentos" if afeicao_sakura >= 50:
            $ afeicao_sakura += 20
            jump cena_beijo

        "Convidar para o festival" if flag_visitou_festival:
            $ afeicao_sakura += 10
            jump cena_festival

        "Mostrar o presente" if "colar" in inventario:
            $ inventario.remove("colar")
            $ afeicao_sakura += 15
            jump cena_presente

        "Ficar em silêncio":
            jump cena_silencio`}
      />

      <AlertBox type="warning" title="Cuidado com o jogador encurralado">
        Se TODAS as escolhas têm condição e nenhuma é verdadeira, o menu vazio
        congela o jogo. Sempre deixe pelo menos uma escolha sem condição
        (como &quot;Pedir desculpas&quot; e &quot;Ficar em silêncio&quot; no
        exemplo acima) como saída garantida.
      </AlertBox>

      <h2>4. Condicionais em diálogos</h2>
      <p>
        Trechos inteiros de fala podem aparecer ou sumir dependendo do
        estado. Combine com <code>scene</code> e <code>show</code>:
      </p>

      <CodeBlock
        language="python"
        title="game/cena_manha.rpy"
        code={`label cena_manha:
    scene bg quarto_manha with fade

    if dia_atual == 1:
        narr "Primeiro dia de trabalho no Sakura Café."
        narr "Seu coração acelera só de pensar."

    elif dia_atual >= 7 and afeicao_sakura >= 40:
        narr "Uma semana se passou. Você já se sente em casa."
        show sakura happy
        s "Bom dia! Trouxe seu café favorito."

    else:
        narr "Mais um dia comum. Hora de abrir o café."

    if flag_pegou_chave:
        narr "Você abre a porta com a chave que Sakura te emprestou."
    else:
        narr "Você bate na porta. Sakura abre, sonolenta."

    jump cena_atendimento`}
      />

      <h2>5. if aninhado vs and — qual usar?</h2>
      <p>
        Aninhar <code>if</code> dentro de <code>if</code> deixa o código mais
        legível quando você quer respostas diferentes a cada nível. Use{" "}
        <code>and</code> quando todas as condições têm a mesma resposta.
      </p>

      <CodeBlock
        language="python"
        title="game/cena_aniversario.rpy"
        code={`# Versão aninhada — cada caso tem fala própria
label cena_aniversario_v1:
    if dia_atual == 14:
        if "presente" in inventario:
            if afeicao_sakura >= 30:
                s "Você lembrou! E ainda trouxe presente!"
                $ afeicao_sakura += 25
            else:
                s "Ah... obrigada, mas nem te conheço direito ainda."
                $ afeicao_sakura += 5
        else:
            s "Hoje é meu aniversário... mas tudo bem."
            $ afeicao_sakura -= 5
    return

# Versão com 'and' — quando o resultado é o MESMO
label cena_aniversario_v2:
    if dia_atual == 14 and "presente" in inventario and afeicao_sakura >= 30:
        s "Você lembrou! E ainda trouxe presente!"
        $ afeicao_sakura += 25
    return`}
      />

      <h2>6. Condicionais em screens</h2>
      <p>
        Dentro de uma <code>screen</code>, use <code>if</code>/
        <code>elif</code>/<code>else</code> para mostrar ou esconder
        elementos visuais — botões, imagens, textos:
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy"
        code={`screen status_personagens():
    frame:
        xalign 1.0 yalign 0.0
        vbox:
            text "Dia [dia_atual]"

            if afeicao_sakura > 0:
                text "Sakura: [afeicao_sakura]" color "#ffaacc"

            if afeicao_akira > 0:
                text "Akira: [afeicao_akira]" color "#7fb8ff"

            if "chave" in inventario:
                text "Chave do depósito" size 14

            if dia_atual >= 7:
                textbutton "Final disponível" action Jump("escolha_final")`}
      />

      <h2>7. Operador ternário Python</h2>
      <p>
        Para uma escolha rápida em uma única expressão (interpolar saudação
        diferente, escolher cor):
      </p>

      <CodeBlock
        language="python"
        title="game/cena_saudacao.rpy"
        code={`label cena_saudacao:
    $ saudacao = "Querido(a)" if afeicao_sakura >= 50 else "Você"
    $ humor = "feliz" if afeicao_sakura >= 30 else "neutra"

    show expression "sakura " + humor at center
    s "[saudacao], que bom te ver hoje."
    return`}
      />

      <AlertBox type="success" title="Boas práticas para condicionais legíveis">
        <ul className="list-disc pl-5 space-y-1 m-0">
          <li>Dê nomes claros às variáveis: <code>afeicao_sakura</code>, não <code>x1</code>.</li>
          <li>Use <code>elif</code> em vez de aninhar muitos <code>if</code>.</li>
          <li>Coloque a condição mais específica primeiro (afeição alta antes da baixa).</li>
          <li>Sempre tenha um <code>else</code> de segurança para cair em algum caminho.</li>
          <li>Teste cada ramo com o console: <code>$ afeicao_sakura = 100</code>.</li>
        </ul>
      </AlertBox>

      <PracticeBox
        title="Café com três finais condicionais"
        goal="Criar um label que escolhe entre 3 finais diferentes baseado em afeição e flags."
        steps={[
          "Garanta que estão definidos: default afeicao_sakura = 0, default afeicao_akira = 0, default flag_visitou_festival = False.",
          "Crie um label escolha_final que mostre 'scene bg cafe_noite with fade'.",
          "Adicione um if que pula para 'final_sakura' se afeicao_sakura >= 50 E flag_visitou_festival for True.",
          "Adicione um elif para 'final_akira' se afeicao_akira >= 50.",
          "Adicione um elif para 'final_amizade' se afeicao_sakura >= 25 e afeicao_akira >= 25.",
          "Termine com um else que pula para 'final_neutro'.",
        ]}
        verify="Use o console (Shift+O) para forçar valores diferentes e testar cada um dos 4 caminhos sem reiniciar a VN."
      />
    </PageContainer>
  );
}
