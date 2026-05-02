import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function TemplateProjects() {
  return (
    <PageContainer
      title="Template projects (reaproveitar setup do Sakura Café)"
      subtitle="Cansou de copiar gui.rpy, options.rpy e screens.rpy toda vez que cria um projeto novo? Aqui você cria seu próprio template — e o Launcher passa a oferecer 'Sakura Café Template' ao lado do template padrão."
      difficulty="intermediario"
      timeToRead="13 min"
      prompt="tooling/template-projects"
    >
      <AlertBox type="info" title="O que é um template no Ren'Py">
        Quando você clica <strong>"Create New Project"</strong> no Launcher,
        ele copia uma pasta-modelo que vive em <code>renpy-8.x.x/template/</code>{" "}
        e renomeia tudo. Você pode adicionar <strong>quantas pastas-modelo
        quiser</strong> — cada uma vira uma opção no Launcher. Útil para
        estúdios que sempre começam com a mesma identidade visual, mesmos
        helpers Python e mesma estrutura de pastas.
      </AlertBox>

      <h2>1. Por onde o Launcher procura templates</h2>
      <p>
        O Launcher do Ren'Py varre dois lugares:
      </p>

      <OutputBlock label="ordem de busca de templates" type="info">
{`1. <renpy-sdk>/template/                    (template oficial padrão)
2. <renpy-sdk>/templates/<NomeQualquer>/     (templates extras seus)`}
      </OutputBlock>

      <p>
        Qualquer subpasta de <code>templates/</code> que contenha um arquivo{" "}
        <code>game/script.rpy</code> e <code>project.json</code> aparece no
        diálogo "Create New Project" como uma opção selecionável.
      </p>

      <h2>2. Estrutura mínima de um template</h2>

      <CodeBlock
        language="bash"
        title="estrutura de pastas"
        code={`renpy-8.3.0-sdk/
└── templates/
    └── sakura-cafe-base/
        ├── project.json                  ← metadata pro Launcher
        ├── game/
        │   ├── script.rpy                ← script base (label start)
        │   ├── options.rpy               ← config.name, save_directory etc
        │   ├── gui.rpy                   ← cores rosa pastel já configuradas
        │   ├── screens.rpy               ← screens com tema sakura
        │   ├── personagens.rpy           ← define s, y, a, h, m, r
        │   ├── audio/
        │   │   └── theme_cafe.ogg
        │   ├── images/
        │   │   ├── bg_cafe.png
        │   │   └── logo_cafe.png
        │   └── gui/
        │       └── (tema rosa pastel completo)
        └── README.txt`}
      />

      <h2>3. O arquivo <code>project.json</code></h2>

      <CodeBlock
        language="json"
        title="templates/sakura-cafe-base/project.json"
        code={`{
  "name": "Sakura Café Base Template",
  "description": "Projeto inicial com tema rosa pastel, 6 personagens pré-definidos e estrutura de capítulos.",
  "version": "1.2.0",
  "author": "Wallyson",
  "renpy_version": "8.3.0",
  "tags": ["dating-sim", "slice-of-life", "pt-br"]
}`}
      />

      <h2>4. Customizando o <code>script.rpy</code> base</h2>
      <p>
        A engine substitui automaticamente algumas variáveis quando o jogador
        cria um projeto novo a partir do template — útil para o nome do jogo
        e do diretório de saves não ficarem hard-coded.
      </p>

      <CodeBlock
        language="python"
        title="templates/sakura-cafe-base/game/script.rpy"
        code={`# Personagens pré-definidos para qualquer VN derivada do template.
define s = Character("Sakura", color="#ffaacc")
define y = Character("Yuki",   color="#aaccff")
define a = Character("Akira",  color="#ffcc99")
define h = Character("Hana",   color="#ccffaa")
define m = Character("Mei",    color="#ddccff")
define r = Character("Rin",    color="#ffddaa")

# Variáveis de afeição (padrão para qualquer dating-sim derivado).
default afeicao_sakura = 0
default afeicao_yuki   = 0
default afeicao_akira  = 0
default afeicao_hana   = 0
default afeicao_mei    = 0
default afeicao_rin    = 0

label start:
    scene bg cafe with fade
    "Bem-vindo ao [config.name]!"
    s "Comece a escrever sua história aqui."
    return`}
      />

      <h2>5. <code>options.rpy</code> que se auto-configura</h2>

      <CodeBlock
        language="python"
        title="templates/sakura-cafe-base/game/options.rpy"
        code={`# Nome e diretório serão sobrescritos pelo Launcher na criação.
define config.name = _("Novo Projeto Sakura")
define gui.about = _("Baseado no template Sakura Café 1.2.0")

define config.version = "0.1.0"

# Diretório de saves nomeado pelo projeto.
define config.save_directory = "novoprojetosakura-1747459200"

# Tema visual padrão: rosa pastel.
init python:
    gui.accent_color   = "#ffaacc"
    gui.idle_color     = "#cc8899"
    gui.hover_color    = "#ff66aa"
    gui.text_color     = "#fff5fa"
    gui.muted_color    = "#aa7788"

# Resolução padrão Full HD.
init python:
    config.screen_width = 1920
    config.screen_height = 1080`}
      />

      <h2>6. Instalando o template manualmente</h2>

      <Terminal
        path="~/projetos"
        lines={[
          {
            comment: "Copia seu template para dentro do SDK Ren'Py",
            cmd: "cp -r ./sakura-cafe-base ~/renpy-8.3.0-sdk/templates/",
            out: "",
          },
          {
            comment: "Lista templates disponíveis pelo CLI",
            cmd: "renpy.sh launcher templates",
            out: `Templates encontrados:
  [1] template (padrão Ren'Py)
  [2] sakura-cafe-base
  [3] tutorial`,
            outType: "info",
          },
          {
            comment: "Cria projeto novo a partir do template do Sakura",
            cmd: "renpy.sh launcher create_project --template sakura-cafe-base --name CafeNoturno",
            out: `Criando projeto 'CafeNoturno' em ~/projetos/CafeNoturno...
Copiando templates/sakura-cafe-base/ → ~/projetos/CafeNoturno/...
Substituindo config.name → 'CafeNoturno'
Substituindo config.save_directory → 'cafenoturno-1747460000'
Pronto. Abra no Launcher para começar.`,
            outType: "success",
          },
        ]}
      />

      <h2>7. Comandos relacionados a templates</h2>

      <CommandTable
        title="CLI do Launcher para templates"
        variations={[
          { cmd: "launcher templates", desc: "Lista todos os templates instalados.", output: "[1] template  [2] sakura-cafe-base" },
          { cmd: "launcher create_project --template <X> --name <Y>", desc: "Cria projeto Y a partir do template X.", output: "Cria pasta ~/projetos/Y" },
          { cmd: "launcher rebuild_template <X>", desc: "Limpa .rpyc e thumbnails do template (útil após editar o template).", output: "Removidos 12 .rpyc" },
          { cmd: "launcher export_template <projeto> <nome>", desc: "Empacota um projeto existente como template novo.", output: "Cria templates/<nome>/ a partir do projeto" },
          { cmd: "launcher templates --json", desc: "Saída em JSON (útil para script de CI).", output: '[{"name":"sakura-cafe-base",...}]' },
        ]}
      />

      <h2>8. Distribuindo o template para outros devs</h2>
      <p>
        Empacote a pasta <code>sakura-cafe-base/</code> em um <code>.zip</code>{" "}
        e mande para quem precisar. Quem receber só descompacta dentro de{" "}
        <code>renpy-8.x.x/templates/</code> e abre o Launcher.
      </p>

      <CodeBlock
        language="bash"
        title="empacotando o template"
        code={`# Limpe .rpyc, .rpa, saves de teste antes de empacotar
find sakura-cafe-base -name "*.rpyc" -delete
find sakura-cafe-base -name "*.rpa" -delete
rm -rf sakura-cafe-base/game/saves

# Cria o zip
zip -r sakura-cafe-base-1.2.0.zip sakura-cafe-base/

# Quem recebe descompacta dentro do SDK
unzip sakura-cafe-base-1.2.0.zip -d ~/renpy-8.3.0-sdk/templates/`}
      />

      <h2>9. Script Python "novo projeto custom"</h2>
      <p>
        Em estúdio com várias VNs por ano, vale ter um script que abstrai
        ainda mais. O exemplo abaixo cria projeto novo a partir do template,
        já gera arquivo de capítulos numerados e faz commit inicial no git.
      </p>

      <CodeBlock
        language="python"
        title="scripts/new_renpy_project.py"
        code={`#!/usr/bin/env python3
"""Cria projeto Ren'Py novo a partir do template sakura-cafe-base."""
import shutil
import subprocess
import sys
from pathlib import Path

SDK = Path.home() / "renpy-8.3.0-sdk"
TEMPLATE = SDK / "templates" / "sakura-cafe-base"
PROJECTS = Path.home() / "projetos"

def main(name: str, num_capitulos: int = 5):
    target = PROJECTS / name
    if target.exists():
        sys.exit(f"Já existe {target}")
    shutil.copytree(TEMPLATE, target)

    # Substitui placeholders no options.rpy
    opts = target / "game" / "options.rpy"
    txt = opts.read_text()
    txt = txt.replace("Novo Projeto Sakura", name)
    opts.write_text(txt)

    # Gera capítulos vazios
    for i in range(1, num_capitulos + 1):
        f = target / "game" / f"cap{i:02d}.rpy"
        f.write_text(f'label cap{i:02d}:\\n    "Capítulo {i} ainda em branco."\\n    return\\n')

    # Init git
    subprocess.run(["git", "init"], cwd=target)
    subprocess.run(["git", "add", "."], cwd=target)
    subprocess.run(["git", "commit", "-m", "init: from sakura-cafe-base template"], cwd=target)
    print(f"Projeto '{name}' criado em {target}")

if __name__ == "__main__":
    main(sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 5)`}
      />

      <PracticeBox
        title="Crie seu primeiro template"
        goal="Salvar o setup do Sakura Café como template reutilizável e criar um projeto novo a partir dele."
        steps={[
          "Copie sua pasta sakura-cafe/ para renpy-8.3.0-sdk/templates/sakura-cafe-base/.",
          "Apague .rpyc, saves/ e qualquer asset pesado/proprietário.",
          "Crie templates/sakura-cafe-base/project.json com nome e descrição.",
          "Abra o Launcher → Create New Project → escolha 'sakura-cafe-base'.",
          "Confirme que o novo projeto já abre com o tema rosa e personagens pré-definidos.",
        ]}
        verify="O Launcher mostra seu template no diálogo de criação E o projeto novo abre rodando sem precisar editar nada."
      />

      <AlertBox type="success" title="Quando vale a pena fazer template">
        Sempre que você notar copiando 3+ arquivos entre projetos. Depois do
        4º jogo é provável que você tenha 2-3 templates diferentes (dating-sim,
        kinetic novel, tutorial). Versione com semver: a v1.0 nunca deve
        quebrar projetos antigos derivados dela.
      </AlertBox>
    </PageContainer>
  );
}
