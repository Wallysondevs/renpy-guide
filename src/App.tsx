import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

// Comece aqui
import Home from "@/pages/Home";
import AvisoLegal from "@/pages/AvisoLegal";
import ComeceAqui from "@/pages/ComeceAqui";
import Historia from "@/pages/Historia";

// Instalação & Setup
import Instalacao from "@/pages/Instalacao";
import Launcher from "@/pages/Launcher";
import PrimeiroProjeto from "@/pages/PrimeiroProjeto";
import EstruturaPastas from "@/pages/EstruturaPastas";

// Linguagem
import SintaxeBasica from "@/pages/SintaxeBasica";
import Labels from "@/pages/Labels";
import Personagens from "@/pages/Personagens";
import Dialogos from "@/pages/Dialogos";

// Visual & Cenas
import Imagens from "@/pages/Imagens";
import Cenas from "@/pages/Cenas";
import Transicoes from "@/pages/Transicoes";
import ATL from "@/pages/ATL";
import LayeredImages from "@/pages/LayeredImages";

// Áudio
import Audio from "@/pages/Audio";
import Voice from "@/pages/Voice";

// Lógica & Python
import Variaveis from "@/pages/Variaveis";
import Condicionais from "@/pages/Condicionais";
import Menus from "@/pages/Menus";
import Saves from "@/pages/Saves";

// GUI
import GUI from "@/pages/GUI";
import Screens from "@/pages/Screens";
import NVL from "@/pages/NVL";
import SideImages from "@/pages/SideImages";

// Avançado
import Inventario from "@/pages/Inventario";
import Afeicao from "@/pages/Afeicao";
import Minigames from "@/pages/Minigames";
import I18n from "@/pages/I18n";

// Build
import Build from "@/pages/Build";
import WebAndroid from "@/pages/WebAndroid";
import Otimizacao from "@/pages/Otimizacao";
import DebugLint from "@/pages/DebugLint";

// Final
import ProjetoFinal from "@/pages/ProjetoFinal";

// Referências
import Comunidade from "@/pages/Comunidade";
import Referencias from "@/pages/Referencias";

import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location] = useHashLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 transition-all duration-300">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/aviso-legal" component={AvisoLegal} />
        <Route path="/comece-aqui" component={ComeceAqui} />
        <Route path="/historia" component={Historia} />

        <Route path="/instalacao" component={Instalacao} />
        <Route path="/launcher" component={Launcher} />
        <Route path="/primeiro-projeto" component={PrimeiroProjeto} />
        <Route path="/estrutura-pastas" component={EstruturaPastas} />

        <Route path="/sintaxe-basica" component={SintaxeBasica} />
        <Route path="/labels" component={Labels} />
        <Route path="/personagens" component={Personagens} />
        <Route path="/dialogos" component={Dialogos} />

        <Route path="/imagens" component={Imagens} />
        <Route path="/cenas" component={Cenas} />
        <Route path="/transicoes" component={Transicoes} />
        <Route path="/atl" component={ATL} />
        <Route path="/layered-images" component={LayeredImages} />

        <Route path="/audio" component={Audio} />
        <Route path="/voice" component={Voice} />

        <Route path="/variaveis" component={Variaveis} />
        <Route path="/condicionais" component={Condicionais} />
        <Route path="/menus" component={Menus} />
        <Route path="/saves" component={Saves} />

        <Route path="/gui" component={GUI} />
        <Route path="/screens" component={Screens} />
        <Route path="/nvl" component={NVL} />
        <Route path="/side-images" component={SideImages} />

        <Route path="/inventario" component={Inventario} />
        <Route path="/afeicao" component={Afeicao} />
        <Route path="/minigames" component={Minigames} />
        <Route path="/i18n" component={I18n} />

        <Route path="/build" component={Build} />
        <Route path="/web-android" component={WebAndroid} />
        <Route path="/otimizacao" component={Otimizacao} />
        <Route path="/debug-lint" component={DebugLint} />

        <Route path="/projeto-final" component={ProjetoFinal} />

        <Route path="/comunidade" component={Comunidade} />
        <Route path="/referencias" component={Referencias} />

        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter hook={useHashLocation}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
