import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Voice() {
  return (
    <PageContainer
      title="Voz — dublagem linha-a-linha"
      subtitle="Voice acting no Ren'Py: sintaxe voice, voice sustain, voice_tag por personagem, auto_voice automático e organização de pastas. Da prova de conceito com 3 falas até uma VN inteira dublada."
      difficulty="intermediario"
      timeToRead="12 min"
      prompt="audio-e-voz/voz"
    >
      <AlertBox type="info" title="Por que vale a pena dublar uma VN">
        VNs dubladas vendem em média 3x mais que VNs sem voz. A dublagem cria
        intimidade — o jogador <em>ouve</em> a Sakura, não só lê. Mesmo
        dublagem parcial (só os momentos importantes) já eleva a percepção
        de qualidade. Esta página mostra do <code>voice</code> mais simples
        até o sistema <code>auto_voice</code> que mapeia falas
        automaticamente.
      </AlertBox>

      <h2>1. A sintaxe básica — voice</h2>
      <p>
        Antes de qualquer linha de diálogo, você adiciona o statement{" "}
        <code>voice</code> apontando para o arquivo de áudio. O Ren'Py toca o
        áudio assim que a fala aparece, e silencia automaticamente na próxima
        linha:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`define s = Character("Sakura", color="#ffaacc")
define a = Character("Akira",  color="#88c0ff")

label cena_apresentacao:
    scene bg cafe
    show sakura happy
    with dissolve

    voice "voice/sakura/sak_001.ogg"
    s "Bem-vindo(a) ao Sakura Café! Eu sou a Sakura."

    voice "voice/sakura/sak_002.ogg"
    s "É o seu primeiro dia, certo? Vou te mostrar tudo."

    show akira neutro at right
    with moveinright

    voice "voice/akira/aki_001.ogg"
    a "Sakura, o cappuccino da mesa 4 já saiu?"

    voice "voice/sakura/sak_003.ogg"
    s "Já vai, Akira-kun!"

    return`}
      />

      <AlertBox type="warning" title="O áudio para sozinho">
        Não precisa dar <code>stop voice</code>. Toda vez que aparece um novo{" "}
        <code>voice</code> (ou o jogador avança a fala), o áudio anterior é
        cortado. Isso é o comportamento certo para 99% dos casos.
      </AlertBox>

      <h2>2. Mantendo a voz tocando — voice sustain</h2>
      <p>
        Às vezes você quer que a mesma fala continue tocando por DUAS linhas
        de diálogo (a personagem suspira longamente enquanto narra). Use{" "}
        <code>voice sustain</code>:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label cena_suspiro:
    voice "voice/sakura/sak_suspiro.ogg"
    s "Ahhh..."

    voice sustain
    s "Esse cliente da mesa 7 me deixa exausta."

    # próxima fala já corta o suspiro normalmente
    s "Mas faz parte do trabalho."
    return`}
      />

      <h2>3. voice_tag — apelidos por personagem</h2>
      <p>
        Cada personagem pode ter seu próprio <strong>voice_tag</strong>. Isso
        permite ao jogador <strong>silenciar a voz de uma personagem
        específica</strong> nas preferências (alguns jogadores não suportam a
        voz de um VA específico — comum em VNs japonesas):
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`define s = Character(
    "Sakura",
    color="#ffaacc",
    voice_tag="sakura",
)

define a = Character(
    "Akira",
    color="#88c0ff",
    voice_tag="akira",
)

define m = Character(
    "Mei",
    color="#ffd166",
    voice_tag="mei",
)`}
      />

      <CodeBlock
        language="python"
        title="game/screens.rpy — adicionando toggle no menu de preferências"
        code={`screen preferences():
    tag menu

    use game_menu(_("Preferências"), scroll="viewport"):

        vbox:
            spacing 15

            label _("Volume da Voz por Personagem")

            hbox:
                textbutton _("Sakura"):
                    action ToggleVoiceMute("sakura")
                textbutton _("Akira"):
                    action ToggleVoiceMute("akira")
                textbutton _("Mei"):
                    action ToggleVoiceMute("mei")`}
      />

      <h2>4. auto_voice — mapeamento automático</h2>
      <p>
        Imagine ter que escrever <code>voice "..."</code> antes de{" "}
        <strong>2.000</strong> linhas de diálogo. Não dá. O Ren'Py oferece
        <code>auto_voice</code>: ele gera o caminho do arquivo a partir de
        um <strong>identificador único</strong> de cada fala (gerado pelo
        <code>renpy.exe . dialogue</code>).
      </p>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`init python:
    # template do caminho — {id} é substituído pelo ID da fala
    config.auto_voice = "voice/{id}.ogg"

    # ou versão por idioma (PT-BR vs EN)
    # config.auto_voice = "voice/{language}/{id}.ogg"`}
      />

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Gerar IDs únicos para cada fala (cria game/dialogue.tab)",
            cmd: "renpy.exe . dialogue",
            out: `Generated dialogue file: game/dialogue.tab
Found 1842 dialogue lines.
Tagged 1842 lines with unique IDs.
Done.`,
            outType: "success",
          },
        ]}
      />

      <p>
        Depois disso, basta nomear os arquivos como{" "}
        <code>game/voice/start_001.ogg</code>, <code>start_002.ogg</code>,
        etc., correspondendo aos IDs da coluna <code>identifier</code> do{" "}
        <code>dialogue.tab</code>. O Ren'Py toca cada fala
        automaticamente.
      </p>

      <OutputBlock label="game/dialogue.tab (extrato)" type="info">
{`Identifier            What                                 Who
start_0001            Bem-vindo(a) ao Sakura Café!         Sakura
start_0002            É o seu primeiro dia, certo?          Sakura
start_0003            Sakura, o cappuccino da mesa 4?       Akira
start_0004            Já vai, Akira-kun!                    Sakura
cena_chuva_0001       Achei que ia ser um dia bom...        Yuki`}
      </OutputBlock>

      <h2>5. Tabela completa de comandos</h2>

      <CommandTable
        title="Statements de voz"
        variations={[
          {
            cmd: 'voice "arquivo.ogg"',
            desc: "Toca o arquivo na PRÓXIMA linha de diálogo.",
            output: "O áudio é cortado quando a próxima fala aparece.",
          },
          {
            cmd: "voice sustain",
            desc: "Mantém o áudio anterior tocando durante a próxima fala.",
            output: "Útil para suspiros longos ou risadas que cobrem 2 linhas.",
          },
          {
            cmd: 'play voice "arquivo.ogg"',
            desc: "Toca imediatamente, sem esperar a próxima fala (modo manual).",
            output: "Ignora o sistema voice_tag e auto_voice.",
          },
          {
            cmd: "stop voice",
            desc: "Silencia o canal voice na hora.",
            output: "Útil quando uma cinemática começa.",
          },
          {
            cmd: 'voice "arq.ogg" volume 0.7',
            desc: "Toca a 70% do volume (multiplicado pelo mixer voice).",
            output: "Útil para sussurros.",
          },
          {
            cmd: "config.auto_voice = \"voice/{id}.ogg\"",
            desc: "Ativa o mapeamento automático por ID de fala.",
            output: "Funciona em conjunto com renpy.exe . dialogue.",
          },
          {
            cmd: 'voice_tag="sakura"',
            desc: "Marca todas as falas da personagem com a tag — permite mute por VA.",
            output: "Vai dentro do define Character(...).",
          },
        ]}
      />

      <h2>6. Organização recomendada de pastas</h2>

      <CodeBlock
        language="bash"
        title="Estrutura sugerida"
        code={`game/
├── audio/
│   ├── music/
│   │   ├── cafe_jazz.ogg
│   │   ├── sakura_theme.ogg
│   │   └── akira_theme.ogg
│   ├── sfx/
│   │   ├── sino_porta.ogg
│   │   └── xicara.ogg
│   └── amb/
│       └── chuva_forte.ogg
├── voice/
│   ├── sakura/
│   │   ├── sak_001.ogg
│   │   ├── sak_002.ogg
│   │   └── sak_suspiro.ogg
│   ├── akira/
│   │   └── aki_001.ogg
│   └── mei/
│       └── mei_001.ogg
└── script.rpy`}
      />

      <h2>7. Validando com lint</h2>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Lint detecta voices ausentes",
            cmd: "renpy.exe . lint",
            out: `Ren'Py 8.2.3 lint report, generated 2026-04-25 15:14

game/script.rpy:88 Voice file 'voice/sakura/sak_007.ogg' is not loadable.
game/script.rpy:142 Voice file 'voice/akira/aki_004.ogg' is not loadable.

Statistics:
  Words of dialogue: 1842
  Voice files: 38 (2 missing!)`,
            outType: "warning",
          },
        ]}
      />

      <h2>8. Dublagem parcial (só momentos-chave)</h2>
      <p>
        Você não precisa dublar TUDO. A maioria das VNs ocidentais dubla só:
      </p>
      <ul>
        <li>A primeira fala de cada personagem (apresentação).</li>
        <li>Confissões e momentos românticos.</li>
        <li>Cenas de tensão dramática (briga, despedida).</li>
        <li>Os finais das rotas.</li>
      </ul>
      <p>
        Isso reduz o orçamento em 70% sem perder o impacto. Use{" "}
        <code>voice "..."</code> só onde importa — o resto fica no silêncio
        confortável.
      </p>

      <PracticeBox
        title="Gravar e mapear 3 falas da Sakura"
        goal="Adicionar dublagem nas 3 falas iniciais da Sakura, validando com lint."
        steps={[
          "Grave (ou use TTS de teste como ttsmaker.com / elevenlabs) 3 áudios curtos: 'Bem-vindo(a) ao Sakura Café', 'É o seu primeiro dia, certo?' e 'Já vai, Akira-kun!'",
          "Salve como game/voice/sakura/sak_001.ogg, sak_002.ogg, sak_003.ogg (converta para OGG com Audacity se precisar).",
          "Adicione voice_tag=\"sakura\" no define s = Character(...).",
          "Antes de cada fala da Sakura no script, adicione voice \"voice/sakura/sak_NNN.ogg\".",
          "Rode renpy.exe . lint e confirme que aparece 'Voice files: 3' sem missing.",
          "Inicie o jogo: a Sakura deve falar nas 3 linhas e silenciar nas demais.",
        ]}
        verify="As 3 primeiras falas reproduzem o áudio gravado e cortam exatamente quando o jogador clica para avançar."
      />

      <AlertBox type="warning" title="Direitos autorais e contratos com VAs">
        Voice actors (VAs) profissionais cobram por <strong>linha</strong> ou
        por <strong>hora de estúdio</strong> e exigem contrato escrito que
        cubra: uso comercial, royalties, direito a reuso em DLCs e remoção
        em caso de cancelamento. Nunca publique uma VN com voz de IA sem
        consentimento explícito da pessoa cuja voz foi clonada — isso é
        crime em vários países e fere o ToS de Steam/itch.io.
      </AlertBox>

      <PracticeBox
        title="Migrar para auto_voice"
        goal="Substituir todos os voice manuais pelo sistema automático baseado em ID."
        steps={[
          "Em options.rpy, adicione config.auto_voice = \"voice/{id}.ogg\".",
          "Rode renpy.exe . dialogue para gerar game/dialogue.tab com IDs únicos.",
          "Renomeie seus arquivos de voz para baterem com os IDs (ex: start_0001.ogg).",
          "Remova as linhas voice \"...\" manuais — o auto_voice toma o controle.",
          "Rode renpy.exe . lint para conferir que todos os IDs têm áudio correspondente.",
        ]}
        verify="O jogo toca a voz correta em cada linha sem você precisar declarar voice manualmente."
      />
    </PageContainer>
  );
}
