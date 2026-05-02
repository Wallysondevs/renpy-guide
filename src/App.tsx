import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

import Home from "@/pages/Home";
import AvisoLegal from "@/pages/AvisoLegal";
import ComeceAqui from "@/pages/ComeceAqui";
import Historia from "@/pages/Historia";

import Instalacao from "@/pages/Instalacao";
import Launcher from "@/pages/Launcher";
import PrimeiroProjeto from "@/pages/PrimeiroProjeto";
import EstruturaPastas from "@/pages/EstruturaPastas";

import SintaxeBasica from "@/pages/SintaxeBasica";
import Labels from "@/pages/Labels";
import Personagens from "@/pages/Personagens";
import Dialogos from "@/pages/Dialogos";
import MultipleDialogue from "@/pages/MultipleDialogue";
import Bubble from "@/pages/Bubble";
import TextInput from "@/pages/TextInput";

import Imagens from "@/pages/Imagens";
import Cenas from "@/pages/Cenas";
import Transicoes from "@/pages/Transicoes";
import ATL from "@/pages/ATL";
import LayeredImages from "@/pages/LayeredImages";
import Displayables from "@/pages/Displayables";
import TransformProperties from "@/pages/TransformProperties";
import Matrixcolor from "@/pages/Matrixcolor";
import Stage3D from "@/pages/Stage3D";
import Live2D from "@/pages/Live2D";
import Sprites from "@/pages/Sprites";
import MouseCustom from "@/pages/MouseCustom";

import Text from "@/pages/Text";
import TextShaders from "@/pages/TextShaders";
import CustomTextTags from "@/pages/CustomTextTags";
import CharacterCallbacks from "@/pages/CharacterCallbacks";

import Audio from "@/pages/Audio";
import Voice from "@/pages/Voice";
import AudioFilters from "@/pages/AudioFilters";
import Movie from "@/pages/Movie";
import Splashscreen from "@/pages/Splashscreen";

import Variaveis from "@/pages/Variaveis";
import Condicionais from "@/pages/Condicionais";
import Menus from "@/pages/Menus";
import Saves from "@/pages/Saves";
import StoreVariables from "@/pages/StoreVariables";
import Lifecycle from "@/pages/Lifecycle";

import GUI from "@/pages/GUI";
import Screens from "@/pages/Screens";
import NVL from "@/pages/NVL";
import SideImages from "@/pages/SideImages";
import Styles from "@/pages/Styles";
import StyleProperties from "@/pages/StyleProperties";
import AdvancedGUI from "@/pages/AdvancedGUI";
import Configuracao from "@/pages/Configuracao";
import Preferencias from "@/pages/Preferencias";
import ScreenActions from "@/pages/ScreenActions";
import ScreensEspeciais from "@/pages/ScreensEspeciais";
import ScreenOptimization from "@/pages/ScreenOptimization";
import ScreensPython from "@/pages/ScreensPython";
import Keymap from "@/pages/Keymap";
import DialogueHistory from "@/pages/DialogueHistory";
import Rooms from "@/pages/Rooms";
import DragDrop from "@/pages/DragDrop";

import Inventario from "@/pages/Inventario";
import Afeicao from "@/pages/Afeicao";
import Minigames from "@/pages/Minigames";
import I18n from "@/pages/I18n";
import Achievements from "@/pages/Achievements";

import StatementEquivalents from "@/pages/StatementEquivalents";
import CDD from "@/pages/CDD";
import CDS from "@/pages/CDS";
import FileAccess from "@/pages/FileAccess";
import ColorClass from "@/pages/ColorClass";
import MatrixClass from "@/pages/MatrixClass";
import ModelRendering from "@/pages/ModelRendering";
import OtherFunctions from "@/pages/OtherFunctions";
import RenPyFiles from "@/pages/RenPyFiles";

import Fetch from "@/pages/Fetch";
import Screenshot from "@/pages/Screenshot";
import Updater from "@/pages/Updater";
import Downloader from "@/pages/Downloader";

import Build from "@/pages/Build";
import WebAndroid from "@/pages/WebAndroid";
import Otimizacao from "@/pages/Otimizacao";
import DebugLint from "@/pages/DebugLint";
import IOS from "@/pages/iOS";
import ChromeOS from "@/pages/ChromeOS";
import RaspberryPi from "@/pages/RaspberryPi";
import IAP from "@/pages/IAP";
import Gestures from "@/pages/Gestures";

import Security from "@/pages/Security";
import EnvVars from "@/pages/EnvVars";
import SelfVoicing from "@/pages/SelfVoicing";
import DeveloperTools from "@/pages/DeveloperTools";
import DirectorTool from "@/pages/DirectorTool";
import AutomatedTesting from "@/pages/AutomatedTesting";
import TemplateProjects from "@/pages/TemplateProjects";
import CLI from "@/pages/CLI";
import EditorIntegration from "@/pages/EditorIntegration";
import Skins from "@/pages/Skins";

