import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Saves() {
  return (
    <PageContainer
      title="Saves — slots, autosave, persistent e rollback"
      subtitle="Como o Ren'Py salva o estado do jogo, onde os arquivos vivem, como customizar slots, criar quicksave/autosave e usar 'persistent' para guardar dados entre partidas. Inclui dicas sobre rollback e screenshots."
      difficulty="iniciante"
      timeToRead="14 min"
      prompt="logica/saves"
    >
      <AlertBox type="info" title="Por que saves importam tanto numa VN longa">
        Uma VN com 4 horas de leitura e múltiplos finais é injogável sem um
        sistema de saves robusto. Felizmente, o Ren'Py oferece tudo de graça:
        slots ilimitados, autosave, quicksave, rollback. Você só precisa
        entender o que cada coisa faz para customizar bem.
      </AlertBox>

      <h2>1. Como o Ren'Py salva o estado</h2>
      <p>
        Quando o jogador clica em &quot;Salvar&quot;, o Ren'Py captura{" "}
        <strong>todas as variáveis declaradas com <code>default</code></strong>
        , o ponto exato no script (label e linha), a pilha de chamadas
        (<code>call</code> stack) e uma screenshot da tela. Isso vai para um
        arquivo <code>.save</code> dentro da pasta de saves do sistema
        operacional.
      </p>

      <CommandTable
        title="Onde os saves vivem em cada sistema"
        variations={[
          {
            cmd: "Windows",
            desc: "Pasta padrão de saves",
            output: "%APPDATA%/RenPy/SakuraCafe-1.0/",
          },
          {
            cmd: "macOS",
            desc: "Pasta padrão de saves",
            output: "~/Library/RenPy/SakuraCafe-1.0/",
          },
          {
            cmd: "Linux",
            desc: "Pasta padrão de saves",
            output: "~/.renpy/SakuraCafe-1.0/",
          },
          {
            cmd: "Android",
            desc: "Sandbox interno do app",
            output: "/data/data/org.renpy.sakuracafe/files/saves/",
          },
          {
            cmd: "Web",
            desc: "IndexedDB do navegador",
            output: "Não sai do navegador — limpar dados apaga os saves.",
          },
        ]}
      />

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/.renpy/SakuraCafe-1.0"
        lines={[
          {
            comment: "Listar saves de uma VN no Linux",
            cmd: "ls -lh saves/",
            out: `total 280K
-rw-r--r-- 1 dev dev  42K Apr 12 14:18 1-1-LT1.save
-rw-r--r-- 1 dev dev  44K Apr 12 14:32 1-2-LT1.save
-rw-r--r-- 1 dev dev  41K Apr 12 15:01 auto-1-LT1.save
-rw-r--r-- 1 dev dev  43K Apr 12 15:18 quick-LT1.save
-rw-r--r-- 1 dev dev 8.2K Apr 12 15:18 persistent`,
            outType: "info",
          },
          {
            comment: "Cada slot tem um screenshot embutido (PNG no zip)",
            cmd: "unzip -l saves/1-1-LT1.save | head",
            out: `Archive:  saves/1-1-LT1.save
  Length      Date    Time    Name
---------  ---------- -----   ----
    24582  04-12-2026 14:18   log
     4128  04-12-2026 14:18   signatures
    36821  04-12-2026 14:18   screenshot.png
       58  04-12-2026 14:18   json`,
            outType: "muted",
          },
        ]}
      />

      <h2>2. Tipos de save</h2>

      <CommandTable
        title="Categorias de save no Ren'Py"
        variations={[
          {
            cmd: "Manual (slots numerados)",
            desc: "O jogador clica em Salvar e escolhe um slot da grade.",
            output: "Arquivos: 1-1-LT1.save, 1-2-LT1.save, 2-3-LT1.save...",
          },
          {
            cmd: "Quicksave",
            desc: "Salva no único slot rápido (tecla F5 por padrão).",
            output: "Arquivo: quick-LT1.save",
          },
          {
            cmd: "Autosave",
            desc: "Salva automaticamente em pontos seguros do script.",
            output: "Arquivos: auto-1-LT1.save (rotaciona em 3 slots).",
          },
          {
            cmd: "persistent",
            desc: "Dados que sobrevivem a Novo Jogo (galerias, finais).",
            output: "Arquivo: persistent (binário pickle).",
          },
        ]}
      />

      <h2>3. Configurando saves no options.rpy</h2>
      <p>
        Quase tudo é controlado por flags em <code>game/options.rpy</code> ou
        <code> gui.rpy</code>. Aqui estão as mais úteis:
      </p>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`# === Quantidade de slots por página de save ===
define config.thumbnail_width = 384
define config.thumbnail_height = 216

# === Autosave ===
define config.has_autosave = True       # ativa autosave (default: True)
define config.autosave_slots = 3        # quantos slots rotativos
define config.autosave_frequency = 200  # a cada N statements

# === Quicksave ===
define config.has_quicksave = True

# === Rollback (voltar no tempo) ===
define config.rollback_enabled = True
define config.hard_rollback_limit = 100  # até onde rolar para trás
define config.rollback_length = 128       # quantas ações guardar

# === Tela inicial mostra o save mais recente? ===
define config.has_main_menu_continue = True`}
      />

      <h2>4. Persistent — dados que vivem além do save</h2>
      <p>
        Use <code>persistent.algo</code> para guardar coisas que devem
        sobreviver mesmo quando o jogador apaga todos os saves: galerias
        desbloqueadas, finais alcançados, achievements, contagem de partidas.
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`default persistent.finais_vistos = set()
default persistent.cgs_desbloqueados = set()
default persistent.partidas_terminadas = 0
default persistent.melhor_afeicao_sakura = 0

label final_sakura:
    scene bg final_sakura with fade
    s "Eu te amo. Sempre te amei."

    # Marca o final como visto
    $ persistent.finais_vistos.add("sakura")
    $ persistent.cgs_desbloqueados.add("cg_beijo_sakura")
    $ persistent.partidas_terminadas += 1

    # Recorde de afeição
    if afeicao_sakura > persistent.melhor_afeicao_sakura:
        $ persistent.melhor_afeicao_sakura = afeicao_sakura

    "FIM — Rota Sakura"
    return`}
      />

      <AlertBox type="warning" title="Persistent não rola rollback">
        Diferente das variáveis normais, <code>persistent</code> escreve no
        disco imediatamente e não pode ser desfeita por rollback. Se você
        marcar um final como visto e depois o jogador rolar para trás e
        escolher diferente, o final continuará marcado. Use com consciência.
      </AlertBox>

      <h2>5. Screen de galeria com persistent</h2>
      <p>
        Combine <code>persistent</code> com uma <code>screen</code> para
        criar uma galeria que destrava CGs conforme o jogador alcança finais:
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy"
        code={`screen galeria():
    tag menu
    use game_menu(_("Galeria"), scroll="viewport"):

        grid 3 2:
            xfill True
            spacing 12

            # CG 1 — Sakura beijo
            if "cg_beijo_sakura" in persistent.cgs_desbloqueados:
                imagebutton:
                    idle "images/cg/cg_beijo_sakura.png"
                    action ShowMenu("ver_cg", "cg_beijo_sakura")
            else:
                add "images/cg/locked.png"

            # CG 2 — Akira na chuva
            if "cg_akira_chuva" in persistent.cgs_desbloqueados:
                imagebutton:
                    idle "images/cg/cg_akira_chuva.png"
                    action ShowMenu("ver_cg", "cg_akira_chuva")
            else:
                add "images/cg/locked.png"

            # CG 3 — Festival
            if "cg_festival" in persistent.cgs_desbloqueados:
                imagebutton:
                    idle "images/cg/cg_festival.png"
                    action ShowMenu("ver_cg", "cg_festival")
            else:
                add "images/cg/locked.png"`}
      />

      <h2>6. Funções programáticas de save</h2>

      <CommandTable
        title="API de saves do Ren'Py"
        variations={[
          {
            cmd: "renpy.save(slotname)",
            desc: "Salva no slot especificado",
            output: 'Ex: $ renpy.save("checkpoint_cap2", extra_info="Antes do festival")',
          },
          {
            cmd: "renpy.load(slotname)",
            desc: "Carrega o save do slot",
            output: 'Ex: $ renpy.load("checkpoint_cap2")',
          },
          {
            cmd: "renpy.list_saved_games()",
            desc: "Retorna lista de slots existentes",
            output: 'Ex: $ slots = renpy.list_saved_games(regexp="1-")',
          },
          {
            cmd: "renpy.can_load(slotname)",
            desc: "Verifica se o save existe e é válido",
            output: "Retorna True/False.",
          },
          {
            cmd: "renpy.unlink_save(slotname)",
            desc: "Apaga o save",
            output: "Use com cuidado — não tem desfazer.",
          },
          {
            cmd: "renpy.save_persistent()",
            desc: "Força gravação imediata do persistent no disco",
            output: "Útil antes de fechar o jogo abruptamente.",
          },
          {
            cmd: "renpy.retain_after_load()",
            desc: "Marca a partida atual como 'depois de load' para lógica condicional",
            output: "Avançado — usado em rollback complexo.",
          },
        ]}
      />

      <h2>7. Save automático em pontos seguros</h2>
      <p>
        O autosave dispara em pontos previsíveis do script (entre statements
        de diálogo). Você pode forçar um autosave manualmente em momentos
        importantes — por exemplo, antes de uma escolha crítica:
      </p>

      <CodeBlock
        language="python"
        title="game/cena_critica.rpy"
        code={`label cena_critica:
    scene bg cafe_madrugada with fade
    s "O que vai ser? Confiar em mim, ou ir embora?"

    # Força um autosave antes da grande escolha
    $ renpy.force_autosave(take_screenshot=True)

    menu:
        "Confiar":
            jump rota_confianca
        "Ir embora":
            jump rota_partida`}
      />

      <h2>8. Rollback — desfazer escolhas</h2>
      <p>
        O rollback permite ao jogador rolar a roda do mouse para cima e
        desfazer falas e até menus. É um sistema poderoso, mas alguns eventos
        precisam ser <em>protegidos</em> dele:
      </p>

      <CodeBlock
        language="python"
        title="game/script.rpy"
        code={`label cena_dado:
    s "Vou jogar um dado. Se sair par, ganhei."

    # NÃO use $ x = renpy.random.randint(1, 6) sem proteção:
    # rollback faria o jogador rolar até tirar o número desejado.

    python hide:
        import random
        renpy.persistent.ultimo_dado = random.randint(1, 6)

    # Desabilita rollback nesse ponto
    $ renpy.block_rollback()

    s "Saiu [persistent.ultimo_dado]."

    if persistent.ultimo_dado % 2 == 0:
        s "Ganhei!"
    else:
        s "Perdi..."
    return`}
      />

      <OutputBlock label="saída de: renpy.exe . lint (validando saves)" type="info">
{`Ren'Py 8.2.3 lint report
========================
game/script.rpy:48 'persistent.cgs_desbloqueados' set but never read in this script.
game/screens.rpy:12 The image 'images/cg/locked.png' was not declared.

Save system check:
  has_autosave = True
  has_quicksave = True
  rollback_enabled = True
  3 'persistent' fields detected.

Statistics:
  4 .rpy files, 612 statements, 31 dialogue lines.
  2 warnings, 0 errors.`}
      </OutputBlock>

      <AlertBox type="success" title="Checklist final de saves antes de publicar">
        <ul className="list-disc pl-5 space-y-1 m-0">
          <li>Toda variável mutável foi declarada com <code>default</code>?</li>
          <li>Os finais marcam <code>persistent.finais_vistos</code>?</li>
          <li>A galeria respeita <code>persistent.cgs_desbloqueados</code>?</li>
          <li>Você testou Save → Fechar jogo → Abrir → Load?</li>
          <li>Você testou Save antigo + nova versão (config.version diferente)?</li>
        </ul>
      </AlertBox>

      <PracticeBox
        title="Galeria de finais com persistent"
        goal="Criar um sistema simples que registra os finais alcançados e mostra um screen de galeria com lista deles."
        steps={[
          "No script.rpy, declare default persistent.finais_vistos = set().",
          "Em cada label de final (final_sakura, final_akira, final_neutro), adicione $ persistent.finais_vistos.add('NOME').",
          "Crie um screen galeria_finais que itera sobre persistent.finais_vistos com 'for f in persistent.finais_vistos:' mostrando 'text f'.",
          "Adicione um botão no main menu: textbutton 'Galeria' action ShowMenu('galeria_finais').",
          "Termine o jogo em 2 finais diferentes e abra a galeria — os dois nomes devem aparecer mesmo após Novo Jogo.",
        ]}
        verify="Apague todos os arquivos .save da pasta de saves MAS preserve o arquivo 'persistent'. Reinicie a VN: a galeria deve continuar mostrando os finais."
      />
    </PageContainer>
  );
}
