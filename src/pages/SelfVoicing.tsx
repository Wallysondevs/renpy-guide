import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function SelfVoicing() {
  return (
    <PageContainer
      title="Self-Voicing & Acessibilidade"
      subtitle="Self-voicing é o TTS embutido do Ren'Py: aperta V e a engine começa a ler em voz alta toda fala, narração e botão. Junto com alt= em imagens e clipboard_voicing, transforma o Sakura Café em uma VN acessível para jogadores cegos ou com baixa visão."
      difficulty="intermediario"
      timeToRead="12 min"
      prompt="acessibilidade/self-voicing"
    >
      <AlertBox type="info" title="Por que isso importa de verdade">
        Cerca de 2,2 bilhões de pessoas têm algum grau de deficiência visual
        (OMS). Self-voicing transforma sua VN num <em>audio drama
        interativo</em> sem precisar gravar voz para cada fala. Em algumas
        jurisdições (UE, Reino Unido) acessibilidade básica é{" "}
        <strong>obrigatória</strong> para distribuir software.
      </AlertBox>

      <h2>1. Como o jogador ativa</h2>
      <p>
        Por padrão, qualquer build do Ren'Py 7.x+ aceita as teclas:
      </p>

      <CommandTable
        title="Atalhos de self-voicing"
        variations={[
          {
            cmd: "V",
            desc: "Liga / desliga self-voicing completo (lê tudo).",
            output: "Notify: 'Self-voicing enabled' / 'disabled'",
          },
          {
            cmd: "Shift+V",
            desc: "Modo clipboard-voicing: copia texto da fala atual para a área de transferência.",
            output: "Útil para usar com leitor de tela externo.",
          },
          {
            cmd: "Alt+V",
            desc: "Self-voicing apenas dos textos sem áudio (voice acting já gravado).",
            output: "Combina dublagem real com TTS para narração.",
          },
        ]}
      />

      <h2>2. O que a engine lê automaticamente</h2>
      <ul>
        <li><strong>Falas</strong> de todo Character (com ou sem voz).</li>
        <li><strong>Narração</strong> (linhas sem personagem definido).</li>
        <li><strong>Menus</strong> de escolha — lê cada opção ao focar.</li>
        <li><strong>Screens</strong> — botões com <code>alt</code> definido.</li>
        <li><strong>Notificações</strong> via <code>renpy.notify()</code>.</li>
      </ul>

      <h2>3. Configuração no options.rpy</h2>

      <CodeBlock
        title="game/options.rpy"
        language="python"
        code={`# Permite que self-voicing seja ligado pelo jogador (default: True)
define config.allow_voice = True
define config.tts_voice = "default"   # ou nome de voz instalada no SO

# Voz default — usa a do sistema (eSpeak no Linux, SAPI no Windows, NSSpeechSynth no macOS)
define config.tts_substitutions = [
    # Substitui texto X por Y na hora de falar (correção de pronúncia)
    (r"\\bSakura\\b", "Sa-koo-rah"),
    (r"\\bYuki\\b", "You-key"),
    (r"\\bAkira\\b", "A-kee-rah"),
]

# Self-voicing por canal (toca sons antes/depois da fala TTS)
define config.tts_channel = "voice"
define config.tts_voice_volume = 0.8`}
      />

      <h2>4. Atributo <code>alt</code> em imagens e botões</h2>
      <p>
        Sem <code>alt=</code>, self-voicing pula imagens e botões silenciosos.
        Sempre que mostrar algo importante visualmente, descreva:
      </p>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`label cena_aniversario:
    # Cenário com alt — TTS lê quando entra em cena
    scene bg cafe_decorado with fade
    $ renpy.alt("O café está enfeitado com balões rosa e dourado, uma faixa diz 'Feliz Aniversário Sakura'.")

    # Sprite com alt explícito
    show sakura surpresa at center
    $ renpy.alt("Sakura aparece, leva as mãos ao rosto, surpresa e emocionada.")

    s "Vocês... vocês organizaram tudo isso pra mim?"

    # CG importante — descreve com riqueza
    scene cg primeira_noite with dissolve
    $ renpy.alt("Sakura e Yuki sentadas lado a lado no terraço do café, observando os fogos de artifício no céu. As silhuetas se inclinam levemente uma para a outra.")
    return`}
      />

      <h2>5. Botões com <code>alt</code> e <code>tooltip</code></h2>

      <CodeBlock
        title="game/screens.rpy"
        language="python"
        code={`screen cardapio_cafe():
    vbox:
        spacing 10
        textbutton "Café com leite":
            action SetVariable("pedido", "cafe_leite")
            alt _("Café com leite, R$ 6,00")
            tooltip _("O clássico da Sakura, leite vaporizado e café 50/50.")

        textbutton "Matcha latte":
            action SetVariable("pedido", "matcha")
            alt _("Matcha latte, R$ 8,00")
            tooltip _("Matcha cerimonial misturado com leite cremoso.")

        # Botão só com ícone — alt obrigatório
        imagebutton:
            idle "ui/btn_voltar.png"
            action Return()
            alt _("Voltar para o cardápio principal")`}
      />

      <h2>6. Personalizando a voz por personagem</h2>
      <p>
        Você pode marcar diálogos de personagens diferentes com <em>voice
        substitution</em> para que a TTS use timbre/velocidade distinto:
      </p>

      <CodeBlock
        title="game/characters.rpy"
        language="python"
        code={`# Cada personagem com sua "voz" virtual — pre/pós-string para o TTS
define s = Character(
    "Sakura",
    color="#ffaacc",
    voice_tag="sakura",
    what_prefix="",
    what_suffix="",
)

define y = Character(
    "Yuki",
    color="#aaccff",
    voice_tag="yuki",
)

init python:
    # Mapeia voice_tag -> voz do sistema (depende do SO)
    config.character_tts_voice = {
        "sakura": "Microsoft Haruka Desktop",   # Windows
        "yuki": "Microsoft Ayumi Desktop",
        # macOS: "Kyoko", "Otoya"
        # Linux eSpeak: "ja+f3", "ja+m3"
    }`}
      />

      <h2>7. Clipboard voicing (integração com NVDA / VoiceOver)</h2>
      <p>
        Algumas pessoas preferem o leitor de tela do próprio sistema (NVDA,
        JAWS, VoiceOver) em vez do TTS interno. Habilite copiar
        automaticamente:
      </p>

      <CodeBlock
        title="game/options.rpy"
        language="python"
        code={`# Liga clipboard voicing — toda fala é copiada para a área de transferência
define config.clipboard_voicing = True

# O leitor externo (NVDA) lê automaticamente o que está no clipboard
# se configurado para "speak text from clipboard".`}
      />

      <h2>8. Velocidade de leitura e auto-forward</h2>
      <p>
        Para acessibilidade completa, ofereça opção de auto-forward que
        respeita o ritmo da TTS:
      </p>

      <CodeBlock
        title="game/screens.rpy — preferências de acessibilidade"
        language="python"
        code={`screen preferences():
    # ... outras prefs ...
    vbox:
        label _("Acessibilidade")

        textbutton _("Self-voicing"):
            action Preference("self voicing", "toggle")
            alt _("Ativa ou desativa narração automática.")

        textbutton _("Clipboard voicing"):
            action Preference("clipboard voicing", "toggle")
            alt _("Copia falas para clipboard para uso com leitor externo.")

        bar value Preference("text speed")
        bar value Preference("auto-forward time")
        bar value Preference("self voicing volume drop")  # abaixa música durante TTS`}
      />

      <h2>9. Testando — sem precisar de leitor de tela</h2>

      <Terminal
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Roda o jogo e força self-voicing já ligado",
            cmd: "RENPY_TTS_DEBUG=1 ./renpy.sh .",
            out: `[TTS] Self-voicing initialized: espeak-ng
[TTS] Voice: pt-BR (Brazilian Portuguese, female)
[TTS] Speaking: "Bem-vindo ao Sakura Café!"
[TTS] Speaking: "Sakura aparece, leva as mãos ao rosto..."`,
            outType: "info",
          },
          {
            comment: "Audita quais imagens estão sem alt",
            cmd: "./renpy.sh . lint --strict | grep -i alt",
            out: `game/script.rpy:142 Image 'cg cozinha' shown without alt text.
game/script.rpy:201 Image 'bg jardim noite' shown without alt text.
2 accessibility warnings.`,
            outType: "warning",
          },
        ]}
      />

      <h2>10. Audio descriptions (opcional, para CGs importantes)</h2>
      <p>
        Para CGs e cinematics realmente importantes, grave uma descrição em
        áudio (igual a series no streaming):
      </p>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`label primeira_noite:
    scene cg primeira_noite with dissolve
    $ renpy.alt("Sakura e Yuki sentadas no terraço, observando fogos.")

    # Para usuários com self-voicing ON, toca audio description completa
    if _preferences.self_voicing:
        play voice "audio/desc/primeira_noite.ogg"
        $ renpy.pause(8.0)  # tempo da descrição

    s "Que noite linda..."
    return`}
      />

      <h2>11. Subtítulos para áudio (opposite case)</h2>
      <p>
        Acessibilidade para surdos: forneça legendas para SFX importantes:
      </p>

      <CodeBlock
        title="game/script.rpy"
        language="python"
        code={`label cena_chuva:
    scene bg cafe_chuva with fade
    play sound "audio/chuva.ogg" loop

    # Descrição auditiva visível
    if persistent.show_sfx_captions:
        $ renpy.notify("[ chuva fina caindo no telhado ]")

    "A Sakura observava a janela molhada."
    return`}
      />

      <PracticeBox
        title="Torne o capítulo 1 do Sakura Café acessível"
        goal="Adicionar alt text em todas as cenas e sprites do label start, ativar clipboard voicing por padrão e validar com lint."
        steps={[
          "Em options.rpy, defina config.allow_voice = True e config.clipboard_voicing = True.",
          "No label start, depois de cada scene/show, adicione um $ renpy.alt(...) com 1-2 frases descritivas.",
          "Em screens.rpy, adicione textbutton 'Self-voicing' nas preferências.",
          "Adicione substitutions de pronúncia para nomes japoneses (Sakura, Yuki).",
          "Rode renpy.sh . lint --strict e elimine todos os warnings de accessibility.",
          "Teste com a tecla V dentro do jogo — TTS deve narrar tudo sem ficar mudo em sprite.",
        ]}
        verify="Tecla V ativa narração, lint não reporta nenhuma imagem sem alt, e textos copiados pelo Shift+V aparecem no clipboard."
      />

      <OutputBlock label="checklist de acessibilidade do Sakura Café" type="success">
{`[ ] config.allow_voice = True
[ ] Toda scene/CG tem $ renpy.alt(...)
[ ] Todo imagebutton tem alt= explícito
[ ] config.tts_substitutions corrige pronúncia de nomes
[ ] Tela de preferências tem toggle de self-voicing
[ ] Tela de preferências tem toggle de clipboard voicing
[ ] SFX importantes têm legenda visível
[ ] Lint --strict passa sem warnings de accessibility
[ ] Manual menciona V e Shift+V`}
      </OutputBlock>

      <AlertBox type="warning" title="Limitações conhecidas">
        Voz default em Linux usa <code>espeak-ng</code> — soa robótica em
        português. Para qualidade melhor, instale vozes do sistema (Microsoft
        SAPI no Windows, NSSpeechSynth no macOS) e mapeie em
        <code> config.character_tts_voice</code>.
      </AlertBox>

      <AlertBox type="success" title="Próximo passo">
        Em <strong>Developer Tools</strong> você verá os atalhos
        <code> Shift+O</code>, <code>Shift+V</code>, <code>Shift+R</code> e
        outros — o canivete suíço para debugar Sakura Café sem reabrir o
        jogo.
      </AlertBox>
    </PageContainer>
  );
}
