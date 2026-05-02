import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function ScreensPython() {
  return (
    <PageContainer
      title="Screens via Python — controle programático"
      subtitle="Mostrar, esconder, chamar e consultar screens diretamente do código Python (sem usar 'show screen' no .rpy). Quando você precisa de UI dinâmica baseada em condições complexas, este é o caminho."
      difficulty="avancado"
      timeToRead="14 min"
      prompt="screens/python"
    >
      <AlertBox type="info" title="Quando usar Python em vez de statements">
        Os statements <code>show screen</code>, <code>hide screen</code> e{" "}
        <code>call screen</code> são suficientes para 90% dos casos. Mas
        quando você precisa <strong>decidir em runtime</strong>: "se o
        cliente é VIP, mostro o cardápio premium; se está chovendo, mostro
        o overlay de gotas; se passou da meia-noite, mostro o HUD
        fantasma" — fazer isso via Python é mais limpo do que escrever 3
        labels diferentes.
      </AlertBox>

      <h2>1. As 4 funções principais</h2>

      <CommandTable
        title="API Python para screens"
        variations={[
          {
            cmd: "renpy.show_screen(name, *args, **kwargs)",
            desc: "Mostra um screen. Equivalente a 'show screen name(arg1=v1)'.",
            output: 'renpy.show_screen("hud_cafe")',
          },
          {
            cmd: "renpy.hide_screen(name)",
            desc: "Esconde o screen com a tag dada.",
            output: 'renpy.hide_screen("hud_cafe")',
          },
          {
            cmd: "renpy.call_screen(name, *args, **kwargs)",
            desc: "Chama um screen modal. Bloqueia até Return() ser disparado.",
            output: 'resultado = renpy.call_screen("escolher_bebida")',
          },
          {
            cmd: "renpy.get_screen(name)",
            desc: "Retorna a instância do screen ativo (ou None).",
            output: 'sc = renpy.get_screen("hud_cafe")',
          },
        ]}
      />

      <h2>2. <code>renpy.show_screen()</code> — mostrar dinamicamente</h2>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`init python:
    def entrar_no_cafe():
        # Sempre mostra o HUD
        renpy.show_screen("hud_cafe")

        # Mostra overlay especial se condições especiais
        if hora_atual >= 22:
            renpy.show_screen("overlay_noite")
        elif chovendo:
            renpy.show_screen("overlay_chuva")

        # Sakura está? Side image fica
        if sakura_no_cafe:
            renpy.show_screen("sakura_balcao")

label entrada_cafe:
    scene bg cafe with fade
    $ entrar_no_cafe()
    s "Bem-vindo de volta!"`}
      />

      <h2>3. <code>renpy.hide_screen()</code> — limpeza explícita</h2>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`init python:
    def sair_do_cafe():
        # Esconde tudo que entrar_no_cafe mostrou
        for s in ["hud_cafe", "overlay_noite", "overlay_chuva", "sakura_balcao"]:
            if renpy.get_screen(s):
                renpy.hide_screen(s)

label sair:
    $ sair_do_cafe()
    scene bg rua with fade
    "Você saiu para o frio da noite."`}
      />

      <AlertBox type="warning" title="Tag vs Name">
        <code>show_screen("inventario")</code> usa o nome como tag. Se o
        screen tiver <code>tag menu</code>, esconda usando a TAG, não o
        nome: <code>hide_screen("menu")</code>.
      </AlertBox>

      <h2>4. <code>renpy.call_screen()</code> — modal com retorno</h2>
      <p>
        Diferente de <code>show_screen</code>, <code>call_screen</code>{" "}
        <strong>bloqueia</strong> a execução até o screen retornar via{" "}
        <code>Return(valor)</code>. É a forma de criar diálogos modais
        custom (escolher bebida, digitar pedido).
      </p>

      <CodeBlock
        title="game/screens.rpy"
        language="python"
        code={`screen escolher_bebida():
    modal True
    frame:
        xalign 0.5 yalign 0.5
        padding (40, 30)

        vbox spacing 12:
            label "O que vai querer?"

            textbutton "Cappuccino tradicional":
                action Return("cappuccino")
            textbutton "Latte com matcha":
                action Return("matcha_latte")
            textbutton "Chá de cerejeira":
                action Return("cha_sakura")
            textbutton "Cancelar":
                action Return(None)`}
      />

      <CodeBlock
        title="game/script.rpy — usando o retorno"
        language="python"
        code={`label fazer_pedido:
    s "Posso anotar seu pedido?"

    # Bloqueia até o jogador clicar; recebe a string
    $ pedido = renpy.call_screen("escolher_bebida")

    if pedido is None:
        s "Sem pressa, me chame quando decidir."
        jump fim_atendimento

    if pedido == "cappuccino":
        s "Excelente escolha! Sai um cappuccino."
        $ cafes_pedidos += 1
    elif pedido == "matcha_latte":
        s "O matcha hoje veio fresquinho do Japão."
    elif pedido == "cha_sakura":
        y "Aaaah o chá de cerejeira é minha especialidade!"

    jump cena_proxima`}
      />

      <h2>5. <code>renpy.get_screen()</code> — consultar estado</h2>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`init python:
    def hud_esta_aberto():
        return renpy.get_screen("hud_cafe") is not None

    def alternar_hud():
        if hud_esta_aberto():
            renpy.hide_screen("hud_cafe")
        else:
            renpy.show_screen("hud_cafe")

# Tecla H alterna o HUD
init python:
    config.keymap["toggle_hud"] = ["h"]
    config.underlay.append(
        renpy.Keymap(toggle_hud=alternar_hud)
    )`}
      />

      <h2>6. Passagem de parâmetros</h2>

      <CodeBlock
        title="game/screens.rpy"
        language="python"
        code={`screen card_personagem(personagem, mostrar_status=True):
    frame:
        xalign 0.5 yalign 0.5
        padding (30, 20)

        vbox spacing 8:
            text personagem.name size 32 color "#ff5599"
            if personagem.imagem:
                add personagem.imagem
            if mostrar_status:
                text "Afeição: [personagem.afeicao]/100"
                text "Última conversa: [personagem.ultima_conversa]"

            textbutton "Fechar":
                action Hide("card_personagem")`}
      />

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`init python:
    class Personagem:
        def __init__(self, name, imagem):
            self.name = name
            self.imagem = imagem
            self.afeicao = 0
            self.ultima_conversa = "nunca"

    sakura_obj = Personagem("Sakura", "sakura feliz")

label ver_perfil:
    # Mostra o card com o objeto sakura como argumento
    $ renpy.show_screen("card_personagem", personagem=sakura_obj, mostrar_status=True)

    "Você abre o caderno e olha o perfil da Sakura."`}
      />

      <h2>7. Receita: HUD adaptativo ao contexto</h2>

      <CodeBlock
        title="game/init.rpy — HUD muda conforme cena"
        language="python"
        code={`init python:
    HUD_PADRAO = "hud_cafe"
    HUD_NOITE = "hud_noite"
    HUD_BATALHA = "hud_batalha"

    def trocar_hud(novo):
        # Esconde QUALQUER HUD ativo
        for h in [HUD_PADRAO, HUD_NOITE, HUD_BATALHA]:
            if renpy.get_screen(h):
                renpy.hide_screen(h)
        # Mostra o novo
        renpy.show_screen(novo)

label cena_dia:
    $ trocar_hud(HUD_PADRAO)
    "..."

label cena_noite:
    $ trocar_hud(HUD_NOITE)
    "..."

label batalha_chefao:
    $ trocar_hud(HUD_BATALHA)
    "..."`}
      />

      <h2>8. <code>renpy.restart_interaction()</code> — forçar redraw</h2>
      <p>
        Quando você muda uma variável <em>de fora</em> de um Action (em uma
        função Python triggered por timer, callback de network, etc.), o
        screen pode não notar. Force o redraw:
      </p>

      <CodeBlock
        title="game/init.rpy"
        language="python"
        code={`init python:
    def receber_pedido_online(pedido):
        store.fila_pedidos.append(pedido)
        # Sem isso, o HUD não atualiza imediatamente
        renpy.restart_interaction()

    # Exemplo: callback de timer que adiciona pedido a cada 30s
    def loop_pedidos():
        receber_pedido_online("Cappuccino sem espuma")
        renpy.restart_interaction()`}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        user="dev"
        host="vn-studio"
        lines={[
          {
            comment: "console em modo developer (Shift+O) — testando screens manualmente",
            cmd: 'renpy.show_screen("hud_cafe")',
            out: "True",
            outType: "success",
          },
          {
            cmd: 'renpy.get_screen("hud_cafe")',
            out: "<ScreenDisplayable hud_cafe>",
            outType: "info",
          },
          {
            cmd: 'renpy.hide_screen("hud_cafe")',
            out: "True",
            outType: "success",
          },
          {
            cmd: 'renpy.call_screen("escolher_bebida")',
            out: '"matcha_latte"',
            outType: "success",
          },
        ]}
      />

      <OutputBlock label="cheat sheet — screens via Python" type="info">
{`MOSTRAR        renpy.show_screen("nome", arg=val)
ESCONDER       renpy.hide_screen("tag")
MODAL+RETORNO  resultado = renpy.call_screen("nome", arg=val)
CONSULTAR      sc = renpy.get_screen("nome")        # None se inativo
LIMPAR TUDO    for s in lista: renpy.hide_screen(s)
FORÇAR REDRAW  renpy.restart_interaction()
LISTAR ATIVOS  renpy.get_displayable_layers()`}
      </OutputBlock>

      <PracticeBox
        title="Toggle de HUD com tecla H"
        goal="Criar uma função que mostra/esconde o HUD do café ao apertar H, usando renpy.show_screen e renpy.get_screen."
        steps={[
          "Em screens.rpy crie 'screen hud_cafe()' com uma frame contendo 2-3 textos.",
          "Em init.rpy crie a função 'alternar_hud()' que checa renpy.get_screen('hud_cafe').",
          "Mapeie a tecla H em config.keymap.",
          "Adicione um Keymap action no config.underlay para chamar alternar_hud.",
          "Rode o jogo, aperte H várias vezes — o HUD deve aparecer e sumir.",
        ]}
        verify="Ao apertar H, o HUD some; ao apertar de novo, volta. O console (Shift+O) mostra renpy.get_screen('hud_cafe') alternando entre None e ScreenDisplayable."
      >
        <CodeBlock
          title="game/init.rpy"
          language="python"
          code={`init python:
    def alternar_hud():
        if renpy.get_screen("hud_cafe"):
            renpy.hide_screen("hud_cafe")
        else:
            renpy.show_screen("hud_cafe")
        renpy.restart_interaction()

    config.keymap["toggle_hud"] = ["h"]
    config.underlay.append(
        renpy.Keymap(toggle_hud=alternar_hud)
    )

screen hud_cafe():
    zorder 100
    frame:
        xalign 1.0 yalign 0.0
        padding (16, 12)
        vbox:
            text "Café: [cafes_pedidos]"
            text "$ [dinheiro]"`}
        />
      </PracticeBox>

      <AlertBox type="success" title="Quando preferir Python ao statement">
        Use <strong>statements</strong> (<code>show screen</code>) para UI
        previsível e linear. Use <strong>Python</strong> quando: a decisão
        depende de runtime complexo, você precisa de retorno modal, ou
        quer encapsular abertura/fechamento de várias screens em uma
        função única reusável.
      </AlertBox>
    </PageContainer>
  );
}
