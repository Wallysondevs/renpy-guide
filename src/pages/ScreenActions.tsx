import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function ScreenActions() {
  return (
    <PageContainer
      title="Screen Actions — o que cada botão pode fazer"
      subtitle="Actions são objetos prontos do Ren'Py para usar em action= de buttons, imagebuttons e textbuttons. Em vez de escrever Python solto, você combina blocos: Show, Hide, Jump, SetVariable, Notify, Confirm, Function. Tudo já lida com rollback, save e screen reload."
      difficulty="intermediario"
      timeToRead="16 min"
      prompt="screens/actions"
    >
      <AlertBox type="info" title="Por que existem Actions?">
        Um botão precisa <strong>fazer algo quando clicado</strong>. Você
        poderia escrever <code>action Function(minha_func)</code> em tudo,
        mas o Ren'Py oferece dezenas de Actions prontas que já cuidam de
        rollback, predição, sensitividade (cinza quando indisponível) e
        integração com saves. <strong>Sempre prefira a Action pronta</strong>{" "}
        em vez de Python solto: a engine sabe otimizar.
      </AlertBox>

      <h2>1. Anatomia de um botão com Action</h2>
      <p>
        Toda Screen reativa do Sakura Café tem botões. A propriedade{" "}
        <code>action</code> aceita uma Action (ou lista de Actions, que
        rodam em sequência). O <code>hovered</code> e <code>unhovered</code>{" "}
        também aceitam Actions, para tocar SFX ou mudar variáveis ao passar
        o mouse.
      </p>

      <CodeBlock
        title="game/screens.rpy — botão básico"
        language="python"
        code={`screen botao_pedido():
    frame:
        xalign 0.5 yalign 0.9
        padding (20, 12)

        textbutton "Pedir café":
            text_size 28
            # Single Action: incrementa variável e mostra notificação
            action [
                SetVariable("cafes_pedidos", cafes_pedidos + 1),
                Notify("Pedido anotado!"),
            ]
            hovered Play("sound", "audio/hover.ogg")
`}
      />

      <h2>2. Actions de Navegação — Show, Hide, Jump, Call, Return</h2>
      <p>
        O grupo mais usado: trocar de tela, pular para um label, abrir um
        sub-menu. Todas integram com o histórico de rollback do Ren'Py.
      </p>

      <CommandTable
        title="Actions de navegação"
        variations={[
          {
            cmd: 'Show("nome_screen")',
            desc: "Mostra uma screen por cima do que está rolando.",
            output: 'action Show("inventario")',
          },
          {
            cmd: 'Hide("nome_screen")',
            desc: "Esconde uma screen específica (não fecha o resto).",
            output: 'action Hide("inventario")',
          },
          {
            cmd: 'ShowMenu("nome")',
            desc: "Abre uma seção do game_menu (save, load, preferences).",
            output: 'action ShowMenu("save")',
          },
          {
            cmd: 'Jump("label")',
            desc: "Pula para um label do script. Encerra screens transientes.",
            output: 'action Jump("rota_sakura")',
          },
          {
            cmd: 'Call("label")',
            desc: "Chama um label como sub-rotina. Volta com return.",
            output: 'action Call("cena_extra")',
          },
          {
            cmd: "Return(value=None)",
            desc: "Retorna de uma call_screen com um valor (usado em menus custom).",
            output: 'action Return("cafe_latte")',
          },
          {
            cmd: "MainMenu()",
            desc: "Volta direto pro menu principal (com confirmação opcional).",
            output: "action MainMenu(confirm=True)",
          },
          {
            cmd: "Quit()",
            desc: "Encerra o jogo. Mostra confirmação por padrão.",
            output: "action Quit(confirm=True)",
          },
        ]}
      />

      <h3>Exemplo: HUD do café com 3 botões</h3>

      <CodeBlock
        title="game/screens.rpy"
        language="python"
        code={`screen hud_cafe():
    zorder 100

    hbox:
        xalign 1.0 yalign 0.0
        spacing 8
        padding (16, 12)

        textbutton "Inventário":
            action Show("inventario")

        textbutton "Cardápio":
            action ShowMenu("cardapio")

        textbutton "Sair p/ menu":
            action MainMenu(confirm=True)
`}
      />

      <h2>3. Actions de Variáveis — SetVariable, ToggleVariable, SetField</h2>
      <p>
        Em vez de <code>action Function(lambda: setattr(...))</code>, use as
        helpers oficiais. Elas funcionam com rollback, ou seja, se o jogador
        voltar no histórico, o estado é restaurado.
      </p>

      <CommandTable
        title="Actions que mudam estado"
        variations={[
          {
            cmd: 'SetVariable("nome", valor)',
            desc: "Atribui um valor à variável global do store.",
            output: 'SetVariable("afeicao_sakura", 10)',
          },
          {
            cmd: 'ToggleVariable("nome", true_value, false_value)',
            desc: "Alterna entre dois valores. Ótimo para flags bool.",
            output: 'ToggleVariable("musica_on", True, False)',
          },
          {
            cmd: "SetField(obj, 'campo', valor)",
            desc: "Atribui um campo de um objeto Python (ex.: Character).",
            output: "SetField(persistent, 'lingua', 'pt')",
          },
          {
            cmd: "ToggleField(obj, 'campo')",
            desc: "Alterna entre True/False em um atributo.",
            output: "ToggleField(player, 'modo_chef')",
          },
          {
            cmd: "AddToSet(set, value)",
            desc: "Adiciona valor a um set persistido.",
            output: "AddToSet(persistent.cgs, 'sakura_kiss')",
          },
          {
            cmd: "RemoveFromSet(set, value)",
            desc: "Remove valor de um set.",
            output: "RemoveFromSet(persistent.flags, 'tutorial')",
          },
        ]}
      />

      <h2>4. Actions Condicionais — SensitiveIf, If</h2>
      <p>
        Botões podem ficar <em>cinza</em> (insensíveis) condicionalmente.
        Em vez de esconder, mostre cinza para indicar "tem essa opção, mas
        ainda não desbloqueada".
      </p>

      <CodeBlock
        title="game/screens.rpy"
        language="python"
        code={`default cafes_pedidos = 0
default afeicao_sakura = 0

screen acoes_cafe():
    vbox:
        xalign 0.5 yalign 0.5 spacing 12

        # Só pode pedir se tem dinheiro
        textbutton "Pedir café (R$ 8)":
            sensitive (carteira >= 8)
            action [
                SetVariable("carteira", carteira - 8),
                SetVariable("cafes_pedidos", cafes_pedidos + 1),
                Notify("Café anotado!"),
            ]

        # Conversa com Sakura só se afeição >= 5
        textbutton "Conversar com Sakura":
            action If(
                afeicao_sakura >= 5,
                true=Jump("conversa_sakura"),
                false=Notify("Você ainda não conhece bem a Sakura."),
            )

        # SensitiveIf: força sensitive baseado em condição
        textbutton "Confessar":
            action SensitiveIf(afeicao_sakura >= 50)
            action Jump("confissao")
`}
      />

      <AlertBox type="warning" title="Diferença entre sensitive e SensitiveIf">
        <code>sensitive cond</code> (propriedade do botão) controla
        visualmente se está clicável. <code>SensitiveIf(cond)</code>{" "}
        (Action) faz a Action seguinte só rodar se a condição for verdadeira
        — útil quando você quer botão clicável mas Action que depende de
        runtime.
      </AlertBox>

      <h2>5. Actions de Feedback — Notify, Confirm, Function</h2>

      <CodeBlock
        title="game/screens.rpy — feedback ao jogador"
        language="python"
        code={`init python:
    def servir_cafe_func(tipo):
        renpy.notify("Servindo " + tipo + "...")
        renpy.sound.play("audio/cafe_pour.ogg")
        store.cafes_servidos += 1

screen menu_servir():
    vbox:
        xalign 0.5 spacing 8

        # Notify: pop-up rápido no canto da tela
        textbutton "Tocar sino":
            action Notify("Ding! Cliente avisado.")

        # Confirm: caixa de diálogo modal Sim/Não
        textbutton "Fechar o café":
            action Confirm(
                "Tem certeza que quer fechar o café antes do horário?",
                yes=Jump("fim_dia"),
                no=NullAction(),
            )

        # Function: chama qualquer função Python
        textbutton "Servir cappuccino":
            action Function(servir_cafe_func, "cappuccino")

        # NullAction: não faz nada (placeholder)
        textbutton "Em breve":
            action NullAction()
            sensitive False
`}
      />

      <h2>6. Combinando Actions em lista</h2>
      <p>
        <code>action</code> aceita uma <strong>lista</strong> — todas as
        Actions rodam em ordem, no mesmo clique. Ótimo para "incrementa
        contador + toca som + mostra notificação + esconde screen".
      </p>

      <CodeBlock
        title="game/screens.rpy"
        language="python"
        code={`screen pedido_completo():
    textbutton "Entregar pedido":
        action [
            Play("sound", "audio/coin.ogg"),
            SetVariable("dinheiro", dinheiro + 8),
            SetVariable("pedidos_entregues", pedidos_entregues + 1),
            Notify("+ R$ 8,00"),
            Hide("pedido_completo"),
            If(pedidos_entregues >= 10, true=Jump("conquista_chef")),
        ]
`}
      />

      <h2>7. Actions de Áudio</h2>

      <CommandTable
        title="Controle de áudio direto do botão"
        variations={[
          {
            cmd: 'Play("channel", "arquivo")',
            desc: "Toca som no canal especificado.",
            output: 'Play("sound", "audio/sino.ogg")',
          },
          {
            cmd: 'Stop("channel")',
            desc: "Para o áudio do canal.",
            output: 'Stop("music", fadeout=2.0)',
          },
          {
            cmd: 'Queue("channel", "arquivo")',
            desc: "Enfileira após a faixa atual.",
            output: 'Queue("music", "audio/proxima.ogg")',
          },
          {
            cmd: "SetMute(channel, mute)",
            desc: "Muta/desmuta canal.",
            output: 'SetMute("music", True)',
          },
        ]}
      />

      <h2>8. Predicao e performance</h2>
      <p>
        Actions são objetos imutáveis. O Ren'Py reusa instâncias entre
        frames se nada muda — por isso evite criar Actions com lambdas em
        loop, isso quebra a otimização. Prefira <code>Function(meu_func, arg)</code>{" "}
        em vez de <code>Function(lambda: meu_func(arg))</code>.
      </p>

      <Terminal
        path="~/projetos/sakura-cafe"
        user="dev"
        host="vn-studio"
        lines={[
          {
            comment: "lint detecta Action mal-formada (ex.: Jump sem label)",
            cmd: "renpy.exe . lint",
            out: `game/screens.rpy:42 Jump("rota_yuki") references undefined label.

Statistics:
  Screens: 12
  Actions referenced: 38
Lint took 0.55s.`,
            outType: "warning",
          },
        ]}
      />

      <OutputBlock label="cheat sheet — Actions essenciais" type="info">
{`NAVEGAÇÃO    Show / Hide / ShowMenu / Jump / Call / Return / MainMenu / Quit
VARIÁVEL     SetVariable / ToggleVariable / SetField / ToggleField
COLEÇÃO      AddToSet / RemoveFromSet / SetDict
CONDICIONAL  If(cond, true=A, false=B) / SensitiveIf(cond)
FEEDBACK     Notify / Confirm / Function / NullAction
ÁUDIO        Play / Stop / Queue / SetMute
SAVE         FileSave(slot) / FileLoad(slot) / FileDelete(slot)`}
      </OutputBlock>

      <PracticeBox
        title="HUD do café com 3 ações combinadas"
        goal="Criar uma screen com 3 botões: pedir café (consome dinheiro), conversar (só se afeição >= 5) e fechar café (com confirmação)."
        steps={[
          "Em screens.rpy crie 'screen hud_cafe():'.",
          "Use 'default carteira = 20' e 'default afeicao_sakura = 3' antes do screen.",
          "Botão 1: 'Pedir café' com lista de actions [SetVariable, Notify].",
          "Botão 2: 'Conversar' com If(afeicao_sakura >= 5, true=Jump, false=Notify).",
          "Botão 3: 'Fechar' com Confirm() perguntando antes.",
          "No label start, 'show screen hud_cafe' antes da primeira fala.",
        ]}
        verify="Os 3 botões aparecem no HUD; o de conversar mostra uma notify se afeição < 5; o de fechar abre uma caixa modal com Sim/Não."
      >
        <CodeBlock
          title="game/screens.rpy (gabarito)"
          language="python"
          code={`default carteira = 20
default afeicao_sakura = 3

screen hud_cafe():
    zorder 100
    hbox:
        xalign 1.0 yalign 0.0 spacing 8 padding (16, 12)

        textbutton "Pedir café":
            sensitive (carteira >= 8)
            action [
                SetVariable("carteira", carteira - 8),
                Notify("Café servido!"),
            ]

        textbutton "Conversar":
            action If(
                afeicao_sakura >= 5,
                true=Jump("conversa_sakura"),
                false=Notify("Vocês ainda mal se conhecem."),
            )

        textbutton "Fechar":
            action Confirm(
                "Fechar o café antes do horário?",
                yes=Jump("fim_dia"),
            )
`}
        />
      </PracticeBox>

      <AlertBox type="success" title="Próximo passo">
        Agora que você sabe o que botões podem FAZER, veja{" "}
        <strong>Screens Especiais</strong> para descobrir os screens
        reservados (say, choice, main_menu, save, load) que você pode
        sobrescrever para customizar TODA a interface do Sakura Café.
      </AlertBox>
    </PageContainer>
  );
}
