import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function Menus() {
  return (
    <PageContainer
      title="Menus — escolhas, captions e set de duplicatas"
      subtitle="O statement menu é o coração interativo da VN: o jogador para, lê opções e decide. Aprenda a estruturar menus simples e avançados, evitar repetições com 'set', combinar com condicionais e salvar a escolha em variáveis."
      difficulty="iniciante"
      timeToRead="12 min"
      prompt="logica/menus"
    >
      <AlertBox type="info" title="O que diferencia uma VN de um romance">
        Em uma VN, o jogador <em>escolhe</em>. O <code>menu:</code> é onde a
        história pausa, mostra opções e cede o controle. Sem menus, sua VN é
        linear como um livro.
      </AlertBox>

      <h2>1. Sintaxe básica do menu</h2>
      <p>
        Um <code>menu:</code> contém uma lista de strings (as escolhas) e,
        para cada uma, um bloco indentado com o que acontece se o jogador
        clicar nela:
      </p>

      <CodeBlock
        language="python"
        title="game/cena_chegada.rpy"
        code={`label cena_chegada:
    scene bg cafe_porta with dissolve
    show sakura curiosa at center

    s "Bem-vindo(a) ao Sakura Café! O que você gostaria de fazer?"

    menu:
        "Pedir o cardápio":
            $ flag_pediu_cardapio = True
            jump cena_cardapio

        "Sentar e observar o ambiente":
            $ afeicao_sakura += 2
            jump cena_observar

        "Perguntar sobre a Sakura":
            $ afeicao_sakura += 5
            jump cena_conhecer_sakura`}
      />

      <h2>2. Caption — texto no topo do menu</h2>
      <p>
        Você pode colocar uma string como primeira linha do menu, sem bloco
        indentado embaixo. Ela vira o <strong>caption</strong> — uma
        pergunta ou frase contextual mostrada acima das opções.
      </p>

      <CodeBlock
        language="python"
        title="game/cena_pergunta.rpy"
        code={`label cena_pergunta:
    s "Posso te perguntar uma coisa?"

    menu:
        "O que você quer saber?"

        "Sobre o café":
            jump resposta_cafe

        "Sobre você":
            $ afeicao_sakura += 8
            jump resposta_pessoal

        "Sobre o cliente misterioso":
            jump resposta_akira`}
      />

      <h2>3. Menus com condicionais</h2>
      <p>
        Cada escolha pode ter um <code>if</code> à direita. Se a condição é
        falsa, a opção simplesmente não aparece. Combine isso com afeição,
        flags e itens do inventário para criar rotas dinâmicas:
      </p>

      <CodeBlock
        language="python"
        title="game/cena_pedido.rpy"
        code={`label cena_pedido:
    s "O que você vai pedir hoje?"

    menu:
        "Café preto" if dinheiro >= 5:
            $ dinheiro -= 5
            jump bebida_cafe

        "Matcha latte" if dinheiro >= 9:
            $ dinheiro -= 9
            $ afeicao_sakura += 3
            jump bebida_matcha

        "Pedir grátis para Sakura" if afeicao_sakura >= 40:
            s "Hehe, hoje é por minha conta."
            $ afeicao_sakura += 5
            jump bebida_especial

        "Não vou pedir nada":
            $ afeicao_sakura -= 2
            jump cena_saida`}
      />

      <h2>4. set — evitar repetir a mesma escolha</h2>
      <p>
        Em VNs com sub-menus de exploração (perguntar várias coisas a alguém,
        examinar objetos da sala), o jogador volta ao mesmo menu várias
        vezes. Use <code>set</code> para que uma escolha desapareça depois de
        usada:
      </p>

      <CodeBlock
        language="python"
        title="game/cena_conversa.rpy"
        code={`label cena_conversa:
    show sakura interessada at center
    s "Pode me perguntar o que quiser."

label loop_perguntas:
    menu perguntas_sakura:
        "Sobre o que você quer falar?"

        set perguntas_feitas

        "Como você abriu o café?":
            s "Foi um sonho que herdei da minha avó."
            $ afeicao_sakura += 3
            jump loop_perguntas

        "Você mora sozinha?":
            s "Sim. Mas o café me faz companhia."
            $ afeicao_sakura += 2
            jump loop_perguntas

        "Quem é o cliente de cabelo prateado?":
            s "Ah... o Akira. É uma longa história."
            $ afeicao_sakura += 1
            jump loop_perguntas

        "Acabar a conversa":
            s "Foi bom conversar com você."
            jump cena_proxima`}
      />

      <AlertBox type="info" title="Como o 'set' funciona por baixo dos panos">
        O <code>set perguntas_feitas</code> diz ao Ren'Py para guardar, no
        objeto <code>perguntas_feitas</code> (cria automaticamente), todas as
        escolhas já clicadas. Da próxima vez que o menu aparecer, as opções
        marcadas não são mostradas. Quando todas acabam, o menu inteiro vira
        vazio — então deixe sempre uma opção sem efeito (como
        &quot;Acabar a conversa&quot;) que faça <code>jump</code> para fora.
      </AlertBox>

      <h2>5. Salvando a escolha em uma variável</h2>
      <p>
        Às vezes você não quer ramificar imediatamente — só registrar o que o
        jogador escolheu para usar depois. Use atribuição direta:
      </p>

      <CodeBlock
        language="python"
        title="game/cena_apresentacao.rpy"
        code={`default sabor_favorito = "morango"
default cor_favorita = "rosa"

label cena_apresentacao:
    s "Qual seu doce favorito?"

    menu:
        "Bolo de morango":
            $ sabor_favorito = "morango"
        "Matcha":
            $ sabor_favorito = "matcha"
        "Dorayaki":
            $ sabor_favorito = "dorayaki"

    s "Anotado! E sua cor preferida?"

    menu:
        "Rosa":
            $ cor_favorita = "rosa"
        "Azul":
            $ cor_favorita = "azul"
        "Roxo":
            $ cor_favorita = "roxo"

    s "Vou lembrar disso. [sabor_favorito] e [cor_favorita] — combina com você."
    return`}
      />

      <h2>6. Tabela de recursos do menu</h2>

      <CommandTable
        title="Sintaxes e recursos do statement menu"
        variations={[
          {
            cmd: 'menu:',
            desc: "Abre um menu de escolhas",
            output: "Cada string indentada vira uma opção clicável.",
          },
          {
            cmd: '"Caption"',
            desc: "Primeira string sem bloco indentado vira o título acima das opções",
            output: "Útil para mostrar a pergunta/contexto da escolha.",
          },
          {
            cmd: '"Texto" if condicao:',
            desc: "Mostra a opção apenas se a condição for verdadeira",
            output: 'Ex: "Pegar a chave" if not flag_pegou_chave:',
          },
          {
            cmd: 'menu nome_unico:',
            desc: "Dá um nome ao menu — necessário para usar 'set'",
            output: "Ex: menu perguntas_sakura: ... set feitas",
          },
          {
            cmd: 'set lista_feitas',
            desc: "Marca a escolha clicada para não aparecer novamente",
            output: "Funciona apenas dentro de menus nomeados.",
          },
          {
            cmd: '$ x = renpy.display_menu([("A", 1), ("B", 2)])',
            desc: "Menu programático em Python (avançado)",
            output: "Retorna o valor associado à opção escolhida.",
          },
        ]}
      />

      <h2>7. Padrões comuns que você vai usar</h2>

      <h3>7.1 Menu de yes/no rápido</h3>
      <CodeBlock
        language="python"
        title="game/cena_decisao.rpy"
        code={`label cena_decisao:
    s "Posso te beijar?"

    menu:
        "Sim":
            $ afeicao_sakura += 30
            jump cena_beijo
        "Não":
            $ afeicao_sakura -= 10
            jump cena_recuar`}
      />

      <h3>7.2 Menu que retorna sem ramificar (continua a história)</h3>
      <CodeBlock
        language="python"
        title="game/cena_almoco.rpy"
        code={`label cena_almoco:
    s "Onde quer almoçar?"

    menu:
        "Sushi":
            $ refeicao = "sushi"
            $ afeicao_sakura += 4
        "Hambúrguer":
            $ refeicao = "hambúrguer"
        "Não vou comer":
            $ refeicao = None
            $ afeicao_sakura -= 5

    # Continua a história sem jump — segue para a próxima cena
    s "Ok, vamos!"
    jump cena_almoco_local`}
      />

      <h3>7.3 Menu dentro de loop (explorar uma sala)</h3>
      <CodeBlock
        language="python"
        title="game/cena_quarto.rpy"
        code={`label cena_quarto:
    scene bg quarto_sakura with dissolve

label loop_quarto:
    menu explorar_quarto:
        "O que você quer examinar?"

        set quarto_visto

        "A estante de livros":
            narr "Mangás antigos. Você pega um e folheia."
            $ afeicao_sakura += 2
            jump loop_quarto

        "A foto na mesa":
            narr "Uma garotinha sorrindo com uma senhora — provavelmente a avó dela."
            $ flag_viu_foto = True
            jump loop_quarto

        "O bilhete amassado no chão":
            narr "Um bilhete... em japonês. Você não entende."
            $ inventario.append("bilhete")
            jump loop_quarto

        "Sair do quarto":
            jump cena_corredor`}
      />

      <PracticeBox
        title="Mini-cena com 3 escolhas e afeição"
        goal="Criar um label cena_festival que mostra 3 escolhas para impressionar Sakura, cada uma somando uma quantidade diferente de afeição."
        steps={[
          "Crie um label chamado cena_festival.",
          "Use 'scene bg festival_noite with dissolve' para abrir a cena.",
          "Mostre Sakura com 'show sakura yukata at center'.",
          "Faça uma fala de Sakura: 'Quer fazer o quê primeiro?'.",
          "Abra um menu com 3 opções: 'Pesca de peixinhos' (+5), 'Comprar yakisoba' (+3), 'Tomar foto juntas' (+10).",
          "Em cada bloco, use $ afeicao_sakura += N e termine com jump cena_volta.",
          "Adicione uma 4ª opção 'Confessar' que só aparece se afeicao_sakura >= 30.",
        ]}
        verify="Rode 'renpy.exe . lint' e confirme que não há erros. Teste a 4ª opção forçando a afeição pelo console."
      />
    </PageContainer>
  );
}
