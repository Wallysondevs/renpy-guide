import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Fetch() {
  return (
    <PageContainer
      title="renpy.fetch — HTTP/HTTPS dentro do jogo"
      subtitle="A função oficial para fazer requisições de rede no Ren'Py: GET, POST, headers, JSON, timeout, tratamento de erro e leaderboard online no Sakura Café."
      difficulty="avancado"
      timeToRead="16 min"
      prompt="network/fetch"
    >
      <AlertBox type="info" title="O que a doc oficial NÃO te conta">
        <p>
          A doc fala que <code>renpy.fetch()</code> "faz uma requisição
          HTTP". Ponto. Na prática, você precisa saber: quando bloqueia a
          UI, como tratar timeout, como enviar JSON corretamente, como ler
          headers de resposta, e por que <strong>nunca</strong> usar HTTP
          plano em build Web (CORS + mixed content travam tudo). Este
          guia cobre os 6 cenários reais que você vai bater no Sakura
          Café — leaderboard, telemetria, news feed, server-side save,
          patch notes e auth com token.
        </p>
      </AlertBox>

      <h2>1. Assinatura e parâmetros</h2>
      <p>
        <code>renpy.fetch()</code> existe a partir de Ren'Py 8.2 e está
        disponível em <strong>todas as plataformas</strong> (Windows, Mac,
        Linux, Android, iOS e <strong>Web</strong> — único caminho de
        rede que funciona no build HTML5).
      </p>

      <CodeBlock
        language="python"
        title="assinatura completa"
        code={`renpy.fetch(
    url,                # str — URL https:// (ou http:// fora do Web)
    method=None,        # "GET" | "POST" | "PUT" | "DELETE" | None (auto)
    data=None,          # bytes/str — body cru
    json=None,          # objeto Python — serializa para JSON automatico
    params=None,        # dict — query string ?a=1&b=2
    headers=None,       # dict — cabeçalhos extras
    timeout=5,          # segundos antes de cancelar
    content_type=None,  # ex: "application/json"
    result="bytes",     # "bytes" | "text" | "json" | "file"
)`}
      />

      <CommandTable
        title="Parâmetros mais usados"
        variations={[
          { cmd: "url", desc: "URL absoluta. HTTPS obrigatório no Web build.", output: "https://api.sakura-cafe.dev/leaderboard" },
          { cmd: "method", desc: "Verbo HTTP. Default: GET sem data, POST com data/json.", output: '"POST"' },
          { cmd: "json=obj", desc: "Serializa o dict para JSON e seta Content-Type.", output: 'json={"player": "Yuki", "score": 999}' },
          { cmd: "params=dict", desc: "Vira query string (?key=value).", output: 'params={"page": 1, "limit": 10}' },
          { cmd: "headers=dict", desc: "Cabeçalhos extras (Auth, X-Api-Key).", output: 'headers={"Authorization": "Bearer xyz"}' },
          { cmd: "timeout=N", desc: "Timeout em segundos. Lança FetchError se estourar.", output: "timeout=10" },
          { cmd: 'result="json"', desc: "Decodifica resposta direto para dict/list Python.", output: '{"top": [{"name":"Yuki","score":999}]}' },
          { cmd: 'result="text"', desc: "Decodifica resposta como str (UTF-8).", output: '"OK"' },
          { cmd: 'result="bytes"', desc: "Retorna bytes crus (default). Use p/ binário.", output: "b'\\x89PNG...'" },
        ]}
      />

      <h2>2. GET simples — buscar leaderboard do Sakura Café</h2>
      <p>
        Cenário: ao terminar uma rota, mostrar o top 10 dos melhores
        baristas online. A API responde JSON.
      </p>

      <CodeBlock
        language="python"
        title="game/leaderboard.rpy"
        code={`init python:
    import traceback

    def buscar_leaderboard():
        """Retorna lista de top players ou None em caso de erro."""
        try:
            data = renpy.fetch(
                "https://api.sakura-cafe.dev/leaderboard",
                params={"limit": 10},
                timeout=8,
                result="json",
            )
            return data.get("top", [])
        except renpy.fetch.FetchError as e:
            renpy.log("Falha de rede no leaderboard: " + str(e))
            return None
        except Exception:
            renpy.log(traceback.format_exc())
            return None

label mostrar_leaderboard:
    $ top = buscar_leaderboard()

    if top is None:
        "Sem internet — não foi possível carregar o ranking."
    elif len(top) == 0:
        "Você é o primeiro barista do mundo a chegar aqui!"
    else:
        "Top baristas mundiais:"
        $ texto = "\\n".join(
            "{}. {} — {} xícaras".format(i+1, p["name"], p["score"])
            for i, p in enumerate(top)
        )
        "[texto]"
    return`}
      />

      <h2>3. POST com JSON — enviar pontuação</h2>

      <CodeBlock
        language="python"
        title="game/leaderboard.rpy"
        code={`init python:
    def enviar_pontuacao(nome, xicaras, rota):
        """Envia score para o servidor. Retorna True/False."""
        try:
            resp = renpy.fetch(
                "https://api.sakura-cafe.dev/score",
                json={
                    "name": nome,
                    "score": xicaras,
                    "route": rota,
                    "version": config.version,
                },
                headers={
                    "Authorization": "Bearer " + persistent.api_token,
                    "X-Game": "sakura-cafe",
                },
                timeout=10,
                result="json",
            )
            return resp.get("ok", False)
        except renpy.fetch.FetchError as e:
            renpy.notify("Sem rede — score salvo localmente.")
            persistent.scores_pendentes = persistent.scores_pendentes or []
            persistent.scores_pendentes.append({
                "name": nome, "score": xicaras, "route": rota
            })
            return False

label fim_da_rota_sakura:
    $ enviar_pontuacao(player_name, persistent.cafes_servidos, "sakura")
    s "Obrigada por jogar! Sua pontuação foi enviada."
    return`}
      />

      <AlertBox type="warning" title="renpy.fetch BLOQUEIA o thread principal">
        <p>
          Diferente de <code>requests</code>/<code>fetch()</code> JS,{" "}
          <code>renpy.fetch()</code> é <strong>síncrono</strong>. Durante
          o GET/POST a tela CONGELA. Para chamadas longas (mais que ~1s),
          rode em uma thread:
        </p>
        <CodeBlock
          language="python"
          code={`init python:
    import threading

    def fetch_async(url, on_done):
        def worker():
            try:
                r = renpy.fetch(url, timeout=15, result="json")
                renpy.invoke_in_main_thread(on_done, r, None)
            except Exception as e:
                renpy.invoke_in_main_thread(on_done, None, e)
        threading.Thread(target=worker, daemon=True).start()`}
        />
      </AlertBox>

      <h2>4. Tratando erros</h2>
      <p>
        Toda falha de rede vira <code>renpy.fetch.FetchError</code>. O
        atributo <code>.code</code> traz o status HTTP quando aplicável:
      </p>

      <CodeBlock
        language="python"
        title="tratamento robusto"
        code={`init python:
    def fetch_seguro(url, **kw):
        try:
            return renpy.fetch(url, **kw), None
        except renpy.fetch.FetchError as e:
            if e.code == 401:
                return None, "Token expirado. Faça login novamente."
            elif e.code == 404:
                return None, "Recurso não encontrado."
            elif e.code and e.code >= 500:
                return None, "Servidor instável. Tente em alguns minutos."
            else:
                return None, "Sem internet ou timeout."`}
      />

      <h2>5. Download de arquivo binário</h2>
      <p>
        Use <code>result="file"</code> para salvar direto no disco
        (ideal para baixar avatar de jogador, sprite custom, patch).
      </p>

      <CodeBlock
        language="python"
        title="game/avatar_download.rpy"
        code={`init python:
    def baixar_avatar(player_id):
        url = "https://cdn.sakura-cafe.dev/avatars/{}.png".format(player_id)
        try:
            f = renpy.fetch(url, result="file", timeout=12)
            # f é um arquivo já salvo em disco, em diretório de cache.
            # Para usá-lo como Image displayable:
            return f
        except renpy.fetch.FetchError:
            return "images/avatar_default.png"

screen mostrar_avatar(pid):
    $ caminho = baixar_avatar(pid)
    add caminho xalign 0.5 yalign 0.3`}
      />

      <h2>6. Variações de chamada</h2>

      <CommandTable
        title="Receitas prontas"
        variations={[
          { cmd: "GET texto", desc: "Buscar patch notes em formato MD.", output: 'renpy.fetch("https://x.dev/notes.md", result="text")' },
          { cmd: "GET com query", desc: "Filtrar leaderboard por rota.", output: 'fetch(url, params={"route":"sakura"})' },
          { cmd: "POST form", desc: "Enviar form-encoded ao invés de JSON.", output: 'fetch(url, data="a=1&b=2", content_type="application/x-www-form-urlencoded")' },
          { cmd: "PUT JSON", desc: "Atualizar perfil do jogador.", output: 'fetch(url, method="PUT", json={"bio":"barista"})' },
          { cmd: "DELETE", desc: "Remover save da nuvem.", output: 'fetch(url, method="DELETE", headers={"Auth":"..."})' },
          { cmd: "Auth Bearer", desc: "Header de autenticação.", output: 'headers={"Authorization": "Bearer " + token}' },
          { cmd: "User-Agent custom", desc: "Identificar versão do jogo.", output: 'headers={"User-Agent": "SakuraCafe/1.2"}' },
        ]}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Roda o jogo e força um teste de rede pelo console (Shift+O)",
            cmd: "renpy.fetch('https://httpbin.org/get', result='json')",
            out: `{
  "args": {},
  "headers": {
    "Host": "httpbin.org",
    "User-Agent": "RenPy/8.3.0"
  },
  "origin": "200.x.x.x",
  "url": "https://httpbin.org/get"
}`,
            outType: "success",
          },
          {
            comment: "Erro: timeout estourado",
            cmd: "renpy.fetch('https://10.255.255.1', timeout=2)",
            out: `FetchError: Timeout after 2.0 seconds connecting to 10.255.255.1`,
            outType: "error",
          },
          {
            comment: "Erro: HTTP 404",
            cmd: "renpy.fetch('https://api.sakura-cafe.dev/inexistente')",
            out: `FetchError: HTTP 404 Not Found`,
            outType: "error",
          },
        ]}
      />

      <OutputBlock label="checklist antes de chamar renpy.fetch" type="info">
{`[ ] URL é HTTPS? (obrigatório no Web build, recomendado em todos)
[ ] Timeout definido? (nunca deixe default 5s travando o jogo)
[ ] Try/except em volta? (FetchError é o esperado)
[ ] result= correto? ("json" para APIs, "file" para binário, "text" para MD)
[ ] Token armazenado em persistent (não hardcoded no .rpy público)?
[ ] Plano B se a rede falhar? (cache local, fila de envio offline)`}
      </OutputBlock>

      <h2>7. Cache simples com persistent</h2>

      <CodeBlock
        language="python"
        title="game/cache_news.rpy"
        code={`init python:
    import time

    def get_news(max_age=3600):
        """Busca news. Usa cache de 1h."""
        agora = time.time()
        cache = persistent.news_cache or {}

        if cache.get("at", 0) + max_age > agora and cache.get("data"):
            return cache["data"]

        try:
            data = renpy.fetch(
                "https://api.sakura-cafe.dev/news",
                result="json",
                timeout=6,
            )
            persistent.news_cache = {"at": agora, "data": data}
            return data
        except renpy.fetch.FetchError:
            return cache.get("data") or []  # fallback para cache antigo`}
      />

      <PracticeBox
        title="Leaderboard básico funcional"
        goal="Implementar busca + envio de pontuação para um endpoint mock e tratar offline graciosamente."
        steps={[
          "Crie game/leaderboard.rpy com a função buscar_leaderboard() apontando para https://httpbin.org/get (mock).",
          "Faça um label 'tela_ranking' que chama a função e printa o resultado dentro de um say.",
          "Adicione try/except FetchError com mensagem amigável.",
          "Teste rodando o jogo, depois desconecte da internet e rode de novo: deve cair no fallback.",
          "Bonus: salve o último resultado em persistent.news_cache e mostre 'cache' quando offline.",
        ]}
        verify="Online: você vê os dados do JSON. Offline: vê a mensagem 'Sem internet' OU os dados em cache."
      />

      <AlertBox type="danger" title="Web build: CORS é seu pior inimigo">
        No build HTML5, o navegador bloqueia qualquer requisição para
        domínios que NÃO retornem o header{" "}
        <code>Access-Control-Allow-Origin</code>. Se você controla o
        servidor, configure-o. Se não, use um proxy que adicione o
        header. Sem isso, <code>renpy.fetch()</code> falha
        silenciosamente no Web e funciona perfeitamente no desktop —
        confundindo qualquer iniciante.
      </AlertBox>

      <AlertBox type="success" title="Próximo passo">
        Agora que você sabe pegar dados, vamos para{" "}
        <strong>Screenshot</strong>: capturar a tela em momentos
        especiais (final de rota, achievement) e até enviar via{" "}
        <code>renpy.fetch()</code> POST para um servidor de
        compartilhamento.
      </AlertBox>
    </PageContainer>
  );
}
