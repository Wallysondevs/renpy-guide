import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function NVL() {
  return (
    <PageContainer
      title="Modo NVL — Texto em página cheia"
      subtitle="ADV (caixa no rodapé) é o padrão das VNs modernas; NVL ocupa a tela inteira como um livro. Saiba quando usar cada um, como alternar e como customizar."
      difficulty="intermediario"
      timeToRead="15 min"
      prompt="interface/nvl"
    >
      <AlertBox type="info" title="ADV vs NVL — o que é cada um?">
        <strong>ADV</strong> (Advanced — padrão): pequena caixa de diálogo no
        rodapé, sprites visíveis, ritmo cinematográfico. Usado em{" "}
        <em>Steins;Gate</em> e <em>Doki Doki Literature Club</em>.<br />
        <strong>NVL</strong> (Novel): texto cobre quase toda a tela como um
        livro. Múltiplas falas se acumulam. Ótimo para narrativa densa, prólogos
        e flashbacks. Usado em <em>Higurashi</em> e <em>Umineko</em>.
      </AlertBox>

      <h2>1. Definindo um personagem NVL</h2>
      <p>
        Crie personagens com <code>kind=nvl</code> ao lado dos personagens
        normais. Mantenha um narrador NVL chamado <code>n</code> ou{" "}
        <code>nvl_narrator</code> para a voz de fundo, e versões NVL das
        protagonistas para alternar:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy — definições"
        code={`## Personagens em modo ADV (padrão)
define s = Character("Sakura", color="#ff86b0")
define y = Character("Yuki",   color="#7fc8ff")

## Versões NVL das mesmas personagens (mesmas cores)
define s_nvl = Character("Sakura", color="#ff86b0", kind=nvl)
define y_nvl = Character("Yuki",   color="#7fc8ff", kind=nvl)

## Narrador NVL (sem nome) — para prólogos
define n = Character(kind=nvl, what_color="#fff5f9")
`}
      />

      <h2>2. Estrutura de uma cena em NVL</h2>
      <CodeBlock
        language="python"
        title="game/script.rpy — prólogo em NVL"
        code={`label prologo:
    scene bg cafe_noite with fade

    nvl clear      ## limpa a "página"

    n "O Sakura Café fica numa rua estreita de Akihabara, escondido entre uma loja de mangás usados e uma máquina de bebidas."
    n "À noite, quando as luzes de neon refletem na calçada molhada, o lugar parece pequeno demais para abrigar tantos segredos."
    n "Você abriu a porta pela primeira vez em uma sexta-feira, no fim do outono."

    nvl clear      ## próxima "página"

    s_nvl "Bem-vindo!"
    s_nvl "Sente-se onde quiser. Aceita um pedido sugestão da casa?"
    y_nvl "..."
    y_nvl "Não responde, Yuki. Ela é tímida — e o frio também não ajuda."

    nvl clear

    "Você escolheu uma mesa perto da janela. Lá fora, começava a chover."

    window hide
    scene bg cafe_dia with fade
    jump capitulo1
`}
      />

      <CommandTable
        title="Comandos do modo NVL"
        variations={[
          { cmd: "nvl clear", desc: "Limpa a página atual e começa uma nova.", output: "Equivale a virar a página." },
          { cmd: "nvl show dissolve", desc: "Mostra a janela NVL com transição.", output: "Útil ao entrar no modo." },
          { cmd: "nvl hide dissolve", desc: "Esconde a janela NVL.", output: "Bom antes de voltar para ADV." },
          { cmd: "window hide", desc: "Esconde qualquer janela (ADV ou NVL).", output: "Antes de uma cena visual longa." },
          { cmd: "window show", desc: "Mostra a janela atual.", output: "Reabre depois de window hide." },
          { cmd: "nvl_clear_next()", desc: "Função Python: agenda clear no próximo diálogo.", output: "$ nvl_clear_next()" },
        ]}
      />

      <h2>3. Menu em NVL</h2>
      <p>
        Para que as escolhas sejam exibidas dentro da página NVL (e não como um
        menu flutuante padrão), use <code>menu (nvl=True)</code> ou defina o
        config global:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy — menu integrado ao NVL"
        code={`define menu = nvl_menu     ## (em init) torna TODOS os menus em NVL

label decisao_chuva:
    n "A chuva ficou mais forte. Sakura te olha, esperando uma resposta."

    menu (nvl=True):
        n "Você pede mais um café?"

        "Sim, com leite de aveia.":
            $ afeicao_sakura += 5
            jump conversa_longa

        "Não, preciso ir para casa.":
            jump despedida_chuva
`}
      />

      <h2>4. Customizando a aparência do NVL</h2>
      <p>
        A aparência vem do <code>screen nvl</code> (em <code>screens.rpy</code>)
        e dos estilos <code>nvl_window</code>, <code>nvl_dialogue</code>,{" "}
        <code>nvl_label</code>. Para mudar o fundo da página NVL, edite o
        background da screen:
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy — customizando o fundo NVL"
        code={`screen nvl(dialogue, items=None):
    window:
        style "nvl_window"

        ## Fundo customizado (ex.: papel manuscrito do café)
        background "gui/nvl_paper.png"

        has vbox:
            spacing gui.nvl_spacing

        ## Renderiza cada bloco de diálogo
        use nvl_dialogue(dialogue)

        ## Renderiza menu (se houver)
        if items:
            vbox:
                id "menu"
                for i in items:
                    textbutton i.caption:
                        action i.action
                        style "nvl_button"

style nvl_window is default:
    xfill True
    yfill True
    background "#1a0d14ee"

style nvl_dialogue is say_dialogue:
    color "#fff5f9"
    size 32
    line_leading 6
    line_spacing 8
`}
      />

      <h2>5. Quando usar NVL na sua VN</h2>
      <ul>
        <li>
          <strong>Prólogos e epílogos</strong> — quando você quer dar peso
          narrativo, sem distrações de sprites.
        </li>
        <li>
          <strong>Flashbacks</strong> — costuma ser feito com NVL + filtro
          sépia ou preto-e-branco.
        </li>
        <li>
          <strong>Cartas e diários</strong> — leitura de uma carta da Hana
          deixada na mesa, por exemplo.
        </li>
        <li>
          <strong>Monólogos internos longos</strong> — quando o(a)
          protagonista pensa por várias linhas seguidas.
        </li>
      </ul>

      <PracticeBox
        title="Alternar ADV → NVL → ADV num único label"
        goal="Criar uma cena que começa em ADV, vira NVL para um flashback e volta a ser ADV."
        steps={[
          "Defina s e s_nvl em script.rpy (cole o código abaixo).",
          "Crie o label memoria_sakura com a transição.",
          "Adicione 'jump memoria_sakura' em algum ponto do start.",
          "Rode com renpy.exe e verifique que window hide/nvl clear funcionam corretamente.",
        ]}
      >
        <CodeBlock
          language="python"
          title="game/script.rpy"
          code={`label memoria_sakura:
    scene bg cafe_dia
    show sakura sorrindo at right
    s "Você quer ouvir como abri esse café?"
    "Você concorda."

    window hide
    scene bg sepia with fade
    nvl show dissolve
    nvl clear

    s_nvl "Era 2018. Eu tinha vinte e um anos e nenhum plano."
    s_nvl "A vovó Hana me deixou esse espaço em troca de uma promessa boba."
    s_nvl "Eu prometi que sempre teria torta de morango no cardápio."

    nvl clear
    s_nvl "Foi uma promessa fácil de cumprir."

    nvl hide dissolve
    scene bg cafe_dia with fade
    show sakura sorrindo at right
    s "...e foi assim que tudo começou."
    return`}
        />
      </PracticeBox>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          { comment: "lint específico para checar uso de NVL", cmd: "renpy.exe . lint", out: `Lint is checking sakura-cafe...
script.rpy:142: info: nvl block detected, 7 lines accumulated before nvl clear
Lint took 0.5 seconds.`, outType: "info" },
        ]}
      />

      <AlertBox type="warning" title="Não esqueça do nvl clear">
        Sem <code>nvl clear</code>, o texto se acumula página após página até
        sair da tela e gerar scroll automático — péssimo para legibilidade.
        Como regra: <strong>1 nvl clear a cada 4-6 falas</strong>.
      </AlertBox>

      <AlertBox type="info" title="Voltando ao ADV no meio da história">
        Para parar de usar NVL no meio de uma cena, basta usar{" "}
        <code>nvl hide</code> e voltar a falar com personagens definidos sem{" "}
        <code>kind=nvl</code>. O Ren'Py alterna sozinho entre as duas screens.
      </AlertBox>
    </PageContainer>
  );
}
