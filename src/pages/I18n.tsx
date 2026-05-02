import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function I18n() {
  return (
    <PageContainer
      title="Internacionalização (i18n) — Traduzindo sua VN"
      subtitle="Lance Sakura Café em PT-BR, Inglês e Japonês usando o sistema nativo de tradução do Ren'Py. Aprenda a gerar arquivos .rpy de tradução, configurar fontes, alternar idiomas em runtime e adaptar imagens."
      difficulty="avancado"
      timeToRead="20 min"
      prompt="avancado/i18n"
    >
      <AlertBox type="info" title="Tradução é o que dá alcance global">
        Uma VN em PT-BR vende para 200 milhões de pessoas. Adicionando inglês
        você pula para 1.5 bilhão. Adicionando japonês entra em mercados
        nativos como DLsite e BOOTH. O melhor: o Ren'Py traduz com{" "}
        <strong>um único comando</strong> — ele extrai cada string do seu
        script para arquivos editáveis.
      </AlertBox>

      <h2>1. Como o Ren'Py organiza traduções</h2>
      <p>
        Ren'Py guarda cada idioma em <code>game/tl/&lt;idioma&gt;/</code>. O
        idioma "padrão" (o que você escreveu no script) NÃO tem pasta — ele é
        o original. Toda string do tipo <code>"texto"</code> e cada bloco
        <code> "fala" </code> ganham um identificador (hash) que liga o
        original à tradução.
      </p>

      <OutputBlock label="estrutura de pastas após gerar traduções" type="info">
{`sakura-cafe/
└── game/
    ├── script.rpy            (idioma padrão: PT-BR)
    ├── cap1.rpy
    ├── tl/
    │   ├── None/             (auto-gerado, NÃO edite)
    │   │   └── common.rpy
    │   ├── english/
    │   │   ├── script.rpy    ← suas traduções em inglês
    │   │   ├── cap1.rpy
    │   │   └── common.rpym   (strings do menu/preferences)
    │   └── japanese/
    │       ├── script.rpy
    │       ├── cap1.rpy
    │       └── common.rpym
    └── fonts/
        ├── japanese.ttf      ← fonte CJK
        └── default.ttf`}
      </OutputBlock>

      <h2>2. Definindo o idioma padrão e os idiomas suportados</h2>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`init python:

    # Lista de idiomas oferecidos no menu de preferências
    config.translations = ["english", "japanese"]   # PT-BR é o original

    # Configura a fonte por idioma (se necessário)
    style.default.language = "unicode"

# Função utilitária para alternar idiomas
init python:
    def mudar_idioma(lang):
        if lang == "portugues":
            renpy.change_language(None)   # None = idioma original
        else:
            renpy.change_language(lang)`}
      />

      <h2>3. Gerando os arquivos de tradução</h2>
      <p>
        Use o comando <code>translate</code> do Launcher (ou via terminal). O
        Ren'Py varre TODOS os <code>.rpy</code>, extrai cada fala e string e
        cria os arquivos em <code>game/tl/&lt;idioma&gt;/</code>:
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Gera traduções para inglês",
            cmd: "renpy.exe . translate english",
            out: `Generating translations for: english
  Processing: game/script.rpy ........ 142 strings
  Processing: game/cap1.rpy .......... 318 strings
  Processing: game/cap2_chuva.rpy .... 274 strings
  Processing: game/cap3_confissao.rpy. 412 strings
  Processing: game/cap4_decisao.rpy .. 198 strings
  Processing: game/screens.rpy ....... 28 strings (UI)
  Processing: game/options.rpy ....... 6 strings

Generated 1378 translation entries in game/tl/english/
Done in 1.84s.`,
            outType: "success",
          },
          {
            comment: "Mesmo comando para japonês",
            cmd: "renpy.exe . translate japanese",
            out: `Generating translations for: japanese
... (mesma saída)
Generated 1378 translation entries in game/tl/japanese/`,
            outType: "success",
          },
          {
            comment: "Re-rodar depois de adicionar mais diálogo? Sim — só adiciona o NOVO",
            cmd: "renpy.exe . translate english",
            out: `Adding new translation entries to: english
  +37 new entries (cap5.rpy)
Done in 0.34s.`,
            outType: "info",
          },
        ]}
      />

      <h2>4. Como ficam os arquivos .rpy de tradução</h2>

      <CodeBlock
        language="python"
        title="game/tl/english/cap1.rpy (auto-gerado, você edita o new)"
        code={`# game/cap1.rpy:14
translate english cap1_chegada_47b3:

    # s "Bem-vinda ao Sakura Café! É seu primeiro dia, né?"
    s "Welcome to Sakura Café! Is it your first day?"

# game/cap1.rpy:18
translate english cap1_chegada_a1c2:

    # mc "É sim... estou meio nervosa."
    mc "Yes... I'm a little nervous."

# game/cap1.rpy:24
translate english cap1_chegada_88d9:

    # s "Relaxa! O segredo é sorrir e não derrubar a bandeja."
    s "Relax! The secret is to smile and not drop the tray."

# === Strings do menu ===

translate english strings:

    # game/script.rpy:8
    old "Início"
    new "Start"

    # game/screens.rpy:212
    old "Carregar partida"
    new "Load game"

    # game/screens.rpy:218
    old "Preferências"
    new "Preferences"

    # game/screens.rpy:240
    old "Bag ([qtd])"
    new "Bag ([qtd])"`}
      />

      <CommandTable
        title="Comandos translate do Launcher"
        variations={[
          {
            cmd: "renpy.exe . translate english",
            desc: "Gera/atualiza traduções para inglês.",
            output: "Cria game/tl/english/ com strings vazias para preencher.",
          },
          {
            cmd: "renpy.exe . translate japanese",
            desc: "Gera/atualiza traduções para japonês.",
            output: "Cria game/tl/japanese/.",
          },
          {
            cmd: "renpy.exe . merge_strings english antiga.txt",
            desc: "Mescla traduções vindas de tradutor externo (CSV/TXT).",
            output: "Útil para colaboração com tradutores que não usam Ren'Py.",
          },
          {
            cmd: "renpy.exe . extract_strings english out.txt",
            desc: "Extrai todas as strings PARA enviar a um tradutor.",
            output: "Gera arquivo plano com original + linha vazia.",
          },
          {
            cmd: "renpy.exe . lint",
            desc: "Avisa sobre traduções faltando ou inconsistentes.",
            output: "Reporta hashes que perderam o original (script mudou).",
          },
        ]}
      />

      <h2>5. Fontes para idiomas com caracteres especiais</h2>
      <p>
        A fonte padrão do Ren'Py NÃO tem ideogramas. Para japonês, chinês e
        coreano, baixe uma fonte CJK livre (ex: <strong>Noto Sans
        JP</strong>) e troque dinamicamente quando o idioma mudar:
      </p>

      <CodeBlock
        language="python"
        title="game/tl/japanese/japanese.rpy"
        code={`# Esse arquivo só é carregado quando o idioma "japanese" é ativo

translate japanese style default:
    font "fonts/NotoSansJP-Regular.ttf"
    size 24                       # ideogramas precisam um pouco maior

translate japanese style say_label:
    font "fonts/NotoSansJP-Bold.ttf"

translate japanese style say_dialogue:
    font "fonts/NotoSansJP-Regular.ttf"
    line_leading 4
    line_spacing 6

# Texto no menu principal pode precisar de ajuste de tamanho
translate japanese style button_text:
    size 22`}
      />

      <h2>6. Trocar idioma em runtime — o menu de preferências</h2>
      <p>
        O Ren'Py já oferece a action <code>Language("nome")</code> pronta para
        usar em qualquer botão. Adicione um bloco no <code>screen
        preferences</code> para o jogador escolher:
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy (trecho do screen preferences)"
        code={`vbox:
    style_prefix "pref"
    label _("Idioma / Language / 言語")
    textbutton "Português" action Language(None)
    textbutton "English"   action Language("english")
    textbutton "日本語"     action Language("japanese")`}
      />

      <h2>7. Strings dinâmicas com variáveis — atenção!</h2>
      <p>
        Strings com interpolação <code>"[nome]"</code> também precisam ser
        traduzidas — o Ren'Py mantém os colchetes intactos. Mas{" "}
        <strong>nunca concatene strings com +</strong> em linguagem natural;
        use sempre interpolação para o tradutor poder reordenar:
      </p>

      <CodeBlock
        language="python"
        title="errado vs certo"
        code={`# ❌ ERRADO — tradutor não consegue mudar a ordem
$ msg = "Você ganhou " + str(qtd) + " pontos com " + nome
e msg

# ✅ CERTO — interpolação preserva contexto
e "Você ganhou [qtd] pontos com [nome]!"

# Em japonês, o tradutor pode escrever:
# "[nome]から[qtd]ポイント獲得しました！"  (ordem invertida, mesma frase)`}
      />

      <h2>8. Imagens localizadas (ex: logos, screenshots)</h2>
      <p>
        Para versões traduzidas de imagens (logo do café em japonês, por
        exemplo), use o sistema <code>language</code> das declaracões{" "}
        <code>image</code>:
      </p>

      <CodeBlock
        language="python"
        title="game/imagens.rpy"
        code={`# Imagem padrão (PT-BR)
image logo_cafe = "images/logos/sakura_cafe_pt.png"

# Variantes por idioma
init python:
    config.language_callback = lambda lang: renpy.image(
        "logo_cafe",
        {
            None:       "images/logos/sakura_cafe_pt.png",
            "english":  "images/logos/sakura_cafe_en.png",
            "japanese": "images/logos/sakura_cafe_jp.png",
        }.get(lang, "images/logos/sakura_cafe_pt.png")
    )`}
      />

      <PracticeBox
        title="Traduza Sakura Café para inglês (3 falas)"
        goal="Validar todo o ciclo: gerar tradução → editar → testar trocando idioma."
        steps={[
          "No terminal: renpy.exe . translate english",
          "Abra game/tl/english/script.rpy e troque os 'new' das 3 primeiras falas para inglês.",
          "Em game/options.rpy adicione: config.translations = ['english']",
          "Rode o jogo, vá em Preferences → Language → English.",
          "Confirme que as 3 primeiras falas mudaram, e as outras (ainda não traduzidas) aparecem em PT-BR.",
        ]}
        verify={`Ao alternar Language("english"), as 3 falas trocam. Ao voltar Language(None), tudo retorna para PT-BR.`}
      />

      <h2>9. Lint e validação final</h2>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Detecta strings que perderam o original (script foi editado)",
            cmd: "renpy.exe . lint",
            out: `Translation issues:

  game/tl/english/cap1.rpy:14
    The translate block "cap1_chegada_47b3" has no matching original.
    The dialogue "Bem-vinda ao Sakura Café!" was edited or removed in cap1.rpy.

  game/tl/japanese/screens.rpy:212
    String "Carregar partida" appears 2x in original — translation may be ambiguous.

  ✓ english:  1378 / 1378 translated  (100%)
  ⚠ japanese:  982 / 1378 translated  (71%)

Lint took 0.92s.`,
            outType: "warning",
          },
          {
            comment: "Build distribui automaticamente as pastas tl/",
            cmd: "renpy.exe . distribute",
            out: `Building distributions for: SakuraCafe-1.0
  - SakuraCafe-1.0-pc.zip      (incluindo tl/english, tl/japanese)
  - SakuraCafe-1.0-mac.zip
  - SakuraCafe-1.0-linux.tar.bz2

Done.`,
            outType: "success",
          },
        ]}
      />

      <OutputBlock label="Tela in-game ao alternar Language('japanese')" type="info">
{`┌─ Sakura Café ─────────────────────────────────┐
│                                               │
│  さくら: 「ようこそ桜カフェへ！               │
│           初日かしら？」                      │
│                                               │
│  > はい... ちょっと緊張しています             │
│  > 大丈夫です！                               │
│                                               │
└───────────────────────────────────────────────┘
   (fonte NotoSansJP-Regular.ttf carregada)`}
      </OutputBlock>

      <AlertBox type="warning" title="Cuidado: re-translate apaga edições?">
        Não. Re-rodar <code>translate english</code> apenas{" "}
        <strong>adiciona</strong> entradas novas (das falas inéditas) e
        <strong> nunca</strong> apaga as suas traduções. Se você editar uma
        fala original, o hash muda e a tradução antiga vira "órfã" — o lint
        avisa, e você decide se reaproveita ou descarta.
      </AlertBox>

      <AlertBox type="success" title="Boa prática: peça beta-testers nativos">
        Tradução automática (Google Translate / DeepL) é ponto de partida,
        nunca o resultado final. Recrute na comunidade do Ren'Py
        (lemmasoft fórum, Discord) jogadores nativos para revisar — eles
        costumam ajudar de graça em troca dos créditos no jogo.
      </AlertBox>
    </PageContainer>
  );
}
