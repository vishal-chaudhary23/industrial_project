import Navigation from "./components/layout/Navigation";
import Topbar from "./components/layout/Topbar";

import StatsGrid from "./components/dashboard/StatsGrid";

import ChatPanel from "./components/chat/ChatPanel";

export default function App() {
  return (
    <div className="flex h-screen bg-slate-950 text-white">

      <Navigation />

      <main className="flex-1 overflow-auto">

        <Topbar />

        <div className="p-8 space-y-8">

          <StatsGrid />

          <ChatPanel />

        </div>

      </main>

    </div>
  );
}