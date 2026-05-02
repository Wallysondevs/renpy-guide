import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Instalacao() {
  return (
    <PageContainer
      title="Instalação do Ren'Py 8.x"
      subtitle="Baixe o SDK oficial em renpy.org, descompacte, rode o launcher. Sem dependências, sem instalador, sem dor de cabeça — em Windows, macOS e Linux."
      difficulty="iniciante"
      timeToRead="10 min"
      prompt="setup/instalacao"
    >
      <AlertBox type="info" title="Ren'Py é PORTÁTIL — não precisa instalar nada no sistema">
        Diferente de Unity ou Godot, o Ren'Py não usa instalador MSI/DMG e não
        mexe no registro. Você baixa um <code>.zip</code>, descompacta em
        qualquer pasta (até num pendrive!) e dá duplo clique no executável do
        launcher. Python e SDL já vêm embutidos. Pode apagar a pasta inteira
        para "desinstalar".
      </AlertBox>

      <h2>1. Pré-requisitos (quase nada)</h2>
      <p>
        Para rodar o Ren'Py 8.x você só precisa de uma máquina com pelo menos
        4 GB de RAM, 1 GB de espaço livre e uma GPU com OpenGL 2.0 (qualquer
        coisa de 2010 pra cá). Não precisa instalar Python — o SDK já vem com
        o seu próprio interpretador <strong>Python 3.9 embutido</strong>. Não
        precisa de Visual Studio, não precisa de make.
      </p>

      <CommandTable
        title="Requisitos mínimos vs recomendados para criar VNs"
        variations={[
          { cmd: "RAM mínima", desc: "Para abrir o launcher e o tutorial.", output: "2 GB livres" },
          { cmd: "RAM recomendada", desc: "Para editar imagens grandes em paralelo (Krita/Photoshop).", output: "8 GB ou mais" },
          { cmd: "Disco", desc: "SDK + um projeto pequeno com sprites.", output: "~600 MB para o SDK + arte do projeto" },
          { cmd: "GPU", desc: "Renderização das cenas e ATL.", output: "OpenGL 2.0 / qualquer GPU integrada moderna" },
          { cmd: "Python", desc: "Já vem embutido na pasta lib/.", output: "Não precisa instalar nada — não conflita com o Python do sistema." },
          { cmd: "SO", desc: "Funciona em qualquer um dos três.", output: "Windows 7+, macOS 10.13+, Linux x86_64 (glibc 2.17+)" },
        ]}
      />

      <h2>2. Baixando o SDK do site oficial</h2>
      <p>
        Acesse <code>https://www.renpy.org/latest.html</code> e baixe o SDK
        completo (não a "Web Build" sozinha, não os "RAPT/RAPT-source" — esses
        são complementos). O arquivo principal tem ~140 MB e o nome é mais ou
        menos <code>renpy-8.3.7-sdk.zip</code> (Windows) ou{" "}
        <code>renpy-8.3.7-sdk.tar.bz2</code> (Linux/Mac).
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/Downloads"
        lines={[
          {
            comment: "Linux/Mac — baixar pelo terminal (versão atual em abril/2026)",
            cmd: "wget https://www.renpy.org/dl/8.3.7/renpy-8.3.7-sdk.tar.bz2",
            out: `--2026-04-04 10:12:22--  https://www.renpy.org/dl/8.3.7/renpy-8.3.7-sdk.tar.bz2
Resolving www.renpy.org... 198.199.121.211
HTTP request sent, awaiting response... 200 OK
Length: 142318204 (136M) [application/x-bzip2]
Saving to: 'renpy-8.3.7-sdk.tar.bz2'

renpy-8.3.7-sdk.tar.bz2  100%[===============>] 135.73M  18.4MB/s    in 7.2s

2026-04-04 10:12:30 (18.8 MB/s) - 'renpy-8.3.7-sdk.tar.bz2' saved [142318204/142318204]`,
            outType: "success",
          },
          {
            comment: "verificar que o arquivo é válido (assinatura GPG opcional)",
            cmd: "ls -lh renpy-8.3.7-sdk.tar.bz2",
            out: "-rw-r--r-- 1 dev dev 136M Apr  4 10:12 renpy-8.3.7-sdk.tar.bz2",
            outType: "info",
          },
        ]}
      />

      <h2>3. Instalando no Linux</h2>
      <p>
        Descompacte em qualquer pasta — eu costumo deixar em{" "}
        <code>~/renpy-sdk/</code>. Depois é só dar permissão de execução nos
        scripts <code>.sh</code> e rodar.
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/Downloads"
        lines={[
          {
            cmd: "tar -xjf renpy-8.3.7-sdk.tar.bz2 -C ~/",
            outType: "muted",
          },
          {
            cmd: "mv ~/renpy-8.3.7-sdk ~/renpy-sdk && cd ~/renpy-sdk",
            outType: "muted",
          },
          {
            cmd: "ls",
            out: `doc/   launcher/   lib/   renpy/   renpy.py   renpy.sh   the_question/   tutorial/`,
            outType: "info",
          },
          {
            comment: "garantir bit de execução (alguns gerenciadores de download removem)",
            cmd: "chmod +x renpy.sh",
            outType: "muted",
          },
          {
            comment: "checar a versão (sem abrir o launcher gráfico)",
            cmd: "./renpy.sh --version",
            out: "Ren'Py 8.3.7.24061608",
            outType: "success",
          },
          {
            comment: "abrir o Launcher de verdade",
            cmd: "./renpy.sh",
            out: `[INFO] Ren'Py 8.3.7.24061608 starting up.
[INFO] Loading launcher project from /home/dev/renpy-sdk/launcher
[INFO] Window created (1280x720, OpenGL 4.6).`,
            outType: "info",
          },
        ]}
      />

      <AlertBox type="warning" title="Distribuições Linux: dependências de áudio">
        Em distros minimalistas (Arch, Alpine) pode faltar{" "}
        <code>libpulse</code>, <code>libasound2</code> ou{" "}
        <code>libgl1-mesa-glx</code>. Se o launcher abrir mudo ou cair com
        erro de OpenGL, instale: <code>sudo apt install libpulse0 libasound2 libgl1</code>{" "}
        (Debian/Ubuntu) ou <code>sudo pacman -S pulseaudio alsa-lib mesa</code>{" "}
        (Arch).
      </AlertBox>

      <h2>4. Instalando no Windows</h2>
      <p>
        Baixe <code>renpy-8.3.7-sdk.zip</code>, clique com o botão direito →{" "}
        <em>Extrair tudo</em>, e mande para uma pasta SEM espaços e SEM
        acentos no caminho. Recomendado: <code>C:\renpy-sdk\</code>. Depois é
        só executar <code>renpy.exe</code>.
      </p>

      <CodeBlock
        language="powershell"
        title="PowerShell — descompactar e rodar no Windows"
        code={`# Baixar via PowerShell (alternativa ao navegador)
Invoke-WebRequest -Uri "https://www.renpy.org/dl/8.3.7/renpy-8.3.7-sdk.zip" \`
                  -OutFile "$env:USERPROFILE\\Downloads\\renpy-sdk.zip"

# Extrair para C:\\renpy-sdk
Expand-Archive -Path "$env:USERPROFILE\\Downloads\\renpy-sdk.zip" \`
               -DestinationPath "C:\\renpy-sdk"

# Conferir versão
& "C:\\renpy-sdk\\renpy-8.3.7-sdk\\renpy.exe" --version

# Abrir o launcher
& "C:\\renpy-sdk\\renpy-8.3.7-sdk\\renpy.exe"`}
      />

      <AlertBox type="danger" title="Antivírus brasileiro pode brigar com renpy.exe">
        Avast, Kaspersky e o McAfee de fábrica às vezes acusam{" "}
        <code>renpy.exe</code> ou <code>python.exe</code> embutido como falso
        positivo (porque ele compila <code>.rpy → .rpyc</code> em runtime, o
        que parece "código se modificando"). Adicione a pasta{" "}
        <code>C:\renpy-sdk\</code> à lista de exceções antes de continuar.
      </AlertBox>

      <h2>5. Instalando no macOS</h2>
      <p>
        Baixe <code>renpy-8.3.7-sdk.dmg.zip</code>, abra o DMG e arraste o
        ícone "Ren'Py" para a pasta <strong>Aplicativos</strong>. No primeiro
        clique, o Gatekeeper vai reclamar que o desenvolvedor não é
        identificado — clique com o botão direito → <em>Abrir</em> e confirme.
      </p>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/Downloads"
        lines={[
          {
            comment: "ou pela linha de comando",
            cmd: "tar -xjf renpy-8.3.7-sdk.tar.bz2 -C ~/Applications/",
            outType: "muted",
          },
          {
            cmd: "cd ~/Applications/renpy-8.3.7-sdk && chmod +x renpy.sh",
            outType: "muted",
          },
          {
            comment: "remover quarentena do Gatekeeper (senão dá 'app danificado')",
            cmd: "xattr -dr com.apple.quarantine ~/Applications/renpy-8.3.7-sdk",
            outType: "muted",
          },
          {
            cmd: "./renpy.sh --version",
            out: "Ren'Py 8.3.7.24061608",
            outType: "success",
          },
        ]}
      />

      <h2>6. Anatomia da pasta do SDK</h2>
      <p>
        Antes de criar o primeiro projeto, vale entender o que tem dentro do
        SDK que você acabou de descompactar. São essas pastas:
      </p>

      <OutputBlock label="árvore do SDK ~/renpy-sdk" type="info">
{`renpy-sdk/
├── doc/              → documentação HTML offline (abra index.html)
├── launcher/         → o próprio Launcher é uma VN escrita em Ren'Py!
├── lib/              → Python 3.9 embutido + SDL2 + libs nativas
│   ├── py3-linux-x86_64/
│   ├── py3-windows-x86_64/
│   └── py3-mac-x86_64/
├── renpy/            → código-fonte da engine (Python)
├── the_question/     → projeto-exemplo curtinho
├── tutorial/         → tutorial interativo (jogue antes de criar nada!)
├── renpy.py          → entrypoint Python
├── renpy.sh          → wrapper shell (Linux/Mac)
└── renpy.exe         → wrapper Windows`}
      </OutputBlock>

      <h2>7. Verificando que tudo funciona</h2>

      <Terminal
        user="dev"
        host="vn-studio"
        path="~/renpy-sdk"
        lines={[
          {
            comment: "rodar o tutorial direto pela CLI (sem passar pelo launcher)",
            cmd: "./renpy.sh tutorial",
            out: `[INFO] Ren'Py 8.3.7.24061608 starting up.
[INFO] Loading project from /home/dev/renpy-sdk/tutorial
[INFO] Tutorial: 'Welcome to Ren'Py!'
[INFO] Audio: pulseaudio backend OK.
[INFO] Window created at 1280x720.`,
            outType: "success",
          },
          {
            comment: "se aparecer erro de OpenGL, force renderer software",
            cmd: "./renpy.sh tutorial --renderer=sw",
            outType: "muted",
          },
          {
            comment: "validar a engine roda lint sem erro no projeto-exemplo",
            cmd: "./renpy.sh the_question lint",
            out: `Lint is mostly used to check Ren'Py scripts...
the_question/game/script.rpy: All okay.
Statistics: 2 dialogue blocks, 14 say statements, 0 menus.`,
            outType: "success",
          },
        ]}
      />

      <PracticeBox
        title="Validar instalação rodando o tutorial oficial"
        goal="Confirmar que o SDK está 100% funcional abrindo o tutorial interativo embutido."
        steps={[
          "Abra um terminal na pasta onde você descompactou o SDK.",
          "Rode ./renpy.sh --version (Linux/Mac) ou renpy.exe --version (Windows). Deve aparecer 'Ren'Py 8.x.x.xxxxxxxx'.",
          "Rode ./renpy.sh sem argumentos para abrir o Launcher gráfico.",
          "No Launcher, selecione o projeto 'tutorial' na lista da esquerda.",
          "Clique em Launch Project (canto inferior direito) e jogue até a tela de menus.",
          "Feche e tente também rodar o projeto 'the_question' — uma mini-VN de 5 minutos.",
        ]}
        verify="Se o tutorial abriu, mostrou texto, tocou som e respondeu ao seu clique, sua instalação está perfeita."
      />

      <h2>8. Atualizando para uma versão nova</h2>
      <p>
        Não existe "auto-update". Você baixa o ZIP novo, descompacta em outra
        pasta e move seus projetos da pasta antiga para o diretório de
        projetos da nova. Isso é proposital — assim você nunca quebra um
        projeto antigo de cliente porque a engine atualizou. Pode ter 8.2 e
        8.3 lado a lado.
      </p>

      <AlertBox type="success" title="Boa prática: uma pasta por versão da engine">
        Mantenha <code>~/renpy-8.2/</code>, <code>~/renpy-8.3/</code>,{" "}
        <code>~/renpy-7.x/</code> e abra cada projeto com a versão em que ele
        nasceu. Atualize só quando tiver tempo de testar. Você não quer
        descobrir um <em>breaking change</em> em ATL na semana do release.
      </AlertBox>
    </PageContainer>
  );
}
