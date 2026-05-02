import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Configuracao() {
  return (
    <PageContainer
      title="config.* — as 30 variáveis que você precisa conhecer"
      subtitle="O namespace config.* controla quase tudo: nome do jogo, versão, save_directory, GL2, layers, font_replacement_map, callbacks, atalhos, layout. Esta página lista as 30+ variáveis que aparecem em projetos reais do dia-a-dia."
      difficulty="intermediario"
      timeToRead="22 min"
      prompt="config/configuracao"
    >
      <AlertBox type="info" title="config vs gui vs preferences vs persistent">
        <strong>config.*</strong> = configuração TÉCNICA do jogo (nome,
        renderer, callbacks). Definido em <code>options.rpy</code>.{" "}
        <strong>gui.*</strong> = configuração VISUAL (cores, tamanhos).{" "}
        <strong>preferences.*</strong> = preferências do JOGADOR (volume,
        velocidade), persistidas. <strong>persistent.*</strong> = dados
        que sobrevivem entre saves (achievements, skins).
      </AlertBox>

      <h2>1. As variáveis de IDENTIDADE (config.name e cia)</h2>

      <CommandTable
        title="Identificação do jogo"
        variations={[
          { cmd: "config.name", desc: "Nome do jogo. Aparece em saves e janela.", output: "config.name = _('Sakura Café')" },
          { cmd: "config.version", desc: "Versão atual (string). Mostrada no menu principal.", output: "config.version = '1.0.0'" },
          { cmd: "config.window_title", desc: "Título da janela do SO. Default = config.name.", output: "config.window_title = 'Sakura Café — VN'" },
          { cmd: "config.window_icon", desc: "Ícone .png exibido na barra de tarefas.", output: "config.window_icon = 'gui/window_icon.png'" },
          { cmd: "config.save_directory", desc: "Subpasta em ~/RenPy/ onde saves são gravados.", output: "config.save_directory = 'SakuraCafe-1234567890'" },
          { cmd: "config.has_autosave", desc: "Se False, desliga o autosave automático.", output: "config.has_autosave = True" },
          { cmd: "config.has_quicksave", desc: "Se False, esconde o botão Quick Save.", output: "config.has_quicksave = True" },
          { cmd: "config.thumbnail_width / thumbnail_height", desc: "Tamanho dos thumbnails de save.", output: "config.thumbnail_width = 384" },
        ]}
      />

      <h2>2. RENDERER e PERFORMANCE</h2>

      <CommandTable
        title="Variáveis técnicas — renderização e desempenho"
        variations={[
          { cmd: "config.gl2", desc: "Habilita renderer GL2 (shaders, model-based).", output: "config.gl2 = True  # padrão Ren'Py 8" },
          { cmd: "config.gl_resize", desc: "Permite redimensionar janela.", output: "config.gl_resize = True" },
          { cmd: "config.gl_npot", desc: "Permite texturas NÃO power-of-2.", output: "config.gl_npot = True" },
          { cmd: "config.image_cache_size", desc: "Cache de imagens descomprimidas (MB).", output: "config.image_cache_size = 128" },
          { cmd: "config.predict_statements", desc: "Quantos statements futuros pré-carregar.", output: "config.predict_statements = 2" },
          { cmd: "config.cache_surfaces", desc: "Cache surfaces SDL (memory tradeoff).", output: "config.cache_surfaces = False" },
          { cmd: "config.framerate", desc: "FPS alvo (None = vsync).", output: "config.framerate = 60" },
          { cmd: "config.physical_height / physical_width", desc: "Resolução FÍSICA (depois de scale).", output: "config.physical_width = 1920" },
        ]}
      />

      <h2>3. LAYERS — ordem visual da tela</h2>
      <p>
        Layers são "camadas" empilhadas. O default é{" "}
        <code>['master', 'transient', 'screens', 'overlay']</code>. Você
        pode adicionar layers próprias para HUD do café, partículas, etc.
      </p>

      <CodeBlock
        language="python"
        title="game/options.rpy — layers customizadas"
        code={`# Adiciona layer 'hud_cafe' ENTRE master e transient
define config.layers = [ "master", "hud_cafe", "transient", "screens", "overlay" ]

# Layer 'partículas' acima de tudo
define config.layers = [ "master", "transient", "screens", "particulas", "overlay" ]

# Tornar uma layer "limpável" só com 'scene'
define config.clear_layers = [ "master", "hud_cafe" ]

# Mostrar uma imagem na layer custom
label start:
    show petalas onlayer particulas
    scene bg cafe                    # NÃO limpa 'particulas'
    show sakura feliz                # vai pra 'master' por default
    return`}
      />

      <h2>4. FONTES e tradução</h2>

      <CommandTable
        title="Mapeamento e substituição de fontes"
        variations={[
          { cmd: "config.font_replacement_map", desc: "Substitui (font, bold, italic) por outro arquivo.", output: "{('Mochiy.ttf', True, False): 'MochiyBold.ttf'}" },
          { cmd: "config.replace_text", desc: "Substituições automáticas em strings ('--' → '—').", output: "{'...': '…', '--': '—'}" },
          { cmd: "config.modes_handler", desc: "Hook que muda fonte em modo NVL automaticamente.", output: "config.modes_handler = setup_nvl_font" },
          { cmd: "config.language", desc: "Linguagem ativa (None default; 'en','pt_BR'...).", output: "config.language = 'pt_BR'" },
          { cmd: "config.translation_directory", desc: "Pasta dos arquivos .rpy de tradução.", output: "config.translation_directory = 'tl'" },
          { cmd: "config.font_transforms", desc: "Lista de transforms aplicados a TODA fonte.", output: "config.font_transforms = ['bold_italic']" },
        ]}
      />

      <h2>5. ATALHOS, MENUS, MOUSE</h2>

      <CommandTable
        title="UX e input"
        variations={[
          { cmd: "config.developer", desc: "Modo dev (Shift+O console, lint, warnings).", output: "config.developer = 'auto'  # True só fora de build release" },
          { cmd: "config.console", desc: "Permite console (Shift+O) mesmo fora de dev.", output: "config.console = False" },
          { cmd: "config.skipping", desc: "Se 'fast' ou True, permite skip.", output: "config.skipping = True" },
          { cmd: "config.allow_skipping", desc: "Liga/desliga skip globalmente.", output: "config.allow_skipping = True" },
          { cmd: "config.fast_skipping", desc: "Skip ULTRA-rápido (ignora unread).", output: "config.fast_skipping = False" },
          { cmd: "config.rollback_enabled", desc: "Rollback (clique direito).", output: "config.rollback_enabled = True" },
          { cmd: "config.hard_rollback_limit", desc: "Quantos statements rollback aceita.", output: "config.hard_rollback_limit = 100" },
          { cmd: "config.mouse", desc: "Cursor custom (dict por estado).", output: "config.mouse = {'default': [('cursor.png', 0, 0)]}" },
          { cmd: "config.mouse_hide_time", desc: "Esconde mouse após N segundos parado.", output: "config.mouse_hide_time = 30" },
          { cmd: "config.keymap", desc: "Atalhos custom (dict 'evento': teclas).", output: "config.keymap['skip'] = ['K_TAB','K_LCTRL']" },
          { cmd: "config.gestures", desc: "Mapa de gestos para mobile (swipe, pinch).", output: "config.gestures = {'n_n_n': 'skip'}" },
          { cmd: "config.context_callback", desc: "Função chamada ao entrar/sair de contexto.", output: "config.context_callback = log_context" },
          { cmd: "config.menu_clear_layers", desc: "Layers limpas ao abrir game_menu.", output: "config.menu_clear_layers = ['hud']" },
        ]}
      />

      <h2>6. CALLBACKS — hooks da engine</h2>

      <CommandTable
        title="Funções chamadas em momentos-chave"
        variations={[
          { cmd: "config.start_callbacks", desc: "Lista de fns chamadas ao APERTAR Start.", output: "config.start_callbacks.append(reset_estatisticas)" },
          { cmd: "config.after_load_callbacks", desc: "Fns chamadas após carregar um save.", output: "config.after_load_callbacks.append(rever_versao)" },
          { cmd: "config.quit_callbacks", desc: "Fns chamadas ao fechar o jogo.", output: "config.quit_callbacks.append(salvar_telemetria)" },
          { cmd: "config.label_callback", desc: "Fn chamada toda vez que entra num label.", output: "config.label_callback = log_label" },
          { cmd: "config.statement_callback", desc: "Fn em cada statement.", output: "config.statement_callback = contar_falas" },
          { cmd: "config.character_callback", desc: "Hook PADRÃO para todos os Character (begin/show/end).", output: "config.character_callback = som_de_digitar" },
          { cmd: "config.say_menu_text_filter", desc: "Filtra texto antes de exibir.", output: "config.say_menu_text_filter = lambda s: s.upper()" },
        ]}
      />

      <h2>7. Exemplo COMPLETO — options.rpy do Sakura Café</h2>

      <CodeBlock
        language="python"
        title="game/options.rpy"
        code={`################################################################################
## IDENTIDADE
################################################################################
define config.name      = _("Sakura Café")
define config.version   = "1.0.3"
define gui.show_name    = True
define gui.about        = _("Uma visual novel sobre amor, café e segundas chances.\\n\\nDesenvolvido por Wallyson — 2026.")
define build.name       = "SakuraCafe"
define config.save_directory = "SakuraCafe-2026-04-04"

################################################################################
## PERFORMANCE
################################################################################
define config.gl2                  = True
define config.image_cache_size     = 192
define config.predict_statements   = 3
define config.framerate            = 60

################################################################################
## TEXTO
################################################################################
define config.replace_text = {
    "...": "…",
    "--": "—",
    "->": "→",
}
define config.font_replacement_map = {
    ("fonts/Mochiy.ttf", True, False): "fonts/MochiyBold.ttf",
}
define config.has_autosave   = True
define config.has_quicksave  = True
define config.thumbnail_width  = 384
define config.thumbnail_height = 216

################################################################################
## LAYERS
################################################################################
define config.layers = [
    "master",
    "hud_cafe",       # HUD com pedidos pendentes
    "particulas",     # pétalas, neve, fumaça
    "transient",
    "screens",
    "overlay",
]
define config.clear_layers = ["master"]

################################################################################
## DEV
################################################################################
define config.developer = "auto"   # True quando 'renpy.exe . run', False em build
define config.console   = False    # libera com SHIFT+O em dev

################################################################################
## CALLBACKS
################################################################################
init python:
    def _logar_inicio():
        renpy.notify("Bem-vindo(a) ao Sakura Café!")

    def _verificar_save_antigo():
        if persistent.versao_save < "1.0.3":
            renpy.notify("Save de versão antiga — alguns recursos novos foram desbloqueados.")

    config.start_callbacks.append(_logar_inicio)
    config.after_load_callbacks.append(_verificar_save_antigo)

################################################################################
## BUILD
################################################################################
init python:
    build.classify("**.psd", None)         # NÃO incluir PSDs no build
    build.classify("**~", None)            # NÃO incluir backups
    build.classify("dev_notes/**", None)
    build.documentation("*.html")
    build.documentation("*.txt")`}
      />

      <h2>8. Variáveis OBSCURAS mas úteis</h2>

      <CommandTable
        title="config.* avançadas — pouca doc, muito poder"
        variations={[
          { cmd: "config.exception_handler", desc: "Função custom p/ tratar exceções (substitui tela vermelha).", output: "config.exception_handler = handler_amigavel" },
          { cmd: "config.window_show_transition", desc: "Transição padrão ao MOSTRAR a textbox.", output: "config.window_show_transition = Dissolve(0.2)" },
          { cmd: "config.window_hide_transition", desc: "Transição padrão ao ESCONDER textbox.", output: "config.window_hide_transition = Dissolve(0.2)" },
          { cmd: "config.adv_nvl_transition", desc: "Transição entre modo ADV e NVL.", output: "config.adv_nvl_transition = fade" },
          { cmd: "config.scene_callbacks", desc: "Hooks chamados em cada 'scene'.", output: "config.scene_callbacks.append(fn)" },
          { cmd: "config.show_callbacks", desc: "Hooks em cada 'show'.", output: "config.show_callbacks.append(fn)" },
          { cmd: "config.imagemap_cache", desc: "Cache de imagemaps em disco.", output: "config.imagemap_cache = True" },
          { cmd: "config.tts_voice", desc: "Voz default do self-voicing (TTS).", output: "config.tts_voice = 'voice2'" },
          { cmd: "config.script_version", desc: "Versão do script (None pula warnings).", output: "config.script_version = None" },
          { cmd: "config.start_scene_black", desc: "Tela inicial preta antes do main_menu.", output: "config.start_scene_black = True" },
        ]}
      />

      <Terminal
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "ver TODAS variáveis config.* atuais",
            cmd: "# no console (SHIFT+O):",
            out: `>>> [k for k in dir(config) if not k.startswith('_')][:10]
['adv_nvl_transition', 'after_load_callbacks', 'allow_skipping',
 'archives', 'auto_choice_delay', 'autosave_frequency', 'cache_surfaces',
 'character_callback', 'clear_layers', 'console']`,
            outType: "info",
          },
          {
            comment: "lint avisa de config inválido",
            cmd: "renpy.exe . lint",
            out: `game/options.rpy:34 Setting config.image_cache_size to 1024 — that's a lot of RAM.
Lint took 0.3s.`,
            outType: "warning",
          },
        ]}
      />

      <PracticeBox
        title="Configure o Sakura Café com 5 callbacks e 2 layers customizadas"
        goal="Praticar callbacks (start, after_load, quit) e adicionar layers HUD e partículas."
        steps={[
          "Em options.rpy adicione 'config.layers = [\"master\",\"hud_cafe\",\"particulas\",\"transient\",\"screens\",\"overlay\"]'.",
          "Crie 3 funções: log_inicio(), checar_save(), salvar_log_quit().",
          "Use config.start_callbacks.append(log_inicio), config.after_load_callbacks.append(checar_save), config.quit_callbacks.append(salvar_log_quit).",
          "Em script.rpy faça 'show petalas onlayer particulas' antes de 'scene bg cafe'.",
          "Verifique que ao trocar de scene as pétalas continuam (porque estão em layer separada).",
        ]}
        verify="Ao iniciar o jogo aparece notify 'Bem-vindo'. Ao mudar de cena, as pétalas seguem caindo."
      />

      <OutputBlock label="hierarquia config / gui / preferences / persistent" type="info">
{`config.*       → técnico (renderer, callbacks, layers)         em options.rpy
gui.*          → visual (cores, fontes, sizes)                 em gui.rpy
preferences.*  → escolhas do jogador (volume, velocidade)       persistido auto
persistent.*   → dados entre saves (achievements, unlocks)      define em init`}
      </OutputBlock>

      <AlertBox type="warning" title="config.save_directory NÃO pode mudar depois do release">
        Se você publicar o jogo com{" "}
        <code>config.save_directory = "Sakura"</code> e depois mudar
        para <code>"SakuraCafe"</code>, todos os jogadores PERDEM os
        saves antigos (eles ficam na pasta antiga). Escolha o diretório
        DEFINITIVO antes do primeiro release público.
      </AlertBox>

      <AlertBox type="success" title="Próximo">
        Para personalizar o que o JOGADOR pode ajustar (volume, velocidade
        de texto, fullscreen, idioma), vá para a página{" "}
        <strong>Preferências</strong>.
      </AlertBox>
    </PageContainer>
  );
}
