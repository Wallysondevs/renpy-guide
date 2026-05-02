import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function EditorIntegration() {
  return (
    <PageContainer
      title="Integração com editor de código (VSCode + alternativas)"
      subtitle="A doc oficial fala de Atom e jEdit (mortos / desatualizados). Aqui está o setup REAL de 2026: VSCode com a extensão renpy-language, debug step-through, snippets, formatador, e como configurar para abrir pelo Launcher com 1 clique."
      difficulty="iniciante"
      timeToRead="11 min"
      prompt="tooling/editor-integration"
    >
      <AlertBox type="info" title="Por que escolher o editor com cuidado">
        Visual novel é texto em massa: 60-200 mil palavras de diálogo, 3-12 mil
        linhas de <code>.rpy</code>. Editor sem destaque de sintaxe Ren'Py
        deixa erros invisíveis (label dentro de menu, indentação misturada,
        tag de cor sem fechar). Hoje (2026) o padrão da comunidade é{" "}
        <strong>VSCode + extensão renpy-language</strong>; os outros são
        legados.
      </AlertBox>

      <h2>1. Editores suportados oficialmente</h2>

      <CommandTable
        title="Editores que o Launcher reconhece"
        variations={[
          { cmd: "Visual Studio Code", desc: "✅ ATIVO 2026 — extensão renpy-language mantida pela comunidade.", output: "Recomendado para 99% dos casos." },
          { cmd: "Atom", desc: "⚠️ DESCONTINUADO em 2022 pelo GitHub. Ainda funciona mas sem updates.", output: "Não use em projeto novo." },
          { cmd: "jEdit", desc: "Editor Java antigo, opção padrão histórica do Launcher.", output: "Funciona, mas UI dos anos 2000." },
          { cmd: "Editra", desc: "Editor leve, suporte oficial removido em SDK 8.x.", output: "Esquecer." },
          { cmd: "System Editor", desc: "Abre com o editor padrão do SO (notepad, gedit, TextEdit).", output: "Sem destaque de sintaxe." },
        ]}
      />

      <h2>2. Setup VSCode passo a passo</h2>

      <Terminal
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "1. Instala VSCode (Linux exemplo)",
            cmd: "sudo apt install code -y",
            out: "code 1.94.0 instalado.",
            outType: "success",
          },
          {
            comment: "2. Instala a extensão renpy-language pela CLI",
            cmd: "code --install-extension LuqueDaniel.languague-renpy",
            out: `Installing extension 'LuqueDaniel.languague-renpy'...
Extension 'LuqueDaniel.languague-renpy' v2.4.1 installed.`,
            outType: "success",
          },
          {
            comment: "3. Abre o projeto",
            cmd: "code .",
            out: "VSCode aberto na pasta sakura-cafe.",
          },
        ]}
      />

      <h2>3. O que a extensão renpy-language entrega</h2>

      <OutputBlock label="features renpy-language v2.4" type="success">
{`✔ Syntax highlighting completo (.rpy, .rpym, _ren.py)
✔ Snippets: digite "label" + Tab → gera label completo
✔ Auto-complete de Characters definidos no projeto
✔ Auto-complete de imagens declaradas (image bg cafe = ...)
✔ Hover docs: passe mouse em 'show' e vê a sintaxe
✔ Lint integrado (chama renpy.sh lint via tarefa)
✔ Formatador (alinha indentação)
✔ Detecção de label/jump quebrado (sublinha em vermelho)
✔ "Go to Definition" funciona em labels e Characters
✔ Comando "Renpy: Run lint on workspace"`}
      </OutputBlock>

      <h2>4. Configurando como editor padrão no Launcher</h2>
      <p>
        No Launcher do Ren'Py: <strong>Preferences → Text Editor</strong> e
        selecione "Visual Studio Code". Se não aparecer, clique em{" "}
        <strong>"+ Custom"</strong> e cole o comando:
      </p>

      <CodeBlock
        language="text"
        title="comando custom para abrir VSCode no arquivo+linha"
        code={`# Linux / macOS:
code -g "%(filename)s:%(line)d"

# Windows (PowerShell):
"C:\\Program Files\\Microsoft VS Code\\bin\\code.cmd" -g "%(filename)s:%(line)d"`}
      />

      <p>
        Agora qualquer "Open in Editor" do Launcher (clique em um label ou
        em um erro de lint) abre o arquivo no VSCode <em>já posicionado na
        linha exata</em>.
      </p>

      <h2>5. Snippets que economizam minutos por dia</h2>

      <CodeBlock
        language="json"
        title="~/.config/Code/User/snippets/renpy.json"
        code={`{
  "Personagem completo": {
    "prefix": "char",
    "body": [
      "define \${1:s} = Character(\\"\${2:Sakura}\\", color=\\"\${3:#ffaacc}\\")"
    ]
  },
  "Label novo": {
    "prefix": "label",
    "body": [
      "label \${1:nome}:",
      "    scene bg \${2:cafe} with fade",
      "    \${3:s} \\"\${4:Fala inicial.}\\"",
      "    return"
    ]
  },
  "Menu de escolhas": {
    "prefix": "menu",
    "body": [
      "menu:",
      "    \\"\${1:Opção 1}\\":",
      "        jump \${2:label1}",
      "    \\"\${3:Opção 2}\\":",
      "        jump \${4:label2}"
    ]
  },
  "Show com transform": {
    "prefix": "show",
    "body": [
      "show \${1:sakura} \${2:happy} at \${3:center} with \${4:dissolve}"
    ]
  }
}`}
      />

      <h2>6. Tarefas (tasks.json) para Lint, Build e Test</h2>

      <CodeBlock
        language="json"
        title=".vscode/tasks.json"
        code={`{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Ren'Py: Lint",
      "type": "shell",
      "command": "$HOME/renpy-8.3.0-sdk/renpy.sh",
      "args": ["\${workspaceFolder}", "lint"],
      "group": { "kind": "test", "isDefault": true },
      "problemMatcher": []
    },
    {
      "label": "Ren'Py: Run game",
      "type": "shell",
      "command": "$HOME/renpy-8.3.0-sdk/renpy.sh",
      "args": ["\${workspaceFolder}"],
      "group": { "kind": "build", "isDefault": true }
    },
    {
      "label": "Ren'Py: Distribute Linux",
      "type": "shell",
      "command": "$HOME/renpy-8.3.0-sdk/renpy.sh",
      "args": ["\${workspaceFolder}", "distribute", "--package", "linux"]
    },
    {
      "label": "Ren'Py: Run all tests",
      "type": "shell",
      "command": "$HOME/renpy-8.3.0-sdk/renpy.sh",
      "args": ["\${workspaceFolder}", "test", "all"]
    }
  ]
}`}
      />

      <p>
        Com isso, <kbd>Ctrl+Shift+B</kbd> roda o jogo e <kbd>Ctrl+Shift+P</kbd>{" "}
        → "Run Test Task" roda o lint.
      </p>

      <h2>7. Debug step-through (quase um debugger Python)</h2>
      <p>
        Ren'Py não tem step-through completo, mas tem o <strong>Console
        in-game</strong> (Shift+O) que aceita Python live, e a extensão VSCode
        oferece um modo "trace" que loga cada label visitado em tempo real:
      </p>

      <CodeBlock
        language="python"
        title="game/debug_trace.rpy (só carregado em config.developer)"
        code={`init python:
    if config.developer:
        def trace_label(name, abnormal):
            renpy.write_log(f"[TRACE] entrou em label: {name}")
        config.label_callback = trace_label`}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Acompanha labels em tempo real durante o jogo",
            cmd: "tail -f game/log.txt | grep TRACE",
            out: `[TRACE] entrou em label: start
[TRACE] entrou em label: cap1
[TRACE] entrou em label: cena_sakura
[TRACE] entrou em label: rota_amor`,
            outType: "info",
          },
        ]}
      />

      <h2>8. Dicas finais para produtividade</h2>

      <OutputBlock label="atalhos VSCode + renpy-language" type="info">
{`Ctrl+Shift+P → "Renpy: Run Lint"
Ctrl+P → ".rpy"  (filtra arquivos do projeto)
F12 sobre um Character → vai pra definição
Alt+F12 → preview da definição inline (sem trocar de aba)
Ctrl+Shift+F → busca em TODOS os .rpy
Ctrl+Shift+B → roda tarefa default (jogar)
Ctrl+G linha → vai para linha específica`}
      </OutputBlock>

      <PracticeBox
        title="Setup completo VSCode + Sakura Café"
        goal="Ter VSCode integrado ao Launcher e a tasks.json funcionando."
        steps={[
          "Instale a extensão LuqueDaniel.languague-renpy.",
          "No Launcher, defina VSCode como editor padrão.",
          "Crie .vscode/tasks.json no seu projeto Sakura Café com lint + run.",
          "Pressione Ctrl+Shift+B e confirme que o jogo abre.",
          "Pressione Ctrl+Shift+P → 'Run Test Task' e veja o lint rodar.",
        ]}
        verify="O jogo abre por Ctrl+Shift+B e a saída do lint aparece dentro do painel Terminal do VSCode."
      />

      <AlertBox type="warning" title="Não use o editor padrão do SO">
        Notepad, gedit ou TextEdit NÃO mostram destaque de sintaxe Ren'Py e
        não detectam tabs misturados com espaços — o erro mais comum em
        iniciantes. Se por algum motivo não puder usar VSCode, prefira
        Sublime Text (também tem pacote Ren'Py via Package Control).
      </AlertBox>

      <AlertBox type="success" title="Próximo passo natural">
        Vá para <strong>Skins</strong> e personalize o visual do próprio
        Launcher para combinar com seu estúdio.
      </AlertBox>
    </PageContainer>
  );
}
