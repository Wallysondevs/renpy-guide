import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function RenPyFiles() {
  return (
    <PageContainer
      title="Arquivos _ren.py — Python puro com superpoderes"
      subtitle="Quando init python: dentro de .rpy fica gigante e o editor não entende mais nada, mude para arquivo _ren.py: Python 100% reconhecido pelo VSCode/PyCharm, com debugger, autocomplete e linter, mas executado pelo Ren'Py exatamente como init python: estaria."
      difficulty="intermediario"
      timeToRead="11 min"
      prompt="python/ren-files"
    >
      <AlertBox type="info" title="O que é _ren.py">
        Desde Ren'Py 8.0, qualquer arquivo dentro de <code>game/</code> com
        nome terminando em <code>_ren.py</code> é tratado como se fosse um
        bloco <code>init python:</code> de prioridade 0. A diferença
        crucial: como a extensão é <code>.py</code>, o seu editor (VSCode,
        PyCharm, Sublime, Neovim) trata o arquivo como Python puro — com
        autocomplete, type hints, refactoring, debugger e linter funcionando
        100%.
      </AlertBox>

      <h2>1. Por que isso é uma revolução</h2>
      <p>
        Antes do <code>_ren.py</code>, lógica Python pesada (classes,
        algoritmos, parsers) precisava ficar dentro de <code>init python:</code>
        em arquivos <code>.rpy</code>. Resultado: o editor via tudo como
        "linguagem desconhecida", sem autocomplete, sem ir-pra-definição,
        sem inspeção de tipo. Você programava no escuro.
      </p>
      <p>
        Com <code>_ren.py</code>, a engine entende que "se o nome termina
        com <code>_ren.py</code>, eu pré-processo, transformo em init python
        e executo". Para o Python externo é só um arquivo <code>.py</code>
        normal.
      </p>

      <h2>2. Estrutura mínima de um _ren.py</h2>

      <CodeBlock
        language="python"
        title="game/sistema_cafe_ren.py"
        code={`"""
Sistema de cardápio do Sakura Café.
Este arquivo é equivalente a um init python: gigante.
"""

# A primeira linha de código DEVE ser este comentário mágico
# (opcional mas recomendado): diz ao linter onde vão os símbolos do Ren'Py.
"""renpy
init python:
"""

from dataclasses import dataclass

@dataclass
class ItemCardapio:
    nome: str
    preco: float
    categoria: str  # "bebida" | "doce" | "salgado"
    vegano: bool = False

CARDAPIO = [
    ItemCardapio("Café espresso",       6.00, "bebida"),
    ItemCardapio("Cappuccino",          9.00, "bebida"),
    ItemCardapio("Matcha latte",       12.00, "bebida", vegano=True),
    ItemCardapio("Brigadeiro",          5.00, "doce"),
    ItemCardapio("Torta de morango",   14.00, "doce"),
    ItemCardapio("Sanduíche natural",  18.00, "salgado", vegano=True),
]

def itens_veganos():
    return [i for i in CARDAPIO if i.vegano]

def total_pedido(itens):
    return sum(i.preco for i in itens)`}
      />

      <p>
        Repare nas <strong>aspas triplas mágicas</strong> com{" "}
        <code>"""renpy ... """</code>. Esse docstring especial diz ao
        Ren'Py em qual contexto rodar o resto: <code>init python:</code>,
        <code>init -1 python:</code>, <code>init python early:</code>, etc.
        Se omitir, o padrão é <code>init python:</code> prioridade 0.
      </p>

      <h2>3. Comparação direta — .rpy vs _ren.py</h2>

      <CommandTable
        title="Quando usar cada formato"
        variations={[
          { cmd: ".rpy com init python:", desc: "Lógica curta, próxima de labels/screens.", output: "Pequenos defaults, helpers de UI." },
          { cmd: "_ren.py", desc: "Classes complexas, algoritmos, parsers, sistemas de save.", output: "Inventário, combat system, NPC AI." },
          { cmd: ".rpy", desc: "Roteiro (labels, dialogues, menus).", output: "Sempre. Roteiro NÃO vai em _ren.py." },
          { cmd: "_ren.py", desc: "Tipo-checagem com mypy/pyright.", output: "Editor mostra erros de tipo em tempo real." },
          { cmd: ".rpy com init python:", desc: "Hot-reload com Shift+R durante dev.", output: "Funciona em ambos, mas mais natural em .rpy." },
          { cmd: "_ren.py", desc: "Importar bibliotecas Python externas.", output: "Sintaxe import normal funciona idem." },
        ]}
      />

      <h2>4. Variantes de docstring — escolhendo o init</h2>

      <CodeBlock
        language="python"
        title="game/early_ren.py"
        code={`"""renpy
init -1500 python early:
"""
# Roda ANTES de tudo (registrar shaders, custom statements, etc.)

import renpy

renpy.register_shader("cafe.pulse", variables="""
    uniform sampler2D tex0;
    uniform float u_time;
    attribute vec2 a_tex_coord;
    varying vec2 v_tex_coord;
""", vertex_300="v_tex_coord = a_tex_coord;",
   fragment_300="gl_FragColor = texture2D(tex0, v_tex_coord);")`}
      />

      <CommandTable
        title="Docstrings 'mágicas' suportadas"
        variations={[
          { cmd: '"""renpy\\ninit python:\\n"""', desc: "Padrão. Roda na inicialização.", output: "Prioridade 0." },
          { cmd: '"""renpy\\ninit -1500 python:\\n"""', desc: "Prioridade negativa: roda antes do padrão.", output: "Para defaults/configs base." },
          { cmd: '"""renpy\\ninit python early:\\n"""', desc: "Roda MUITO cedo: antes do parsing dos .rpy.", output: "Para register_shader, register_statement, etc." },
          { cmd: '"""renpy\\ninit 999 python:\\n"""', desc: "Prioridade alta: roda por último.", output: "Para overrides finais." },
        ]}
      />

      <h2>5. Importando _ren.py em outros _ren.py</h2>
      <p>
        Sim, funciona. Use <code>import</code> Python normal, mas{" "}
        <strong>sem o sufixo _ren</strong>: o Ren'Py registra o módulo com o
        nome sem o sufixo.
      </p>

      <CodeBlock
        language="python"
        title="game/utils_ren.py"
        code={`"""renpy
init -100 python:
"""

def formatar_preco(centavos):
    return f"R$ {centavos/100:.2f}"`}
      />

      <CodeBlock
        language="python"
        title="game/sistema_cafe_ren.py (consumidor)"
        code={`"""renpy
init python:
"""

from utils import formatar_preco

class Pedido:
    def __init__(self):
        self.itens = []

    def total_str(self):
        total_centavos = sum(i.preco * 100 for i in self.itens)
        return formatar_preco(int(total_centavos))`}
      />

      <h2>6. Type hints + Pyright/mypy</h2>
      <p>
        Como é Python real, você pode (e DEVE) usar type hints. Combine com
        Pyright no VSCode para ter erros em tempo real:
      </p>

      <CodeBlock
        language="python"
        title="game/save_system_ren.py"
        code={`"""renpy
init python:
"""

from typing import Optional

class EstadoJogo:
    afeto_sakura: int = 0
    afeto_yuki: int   = 0
    afeto_akira: int  = 0
    rota_atual: Optional[str] = None
    cafes_servidos: int = 0

    def melhor_afeto(self) -> str:
        valores = {
            "sakura": self.afeto_sakura,
            "yuki":   self.afeto_yuki,
            "akira":  self.afeto_akira,
        }
        return max(valores, key=valores.get)

# Instância global usada pelo script
estado = EstadoJogo()`}
      />

      <h2>7. Acessando o store do Ren'Py</h2>

      <CodeBlock
        language="python"
        title="game/integration_ren.py"
        code={`"""renpy
init python:
"""

# Variáveis Ren'Py vivem em renpy.store (alias 'store')
import renpy.store as store

def grant_afeto(personagem, valor):
    """Incrementa afeto e mostra notify."""
    chave = f"afeto_{personagem}"
    atual = getattr(store, chave, 0)
    setattr(store, chave, atual + valor)
    renpy.notify(f"+{valor} afeto com {personagem.title()}")

# persistente
def melhor_ranking(novo):
    if novo > store.persistent.melhor:
        store.persistent.melhor = novo
        return True
    return False`}
      />

      <h2>8. Exemplo completo: Inventário tipado</h2>

      <CodeBlock
        language="python"
        title="game/inventario_ren.py"
        code={`"""renpy
init python:
"""

from dataclasses import dataclass, field
from typing import Dict, List

@dataclass
class Item:
    id: str
    nome: str
    descricao: str
    icone: str
    empilhavel: bool = True

@dataclass
class Inventario:
    slots: Dict[str, int] = field(default_factory=dict)

    def adicionar(self, item: Item, qtd: int = 1):
        if item.empilhavel:
            self.slots[item.id] = self.slots.get(item.id, 0) + qtd
        else:
            self.slots[item.id] = 1

    def remover(self, item_id: str, qtd: int = 1) -> bool:
        if self.slots.get(item_id, 0) < qtd:
            return False
        self.slots[item_id] -= qtd
        if self.slots[item_id] == 0:
            del self.slots[item_id]
        return True

    def listar(self) -> List[str]:
        return list(self.slots.keys())

CATALOGO = {
    "graos_arabica": Item("graos_arabica", "Grãos Arábica", "Para café especial.", "ui/grao.png"),
    "leite_aveia":   Item("leite_aveia",   "Leite de aveia", "Para opção vegana.", "ui/leite.png"),
    "matcha":        Item("matcha", "Pó de matcha", "Importado do Japão.", "ui/matcha.png"),
}`}
      />

      <Terminal
        path="~/sakura-cafe/game"
        lines={[
          {
            comment: "Listar arquivos _ren.py do projeto",
            cmd: "ls *_ren.py",
            out: `inventario_ren.py
save_system_ren.py
sistema_cafe_ren.py
utils_ren.py`,
            outType: "success",
          },
          {
            comment: "Pyright pega erros de tipo ANTES de rodar o jogo",
            cmd: "pyright inventario_ren.py",
            out: `inventario_ren.py:24:24 - error: Argument of type "int" cannot
  be assigned to parameter "qtd" of type "str"
1 error, 0 warnings`,
            outType: "error",
          },
        ]}
      />

      <h2>9. Limitações conhecidas</h2>

      <AlertBox type="warning" title="Cuidado nestes pontos">
        <p>
          1. <strong>Não pode usar sintaxe DSL Ren'Py</strong>: nada de
          <code>label</code>, <code>scene</code>, <code>show</code>,
          <code>menu</code> dentro de _ren.py. Apenas Python.
        </p>
        <p>
          2. <strong>Hot-reload pode falhar</strong>: alterar uma classe e
          dar Shift+R não recarrega instâncias antigas em saves. Reinicie o
          jogo para mudanças estruturais grandes.
        </p>
        <p>
          3. <strong>Imports de bibliotecas terceiras</strong> precisam estar
          em <code>game/python-packages/</code> ou serem instaladas no Python
          do Ren'Py — pip install não basta.
        </p>
        <p>
          4. <strong>Builds Web (RAPT/web)</strong> têm restrições do
          Pygame_SDL2 portado para JS — algumas libs C-extension não
          funcionam.
        </p>
      </AlertBox>

      <PracticeBox
        title="Migrar 'init python:' do .rpy para _ren.py"
        goal="Pegar um init python existente no script.rpy e mover para arquivo separado, ganhando autocomplete no editor."
        steps={[
          "Abra game/script.rpy e localize um bloco init python: com 20+ linhas (classe ou função grande).",
          "Crie game/<nome>_ren.py com a docstring \"\"\"renpy\\ninit python:\\n\"\"\".",
          "Cole o conteúdo do init python: lá (sem o init python: header).",
          "Apague esse bloco do script.rpy.",
          "Rode o jogo: deve funcionar idêntico. Confirme no VSCode que agora há syntax highlighting Python puro.",
        ]}
        verify="O jogo roda idêntico, mas no editor as classes/funções aparecem com cores Python e ir-pra-definição (F12) funciona."
      >
        <CodeBlock
          language="python"
          title="ANTES — game/script.rpy (recortar este bloco)"
          code={`init python:
    class Cliente:
        def __init__(self, nome, gosto):
            self.nome = nome
            self.gosto = gosto

    CLIENTES_HABITUAIS = [
        Cliente("Sr. Tanaka", "espresso curto"),
        Cliente("Mei",        "matcha gelado"),
    ]`}
        />
        <CodeBlock
          language="python"
          title="DEPOIS — game/clientes_ren.py"
          code={`"""renpy
init python:
"""

class Cliente:
    def __init__(self, nome, gosto):
        self.nome = nome
        self.gosto = gosto

CLIENTES_HABITUAIS = [
    Cliente("Sr. Tanaka", "espresso curto"),
    Cliente("Mei",        "matcha gelado"),
]`}
        />
      </PracticeBox>

      <OutputBlock label="cheat sheet — _ren.py em 6 linhas" type="info">
{`NOMEAR    qualquer game/<x>_ren.py
DOCSTRING """renpy\\ninit python:\\n"""    (1ª linha de código)
PRIORIDADE  init -100  /  init python early  /  init 999  na docstring
IMPORTAR  from utils import x   (sem o sufixo _ren)
STORE      from renpy import store; store.afeto_sakura = 5
LIMITES   só Python; nada de label/scene/show/menu`}
      </OutputBlock>

      <AlertBox type="success" title="Você terminou T008!">
        Cobrimos Color, Matrix, Model-rendering, Outras Funções e _ren.py.
        Próximo bloco: <strong>Network, Screenshots e Updates</strong> —
        como o Sakura Café busca leaderboard online e se atualiza sozinho.
      </AlertBox>
    </PageContainer>
  );
}
