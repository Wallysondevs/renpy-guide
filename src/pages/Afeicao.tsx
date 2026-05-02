import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Afeicao() {
  return (
    <PageContainer
      title="Sistema de Afeição (Love Points)"
      subtitle="O coração de toda VN romântica: variáveis ocultas que medem o quanto cada personagem gosta da heroína. Aprenda a modelar pontos, rotas, gates e finais condicionais."
      difficulty="avancado"
      timeToRead="20 min"
      prompt="avancado/afeicao"
    >
      <AlertBox type="info" title="Por que 'route system' é o cerne de uma VN">
        Em <em>Sakura Café</em> o jogador escolhe pequenas falas e ações ao
        longo de 5 capítulos. Cada escolha adiciona ou tira pontos de afeição
        de Sakura, Yuki e Akira. No fim do Cap. 4, quem tiver mais pontos
        "abre a rota" — o jogo pula para um final dedicado àquela personagem.
        Sem rotas, sua VN vira um livro linear.
      </AlertBox>

      <h2>1. Modelando os pontos</h2>
      <p>
        A forma mais limpa é um <strong>dicionário</strong> com o nome
        (ou id) da personagem como chave. Sempre use <code>default</code> —
        nunca <code>define</code> — porque os valores vão mudar e precisam
        entrar no save:
      </p>

      <CodeBlock
        language="python"
        title="game/afeicao.rpy"
        code={`# Pontos por personagem. Range sugerido: -20 (ódio) a 100 (rota aberta).
default afeicao = {
    "sakura": 0,
    "yuki":   0,
    "akira":  0,
}

# Flags de marcos importantes — separados dos pontos
default flags = {
    "viu_sakura_chorando": False,
    "leu_carta_yuki":      False,
    "ajudou_akira_chuva":  False,
    "rota_definida":       None,   # "sakura" | "yuki" | "akira" | "amizade"
}

init python:

    def somar_afeicao(quem, valor):
        """Soma valor (pode ser negativo) ao personagem."""
        if quem not in afeicao:
            raise Exception("Personagem desconhecido: " + quem)
        antes = afeicao[quem]
        afeicao[quem] = max(-20, min(100, antes + valor))
        if config.developer:
            renpy.notify("[quem] " + ("+" if valor>0 else "") + str(valor) + " (= " + str(afeicao[quem]) + ")")

    def maior_afeicao():
        """Retorna o nome da personagem com mais pontos, ou None se empate."""
        ordenado = sorted(afeicao.items(), key=lambda x: -x[1])
        if len(ordenado) >= 2 and ordenado[0][1] == ordenado[1][1]:
            return None
        return ordenado[0][0]

    def gate(quem, minimo):
        """Verifica se a rota está liberada."""
        return afeicao.get(quem, 0) >= minimo`}
      />

      <CommandTable
        title="API de afeição"
        variations={[
          {
            cmd: "$ somar_afeicao('sakura', 5)",
            desc: "Adiciona 5 pontos. Use -3 para tirar.",
            output: "Clamped entre -20 e 100. Notifica se developer=True.",
          },
          {
            cmd: "$ maior_afeicao()",
            desc: "Devolve quem está liderando a corrida romântica.",
            output: "'sakura' | 'yuki' | 'akira' | None (empate)",
          },
          {
            cmd: "if gate('sakura', 50):",
            desc: "Gate condicional para liberar uma rota.",
            output: "True se afeicao['sakura'] >= 50.",
          },
          {
            cmd: "afeicao['yuki']",
            desc: "Leitura direta dos pontos atuais.",
            output: "Retorna int.",
          },
          {
            cmd: "flags['viu_sakura_chorando'] = True",
            desc: "Marca um evento único — diferente de pontos contínuos.",
            output: "Use para gates de cena (não acumula).",
          },
        ]}
      />

      <h2>2. Mexendo nos pontos durante o diálogo</h2>

      <CodeBlock
        language="python"
        title="game/cap2_chuva.rpy"
        code={`label cap2_chuva:
    scene bg rua_chuva with fade
    show akira sad at center with dissolve
    a "Esqueci o guarda-chuva... e agora?"

    menu:
        "Oferecer o seu":
            $ somar_afeicao("akira", 8)
            $ flags["ajudou_akira_chuva"] = True
            a "Sério?! Obrigado, eu te devo essa."
            mc "Sem problema. Eu pego o ônibus na esquina."

        "Compartilhar (caminhar junto)":
            $ somar_afeicao("akira", 12)
            $ flags["ajudou_akira_chuva"] = True
            a "Hum... ok. Vamos juntos então."
            scene bg rua_chuva_close with fade
            a "..."
            mc "..."
            a "Você é mais legal do que eu pensava."

        "Ir embora rápido":
            $ somar_afeicao("akira", -3)
            mc "Tô atrasada, desculpa!"
            a "Tá... tudo bem."

    jump cap2_cafe`}
      />

      <h2>3. Choices condicionais — só aparecem se você foi querido(a)</h2>
      <p>
        A síntaxe <code>"texto" if condicao</code> dentro de um menu faz a
        opção <strong>desaparecer</strong> quando a condição é falsa. Use isso
        para esconder a fala romântica de quem ainda não te conhece direito:
      </p>

      <CodeBlock
        language="python"
        title="game/cap3_confissao.rpy"
        code={`label cap3_confissao:
    scene bg cafe_noite with fade
    show sakura blush at right with dissolve
    s "Tem uma coisa que eu queria te falar..."

    menu:
        "Ouvir com atenção":
            $ somar_afeicao("sakura", 4)
            jump cap3_confissao_continua

        "Mudar de assunto":
            $ somar_afeicao("sakura", -5)
            mc "Hum, depois a gente fala. Tô com fome."
            jump cap3_pular

        # Só aparece se afeição >= 40 — caso contrário some do menu
        "Pegar na mão dela" if gate("sakura", 40):
            $ somar_afeicao("sakura", 10)
            $ flags["sakura_mao_dada"] = True
            show sakura surprised at right with dissolve
            s "Eh?! V-você..."
            jump cap3_confissao_romance

        # Só aparece se rolou um evento prévio
        "Lembrar do hanami" if flags.get("flor_cerejeira_aceita"):
            $ somar_afeicao("sakura", 6)
            mc "Eu ainda guardo a flor que você me deu, sabia?"
            s "Você... guardou?!"`}
      />

      <h2>4. A screen de status (debug e UI opcional)</h2>
      <p>
        Durante o desenvolvimento é útil ver os pontos em tempo real. Crie
        uma screen overlay que aparece só quando <code>config.developer</code>{" "}
        é True (no build final, vira invisível automaticamente):
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy"
        code={`screen status_afeicao():
    zorder 200

    if config.developer:
        frame:
            xalign 1.0
            yalign 0.0
            xpadding 12
            ypadding 8
            background "#000000aa"

            vbox:
                spacing 4
                text "[ DEV ] Afeição" size 11 color "#ffaa00"
                for nome, pts in afeicao.items():
                    hbox:
                        spacing 8
                        text "[nome.capitalize()]:" size 12 color "#ffffff" min_width 80
                        bar:
                            value pts
                            range 100
                            xsize 120 ysize 10
                        text "[pts]" size 12 color "#88ff88" min_width 30

# Liga a screen como overlay permanente
init python:
    config.overlay_screens.append("status_afeicao")`}
      />

      <h2>5. O Branch Point — final do Cap. 4 decide a rota</h2>

      <CodeBlock
        language="python"
        title="game/cap4_decisao.rpy"
        code={`label cap4_fim:
    scene bg parque_anoitecer with fade
    "A semana terminou. Quem vai aparecer no festival amanhã?"

    # Determina rota com base nos pontos
    $ vencedor = maior_afeicao()

    if vencedor == "sakura" and gate("sakura", 50):
        $ flags["rota_definida"] = "sakura"
        jump rota_sakura

    elif vencedor == "yuki" and gate("yuki", 50):
        $ flags["rota_definida"] = "yuki"
        jump rota_yuki

    elif vencedor == "akira" and gate("akira", 50):
        $ flags["rota_definida"] = "akira"
        jump rota_akira

    else:
        # Ninguém atingiu o gate, ou empate — vira rota de amizade
        $ flags["rota_definida"] = "amizade"
        jump rota_amizade


label rota_sakura:
    scene bg festival_noite with fade
    show sakura yukata at center with dissolve
    s "Eu... esperei a semana inteira por hoje."
    "(Final Sakura — bom)"
    return

label rota_yuki:
    scene bg biblioteca_noite with fade
    show yuki smile at center with dissolve
    y "Já que você apareceu, deixa eu te mostrar uma coisa."
    "(Final Yuki — calmo)"
    return

label rota_akira:
    scene bg estacao_chuva with fade
    show akira serious at center with dissolve
    a "Vem comigo. Hoje você decide se fica ou vai."
    "(Final Akira — intenso)"
    return

label rota_amizade:
    scene bg cafe_dia with fade
    show sakura happy at left
    show yuki neutral at center
    show akira smile at right
    with dissolve
    "Ninguém ficou junto, mas todos ganharam uma família no café."
    "(Final Amizade — neutro)"
    return`}
      />

      <h2>6. Persistent: galeria de finais desbloqueados</h2>
      <p>
        Use <code>persistent</code> (mantido entre saves diferentes e até
        após desinstalar) para marcar finais que o jogador já viu. Isso
        permite uma galeria de CGs e a tradicional tela "Achievements":
      </p>

      <CodeBlock
        language="python"
        title="game/finais.rpy"
        code={`default persistent.finais_vistos = set()

label rota_sakura:
    # ... cena ...
    $ persistent.finais_vistos.add("sakura")
    return

screen menu_galeria():
    vbox:
        text "Finais desbloqueados"
        for f in ["sakura", "yuki", "akira", "amizade"]:
            if f in persistent.finais_vistos:
                textbutton "[f.capitalize()] ✓" action Start("rota_" + f)
            else:
                text "??? (jogue para descobrir)" color "#666"`}
      />

      <PracticeBox
        title="Implemente 3 escolhas que mudam a rota da Sakura"
        goal="Garantir que pontos sobem, opções condicionais aparecem e o branch funciona."
        steps={[
          "Adicione default afeicao = {'sakura': 0, 'yuki': 0, 'akira': 0} em game/afeicao.rpy.",
          "No label start, crie um menu com 3 opções que somam +5, +0 e -3 para Sakura.",
          "Crie um label cap_decisao que use if gate('sakura', 5): jump rota_sakura.",
          "Rode renpy.exe . e teste as 3 escolhas, anotando se a rota muda.",
          "Ative config.developer = True em options.rpy para ver as notificações de pontos.",
        ]}
        verify="Escolhendo +5 a rota_sakura é alcançada. Escolhendo -3, vai para o else."
      />

      <h2>7. Debugando o sistema</h2>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Console interativo dentro do jogo: Shift+O",
            cmd: "renpy.exe . --developer",
            out: `Ren'Py 8.3.3 -- iniciando Sakura Café
[developer mode = True]
Open console with Shift+O ... type: afeicao
{'sakura': 35, 'yuki': 12, 'akira': 28}
> afeicao['sakura'] = 100
> jump cap4_fim
... pulou para o final Sakura como esperado.`,
            outType: "info",
          },
          {
            comment: "lint detecta gates impossíveis (afeição máxima impossível de atingir)",
            cmd: "renpy.exe . lint",
            out: `game/cap3_confissao.rpy:18 menu has 1 unreachable choice ("Pegar na mão") — afeicao max possible is 30, gate is 40.

(esse aviso é gerado por checks customizados — Ren'Py não detecta automaticamente)`,
            outType: "warning",
          },
        ]}
      />

      <OutputBlock label="Estado típico no console no fim do Cap.3" type="success">
{`afeicao = {'sakura': 47, 'yuki': 22, 'akira': 31}
flags    = {
  'viu_sakura_chorando': True,
  'leu_carta_yuki':      False,
  'ajudou_akira_chuva':  True,
  'flor_cerejeira_aceita': True,
  'sakura_mao_dada':     False,
  'rota_definida':       None,
}`}
      </OutputBlock>

      <AlertBox type="warning" title="Não esconda totalmente os pontos">
        Jogadores ficam frustrados quando perdem uma rota sem entender o
        porquê. Mesmo que você não mostre os pontos no HUD, dê{" "}
        <strong>feedback narrativo</strong>: "Sakura te olhou desapontada", "o
        clima entre vocês esfriou", "Yuki sorriu de canto". Isso telegrafia o
        impacto sem precisar mostrar a barrinha.
      </AlertBox>

      <AlertBox type="success" title="Padrão de qualidade indie">
        VNs com 3 personagens viáveis, gate em 50 e ~12 escolhas significativas
        por rota costumam render 4-6h de gameplay com 3 finais distintos.
        Esse é o sweet spot para um primeiro projeto comercial em itch.io.
      </AlertBox>
    </PageContainer>
  );
}
