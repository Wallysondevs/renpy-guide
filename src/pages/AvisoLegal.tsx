import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function AvisoLegal() {
  return (
    <PageContainer
      title="Aviso Legal — Licenças, Direitos Autorais e Monetização"
      subtitle="Antes de publicar a sua VN no Steam, itch.io ou Play Store, entenda o que a licença MIT do Ren'Py te permite, o que NÃO te permite, e como respeitar os direitos autorais de arte, trilha e personagens."
      difficulty="iniciante"
      timeToRead="12 min"
      prompt="comece-aqui/aviso-legal"
    >
      <AlertBox type="info" title="Resumo em uma frase">
        O <strong>motor</strong> Ren'Py é totalmente livre (MIT) — você pode
        vender o jogo final, manter o código fechado e ainda assim não deve
        royalties a ninguém. Mas <strong>arte, música e personagens</strong>{" "}
        que você usa dentro do jogo seguem as licenças de quem os criou — e
        ali mora a maior parte das dores de cabeça jurídicas.
      </AlertBox>

      <h2>1. A licença do Ren'Py — MIT, simples assim</h2>
      <p>
        Ren'Py foi escrito por <strong>Tom "PyTom" Rothamel</strong>, lançado
        publicamente em 2003 e mantido até hoje sob a{" "}
        <strong>licença MIT</strong> — uma das licenças open-source mais
        permissivas que existem. Em prosa: você pode pegar o motor, modificá-lo,
        embarcá-lo no seu jogo, vender por R$ 50 na Steam, e tudo isso sem
        precisar liberar o seu script.rpy nem pagar centavo nenhum a Tom
        Rothamel ou à comunidade.
      </p>

      <p>
        A única obrigação prática é <strong>manter o aviso de copyright</strong>{" "}
        e a <strong>tela de splash do Ren'Py</strong> que aparece na inicialização
        do jogo. Essa tela vem habilitada por padrão e fica em{" "}
        <code>game/options.rpy</code> sob a variável <code>config.has_autosave</code>{" "}
        e companheiras — você pode estilizá-la, mas remover de vez é considerado
        falta de cortesia.
      </p>

      <CodeBlock
        language="markdown"
        title="LICENSE.txt (extraído do SDK do Ren'Py)"
        code={`Copyright 2004-2024 Tom Rothamel <pytom@bishoujo.us>

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge,
publish, distribute, sublicense, and/or sell copies of the Software,
and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND ...`}
      />

      <CommandTable
        title="O que a MIT te permite (e o que NÃO permite)"
        variations={[
          {
            cmd: "Vender o jogo",
            desc: "Pode cobrar quanto quiser em Steam, itch.io, Play Store, App Store — sem royalties.",
            output: "✅ Permitido. Tom Rothamel não recebe nada.",
          },
          {
            cmd: "Fechar o seu script.rpy",
            desc: "O motor é open-source, mas o seu jogo (script + assets) pode ser 100% comercial e fechado.",
            output: "✅ Permitido. Use renpy.exe . compile para gerar .rpyc e distribuir só os bytecode.",
          },
          {
            cmd: "Modificar o motor",
            desc: "Forkar, customizar shaders, mudar parser — tudo liberado.",
            output: "✅ Permitido — desde que mantenha o LICENSE.txt original junto.",
          },
          {
            cmd: "Remover o splash do Ren'Py",
            desc: "Tecnicamente possível. Tradicionalmente desencorajado pela comunidade.",
            output: "⚠️ Permitido legalmente, mas mal visto. Estilize em vez de remover.",
          },
          {
            cmd: "Dizer que VOCÊ escreveu o motor",
            desc: "Apresentar o Ren'Py como obra sua é violação direta da MIT.",
            output: "❌ Proibido. Sempre dê crédito a Tom Rothamel + comunidade.",
          },
          {
            cmd: "Processar o Tom se algo der errado",
            desc: "A cláusula 'AS IS' isenta o autor de qualquer dano, perda de dados, processo trabalhista, etc.",
            output: "❌ Sem chance — você usa por sua conta e risco.",
          },
        ]}
      />

      <h2>2. Direitos autorais sobre arte, sprites e cenários</h2>
      <p>
        Aqui o terreno fica espinhoso. O motor é livre, mas a Sakura sorrindo no
        café com aquele uniforme rosa <strong>não é</strong>. Toda imagem que
        você coloca em <code>game/images/</code> tem um dono — e esse dono não é
        a comunidade Ren'Py.
      </p>

      <CommandTable
        title="Origens comuns de assets em VN — e o que cada uma exige"
        variations={[
          {
            cmd: "Você desenhou",
            desc: "Sprites, BGs, GUI feitos por você ou contratados.",
            output: "Você é o titular. Pode vender. Guarde os PSDs como prova de autoria.",
          },
          {
            cmd: "Comissão paga (Patreon/Twitter/Discord)",
            desc: "Artista freelance fez sprites para o seu jogo.",
            output: "Sempre tenha contrato escrito definindo se a licença é exclusiva ou não-exclusiva, e se inclui uso comercial.",
          },
          {
            cmd: "Asset pack do itch.io",
            desc: "Packs como 'Sakura School Simulator BG Pack' são vendidos com licença pré-definida.",
            output: "Leia o LICENSE.txt — alguns são CC-BY, outros 'commercial OK', outros 'no resale'.",
          },
          {
            cmd: "OpenGameArt (CC-BY 3.0/4.0)",
            desc: "Maior banco gratuito de assets para jogos indie.",
            output: "Crédito obrigatório no jogo (geralmente em screen credits.rpy ou no manual).",
          },
          {
            cmd: "OGA-BY 3.0",
            desc: "Variante do CC-BY do OpenGameArt — mais permissiva para mods.",
            output: "Crédito obrigatório, comercial OK.",
          },
          {
            cmd: "CC0 / domínio público",
            desc: "Sem qualquer obrigação. Use à vontade.",
            output: "Mesmo assim, dê crédito por boa fé — a cena indie agradece.",
          },
          {
            cmd: "Ripado de outro jogo",
            desc: "Pegar sprite de Doki Doki Literature Club, Persona, Clannad, etc.",
            output: "❌ Pirataria. Take-down certo, conta itch.io banida e processo possível.",
          },
        ]}
      />

      <h3>2.1 Personagens — o caso especial</h3>
      <p>
        Se você criou a Sakura, a Yuki e a Akira do zero, elas são suas — e você
        pode até registrar uma marca. Mas se o seu protagonista se parece muito
        com a <em>Hatsune Miku</em>, com a <em>Asuna do Sword Art Online</em> ou
        com qualquer personagem registrado, você está usando uma propriedade
        intelectual de terceiros, e isso vale processo independente do jogo
        ser pago ou gratuito.
      </p>

      <AlertBox type="warning" title="Fan-games em zona cinzenta">
        Existe uma tradição enorme de VNs fan-made (Touhou, Vocaloid, Undertale).
        Algumas IPs toleram, outras não. <strong>Touhou</strong> e{" "}
        <strong>Vocaloid</strong> têm guidelines oficiais. <strong>Disney</strong>,{" "}
        <strong>Nintendo</strong> e <strong>Square Enix</strong> não toleram —
        não importa se é gratuito. Cheque sempre antes de publicar.
      </AlertBox>

      <h2>3. Trilha sonora — o segundo grande tropeço</h2>
      <p>
        Música no Ren'Py é colocada em <code>game/audio/</code> e tocada com{" "}
        <code>play music "audio/theme.ogg"</code>. Igual à arte: cada faixa tem
        dono. Tirar uma faixa do Spotify e jogar dentro do jogo é violação
        clara — ninguém, nunca, em hipótese alguma. Mesmo se o jogo for grátis.
      </p>

      <CommandTable
        title="De onde tirar trilha LIVRE para a sua VN"
        variations={[
          {
            cmd: "FreeSound.org",
            desc: "Banco de SFX e ambiente — login grátis.",
            output: "Maioria CC-BY, alguns CC0. Crédito ao autor da faixa.",
          },
          {
            cmd: "OpenGameArt (Music)",
            desc: "Trilhas de loop (BGM) feitas por compositores indie.",
            output: "Filtre por 'CC0' se não quiser dar crédito; senão CC-BY.",
          },
          {
            cmd: "Incompetech (Kevin MacLeod)",
            desc: "Catálogo enorme de royalty-free, mas exige crédito.",
            output: "Texto exato: 'Music: Kevin MacLeod (incompetech.com) — Licensed under CC-BY 4.0'.",
          },
          {
            cmd: "Pixabay Music",
            desc: "Royalty-free, sem crédito obrigatório.",
            output: "Ótimo para protótipos e jogos pequenos.",
          },
          {
            cmd: "Compositor em comissão",
            desc: "Orçamento de R$ 200 a R$ 2.000 por faixa de 1-2 min de loop.",
            output: "Sempre contrato. Verifique se a licença permite trailers no YouTube.",
          },
          {
            cmd: "Música licenciada (Spotify, JASRAC, ECAD)",
            desc: "Pop japonês, K-pop, hits ocidentais.",
            output: "❌ Carísimo. Esqueça para indie. Use só por sub-licença formal.",
          },
        ]}
      />

      <h2>4. Imagens geradas por IA — uma área ainda cinzenta</h2>
      <p>
        Stable Diffusion, Midjourney, NovelAI e companhia revolucionaram a
        produção indie de VN, mas a base jurídica ainda está sendo decidida em
        tribunais (EUA, UE, Japão). Em 2024-2025 a tendência é:
      </p>
      <ul>
        <li>
          <strong>EUA:</strong> imagens 100% geradas por IA NÃO são protegidas
          por copyright (caso Thaler v. Perlmutter). Ou seja, qualquer um pode
          recolocar no jogo dele.
        </li>
        <li>
          <strong>Japão:</strong> permite uso comercial, mas vê com maus olhos
          modelos treinados em obras protegidas (NovelAI usou base Danbooru,
          que tem arte sem permissão).
        </li>
        <li>
          <strong>Steam:</strong> exige declaração na ficha do jogo se algum
          asset foi gerado por IA. Já banem jogos com IA "gerada a partir de
          obras protegidas".
        </li>
        <li>
          <strong>itch.io e Steam Direct:</strong> aceitam, mas comunidades
          (Reddit, ResetEra, Twitter) podem reagir mal.
        </li>
      </ul>

      <AlertBox type="danger" title="Itch.io anti-AI tag">
        Existe uma tag forte na comunidade VN/itch chamada{" "}
        <code>#no-ai-art</code>. Se você usa Stable Diffusion para sprites e
        finge que foi você que desenhou, vai receber drama público. Seja
        honesto: declare na descrição "Sprites gerados com Stable Diffusion +
        retoque manual" — a maturidade compensa.
      </AlertBox>

      <h2>5. Monetização — Steam, itch.io, Play Store</h2>
      <p>
        Você pode monetizar do jeito que quiser — só precisa entender o corte
        que cada loja tira:
      </p>

      <CommandTable
        title="Comissão das principais lojas em 2025"
        variations={[
          { cmd: "itch.io", desc: "Loja indie por excelência. Você define a taxa que itch.io fica.", output: "0% a 30% (você escolhe). Maioria deixa em 10%." },
          { cmd: "Steam", desc: "Maior vitrine para VN no PC. Pagamento de US$ 100 por jogo (Steam Direct fee).", output: "30% até US$ 10M, 25% até 50M, 20% acima." },
          { cmd: "Google Play Store", desc: "Para builds Android via RAPT.", output: "15% no primeiro US$ 1M/ano, 30% acima." },
          { cmd: "Apple App Store", desc: "Para builds iOS — exige Mac + Xcode. Burocrático.", output: "15% no Small Business Program, 30% padrão." },
          { cmd: "Patreon / Apoia.se", desc: "Modelo de assinatura para episódios mensais.", output: "5%-12% + taxa de processador (Stripe/Paypal)." },
          { cmd: "Kickstarter / Catarse", desc: "Crowdfunding antes do lançamento.", output: "5% Kickstarter + 3-5% gateway." },
        ]}
      />

      <h3>5.1 Como rodar o seu jogo finalizado</h3>
      <Terminal
        user="dev"
        host="vn-studio"
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "verificar tudo antes de buildar",
            cmd: "renpy.exe . lint",
            out: `Ren'Py 8.2.3 lint report, generated at: Sun Nov 10 14:22:18 2024
Statistics:
The game contains 412 dialogue blocks, containing 9,184 words and 51,221 characters.
Lint took 1.42 seconds.`,
            outType: "success",
          },
          {
            comment: "gerar a build oficial para distribuição",
            cmd: "renpy.exe launcher distribute sakura-cafe",
            out: `Building distributions for project: sakura-cafe
Building sakura-cafe-1.0-pc.zip
Building sakura-cafe-1.0-mac.zip
Building sakura-cafe-1.0-linux.tar.bz2
Done.`,
            outType: "info",
          },
        ]}
      />

      <OutputBlock label="dists/ — o que você sobe nas lojas" type="muted">
{`dists/
├── sakura-cafe-1.0-pc.zip       (Windows + Linux 64-bit)
├── sakura-cafe-1.0-mac.zip      (macOS)
├── sakura-cafe-1.0-linux.tar.bz2
└── sakura-cafe-1.0-web.zip      (HTML5 — só se buildou web)`}
      </OutputBlock>

      <h2>6. Ficha técnica obrigatória (créditos do jogo)</h2>
      <p>
        Toda VN profissional tem uma <strong>tela de créditos</strong> com
        nomes, licenças e links das obras de terceiros usadas. No Ren'Py você
        cria isso facilmente em <code>game/screens.rpy</code>:
      </p>

      <CodeBlock
        language="python"
        title="game/screens.rpy — exemplo de tela de créditos"
        code={`screen credits():

    tag menu

    use game_menu(_("Créditos"), scroll="viewport"):

        vbox:
            spacing 12

            text "Sakura Café — © 2025 Estúdio Indie LTDA" size 28

            text "Direção e Roteiro" bold size 22
            text "Maria Lima"

            text "Arte e Sprites" bold size 22
            text "Joana Ribeiro (comissão exclusiva)"

            text "Trilha Sonora" bold size 22
            text "Kevin MacLeod — 'Cherry Blossoms' (CC-BY 4.0)"
            text "incompetech.com"

            text "Engine" bold size 22
            text "Ren'Py 8.2.3 — © Tom Rothamel — Licença MIT"
            text "https://renpy.org"

            text "Assets adicionais" bold size 22
            text "OpenGameArt — pack 'School BG' por usuário kazerad (CC-BY 3.0)"
            text "FreeSound.org — SFX por usuário InspectorJ (CC-BY 4.0)"`}
      />

      <PracticeBox
        title="Auditar a sua VN em 5 minutos"
        goal="Garantir que você tem licença de tudo que está em game/images/ e game/audio/."
        steps={[
          "Liste todos os arquivos de imagem e áudio do seu projeto (use o terminal abaixo).",
          "Para cada arquivo, anote em uma planilha: 'Origem' (você, comissão, OGA, Pixabay, IA) e 'Licença' (CC0, CC-BY, MIT, exclusiva).",
          "Identifique qualquer arquivo SEM origem clara e remova ou substitua antes de publicar.",
          "Crie a tela de créditos seguindo o template acima.",
          "Rode renpy.exe . lint para validar que tudo está ligado corretamente.",
        ]}
        command="ls -la game/images/ game/audio/"
        expected={`game/images/:
bg_cafe.png
bg_escola.jpg
sakura_happy.png
sakura_sad.png
yuki_neutral.png

game/audio/:
theme_main.ogg
sfx_door.wav
voice_sakura_001.opus`}
        verify="A planilha deve ter uma linha para CADA arquivo, sem nenhum 'origem desconhecida'."
      />

      <AlertBox type="success" title="Regra de bolso final">
        Se você não tem comprovante (e-mail de comissão, link CC-BY, recibo de
        asset pack, screenshot do termo de uso) para um asset, ele não entra no
        jogo. Documentação salva carreira.
      </AlertBox>
    </PageContainer>
  );
}
