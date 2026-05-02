import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function FileAccess() {
  return (
    <PageContainer
      title="File Access — lendo arquivos do projeto"
      subtitle="renpy.file(), renpy.list_files(), renpy.loadable(), renpy.open_file(): por que open() do Python não funciona em build .rpa, como ler JSON de receitas em runtime, listar imagens dinamicamente e gravar arquivos no diretório do save."
      difficulty="avancado"
      timeToRead="15 min"
      prompt="python/file-access"
    >
      <AlertBox type="danger" title="Por que open() do Python QUEBRA?">
        No desenvolvimento, <code>game/</code> é um diretório real e{" "}
        <code>open("game/cardapio.json")</code> funciona. Mas quando você
        empacota com <code>renpy distribute</code>, todos os arquivos
        viram um <strong>archive .rpa</strong> (ou ficam no APK
        Android). <code>open()</code> NÃO consegue ler de dentro de um
        arquivo. <code>renpy.file()</code> sim — porque a engine sabe
        olhar tanto no disco quanto no archive.
      </AlertBox>

      <h2>1. As 4 funções essenciais</h2>

      <CommandTable
        title="API de file access do Ren'Py"
        variations={[
          {
            cmd: "renpy.file(path)",
            desc: "Abre arquivo em modo binário (rb). Funciona em .rpa, APK, dev.",
            output: 'with renpy.file("data/cardapio.json") as f: ...',
          },
          {
            cmd: "renpy.loadable(path)",
            desc: "True se o arquivo existe (sem abrir). Use antes de file().",
            output: 'if renpy.loadable("img.png"): ...',
          },
          {
            cmd: "renpy.list_files(common=False)",
            desc: "Lista TODOS arquivos do projeto (incluindo dentro de .rpa).",
            output: '["script.rpy", "images/sakura.png", ...]',
          },
          {
            cmd: "renpy.open_file(path, encoding='utf-8')",
            desc: "Versão moderna que devolve handle texto direto.",
            output: 'open_file("dados.txt").read()',
          },
          {
            cmd: "config.savedir + '/file.txt'",
            desc: "Para ESCREVER, use o save dir (writable cross-platform).",
            output: 'open(config.savedir + "/log.txt", "w")',
          },
        ]}
      />

      <h2>2. Lendo JSON de receitas do café</h2>

      <CodeBlock
        title="game/data/cardapio.json"
        language="json"
        code={`[
  {"id": "espresso", "nome": "Espresso", "preco": 8, "tempo": 90},
  {"id": "cappuccino", "nome": "Cappuccino", "preco": 12, "tempo": 180},
  {"id": "matcha", "nome": "Matcha Latte", "preco": 15, "tempo": 200},
  {"id": "torta_morango", "nome": "Torta de Morango", "preco": 18, "tempo": 0},
  {"id": "frappe", "nome": "Frappuccino Especial", "preco": 22, "tempo": 240}
]`}
      />

      <CodeBlock
        title="game/lib/cardapio.rpy"
        language="python"
        code={`init python:
    import json

    def carregar_cardapio():
        if not renpy.loadable("data/cardapio.json"):
            return []
        with renpy.file("data/cardapio.json") as f:
            return json.loads(f.read().decode("utf-8"))

    cardapio_completo = carregar_cardapio()
`}
      />

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`label balcao:
    s "Olha o que temos hoje:"

    python:
        opcoes = [(f"{i['nome']} - R$ {i['preco']}", i) for i in cardapio_completo]
        opcoes.append(("Mais tarde...", None))
        escolhido = renpy.display_menu(opcoes)

    if escolhido:
        $ tempo = escolhido["tempo"]
        s "Saindo um [escolhido[nome]]! Vai levar uns [tempo] segundos."
    return
`}
      />

      <AlertBox type="warning" title="renpy.file() devolve BYTES, não str">
        Sempre faça <code>.decode("utf-8")</code> ao ler texto, ou use{" "}
        <code>renpy.open_file(path, encoding="utf-8")</code> que já
        retorna string. Esquecer disso quebra acentos do PT-BR.
      </AlertBox>

      <h2>3. Listando arquivos dinamicamente</h2>
      <p>
        Use <code>renpy.list_files()</code> para descobrir conteúdo em
        runtime. Útil para: galeria de CGs, lista de ostpacks, mods.
      </p>

      <CodeBlock
        title="game/lib/galeria.rpy"
        language="python"
        code={`init python:

    def cgs_disponiveis():
        """Retorna todos os PNG dentro de images/cg/."""
        todos = renpy.list_files()
        return sorted([
            f for f in todos
            if f.startswith("images/cg/") and f.endswith(".png")
        ])

    def musicas_extras():
        return [
            f for f in renpy.list_files()
            if f.startswith("audio/ost/") and f.endswith(".ogg")
        ]
`}
      />

      <CodeBlock
        title="game/screens/galeria.rpy"
        language="python"
        code={`screen galeria_cgs():
    grid 4 5:
        spacing 8
        for path in cgs_disponiveis():
            imagebutton:
                idle Transform(path, zoom=0.2)
                hover Transform(path, zoom=0.22)
                action ShowMenu("ver_cg", path)
`}
      />

      <h2>4. Verificando antes de carregar</h2>

      <CodeBlock
        title="game/lib/seguranca.rpy"
        language="python"
        code={`init python:
    def carregar_assets_dlc(nome_dlc):
        """Carrega só se o DLC estiver instalado."""
        manifesto = f"dlc/{nome_dlc}/manifest.json"
        if not renpy.loadable(manifesto):
            renpy.notify(f"DLC '{nome_dlc}' não instalado.")
            return None
        with renpy.file(manifesto) as f:
            return json.loads(f.read().decode("utf-8"))
`}
      />

      <h2>5. Escrita: use <code>config.savedir</code></h2>
      <p>
        <code>renpy.file()</code> é <strong>read-only</strong>. Para
        gravar (export de log, screenshot custom, exportar replay), use
        o save directory que é writable em todas as plataformas:
      </p>

      <CodeBlock
        title="game/lib/exportar.rpy"
        language="python"
        code={`init python:
    import json, os, time

    def exportar_log_dialogos():
        """Salva o histórico de diálogos em JSON."""
        path = os.path.join(config.savedir, "log_dialogos.json")
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump({
                "timestamp": time.time(),
                "jogador": getattr(store, "player_name", "?"),
                "falas": getattr(store, "full_log", []),
            }, f, ensure_ascii=False, indent=2)
        renpy.notify(f"Exportado para: {path}")
`}
      />

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`screen menu_export():
    textbutton "Exportar histórico":
        action Function(exportar_log_dialogos)
`}
      />

      <h2>6. Lendo CSV de tradução custom</h2>

      <CodeBlock
        title="game/data/traducao_extra.csv"
        language="text"
        code={`chave,pt,en
saudacao,Olá,Hello
despedida,Tchau,Bye
ofertas,"Promoção!","On sale!"
`}
      />

      <CodeBlock
        title="game/lib/i18n.rpy"
        language="python"
        code={`init python:
    import csv, io

    traducoes = {}

    def carregar_csv():
        with renpy.file("data/traducao_extra.csv") as f:
            text = f.read().decode("utf-8")
        reader = csv.DictReader(io.StringIO(text))
        for row in reader:
            traducoes[row["chave"]] = row

    carregar_csv()

    def t(chave):
        idioma = persistent.idioma or "pt"
        return traducoes.get(chave, {}).get(idioma, chave)
`}
      />

      <h2>7. Diferenças entre dev (.rpy) e prod (.rpa)</h2>

      <Terminal
        path="~/sakura-cafe"
        lines={[
          {
            comment: "Em desenvolvimento — open() funciona",
            cmd: 'python -c \'open("game/data/cardapio.json").read()\'',
            out: '"[ {\\"id\\": \\"espresso\\", ...} ]"',
            outType: "success",
          },
          {
            comment: "Após renpy distribute (build .rpa)",
            cmd: 'python -c \'open("game/data/cardapio.json").read()\'',
            out: `FileNotFoundError: [Errno 2] No such file or directory:
'game/data/cardapio.json'`,
            outType: "error",
          },
          {
            comment: "renpy.file funciona em ambos os casos",
            cmd: 'python -c \'renpy.file("data/cardapio.json").read()\'',
            out: `b'[ {"id": "espresso", ...} ]'`,
            outType: "success",
          },
        ]}
      />

      <AlertBox type="info" title="Caminho relativo a 'game/'">
        Em <code>renpy.file()</code> e <code>renpy.list_files()</code>,
        os caminhos são RELATIVOS à pasta <code>game/</code>. Ou seja,{" "}
        <code>game/data/cardapio.json</code> vira{" "}
        <code>"data/cardapio.json"</code>.
      </AlertBox>

      <h2>8. Excluindo arquivos do build</h2>
      <p>
        Para impedir que arquivos sensíveis (anotações, .blend, código
        fonte de assets) entrem no .rpa, edite{" "}
        <code>options.rpy</code>:
      </p>

      <CodeBlock
        title="game/options.rpy"
        language="python"
        code={`init python:
    build.classify("**.psd", None)        # exclui Photoshop
    build.classify("**.blend", None)      # exclui Blender
    build.classify("**.txt", None)        # exclui anotações
    build.classify("**/_dev/**", None)    # exclui pasta inteira
`}
      />

      <h2>9. Arquivos persistentes do jogador</h2>
      <p>
        Para configs do JOGADOR (não do projeto), prefira{" "}
        <code>persistent.X</code> que o Ren'Py salva/carrega
        automaticamente em local certo por sistema operacional. Use
        arquivos só quando precisar de formato externo:
      </p>

      <CommandTable
        title="Onde guardar O QUE"
        variations={[
          {
            cmd: "persistent.X",
            desc: "Configs do usuário, achievements, melhor pontuação.",
            output: "persistent.melhor_tempo = 124",
          },
          {
            cmd: "renpy.save() / load()",
            desc: "Save game completo (estado da história).",
            output: 'renpy.save("slot1")',
          },
          {
            cmd: "renpy.file() — read",
            desc: "Dados estáticos do projeto (JSON, CSV, configs).",
            output: 'renpy.file("data/x.json")',
          },
          {
            cmd: "open(config.savedir+'/x') — write",
            desc: "Logs, exports, screenshots feitas pelo jogador.",
            output: "log_dialogos.json",
          },
          {
            cmd: "config.gamedir",
            desc: "Pasta game/ NO DISCO (não funciona dentro de .rpa).",
            output: "só dev/debug",
          },
        ]}
      />

      <OutputBlock label="cheat sheet — qual função usar" type="info">
{`LER asset do projeto         → renpy.file() ou renpy.open_file()
VERIFICAR existência         → renpy.loadable()
LISTAR arquivos por padrão   → renpy.list_files() + filter
ESCREVER arquivo do jogador  → open(config.savedir + "/...", "w")
ESCREVER config persistente  → persistent.X = valor
SALVAR estado do jogo        → renpy.save("slot1")
EXCLUIR do build .rpa        → build.classify("**.x", None)`}
      </OutputBlock>

      <PracticeBox
        title="Sistema de receitas em JSON"
        goal="Carregar receitas.json em runtime e oferecer menu dinâmico para o jogador escolher o que pedir, sem hardcoded."
        steps={[
          "Crie game/data/receitas.json com lista de objetos {nome, ingredientes:[], preco}",
          "Crie game/lib/receitas.rpy com init python:",
          "Use renpy.loadable() para verificar; se não existir, devolva [].",
          "Carregue com renpy.file('data/receitas.json'); decode utf-8; json.loads",
          "Em label balcao: monte opcoes = [(r['nome'] + ' R$' + str(r['preco']), r) for r in receitas]",
          "Use renpy.display_menu(opcoes) e mostre os ingredientes da escolhida.",
        ]}
        verify="Ao rodar a cena, aparecem todas as receitas do JSON. Adicionar uma nova entrada no arquivo (sem mudar .rpy) faz ela aparecer automaticamente no menu."
      >
        <CodeBlock
          title="game/lib/receitas.rpy (gabarito)"
          language="python"
          code={`init python:
    import json

    def carregar_receitas():
        if not renpy.loadable("data/receitas.json"):
            return []
        with renpy.file("data/receitas.json") as f:
            return json.loads(f.read().decode("utf-8"))

    receitas = carregar_receitas()

label balcao:
    s "Hoje temos:"
    python:
        opcoes = [(r["nome"] + " - R$ " + str(r["preco"]), r) for r in receitas]
        opcoes.append(("Voltar", None))
        escolha = renpy.display_menu(opcoes)
    if escolha:
        $ ings = ", ".join(escolha["ingredientes"])
        s "[escolha[nome]] tem: [ings]."
    return`}
        />
      </PracticeBox>

      <AlertBox type="success" title="Você fechou o módulo de Python avançado">
        Cobriu: Statement Equivalents, CDD, CDS, Custom Text Tags,
        Character Callbacks e File Access. Agora o Sakura Café tem
        infraestrutura para qualquer mecânica imaginável: cardápio
        dinâmico, sprites custom, sintaxe própria, hooks por personagem
        e leitura de dados externos.
      </AlertBox>
    </PageContainer>
  );
}
