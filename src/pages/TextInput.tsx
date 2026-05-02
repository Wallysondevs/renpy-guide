import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function TextInput() {
  return (
    <PageContainer
      title="TextInput — recebendo texto do jogador"
      subtitle="renpy.input(), screen input customizado, validação, sanitização e o pedido custom do cliente no Sakura Café — completo, com tratamento de strings vazias e teclas inválidas."
      difficulty="intermediario"
      timeToRead="15 min"
      prompt="ui/text-input"
    >
      <AlertBox type="info" title="Por que ler input do jogador">
        VNs viram pessoais quando a personagem chama o jogador pelo nome
        que ELE escolheu. Ren'Py tem 2 caminhos: <code>renpy.input()</code>{" "}
        (tela inteira, fácil) e <strong>screen input</strong> (controle
        total do visual). Vamos cobrir os dois com o exemplo do café:
        cliente chega, digita o nome, depois digita o pedido custom.
      </AlertBox>

      <h2>1. <code>renpy.input()</code> — a forma rápida</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`define s = Character("Sakura", color="#ffaacc")

label inicio:
    scene bg cafe
    show sakura feliz

    s "Bem-vindo ao Sakura Café! Como posso te chamar?"

    # 'pyexpr' bloqueia até o jogador apertar Enter
    $ nome_jogador = renpy.input(
        "Seu nome:",
        default="",
        length=20,
        allow="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZáéíóúãõçÁÉÍÓÚÃÕÇ "
    )

    # Sanitização: tira espaços extras, garante fallback
    $ nome_jogador = nome_jogador.strip() or "Cliente"

    s "Prazer, [nome_jogador]! Vou te trazer o cardápio."
    return`}
      />

      <h2>2. Parâmetros de <code>renpy.input()</code></h2>

      <CommandTable
        title="Argumentos de renpy.input()"
        variations={[
          {
            cmd: 'prompt="..."',
            desc: "Texto exibido acima da caixa de input.",
            output: '"Seu nome:"',
          },
          {
            cmd: 'default="..."',
            desc: "Valor inicial pré-preenchido.",
            output: 'default="Cliente"',
          },
          {
            cmd: "length=N",
            desc: "Limite máximo de caracteres.",
            output: "length=20",
          },
          {
            cmd: 'allow="..."',
            desc: "WHITELIST de chars permitidos.",
            output: 'allow="0123456789"',
          },
          {
            cmd: 'exclude="{}"',
            desc: "BLACKLIST. Default exclui '{ }' p/ evitar text tags malicioso.",
            output: 'exclude="{}<>"',
          },
          {
            cmd: "screen='input'",
            desc: "Qual screen renderiza (custom).",
            output: "screen='input_cafe'",
          },
          {
            cmd: "pixel_width=400",
            desc: "Largura máxima do campo em pixels.",
            output: "pixel_width=600",
          },
          {
            cmd: "multiline=True",
            desc: "Permite múltiplas linhas (Enter quebra linha).",
            output: "multiline=True",
          },
          {
            cmd: "mask='*'",
            desc: "Mascarar input (ex: senha).",
            output: 'mask="*"',
          },
        ]}
      />

      <h2>3. Validação — não aceitar nome vazio</h2>
      <p>
        A doc oficial NÃO mostra como repetir o input até receber valor
        válido. Truque: laço <code>while</code> em <code>$</code> + Python.
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label entrada_nome:
    scene bg cafe
    show sakura feliz
    s "Como posso te chamar?"

    $ nome_jogador = ""
    while not nome_jogador.strip():
        $ nome_jogador = renpy.input(
            "Digite seu nome (mínimo 2 letras):",
            length=20,
            exclude="{}<>")
        $ nome_jogador = nome_jogador.strip()
        if len(nome_jogador) < 2:
            s "Hmm, esse nome é muito curto. Tenta de novo?"
            $ nome_jogador = ""

    s "Prazer, [nome_jogador]!"
    return`}
      />

      <h2>4. Cliente do café digita o pedido custom</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy — pedido livre"
        code={`label fazer_pedido:
    scene bg cafe
    show sakura feliz

    s "O que você vai querer hoje, [nome_jogador]?"

    $ pedido = renpy.input(
        "Digite seu pedido:",
        default="café com leite",
        length=60,
        exclude="{}<>")

    $ pedido = pedido.strip().lower()

    if not pedido:
        s "Vou trazer o especial do dia, então!"
        $ pedido = "especial do dia"

    elif "café" in pedido or "cafe" in pedido:
        s "Boa escolha! Já preparo o seu [pedido]."

    elif "chá" in pedido or "cha" in pedido:
        s "Tenho matcha, hibisco e earl grey. Qual prefere?"

    else:
        s "Hmm, [pedido]... vou ver se temos!"

    return`}
      />

      <h2>5. <code>screen input</code> custom — visual integrado</h2>
      <p>
        Quando você quer que o input apareça <strong>dentro</strong> da
        textbox normal do café (e não em tela cheia), defina um screen
        próprio:
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy"
        code={`screen input_cafe(prompt):
    style_prefix "input_cafe"

    window:
        background Frame("gui/textbox.png", 30, 30)
        xalign 0.5  yalign 0.92
        xsize 1100  ysize 180
        padding (40, 30)

        vbox:
            spacing 12

            text prompt size 22 color "#ffaacc" bold True

            input:
                id "input"
                color "#fff"
                size 26
                length 30
                exclude "{}<>"
                pixel_width 1000

style input_cafe_window is window`}
      />

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label nome_em_screen:
    scene bg cafe
    show sakura feliz
    s "Antes de começar, preciso do seu nome."

    # Usa screen custom em vez do default
    $ nome_jogador = renpy.input(
        "Como você quer ser chamado?",
        screen="input_cafe",
        length=30) or "Visitante"

    s "Anotado, [nome_jogador]!"
    return`}
      />

      <h2>6. Input numérico — idade do cliente</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label perguntar_idade:
    s "Pra eu te oferecer o item certo, qual sua idade?"

    $ idade_str = renpy.input(
        "Idade (apenas números):",
        default="18",
        allow="0123456789",
        length=3)

    # Conversão segura
    python:
        try:
            idade = int(idade_str)
        except ValueError:
            idade = 18

    if idade < 18:
        s "Sem álcool então! Que tal um milkshake?"
    elif idade < 30:
        s "Posso oferecer nosso saquê quente!"
    else:
        s "Talvez um whisky japonês combine com você."
    return`}
      />

      <h2>7. Input multiline — depoimento na pesquisa de satisfação</h2>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label pesquisa:
    scene bg cafe
    show sakura corada

    s "[nome_jogador], pode deixar um comentário sobre o atendimento?"

    $ comentario = renpy.input(
        "Seu depoimento (máx 200 chars):",
        default="",
        length=200,
        multiline=True,
        pixel_width=900)

    if comentario.strip():
        $ persistent.depoimentos = (persistent.depoimentos or [])
        $ persistent.depoimentos.append({
            "nome": nome_jogador,
            "texto": comentario.strip()
        })
        s "Obrigada! Vou colocar no nosso quadro de elogios."
    else:
        s "Tudo bem, fica pra próxima!"
    return`}
      />

      <h2>8. Sanitização contra text tags maliciosos</h2>
      <p>
        Por DEFAULT o Ren'Py exclui <code>{`{`}</code> e{" "}
        <code>{`}`}</code> em <code>renpy.input()</code> — porque um
        jogador esperto poderia digitar{" "}
        <code>{`{color=#f00}meu nome{/color}`}</code> e injetar
        formatação. Sempre mantenha esse exclude.
      </p>

      <AlertBox type="danger" title="NUNCA confie no que o jogador digita">
        Antes de gravar o nome em arquivo, salvar no save ou enviar pra
        servidor: passe sempre por <code>.strip()</code>, valide tamanho
        mínimo, e considere{" "}
        <code>re.sub(r"[^A-Za-z0-9 áéíóú]", "", txt)</code> para
        remover qualquer coisa exótica. Em saves persistentes você
        carrega esse nome em CADA sessão futura.
      </AlertBox>

      <Terminal
        path="~/projetos/sakura-cafe"
        user="dev"
        host="vn-studio"
        lines={[
          {
            comment: "rodando o jogo, ao chegar no input",
            cmd: "renpy.exe . run",
            out: `[INFO] Loading game...
[INFO] script.rpy:42 input prompt='Seu nome:' length=20
[USER] digitou: 'Yumi'
[INFO] nome_jogador = 'Yumi'
[INFO] continuando label entrada_nome...`,
            outType: "info",
          },
        ]}
      />

      <PracticeBox
        title="Cardápio interativo: cliente digita pedido e o jogo reage"
        goal="Combinar input de nome + input de pedido, validar string vazia e ramificar a cena com base em palavras-chave."
        steps={[
          "Em script.rpy crie label 'novo_cliente' que pede o nome com loop até preencher.",
          "Salve em $ nome_jogador.strip().",
          "Pergunte o pedido com renpy.input length=60.",
          "Ramifique com if 'café' in pedido / elif 'chá' in pedido / else.",
          "Sakura responde personalizado usando [nome_jogador] e [pedido].",
        ]}
        verify="Ao digitar 'Yumi' e depois 'café com leite', a cena imprime 'Já preparo o seu café com leite, Yumi'. Ao digitar nome vazio, a Sakura insiste."
      >
        <CodeBlock
          language="python"
          title="game/script.rpy (gabarito)"
          code={`label novo_cliente:
    scene bg cafe
    show sakura feliz
    s "Bem-vindo ao Sakura Café! Como posso te chamar?"

    $ nome_jogador = ""
    while not nome_jogador.strip():
        $ nome_jogador = renpy.input(
            "Seu nome:", length=20, exclude="{}<>").strip()
        if not nome_jogador:
            s "Não ouvi direito, pode repetir?"

    s "Prazer, [nome_jogador]! O que você gostaria?"
    $ pedido = renpy.input("Pedido:", length=60,
        default="café com leite").strip().lower() or "especial"

    if "café" in pedido or "cafe" in pedido:
        s "Já preparo o seu [pedido], [nome_jogador]!"
    elif "chá" in pedido or "cha" in pedido:
        s "Que ótima escolha de chá, [nome_jogador]!"
    else:
        s "Vou ver se temos [pedido] na cozinha, [nome_jogador]!"
    return`}
        />
      </PracticeBox>

      <OutputBlock label="cheatsheet — receber input" type="info">
{`renpy.input(prompt, default="", length=N,
            allow=str | None,
            exclude="{}",
            mask=None,
            multiline=False,
            screen="input",
            pixel_width=None) → str

→ retorna a string digitada (já SEM os chars excluídos)
→ bloqueia execução até Enter
→ NÃO levanta exceção em string vazia — você precisa validar
→ inclua o screen 'input' em screens.rpy se trocar o nome`}
      </OutputBlock>

      <AlertBox type="success" title="Combine com persistent">
        Quer que o jogador digite o nome 1x na vida? Salve em{" "}
        <code>persistent.nome_jogador</code> e na próxima execução
        pule o input se já existir. Sakura cumprimenta de volta:{" "}
        "Bem-vindo de volta, [persistent.nome_jogador]!"
      </AlertBox>
    </PageContainer>
  );
}