import ProjetoFinal from "@/pages/ProjetoFinal";
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
        <Route path="/multiple-dialogue" component={MultipleDialogue} />
        <Route path="/bubble" component={Bubble} />
        <Route path="/text-input" component={TextInput} />

        <Route path="/imagens" component={Imagens} />
        <Route path="/cenas" component={Cenas} />
        <Route path="/transicoes" component={Transicoes} />
        <Route path="/atl" component={ATL} />
        <Route path="/layered-images" component={LayeredImages} />
        <Route path="/displayables" component={Displayables} />
        <Route path="/transform-properties" component={TransformProperties} />
        <Route path="/matrixcolor" component={Matrixcolor} />
        <Route path="/stage-3d" component={Stage3D} />
        <Route path="/live2d" component={Live2D} />
        <Route path="/sprites" component={Sprites} />
        <Route path="/mouse-custom" component={MouseCustom} />

        <Route path="/text" component={Text} />
        <Route path="/text-shaders" component={TextShaders} />
        <Route path="/custom-text-tags" component={CustomTextTags} />
        <Route path="/character-callbacks" component={CharacterCallbacks} />

        <Route path="/audio" component={Audio} />
        <Route path="/voice" component={Voice} />
        <Route path="/audio-filters" component={AudioFilters} />
        <Route path="/movie" component={Movie} />
        <Route path="/splashscreen" component={Splashscreen} />

        <Route path="/variaveis" component={Variaveis} />
        <Route path="/condicionais" component={Condicionais} />
        <Route path="/menus" component={Menus} />
        <Route path="/saves" component={Saves} />
        <Route path="/store-variables" component={StoreVariables} />
        <Route path="/lifecycle" component={Lifecycle} />

        <Route path="/gui" component={GUI} />
        <Route path="/screens" component={Screens} />
        <Route path="/nvl" component={NVL} />
        <Route path="/side-images" component={SideImages} />
        <Route path="/styles" component={Styles} />
        <Route path="/style-properties" component={StyleProperties} />
        <Route path="/advanced-gui" component={AdvancedGUI} />
        <Route path="/configuracao" component={Configuracao} />
        <Route path="/preferencias" component={Preferencias} />
        <Route path="/screen-actions" component={ScreenActions} />
        <Route path="/screens-especiais" component={ScreensEspeciais} />
        <Route path="/screen-optimization" component={ScreenOptimization} />
        <Route path="/screens-python" component={ScreensPython} />
        <Route path="/keymap" component={Keymap} />
        <Route path="/dialogue-history" component={DialogueHistory} />
        <Route path="/rooms" component={Rooms} />
        <Route path="/drag-drop" component={DragDrop} />

        <Route path="/inventario" component={Inventario} />
        <Route path="/afeicao" component={Afeicao} />
        <Route path="/minigames" component={Minigames} />
        <Route path="/i18n" component={I18n} />
        <Route path="/achievements" component={Achievements} />

        <Route path="/statement-equivalents" component={StatementEquivalents} />
        <Route path="/cdd" component={CDD} />
        <Route path="/cds" component={CDS} />
        <Route path="/file-access" component={FileAccess} />
        <Route path="/color-class" component={ColorClass} />
        <Route path="/matrix-class" component={MatrixClass} />
        <Route path="/model-rendering" component={ModelRendering} />
        <Route path="/other-functions" component={OtherFunctions} />
        <Route path="/ren-py-files" component={RenPyFiles} />

        <Route path="/fetch" component={Fetch} />
        <Route path="/screenshot" component={Screenshot} />
        <Route path="/updater" component={Updater} />
        <Route path="/downloader" component={Downloader} />

        <Route path="/build" component={Build} />
        <Route path="/web-android" component={WebAndroid} />
        <Route path="/otimizacao" component={Otimizacao} />
        <Route path="/debug-lint" component={DebugLint} />
        <Route path="/ios" component={IOS} />
        <Route path="/chromeos" component={ChromeOS} />
        <Route path="/raspberry-pi" component={RaspberryPi} />
        <Route path="/iap" component={IAP} />
        <Route path="/gestures" component={Gestures} />

        <Route path="/security" component={Security} />
        <Route path="/env-vars" component={EnvVars} />
        <Route path="/self-voicing" component={SelfVoicing} />
        <Route path="/developer-tools" component={DeveloperTools} />
        <Route path="/director-tool" component={DirectorTool} />
        <Route path="/automated-testing" component={AutomatedTesting} />
        <Route path="/template-projects" component={TemplateProjects} />
        <Route path="/cli" component={CLI} />
        <Route path="/editor-integration" component={EditorIntegration} />
        <Route path="/skins" component={Skins} />

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
