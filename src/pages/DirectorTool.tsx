import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function DirectorTool() {
  return (
    <PageContainer
      title="Interactive Director (Shift+D)"
      subtitle="O Director é uma ferramenta visual embutida no Ren'Py que monta cenas inteiras (scene, show, hide, with, play music, voice, pause) clicando em listas — e injeta o código resultante direto no .rpy. Workflow ideal para artistas, roteiristas e narrative designers que não querem decorar sintaxe."
      difficulty="iniciante"
      timeToRead="12 min"
      prompt="ferramentas/director"
    >
      <AlertBox type="info" title="Para quem é o Director">
        Programador escreve diálogo direto no editor, mas <strong>artistas
        e roteiristas</strong> normalmente travam em "qual era a ordem do
        scene/show de novo?". O Director resolve: você abre uma cena no
        jogo, aperta <code>Shift+D</code>, escolhe sprite/posição/transição
        em listas e clica "Done". O Ren'Py monta a linha
        <code> show sakura corada at right with dissolve</code> e edita o
        seu <code>.rpy</code> automaticamente.
      </AlertBox>

      <h2>1. Pré-requisitos</h2>
      <ul>
        <li><code>config.developer = True</code> (ou <code>"auto"</code>) em <code>options.rpy</code>.</li>
        <li>Ren'Py 7.4+ (Director moderno foi reescrito em 7.4 e melhorado em 8.x).</li>
        <li>Personagens, imagens, transforms e audio já <code>define</code>/<code>image</code>/<code>transform</code> declarados — o Director só LISTA o que está cadastrado.</li>
      </ul>

      <h2>2. Abrindo o Director</h2>

      <Terminal
        path="dentro do jogo"
        user="dev"
        host="sakura-cafe"
        lines={[
          {
            comment: "Rode o Sakura Café e navegue até o ponto onde quer editar",
            cmd: "Shift+D",
            out: `[Director] Inserting at: game/script.rpy:142
[Director] Action selector opened.`,
            outType: "info",
          },
        ]}
      />

      <p>
        Aparece uma barra horizontal no fundo da tela com 6 botões:
      </p>

      <CommandTable
        title="Ações que o Director sabe inserir"
        variations={[
          {
            cmd: "scene",
            desc: "Limpa a tela e adiciona um background.",
            output: "Lista todas as 'image bg ...' declaradas no jogo.",
          },
          {
            cmd: "show",
            desc: "Adiciona um sprite à cena atual.",
            output: "Lista 'image personagem ...' + position + transform + transition.",
          },
          {
            cmd: "hide",
            desc: "Remove um sprite específico que está em tela.",
            output: "Lista somente sprites atualmente visíveis.",
          },
          {
            cmd: "with",
            desc: "Aplica uma transição visual (fade, dissolve, pixellate...).",
            output: "Lista todos config.transitions registrados.",
          },
          {
            cmd: "play / queue",
            desc: "Toca música, som ou voice no canal escolhido.",
            output: "Lista arquivos audio/ encontrados.",
          },
          {
            cmd: "stop",
            desc: "Para o áudio do canal indicado, com fadeout opcional.",
            output: "stop music fadeout 2.0",
          },
          {
            cmd: "pause",
            desc: "Insere uma pausa em segundos (ou esperando clique).",
            output: "pause 1.5",
          },
        ]}
      />

      <h2>3. Anatomia do fluxo — adicionando uma cena</h2>
      <p>
        Suponha que a Sakura tá em cena, e você quer adicionar a Yuki
        entrando da esquerda com fade-in:
      </p>

      <OutputBlock label="Director — passos visuais" type="info">
{`1. Aperta Shift+D.
2. Clica em "show".
3. Lista mostra: sakura happy ✓ (já em cena, marcada)
                 yuki neutra
                 yuki braba
                 akira sorriso
                 hana surpresa
4. Clica em "yuki neutra".
5. Aparece sub-menu de POSIÇÃO:
     ○ left  ○ center  ○ right  ○ truecenter
   Clica em "left".
6. Sub-menu de TRANSFORM:
     ○ (nenhum)  ○ flutuar  ○ entrada_heroina  ○ pulsar
   Clica em "entrada_heroina".
7. Sub-menu de WITH:
     ○ fade  ○ dissolve  ○ pixellate  ○ moveinleft
   Clica em "moveinleft".
8. Clica "Done" no canto.

Director injeta no .rpy:
    show yuki neutra at left, entrada_heroina with moveinleft

E roda o statement imediatamente — você vê a Yuki entrando.`}
      </OutputBlock>

      <h2>4. Onde o código é inserido</h2>
      <p>
        O Director sempre insere <strong>antes</strong> da fala atualmente
        em tela. Se você está parado em <code>script.rpy:142</code> em uma
        fala da Sakura, todo statement gerado vai para
        <code> script.rpy:141</code> (linha imediatamente antes), respeitando
        a indentação do bloco.
      </p>

      <CodeBlock
        title="game/script.rpy — antes do Director"
        language="python"
        code={`label cena_almoco:
    scene bg cafe with fade
    show sakura happy at center

    s "Almoço hoje tá com tudo!"      # ← jogador parou aqui antes do Shift+D
    s "Vamos provar o ramen?"
    return`}
      />

      <CodeBlock
        title="game/script.rpy — depois do Director"
        language="python"
        code={`label cena_almoco:
    scene bg cafe with fade
    show sakura happy at center

    show yuki neutra at left, entrada_heroina with moveinleft   # ← inserido pelo Director
    play music "audio/almoco.ogg" fadein 1.0                    # ← outro insert

    s "Almoço hoje tá com tudo!"
    s "Vamos provar o ramen?"
    return`}
      />

      <h2>5. Editando linhas existentes</h2>
      <p>
        Click em uma linha já existente no listing do Director para
        <strong>editar</strong>: troca posição, transform, transition. Útil
        quando a cena ficou "parada demais" e você quer trocar
        <code> at center</code> por <code>at right, batida</code>.
      </p>

      <h2>6. Removendo statements</h2>
      <p>
        No menu do Director, hover em qualquer statement listado e aparece
        um <strong>X</strong>. Clica e a linha é apagada do
        <code> .rpy</code>. Salva imediatamente.
      </p>

      <AlertBox type="warning" title="Director só edita o código que ELE gerou">
        Se você escreveu <code>show sakura happy at right</code> manualmente,
        o Director consegue listar e editar (porque é uma das 7 ações
        suportadas). Mas se a linha for um Python puro
        <code> $ afeicao_sakura += 1</code> ou um <code>menu:</code>, o
        Director ignora — você edita à mão.
      </AlertBox>

      <h2>7. Configurando o Director</h2>

      <CodeBlock
        title="game/options.rpy"
        language="python"
        code={`# Liga / desliga o Director (default True quando developer=True)
define config.director = True

# Ações que o Director oferece (default já inclui as 7 abaixo)
define director.actions = [
    "scene", "show", "hide", "with",
    "play", "queue", "stop", "pause",
]

# Transitions sugeridas no menu (lista do que mostrar; sem isso lista TODAS)
define director.transitions = [
    "fade", "dissolve", "pixellate",
    "moveinleft", "moveinright", "moveoutleft", "moveoutright",
]

# Position presets sugeridos (se omitido, usa todos os Position registrados)
define director.positions = [ "left", "center", "right", "truecenter" ]

# Channels de áudio listados na ação "play"
define director.audio_channels = [ "music", "sound", "voice", "ambient" ]`}
      />

      <h2>8. Workflow real para o time</h2>

      <OutputBlock label="Como usar com 3 perfis no Sakura Café" type="info">
{`📝 ROTEIRISTA (não-programador)
   1. Abre o jogo do projeto compartilhado.
   2. Joga até a cena que vai expandir.
   3. Shift+D para inserir scene/show/hide/play.
   4. Salva o .rpy (commit no git).
   5. NÃO mexe em Python, menus ou variáveis.

🎨 ARTISTA
   1. Adiciona novos sprites em images/sakura_*.png.
   2. Roda renpy.sh . force_recompile (atualiza catálogo).
   3. Abre Director — sprite novo aparece automaticamente na lista.
   4. Posiciona visualmente, salva.

💻 PROGRAMADOR
   1. Mantém Characters, init python:, menus, variáveis.
   2. Reorganiza labels, faz refactor, integra mecânicas.
   3. NÃO usa Director (digita direto, mais rápido para Python).`}
      </OutputBlock>

      <h2>9. Director em Visual Novel grande — limites</h2>
      <p>
        O Director é genial para os primeiros 80% das cenas (visuais),
        mas não substitui edição manual em:
      </p>

      <ul>
        <li><code>menu:</code> com escolhas — sempre escreva à mão.</li>
        <li><code>$ var = ...</code> e Python inline.</li>
        <li><code>if / elif / else</code> de ramificação.</li>
        <li><code>call</code>, <code>jump</code>, <code>return</code>.</li>
        <li>Atributos custom de Character (callback, voice_tag).</li>
      </ul>

      <h2>10. Depurando — quando o Director "não aparece"</h2>

      <Terminal
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Director não responde a Shift+D? Confirme dev mode",
            cmd: "grep -n 'config.developer' game/options.rpy",
            out: `42:define config.developer = "auto"
43:define config.director = True`,
            outType: "success",
          },
          {
            comment: "Nenhum sprite aparece na lista? Force recompile",
            cmd: "./renpy.sh . force_recompile",
            out: `Recompiling 28 .rpy files...
Cataloging images... 142 images registered.
Done.`,
            outType: "info",
          },
          {
            comment: "Director inseriu na linha errada? Veja onde foi",
            cmd: "git diff game/script.rpy",
            out: `+    show yuki neutra at left, entrada_heroina with moveinleft
+    play music "audio/almoco.ogg" fadein 1.0`,
            outType: "warning",
          },
        ]}
      />

      <h2>11. Diff de um arquivo gerado pelo Director</h2>

      <CodeBlock
        title="diff em game/script.rpy"
        language="python"
        code={`@@ -140,6 +140,9 @@ label cena_almoco:
     scene bg cafe with fade
     show sakura happy at center
+
+    show yuki neutra at left, entrada_heroina with moveinleft
+    play music "audio/almoco.ogg" fadein 1.0

     s "Almoço hoje tá com tudo!"
     s "Vamos provar o ramen?"`}
      />

      <PracticeBox
        title="Crie uma cena visual completa só com Director"
        goal="Sem digitar nenhuma letra no editor, montar cena: bg cafe + sakura + yuki entrando + música + fala."
        steps={[
          "Em options.rpy: config.developer = 'auto', config.director = True.",
          "Crie label vazio: 'label teste_director:' seguido de 'return' no script.rpy.",
          "Rode o jogo, abra console (Shift+O) e jump teste_director.",
          "Shift+D → scene → bg cafe → with fade → Done.",
          "Shift+D → show → sakura happy → center → with dissolve → Done.",
          "Shift+D → show → yuki neutra → left → moveinleft → Done.",
          "Shift+D → play → music → audio/almoco.ogg → fadein 1.0 → Done.",
          "Saia, abra script.rpy e veja todo código gerado dentro do label.",
        ]}
        verify="O .rpy contém scene + 2 show + play music sem você ter digitado uma linha. A cena roda no jogo."
      >
        <CodeBlock
          title="game/script.rpy (resultado esperado)"
          language="python"
          code={`label teste_director:
    scene bg cafe with fade
    show sakura happy at center with dissolve
    show yuki neutra at left with moveinleft
    play music "audio/almoco.ogg" fadein 1.0
    return`}
        />
      </PracticeBox>

      <AlertBox type="danger" title="Director NUNCA em produção">
        <code>config.director</code> só funciona com{" "}
        <code>config.developer = True</code>. Garanta que o build final tem{" "}
        <code>"auto"</code> ou <code>False</code> — caso contrário, jogador
        consegue reescrever seu script.
      </AlertBox>

      <AlertBox type="success" title="Próximo módulo">
        Você fechou a parte de <strong>Tools</strong>. Próximo grande bloco:
        <strong> Engine & Tooling Final</strong> — testes automatizados,
        templates, CLI completo do <code>renpy.sh</code>, integração com
        VSCode e skins do Launcher.
      </AlertBox>
    </PageContainer>
  );
}
