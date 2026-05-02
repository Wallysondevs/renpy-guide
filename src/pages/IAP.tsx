import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandTable } from "@/components/ui/CommandTable";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";
import { Terminal } from "@/components/ui/Terminal";

export default function IAP() {
  return (
    <PageContainer
      title="In-App Purchasing — DLC e cosméticos no Sakura Café"
      subtitle="Como integrar compras dentro do app via iap.register / iap.purchase, lidar com restore, configurar produtos no Google Play e App Store, e implementar uma skin de Natal cosmética para o café."
      difficulty="avancado"
      timeToRead="20 min"
      prompt="plataformas/iap"
    >
      <AlertBox type="info" title="O módulo iap.rpy esconde toda a complexidade">
        O Ren'Py traz um módulo nativo <code>iap</code> que abstrai o
        Google Play Billing (Android) e o StoreKit (iOS) em uma API única.
        Você registra produtos com <code>iap.register()</code> e dispara
        compras com <code>iap.purchase()</code>. A engine resolve o
        protocolo de cada loja por baixo dos panos.
      </AlertBox>

      <h2>1. Tipos de produtos — entenda antes de codar</h2>

      <CommandTable
        title="Categorias suportadas"
        variations={[
          { cmd: "consumable", desc: "Pode ser comprado várias vezes (moedas, energia).", output: 'Ex: "10 pratos a mais hoje"' },
          { cmd: "non-consumable", desc: "Comprado UMA vez (DLC, cosmético).", output: 'Ex: "Skin de Natal do Sakura Café"' },
          { cmd: "subscription", desc: "Recorrente mensal/anual (Ren'Py 8.x parcial).", output: "Pouco usado em VN — evite." },
          { cmd: "unlock", desc: "Atalho para non-consumable que destrava conteúdo.", output: 'Ex: "Rota da Akira (premium)"' },
        ]}
      />

      <AlertBox type="warning" title="Decida: free-to-play OU pay-once. Não misture mal.">
        VNs históricamente são "pay-once": você compra o jogo na loja e tem
        tudo. IAP funciona melhor para <strong>cosméticos opcionais</strong>{" "}
        (skins, BGMs alternativos) ou <strong>DLC narrativo</strong>{" "}
        (rota nova). Sakura Café com energia/timer estilo gacha geralmente
        afasta o público de VN.
      </AlertBox>

      <h2>2. Registrando produtos no Google Play Console</h2>
      <p>
        Antes de qualquer código, configure os produtos nas duas lojas. No
        Play Console: <strong>Monetize → Products → In-app products</strong>.
        Crie cada SKU com <code>Product ID</code> ÚNICO (vai ser usado no
        Ren'Py).
      </p>

      <OutputBlock label="produtos do Sakura Café no Google Play" type="info">
{`Product ID: skin_natal_2026
  Name: Skin de Natal — Sakura Café 2026
  Description: Decoração natalina permanente do café, traje vermelho da Sakura.
  Type: Managed Product (non-consumable)
  Price: R$ 9,90

Product ID: route_akira
  Name: Rota da Akira — Capítulo Premium
  Description: 5 horas de conteúdo extra com 3 finais novos.
  Type: Managed Product (non-consumable)
  Price: R$ 24,90

Product ID: pack_cafe_10
  Name: Pack 10 Cafés Especiais
  Description: 10 pedidos premium para servir aos clientes.
  Type: Consumable
  Price: R$ 4,90`}
      </OutputBlock>

      <h2>3. Bibliotecas e permissões no manifest</h2>

      <CodeBlock
        title="game/options.rpy — adicionar permissão BILLING"
        language="python"
        code={`init python:
    # O rapt já adiciona automaticamente quando detecta uso de iap.register
    # Mas você pode forçar com:
    build.android_permissions = ["com.android.vending.BILLING"]

    # Importante: assina o APK com a MESMA chave registrada no Play Console
    # senão o billing falha silenciosamente em produção.`}
      />

      <h2>4. Registrando os produtos no script</h2>

      <CodeBlock
        title="game/iap.rpy"
        language="python"
        code={`init -10 python:
    # Registra TODOS os produtos no início — antes do menu principal.
    # Sem registrar, iap.purchase() retorna False imediatamente.

    iap.register(
        product = "skin_natal_2026",
        identifier_ios = "br.com.wallyson.sakuracafe.skin_natal_2026",
        google_play_id = "skin_natal_2026",
        amazon_id = "skin_natal_2026",
        consumable = False,
    )

    iap.register(
        product = "route_akira",
        identifier_ios = "br.com.wallyson.sakuracafe.route_akira",
        google_play_id = "route_akira",
        consumable = False,
    )

    iap.register(
        product = "pack_cafe_10",
        identifier_ios = "br.com.wallyson.sakuracafe.pack_cafe_10",
        google_play_id = "pack_cafe_10",
        consumable = True,   # ← pode comprar várias vezes
    )

default persistent.skin_natal_unlocked = False
default persistent.route_akira_unlocked = False
default persistent.cafes_premium = 0`}
      />

      <h2>5. Botão de compra — UI Sakura Café</h2>

      <CodeBlock
        title="game/screens.rpy — tela de loja"
        language="python"
        code={`screen loja_sakura():
    tag menu
    use game_menu(_("Loja"), scroll="viewport"):
        vbox spacing 20:

            # SKIN NATAL — non-consumable
            frame:
                background "#fff0f0"
                padding (16, 16)
                vbox spacing 8:
                    text "Skin de Natal 2026" size 28 color "#cc0033"
                    text "Decoração natalina permanente do café." size 18
                    if persistent.skin_natal_unlocked:
                        text "✓ JÁ DESBLOQUEADO" color "#00aa44" bold True
                    else:
                        textbutton _("Comprar — R$ 9,90"):
                            action Function(comprar_skin_natal)
                            xminimum 280

            # ROTA AKIRA — non-consumable narrativo
            frame:
                background "#fff5e6"
                padding (16, 16)
                vbox spacing 8:
                    text "Rota da Akira (Premium)" size 28 color "#cc6600"
                    text "5h de conteúdo + 3 finais novos." size 18
                    if persistent.route_akira_unlocked:
                        text "✓ JÁ DESBLOQUEADA" color "#00aa44" bold True
                        textbutton _("Jogar agora") action Jump("rota_akira_inicio")
                    else:
                        textbutton _("Comprar — R$ 24,90"):
                            action Function(comprar_rota_akira)

            # CAFÉS — consumable
            frame:
                background "#fffaf0"
                padding (16, 16)
                vbox spacing 8:
                    text "Pack 10 Cafés Especiais" size 28 color "#aa6600"
                    text "Você tem [persistent.cafes_premium] no estoque." size 18
                    textbutton _("Comprar — R$ 4,90"):
                        action Function(comprar_pack_cafe)

            # RESTORE — exigido pela Apple
            textbutton _("Restaurar compras (já paguei!)"):
                action Function(restaurar_compras)
                xalign 0.5`}
      />

      <h2>6. Funções de compra com tratamento de erro</h2>

      <CodeBlock
        title="game/iap.rpy — handlers"
        language="python"
        code={`init python:
    def comprar_skin_natal():
        # Tenta a compra. Bloqueia até a loja responder.
        if iap.purchase("skin_natal_2026"):
            persistent.skin_natal_unlocked = True
            renpy.notify("Skin de Natal desbloqueada! ❄")
            renpy.restart_interaction()
        else:
            renpy.notify("Compra cancelada ou falhou.")

    def comprar_rota_akira():
        if iap.purchase("route_akira"):
            persistent.route_akira_unlocked = True
            renpy.notify("Rota da Akira desbloqueada!")
            renpy.restart_interaction()
        else:
            renpy.notify("Não foi possível concluir a compra.")

    def comprar_pack_cafe():
        if iap.purchase("pack_cafe_10"):
            persistent.cafes_premium += 10
            renpy.notify("+10 cafés adicionados ao estoque!")
            renpy.restart_interaction()
        else:
            renpy.notify("Compra não concluída.")

    def restaurar_compras():
        # Importante: chama a loja e reaplica TODOS os non-consumables
        iap.restore()
        # Após restore, iap.has_purchased() reflete o que o usuário tem
        if iap.has_purchased("skin_natal_2026"):
            persistent.skin_natal_unlocked = True
        if iap.has_purchased("route_akira"):
            persistent.route_akira_unlocked = True
        renpy.notify("Compras restauradas.")
        renpy.restart_interaction()`}
      />

      <h2>7. Aplicando a skin no jogo</h2>

      <CodeBlock
        title="game/script.rpy — usando o cosmético"
        language="python"
        code={`# Definição condicional do background
init python:
    def bg_cafe_atual():
        if persistent.skin_natal_unlocked:
            return "images/bg_cafe_natal.png"
        return "images/bg_cafe.png"

image bg cafe = DynamicDisplayable(lambda st, at: (renpy.displayable(bg_cafe_atual()), None))

# Sakura usa traje natalino se a skin estiver ativa
image sakura happy:
    if persistent.skin_natal_unlocked:
        "images/sakura_happy_natal.png"
    else:
        "images/sakura_happy.png"

label start:
    scene bg cafe with fade
    show sakura happy at center with dissolve
    if persistent.skin_natal_unlocked:
        s "Feliz Natal! Quer um chocolate quente especial?"
    else:
        s "Bem-vindo ao Sakura Café!"
    return`}
      />

      <h2>8. Testando — sandbox do Google Play</h2>

      <Terminal
        path="~/projetos/sakura-cafe"
        lines={[
          {
            comment: "Build APK assinado com chave de release",
            cmd: "renpy.sh launcher android_build sakura-cafe release",
            out: `Building Android APK...
Signing with keystore: sakura-cafe.keystore
APK output: bin/sakuracafe-release.apk
APK size: 312MB`,
            outType: "success",
          },
          {
            comment: "Sobe APK para track Internal Testing no Play Console",
            cmd: 'fastlane supply --apk bin/sakuracafe-release.apk --track internal',
            out: `Successfully uploaded APK to Internal Testing track.
Version code: 12 (1.0.2)
Available to testers in ~5 minutes.`,
            outType: "info",
          },
          {
            comment: "Adicione testers no Play Console > Internal testing > Email list",
            cmd: 'echo "wallyson@dev.com" >> testers.txt',
            out: "(adicione no Play Console; eles receberão link de opt-in)",
            outType: "muted",
          },
        ]}
      />

      <AlertBox type="warning" title="Não dá pra testar IAP no APK não-publicado">
        O Google Play Billing SÓ funciona se o APK estiver assinado com a
        chave de release E publicado em pelo menos uma track (Internal
        Testing serve). No APK debug local, <code>iap.purchase()</code>{" "}
        sempre retorna <code>False</code>. É a confusão #1 dos devs.
      </AlertBox>

      <h2>9. Validação server-side (anti-pirataria séria)</h2>
      <p>
        Por padrão, <code>iap.purchase()</code> confia no recibo local da
        loja — pirata pode falsificar com root. Para Sakura Café Premium,
        valide o recibo no seu servidor:
      </p>

      <CodeBlock
        title="game/iap.rpy — validação remota"
        language="python"
        code={`init python:
    import json

    def comprar_rota_akira_seguro():
        if not iap.purchase("route_akira"):
            renpy.notify("Compra cancelada.")
            return

        # Pega o recibo bruto da loja
        receipt = iap.get_receipt("route_akira")
        if receipt is None:
            renpy.notify("Recibo indisponível, tente restaurar mais tarde.")
            return

        # Manda pro nosso servidor validar
        try:
            resp = renpy.fetch(
                "https://api.sakuracafe.dev/iap/validate",
                method="POST",
                data=json.dumps({"product": "route_akira", "receipt": receipt}).encode(),
                headers={"Content-Type": "application/json"},
                timeout=10,
            )
            result = json.loads(resp.decode())
            if result.get("valid"):
                persistent.route_akira_unlocked = True
                renpy.notify("Rota da Akira liberada!")
            else:
                renpy.notify("Recibo inválido. Contate suporte.")
        except Exception as e:
            renpy.log(f"IAP validation failed: {e}")
            renpy.notify("Sem internet — tente restaurar depois.")`}
      />

      <h2>10. API completa do módulo iap</h2>

      <CommandTable
        title="Funções e flags relevantes"
        variations={[
          { cmd: "iap.register(...)", desc: "Cadastra produto no init.", output: "Obrigatório antes de purchase." },
          { cmd: "iap.purchase(product)", desc: "Inicia compra. Retorna True se sucesso.", output: "Bloqueia até a loja responder." },
          { cmd: "iap.has_purchased(product)", desc: "True se non-consumable já foi comprado.", output: "Persistente entre sessões." },
          { cmd: "iap.restore()", desc: "Reaplica todas as compras (Apple exige).", output: "Sempre tenha botão Restore." },
          { cmd: "iap.get_price(product)", desc: "String localizada (ex: 'R$ 9,90').", output: "Use no botão em vez de hardcode." },
          { cmd: "iap.get_receipt(product)", desc: "Recibo bruto para validação server-side.", output: "Base64 do receipt." },
          { cmd: "iap.is_deferred(product)", desc: "Compra pendente (autorização parental).", output: "Mostre 'Aguardando aprovação'." },
          { cmd: "iap.get_store_name()", desc: "'play_store', 'app_store', 'amazon', 'none'.", output: "None em build desktop." },
        ]}
      />

      <h2>11. Preço dinâmico e moeda local</h2>

      <CodeBlock
        title="game/screens.rpy — preço da loja, não hardcode"
        language="python"
        code={`screen loja_sakura():
    vbox:
        $ preco_skin = iap.get_price("skin_natal_2026") or "R$ 9,90"
        textbutton _("Skin de Natal — [preco_skin]"):
            action Function(comprar_skin_natal)
        # iap.get_price retorna a string formatada na moeda local:
        # BR: "R$ 9,90"  US: "$1.99"  JP: "¥250"  EU: "€1.99"`}
      />

      <PracticeBox
        title="Implemente a Skin de Natal end-to-end"
        goal="Cadastrar produto no Play Console, registrar no jogo, mostrar botão na loja, processar compra e aplicar visual."
        steps={[
          "No Play Console crie produto 'skin_natal_2026' (Managed, R$ 9,90).",
          "Em iap.rpy chame iap.register para esse product ID.",
          "Crie persistent.skin_natal_unlocked = False.",
          "Adicione tela 'loja_sakura' com botão 'Comprar' que chama comprar_skin_natal().",
          "Função comprar_skin_natal seta persistent e notifica.",
          "Crie images/bg_cafe_natal.png e images/sakura_happy_natal.png.",
          "Use DynamicDisplayable para trocar BG conforme persistent.",
          "Adicione botão 'Restaurar compras' chamando iap.restore().",
          "Build release APK, upload Internal Testing, teste comprando com conta de teste.",
        ]}
        verify="Após pagar (cartão de teste do Play Console), o BG do café fica natalino e a Sakura aparece com traje vermelho. Reinstalar o app + Restore traz a skin de volta."
      />

      <AlertBox type="danger" title="Apple e Google — políticas que matam jogos">
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>NUNCA mencione preço fora do botão de compra (Apple rejeita por
          "external commerce link").</li>
          <li>NÃO use webview com link pra Stripe — bypass de billing é ban.</li>
          <li>Tem que oferecer Restore visível em pelo menos UMA tela
          (Apple Guideline 3.1.1).</li>
          <li>Conteúdo loot-box / random precisa exibir probabilidades
          (Google Play Policy 2024+).</li>
        </ul>
      </AlertBox>

      <AlertBox type="success" title="Modelo recomendado para VN indie">
        Para Sakura Café: jogo principal pago (R$ 19,90), 1 DLC narrativo
        (R$ 24,90), 2-3 skins cosméticas (R$ 4,90-9,90 cada). Sem
        consumíveis, sem timer, sem gacha. Mantém público de VN feliz e
        ainda gera receita recorrente nas lojas mobile.
      </AlertBox>
    </PageContainer>
  );
}
