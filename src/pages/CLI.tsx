import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function CLI() {
  return (
    <PageContainer
      title="Linha de comando do Ren'Py (renpy.sh)"
      subtitle="A doc oficial mostra meia dúzia de subcomandos. Aqui estão TODOS os 18 mais úteis com exemplo real, saída esperada e quando usar cada um. Esquecer o Launcher e usar só CLI é mais rápido a partir do 2º projeto."
      difficulty="intermediario"
      timeToRead="14 min"
      prompt="tooling/cli"
    >
      <AlertBox type="info" title="Por que CLI ao invés do Launcher?">
        O Launcher é ótimo para começar, mas vira gargalo quando você precisa
        de: <strong>build em CI</strong>, <strong>scripts de rotina</strong>,
        <strong> git pre-commit hooks</strong>, <strong>compilar em servidor
        sem display gráfico</strong>. Tudo que o Launcher faz com cliques, o{" "}
        <code>renpy.sh</code> faz por linha de comando — e geralmente em menos
        tempo.
      </AlertBox>

      <h2>1. Anatomia do comando</h2>

      <CodeBlock
        language="bash"
        title="formato geral"
        code={`renpy.sh <PROJETO> <SUBCOMANDO> [argumentos]

# <PROJETO>      caminho para a pasta do projeto (contém game/)
# <SUBCOMANDO>   ex: lint, compile, distribute, test
# [argumentos]   flags específicas do subcomando`}
      />

      <p>
        No Windows o executável é <code>renpy.exe</code>; no macOS e Linux é{" "}
        <code>renpy.sh</code>. As flags são as mesmas em todos os SO. Em
        muitos shells o caminho do projeto pode ser <code>.</code> se você já
        está dentro dele.
      </p>

      <h2>2. Tabela completa dos subcomandos</h2>

      <CommandTable
        title="Subcomandos do renpy.sh (18 essenciais)"
        variations={[
          { cmd: "renpy.sh <projeto>", desc: "Roda o jogo (sem subcomando = launch).", output: "Abre janela do Sakura Café." },
          { cmd: "renpy.sh <projeto> lint", desc: "Verifica erros de sintaxe, imagens não declaradas, labels duplicados.", output: "Lint took 0.42s. No problems found." },
          { cmd: "renpy.sh <projeto> compile", desc: "Compila .rpy → .rpyc (usado antes de distribute).", output: "Compiled 14 files in 1.2s." },
          { cmd: "renpy.sh <projeto> force_recompile", desc: "Apaga TODOS .rpyc e recompila do zero.", output: "Removed 14 .rpyc, compiled 14 .rpy." },
          { cmd: "renpy.sh <projeto> distribute", desc: "Gera .zip/.dmg/.tar.bz2 para Win, Mac, Linux.", output: "3 builds em ~/projetos/sakura-cafe-dists/" },
          { cmd: "renpy.sh <projeto> distribute --package <nome>", desc: "Gera APENAS um pacote (pc, mac, linux, market, web, android).", output: "sakura-cafe-1.0-linux.tar.bz2" },
          { cmd: "renpy.sh <projeto> test <nome>", desc: "Roda um testcase específico do projeto.", output: "Result: PASSED in 4.21s" },
          { cmd: "renpy.sh <projeto> test all", desc: "Roda todos os testcases.", output: "3 passed, 1 failed in 15.23s" },
          { cmd: "renpy.sh <projeto> --json-dump <out.json>", desc: "Exporta árvore de labels, screens e variáveis em JSON.", output: "Wrote 1.4 MB → out.json" },
          { cmd: "renpy.sh <projeto> --savedir <dir>", desc: "Sobrescreve a pasta de saves (útil em CI).", output: "Saves agora em dir/" },
          { cmd: "renpy.sh <projeto> --warp <label>", desc: "Pula direto para um label sem passar pelo menu.", output: "Abre o jogo já em label rota_yuki." },
          { cmd: "renpy.sh <projeto> --debug-image-cache", desc: "Mostra na console qual imagem entra/sai do cache.", output: "Predicting bg cafe (4 KB)" },
          { cmd: "renpy.sh launcher", desc: "Abre o Launcher gráfico (sem projeto).", output: "Janela do Launcher Ren'Py" },
          { cmd: "renpy.sh launcher templates", desc: "Lista templates instalados.", output: "[1] template  [2] sakura-cafe-base" },
          { cmd: "renpy.sh launcher create_project --name X", desc: "Cria projeto novo via CLI.", output: "Cria pasta ~/projetos/X" },
          { cmd: "renpy.sh <projeto> android_build", desc: "Gera APK Android (precisa rapt configurado).", output: "Wrote sakura-cafe-1.0-release.apk" },
          { cmd: "renpy.sh <projeto> web_build", desc: "Gera build HTML5 jogável no browser.", output: "Wrote web/ (62 MB)" },
          { cmd: "renpy.sh <projeto> dialogue", desc: "Exporta TODA a fala em CSV/TXT (para tradução).", output: "Wrote dialogue.txt (412 falas)" },
        ]}
      />

      <h2>3. Lint — o seu mais importante aliado</h2>

      <Terminal
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Lint completo, falhando build se algo errado",
            cmd: "renpy.sh . lint",
            out: `Statistics:
  The game contains 412 dialogue blocks, containing 6,421 words.
  The game contains 14 menus, 38 images, and 4 screens.
Lint took 0.42s. No problems were found.`,
            outType: "success",
          },
          {
            comment: "Erro real: imagem não declarada",
            cmd: "renpy.sh . lint",
            out: `game/script.rpy:18 The image 'sakura confused' was not declared.
1 error reported.`,
            outType: "error",
          },
        ]}
      />

      <h2>4. Distribute — gerando os builds finais</h2>

      <Terminal
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Build PC + Mac + Linux + Steam",
            cmd: "renpy.sh . distribute",
            out: `Building distributions for Sakura Café 1.0.0...
Packaging pc            ... 142 MB → sakura-cafe-1.0.0-pc.zip
Packaging mac           ... 138 MB → sakura-cafe-1.0.0-mac.zip
Packaging linux         ... 140 MB → sakura-cafe-1.0.0-linux.tar.bz2
Packaging market        ... 412 MB → sakura-cafe-1.0.0-market.zip

Done in 47.2s. Outputs in /home/wallyson/projetos/sakura-cafe-dists/`,
            outType: "success",
          },
          {
            comment: "Build apenas web HTML5",
            cmd: "renpy.sh . distribute --package web",
            out: `Building web package...
Compressing 38 images (WebP)...
Generating service-worker.js...
Wrote web/ (62 MB) — 'sakura-cafe-1.0.0-web.zip'`,
            outType: "success",
          },
        ]}
      />

      <h2>5. Warp — pular direto para uma cena no debug</h2>
      <p>
        Quando você está depurando o final secreto da rota da Yuki, abrir o
        jogo e clicar 200 vezes é dor de cabeça. Use{" "}
        <code>--warp &lt;label&gt;</code>:
      </p>

      <Terminal
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Abre o jogo já dentro do label final_secreto_yuki",
            cmd: "renpy.sh . --warp final_secreto_yuki",
            out: `Loading project: sakura-cafe
Warping to label: final_secreto_yuki
Game window opened.`,
            outType: "info",
          },
        ]}
      />

      <h2>6. Exportar diálogo para tradutores</h2>

      <CodeBlock
        language="bash"
        title="terminal"
        code={`# Exporta TODAS as falas em formato simples
renpy.sh ./sakura-cafe dialogue

# Saída em game/dialogue.txt
#
# Estrutura por linha:
# [arquivo:linha] [personagem] | "fala"
#
# game/script.rpy:42  s | "Bem-vindo ao Sakura Café!"
# game/script.rpy:43  y | "Hoje o especial é matcha."`}
      />

      <h2>7. JSON dump — gerar metadata para sua wiki</h2>

      <CodeBlock
        language="bash"
        title="terminal"
        code={`# Exporta TODA a estrutura do jogo em JSON
renpy.sh ./sakura-cafe --json-dump ./meta.json

# meta.json contém: labels, screens, transforms, characters, variables.
# Útil para gerar automaticamente uma wiki com todas as rotas e finais.`}
      />

      <h2>8. Configurando alias no shell</h2>
      <p>
        Para parar de digitar caminho do SDK toda vez:
      </p>

      <CodeBlock
        language="bash"
        title="~/.zshrc ou ~/.bashrc"
        code={`# Caminho do SDK Ren'Py instalado em ~/renpy-8.3.0-sdk
export RENPY_SDK="$HOME/renpy-8.3.0-sdk"
alias renpy="$RENPY_SDK/renpy.sh"

# Agora pode usar de qualquer lugar:
#   cd ~/projetos/sakura-cafe
#   renpy . lint
#   renpy . distribute`}
      />

      <h2>9. Pre-commit hook — lint automático no git</h2>

      <CodeBlock
        language="bash"
        title=".git/hooks/pre-commit"
        code={`#!/usr/bin/env bash
# Roda lint do Ren'Py antes de cada commit.
# Se falhar, bloqueia o commit.

PROJECT_ROOT="$(git rev-parse --show-toplevel)"
RENPY="$HOME/renpy-8.3.0-sdk/renpy.sh"

OUT="$($RENPY "$PROJECT_ROOT" lint 2>&1)"
ERRORS=$(echo "$OUT" | grep -c "error")

if [ "$ERRORS" -gt 0 ]; then
    echo "🚨 Lint falhou. Commit bloqueado."
    echo "$OUT"
    exit 1
fi
echo "✅ Lint OK."
exit 0`}
      />

      <h2>10. Variáveis de ambiente úteis</h2>

      <OutputBlock label="env vars consumidas pelo renpy.sh" type="info">
{`RENPY_GL2=1                Força usar GL2 (model-based renderer)
RENPY_RENDERER=gl          Força OpenGL clássico (não GL2)
RENPY_RENDERER=angle       Usa ANGLE (Windows com GPU ruim)
RENPY_PERFORMANCE_TEST=1   Imprime FPS / drawcalls a cada cena
RENPY_LESS_MEMORY=1        Ativa modo low-memory (mobile/Pi)
RENPY_LOG=1                Loga TUDO em log.txt (verboso)`}
      </OutputBlock>

      <PracticeBox
        title="Compile, lint e build do Sakura Café via terminal"
        goal="Sair 100% do Launcher e fazer todo o ciclo via CLI."
        steps={[
          "Configure o alias 'renpy' no seu .zshrc/.bashrc apontando para renpy.sh.",
          "Entre na pasta do projeto: cd ~/projetos/sakura-cafe.",
          "Rode 'renpy . lint' e corrija qualquer erro reportado.",
          "Rode 'renpy . force_recompile' para garantir bytecode limpo.",
          "Rode 'renpy . distribute --package linux' e veja o .tar.bz2 gerado.",
        ]}
        verify="Aparece um arquivo sakura-cafe-1.0.0-linux.tar.bz2 na pasta sakura-cafe-dists/ ao lado do projeto."
      />

      <AlertBox type="warning" title="Pegadinha do Windows">
        No <strong>Windows</strong> use <code>renpy.exe</code> (NÃO{" "}
        <code>renpy.sh</code>). E no PowerShell, prefira aspas duplas no
        caminho do projeto se ele tiver espaços:{" "}
        <code>renpy.exe ".\Meu Projeto" lint</code>.
      </AlertBox>

      <AlertBox type="success" title="Próximo passo natural">
        Configure VSCode + extensão renpy-language para abrir do terminal com{" "}
        <code>code .</code>. Veja a página de <strong>Editor Integration</strong>.
      </AlertBox>
    </PageContainer>
  );
}
